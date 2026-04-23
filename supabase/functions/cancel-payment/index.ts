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
    if (!stripeSecretKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-12-18.acacia" });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) throw new Error("Unauthorized");

    const { transactionId, reason } = await req.json();
    if (!transactionId) throw new Error("Transaction ID is required");

    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", transactionId)
      .maybeSingle();

    if (transactionError || !transaction) throw new Error("Transaction not found");

    if (transaction.buyer_id !== user.id && transaction.seller_id !== user.id) {
      throw new Error("Unauthorized to cancel this transaction");
    }

    if (transaction.status === "refunded" || transaction.status === "cancelled") {
      throw new Error("Transaction already cancelled or refunded");
    }

    if (transaction.delivery_status === "shipped" || transaction.delivery_status === "delivered") {
      throw new Error("Cannot cancel: the parcel has already been shipped");
    }

    if (!transaction.stripe_payment_intent_id) {
      throw new Error("No payment intent found for this transaction");
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      transaction.stripe_payment_intent_id,
      { expand: ["latest_charge"] }
    );

    let stripeAction = "cancelled";
    let stripeRefId = "";

    const latestCharge = paymentIntent.latest_charge as any;
    const amountRefunded = latestCharge?.amount_refunded ?? 0;
    const amountCaptured = latestCharge?.amount_captured ?? paymentIntent.amount_received ?? 0;
    const alreadyFullyRefunded =
      paymentIntent.status === "succeeded" &&
      amountCaptured > 0 &&
      amountRefunded >= amountCaptured;

    if (paymentIntent.status === "canceled") {
      stripeAction = "cancelled";
      stripeRefId = paymentIntent.id;
    } else if (alreadyFullyRefunded) {
      stripeAction = "refunded";
      stripeRefId = latestCharge?.id ?? paymentIntent.id;
    } else if (
      paymentIntent.status === "requires_payment_method" ||
      paymentIntent.status === "requires_confirmation" ||
      paymentIntent.status === "requires_action" ||
      paymentIntent.status === "processing"
    ) {
      const cancelled = await stripe.paymentIntents.cancel(
        transaction.stripe_payment_intent_id,
        { cancellation_reason: "requested_by_customer" }
      );
      stripeAction = "cancelled";
      stripeRefId = cancelled.id;
    } else if (paymentIntent.status === "requires_capture") {
      // Capture manuelle : annuler l'autorisation libère les fonds immédiatement
      const cancelled = await stripe.paymentIntents.cancel(
        transaction.stripe_payment_intent_id,
        { cancellation_reason: "requested_by_customer" }
      );
      stripeAction = "refunded";
      stripeRefId = cancelled.id;
    } else if (paymentIntent.status === "succeeded") {
      if (amountCaptured === 0) {
        stripeAction = "cancelled";
        stripeRefId = paymentIntent.id;
      } else {
        try {
          const refund = await stripe.refunds.create({
            payment_intent: transaction.stripe_payment_intent_id,
            reason: "requested_by_customer",
          });
          stripeAction = "refunded";
          stripeRefId = refund.id;
        } catch (refundErr: any) {
          if (
            refundErr?.code === "insufficient_funds" ||
            refundErr?.raw?.code === "insufficient_funds" ||
            (refundErr?.message || "").includes("Insufficient funds")
          ) {
            stripeAction = "cancelled";
            stripeRefId = paymentIntent.id;
          } else {
            throw refundErr;
          }
        }
      }
    } else {
      throw new Error(`Cannot cancel payment in status: ${paymentIntent.status}`);
    }

    const newStatus = stripeAction === "refunded" ? "refunded" : "cancelled";
    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        status: newStatus,
        delivery_status: "cancelled",
        cancelled_at: now,
        updated_at: now,
      })
      .eq("id", transactionId);

    if (updateError) throw new Error("Failed to update transaction");

    if (transaction.listing_id) {
      await supabase
        .from("listings")
        .update({ status: "active" })
        .eq("id", transaction.listing_id);
    }

    return new Response(
      JSON.stringify({ success: true, action: stripeAction, refId: stripeRefId, status: newStatus }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
