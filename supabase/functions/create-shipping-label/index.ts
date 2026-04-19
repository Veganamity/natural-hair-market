import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const countryNameToCode: Record<string, string> = {
  "France": "FR", "Germany": "DE", "Allemagne": "DE",
  "Spain": "ES", "Espagne": "ES", "Italy": "IT", "Italie": "IT",
  "Belgium": "BE", "Belgique": "BE", "Switzerland": "CH", "Suisse": "CH",
  "Netherlands": "NL", "Pays-Bas": "NL", "United Kingdom": "GB", "Royaume-Uni": "GB",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { transactionId } = await req.json();

    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: "Transaction ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .select(`
        *,
        shipping_address:shipping_addresses(*),
        buyer:buyer_id(email, full_name, phone),
        seller:seller_id(full_name, email, address_line1, address_line2, postal_code, city, country, phone),
        listing:listings(title, hair_weight, price, weight_grams)
      `)
      .eq("id", transactionId)
      .maybeSingle();

    if (txError || !transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.shipping_label_url) {
      return new Response(
        JSON.stringify({
          message: "Label already exists",
          shipping_label_url: transaction.shipping_label_url,
          tracking_number: transaction.tracking_number,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const seller = transaction.seller as any;
    const listing = transaction.listing as any;
    const isMondialRelay = transaction.shipping_method === "mondial_relay";

    if (!seller) throw new Error("Seller information missing");

    const sendcloudApiKey = Deno.env.get("SENDCLOUD_API_KEY");
    const sendcloudApiSecret = Deno.env.get("SENDCLOUD_API_SECRET");
    if (!sendcloudApiKey || !sendcloudApiSecret) {
      throw new Error("Sendcloud API credentials not configured");
    }

    const weightGrams = listing?.weight_grams
      || parseInt(listing?.hair_weight?.replace(/[^\d]/g, "") || "100", 10)
      || 100;
    const weightKg = (Math.max(weightGrams, 10) / 1000).toFixed(3);

    const sellerCountryCode = countryNameToCode[seller.country] || seller.country || "FR";

    const senderInfo = {
      name: seller.full_name || "Vendeur",
      address: seller.address_line1 || "",
      city: seller.city || "",
      postal_code: seller.postal_code || "",
      country: sellerCountryCode,
    };

    const itemValue = listing?.price ?? transaction.amount ?? 0;

    const parcelItems = [
      {
        description: listing?.title || "Cheveux naturels",
        quantity: 1,
        weight: weightKg,
        value: String(itemValue.toFixed(2)),
        hs_code: "6703000000",
        origin_country: sellerCountryCode,
      },
    ];

    let parcelData: Record<string, any>;

    if (isMondialRelay) {
      const relayPointId = (transaction as any).relay_point_id;
      if (!relayPointId) throw new Error("Point relais non défini pour cette commande");

      const relayAddress = (transaction as any).relay_point_address || "";
      const relayCity = (transaction as any).relay_point_city || "";
      const relayPostalCode = (transaction as any).relay_point_postal_code || "";

      const buyer = transaction.buyer as any;

      const sendcloudMethodId = transaction.sendcloud_method_id || 161;

      parcelData = {
        name: buyer?.full_name || "Acheteur",
        address: relayAddress.split(",")[0] || "POINT RELAIS",
        city: relayCity,
        postal_code: relayPostalCode,
        country: "FR",
        telephone: buyer?.phone || seller.phone || "",
        email: buyer?.email || "",
        weight: weightKg,
        order_number: transactionId,
        insured_value: String(itemValue.toFixed(2)),
        to_service_point: parseInt(relayPointId, 10),
        shipment: { id: sendcloudMethodId },
        sender: senderInfo,
        parcel_items: parcelItems,
      };
    } else {
      const shippingAddress = transaction.shipping_address as any;
      if (!shippingAddress) throw new Error("Shipping address missing");

      const rawCountry = shippingAddress.country || "FR";
      const destinationCountry = countryNameToCode[rawCountry] || rawCountry;

      const sendcloudMethodId = transaction.sendcloud_method_id || transaction.shipping_carrier_id || 8;

      parcelData = {
        name: shippingAddress.full_name,
        address: shippingAddress.address_line1,
        address_2: shippingAddress.address_line2 || "",
        city: shippingAddress.city,
        postal_code: shippingAddress.postal_code,
        country: destinationCountry,
        telephone: shippingAddress.phone || "",
        weight: weightKg,
        order_number: transactionId,
        insured_value: String(itemValue.toFixed(2)),
        shipment: { id: sendcloudMethodId },
        sender: senderInfo,
        parcel_items: parcelItems,
      };
    }

    const sendcloudAuth = btoa(`${sendcloudApiKey}:${sendcloudApiSecret}`);

    const sendcloudResponse = await fetch("https://panel.sendcloud.sc/api/v2/parcels", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${sendcloudAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parcel: parcelData }),
    });

    if (!sendcloudResponse.ok) {
      const errorData = await sendcloudResponse.text();
      throw new Error(`Sendcloud API error: ${errorData}`);
    }

    const sendcloudResult = await sendcloudResponse.json();
    const parcel = sendcloudResult.parcel;

    const labelUrl = parcel.label?.label_printer || parcel.label?.normal_printer?.[0];
    const trackingNumber = parcel.tracking_number;
    const parcelId = parcel.id;

    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        shipping_label_url: labelUrl,
        tracking_number: trackingNumber,
        sendcloud_parcel_id: parcelId?.toString(),
        shipping_status: "label_created",
      })
      .eq("id", transactionId);

    if (updateError) throw new Error(`Failed to update transaction: ${updateError.message}`);

    return new Response(
      JSON.stringify({
        success: true,
        shipping_label_url: labelUrl,
        tracking_number: trackingNumber,
        parcel_id: parcelId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
