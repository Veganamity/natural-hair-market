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

function sanitizeXmlField(str: string, maxLen = 40): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^0-9A-Z_\-'., /]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, maxLen);
}

function sanitizeCity(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z_\-' ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 30);
}

function escapeXml(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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
    const isServiceRole = token === supabaseKey;

    let userId: string | null = null;
    if (!isServiceRole) {
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      if (userError || !user) throw new Error("Unauthorized");
      userId = user.id;
    }

    const { transactionId, relayPointId } = await req.json();

    if (!transactionId || !relayPointId) {
      throw new Error("Transaction ID and relay point ID are required");
    }

    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .select("*, listing:listings(*), relay_point_postal_code, relay_point_city, relay_point_name, relay_point_address")
      .eq("id", transactionId)
      .maybeSingle();

    if (transactionError || !transaction) throw new Error("Transaction not found");

    if (!isServiceRole && userId && transaction.seller_id !== userId && transaction.buyer_id !== userId) {
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

    if (!/^\d+$/.test(relayPointId)) {
      throw new Error(`L'identifiant du point relais est invalide (${relayPointId}). Veuillez resélectionner un point relais Mondial Relay valide lors de votre prochain achat.`);
    }

    const weightGrams = Math.max(listing.weight_grams || 100, 10);
    const senderCountry = (sellerProfile.country || "FR").toUpperCase().substring(0, 2);

    const sellerMobile = formatPhone(sellerProfile.phone || "");
    const buyerMobile = formatPhone(buyerProfile?.phone || sellerProfile.phone || "");

    const sellerNameParts = (sellerProfile.full_name || "VENDEUR").split(" ");
    const sellerFirstname = sanitizeXmlField(sellerNameParts[0] || "VENDEUR", 32);
    const sellerLastname = sanitizeXmlField(sellerNameParts.slice(1).join(" ") || sellerNameParts[0] || "", 32);

    const buyerNameParts = (buyerProfile?.full_name || "ACHETEUR").split(" ");
    const buyerFirstname = sanitizeXmlField(buyerNameParts[0] || "ACHETEUR", 32);
    const buyerLastname = sanitizeXmlField(buyerNameParts.slice(1).join(" ") || buyerNameParts[0] || "", 32);

    const orderRef = transaction.id.substring(0, 15).replace(/-/g, "").toUpperCase();
    const customerRef = (userId || transaction.seller_id).substring(0, 9).replace(/-/g, "").toUpperCase();

    const senderPostCode = (sellerProfile.postal_code || "").replace(/\s/g, "").substring(0, 10);
    const senderStreet = sanitizeXmlField(sellerProfile.address_line1 || "", 40);
    const senderCity = sanitizeCity(sellerProfile.city || "");
    const senderEmail = escapeXml((sellerProfile.email || "").substring(0, 70));
    const buyerEmail = escapeXml((buyerProfile?.email || "").substring(0, 70));

    const rawRelayPostalCode = transaction.relay_point_postal_code || "";
    const rawRelayCity = transaction.relay_point_city || "";
    const rawRelayAddress = transaction.relay_point_address || "";

    let recipientPostCode = rawRelayPostalCode.replace(/\s/g, "").substring(0, 10);
    let recipientCity = sanitizeCity(rawRelayCity);
    let recipientStreet = sanitizeXmlField(rawRelayAddress.split(",")[0] || "POINT RELAIS", 40);

    if (!recipientPostCode || !recipientCity) {
      const addrMatch = rawRelayAddress.match(/,\s*(\d{5})\s+(.+)$/);
      if (addrMatch) {
        recipientPostCode = recipientPostCode || addrMatch[1];
        recipientCity = recipientCity || sanitizeCity(addrMatch[2]);
      }
    }

    if (!recipientPostCode) recipientPostCode = senderPostCode;
    if (!recipientCity) recipientCity = senderCity || "PARIS";
    if (!recipientStreet) recipientStreet = "POINT RELAIS";

    const xmlBody = `<?xml version="1.0" encoding="utf-8"?>
<ShipmentCreationRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.example.org/Request">
  <Context>
    <Login>${escapeXml(apiLogin)}</Login>
    <Password>${escapeXml(apiPassword)}</Password>
    <CustomerId>${escapeXml(customerId)}</CustomerId>
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
      <CollectionMode Mode="CCC" Location="" />
      <Parcels>
        <Parcel>
          <Content>CHEVEUX</Content>
          <Weight Value="${weightGrams}" Unit="gr" />
        </Parcel>
      </Parcels>
      <Sender>
        <Address>
          <Title />
          <Firstname>${sellerFirstname}</Firstname>
          <Lastname>${sellerLastname}</Lastname>
          <Streetname>${senderStreet}</Streetname>
          <HouseNo />
          <CountryCode>${senderCountry}</CountryCode>
          <PostCode>${senderPostCode}</PostCode>
          <City>${senderCity}</City>
          <AddressAdd1 />
          <AddressAdd2 />
          <AddressAdd3 />
          <PhoneNo />
          <MobileNo>${sellerMobile}</MobileNo>
          <Email>${senderEmail}</Email>
        </Address>
      </Sender>
      <Recipient>
        <Address>
          <Title />
          <Firstname>${buyerFirstname}</Firstname>
          <Lastname>${buyerLastname}</Lastname>
          <Streetname>${recipientStreet}</Streetname>
          <HouseNo />
          <CountryCode>FR</CountryCode>
          <PostCode>${recipientPostCode}</PostCode>
          <City>${recipientCity}</City>
          <AddressAdd1 />
          <AddressAdd2 />
          <AddressAdd3 />
          <PhoneNo />
          <MobileNo>${buyerMobile}</MobileNo>
          <Email>${buyerEmail}</Email>
        </Address>
      </Recipient>
    </Shipment>
  </ShipmentsList>
</ShipmentCreationRequest>`;

    console.log("Sending XML to Mondial Relay:", xmlBody);

    const response = await fetch("https://connect-api.mondialrelay.com/api/shipment", {
      method: "POST",
      headers: {
        "Content-Type": "text/xml",
        "Accept": "application/xml",
      },
      body: xmlBody,
    });

    const responseText = await response.text();
    console.log("Mondial Relay response status:", response.status);
    console.log("Mondial Relay raw response:", responseText);

    const errorStatusMatch = responseText.match(/Status\s+Code="(\d+)"\s+Level="([^"]+)"\s+Message="([^"]+)"/i);
    if (errorStatusMatch) {
      const code = errorStatusMatch[1];
      const level = errorStatusMatch[2];
      const message = errorStatusMatch[3];
      if (level.toLowerCase().includes("error")) {
        throw new Error(`Erreur Mondial Relay (${code}): ${message}`);
      }
    }

    if (!response.ok) {
      const preview = responseText.substring(0, 300);
      throw new Error(`Erreur HTTP ${response.status}: ${preview}`);
    }

    const shipmentNumberMatch = responseText.match(/Shipment ShipmentNumber="([^"]+)"/i) ||
                                responseText.match(/ShipmentNumber="([^"]+)"/i) ||
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
