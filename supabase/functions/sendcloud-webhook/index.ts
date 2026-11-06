import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Sendcloud parcel status IDs:
// 1 = "not announced" (label created, not yet shipped)
// 2 = "ready to send"
// 3 = "announced"
// 4 = "en route to sorting centre"
// 5 = "at sorting centre"
// 6 = "delivered to pickup location" / "at service point"
// 7 = "announced at pickup point"
// 8 = "ready for pickup"
// 9 = "picked up by customer"
// 10 = "en route back to sender"
// 11 = "delivered"
// Source: https://docs.sendcloud.sc/docs/parcel-statuses

function mapStatus(parcelStatusId: number | undefined, statusMessage: string): {
  shippingStatus: string;
  deliveryStatus: string;
  emailType: "shipped" | "delivered" | null;
} {
  const statusLower = String(statusMessage).toLowerCase();
  const code = parcelStatusId;

  // Delivered / picked up
  if (code === 11 || statusLower.includes("delivered") || statusLower.includes("handed to customer")) {
    return { shippingStatus: "delivered", deliveryStatus: "delivered", emailType: "delivered" };
  }
  // At service point / ready for pickup
  if (code === 6 || code === 7 || code === 8 || code === 9 ||
      statusLower.includes("service point") || statusLower.includes("ready for pickup") ||
      statusLower.includes("picked up by customer") || statusLower.includes("at pickup")) {
    return { shippingStatus: "delivered", deliveryStatus: "delivered", emailType: "delivered" };
  }
  // In transit
  if (code === 3 || code === 4 || code === 5 ||
      statusLower.includes("announced") || statusLower.includes("en route") ||
      statusLower.includes("in transit") || statusLower.includes("sorting")) {
    return { shippingStatus: "in_transit", deliveryStatus: "shipped", emailType: "shipped" };
  }
  // Label created / not yet shipped
  if (code === 1 || code === 2 ||
      statusLower.includes("ready to send") || statusLower.includes("label created") ||
      statusLower.includes("not announced")) {
    return { shippingStatus: "label_created", deliveryStatus: "pending", emailType: null };
  }

  // Unknown status — don't change anything, just log
  return { shippingStatus: "", deliveryStatus: "", emailType: null };
}

async function sendEmail(
  resendApiKey: string,
  to: string,
  subject: string,
  html: string,
) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Natural Hair Market <noreply@naturalhairmarket.com>",
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    console.error("Resend error:", await res.text());
  }
  return res.ok;
}

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
    console.log("Sendcloud webhook received:", JSON.stringify(body).substring(0, 2000));

    // Sendcloud sends { action, parcel: {...} } for parcel status changes
    const action = body.action || "";
    const parcel = body.parcel || body;
    const parcelId = parcel.id;

    // Ignore integration/test events that have no parcel ID
    if (!parcelId) {
      console.log(`No parcel ID (action=${action}), ignoring`);
      return new Response(
        JSON.stringify({ success: true, message: "No parcel ID, ignored" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const statusMessage: string = parcel.status?.message || body.status_message || "";
    const statusCode: number | undefined = parcel.status?.id ?? body.status_id;

    console.log(`Parcel ID: ${parcelId} | Status code: ${statusCode} | Message: "${statusMessage}" | Action: ${action}`);

    const { shippingStatus, deliveryStatus, emailType } = mapStatus(statusCode, statusMessage);

    if (!shippingStatus) {
      console.log(`Unrecognized status (code=${statusCode}, msg="${statusMessage}"), skipping`);
      return new Response(
        JSON.stringify({ success: true, message: "Unrecognized status, skipped" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Find the transaction by sendcloud_parcel_id
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .select(`
        id, buyer_id, seller_id, shipping_status, delivery_status,
        tracking_number, shipping_label_tracking_number,
        relay_point_name, relay_point_address,
        shipped_at, delivered_at,
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

    // Idempotency: skip if the status hasn't changed
    if (transaction.shipping_status === shippingStatus && transaction.delivery_status === deliveryStatus) {
      console.log(`Transaction ${transaction.id} already at ${shippingStatus}/${deliveryStatus}, skipping (idempotent)`);
      return new Response(
        JSON.stringify({ success: true, message: "Status unchanged, skipped" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Build update — only set timestamps on transitions, never overwrite existing ones
    const updateData: Record<string, any> = {
      shipping_status: shippingStatus,
      delivery_status: deliveryStatus,
    };

    const now = new Date().toISOString();
    if (shippingStatus === "delivered" && !transaction.delivered_at) {
      updateData.delivered_at = now;
    }
    if ((shippingStatus === "in_transit" || shippingStatus === "shipped") && !transaction.shipped_at) {
      updateData.shipped_at = now;
    }

    // Save tracking number if we don't have it yet
    const parcelTracking = parcel.tracking_number;
    if (parcelTracking && !transaction.tracking_number) {
      updateData.tracking_number = parcelTracking;
      updateData.shipping_label_tracking_number = parcelTracking;
    }

    const { error: updateError } = await supabase
      .from("transactions")
      .update(updateData)
      .eq("id", transaction.id);

    if (updateError) {
      console.error("Failed to update transaction:", updateError.message);
    } else {
      console.log(`Updated transaction ${transaction.id} to shipping_status=${shippingStatus}, delivery_status=${deliveryStatus}`);
    }

    // Send email notification to buyer (only on status transitions, idempotency already checked above)
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
          const trackNum = transaction.shipping_label_tracking_number || transaction.tracking_number || parcelTracking;

          const trackingUrl = trackNum
            ? isRelay
              ? `https://www.mondialrelay.fr/suivi-de-colis/?numeroExpedition=${trackNum}`
              : `https://tracking.sendcloud.sc/forward?carrier=&tracking_number=${trackNum}`
            : null;

          const emailBrandHeader = `
            <div style="background:#059669;padding:28px 32px;">
              <h1 style="color:#fff;margin:0;font-size:22px;">Natural Hair Market</h1>
            </div>`;
          const emailFooter = `
            <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                Natural Hair Market · La marketplace de référence pour la vente de cheveux naturels
              </p>
            </div>`;
          const articleBlock = `
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:24px 0;">
              <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Article</p>
              <p style="margin:0;font-size:18px;font-weight:700;color:#1f2937;">${listingTitle}</p>
            </div>`;
          const relayBlock = (isRelay && (transaction.relay_point_name || transaction.relay_point_address))
            ? `<div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;padding:20px;margin:24px 0;">
                <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Votre point relais</p>
                <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1f2937;">${transaction.relay_point_name || ""}</p>
                <p style="margin:0;font-size:14px;color:#6b7280;">${transaction.relay_point_address || ""}</p>
              </div>`
            : "";
          const trackingBlock = trackNum
            ? `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;margin:24px 0;">
                <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Numéro de suivi</p>
                <p style="margin:0 0 16px;font-size:20px;font-weight:900;color:#1e40af;font-family:monospace;">${trackNum}</p>
                ${trackingUrl ? `<a href="${trackingUrl}" target="_blank" style="display:inline-block;background:#2563eb;color:#fff;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:15px;">Suivre mon colis</a>` : ""}
              </div>`
            : "";
          const profileButton = `
            <div style="text-align:center;margin:32px 0;">
              <a href="${frontendUrl}/profile" target="_blank"
                 style="display:inline-block;background:#059669;color:#fff;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;">
                Voir mes commandes
              </a>
            </div>`;

          if (emailType === "shipped") {
            const subject = `Votre colis est en cours d'acheminement — ${listingTitle}`;
            const html = `
              <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;">
                ${emailBrandHeader}
                <div style="padding:32px;">
                  <h2 style="color:#1f2937;margin-top:0;">Bonjour ${buyerName},</h2>
                  <p style="color:#374151;line-height:1.6;">
                    Votre colis est <strong style="color:#059669;">en cours d'acheminement</strong>.
                    ${isRelay ? "Il sera disponible dans votre point relais sous 2 à 4 jours ouvrés." : "Il sera livré à votre adresse sous 2 à 5 jours ouvrés."}
                  </p>
                  ${articleBlock}
                  ${relayBlock}
                  ${trackingBlock}
                  ${profileButton}
                  <p style="color:#6b7280;font-size:13px;margin-top:32px;">
                    Pour toute question : <a href="mailto:naturalhairmarket@gmail.com" style="color:#059669;">naturalhairmarket@gmail.com</a>
                  </p>
                </div>
                ${emailFooter}
              </div>`;
            await sendEmail(resendApiKey, buyer.email, subject, html);
            console.log(`Shipped/transit email sent to ${buyer.email}`);

          } else if (emailType === "delivered") {
            const subject = isRelay
              ? `Votre colis est disponible en point relais — ${listingTitle}`
              : `Votre colis a été livré — ${listingTitle}`;
            const html = `
              <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;">
                ${emailBrandHeader}
                <div style="padding:32px;">
                  <h2 style="color:#1f2937;margin-top:0;">Bonjour ${buyerName},</h2>
                  <p style="color:#374151;line-height:1.6;">
                    ${isRelay
                      ? `Votre colis est <strong style="color:#059669;">disponible dans votre point relais</strong> ! Vous pouvez venir le récupérer.`
                      : `Votre colis a été <strong style="color:#059669;">livré</strong>.`}
                  </p>
                  ${articleBlock}
                  ${relayBlock}
                  ${trackingBlock}
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
                ${emailFooter}
              </div>`;
            await sendEmail(resendApiKey, buyer.email, subject, html);
            console.log(`Delivered email sent to ${buyer.email}`);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, shippingStatus, deliveryStatus, emailType }),
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
