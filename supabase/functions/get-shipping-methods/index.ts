import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const sendcloudApiKey = Deno.env.get("SENDCLOUD_API_KEY");
    const sendcloudApiSecret = Deno.env.get("SENDCLOUD_API_SECRET");

    if (!sendcloudApiKey || !sendcloudApiSecret) {
      throw new Error("Sendcloud API credentials not configured");
    }

    const { toCountry, weightGrams } = await req.json();

    if (!toCountry) {
      return new Response(
        JSON.stringify({ error: "toCountry is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sendcloudAuth = btoa(`${sendcloudApiKey}:${sendcloudApiSecret}`);

    const weightKg = Math.max((weightGrams || 100) / 1000, 0.001);

    const url = `https://panel.sendcloud.sc/api/v2/shipping_methods?to_country=${toCountry}&weight=${weightKg}`;

    const response = await fetch(url, {
      headers: {
        "Authorization": `Basic ${sendcloudAuth}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Sendcloud error: ${errText}`);
    }

    const data = await response.json();

    const allMethods = (data.shipping_methods || []);

    const methods = allMethods
      .map((m: any) => {
        const countryData = (m.countries || []).find(
          (c: any) => c.iso_2?.toUpperCase() === toCountry.toUpperCase()
        );

        const price = countryData?.price ?? m.price ?? null;
        const minWeight = parseFloat(countryData?.min_weight ?? m.min_weight ?? "0");
        const maxWeight = parseFloat(countryData?.max_weight ?? m.max_weight ?? "99999");

        if (price === null || price === undefined) return null;

        if (weightKg < minWeight || weightKg > maxWeight) return null;

        return {
          id: m.id,
          name: m.name,
          carrier: m.carrier,
          min_weight: minWeight,
          max_weight: maxWeight,
          price: typeof price === "string" ? parseFloat(price) : price,
          service_point_input: m.service_point_input,
          countries: m.countries,
        };
      })
      .filter(Boolean);

    return new Response(
      JSON.stringify({ shipping_methods: methods }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
