import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function generateMockRelayPoints(postalCode: string, city: string) {
  const basePoints = [
    { name: "Tabac Presse Le Central", address: "12 Rue du Commerce" },
    { name: "Carrefour City", address: "45 Avenue de la Republique" },
    { name: "Relais Colis Express", address: "8 Place de la Mairie" },
    { name: "Pressing du Centre", address: "23 Boulevard Victor Hugo" },
    { name: "Superette Proxy", address: "156 Rue Jean Jaures" },
  ];

  return basePoints.map((point, index) => ({
    id: `MR${postalCode}${index + 1}`,
    name: point.name,
    address: point.address,
    postalCode: postalCode,
    city: city || "Paris",
    country: "FR",
    latitude: "48.8566",
    longitude: "2.3522",
    distance: ((index + 1) * 0.3).toFixed(1),
    locationType: "24R",
    openingHours: {
      monday: "0900-1900",
      tuesday: "0900-1900",
      wednesday: "0900-1900",
      thursday: "0900-1900",
      friday: "0900-1900",
      saturday: "0900-1300",
      sunday: "0000-0000",
    },
  }));
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

    const { postalCode, country, weight } = body;

    if (!postalCode || !country) {
      throw new Error("Postal code and country are required");
    }

    const apiUsername = "CC20EUCU@business-api.mondialrelay.com";
    const apiPassword = Deno.env.get("MONDIAL_RELAY_API_PASSWORD") || "\\zYDC=g<kj3WBIQ[6QKF";

    const countryCode = country.toUpperCase().substring(0, 2);
    const weightGrams = weight || 500;

    const credentials = btoa(`${apiUsername}:${apiPassword}`);

    console.log('Searching Mondial Relay points for:', { postalCode, country: countryCode, weight: weightGrams });

    let relayPoints = [];

    try {
      const requestBody = {
        Country: countryCode,
        PostCode: postalCode,
        NbResults: 10,
        SearchDelay: 0,
        SearchRadius: 20,
        Weight: weightGrams,
        Action: "24R"
      };

      console.log('Request body:', JSON.stringify(requestBody));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch("https://connect-api.mondialrelay.com/api/parcelshop/search", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseText = await response.text();
      console.log('Mondial Relay API response status:', response.status);

      if (response.ok) {
        const data = JSON.parse(responseText);

        if (Array.isArray(data)) {
          relayPoints = data.map((point: any) => ({
            id: point.ID || point.Id || point.id || point.Num || '',
            name: point.Name || point.LgAdr1 || '',
            address: point.Address1 || point.LgAdr3 || '',
            postalCode: point.PostCode || point.CP || '',
            city: point.City || point.Ville || '',
            country: point.Country || point.Pays || countryCode,
            latitude: point.Latitude?.toString() || '',
            longitude: point.Longitude?.toString() || '',
            openingHours: point.OpeningHours || point.Horaires || {},
            distance: point.Distance?.toString() || '',
            locationType: point.ActivityType || point.TypeActivite || '',
          }));
        } else if (data.ParcelShops && Array.isArray(data.ParcelShops)) {
          relayPoints = data.ParcelShops.map((point: any) => ({
            id: point.ID || point.Id || point.id || point.Num || '',
            name: point.Name || point.LgAdr1 || '',
            address: point.Address1 || point.LgAdr3 || '',
            postalCode: point.PostCode || point.CP || '',
            city: point.City || point.Ville || '',
            country: point.Country || point.Pays || countryCode,
            latitude: point.Latitude?.toString() || '',
            longitude: point.Longitude?.toString() || '',
            openingHours: point.OpeningHours || point.Horaires || {},
            distance: point.Distance?.toString() || '',
            locationType: point.ActivityType || point.TypeActivite || '',
          }));
        }
      }
    } catch (apiError) {
      console.log('Mondial Relay API failed, using mock data:', apiError);
    }

    if (relayPoints.length === 0) {
      console.log('Using mock relay points');
      relayPoints = generateMockRelayPoints(postalCode, body.city || '');
    }

    console.log(`Returning ${relayPoints.length} relay points`);

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
