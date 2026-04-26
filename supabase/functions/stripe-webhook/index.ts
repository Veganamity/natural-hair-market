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

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeSecretKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-12-18.acacia" });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    let event: Stripe.Event;

    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    console.log(`Webhook event: ${event.type}`);

    switch (event.type) {
      case "payment_intent.amount_capturable_updated": {
        // En mode capture manuelle, ce webhook indique que le paiement est autorisé
        // et attend la capture. On passe la transaction en "processing".
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const { data: transaction } = await supabase
          .from("transactions")
          .select("id, listing_id, shipping_method, relay_point_id")
          .eq("stripe_payment_intent_id", paymentIntent.id)
          .maybeSingle();

        await supabase
          .from("transactions")
          .update({
            status: "processing",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        // Générer l'étiquette d'expédition maintenant que le paiement est autorisé
        if (transaction?.id) {
          try {
            if (transaction.shipping_method === "mondial_relay" && transaction.relay_point_id) {
              const mondialRelayUrl = `${supabaseUrl}/functions/v1/generate-mondial-relay-label`;
              const mrResponse = await fetch(mondialRelayUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${supabaseKey}`,
                },
                body: JSON.stringify({
                  transactionId: transaction.id,
                  relayPointId: transaction.relay_point_id,
                }),
              });
              if (!mrResponse.ok) {
                const mrError = await mrResponse.text();
                console.error("Failed to create Mondial Relay label:", mrError);
                await supabase
                  .from("transactions")
                  .update({ label_generation_error: mrError })
                  .eq("id", transaction.id);
              }
            } else {
              const createLabelUrl = `${supabaseUrl}/functions/v1/create-shipping-label`;
              await fetch(createLabelUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${supabaseKey}`,
                },
                body: JSON.stringify({ transactionId: transaction.id }),
              });
            }
          } catch (labelError) {
            console.error("Failed to create shipping label:", labelError);
          }
        }

        break;
      }

      case "payment_intent.succeeded": {
        // En mode capture automatique (anciennes transactions), marquer comme complété
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const { data: transaction } = await supabase
          .from("transactions")
          .select("id, listing_id, capture_method, shipping_method, relay_point_id")
          .eq("stripe_payment_intent_id", paymentIntent.id)
          .maybeSingle();

        // Pour les transactions en capture manuelle, la complétion est gérée
        // par capture-payment lors de la confirmation de livraison — ne pas écraser
        if (transaction?.capture_method !== "manual") {
          await supabase
            .from("transactions")
            .update({
              status: "completed",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_payment_intent_id", paymentIntent.id);

          if (transaction?.listing_id) {
            await supabase
              .from("listings")
              .update({ status: "sold" })
              .eq("id", transaction.listing_id);
          }

          // Générer l'étiquette pour les anciennes transactions en mode automatique
          if (transaction?.id) {
            try {
              if (transaction.shipping_method === "mondial_relay" && transaction.relay_point_id) {
                const mondialRelayUrl = `${supabaseUrl}/functions/v1/generate-mondial-relay-label`;
                await fetch(mondialRelayUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${supabaseKey}`,
                  },
                  body: JSON.stringify({
                    transactionId: transaction.id,
                    relayPointId: transaction.relay_point_id,
                  }),
                });
              } else {
                const createLabelUrl = `${supabaseUrl}/functions/v1/create-shipping-label`;
                await fetch(createLabelUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${supabaseKey}`,
                  },
                  body: JSON.stringify({ transactionId: transaction.id }),
                });
              }
            } catch (labelError) {
              console.error("Failed to create shipping label:", labelError);
            }
          }
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await supabase
          .from("transactions")
          .update({ status: "failed", updated_at: new Date().toISOString() })
          .eq("stripe_payment_intent_id", paymentIntent.id);
        break;
      }

      case "payment_intent.processing": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await supabase
          .from("transactions")
          .update({ status: "processing", updated_at: new Date().toISOString() })
          .eq("stripe_payment_intent_id", paymentIntent.id);
        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        await supabase
          .from("transactions")
          .update({
            status: "refunded",
            delivery_status: "cancelled",
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        const { data: transaction } = await supabase
          .from("transactions")
          .select("listing_id")
          .eq("stripe_payment_intent_id", paymentIntent.id)
          .maybeSingle();

        if (transaction?.listing_id) {
          await supabase
            .from("listings")
            .update({ status: "active" })
            .eq("id", transaction.listing_id);
        }

        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        if (charge.payment_intent) {
          const { data: refundedTransactions } = await supabase
            .from("transactions")
            .update({
              status: "refunded",
              delivery_status: "cancelled",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_payment_intent_id", charge.payment_intent as string)
            .select("listing_id");

          if (refundedTransactions) {
            for (const t of refundedTransactions) {
              if (t.listing_id) {
                await supabase
                  .from("listings")
                  .update({ status: "active" })
                  .eq("id", t.listing_id);
              }
            }
          }
        }
        break;
      }

      case "transfer.created": {
        const transfer = event.data.object as Stripe.Transfer;
        if (transfer.metadata?.transactionId) {
          await supabase
            .from("transactions")
            .update({ transfer_id: transfer.id, updated_at: new Date().toISOString() })
            .eq("id", transfer.metadata.transactionId);
        }
        break;
      }

      case "transfer.failed": {
        const transfer = event.data.object as Stripe.Transfer;
        if (transfer.metadata?.transactionId) {
          await supabase
            .from("transactions")
            .update({ status: "failed", updated_at: new Date().toISOString() })
            .eq("id", transfer.metadata.transactionId);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
