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
    const apiKeyHeader = req.headers.get("apikey");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    let isAuthorized = false;

    if (apiKeyHeader && apiKeyHeader === serviceRoleKey) {
      isAuthorized = true;
    } else if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (token === serviceRoleKey) {
        isAuthorized = true;
      } else {
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) {
          const { data: callerProfile } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", user.id)
            .maybeSingle();
          const adminEmails = ["naturalhairmarket@gmail.com", "stephaniebuisson1115@gmail.com"];
          if (callerProfile && adminEmails.includes(callerProfile.email?.toLowerCase() ?? "")) {
            isAuthorized = true;
          }
        }
      }
    }

    if (!isAuthorized) {
      throw new Error("Accès réservé aux administrateurs");
    }

    const { data: sellers, error } = await supabase
      .from("profiles")
      .select("id, stripe_account_id, stripe_account_status, email")
      .not("stripe_account_id", "is", null);

    if (error) throw new Error(`DB error: ${error.message}`);

    const results: Array<{
      accountId: string;
      email: string | null;
      status: string;
      updated: boolean;
      requirements: string[];
      disabledReason?: string | null;
      error?: string;
    }> = [];

    for (const seller of sellers ?? []) {
      try {
        const account = await stripe.accounts.retrieve(seller.stripe_account_id);

        const chargesEnabled = account.charges_enabled ?? false;
        const payoutsEnabled = account.payouts_enabled ?? false;
        const requirements = account.requirements?.currently_due ?? [];
        const pastDue = account.requirements?.past_due ?? [];
        const eventuallyDue = account.requirements?.eventually_due ?? [];
        const allRequirements = [...requirements, ...pastDue, ...eventuallyDue];
        const disabledReason = account.requirements?.disabled_reason ?? null;

        let newStatus: string;
        if (chargesEnabled && payoutsEnabled) {
          newStatus = "active";
        } else if (allRequirements.length > 0) {
          newStatus = "incomplete";
        } else {
          newStatus = "pending";
        }

        await supabase
          .from("profiles")
          .update({
            stripe_account_status: newStatus,
            stripe_onboarding_completed: chargesEnabled && payoutsEnabled,
          })
          .eq("id", seller.id);

        results.push({
          accountId: seller.stripe_account_id,
          email: seller.email,
          status: newStatus,
          updated: true,
          requirements: allRequirements,
          disabledReason,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";

        if (msg.includes("resource_missing") || msg.includes("No such account") || msg.includes("invalid")) {
          await supabase
            .from("profiles")
            .update({
              stripe_account_id: null,
              stripe_account_status: "not_configured",
              stripe_onboarding_completed: false,
            })
            .eq("id", seller.id);
        }

        results.push({
          accountId: seller.stripe_account_id,
          email: seller.email,
          status: "error",
          updated: false,
          requirements: [],
          disabledReason: null,
          error: msg,
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Fix Stripe accounts error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
