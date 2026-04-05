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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) throw new Error("Non authentifié");

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_account_id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) throw new Error("Profil introuvable");

    let accountId = profile.stripe_account_id;

    if (accountId) {
      try {
        await stripe.accounts.retrieve(accountId);
      } catch (_err) {
        accountId = null;
      }
    }

    if (!accountId) {
      const account = await stripe.accounts.create({
        country: "FR",
        email: user.email,
        controller: {
          stripe_dashboard: { type: "none" },
          fees: { payer: "application" },
          losses: { payments: "application" },
          requirement_collection: "application",
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      accountId = account.id;

      await supabase
        .from("profiles")
        .update({
          stripe_account_id: accountId,
          stripe_account_status: "pending",
          stripe_onboarding_completed: false,
        })
        .eq("id", user.id);
    }

    const body = await req.json().catch(() => ({}));
    const { returnUrl, refreshUrl } = body;

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl || `${Deno.env.get("FRONTEND_URL") || "https://naturalhairmarket.com"}/profile?stripe_refresh=true`,
      return_url: returnUrl || `${Deno.env.get("FRONTEND_URL") || "https://naturalhairmarket.com"}/profile?stripe_onboarding=success`,
      type: "account_onboarding",
    });

    return new Response(
      JSON.stringify({ url: accountLink.url, accountId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe Account Link error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
