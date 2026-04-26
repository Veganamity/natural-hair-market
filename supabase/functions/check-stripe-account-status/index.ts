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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Non authentifié");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) throw new Error("Non authentifié");

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_account_id, stripe_account_status, stripe_onboarding_completed")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || !profile.stripe_account_id) {
      return new Response(
        JSON.stringify({ status: "not_configured", charges_enabled: false, payouts_enabled: false, requirements: [], onboarding_completed: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let account;
    try {
      account = await stripe.accounts.retrieve(profile.stripe_account_id);
    } catch (_err) {
      await supabase.from("profiles").update({
        stripe_account_id: null,
        stripe_account_status: "not_configured",
        stripe_onboarding_completed: false,
      }).eq("id", user.id);

      return new Response(
        JSON.stringify({ status: "not_configured", charges_enabled: false, payouts_enabled: false, requirements: [], onboarding_completed: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const chargesEnabled = account.charges_enabled ?? false;
    const payoutsEnabled = account.payouts_enabled ?? false;
    const requirements = account.requirements?.currently_due ?? [];
    const pendingRequirements = account.requirements?.pending_verification ?? [];
    const eventuallyDue = account.requirements?.eventually_due ?? [];

    let newStatus: string;
    if (chargesEnabled && payoutsEnabled) {
      newStatus = "active";
    } else if (requirements.length > 0 || eventuallyDue.length > 0) {
      newStatus = "incomplete";
    } else {
      newStatus = "pending";
    }

    const onboardingCompleted = chargesEnabled && payoutsEnabled;

    if (
      profile.stripe_account_status !== newStatus ||
      profile.stripe_onboarding_completed !== onboardingCompleted
    ) {
      await supabase.from("profiles").update({
        stripe_account_status: newStatus,
        stripe_onboarding_completed: onboardingCompleted,
      }).eq("id", user.id);
    }

    return new Response(
      JSON.stringify({
        status: newStatus,
        charges_enabled: chargesEnabled,
        payouts_enabled: payoutsEnabled,
        requirements,
        pending_verification: pendingRequirements,
        eventually_due: eventuallyDue,
        onboarding_completed: onboardingCompleted,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Check Stripe status error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
