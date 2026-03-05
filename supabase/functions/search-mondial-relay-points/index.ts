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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { postalCode, country, weight } = await req.json();

    if (!postalCode || !country) {
      throw new Error("Postal code and country are required");
    }

    const enseigne = Deno.env.get("MONDIAL_RELAY_ENSEIGNE");
    const marque = Deno.env.get("MONDIAL_RELAY_MARQUE") || "CC";

    if (!enseigne) {
      throw new Error("Mondial Relay credentials not configured");
    }

    const countryCode = country.toUpperCase().substring(0, 2);
    const weightGrams = weight || 500;
    const weightInGrams = Math.ceil(weightGrams / 100) * 100;

    const paramsForSecurity = `${enseigne}${countryCode}${postalCode}${weightInGrams}`;
    const securityHash = generateMD5Security(paramsForSecurity);

    const soapBody = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Body>
    <WSI2_PointRelais_Recherche xmlns="http://www.mondialrelay.fr/webservice/">
      <Enseigne>${enseigne}</Enseigne>
      <Pays>${countryCode}</Pays>
      <Ville></Ville>
      <CP>${postalCode}</CP>
      <Latitude></Latitude>
      <Longitude></Longitude>
      <Taille></Taille>
      <Poids>${weightInGrams}</Poids>
      <Action>REL</Action>
      <DelaiEnvoi>0</DelaiEnvoi>
      <RayonRecherche>20</RayonRecherche>
      <NombreResultats>10</NombreResultats>
      <Security>${securityHash}</Security>
    </WSI2_PointRelais_Recherche>
  </soap:Body>
</soap:Envelope>`;

    console.log('Searching Mondial Relay points for:', { postalCode, country: countryCode, weight: weightInGrams });

    const response = await fetch("https://api.mondialrelay.com/WebService.asmx", {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": "http://www.mondialrelay.fr/webservice/WSI2_PointRelais_Recherche",
      },
      body: soapBody,
    });

    const responseText = await response.text();
    console.log('Mondial Relay API response status:', response.status);

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

    const pointRelaisMatches = responseText.matchAll(/<PointRelais_Details>([\s\S]*?)<\/PointRelais_Details>/g);
    const relayPoints = [];

    for (const match of pointRelaisMatches) {
      const pointXml = match[1];

      const extractField = (field: string): string => {
        const fieldMatch = pointXml.match(new RegExp(`<${field}>(.*?)<\/${field}>`));
        return fieldMatch ? fieldMatch[1].trim() : '';
      };

      const relayPoint = {
        id: extractField('Num'),
        name: extractField('LgAdr1'),
        address: extractField('LgAdr3'),
        postalCode: extractField('CP'),
        city: extractField('Ville'),
        country: extractField('Pays'),
        latitude: extractField('Latitude'),
        longitude: extractField('Longitude'),
        openingHours: {
          monday: extractField('Horaires_Lundi'),
          tuesday: extractField('Horaires_Mardi'),
          wednesday: extractField('Horaires_Mercredi'),
          thursday: extractField('Horaires_Jeudi'),
          friday: extractField('Horaires_Vendredi'),
          saturday: extractField('Horaires_Samedi'),
          sunday: extractField('Horaires_Dimanche'),
        },
        distance: extractField('Distance'),
        locationType: extractField('TypeActivite'),
      };

      relayPoints.push(relayPoint);
    }

    console.log(`Found ${relayPoints.length} Mondial Relay points`);

    return new Response(
      JSON.stringify({
        success: true,
        relayPoints,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error searching Mondial Relay points:", error);

    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
        relayPoints: [],
      }),
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
