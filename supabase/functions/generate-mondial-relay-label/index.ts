import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface MondialRelayAddress {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const apiUsername = Deno.env.get("MONDIAL_RELAY_API_USERNAME") || "CC20EUCU@business-api.mondialrelay.com";
    const apiPassword = Deno.env.get("MONDIAL_RELAY_API_PASSWORD") || "\\zYDC=g<kj3WBiQ[6QKF";
    const brandId = Deno.env.get("MONDIAL_RELAY_BRAND_ID") || "CC20EUCU";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { transactionId, relayPointId } = await req.json();

    if (!transactionId || !relayPointId) {
      throw new Error("Transaction ID and relay point ID are required");
    }

    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .select("*, listing:listings(*)")
      .eq("id", transactionId)
      .maybeSingle();

    if (transactionError || !transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.seller_id !== user.id && transaction.buyer_id !== user.id) {
      throw new Error("Unauthorized to access this transaction");
    }

    let senderAddress: MondialRelayAddress;

    if (transaction.sender_address) {
      senderAddress = transaction.sender_address as unknown as MondialRelayAddress;
    } else {
      const { data: sellerProfile } = await supabase
        .from("profiles")
        .select("full_name, email, phone, address_line1, address_line2, postal_code, city, country")
        .eq("id", transaction.seller_id)
        .maybeSingle();

      if (!sellerProfile || (!sellerProfile.address_line1 && !sellerProfile.city)) {
        throw new Error("Adresse expéditeur manquante. Veuillez renseigner votre adresse dans votre profil avant de générer un bon.");
      }

      senderAddress = {
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

    const listing = transaction.listing;
    if (!listing) {
      throw new Error("Listing not found");
    }

    const weightGrams = listing.weight_grams || 100;

    const credentials = btoa(`${apiUsername}:${apiPassword}`);

    const shipmentData = {
      Brand: brandId,
      CollectionMode: "REL",
      DeliveryMode: "24R",
      OrderNo: transaction.id.substring(0, 35),
      CustomerNo: user.id.substring(0, 35),
      ParcelCount: 1,
      DeliveryInstruction: "",
      Weight: weightGrams,
      Sender: {
        Country: senderAddress.country.toUpperCase().substring(0, 2),
        City: senderAddress.city,
        PostCode: senderAddress.postalCode.replace(/\s/g, ''),
        AddressLine1: senderAddress.name,
        AddressLine2: senderAddress.addressLine1,
        PhoneNo: senderAddress.phone.replace(/\D/g, ''),
        Email: senderAddress.email || "",
      },
      Recipient: {
        Country: senderAddress.country.toUpperCase().substring(0, 2),
        PhoneNo: senderAddress.phone.replace(/\D/g, ''),
        Email: senderAddress.email || "",
      },
      CollectionPoint: {
        Country: senderAddress.country.toUpperCase().substring(0, 2),
        ID: relayPointId,
      },
      DeliveryPoint: {
        Country: senderAddress.country.toUpperCase().substring(0, 2),
        ID: relayPointId,
      },
    };

    console.log('Creating Mondial Relay shipment for transaction:', transactionId);
    console.log('Relay point ID:', relayPointId, 'Weight:', weightGrams, 'g');

    const response = await fetch("https://connect-api.mondialrelay.com/api/Shipment", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(shipmentData),
    });

    const responseText = await response.text();
    console.log('Mondial Relay response status:', response.status);

    if (!response.ok) {
      console.error('Mondial Relay API error:', responseText);
      throw new Error(`Mondial Relay API error: ${responseText}`);
    }

    const data = JSON.parse(responseText);

    if (!data || !data.ExpeditionNum) {
      console.error('Unexpected response format:', data);
      throw new Error('Invalid response format from Mondial Relay API');
    }

    const expeditionNumber = data.ExpeditionNum;
    const labelUrl = data.LabelUrl || data.URL_Etiquette || "";

    console.log('Mondial Relay label generated:', expeditionNumber);
    console.log('Label URL:', labelUrl);

    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        shipping_label_pdf_url: labelUrl,
        shipping_label_tracking_number: expeditionNumber,
        shipping_carrier_reference: expeditionNumber,
        label_generated_at: new Date().toISOString(),
        shipping_status: "label_created",
        shipping_carrier: `Mondial Relay (${relayPointId})`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", transactionId);

    if (updateError) {
      console.error("Error updating transaction:", updateError);
      throw new Error("Failed to update transaction with label info");
    }

    return new Response(
      JSON.stringify({
        success: true,
        labelUrl,
        trackingNumber: expeditionNumber,
        relayPointId,
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      try {
        const body = await req.json();
        if (body.transactionId) {
          await supabase
            .from("transactions")
            .update({
              label_generation_error: error.message,
              updated_at: new Date().toISOString(),
            })
            .eq("id", body.transactionId);
        }
      } catch {}
    }

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
