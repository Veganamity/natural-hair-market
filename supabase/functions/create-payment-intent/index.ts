import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PLATFORM_FEE = 0.99;

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

    const { listingId, amount, shippingData, shippingCarrier } = await req.json();

    if (!listingId || !amount || amount <= 0) {
      throw new Error("Invalid parameters");
    }

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, seller_id, price, status")
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

    const sellerAmount = amount - PLATFORM_FEE;

    if (sellerAmount < 0) {
      throw new Error("Amount too low to cover platform fee");
    }

    const metadata: any = {
      listingId,
      buyerId: user.id,
      sellerId: listing.seller_id,
      platformFee: PLATFORM_FEE.toString(),
      sellerAmount: sellerAmount.toString(),
      sellerStripeAccountId: sellerProfile.stripe_account_id,
    };

    if (shippingCarrier) {
      metadata.shippingCarrierId = shippingCarrier.id?.toString();
      metadata.shippingCarrierName = shippingCarrier.name;
      metadata.shippingPrice = shippingCarrier.price?.toString();
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "eur",
      payment_method_types: ["sepa_debit", "card"],
      capture_method: "manual",
      metadata,
    });

    const transactionData: any = {
      listing_id: listingId,
      buyer_id: user.id,
      seller_id: listing.seller_id,
      amount: amount,
      seller_amount: sellerAmount,
      platform_fee: PLATFORM_FEE,
      stripe_payment_intent_id: paymentIntent.id,
      status: "pending",
      payment_method: "sepa_debit",
      capture_method: "manual",
      delivery_status: "pending",
    };

    if (shippingCarrier) {
      transactionData.shipping_carrier = shippingCarrier.name;
      transactionData.shipping_carrier_id = shippingCarrier.id;
      transactionData.shipping_price = shippingCarrier.price;
    }

    if (shippingData) {
      transactionData.shipping_method = shippingData.method;
      transactionData.shipping_cost = shippingData.cost || 0;
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
