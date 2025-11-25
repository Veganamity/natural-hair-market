import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CreateLabelRequest {
  transactionId: string;
}

interface SendcloudParcelData {
  name: string;
  company_name?: string;
  address: string;
  address_2?: string;
  house_number?: string;
  city: string;
  postal_code: string;
  country: string;
  email?: string;
  telephone?: string;
  weight: string;
  order_number: string;
  shipment?: {
    id: number;
  };
  sender?: {
    company_name?: string;
    name: string;
    address: string;
    house_number?: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { transactionId }: CreateLabelRequest = await req.json();

    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: "Transaction ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .select(
        `
        *,
        shipping_address:shipping_addresses(*),
        buyer:buyer_id(email, full_name),
        seller:seller_id(full_name, address_line1, address_line2, postal_code, city, country, phone),
        listing:listings(title, hair_weight, price)
      `
      )
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
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const shippingAddress = transaction.shipping_address;
    const seller = transaction.seller;

    if (!shippingAddress || !seller) {
      throw new Error("Shipping address or seller information missing");
    }

    const destinationCountry = shippingAddress.country || "FR";
    const isFrenchDestination = destinationCountry === "FR" || destinationCountry === "France";

    if (isFrenchDestination) {
      const colissimoUrl = `${supabaseUrl}/functions/v1/create-label-colissimo`;
      const colissimoResponse = await fetch(colissimoUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ transactionId }),
      });

      const colissimoResult = await colissimoResponse.json();

      if (!colissimoResponse.ok) {
        throw new Error(colissimoResult.error || "Failed to create Colissimo label");
      }

      return new Response(
        JSON.stringify(colissimoResult),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const sendcloudApiKey = Deno.env.get("SENDCLOUD_API_KEY");
    const sendcloudApiSecret = Deno.env.get("SENDCLOUD_API_SECRET");

    if (!sendcloudApiKey || !sendcloudApiSecret) {
      throw new Error("Sendcloud API credentials not configured");
    }

    const weight = transaction.listing?.hair_weight?.replace(/[^\d]/g, "") || "100";

    const shippingMethodId = transaction.shipping_carrier_id || 8;

    const parcelData: SendcloudParcelData = {
      name: shippingAddress.full_name,
      address: shippingAddress.address_line1,
      address_2: shippingAddress.address_line2 || "",
      city: shippingAddress.city,
      postal_code: shippingAddress.postal_code,
      country: shippingAddress.country || "FR",
      telephone: shippingAddress.phone || "",
      weight: weight,
      order_number: transactionId,
      shipment: {
        id: shippingMethodId,
      },
      sender: {
        name: seller.full_name || "Vendeur",
        address: seller.address_line1 || "",
        city: seller.city || "",
        postal_code: seller.postal_code || "",
        country: seller.country || "FR",
      },
    };

    const sendcloudAuth = btoa(`${sendcloudApiKey}:${sendcloudApiSecret}`);

    const sendcloudResponse = await fetch(
      "https://panel.sendcloud.sc/api/v2/parcels",
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${sendcloudAuth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ parcel: parcelData }),
      }
    );

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

    if (updateError) {
      throw new Error(`Failed to update transaction: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        shipping_label_url: labelUrl,
        tracking_number: trackingNumber,
        parcel_id: parcelId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});