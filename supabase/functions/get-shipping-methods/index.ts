import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ShippingMethodRequest {
  country: string;
  postal_code: string;
  weight: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const sendcloudApiKey = Deno.env.get("SENDCLOUD_API_KEY");
    const sendcloudApiSecret = Deno.env.get("SENDCLOUD_API_SECRET");

    if (!sendcloudApiKey || !sendcloudApiSecret) {
      throw new Error("Sendcloud API credentials not configured");
    }

    const { country, postal_code, weight }: ShippingMethodRequest = await req.json();

    if (!country || !postal_code || !weight) {
      return new Response(
        JSON.stringify({ error: "Country, postal code, and weight are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const sendcloudAuth = btoa(`${sendcloudApiKey}:${sendcloudApiSecret}`);

    const response = await fetch(
      `https://panel.sendcloud.sc/api/v2/shipping_methods?to_country=${country}&weight=${weight}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Basic ${sendcloudAuth}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Sendcloud API error: ${errorData}`);
    }

    const data = await response.json();

    const shippingMethods = data.shipping_methods.map((method: any) => ({
      id: method.id,
      name: method.name,
      carrier: method.carrier,
      price: method.price,
      currency: method.currency || "EUR",
      min_weight: method.min_weight,
      max_weight: method.max_weight,
      countries: method.countries,
      service_point_required: method.service_point_input === "required",
    }));

    return new Response(
      JSON.stringify({
        shipping_methods: shippingMethods,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching shipping methods:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});