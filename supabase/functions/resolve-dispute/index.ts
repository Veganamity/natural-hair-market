import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_EMAIL = "stephaniebuisson1115@gmail.com";

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
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin check
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .maybeSingle();

    if (adminProfile?.email !== ADMIN_EMAIL) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { transactionId, resolution } = await req.json();
    // resolution: "refund_buyer" | "pay_seller"
    if (!transactionId || !["refund_buyer", "pay_seller"].includes(resolution)) {
      return new Response(
        JSON.stringify({ error: "transactionId and resolution ('refund_buyer'|'pay_seller') are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", transactionId)
      .maybeSingle();

    if (txError || !transaction) {
      return new Response(JSON.stringify({ error: "Transaction not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (transaction.status !== "disputed") {
      return new Response(JSON.stringify({ error: "Transaction is not in disputed status" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date().toISOString();
    let newStatus: string;
    let stripeAction = "";

    if (resolution === "refund_buyer") {
      // Cancel the payment intent (funds are still in requires_capture state)
      if (transaction.stripe_payment_intent_id) {
        const pi = await stripe.paymentIntents.retrieve(transaction.stripe_payment_intent_id);
        if (pi.status === "requires_capture") {
          await stripe.paymentIntents.cancel(transaction.stripe_payment_intent_id, {
            cancellation_reason: "fraudulent",
          });
          stripeAction = "cancelled";
        } else if (pi.status === "succeeded") {
          await stripe.refunds.create({
            payment_intent: transaction.stripe_payment_intent_id,
            reason: "fraudulent",
          });
          stripeAction = "refunded";
        }
      }

      newStatus = "refunded";

      await supabase
        .from("transactions")
        .update({
          status: newStatus,
          delivery_status: "cancelled",
          dispute_resolved_at: now,
          dispute_resolution: resolution,
          updated_at: now,
        })
        .eq("id", transactionId);

      // Restore listing to active
      if (transaction.listing_id) {
        await supabase
          .from("listings")
          .update({ status: "active" })
          .eq("id", transaction.listing_id);
      }
    } else {
      // pay_seller: capture the funds
      if (transaction.stripe_payment_intent_id) {
        const pi = await stripe.paymentIntents.retrieve(transaction.stripe_payment_intent_id);
        if (pi.status === "requires_capture") {
          await stripe.paymentIntents.capture(transaction.stripe_payment_intent_id);
          stripeAction = "captured";
        }
      }

      newStatus = "completed";

      await supabase
        .from("transactions")
        .update({
          status: newStatus,
          delivery_status: "delivered",
          delivery_confirmed_at: now,
          captured_at: now,
          dispute_resolved_at: now,
          dispute_resolution: resolution,
          updated_at: now,
        })
        .eq("id", transactionId);

      if (transaction.listing_id) {
        await supabase
          .from("listings")
          .update({ status: "sold" })
          .eq("id", transaction.listing_id);
      }
    }

    return new Response(
      JSON.stringify({ success: true, newStatus, stripeAction }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("resolve-dispute error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
