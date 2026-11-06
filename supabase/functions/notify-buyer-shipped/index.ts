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

    const { transactionId }: { transactionId: string } = await req.json();

    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: "Transaction ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .select(`
        id, tracking_number, shipping_label_tracking_number,
        shipping_method, relay_point_name, relay_point_address,
        shipping_status, delivery_status,
        buyer_id, listing:listings(title)
      `)
      .eq("id", transactionId)
      .maybeSingle();

    if (txError || !transaction) {
      return new Response(
        JSON.stringify({ error: "Transaction introuvable" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: buyer } = await supabase
      .from("profiles")
      .select("email, full_name, first_name")
      .eq("id", transaction.buyer_id)
      .maybeSingle();

    if (!buyer || !buyer.email) {
      return new Response(
        JSON.stringify({ success: true, message: "Acheteur sans email" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ success: true, message: "Email non configure" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const buyerName = buyer.first_name || buyer.full_name || "acheteur";
    const listing = transaction.listing as any;
    const listingTitle = listing?.title || "votre article";
    const trackingNumber = transaction.shipping_label_tracking_number || transaction.tracking_number;
    const isMondialRelay = transaction.shipping_method === "mondial_relay" || !!transaction.relay_point_name;
    const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://naturalhairmarket.com";

    const trackingUrl = trackingNumber
      ? isMondialRelay
        ? `https://www.mondialrelay.fr/suivi-de-colis/?numeroExpedition=${trackingNumber}`
        : `https://tracking.sendcloud.sc/forward?carrier=&tracking_number=${trackingNumber}`
      : null;

    const relayBlock = (transaction.relay_point_name || transaction.relay_point_address)
      ? `
        <div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;padding:20px;margin:24px 0;">
          <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Votre point relais</p>
          <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1f2937;">${transaction.relay_point_name || ""}</p>
          <p style="margin:0;font-size:14px;color:#6b7280;">${transaction.relay_point_address || ""}</p>
        </div>`
      : "";

    const trackingBlock = trackingNumber
      ? `
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;margin:24px 0;">
          <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Numéro de suivi</p>
          <p style="margin:0 0 16px;font-size:20px;font-weight:900;color:#1e40af;font-family:monospace;">${trackingNumber}</p>
          ${trackingUrl ? `<a href="${trackingUrl}" target="_blank" style="display:inline-block;background:#2563eb;color:#fff;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:15px;">Suivre mon colis</a>` : ""}
        </div>`
      : "";

    const subject = `Votre colis a été expédié — ${listingTitle}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;">
        <div style="background:#059669;padding:28px 32px;">
          <h1 style="color:#fff;margin:0;font-size:22px;">Natural Hair Market</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#1f2937;margin-top:0;">Bonjour ${buyerName},</h2>
          <p style="color:#374151;line-height:1.6;">
            Bonne nouvelle ! Le vendeur a <strong style="color:#059669;">expédié votre colis</strong>.
          </p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Article</p>
            <p style="margin:0;font-size:18px;font-weight:700;color:#1f2937;">${listingTitle}</p>
          </div>
          ${relayBlock}
          ${trackingBlock}
          <div style="text-align:center;margin:32px 0;">
            <a href="${frontendUrl}/profile" target="_blank"
               style="display:inline-block;background:#059669;color:#fff;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;">
              Voir mes commandes
            </a>
          </div>
          <p style="color:#374151;line-height:1.6;">
            Vous pouvez suivre l'acheminement de votre colis avec le numéro de suivi ci-dessus.
            ${isMondialRelay ? "Il sera disponible dans votre point relais sous 2 à 4 jours ouvrés. Vous recevrez une notification quand il sera disponible pour retrait." : "Il sera livré à votre adresse sous 2 à 5 jours ouvrés."}
          </p>
          <p style="color:#374151;line-height:1.6;">
            Une fois le colis reçu, n'oubliez pas de <strong>confirmer la réception</strong> dans votre espace pour finaliser la transaction.
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

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Natural Hair Market <noreply@naturalhairmarket.com>",
        to: [buyer.email as string],
        subject,
        html,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Resend error:", errText);
      return new Response(
        JSON.stringify({ error: errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
