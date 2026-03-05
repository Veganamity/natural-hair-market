import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function generateMD5Security(params: string): string {
  const privateKey = Deno.env.get("MONDIAL_RELAY_PRIVATE_KEY") || "";
  const stringToHash = params + privateKey;

  const encoder = new TextEncoder();
  const data = encoder.encode(stringToHash);

  return Array.from(data)
    .reduce((hash, byte) => {
      hash = ((hash << 5) - hash) + byte;
      return hash & hash;
    }, 0)
    .toString(16)
    .toUpperCase()
    .padStart(32, '0')
    .substring(0, 32);
}

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
    const enseigne = Deno.env.get("MONDIAL_RELAY_ENSEIGNE");
    const marque = Deno.env.get("MONDIAL_RELAY_MARQUE") || "CC";
    const codeMarque = Deno.env.get("MONDIAL_RELAY_CODE_MARQUE") || "41";

    if (!enseigne) {
      throw new Error("Mondial Relay credentials not configured");
    }

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

    if (!transaction.sender_address) {
      throw new Error("Sender address missing");
    }

    const senderAddress = transaction.sender_address as unknown as MondialRelayAddress;

    const listing = transaction.listing;
    if (!listing) {
      throw new Error("Listing not found");
    }

    const weightGrams = listing.weight_grams || 100;
    const weightInGrams = Math.ceil(weightGrams / 100) * 100;

    const senderCountry = senderAddress.country.toUpperCase().substring(0, 2);
    const senderPhone = senderAddress.phone.replace(/\D/g, '').substring(0, 10);
    const senderName = senderAddress.name.substring(0, 32);
    const senderLine2 = senderAddress.addressLine1.substring(0, 32);
    const senderCity = senderAddress.city.substring(0, 26);
    const senderPostalCode = senderAddress.postalCode.replace(/\s/g, '');

    const recipientCountry = senderCountry;
    const recipientPhone = senderPhone;
    const recipientName = "Point Relais";
    const recipientEmail = senderAddress.email?.substring(0, 70) || "";

    const reference = transaction.id.substring(0, 15);
    const orderNumber = transaction.id.substring(0, 15);

    const paramsForSecurity = `${enseigne}${codeMarque}${senderCountry}${senderPostalCode}${senderCity}${recipientCountry}${relayPointId}${weightInGrams}`;
    const securityHash = generateMD5Security(paramsForSecurity);

    const soapBody = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Body>
    <WSI2_CreationEtiquette xmlns="http://www.mondialrelay.fr/webservice/">
      <Enseigne>${enseigne}</Enseigne>
      <ModeCol>REL</ModeCol>
      <ModeLiv>24R</ModeLiv>
      <NDossier>${reference}</NDossier>
      <NClient>${orderNumber}</NClient>
      <Expe_Langage>FR</Expe_Langage>
      <Expe_Ad1>${senderName}</Expe_Ad1>
      <Expe_Ad2></Expe_Ad2>
      <Expe_Ad3>${senderLine2}</Expe_Ad3>
      <Expe_Ad4></Expe_Ad4>
      <Expe_Ville>${senderCity}</Expe_Ville>
      <Expe_CP>${senderPostalCode}</Expe_CP>
      <Expe_Pays>${senderCountry}</Expe_Pays>
      <Expe_Tel1>${senderPhone}</Expe_Tel1>
      <Expe_Tel2></Expe_Tel2>
      <Expe_Mail>${recipientEmail}</Expe_Mail>
      <Dest_Langage>FR</Dest_Langage>
      <Dest_Ad1>${recipientName}</Dest_Ad1>
      <Dest_Ad2></Dest_Ad2>
      <Dest_Ad3></Dest_Ad3>
      <Dest_Ad4></Dest_Ad4>
      <Dest_Ville></Dest_Ville>
      <Dest_CP></Dest_CP>
      <Dest_Pays>${recipientCountry}</Dest_Pays>
      <Dest_Tel1>${recipientPhone}</Dest_Tel1>
      <Dest_Tel2></Dest_Tel2>
      <Dest_Mail>${recipientEmail}</Dest_Mail>
      <Poids>${weightInGrams}</Poids>
      <Longueur></Longueur>
      <Taille></Taille>
      <NbColis>1</NbColis>
      <CRT_Valeur>0</CRT_Valeur>
      <CRT_Devise></CRT_Devise>
      <Exp_Valeur></Exp_Valeur>
      <Exp_Devise></Exp_Devise>
      <COL_Rel_Pays>${senderCountry}</COL_Rel_Pays>
      <COL_Rel>${relayPointId}</COL_Rel>
      <LIV_Rel_Pays>${recipientCountry}</LIV_Rel_Pays>
      <LIV_Rel>${relayPointId}</LIV_Rel>
      <TAvisage></TAvisage>
      <TReprise></TReprise>
      <Montage></Montage>
      <TRDV></TRDV>
      <Assurance></Assurance>
      <Instructions></Instructions>
      <Security>${securityHash}</Security>
    </WSI2_CreationEtiquette>
  </soap:Body>
</soap:Envelope>`;

    console.log('Generating Mondial Relay label for transaction:', transactionId);
    console.log('Relay point ID:', relayPointId, 'Weight:', weightInGrams, 'g');

    const response = await fetch("https://api.mondialrelay.com/WebService.asmx", {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": "http://www.mondialrelay.fr/webservice/WSI2_CreationEtiquette",
      },
      body: soapBody,
    });

    const responseText = await response.text();
    console.log('Mondial Relay response status:', response.status);

    if (!response.ok) {
      console.error('Mondial Relay API error:', responseText);
      throw new Error(`Mondial Relay API error: ${responseText}`);
    }

    const statMatch = responseText.match(/<STAT>(\d+)<\/STAT>/);
    if (statMatch && statMatch[1] !== "0") {
      const errorCode = statMatch[1];
      console.error('Mondial Relay error code:', errorCode);
      throw new Error(`Mondial Relay error code: ${errorCode}`);
    }

    const expeditionMatch = responseText.match(/<ExpeditionNum>(.*?)<\/ExpeditionNum>/);
    const urlLabelMatch = responseText.match(/<URL_Etiquette>(.*?)<\/URL_Etiquette>/);

    if (!expeditionMatch || !urlLabelMatch) {
      throw new Error("Failed to parse Mondial Relay response");
    }

    const expeditionNumber = expeditionMatch[1].trim();
    const labelUrl = urlLabelMatch[1].trim();

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
