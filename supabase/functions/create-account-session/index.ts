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
      .select("stripe_account_id, stripe_account_status")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      throw new Error("Profil introuvable");
    }

    let accountId = profile.stripe_account_id;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "FR",
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        settings: {
          payouts: {
            schedule: {
              interval: "weekly",
              weekly_anchor: "monday",
            },
          },
        },
      });

      accountId = account.id;

      await supabaseClient
        .from("profiles")
        .update({
          stripe_account_id: accountId,
          stripe_account_status: "pending",
          stripe_onboarding_completed: false,
        })
        .eq("id", user.id);
    }

    const body = await req.json().catch(() => ({}));
    const { component = "account_onboarding" } = body;

    const accountSession = await stripe.accountSessions.create({
      account: accountId,
      components: {
        account_onboarding: {
          enabled: component === "account_onboarding" || component === "all",
          features: {
            external_account_collection: true,
          },
        },
        account_management: {
          enabled: component === "account_management" || component === "all",
          features: {
            external_account_collection: true,
          },
        },
        balances: {
          enabled: component === "balances" || component === "all",
          features: {
            instant_payouts: false,
            standard_payouts: true,
            edit_payout_schedule: false,
          },
        },
        payments: {
          enabled: component === "payments" || component === "all",
          features: {
            refund_management: false,
            dispute_management: false,
            capture_payments: false,
          },
        },
        payouts: {
          enabled: component === "payouts" || component === "all",
          features: {
            instant_payouts: false,
            standard_payouts: true,
            edit_payout_schedule: false,
          },
        },
      },
    });

    return new Response(
      JSON.stringify({
        clientSecret: accountSession.client_secret,
        accountId,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Account session error:", message);
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
