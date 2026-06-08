import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const sendcloudApiKey = Deno.env.get("SENDCLOUD_API_KEY");
    const sendcloudApiSecret = Deno.env.get("SENDCLOUD_API_SECRET");
    if (!sendcloudApiKey || !sendcloudApiSecret) {
      throw new Error("Sendcloud API credentials not configured");
    }

    const { buybackId } = await req.json();
    if (!buybackId) {
      return new Response(
        JSON.stringify({ error: "buybackId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Already has a label? Return it.
    const { data: existing } = await supabase
      .from("hair_buyback_requests")
      .select("shipping_label_url, shipping_tracking_number, sendcloud_parcel_id")
      .eq("id", buybackId)
      .maybeSingle();

    if (existing?.shipping_label_url) {
      return new Response(
        JSON.stringify({
          shipping_label_url: existing.shipping_label_url,
          tracking_number: existing.shipping_tracking_number,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: req2, error: reqErr } = await supabase
      .from("hair_buyback_requests")
      .select("*")
      .eq("id", buybackId)
      .maybeSingle();

    if (reqErr || !req2) {
      return new Response(
        JSON.stringify({ error: "Buyback request not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sellerHasAddress = !!(req2.address_line1 && req2.postal_code && req2.city);

    const sendcloudAuth = btoa(`${sendcloudApiKey}:${sendcloudApiSecret}`);

    // --- Company destination address ---
    // Try env vars first, then hardcoded defaults, then Sendcloud API.
    const envCompanyName = Deno.env.get("COMPANY_NAME") || "NaturalHairMarket – Stephanie Buisson";
    const envCompanyAddress = Deno.env.get("COMPANY_ADDRESS") || "17 rue d'Hanoi";
    const envCompanyCity = Deno.env.get("COMPANY_CITY") || "Belfort";
    const envCompanyPostal = Deno.env.get("COMPANY_POSTAL_CODE") || "90000";
    const envCompanyEmail = Deno.env.get("COMPANY_EMAIL") || "stephaniebuisson1115@gmail.com";
    const envCompanyPhone = Deno.env.get("COMPANY_PHONE") || "+33767166174";

    let companyName = envCompanyName;
    let companyAddress = envCompanyAddress;
    let companyCity = envCompanyCity;
    let companyPostal = envCompanyPostal;
    let companyCountry = "FR";
    let companyEmail = envCompanyEmail;

    // Try Sendcloud user addresses if env vars missing
    if (!companyAddress || !companyCity || !companyPostal) {
      // Try both known endpoints
      for (const endpoint of [
        "https://panel.sendcloud.sc/api/v2/user/addresses/sender",
        "https://panel.sendcloud.sc/api/v2/user/addresses",
      ]) {
        try {
          const senderRes = await fetch(endpoint, {
            headers: { "Authorization": `Basic ${sendcloudAuth}` },
          });
          if (senderRes.ok) {
            const senderData = await senderRes.json();
            const addresses = senderData.sender_addresses || senderData.results || senderData.addresses || [];
            const defaultAddr = addresses.find((a: any) => a.is_default) || addresses[0];
            if (defaultAddr) {
              companyName = defaultAddr.company_name || defaultAddr.contact_name || envCompanyName;
              companyAddress = `${defaultAddr.street || ""}${defaultAddr.house_number ? " " + defaultAddr.house_number : ""}`.trim();
              companyCity = defaultAddr.city || "";
              companyPostal = defaultAddr.postal_code || "";
              companyCountry = defaultAddr.country?.iso_2 || defaultAddr.country || "FR";
              companyEmail = defaultAddr.email || envCompanyEmail;
              console.log("Fetched company address from", endpoint, ":", companyAddress, companyCity, companyPostal);
              if (companyAddress && companyCity && companyPostal) break;
            }
          }
        } catch (e) {
          console.error("Could not fetch sender address from", endpoint, ":", e);
        }
      }
    }

    if (!companyAddress || !companyCity || !companyPostal) {
      return new Response(
        JSON.stringify({ error: "Adresse de destination (NaturalHairMarket) non configuree. Veuillez definir COMPANY_ADDRESS, COMPANY_CITY et COMPANY_POSTAL_CODE dans les secrets Supabase." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Shipping method ---
    let shippingMethodId = 8; // Colissimo fallback
    try {
      const methodsUrl = new URL("https://panel.sendcloud.sc/api/v2/shipping_methods");
      methodsUrl.searchParams.set("from_country", "FR");
      methodsUrl.searchParams.set("to_country", "FR");
      const methodsRes = await fetch(methodsUrl.toString(), {
        headers: { "Authorization": `Basic ${sendcloudAuth}` },
      });
      if (methodsRes.ok) {
        const methodsData = await methodsRes.json();
        const methods: any[] = methodsData.shipping_methods || [];
        const colissimo = methods.find((m: any) =>
          (m.carrier || "").toLowerCase().includes("colissimo") ||
          (m.name || "").toLowerCase().includes("colissimo")
        );
        const picked = colissimo || methods[0];
        if (picked?.id) shippingMethodId = picked.id;
        console.log("Picked shipping method:", picked?.id, picked?.name);
      }
    } catch (e) {
      console.error("Could not fetch shipping methods:", e);
    }

    const sellerName = `${req2.first_name} ${req2.last_name}`;

    // Sendcloud FR requires house_number separately for BOTH TO and FROM addresses
    const splitAddress = (line: string) => {
      const m = (line || "").trim().match(/^(\d+[\w-]*)\s+(.+)$/);
      return m ? { street: m[2], houseNumber: m[1] } : { street: (line || "").trim(), houseNumber: "" };
    };

    const companyParts = splitAddress(companyAddress);
    const fromParts = splitAddress(req2.address_line1 || "");

    const normalizePhone = (raw: string): string => {
      const cleaned = (raw || "").replace(/[\s\-\.]/g, "");
      if (!cleaned) return "";
      if (cleaned.startsWith("+")) return cleaned;
      if (cleaned.startsWith("0033")) return "+" + cleaned.substring(2);
      if (cleaned.startsWith("33") && cleaned.length === 11) return "+" + cleaned;
      if (cleaned.startsWith("0") && cleaned.length === 10) return "+33" + cleaned.substring(1);
      return cleaned;
    };

    const sellerPhone = normalizePhone(req2.phone);
    const fallbackPhone = normalizePhone(envCompanyPhone);
    const sellerEmail = req2.email || "";

    // is_return: true → FROM = seller (origin), TO = NaturalHairMarket (destination)
    // Both TO and FROM require house_number as a separate field for Colissimo FR
    const parcelData: Record<string, any> = {
      name: companyName,
      address: companyParts.street,
      ...(companyParts.houseNumber ? { house_number: companyParts.houseNumber } : {}),
      city: companyCity,
      postal_code: companyPostal,
      country: companyCountry,
      email: companyEmail,
      telephone: sellerPhone || fallbackPhone,

      weight: "0.500",
      order_number: buybackId,
      request_label: true,
      is_return: true,
      shipment: { id: shippingMethodId },

      ...(sellerHasAddress ? {
        from_name: sellerName,
        from_address: fromParts.street,
        ...(fromParts.houseNumber ? { from_house_number: fromParts.houseNumber } : {}),
        from_city: req2.city,
        from_postal_code: req2.postal_code,
        from_country: "FR",
        from_telephone: sellerPhone || fallbackPhone,
        from_email: sellerEmail,
      } : {}),
    };

    console.log("=== BUYBACK LABEL PAYLOAD ===", JSON.stringify({ parcel: parcelData }));

    const sendcloudResponse = await fetch("https://panel.sendcloud.sc/api/v2/parcels", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${sendcloudAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parcel: parcelData }),
    });

    const responseText = await sendcloudResponse.text();
    console.log("=== SENDCLOUD RESPONSE status:", sendcloudResponse.status, "body:", responseText.substring(0, 500));

    if (!sendcloudResponse.ok) {
      let errorMessage = `Sendcloud erreur (${sendcloudResponse.status})`;
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.error?.message) errorMessage = `Sendcloud: ${errorData.error.message}`;
        else errorMessage = `Sendcloud: ${responseText.substring(0, 300)}`;
      } catch {
        errorMessage = `Sendcloud: ${responseText.substring(0, 300)}`;
      }
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sendcloudResult = JSON.parse(responseText);
    const parcel = sendcloudResult.parcel;
    const parcelId = parcel.id;
    const trackingNumber = parcel.tracking_number;

    let labelUrl: string | null = parcel.label?.normal_printer?.[0] || parcel.label?.label_printer || null;

    // Request label generation if not immediately available
    if (!labelUrl && parcelId) {
      try {
        const labelGenRes = await fetch("https://panel.sendcloud.sc/api/v2/labels", {
          method: "POST",
          headers: {
            "Authorization": `Basic ${sendcloudAuth}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ label: { parcels: [parcelId] } }),
        });
        if (labelGenRes.ok) {
          const labelGenData = await labelGenRes.json();
          labelUrl = labelGenData.label?.normal_printer?.[0] || labelGenData.label?.label_printer || null;
        }
      } catch (e) {
        console.error("Label generation error:", e);
      }
    }

    // Poll for label URL if still not available
    if (!labelUrl && parcelId) {
      for (let attempt = 0; attempt < 3; attempt++) {
        await new Promise(r => setTimeout(r, 2000));
        try {
          const pollRes = await fetch(`https://panel.sendcloud.sc/api/v2/labels/${parcelId}`, {
            headers: { "Authorization": `Basic ${sendcloudAuth}` },
          });
          if (pollRes.ok) {
            const pollData = await pollRes.json();
            const url = pollData.label?.normal_printer?.[0] || pollData.label?.label_printer;
            if (url) { labelUrl = url; break; }
          }
        } catch (e) {
          console.error(`Label poll attempt ${attempt + 1} failed:`, e);
        }
      }
    }

    await supabase
      .from("hair_buyback_requests")
      .update({
        shipping_label_url: labelUrl,
        shipping_tracking_number: trackingNumber,
        sendcloud_parcel_id: parcelId?.toString(),
        label_generated_at: new Date().toISOString(),
      })
      .eq("id", buybackId);

    return new Response(
      JSON.stringify({
        success: true,
        shipping_label_url: labelUrl,
        tracking_number: trackingNumber,
        parcel_id: parcelId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("create-buyback-label error:", (error as Error).message);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
