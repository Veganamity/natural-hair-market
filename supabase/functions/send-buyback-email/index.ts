import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type EmailType = "accepted" | "label_sent" | "cancelled";

function buildEmail(
  type: EmailType,
  req: Record<string, unknown>,
): { subject: string; html: string } {
  const name = `${req.first_name} ${req.last_name}`;
  const priceStr = req.exact_price != null
    ? `${(req.exact_price as number).toFixed(2)} €`
    : (req.calculated_price as string | null) ?? "à confirmer";

  if (type === "accepted") {
    return {
      subject: "Votre demande de rachat de cheveux a été acceptée — Natural Hair Market",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;">
          <div style="background:#059669;padding:28px 32px;">
            <h1 style="color:#fff;margin:0;font-size:22px;">Natural Hair Market</h1>
          </div>
          <div style="padding:32px;">
            <h2 style="color:#1f2937;margin-top:0;">Bonjour ${name},</h2>
            <p style="color:#374151;line-height:1.6;">Bonne nouvelle ! Votre demande de rachat de cheveux a été <strong style="color:#059669;">acceptée</strong> par notre équipe.</p>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:24px 0;">
              <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Estimation de rachat</p>
              <p style="margin:0;font-size:28px;font-weight:900;color:#059669;">${priceStr}</p>
            </div>
            <p style="color:#374151;line-height:1.6;">
              <strong>Prochaine étape :</strong> Notre équipe prépare votre étiquette d'expédition prépayée et vous l'enverra très prochainement par email. Ne nous envoyez pas encore vos cheveux — attendez de recevoir l'étiquette.
            </p>
            <p style="color:#374151;line-height:1.6;">Une fois vos cheveux reçus et vérifiés, le virement bancaire sera effectué sous <strong>5 jours ouvrables</strong> sur votre IBAN.</p>
            <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;margin-top:24px;">
              <p style="margin:0;font-size:13px;color:#92400e;"><strong>Rappel :</strong> Préparez bien votre mèche : lavée, séchée au sèche-cheveux, tressée et mise en sac congélation. Longueur minimale 15 cm.</p>
            </div>
            <p style="color:#6b7280;font-size:13px;margin-top:32px;">Pour toute question : <a href="mailto:naturalhairmarket@gmail.com" style="color:#059669;">naturalhairmarket@gmail.com</a></p>
          </div>
          <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">Natural Hair Market · La marketplace de référence pour la vente de cheveux naturels</p>
          </div>
        </div>
      `,
    };
  }

  if (type === "label_sent") {
    const labelUrl = req.shipping_label_url as string | null;
    return {
      subject: "Votre étiquette d'expédition est prête — Natural Hair Market",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;">
          <div style="background:#059669;padding:28px 32px;">
            <h1 style="color:#fff;margin:0;font-size:22px;">Natural Hair Market</h1>
          </div>
          <div style="padding:32px;">
            <h2 style="color:#1f2937;margin-top:0;">Bonjour ${name},</h2>
            <p style="color:#374151;line-height:1.6;">Votre étiquette d'expédition prépayée est disponible. Vous pouvez maintenant envoyer vos cheveux !</p>
            ${labelUrl ? `
            <div style="text-align:center;margin:32px 0;">
              <a href="${labelUrl}" target="_blank"
                 style="display:inline-block;background:#059669;color:#fff;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;">
                Télécharger mon étiquette d'expédition
              </a>
            </div>
            <p style="color:#6b7280;font-size:13px;text-align:center;">Si le bouton ne fonctionne pas, copiez ce lien : <a href="${labelUrl}" style="color:#059669;">${labelUrl}</a></p>
            ` : `<p style="color:#374151;">L'étiquette vous sera communiquée prochainement. Restez attentif à vos emails.</p>`}
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:24px 0;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#065f46;">Instructions d'expédition</p>
              <ol style="margin:0;padding-left:20px;color:#374151;font-size:14px;line-height:1.8;">
                <li>Imprimez l'étiquette et collez-la sur votre colis.</li>
                <li>Déposez le colis dans un bureau de poste ou point relais.</li>
                <li>Conservez le numéro de suivi.</li>
              </ol>
            </div>
            <p style="color:#374151;line-height:1.6;">Estimation de rachat : <strong style="color:#059669;">${priceStr}</strong></p>
            <p style="color:#374151;line-height:1.6;">Le virement sera effectué sous <strong>5 jours ouvrables</strong> après réception et vérification.</p>
            <p style="color:#6b7280;font-size:13px;margin-top:32px;">Pour toute question : <a href="mailto:naturalhairmarket@gmail.com" style="color:#059669;">naturalhairmarket@gmail.com</a></p>
          </div>
          <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">Natural Hair Market · La marketplace de référence pour la vente de cheveux naturels</p>
          </div>
        </div>
      `,
    };
  }

  // cancelled
  const reason = (req.cancellation_reason as string | null) ?? "";
  return {
    subject: "Mise à jour de votre demande de rachat — Natural Hair Market",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;">
        <div style="background:#dc2626;padding:28px 32px;">
          <h1 style="color:#fff;margin:0;font-size:22px;">Natural Hair Market</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#1f2937;margin-top:0;">Bonjour ${name},</h2>
          <p style="color:#374151;line-height:1.6;">Nous vous informons que votre demande de rachat de cheveux, précédemment acceptée, a dû être <strong style="color:#dc2626;">annulée</strong> par notre équipe. Nous nous en excusons sincèrement.</p>
          ${reason ? `
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#991b1b;">Motif de l'annulation</p>
            <p style="margin:0;color:#374151;">${reason}</p>
          </div>
          ` : ""}
          <p style="color:#374151;line-height:1.6;">Si vous souhaitez soumettre une nouvelle demande ou obtenir plus d'informations, n'hésitez pas à nous contacter ou à déposer une nouvelle annonce sur notre marketplace.</p>
          <p style="color:#6b7280;font-size:13px;margin-top:32px;">Pour toute question : <a href="mailto:naturalhairmarket@gmail.com" style="color:#059669;">naturalhairmarket@gmail.com</a></p>
        </div>
        <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">Natural Hair Market · La marketplace de référence pour la vente de cheveux naturels</p>
        </div>
      </div>
    `,
  };
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

    const { request_id, email_type }: { request_id: string; email_type: EmailType } =
      await req.json();

    const { data: buyback, error } = await supabase
      .from("hair_buyback_requests")
      .select("*")
      .eq("id", request_id)
      .single();

    if (error || !buyback) {
      return new Response(
        JSON.stringify({ error: "Demande introuvable" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { subject, html } = buildEmail(email_type, buyback);

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Natural Hair Market <noreply@naturalhairmarket.com>",
        to: [buyback.email as string],
        subject,
        html,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      return new Response(
        JSON.stringify({ error: errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (email_type === "label_sent") {
      await supabase
        .from("hair_buyback_requests")
        .update({ label_sent_at: new Date().toISOString() })
        .eq("id", request_id);
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
