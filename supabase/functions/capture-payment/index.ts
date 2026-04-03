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

    const { transactionId } = await req.json();

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

    if (transaction.buyer_id !== user.id) {
      throw new Error("Seul l'acheteur peut confirmer la réception");
    }

    if (!["pending", "processing"].includes(transaction.status)) {
      throw new Error("Cette transaction ne peut pas être confirmée");
    }

    if (transaction.delivery_status === "cancelled") {
      throw new Error("Cette transaction a été annulée");
    }

    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        status: "completed",
        delivery_status: "delivered",
        delivery_confirmed_at: new Date().toISOString(),
        captured_at: new Date().toISOString(),
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
        .update({ status: "sold" })
        .eq("id", transaction.listing_id);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", message);
    return new Response(
      JSON.stringify({ error: message }),
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
