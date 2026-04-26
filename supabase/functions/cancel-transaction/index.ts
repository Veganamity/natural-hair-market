import "jsr:@supabase/functions-js/edge-runtime.d.ts";
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

    const cancellationReason = reason || "Annulation par l'utilisateur";

    const { data, error } = await supabase.rpc("cancel_transaction", {
      p_transaction_id: transactionId,
      p_cancellation_reason: cancellationReason,
    });

    if (error) {
      console.error("Error cancelling transaction:", error);
      throw new Error(error.message || "Failed to cancel transaction");
    }

    if (data && !data.success) {
      throw new Error(data.error || "Failed to cancel transaction");
    }

    const { data: transaction } = await supabase
      .from("transactions")
      .select("stripe_payment_intent_id")
      .eq("id", transactionId)
      .maybeSingle();

    if (transaction?.stripe_payment_intent_id) {
      console.log("Stripe payment intent found:", transaction.stripe_payment_intent_id);
      console.log("Note: Payment should be cancelled/refunded via cancel-payment function");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Transaction annulée avec succès",
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
      JSON.stringify({
        error: error.message,
        success: false,
      }),
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
