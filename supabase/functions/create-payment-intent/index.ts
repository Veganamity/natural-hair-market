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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { listingId, shippingData } = await req.json();

    if (!listingId) {
      throw new Error("Invalid parameters");
    }

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, seller_id, price, status, seller_shipping_fee")
      .eq("id", listingId)
      .maybeSingle();

    if (listingError || !listing) {
      throw new Error("Listing not found");
    }

    if (listing.status !== "active") {
      throw new Error("Listing is not available");
    }

    if (listing.seller_id === user.id) {
      throw new Error("Cannot buy your own listing");
    }

    const { data: sellerProfile } = await supabase
      .from("profiles")
      .select("stripe_account_id, stripe_account_status")
      .eq("id", listing.seller_id)
      .maybeSingle();

    if (!sellerProfile?.stripe_account_id) {
      throw new Error("Seller has not set up their Stripe account");
    }

    if (sellerProfile.stripe_account_status !== "active") {
      throw new Error("Seller's Stripe account is not active");
    }

    const itemPrice = listing.price;
    const sellerShippingFee = listing.seller_shipping_fee || 0;
    const totalAmount = itemPrice + sellerShippingFee;

    const marketplaceCommission = Math.round(itemPrice * MARKETPLACE_COMMISSION_RATE * 100) / 100;
    const sellerReceives = itemPrice - marketplaceCommission + sellerShippingFee;

    if (sellerReceives < 0) {
      throw new Error("Invalid pricing calculation");
    }

    const metadata: any = {
      listingId,
      buyerId: user.id,
      sellerId: listing.seller_id,
      itemPrice: itemPrice.toString(),
      sellerShippingFee: sellerShippingFee.toString(),
      marketplaceCommission: marketplaceCommission.toString(),
      sellerReceives: sellerReceives.toString(),
      sellerStripeAccountId: sellerProfile.stripe_account_id,
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "eur",
      payment_method_types: ["sepa_debit", "card"],
      capture_method: "manual",
      metadata,
    });

    const transactionData: any = {
      listing_id: listingId,
      buyer_id: user.id,
      seller_id: listing.seller_id,
      amount: totalAmount,
      seller_amount: sellerReceives,
      platform_fee: marketplaceCommission,
      marketplace_commission_rate: MARKETPLACE_COMMISSION_RATE,
      marketplace_commission_amount: marketplaceCommission,
      seller_shipping_fee: sellerShippingFee,
      stripe_payment_intent_id: paymentIntent.id,
      status: "pending",
      payment_method: "sepa_debit",
      capture_method: "manual",
      delivery_status: "pending",
    };

    if (shippingData) {
      transactionData.shipping_method = shippingData.method;
      transactionData.shipping_cost = sellerShippingFee;
      if (shippingData.addressId) {
        transactionData.shipping_address_id = shippingData.addressId;
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
      console.error("Transaction insert error:", transactionError);
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
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
      JSON.stringify({ error: error.message }),
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