import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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

    const apiUsername = Deno.env.get("MONDIAL_RELAY_API_USERNAME") || "CC20EUCU@business-api.mondialrelay.com";
    const apiPassword = Deno.env.get("MONDIAL_RELAY_API_PASSWORD");

    if (!apiPassword) {
      throw new Error("Mondial Relay API credentials not configured");
    }

    const countryCode = country.toUpperCase().substring(0, 2);
    const weightGrams = weight || 500;

    const credentials = btoa(`${apiUsername}:${apiPassword}`);

    console.log('Searching Mondial Relay points for:', { postalCode, country: countryCode, weight: weightGrams });

    const searchParams = new URLSearchParams({
      Country: countryCode,
      PostCode: postalCode,
      NbResults: "10",
      SearchDelay: "0",
      SearchRadius: "20000",
      Weight: weightGrams.toString(),
    });

    const apiUrl = `https://connect-api.mondialrelay.com/api/parcelshop/search?${searchParams.toString()}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Accept": "application/json",
      },
    });

    const responseText = await response.text();
    console.log('Mondial Relay API response status:', response.status);

    if (!response.ok) {
      console.error('Mondial Relay API error:', responseText);
      throw new Error(`Mondial Relay API error: ${responseText}`);
    }

    const data = JSON.parse(responseText);

    if (!data || !Array.isArray(data)) {
      console.error('Unexpected response format:', data);
      throw new Error('Invalid response format from Mondial Relay API');
    }

    const relayPoints = data.map((point: any) => ({
      id: point.ID || point.Id || point.id,
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
