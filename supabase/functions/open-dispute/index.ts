import "jsr:@supabase/functions-js/edge-runtime.d.ts";
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { transactionId, reason } = await req.json();
    if (!transactionId) {
      return new Response(JSON.stringify({ error: "transactionId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .select("id, buyer_id, status, delivery_status, stripe_payment_intent_id")
      .eq("id", transactionId)
      .maybeSingle();

    if (txError || !transaction) {
      return new Response(JSON.stringify({ error: "Transaction not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (transaction.buyer_id !== user.id) {
      return new Response(JSON.stringify({ error: "Seul l'acheteur peut ouvrir un litige" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!["pending", "processing"].includes(transaction.status)) {
      return new Response(
        JSON.stringify({ error: "Un litige ne peut être ouvert que sur une transaction en cours" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (transaction.delivery_status !== "shipped") {
      return new Response(
        JSON.stringify({ error: "Un litige peut uniquement être ouvert après expédition du colis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (transaction.status === "disputed") {
      return new Response(JSON.stringify({ error: "Un litige est déjà ouvert sur cette transaction" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        status: "disputed",
        dispute_opened_at: now,
        dispute_reason: reason || "Problème signalé par l'acheteur",
        updated_at: now,
      })
      .eq("id", transactionId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, message: "Litige ouvert. L'administrateur va examiner votre demande." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("open-dispute error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
