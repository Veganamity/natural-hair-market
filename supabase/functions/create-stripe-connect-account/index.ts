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

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error("Non authentifié");
    }

    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile) {
      throw new Error("Profil introuvable");
    }

    let accountId = profile.stripe_account_id;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "standard",
        country: "FR",
        email: user.email,
      });

      accountId = account.id;

      await supabaseClient
        .from("profiles")
        .update({
          stripe_account_id: accountId,
          stripe_account_status: "pending",
        })
        .eq("id", user.id);
    }

    const origin = req.headers.get("origin") || "https://localhost:5173";

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/profile`,
      return_url: `${origin}/profile?stripe_onboarding=success`,
      type: "account_onboarding",
    });

    return new Response(
      JSON.stringify({ url: accountLink.url }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe Connect error:", message);
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
