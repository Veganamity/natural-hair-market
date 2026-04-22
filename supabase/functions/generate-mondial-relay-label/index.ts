import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import { crypto } from "https://deno.land/std@0.208.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function md5Hash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("MD5", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function formatPhone(phone: string): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("33") && digits.length === 11) return `0${digits}`;
  if (digits.startsWith("0") && digits.length === 10) return `0033${digits.substring(1)}`;
  if (digits.length === 9) return `0033${digits}`;
  return "";
}

function sanitize(str: string, maxLen = 32): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^0-9A-Z _\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, maxLen);
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
    const enseigne = Deno.env.get("MONDIAL_RELAY_BRAND_ID")!;
    const privateKey = Deno.env.get("MONDIAL_RELAY_PRIVATE_KEY")!;
    if (!enseigne || !privateKey) throw new Error("Credentials Mondial Relay manquants");

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

    const body = await req.json();
    const { transactionId, debug } = body;

    if (!transactionId) {
      throw new Error("Transaction ID is required");
    }

    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .select("*, listing:listings(*)")
      .eq("id", transactionId)
      .maybeSingle();

    if (transactionError) throw new Error(`DB error: ${transactionError.message}`);
    if (!transaction) throw new Error(`Transaction not found for id: ${transactionId}`);

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

    const weightGrams = Math.max(listing.weight_grams || 100, 10);

    const sellerNameParts = (sellerProfile.full_name || "VENDEUR").split(" ");
    const sellerLastname = sanitize(sellerNameParts[0] || "VENDEUR", 30);
    const sellerFirstname = sanitize(sellerNameParts.slice(1).join(" ") || "", 20);

    const buyerNameParts = (buyerProfile?.full_name || "ACHETEUR").split(" ");
    const buyerLastname = sanitize(buyerNameParts[0] || "ACHETEUR", 30);
    const buyerFirstname = sanitize(buyerNameParts.slice(1).join(" ") || "", 20);

    const sellerPhone = formatPhone(sellerProfile.phone || "");
    const buyerPhone = formatPhone(buyerProfile?.phone || sellerProfile.phone || "");

    const senderPostCode = (sellerProfile.postal_code || "").replace(/\s/g, "").substring(0, 10);
    const senderCity = sanitize(sellerProfile.city || "", 30);
    const senderStreet = sanitize(sellerProfile.address_line1 || "", 32);
    const senderCountry = (sellerProfile.country || "FR").toUpperCase().substring(0, 2);

    const recipientPostCode = (transaction.relay_point_postal_code || "").replace(/\s/g, "").substring(0, 10);
    const recipientCity = sanitize(transaction.relay_point_city || senderCity, 30);
    const relayAddress = sanitize(transaction.relay_point_address || "POINT RELAIS", 32);
    const relayName = sanitize(transaction.relay_point_name || "POINT RELAIS", 32);

    // Use relay_point_id from DB. Sendcloud IDs are long numeric strings (>6 digits) — reject them.
    const rawRelayId = (transaction.relay_point_id || "").trim();
    if (!rawRelayId) throw new Error("Point relais non défini pour cette commande.");
    if (/^\d{7,}$/.test(rawRelayId)) {
      throw new Error(
        `L'ID du point relais (${rawRelayId}) est un identifiant Sendcloud, pas un code Mondial Relay natif. ` +
        `Veuillez recréer la commande en sélectionnant le point relais depuis le nouveau sélecteur.`
      );
    }
    const relayPointId = rawRelayId;

    const orderRef = transaction.id.substring(0, 15).replace(/-/g, "").toUpperCase();
    const customerRef = (userId || transaction.seller_id).substring(0, 9).replace(/-/g, "").toUpperCase();

    const modeCol = "CCC";
    const modeLiv = "24R";

    // Exact field order from Mondial Relay WSI2 official documentation (MR_KEYS)
    const securityFields = [
      enseigne,                                      // Enseigne
      modeCol,                                       // ModeCol
      modeLiv,                                       // ModeLiv
      orderRef,                                      // NDossier
      customerRef,                                   // NClient
      senderCountry,                                 // Expe_Langage
      sellerLastname,                                // Expe_Ad1
      sellerFirstname,                               // Expe_Ad2
      senderStreet,                                  // Expe_Ad3
      "",                                            // Expe_Ad4
      senderCity,                                    // Expe_Ville
      senderPostCode,                                // Expe_CP
      senderCountry,                                 // Expe_Pays
      sellerPhone,                                   // Expe_Tel1
      "",                                            // Expe_Tel2
      (sellerProfile.email || "").substring(0, 70), // Expe_Mail
      "FR",                                          // Dest_Langage
      buyerLastname,                                 // Dest_Ad1
      buyerFirstname,                                // Dest_Ad2
      relayName,                                     // Dest_Ad3
      relayAddress,                                  // Dest_Ad4
      recipientCity,                                 // Dest_Ville
      recipientPostCode,                             // Dest_CP
      "FR",                                          // Dest_Pays
      buyerPhone,                                    // Dest_Tel1
      "",                                            // Dest_Tel2
      (buyerProfile?.email || "").substring(0, 70),  // Dest_Mail
      weightGrams.toString(),                        // Poids
      "",                                            // Longueur
      "",                                            // Taille
      "1",                                           // NbColis
      "0",                                           // CRT_Valeur
      "",                                            // CRT_Devise
      "",                                            // EXP_Valeur
      "",                                            // EXP_Devise
      "",                                            // COL_Rel_Pays
      "",                                            // COL_Rel
      "FR",                                          // LIV_Rel_Pays
      relayPointId,                                  // LIV_Rel
      "",                                            // TAvisage
      "",                                            // TReprise
      "",                                            // Montage
      "",                                            // TRDV
      "0",                                           // Assurance
      "",                                            // Instructions
      privateKey,
    ];

    const securityString = securityFields.join("");
    const security = await md5Hash(securityString);

    if (debug) {
      return new Response(JSON.stringify({ securityString, security, fields: {
        enseigne, modeCol, modeLiv, orderRef, customerRef, senderCountry,
        sellerLastname, sellerFirstname, senderStreet, senderCity, senderPostCode,
        sellerPhone, sellerEmail: (sellerProfile.email||"").substring(0,70),
        buyerLastname, buyerFirstname, relayName, recipientCity, recipientPostCode,
        buyerPhone, buyerEmail: (buyerProfile?.email||"").substring(0,70),
        weightGrams, relayPointId,
      }}), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const soapBody = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.mondialrelay.fr/webservice/">
  <soap:Body>
    <web:WSI2_CreationEtiquette>
      <web:Enseigne>${escapeXml(enseigne)}</web:Enseigne>
      <web:ModeCol>CCC</web:ModeCol>
      <web:ModeLiv>24R</web:ModeLiv>
      <web:NDossier>${escapeXml(orderRef)}</web:NDossier>
      <web:NClient>${escapeXml(customerRef)}</web:NClient>
      <web:Expe_Langage>${senderCountry}</web:Expe_Langage>
      <web:Expe_Ad1>${escapeXml(sellerLastname)}</web:Expe_Ad1>
      <web:Expe_Ad2>${escapeXml(sellerFirstname)}</web:Expe_Ad2>
      <web:Expe_Ad3>${escapeXml(senderStreet)}</web:Expe_Ad3>
      <web:Expe_Ad4></web:Expe_Ad4>
      <web:Expe_Ville>${escapeXml(senderCity)}</web:Expe_Ville>
      <web:Expe_CP>${escapeXml(senderPostCode)}</web:Expe_CP>
      <web:Expe_Pays>${senderCountry}</web:Expe_Pays>
      <web:Expe_Tel1>${escapeXml(sellerPhone)}</web:Expe_Tel1>
      <web:Expe_Tel2></web:Expe_Tel2>
      <web:Expe_Mail>${escapeXml((sellerProfile.email || "").substring(0, 70))}</web:Expe_Mail>
      <web:Dest_Langage>FR</web:Dest_Langage>
      <web:Dest_Ad1>${escapeXml(buyerLastname)}</web:Dest_Ad1>
      <web:Dest_Ad2>${escapeXml(buyerFirstname)}</web:Dest_Ad2>
      <web:Dest_Ad3>${escapeXml(relayName)}</web:Dest_Ad3>
      <web:Dest_Ad4>${escapeXml(relayAddress)}</web:Dest_Ad4>
      <web:Dest_Ville>${escapeXml(recipientCity)}</web:Dest_Ville>
      <web:Dest_CP>${escapeXml(recipientPostCode)}</web:Dest_CP>
      <web:Dest_Pays>FR</web:Dest_Pays>
      <web:Dest_Tel1>${escapeXml(buyerPhone)}</web:Dest_Tel1>
      <web:Dest_Tel2></web:Dest_Tel2>
      <web:Dest_Mail>${escapeXml((buyerProfile?.email || "").substring(0, 70))}</web:Dest_Mail>
      <web:Poids>${weightGrams}</web:Poids>
      <web:Longueur></web:Longueur>
      <web:Taille></web:Taille>
      <web:NbColis>1</web:NbColis>
      <web:CRT_Valeur>0</web:CRT_Valeur>
      <web:CRT_Devise></web:CRT_Devise>
      <web:EXP_Valeur></web:EXP_Valeur>
      <web:EXP_Devise></web:EXP_Devise>
      <web:COL_Rel_Pays></web:COL_Rel_Pays>
      <web:COL_Rel></web:COL_Rel>
      <web:LIV_Rel_Pays>FR</web:LIV_Rel_Pays>
      <web:LIV_Rel>${escapeXml(relayPointId)}</web:LIV_Rel>
      <web:TAvisage></web:TAvisage>
      <web:TReprise></web:TReprise>
      <web:Montage></web:Montage>
      <web:TRDV></web:TRDV>
      <web:Assurance>0</web:Assurance>
      <web:Instructions></web:Instructions>
      <web:Security>${security}</web:Security>
    </web:WSI2_CreationEtiquette>
  </soap:Body>
</soap:Envelope>`;

    console.log("Sending SOAP to Mondial Relay WSI2_CreationEtiquette");
    console.log("SOAP body:", soapBody);

    const response = await fetch("https://api.mondialrelay.com/WebService.asmx", {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": "http://www.mondialrelay.fr/webservice/WSI2_CreationEtiquette",
      },
      body: soapBody,
    });

    const responseText = await response.text();
    console.log("SOAP response status:", response.status);
    console.log("SOAP response:", responseText);

    const statMatch = responseText.match(/<STAT>([^<]*)<\/STAT>/i);
    if (statMatch && statMatch[1] !== "0") {
      const statCode = statMatch[1];
      let errorMsg = `Erreur Mondial Relay (code ${statCode})`;
      if (statCode === "62") errorMsg = "Erreur de sécurité (code 62). Vérifiez vos identifiants Mondial Relay.";
      else if (statCode === "38") errorMsg = "Données expéditeur invalides. Vérifiez votre adresse dans votre profil.";
      else if (statCode === "70" || statCode === "79") errorMsg = "Point relais invalide ou non trouvé. Veuillez resélectionner un point relais.";
      else if (statCode === "92") errorMsg = "Solde insuffisant sur votre compte Mondial Relay. Veuillez recharger votre compte sur le portail Mondial Relay Pro.";
      throw new Error(errorMsg);
    }

    const expeditionMatch = responseText.match(/<ExpeditionNum>([^<]+)<\/ExpeditionNum>/i);
    const urlEtiquetteMatch = responseText.match(/<URL_Etiquette>([^<]+)<\/URL_Etiquette>/i);

    if (!expeditionMatch) {
      const preview = responseText.substring(0, 600).replace(/</g, "[").replace(/>/g, "]");
      throw new Error(`Réponse inattendue de Mondial Relay: ${preview}`);
    }

    const expeditionNumber = expeditionMatch[1].trim();
    const labelUrl = urlEtiquetteMatch ? urlEtiquetteMatch[1].trim().replace(/&amp;/g, "&") : "";

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
