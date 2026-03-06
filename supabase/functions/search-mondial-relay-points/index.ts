import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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

function parseHours(hourStr: string): string {
  if (!hourStr || hourStr === "0000" || hourStr.length !== 4) return "0000-0000";
  return `${hourStr.substring(0, 2)}:${hourStr.substring(2, 4)}`;
}

function parseOpeningHours(horaires: any): RelayPoint['openingHours'] {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const result: any = {};

  days.forEach((day, index) => {
    const dayNum = index + 1;
    const h1Start = horaires?.[`Horaires_${day.charAt(0).toUpperCase() + day.slice(1)}`]?.string?.[0] || '';
    const h1End = horaires?.[`Horaires_${day.charAt(0).toUpperCase() + day.slice(1)}`]?.string?.[1] || '';
    const h2Start = horaires?.[`Horaires_${day.charAt(0).toUpperCase() + day.slice(1)}`]?.string?.[2] || '';
    const h2End = horaires?.[`Horaires_${day.charAt(0).toUpperCase() + day.slice(1)}`]?.string?.[3] || '';

    let openStr = "0000-0000";
    if (h1Start && h1End && h1Start !== "0000" && h1End !== "0000") {
      openStr = `${h1Start}-${h1End}`;
      if (h2Start && h2End && h2Start !== "0000" && h2End !== "0000") {
        openStr = `${h1Start}-${h1End}, ${h2Start}-${h2End}`;
      }
    }
    result[day] = openStr;
  });

  return result;
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

    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://www.mondialrelay.fr/webservice/">
  <soap:Body>
    <tns:WSI4_PointRelais_Recherche>
      <tns:Enseigne>BDTEST13</tns:Enseigne>
      <tns:Pays>${countryCode}</tns:Pays>
      <tns:CP>${postalCode}</tns:CP>
      <tns:NombreResultats>20</tns:NombreResultats>
      <tns:Security>PrivateK</tns:Security>
    </tns:WSI4_PointRelais_Recherche>
  </soap:Body>
</soap:Envelope>`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

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
      console.log('Mondial Relay SOAP response status:', response.status);

      if (response.ok && responseText.includes("PointRelais_Details")) {
        const pointsMatch = responseText.match(/<PointRelais_Details>([\s\S]*?)<\/PointRelais_Details>/g);

        if (pointsMatch) {
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

            const latNum = lat ? (parseFloat(lat.replace(',', '.')) / 100000).toFixed(6) : '';
            const lngNum = lng ? (parseFloat(lng.replace(',', '.')) / 100000).toFixed(6) : '';

            const getHours = (day: string): string => {
              const h1 = getValue(`Horaires_${day}`);
              if (!h1 || h1.length < 8) return "0000-0000";
              const open1 = h1.substring(0, 4);
              const close1 = h1.substring(4, 8);
              if (open1 === "0000" && close1 === "0000") return "0000-0000";
              let result = `${open1}-${close1}`;
              if (h1.length >= 16) {
                const open2 = h1.substring(8, 12);
                const close2 = h1.substring(12, 16);
                if (open2 !== "0000" && close2 !== "0000") {
                  result += ` ${open2}-${close2}`;
                }
              }
              return result;
            };

            if (num && lgAdr1) {
              relayPoints.push({
                id: num,
                name: lgAdr1,
                address: lgAdr3,
                postalCode: cp,
                city: ville,
                country: pays || countryCode,
                latitude: latNum,
                longitude: lngNum,
                distance: '',
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

      console.log(`Parsed ${relayPoints.length} points from SOAP response`);
    } catch (apiError) {
      console.log('Mondial Relay SOAP API failed:', apiError);
    }

    if (relayPoints.length === 0) {
      try {
        const jsonUrl = `https://widget.mondialrelay.com/parcelshop-picker/v4_0/data/FR/${postalCode}?maxResults=20`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const jsonResponse = await fetch(jsonUrl, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Origin": "https://www.mondialrelay.fr",
            "Referer": "https://www.mondialrelay.fr/",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (jsonResponse.ok) {
          const jsonData = await jsonResponse.json();
          console.log('Widget API response:', JSON.stringify(jsonData).substring(0, 500));

          if (Array.isArray(jsonData)) {
            jsonData.forEach((point: any) => {
              relayPoints.push({
                id: point.ID || point.Num || '',
                name: point.Nom || point.LgAdr1 || '',
                address: point.Adresse || point.LgAdr3 || '',
                postalCode: point.CP || '',
                city: point.Ville || '',
                country: point.Pays || 'FR',
                latitude: point.Lat?.toString() || point.Latitude?.toString() || '',
                longitude: point.Long?.toString() || point.Longitude?.toString() || '',
                distance: point.Distance?.toString() || '',
                locationType: '24R',
                openingHours: {
                  monday: point.Horaires?.Lundi || '0900-1900',
                  tuesday: point.Horaires?.Mardi || '0900-1900',
                  wednesday: point.Horaires?.Mercredi || '0900-1900',
                  thursday: point.Horaires?.Jeudi || '0900-1900',
                  friday: point.Horaires?.Vendredi || '0900-1900',
                  saturday: point.Horaires?.Samedi || '0900-1300',
                  sunday: point.Horaires?.Dimanche || '0000-0000',
                },
              });
            });
          }
        }
        console.log(`Widget API returned ${relayPoints.length} points`);
      } catch (widgetError) {
        console.log('Widget API failed:', widgetError);
      }
    }

    if (relayPoints.length === 0) {
      try {
        const geoUrl = `https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&country=${countryCode}&format=json&limit=1`;

        const geoResponse = await fetch(geoUrl, {
          headers: { "User-Agent": "HairMarketplace/1.0" }
        });

        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.length > 0) {
            const lat = parseFloat(geoData[0].lat);
            const lon = parseFloat(geoData[0].lon);

            const overpassQuery = `
              [out:json][timeout:10];
              (
                node["amenity"="post_office"](around:5000,${lat},${lon});
                node["shop"="convenience"](around:3000,${lat},${lon});
                node["shop"="newsagent"](around:3000,${lat},${lon});
              );
              out body 20;
            `;

            const overpassResponse = await fetch("https://overpass-api.de/api/interpreter", {
              method: "POST",
              body: overpassQuery,
            });

            if (overpassResponse.ok) {
              const overpassData = await overpassResponse.json();

              overpassData.elements?.slice(0, 15).forEach((element: any, index: number) => {
                const name = element.tags?.name || element.tags?.operator || `Point Relais ${index + 1}`;
                const street = element.tags?.["addr:street"] || "";
                const houseNumber = element.tags?.["addr:housenumber"] || "";
                const address = houseNumber ? `${houseNumber} ${street}` : street || "Adresse non disponible";

                relayPoints.push({
                  id: `OSM${element.id}`,
                  name: name,
                  address: address,
                  postalCode: element.tags?.["addr:postcode"] || postalCode,
                  city: element.tags?.["addr:city"] || geoData[0].display_name?.split(',')[0] || '',
                  country: countryCode,
                  latitude: element.lat?.toString() || '',
                  longitude: element.lon?.toString() || '',
                  distance: '',
                  locationType: 'OSM',
                  openingHours: {
                    monday: '0900-1900',
                    tuesday: '0900-1900',
                    wednesday: '0900-1900',
                    thursday: '0900-1900',
                    friday: '0900-1900',
                    saturday: '0900-1300',
                    sunday: '0000-0000',
                  },
                });
              });
            }
          }
        }
        console.log(`OpenStreetMap fallback returned ${relayPoints.length} points`);
      } catch (osmError) {
        console.log('OSM fallback failed:', osmError);
      }
    }

    console.log(`Returning ${relayPoints.length} relay points`);

    return new Response(
      JSON.stringify({
        success: true,
        relayPoints,
        source: relayPoints.length > 0 ? (relayPoints[0].id.startsWith('OSM') ? 'openstreetmap' : 'mondialrelay') : 'none',
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
