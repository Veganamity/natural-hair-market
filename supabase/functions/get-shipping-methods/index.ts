import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function isRelayDelivery(name: string, servicePointInput: string): boolean {
  const n = name?.toLowerCase() ?? '';
  return (
    servicePointInput === 'required' ||
    n.includes('relay') ||
    n.includes('relais') ||
    n.includes('shop2shop') ||
    n.includes('locker') ||
    n.includes('service point') ||
    n.includes('point retrait')
  );
}

function isHomeDelivery(name: string, servicePointInput: string): boolean {
  return !isRelayDelivery(name, servicePointInput);
}

interface ShippingMethod {
  id: number;
  name: string;
  carrier: string;
  min_weight: number;
  max_weight: number;
  price: number;
  service_point_input: string;
}

function deduplicateMethods(methods: ShippingMethod[]): ShippingMethod[] {
  const groups = new Map<string, ShippingMethod>();

  for (const m of methods) {
    const relay = isRelayDelivery(m.name, m.service_point_input);
    const groupKey = `${m.carrier.toLowerCase()}__${relay ? 'relay' : 'home'}`;

    const existing = groups.get(groupKey);
    if (!existing || m.price < existing.price) {
      groups.set(groupKey, m);
    }
  }

  return Array.from(groups.values()).sort((a, b) => a.price - b.price);
}

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
    const allMethods = data.shipping_methods || [];

    const filtered: ShippingMethod[] = allMethods
      .map((m: any) => {
        const countryData = (m.countries || []).find(
          (c: any) => c.iso_2?.toUpperCase() === toCountry.toUpperCase()
        );

        const rawPrice = countryData?.price ?? m.price ?? null;
        if (rawPrice === null || rawPrice === undefined) return null;

        const price = typeof rawPrice === "string" ? parseFloat(rawPrice) : rawPrice;
        if (isNaN(price)) return null;

        const minWeight = parseFloat(countryData?.min_weight ?? m.min_weight ?? "0");
        const maxWeight = parseFloat(countryData?.max_weight ?? m.max_weight ?? "99999");

        if (weightKg < minWeight || weightKg > maxWeight) return null;

        return {
          id: m.id,
          name: m.name,
          carrier: m.carrier || '',
          min_weight: minWeight,
          max_weight: maxWeight,
          price,
          service_point_input: m.service_point_input || 'none',
        } as ShippingMethod;
      })
      .filter(Boolean) as ShippingMethod[];

    const deduplicated = deduplicateMethods(filtered);

    return new Response(
      JSON.stringify({ shipping_methods: deduplicated }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
