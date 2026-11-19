// Stripe onboarding - create account + redirect to onboarding
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
      .select("stripe_account_id, first_name, last_name, phone, address_line1, address_line2, postal_code, city, country, is_certified_salon")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) throw new Error("Profil introuvable");

    const productDescription = profile.is_certified_salon
      ? "Vente de cheveux naturels par un salon professionnel certifié"
      : "Vente occasionnelle de cheveux personnels";

    const profileCountry = (profile.country as string) || "FR";
    const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://www.naturalhairmarket.com";
    const returnUrl = `${frontendUrl}/profile?stripe_onboarding=success`;
    const refreshUrl = `${frontendUrl}/profile?stripe_refresh=true`;

    let accountId = profile.stripe_account_id;

    // Step 1: If no account exists, create one
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: profileCountry,
        email: user.email,
        business_type: "individual",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_profile: {
          product_description: productDescription,
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

    // Step 2: Check the account status to decide link type
    let linkType: "account_onboarding" | "account_update" = "account_onboarding";

    try {
      const existingAccount = await stripe.accounts.retrieve(accountId);

      // If account is wrong type, reset it
      if (existingAccount.business_type !== "individual") {
        await supabase
          .from("profiles")
          .update({
            stripe_account_id: null,
            stripe_account_status: "pending",
            stripe_onboarding_completed: false,
          })
          .eq("id", user.id);

        // Create fresh account
        const account = await stripe.accounts.create({
          type: "express",
          country: profileCountry,
          email: user.email,
          business_type: "individual",
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          business_profile: {
            product_description: productDescription,
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
      } else {
        // Account exists and is individual type
        const currentlyDue = existingAccount.requirements?.currently_due ?? [];
        if (currentlyDue.length === 0) {
          // Onboarding already submitted, use account_update
          linkType = "account_update";
        }
      }
    } catch (retrieveErr) {
      // Account might be deleted on Stripe side — reset and create new
      console.error("Account retrieve failed:", retrieveErr instanceof Error ? retrieveErr.message : "unknown");

      const account = await stripe.accounts.create({
        type: "express",
        country: profileCountry,
        email: user.email,
        business_type: "individual",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_profile: {
          product_description: productDescription,
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

    // Step 3: Create the account link
    try {
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: linkType,
        collection_options: {
          fields: "currently_due",
        },
      } as Stripe.AccountLinkCreateParams);

      return new Response(
        JSON.stringify({ url: accountLink.url, accountId }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (linkErr) {
      // If account_onboarding fails (e.g. "no pending requirements"), try account_update
      if (linkType === "account_onboarding") {
        const accountLink = await stripe.accountLinks.create({
          account: accountId,
          refresh_url: refreshUrl,
          return_url: returnUrl,
          type: "account_update",
        } as Stripe.AccountLinkCreateParams);

        return new Response(
          JSON.stringify({ url: accountLink.url, accountId }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw linkErr;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe Account Link error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
