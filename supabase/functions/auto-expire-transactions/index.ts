import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Délai après expédition avant libération automatique des fonds (jours)
const DELIVERY_AUTO_RELEASE_DAYS = 14;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-12-18.acacia" });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date().toISOString();
    const results = { cancelled: 0, released: 0, errors: [] as string[] };

    // 1. Annuler les transactions dont la deadline d'expédition est dépassée
    const { data: expiredShipping } = await supabase
      .from("transactions")
      .select("id, stripe_payment_intent_id, listing_id")
      .in("status", ["pending", "processing"])
      .eq("delivery_status", "pending")
      .not("shipping_deadline_at", "is", null)
      .lt("shipping_deadline_at", now);

    for (const tx of expiredShipping || []) {
      try {
        if (tx.stripe_payment_intent_id) {
          const pi = await stripe.paymentIntents.retrieve(tx.stripe_payment_intent_id);
          if (
            pi.status === "requires_capture" ||
            pi.status === "requires_payment_method" ||
            pi.status === "requires_confirmation" ||
            pi.status === "requires_action" ||
            pi.status === "processing"
          ) {
            await stripe.paymentIntents.cancel(tx.stripe_payment_intent_id, {
              cancellation_reason: "abandoned",
            });
          }
        }

        await supabase
          .from("transactions")
          .update({
            status: "refunded",
            delivery_status: "cancelled",
            cancelled_at: now,
            auto_cancelled_at: now,
            updated_at: now,
          })
          .eq("id", tx.id);

        if (tx.listing_id) {
          await supabase
            .from("listings")
            .update({ status: "active" })
            .eq("id", tx.listing_id);
        }

        results.cancelled++;
      } catch (err: any) {
        results.errors.push(`TX ${tx.id}: ${err.message}`);
      }
    }

    // 2. Libérer automatiquement les fonds si l'acheteur n'a pas confirmé sous 14 jours après expédition
    const autoReleaseDate = new Date();
    autoReleaseDate.setDate(autoReleaseDate.getDate() - DELIVERY_AUTO_RELEASE_DAYS);

    const { data: pendingDelivery } = await supabase
      .from("transactions")
      .select("id, stripe_payment_intent_id, listing_id")
      .in("status", ["pending", "processing"])
      .eq("delivery_status", "shipped")
      .not("shipped_at", "is", null)
      .lt("shipped_at", autoReleaseDate.toISOString());

    for (const tx of pendingDelivery || []) {
      try {
        if (tx.stripe_payment_intent_id) {
          const pi = await stripe.paymentIntents.retrieve(tx.stripe_payment_intent_id);
          if (pi.status === "requires_capture") {
            await stripe.paymentIntents.capture(tx.stripe_payment_intent_id);
          }
        }

        await supabase
          .from("transactions")
          .update({
            status: "completed",
            delivery_status: "delivered",
            delivery_confirmed_at: now,
            captured_at: now,
            updated_at: now,
          })
          .eq("id", tx.id);

        if (tx.listing_id) {
          await supabase
            .from("listings")
            .update({ status: "sold" })
            .eq("id", tx.listing_id);
        }

        results.released++;
      } catch (err: any) {
        results.errors.push(`TX ${tx.id}: ${err.message}`);
      }
    }

    console.log("Auto-expire results:", results);

    return new Response(JSON.stringify({ success: true, ...results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
