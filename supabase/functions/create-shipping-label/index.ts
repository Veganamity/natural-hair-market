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
      .select("*, listing:listings(title, hair_weight, price, weight_grams)")
      .eq("id", transactionId)
      .maybeSingle();

    if (txError) {
      console.error("Transaction fetch error:", txError, "id:", transactionId);
      return new Response(
        JSON.stringify({ error: `DB error: ${txError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!transaction) {
      console.error("Transaction not found for id:", transactionId);
      return new Response(
        JSON.stringify({ error: "Transaction not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: sellerProfile } = await supabase
      .from("profiles")
      .select("full_name, email, address_line1, address_line2, postal_code, city, country, phone")
      .eq("id", transaction.seller_id)
      .maybeSingle();

    // Label already exists — return it directly
    if (transaction.shipping_label_pdf_url) {
      return new Response(
        JSON.stringify({
          message: "Label already exists",
          shipping_label_url: transaction.shipping_label_pdf_url,
          tracking_number: transaction.shipping_label_tracking_number || transaction.tracking_number,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sendcloudApiKey = Deno.env.get("SENDCLOUD_API_KEY");
    const sendcloudApiSecret = Deno.env.get("SENDCLOUD_API_SECRET");
    if (!sendcloudApiKey || !sendcloudApiSecret) {
      throw new Error("Sendcloud API credentials not configured");
    }

    const seller = sellerProfile as any;
    const listing = transaction.listing as any;
    const isMondialRelay = transaction.shipping_method === "mondial_relay";

    if (!seller) throw new Error("Seller information missing");

    const weightGrams = listing?.weight_grams
      || parseInt(listing?.hair_weight?.replace(/[^\d]/g, "") || "100", 10)
      || 100;
    const weightKg = (Math.max(weightGrams, 10) / 1000).toFixed(3);

    const sellerCountryCode = countryNameToCode[seller.country] || seller.country || "FR";
    const itemValue = Number(listing?.price ?? transaction.amount ?? 0);

    // Fetch the default sender address ID from Sendcloud (required as numeric ID, not object)
    const sendcloudAuth = btoa(`${sendcloudApiKey}:${sendcloudApiSecret}`);
    let senderAddressId: number | null = null;
    try {
      const senderRes = await fetch("https://panel.sendcloud.sc/api/v2/user/addresses/sender", {
        headers: { "Authorization": `Basic ${sendcloudAuth}` },
      });
      if (senderRes.ok) {
        const senderData = await senderRes.json();
        const addresses = senderData.sender_addresses || [];
        // prefer default address, fallback to first
        const defaultAddr = addresses.find((a: any) => a.is_default) || addresses[0];
        if (defaultAddr?.id) senderAddressId = defaultAddr.id;
      }
    } catch (e) {
      console.error("Could not fetch sender addresses:", e);
    }

    const parcelItems = [
      {
        description: listing?.title || "Cheveux naturels",
        quantity: 1,
        weight: weightKg,
        value: itemValue.toFixed(2),
        hs_code: "6703000000",
        origin_country: sellerCountryCode,
      },
    ];

    let parcelData: Record<string, any>;

    if (isMondialRelay) {
      const relayPointId = transaction.relay_point_id;
      if (!relayPointId) throw new Error("Point relais non défini pour cette commande");

      const relayAddress = transaction.relay_point_address || "";
      const relayCity = transaction.relay_point_city || "";
      const relayPostalCode = transaction.relay_point_postal_code || "";

      // Fetch buyer profile for name/phone/email
      const { data: buyerProfile } = await supabase
        .from("profiles")
        .select("full_name, email, phone")
        .eq("id", transaction.buyer_id)
        .maybeSingle();

      const sendcloudMethodId = transaction.sendcloud_method_id || 161;

      parcelData = {
        name: buyerProfile?.full_name || "Acheteur",
        address: relayAddress.split(",")[0] || "POINT RELAIS",
        city: relayCity,
        postal_code: relayPostalCode,
        country: "FR",
        telephone: buyerProfile?.phone || seller.phone || "",
        email: buyerProfile?.email || "",
        weight: weightKg,
        order_number: transactionId,
        ...(itemValue >= 2 ? { insured_value: itemValue.toFixed(2) } : {}),
        to_service_point: parseInt(relayPointId, 10),
        shipment: { id: sendcloudMethodId },
        ...(senderAddressId ? { sender_address: senderAddressId } : {}),
        parcel_items: parcelItems,
      };
    } else {
      // shipping_address is stored as a JSON string or object in the column
      let shippingAddress: any = transaction.shipping_address;
      if (typeof shippingAddress === "string") {
        try { shippingAddress = JSON.parse(shippingAddress); } catch { shippingAddress = null; }
      }
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
        ...(itemValue >= 2 ? { insured_value: itemValue.toFixed(2) } : {}),
        shipment: { id: sendcloudMethodId },
        ...(senderAddressId ? { sender_address: senderAddressId } : {}),
        parcel_items: parcelItems,
      };
    }

    const sendcloudResponse = await fetch("https://panel.sendcloud.sc/api/v2/parcels", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${sendcloudAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parcel: parcelData }),
    });

    const responseText = await sendcloudResponse.text();
    console.log("Sendcloud response status:", sendcloudResponse.status);
    console.log("Sendcloud response:", responseText.substring(0, 500));

    if (!sendcloudResponse.ok) {
      let errorMessage = `Sendcloud erreur (${sendcloudResponse.status})`;
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.error?.message) errorMessage = `Sendcloud: ${errorData.error.message}`;
        else errorMessage = `Sendcloud: ${responseText.substring(0, 300)}`;
      } catch {
        errorMessage = `Sendcloud: ${responseText.substring(0, 300)}`;
      }
      throw new Error(errorMessage);
    }

    const sendcloudResult = JSON.parse(responseText);
    const parcel = sendcloudResult.parcel;

    console.log("Parcel label data:", JSON.stringify(parcel.label));
    console.log("Parcel id:", parcel.id, "tracking:", parcel.tracking_number);

    // normal_printer URLs are directly downloadable PDFs; label_printer requires Sendcloud auth
    const labelUrl = parcel.label?.normal_printer?.[0] || parcel.label?.label_printer;
    const trackingNumber = parcel.tracking_number;
    const parcelId = parcel.id;

    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        shipping_label_pdf_url: labelUrl,
        shipping_label_tracking_number: trackingNumber,
        tracking_number: trackingNumber,
        sendcloud_parcel_id: parcelId?.toString(),
        shipping_status: "label_created",
        label_generated_at: new Date().toISOString(),
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
    console.error("create-shipping-label error:", (error as Error).message);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
