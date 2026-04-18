import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const MARKETPLACE_COMMISSION_RATE = 0.10;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    console.log('DEBUG STRIPE: Secret Key starts with:', stripeSecretKey?.slice(0, 12));
    if (!stripeSecretKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-12-18.acacia" });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) throw new Error("Unauthorized");

    const body = await req.json();
    const { listingIds, shippingData } = body;

    if (!listingIds || !Array.isArray(listingIds) || listingIds.length === 0) {
      throw new Error("listingIds is required and must be a non-empty array");
    }

    const { data: listings, error: listingsError } = await supabase
      .from("listings")
      .select("id, seller_id, price, status, title, weight_grams")
      .in("id", listingIds);

    if (listingsError || !listings || listings.length === 0) {
      throw new Error("Listings not found");
    }

    for (const listing of listings) {
      if (listing.status !== "active") {
        throw new Error(`L'annonce "${listing.title}" n'est plus disponible`);
      }
      if (listing.seller_id === user.id) {
        throw new Error("Vous ne pouvez pas acheter vos propres annonces");
      }
    }

    const sellerIds = [...new Set(listings.map((l: any) => l.seller_id))];
    if (sellerIds.length > 1) {
      throw new Error("Toutes les annonces doivent appartenir au même vendeur");
    }

    const sellerId = sellerIds[0];

    const { data: sellerProfile } = await supabase
      .from("profiles")
      .select("stripe_account_id, stripe_account_status")
      .eq("id", sellerId)
      .maybeSingle();

    if (!sellerProfile?.stripe_account_id) {
      throw new Error("SELLER_NO_STRIPE: Le vendeur n'a pas configuré son compte de paiement Stripe.");
    }

    if (sellerProfile.stripe_account_status !== "active") {
      throw new Error(`SELLER_ACCOUNT_NOT_ACTIVE: Le compte Stripe du vendeur n'est pas actif (statut: ${sellerProfile.stripe_account_status || "inconnu"}).`);
    }

    const itemsTotal = listings.reduce((sum: number, l: any) => sum + l.price, 0);
    const buyerShippingCost = shippingData?.cost || 0;
    const commissionAmount = Math.round(itemsTotal * MARKETPLACE_COMMISSION_RATE * 100);
    const totalAmount = itemsTotal + (commissionAmount / 100) + buyerShippingCost;
    const sellerReceivesAmount = Math.round(itemsTotal * 100) - commissionAmount;

    const metadata: Record<string, string> = {
      listingIds: listingIds.join(","),
      buyerId: user.id,
      sellerId,
      itemsTotal: itemsTotal.toString(),
      buyerShippingCost: buyerShippingCost.toString(),
      marketplaceCommission: (commissionAmount / 100).toFixed(2),
      sellerReceives: (sellerReceivesAmount / 100).toFixed(2),
      sellerStripeAccountId: sellerProfile.stripe_account_id,
      shippingMethod: shippingData?.method || "colissimo",
      isCartPayment: "true",
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      capture_method: "automatic",
      application_fee_amount: commissionAmount,
      transfer_data: { destination: sellerProfile.stripe_account_id },
      metadata,
    });

    for (const listing of listings) {
      const shippingCostPerItem = buyerShippingCost / listings.length;
      const itemCommission = Math.round(listing.price * MARKETPLACE_COMMISSION_RATE * 100) / 100;

      const transactionData: Record<string, unknown> = {
        listing_id: listing.id,
        buyer_id: user.id,
        seller_id: sellerId,
        amount: listing.price + itemCommission + shippingCostPerItem,
        seller_amount: listing.price - itemCommission,
        platform_fee: itemCommission,
        marketplace_commission_rate: MARKETPLACE_COMMISSION_RATE,
        marketplace_commission_amount: itemCommission,
        stripe_payment_intent_id: paymentIntent.id,
        status: "pending",
        payment_method: "card",
        capture_method: "automatic",
        delivery_status: "pending",
      };

      if (shippingData) {
        transactionData.shipping_method = shippingData.method;
        transactionData.shipping_cost = shippingCostPerItem;

        if (shippingData.address) {
          transactionData.shipping_address = JSON.stringify(shippingData.address);
        }
        if (shippingData.relayPointId) {
          transactionData.relay_point_id = shippingData.relayPointId;
          transactionData.relay_point_name = shippingData.relayPointName;
          transactionData.relay_point_address = shippingData.relayPointAddress;
        }
      }

      const { error: transactionError } = await supabase
        .from("transactions")
        .insert(transactionData);

      if (transactionError) {
        console.error("Transaction insert error for listing", listing.id, transactionError);
      }
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
