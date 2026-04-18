import "jsr:@supabase/functions-js/edge-runtime.d.ts";
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
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON body", relayPoints: [] }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { postalCode, country } = body;

    if (!postalCode || !country) {
      throw new Error("Postal code and country are required");
    }

    const countryCode = country.toUpperCase().substring(0, 2);
    console.log('Searching Mondial Relay points for:', { postalCode, country: countryCode });

    const enseigne = Deno.env.get("MONDIAL_RELAY_BRAND_ID") || "CC20EUCU";
    const privateKey = Deno.env.get("MONDIAL_RELAY_PRIVATE_KEY") || "Nvhs3RMN";

    const securityString = `${enseigne}${countryCode}${postalCode}${privateKey}`;
    const security = await md5Hash(securityString);

    console.log('Security string parts:', { enseigne, countryCode, postalCode });

    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.mondialrelay.fr/webservice/">
  <soap:Body>
    <web:WSI4_PointRelais_Recherche>
      <web:Enseigne>${enseigne}</web:Enseigne>
      <web:Pays>${countryCode}</web:Pays>
      <web:CP>${postalCode}</web:CP>
      <web:NombreResultats>20</web:NombreResultats>
      <web:Security>${security}</web:Security>
    </web:WSI4_PointRelais_Recherche>
  </soap:Body>
</soap:Envelope>`;

    console.log('Calling Mondial Relay SOAP API...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch("https://api.mondialrelay.com/WebService.asmx", {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": "http://www.mondialrelay.fr/webservice/WSI4_PointRelais_Recherche",
      },
      body: soapEnvelope,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseText = await response.text();
    console.log('SOAP response status:', response.status);
    console.log('SOAP response preview:', responseText.substring(0, 1000));

    const statMatch = responseText.match(/<STAT>([^<]*)<\/STAT>/);
    if (statMatch && statMatch[1] !== '0') {
      throw new Error(`Erreur API Mondial Relay (code ${statMatch[1]}). Vérifiez vos identifiants.`);
    }

    if (!response.ok || !responseText.includes("PointRelais_Details")) {
      throw new Error("Impossible de récupérer les points relais Mondial Relay. Vérifiez votre connexion ou réessayez.");
    }

    const relayPoints: any[] = [];
    const pointsMatch = responseText.match(/<PointRelais_Details>([\s\S]*?)<\/PointRelais_Details>/g);

    if (pointsMatch) {
      console.log(`Found ${pointsMatch.length} relay points`);

      pointsMatch.forEach((pointXml) => {
        const getValue = (tag: string): string => {
          const match = pointXml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
          return match ? match[1].trim() : '';
        };

        const num = getValue('Num');
        const lgAdr1 = getValue('LgAdr1');
        const lgAdr3 = getValue('LgAdr3');
        const cp = getValue('CP');
        const ville = getValue('Ville');
        const pays = getValue('Pays');
        const lat = getValue('Latitude');
        const lng = getValue('Longitude');
        const distanceMeters = getValue('Distance');

        let latNum = '';
        let lngNum = '';
        if (lat) {
          const latStr = lat.replace(',', '.');
          if (latStr.includes('.')) {
            latNum = latStr;
          } else {
            const latVal = parseFloat(latStr);
            latNum = (latVal / 1000000).toFixed(6);
          }
        }
        if (lng) {
          const lngStr = lng.replace(',', '.');
          if (lngStr.includes('.')) {
            lngNum = lngStr;
          } else {
            const lngVal = parseFloat(lngStr);
            lngNum = (lngVal / 1000000).toFixed(6);
          }
        }

        let distanceKm = '';
        if (distanceMeters) {
          const meters = parseInt(distanceMeters, 10);
          if (!isNaN(meters)) distanceKm = (meters / 1000).toFixed(1);
        }

        const getHours = (day: string): string => {
          const h1 = getValue(`Horaires_${day}`);
          if (!h1 || h1.length < 8) return "09:00-19:00";
          return h1.replace(/(\d{2})(\d{2})/g, '$1:$2') || "09:00-19:00";
        };

        if (num && lgAdr1) {
          relayPoints.push({
            id: num,
            name: lgAdr1,
            address: lgAdr3 || lgAdr1,
            postalCode: cp,
            city: ville,
            country: pays || countryCode,
            latitude: latNum,
            longitude: lngNum,
            distance: distanceKm,
            locationType: '24R',
            openingHours: {
              monday: getHours('Lundi'),
              tuesday: getHours('Mardi'),
              wednesday: getHours('Mercredi'),
              thursday: getHours('Jeudi'),
              friday: getHours('Vendredi'),
              saturday: getHours('Samedi'),
              sunday: getHours('Dimanche'),
            },
          });
        }
      });

      relayPoints.sort((a, b) => parseFloat(a.distance || '999') - parseFloat(b.distance || '999'));
    }

    if (relayPoints.length === 0) {
      throw new Error(`Aucun point relais Mondial Relay trouvé pour le code postal ${postalCode}.`);
    }

    console.log(`Returning ${relayPoints.length} relay points`);

    return new Response(
      JSON.stringify({ success: true, relayPoints, count: relayPoints.length, source: 'mondialrelay' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error searching Mondial Relay points:", error);

    return new Response(
      JSON.stringify({ error: error.message || "Unknown error", success: false, relayPoints: [] }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
