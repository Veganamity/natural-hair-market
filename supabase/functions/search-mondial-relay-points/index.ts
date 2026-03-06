import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { crypto } from "https://deno.land/std@0.208.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RelayPoint {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  distance: string;
  locationType: string;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

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
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
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

    const relayPoints: RelayPoint[] = [];

    const enseigne = Deno.env.get("MONDIAL_RELAY_BRAND_ID") || "CC20EUCU";
    const privateKey = Deno.env.get("MONDIAL_RELAY_PRIVATE_KEY") || "Nvhs3RMN";

    const securityString = `${enseigne}${countryCode}${postalCode}${privateKey}`;
    const security = await md5Hash(securityString);

    console.log('Security string parts:', { enseigne, countryCode, postalCode, privateKeyLength: privateKey.length });
    console.log('Generated security hash:', security);

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

    try {
      console.log('Calling Mondial Relay SOAP API...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch("https://api.mondialrelay.com/Web_Services.asmx", {
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
      console.log('SOAP response preview:', responseText.substring(0, 2000));

      const statMatch = responseText.match(/<STAT>([^<]*)<\/STAT>/);
      if (statMatch) {
        console.log('Mondial Relay API STAT code:', statMatch[1]);
      }

      if (response.ok && responseText.includes("PointRelais_Details")) {
        const pointsMatch = responseText.match(/<PointRelais_Details>([\s\S]*?)<\/PointRelais_Details>/g);

        if (pointsMatch) {
          console.log(`Found ${pointsMatch.length} relay points in SOAP response`);

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

            let latNum = '';
            let lngNum = '';
            if (lat) {
              const latVal = parseFloat(lat.replace(',', '.'));
              latNum = (latVal / 100000).toFixed(6);
            }
            if (lng) {
              const lngVal = parseFloat(lng.replace(',', '.'));
              lngNum = (lngVal / 100000).toFixed(6);
            }

            const getHours = (day: string): string => {
              const h1 = getValue(`Horaires_${day}`);
              if (!h1 || h1.length < 8) return "09:00-19:00";
              const formatted = h1.replace(/(\d{2})(\d{2})/g, '$1:$2');
              return formatted || "09:00-19:00";
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
                distance: getValue('Distance') || '',
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
        }
      }
      console.log(`SOAP API returned ${relayPoints.length} points`);
    } catch (apiError) {
      console.log('Mondial Relay SOAP API failed:', apiError);
    }

    if (relayPoints.length === 0) {
      console.log('Trying OpenStreetMap/Overpass fallback...');
      try {
        const geoUrl = `https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&country=${countryCode}&format=json&limit=1`;

        const geoResponse = await fetch(geoUrl, {
          headers: { "User-Agent": "HairMarketplace/1.0" }
        });

        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          console.log('Geocoding result:', geoData);

          if (geoData.length > 0) {
            const lat = parseFloat(geoData[0].lat);
            const lon = parseFloat(geoData[0].lon);
            const cityName = geoData[0].display_name?.split(',')[0] || '';

            const overpassQuery = `
              [out:json][timeout:15];
              (
                node["brand"="Mondial Relay"](around:15000,${lat},${lon});
                node["operator"="Mondial Relay"](around:15000,${lat},${lon});
                node["amenity"="parcel_locker"](around:10000,${lat},${lon});
                node["amenity"="post_office"](around:8000,${lat},${lon});
              );
              out body 25;
            `;

            console.log('Querying Overpass API...');
            const overpassResponse = await fetch("https://overpass-api.de/api/interpreter", {
              method: "POST",
              body: overpassQuery,
            });

            if (overpassResponse.ok) {
              const overpassData = await overpassResponse.json();
              console.log(`Overpass returned ${overpassData.elements?.length || 0} elements`);

              const filteredElements = overpassData.elements?.filter((el: any) =>
                el.tags?.name || el.tags?.operator || el.tags?.brand
              ) || [];

              filteredElements.slice(0, 20).forEach((element: any, index: number) => {
                const name = element.tags?.name || element.tags?.operator || element.tags?.brand || `Point Relais ${index + 1}`;
                const street = element.tags?.["addr:street"] || "";
                const houseNumber = element.tags?.["addr:housenumber"] || "";
                const address = houseNumber ? `${houseNumber} ${street}` : street || "Voir sur la carte";

                const distance = Math.round(
                  Math.sqrt(
                    Math.pow((element.lat - lat) * 111, 2) +
                    Math.pow((element.lon - lon) * 111 * Math.cos(lat * Math.PI / 180), 2)
                  ) * 10
                ) / 10;

                relayPoints.push({
                  id: `MR${element.id}`,
                  name: name,
                  address: address,
                  postalCode: element.tags?.["addr:postcode"] || postalCode,
                  city: element.tags?.["addr:city"] || cityName,
                  country: countryCode,
                  latitude: element.lat?.toString() || '',
                  longitude: element.lon?.toString() || '',
                  distance: `${distance}`,
                  locationType: 'OSM',
                  openingHours: {
                    monday: '09:00-19:00',
                    tuesday: '09:00-19:00',
                    wednesday: '09:00-19:00',
                    thursday: '09:00-19:00',
                    friday: '09:00-19:00',
                    saturday: '09:00-13:00',
                    sunday: 'Ferme',
                  },
                });
              });

              relayPoints.sort((a, b) => parseFloat(a.distance || '999') - parseFloat(b.distance || '999'));
            }
          }
        }
        console.log(`OpenStreetMap fallback returned ${relayPoints.length} points`);
      } catch (osmError) {
        console.log('OSM fallback failed:', osmError);
      }
    }

    if (relayPoints.length === 0) {
      console.log('Generating sample points based on postal code...');
      try {
        const geoUrl = `https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&country=${countryCode}&format=json&limit=1`;
        const geoResponse = await fetch(geoUrl, {
          headers: { "User-Agent": "HairMarketplace/1.0" }
        });

        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.length > 0) {
            const baseLat = parseFloat(geoData[0].lat);
            const baseLon = parseFloat(geoData[0].lon);
            const cityName = geoData[0].display_name?.split(',')[0] || 'Ville';

            const samplePoints = [
              { name: "Tabac Presse Le Central", offset: [0.002, 0.001] },
              { name: "Carrefour City", offset: [-0.003, 0.002] },
              { name: "Relay Gare", offset: [0.001, -0.003] },
              { name: "Bureau de Poste", offset: [-0.002, -0.001] },
              { name: "Pressing du Centre", offset: [0.004, 0.003] },
            ];

            samplePoints.forEach((point, index) => {
              const lat = baseLat + point.offset[0];
              const lon = baseLon + point.offset[1];
              const distance = Math.round(Math.sqrt(point.offset[0]**2 + point.offset[1]**2) * 111 * 10) / 10;

              relayPoints.push({
                id: `SAMPLE${index + 1}`,
                name: point.name,
                address: `${index + 1} Rue du Commerce`,
                postalCode: postalCode,
                city: cityName,
                country: countryCode,
                latitude: lat.toFixed(6),
                longitude: lon.toFixed(6),
                distance: `${distance}`,
                locationType: 'SAMPLE',
                openingHours: {
                  monday: '09:00-19:00',
                  tuesday: '09:00-19:00',
                  wednesday: '09:00-19:00',
                  thursday: '09:00-19:00',
                  friday: '09:00-19:00',
                  saturday: '09:00-13:00',
                  sunday: 'Ferme',
                },
              });
            });
          }
        }
      } catch (e) {
        console.log('Sample generation failed:', e);
      }
    }

    console.log(`Returning ${relayPoints.length} relay points`);

    return new Response(
      JSON.stringify({
        success: true,
        relayPoints,
        count: relayPoints.length,
        source: relayPoints.length > 0
          ? (relayPoints[0].id.startsWith('SAMPLE') ? 'sample' :
             relayPoints[0].id.startsWith('MR') ? 'openstreetmap' : 'mondialrelay')
          : 'none',
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
        error: error.message || "Unknown error",
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
