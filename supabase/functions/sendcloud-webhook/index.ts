import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = await req.json();
    console.log("Sendcloud webhook received:", JSON.stringify(body).substring(0, 1000));

    // Sendcloud sends either { parcel: {...} } or { action: "...", parcel: {...} }
    const parcel = body.parcel || body;
    const parcelId = parcel.id;
    const statusMessage = parcel.status?.message || body.status_message || "";
    const statusCode = parcel.status?.id || body.status_id;

    if (!parcelId) {
      console.log("No parcel ID in webhook, ignoring");
      return new Response(
        JSON.stringify({ success: true, message: "No parcel ID" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Map Sendcloud status to our shipping_status
    // https://docs.sendcloud.sc/docs/parcel-statuses
    let shippingStatus = "shipped";
    let deliveryStatus = "shipped";
    let emailType: "shipped" | "delivered" | null = null;

    const statusLower = String(statusMessage).toLowerCase();
    if (statusLower.includes("delivered") || statusLower.includes("handed to customer") || statusCode === 11) {
      shippingStatus = "delivered";
      deliveryStatus = "delivered";
      emailType = "delivered";
    } else if (statusLower.includes("at service point") || statusLower.includes("ready for pickup") || statusCode === 8) {
      shippingStatus = "delivered";
      deliveryStatus = "delivered";
      emailType = "delivered";
    } else if (statusLower.includes("announced") || statusLower.includes("en route") || statusLower.includes("in transit") || statusCode === 3 || statusCode === 4 || statusCode === 5 || statusCode === 6) {
      shippingStatus = "in_transit";
      deliveryStatus = "shipped";
      emailType = "shipped";
    } else if (statusLower.includes("ready to send") || statusLower.includes("label created") || statusCode === 1 || statusCode === 2) {
      shippingStatus = "label_created";
      deliveryStatus = "pending";
    }

    // Find the transaction by sendcloud_parcel_id
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .select(`
        id, buyer_id, seller_id, shipping_status, delivery_status,
        tracking_number, shipping_label_tracking_number,
        relay_point_name, relay_point_address,
        listing:listings(title)
      `)
      .eq("sendcloud_parcel_id", String(parcelId))
      .maybeSingle();

    if (txError || !transaction) {
      console.log("Transaction not found for parcel ID:", parcelId);
      return new Response(
        JSON.stringify({ success: true, message: "Transaction not found for this parcel" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Update the transaction status
    const updateData: Record<string, any> = {
      shipping_status: shippingStatus,
      delivery_status: deliveryStatus,
    };
    if (shippingStatus === "delivered") {
      updateData.delivered_at = new Date().toISOString();
    } else if (shippingStatus === "in_transit" || shippingStatus === "label_created") {
      updateData.shipped_at = updateData.shipped_at || new Date().toISOString();
    }

    const trackingNumber = parcel.tracking_number || transaction.tracking_number;
    if (trackingNumber && !transaction.tracking_number) {
      updateData.tracking_number = trackingNumber;
      updateData.shipping_label_tracking_number = trackingNumber;
    }

    await supabase
      .from("transactions")
      .update(updateData)
      .eq("id", transaction.id);

    console.log(`Updated transaction ${transaction.id} to shipping_status=${shippingStatus}, delivery_status=${deliveryStatus}`);

    // Send email notification to buyer if needed
    if (emailType) {
      const { data: buyer } = await supabase
        .from("profiles")
        .select("email, full_name, first_name")
        .eq("id", transaction.buyer_id)
        .maybeSingle();

      if (buyer?.email) {
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        if (resendApiKey) {
          const buyerName = buyer.first_name || buyer.full_name || "acheteur";
          const listing = transaction.listing as any;
          const listingTitle = listing?.title || "votre article";
          const isRelay = !!transaction.relay_point_name;
          const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://naturalhairmarket.com";
          const trackNum = transaction.shipping_label_tracking_number || transaction.tracking_number || trackingNumber;

          const trackingUrl = trackNum
            ? isRelay
              ? `https://www.mondialrelay.fr/suivi-de-colis/?numeroExpedition=${trackNum}`
              : `https://tracking.sendcloud.sc/forward?carrier=&tracking_number=${trackNum}`
            : null;

          if (emailType === "delivered") {
            const subject = isRelay
              ? `Votre colis est disponible en point relais — ${listingTitle}`
              : `Votre colis a été livré — ${listingTitle}`;

            const deliveredHtml = `
              <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;">
                <div style="background:#059669;padding:28px 32px;">
                  <h1 style="color:#fff;margin:0;font-size:22px;">Natural Hair Market</h1>
                </div>
                <div style="padding:32px;">
                  <h2 style="color:#1f2937;margin-top:0;">Bonjour ${buyerName},</h2>
                  <p style="color:#374151;line-height:1.6;">
                    ${isRelay
                      ? `Votre colis est <strong style="color:#059669;">disponible dans votre point relais</strong> ! Vous pouvez venir le récupérer.`
                      : `Votre colis a été <strong style="color:#059669;">livré</strong>.`}
                  </p>
                  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:24px 0;">
                    <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Article</p>
                    <p style="margin:0;font-size:18px;font-weight:700;color:#1f2937;">${listingTitle}</p>
                  </div>
                  ${isRelay && (transaction.relay_point_name || transaction.relay_point_address)
                    ? `<div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;padding:20px;margin:24px 0;">
                        <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Votre point relais</p>
                        <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1f2937;">${transaction.relay_point_name || ""}</p>
                        <p style="margin:0;font-size:14px;color:#6b7280;">${transaction.relay_point_address || ""}</p>
                      </div>`
                    : ""}
                  ${trackNum
                    ? `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;margin:24px 0;">
                        <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Numéro de suivi</p>
                        <p style="margin:0 0 16px;font-size:20px;font-weight:900;color:#1e40af;font-family:monospace;">${trackNum}</p>
                        ${trackingUrl ? `<a href="${trackingUrl}" target="_blank" style="display:inline-block;background:#2563eb;color:#fff;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:15px;">Suivre mon colis</a>` : ""}
                      </div>`
                    : ""}
                  <div style="text-align:center;margin:32px 0;">
                    <a href="${frontendUrl}/profile" target="_blank"
                       style="display:inline-block;background:#059669;color:#fff;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;">
                      Confirmer la réception
                    </a>
                  </div>
                  <p style="color:#374151;line-height:1.6;">
                    ${isRelay
                      ? "Pensez à apporter une pièce d'identité lors du retrait. Une fois le colis récupéré, <strong>confirmez la réception</strong> dans votre espace pour finaliser la transaction et libérer le paiement au vendeur."
                      : "Une fois le colis vérifié, <strong>confirmez la réception</strong> dans votre espace pour finaliser la transaction et libérer le paiement au vendeur."}
                  </p>
                  <p style="color:#6b7280;font-size:13px;margin-top:32px;">
                    Pour toute question : <a href="mailto:naturalhairmarket@gmail.com" style="color:#059669;">naturalhairmarket@gmail.com</a>
                  </p>
                </div>
                <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
                  <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                    Natural Hair Market · La marketplace de référence pour la vente de cheveux naturels
                  </p>
                </div>
              </div>
            `;

            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "Natural Hair Market <noreply@naturalhairmarket.com>",
                to: [buyer.email],
                subject,
                html: deliveredHtml,
              }),
            });
            console.log(`Delivered email sent to ${buyer.email}`);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Sendcloud webhook error:", String(err));
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
