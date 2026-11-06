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

    const { listing_id, offer_amount }: { listing_id: string; offer_amount: number } =
      await req.json();

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, title, price, seller_id")
      .eq("id", listing_id)
      .single();

    if (listingError || !listing) {
      return new Response(
        JSON.stringify({ error: "Annonce introuvable" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: seller } = await supabase
      .from("profiles")
      .select("email, full_name, first_name")
      .eq("id", listing.seller_id)
      .maybeSingle();

    if (!seller || !seller.email) {
      return new Response(
        JSON.stringify({ success: true, message: "Vendeur sans email" }),
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

    const sellerName = seller.first_name || seller.full_name || "vendeur";
    const offerStr = `${offer_amount.toFixed(2)} €`;
    const priceStr = `${Number(listing.price).toFixed(2)} €`;
    const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://naturalhairmarket.com";

    const subject = `Nouvelle offre reçue pour "${listing.title}" — Natural Hair Market`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;">
        <div style="background:#059669;padding:28px 32px;">
          <h1 style="color:#fff;margin:0;font-size:22px;">Natural Hair Market</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#1f2937;margin-top:0;">Bonjour ${sellerName},</h2>
          <p style="color:#374151;line-height:1.6;">
            Vous avez reçu une <strong style="color:#059669;">nouvelle offre</strong> pour votre annonce.
          </p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Annonce</p>
            <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#1f2937;">${listing.title}</p>
            <div style="display:flex;gap:24px;">
              <div>
                <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">Prix demandé</p>
                <p style="margin:0;font-size:20px;font-weight:900;color:#6b7280;">${priceStr}</p>
              </div>
              <div>
                <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">Offre reçue</p>
                <p style="margin:0;font-size:20px;font-weight:900;color:#059669;">${offerStr}</p>
              </div>
            </div>
          </div>
          <div style="text-align:center;margin:32px 0;">
            <a href="${frontendUrl}/profile" target="_blank"
               style="display:inline-block;background:#059669;color:#fff;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;">
              Voir mes offres
            </a>
          </div>
          <p style="color:#374151;line-height:1.6;">
            Connectez-vous à votre espace pour <strong>accepter</strong> ou <strong>refuser</strong> cette offre.
            Vous pouvez également retrouver toutes vos offres dans la section « Mes Offres » de votre profil.
          </p>
          <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;margin-top:24px;">
            <p style="margin:0;font-size:13px;color:#92400e;">
              <strong>Rappel :</strong> pour recevoir des paiements, assurez-vous d'avoir configuré vos informations bancaires dans votre profil.
            </p>
          </div>
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
        to: [seller.email as string],
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
