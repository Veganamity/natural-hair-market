import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Security: only callable with the service role key (cron / admin), never public.
  const authHeader = req.headers.get("Authorization") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const providedKey = authHeader.replace("Bearer ", "");

  if (!providedKey || providedKey !== serviceKey) {
    return new Response(
      JSON.stringify({ error: "Unauthorized — service role key required" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    serviceKey
  );

  const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeSecretKey) {
    return new Response(
      JSON.stringify({ error: "STRIPE_SECRET_KEY not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-12-18.acacia" });

  const now = new Date();
  const within24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const results: { captured: string[]; cancelled: string[]; errors: string[] } = {
    captured: [],
    cancelled: [],
    errors: [],
  };

  try {
    // Find transactions whose authorization expires within 24h
    const { data: expiring, error } = await supabase
      .from("transactions")
      .select(`
        id, listing_id, buyer_id, seller_id, stripe_payment_intent_id,
        status, delivery_status, capture_method, authorization_expires_at,
        listing:listings(title),
        buyer:profiles!transactions_buyer_id_fkey(email, full_name),
        seller:profiles!transactions_seller_id_fkey(email, full_name)
      `)
      .eq("capture_method", "manual")
      .in("status", ["pending", "processing"])
      .not("authorization_expires_at", "is", null)
      .lte("authorization_expires_at", within24h.toISOString())
      .gt("authorization_expires_at", now.toISOString());

    if (error) throw error;
    if (!expiring || expiring.length === 0) {
      return new Response(
        JSON.stringify({ message: "No expiring authorizations found", results }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    for (const tx of expiring) {
      try {
        const isShipped = tx.delivery_status === "shipped";

        if (isShipped) {
          // Seller shipped → capture the payment to protect the seller
          const pi = await stripe.paymentIntents.retrieve(tx.stripe_payment_intent_id);
          if (pi.status === "requires_capture") {
            await stripe.paymentIntents.capture(tx.stripe_payment_intent_id);
          }

          await supabase
            .from("transactions")
            .update({
              status: "completed",
              delivery_status: "delivered",
              captured_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", tx.id);

          if (tx.listing_id) {
            await supabase
              .from("listings")
              .update({ status: "sold" })
              .eq("id", tx.listing_id);
          }

          await sendNotificationEmails(supabase, tx, "captured");
          results.captured.push(tx.id);
        } else {
          // Seller did NOT ship → cancel the payment, refund buyer, relist
          const pi = await stripe.paymentIntents.retrieve(tx.stripe_payment_intent_id);
          if (pi.status === "requires_capture" || pi.status === "requires_payment_method") {
            await stripe.paymentIntents.cancel(tx.stripe_payment_intent_id, {
              cancellation_reason: "abandoned",
            });
          } else if (pi.status === "succeeded") {
            await stripe.refunds.create({
              payment_intent: tx.stripe_payment_intent_id,
              reason: "failed_transaction",
            });
          }

          await supabase
            .from("transactions")
            .update({
              status: "cancelled",
              delivery_status: "cancelled",
              cancelled_at: new Date().toISOString(),
              auto_cancelled_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", tx.id);

          if (tx.listing_id) {
            await supabase
              .from("listings")
              .update({ status: "active" })
              .eq("id", tx.listing_id);
          }

          await sendNotificationEmails(supabase, tx, "cancelled");
          results.cancelled.push(tx.id);
        }
      } catch (txErr: any) {
        console.error(`Error processing transaction ${tx.id}:`, txErr?.message);
        results.errors.push(`${tx.id}: ${txErr?.message || "unknown error"}`);
      }
    }

    return new Response(
      JSON.stringify({ message: "Processed expiring authorizations", results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("capture-expiring-payments error:", message);
    return new Response(
      JSON.stringify({ error: message, results }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function sendNotificationEmails(
  supabase: ReturnType<typeof createClient>,
  tx: any,
  type: "captured" | "cancelled"
): Promise<void> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) return;

  const listingTitle = tx.listing?.title ?? "votre annonce";
  const buyerEmail = tx.buyer?.email;
  const sellerEmail = tx.seller?.email;
  const buyerName = tx.buyer?.full_name ?? "Acheteur";
  const sellerName = tx.seller?.full_name ?? "Vendeur";

  const emails: { to: string; subject: string; html: string }[] = [];

  if (type === "captured") {
    if (buyerEmail) {
      emails.push({
        to: buyerEmail,
        subject: "Paiement finalisé automatiquement — Natural Hair Market",
        html: buildEmail("captured_buyer", buyerName, listingTitle),
      });
    }
    if (sellerEmail) {
      emails.push({
        to: sellerEmail,
        subject: "Paiement reçu — Natural Hair Market",
        html: buildEmail("captured_seller", sellerName, listingTitle),
      });
    }
  } else {
    if (buyerEmail) {
      emails.push({
        to: buyerEmail,
        subject: "Commande annulée et remboursée — Natural Hair Market",
        html: buildEmail("cancelled_buyer", buyerName, listingTitle),
      });
    }
    if (sellerEmail) {
      emails.push({
        to: sellerEmail,
        subject: "Commande annulée — Natural Hair Market",
        html: buildEmail("cancelled_seller", sellerName, listingTitle),
      });
    }
  }

  for (const email of emails) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Natural Hair Market <noreply@naturalhairmarket.com>",
          to: [email.to],
          subject: email.subject,
          html: email.html,
        }),
      });
    } catch (e) {
      console.error("Failed to send email:", e);
    }
  }
}

function buildEmail(
  type: "captured_buyer" | "captured_seller" | "cancelled_buyer" | "cancelled_seller",
  name: string,
  listingTitle: string
): string {
  const header = (color: string) => `
    <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;">
      <div style="background:${color};padding:28px 32px;">
        <h1 style="color:#fff;margin:0;font-size:22px;">Natural Hair Market</h1>
      </div>
      <div style="padding:32px;">`;
  const footer = `
      <p style="color:#6b7280;font-size:13px;margin-top:32px;">Pour toute question : <a href="mailto:naturalhairmarket@gmail.com" style="color:#059669;">naturalhairmarket@gmail.com</a></p>
    </div>
    <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">Natural Hair Market · La marketplace de référence pour la vente de cheveux naturels</p>
    </div>
  </div>`;

  if (type === "captured_buyer") {
    return `${header("#059669")}
      <h2 style="color:#1f2937;margin-top:0;">Bonjour ${name},</h2>
      <p style="color:#374151;line-height:1.6;">Le délai de confirmation de réception pour votre commande <strong>« ${listingTitle} »</strong> est arrivé à échéance. Conformément à nos conditions, le paiement a été <strong style="color:#059669;">automatiquement finalisé</strong> et transféré au vendeur.</p>
      <p style="color:#374151;line-height:1.6;">Si vous n'avez pas reçu votre colis, vous pouvez ouvrir un litige depuis votre espace commande pour signaler le problème à notre équipe.</p>
      ${footer}`;
  }
  if (type === "captured_seller") {
    return `${header("#059669")}
      <h2 style="color:#1f2937;margin-top:0;">Bonjour ${name},</h2>
      <p style="color:#374151;line-height:1.6;">Le délai de confirmation de réception pour votre vente <strong>« ${listingTitle} »</strong> est arrivé à échéance. Le paiement a été <strong style="color:#059669;">automatiquement capturé</strong> et les fonds seront versés sur votre compte Stripe selon votre configuration de versement.</p>
      ${footer}`;
  }
  if (type === "cancelled_buyer") {
    return `${header("#dc2626")}
      <h2 style="color:#1f2937;margin-top:0;">Bonjour ${name},</h2>
      <p style="color:#374151;line-height:1.6;">Le vendeur n'a pas expédié votre commande <strong>« ${listingTitle} »</strong> dans les délais impartis. La transaction a été <strong style="color:#dc2626;">annulée</strong> et votre paiement sera <strong style="color:#dc2626;">remboursé</strong> sous 5 à 10 jours ouvrés.</p>
      ${footer}`;
  }
  // cancelled_seller
  return `${header("#dc2626")}
    <h2 style="color:#1f2937;margin-top:0;">Bonjour ${name},</h2>
    <p style="color:#374151;line-height:1.6;">Votre commande <strong>« ${listingTitle} »</strong> a été <strong style="color:#dc2626;">annulée</strong> car le colis n'a pas été expédié dans les délais impartis. L'acheteur a été remboursé et l'annonce a été remise en ligne.</p>
    ${footer}`;
}
