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
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-12-18.acacia",
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { transactionId, reason } = await req.json();

    if (!transactionId) {
      throw new Error("Transaction ID is required");
    }

    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", transactionId)
      .maybeSingle();

    if (transactionError || !transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.buyer_id !== user.id && transaction.seller_id !== user.id) {
      throw new Error("Unauthorized to cancel this transaction");
    }

    if (transaction.status === "completed") {
      throw new Error("Cannot cancel a completed transaction");
    }

    if (transaction.status === "refunded" || transaction.status === "cancelled") {
      throw new Error("Transaction already cancelled or refunded");
    }

    const paymentIntent = await stripe.paymentIntents.cancel(
      transaction.stripe_payment_intent_id,
      {
        cancellation_reason: reason || "requested_by_customer",
      }
    );

    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        status: "cancelled",
        delivery_status: "cancelled",
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", transactionId);

    if (updateError) {
      console.error("Error updating transaction:", updateError);
      throw new Error("Failed to update transaction");
    }

    if (transaction.listing_id) {
      await supabase
        .from("listings")
        .update({ status: "active" })
        .eq("id", transaction.listing_id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        paymentIntent: paymentIntent.id,
        status: paymentIntent.status,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});