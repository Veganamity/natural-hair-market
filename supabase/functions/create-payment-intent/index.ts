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

    const body = await req.json();
    const { listingId, shippingData } = body;

    if (!listingId) {
      throw new Error("listingId is required");
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
      .select("stripe_account_id, stripe_account_status, full_name, email, phone, address_line1, address_line2, postal_code, city, country")
      .eq("id", listing.seller_id)
      .maybeSingle();

    if (!sellerProfile?.stripe_account_id) {
      throw new Error("SELLER_NO_STRIPE: Le vendeur n'a pas configure son compte de paiement Stripe.");
    }

    if (sellerProfile.stripe_account_status !== "active") {
      throw new Error(`SELLER_ACCOUNT_NOT_ACTIVE: Le compte Stripe du vendeur n'est pas actif (statut: ${sellerProfile.stripe_account_status || "inconnu"}). Veuillez contacter le vendeur.`);
    }

    const itemPrice = listing.price;
    const buyerShippingCost = shippingData?.cost || 0;
    const commissionAmount = Math.round(itemPrice * MARKETPLACE_COMMISSION_RATE * 100);
    const totalAmount = itemPrice + (commissionAmount / 100) + buyerShippingCost;
    const sellerReceivesAmount = Math.round(itemPrice * 100);

    const metadata: Record<string, string> = {
      listingId,
      buyerId: user.id,
      sellerId: listing.seller_id,
      itemPrice: itemPrice.toString(),
      buyerShippingCost: buyerShippingCost.toString(),
      marketplaceCommission: (commissionAmount / 100).toFixed(2),
      sellerReceives: (sellerReceivesAmount / 100).toFixed(2),
      sellerStripeAccountId: sellerProfile.stripe_account_id,
      shippingMethod: shippingData?.method || "colissimo",
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      capture_method: "automatic",
      application_fee_amount: commissionAmount,
      transfer_data: {
        destination: sellerProfile.stripe_account_id,
      },
      metadata,
    });

    const transactionData: Record<string, unknown> = {
      listing_id: listingId,
      buyer_id: user.id,
      seller_id: listing.seller_id,
      amount: itemPrice + (commissionAmount / 100) + buyerShippingCost,
      seller_amount: itemPrice,
      platform_fee: commissionAmount / 100,
      marketplace_commission_rate: MARKETPLACE_COMMISSION_RATE,
      marketplace_commission_amount: commissionAmount / 100,
      stripe_payment_intent_id: paymentIntent.id,
      status: "pending",
      payment_method: "card",
      capture_method: "automatic",
      delivery_status: "pending",
    };

    if (sellerProfile && (sellerProfile.address_line1 || sellerProfile.city)) {
      transactionData.sender_address = {
        name: sellerProfile.full_name || '',
        addressLine1: sellerProfile.address_line1 || '',
        addressLine2: sellerProfile.address_line2 || '',
        postalCode: sellerProfile.postal_code || '',
        city: sellerProfile.city || '',
        country: sellerProfile.country || 'FR',
        phone: sellerProfile.phone || '',
        email: sellerProfile.email || '',
      };
    }

    if (shippingData) {
      transactionData.shipping_method = shippingData.method;
      transactionData.shipping_cost = buyerShippingCost;
      transactionData.shipping_price = buyerShippingCost;

      if (shippingData.method === 'mondial_relay') {
        transactionData.shipping_carrier = 'Mondial Relay';
      } else if (shippingData.method === 'chronopost') {
        transactionData.shipping_carrier = 'Chronopost';
      } else if (shippingData.method === 'colissimo') {
        transactionData.shipping_carrier = 'Colissimo';
      }

      if (shippingData.address) {
        transactionData.shipping_address = JSON.stringify(shippingData.address);
      }

      if (shippingData.sendcloudMethodId) {
        transactionData.sendcloud_method_id = shippingData.sendcloudMethodId;
      }

      if (shippingData.relayPointId) {
        transactionData.relay_point_id = shippingData.relayPointId;
        transactionData.relay_point_name = shippingData.relayPointName;
        transactionData.relay_point_address = shippingData.relayPointAddress;
        if (shippingData.relayPointPostalCode) transactionData.relay_point_postal_code = shippingData.relayPointPostalCode;
        if (shippingData.relayPointCity) transactionData.relay_point_city = shippingData.relayPointCity;
      }
    }

    const { error: transactionError } = await supabase
      .from("transactions")
      .insert(transactionData);

    if (transactionError) {
      console.error("Transaction insert error:", transactionError);
      throw new Error(`Failed to create transaction record: ${transactionError.message}`);
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
