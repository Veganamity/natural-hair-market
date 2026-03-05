import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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

    const response = await fetch("https://connect-api.mondialrelay.com/api/parcelshop/search", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log('Mondial Relay API response status:', response.status);
    console.log('Mondial Relay API response:', responseText);

    if (!response.ok) {
      console.error('Mondial Relay API error:', responseText);
      throw new Error(`Mondial Relay API error (${response.status}): ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      throw new Error('Invalid JSON response from Mondial Relay API');
    }

    if (!data) {
      throw new Error('Empty response from Mondial Relay API');
    }

    if (data.error || data.Error || data.ErrorMessage) {
      const errorMsg = data.error || data.Error || data.ErrorMessage;
      throw new Error(`Mondial Relay API error: ${errorMsg}`);
    }

    let relayPoints = [];

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
    } else {
      console.error('Unexpected response structure:', data);
    }

    console.log(`Found ${relayPoints.length} Mondial Relay points`);

    return new Response(
      JSON.stringify({
        success: true,
        relayPoints,
        debug: {
          requestBody,
          responseStatus: response.status,
          responseData: data,
        }
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
