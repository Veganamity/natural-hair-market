import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function formatPhone(phone: string): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("33") && digits.length === 11) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 10) return `+33${digits.substring(1)}`;
  if (digits.length === 9) return `+33${digits}`;
  return `+${digits}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiLogin = Deno.env.get("MONDIAL_RELAY_API_USERNAME") || "CC20EUCU@business-api.mondialrelay.com";
    const apiPassword = Deno.env.get("MONDIAL_RELAY_API_PASSWORD") || "\\zYDC=g<kj3WBiQ[6QKF";
    const customerId = Deno.env.get("MONDIAL_RELAY_BRAND_ID") || "CC20EUCU";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) throw new Error("Unauthorized");

    const { transactionId, relayPointId } = await req.json();

    if (!transactionId || !relayPointId) {
      throw new Error("Transaction ID and relay point ID are required");
    }

    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .select("*, listing:listings(*)")
      .eq("id", transactionId)
      .maybeSingle();

    if (transactionError || !transaction) throw new Error("Transaction not found");

    if (transaction.seller_id !== user.id && transaction.buyer_id !== user.id) {
      throw new Error("Unauthorized to access this transaction");
    }

    const { data: sellerProfile } = await supabase
      .from("profiles")
      .select("full_name, email, phone, address_line1, address_line2, postal_code, city, country")
      .eq("id", transaction.seller_id)
      .maybeSingle();

    if (!sellerProfile?.address_line1 || !sellerProfile?.city || !sellerProfile?.postal_code) {
      throw new Error("Adresse expéditeur manquante. Veuillez renseigner votre adresse complète (rue, code postal, ville) dans votre profil.");
    }

    const { data: buyerProfile } = await supabase
      .from("profiles")
      .select("full_name, email, phone")
      .eq("id", transaction.buyer_id)
      .maybeSingle();

    const listing = transaction.listing;
    if (!listing) throw new Error("Listing not found");

    const weightGrams = Math.max(listing.weight_grams || 100, 10);
    const senderCountry = (sellerProfile.country || "FR").toUpperCase().substring(0, 2);

    const sellerPhone = formatPhone(sellerProfile.phone || "");
    const buyerPhone = formatPhone(buyerProfile?.phone || sellerProfile.phone || "");

    const sellerNameParts = (sellerProfile.full_name || "Vendeur").split(" ");
    const sellerFirstname = sellerNameParts[0] || "Vendeur";
    const sellerLastname = sellerNameParts.slice(1).join(" ") || sellerNameParts[0] || "";

    const buyerNameParts = (buyerProfile?.full_name || "Acheteur").split(" ");
    const buyerFirstname = buyerNameParts[0] || "Acheteur";
    const buyerLastname = buyerNameParts.slice(1).join(" ") || buyerNameParts[0] || "";

    const orderRef = transaction.id.substring(0, 15).replace(/-/g, "").toUpperCase();
    const customerRef = user.id.substring(0, 9).replace(/-/g, "").toUpperCase();

    const xmlBody = `<?xml version="1.0" encoding="utf-8"?>
<ShipmentCreationRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.example.org/Request">
  <Context>
    <Login>${apiLogin}</Login>
    <Password>${apiPassword}</Password>
    <CustomerId>${customerId}</CustomerId>
    <Culture>fr-FR</Culture>
    <VersionAPI>1.0</VersionAPI>
  </Context>
  <OutputOptions>
    <OutputFormat>10x15</OutputFormat>
    <OutputType>PdfUrl</OutputType>
  </OutputOptions>
  <ShipmentsList>
    <Shipment>
      <OrderNo>${orderRef}</OrderNo>
      <CustomerNo>${customerRef}</CustomerNo>
      <ParcelCount>1</ParcelCount>
      <DeliveryMode Mode="24R" Location="FR-${relayPointId}" />
      <CollectionMode Mode="REL" Location="${senderCountry}-${relayPointId}" />
      <Parcels>
        <Parcel>
          <Content>Cheveux</Content>
          <Weight Value="${weightGrams}" Unit="gr" />
        </Parcel>
      </Parcels>
      <DeliveryInstruction></DeliveryInstruction>
      <Sender>
        <Address>
          <Firstname>${escapeXml(sellerFirstname)}</Firstname>
          <Lastname>${escapeXml(sellerLastname)}</Lastname>
          <Streetname>${escapeXml(sellerProfile.address_line1 || "")}</Streetname>
          <HouseNo></HouseNo>
          <CountryCode>${senderCountry}</CountryCode>
          <PostCode>${(sellerProfile.postal_code || "").replace(/\s/g, "")}</PostCode>
          <City>${escapeXml(sellerProfile.city || "")}</City>
          <AddressAdd1></AddressAdd1>
          <AddressAdd2>${escapeXml(sellerProfile.address_line2 || "")}</AddressAdd2>
          <PhoneNo>${sellerPhone}</PhoneNo>
          <MobileNo></MobileNo>
          <Email>${escapeXml(sellerProfile.email || "")}</Email>
        </Address>
      </Sender>
      <Recipient>
        <Address>
          <Firstname>${escapeXml(buyerFirstname)}</Firstname>
          <Lastname>${escapeXml(buyerLastname)}</Lastname>
          <Streetname></Streetname>
          <HouseNo></HouseNo>
          <CountryCode>FR</CountryCode>
          <PostCode>00000</PostCode>
          <City>Point Relais</City>
          <AddressAdd1></AddressAdd1>
          <AddressAdd2></AddressAdd2>
          <PhoneNo>${buyerPhone}</PhoneNo>
          <MobileNo></MobileNo>
          <Email>${escapeXml(buyerProfile?.email || "")}</Email>
        </Address>
      </Recipient>
    </Shipment>
  </ShipmentsList>
</ShipmentCreationRequest>`;

    console.log("Sending XML to Mondial Relay:", xmlBody);

    const response = await fetch("https://connect-api.mondialrelay.com/api/shipment", {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "Accept": "application/xml",
      },
      body: xmlBody,
    });

    const responseText = await response.text();
    console.log("Mondial Relay response status:", response.status);
    console.log("Mondial Relay raw response:", responseText);

    if (!response.ok) {
      const errorMatch = responseText.match(/<messageField>([^<]+)<\/messageField>/i) ||
                         responseText.match(/<Message>([^<]+)<\/Message>/i);
      const errorMsg = errorMatch ? errorMatch[1] : `Erreur HTTP ${response.status}`;
      throw new Error(`Erreur Mondial Relay: ${errorMsg}`);
    }

    const statusMatch = responseText.match(/<codeField>(\d+)<\/codeField>.*?<levelField>(Error|Critical Error)<\/levelField>.*?<messageField>([^<]+)<\/messageField>/is);
    if (statusMatch) {
      throw new Error(`Erreur Mondial Relay (${statusMatch[1]}): ${statusMatch[3]}`);
    }

    const shipmentNumberMatch = responseText.match(/ShipmentNumber="([^"]+)"/i) ||
                                responseText.match(/<ShipmentNumber>([^<]+)<\/ShipmentNumber>/i);
    const labelUrlMatch = responseText.match(/<Output>([^<]+)<\/Output>/i) ||
                          responseText.match(/<output>([^<]+)<\/output>/i);

    if (!shipmentNumberMatch) {
      console.error("Could not extract shipment number from:", responseText);
      const preview = responseText.substring(0, 500).replace(/</g, "[").replace(/>/g, "]");
      throw new Error(`Réponse inattendue: ${preview}`);
    }

    const expeditionNumber = shipmentNumberMatch[1];
    const labelUrl = labelUrlMatch ? labelUrlMatch[1].replace(/&amp;/g, "&") : "";

    console.log("Expedition number:", expeditionNumber);
    console.log("Label URL:", labelUrl);

    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        shipping_label_pdf_url: labelUrl || null,
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
      JSON.stringify({ success: true, labelUrl, trackingNumber: expeditionNumber, relayPointId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
