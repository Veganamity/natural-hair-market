import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const normalizePhone = (raw: string): string => {
  const cleaned = (raw || "").replace(/[\s\-\.]/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("0033")) return "+" + cleaned.substring(2);
  if (cleaned.startsWith("33") && cleaned.length === 11) return "+" + cleaned;
  if (cleaned.startsWith("0") && cleaned.length === 10) return "+33" + cleaned.substring(1);
  return cleaned;
};

// Split "17 rue d'Hanoi" → { houseNumber: "17", street: "rue d'Hanoi" }
const splitStreet = (line: string) => {
  const m = (line || "").trim().match(/^(\d+[\w-]*)\s+(.+)$/);
  return m ? { houseNumber: m[1], street: m[2] } : { houseNumber: "", street: (line || "").trim() };
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

    // Return existing label if already generated
    const { data: existing } = await supabase
      .from("hair_buyback_requests")
      .select("shipping_label_url, shipping_tracking_number")
      .eq("id", buybackId)
      .maybeSingle();

    if (existing?.shipping_label_url) {
      return new Response(
        JSON.stringify({
          success: true,
          tracking_number: existing.shipping_tracking_number,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: buyback, error: reqErr } = await supabase
      .from("hair_buyback_requests")
      .select("*")
      .eq("id", buybackId)
      .maybeSingle();

    if (reqErr || !buyback) {
      return new Response(
        JSON.stringify({ error: "Buyback request not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sendcloudAuth = btoa(`${sendcloudApiKey}:${sendcloudApiSecret}`);

    // Company address (NaturalHairMarket) — destination for the return
    const companyName = Deno.env.get("COMPANY_NAME") || "NaturalHairMarket";
    const rawCompanyAddress = Deno.env.get("COMPANY_ADDRESS") || "17 rue d'Hanoi";
    const companyCity = Deno.env.get("COMPANY_CITY") || "Belfort";
    const companyPostal = Deno.env.get("COMPANY_POSTAL_CODE") || "90000";
    const companyEmail = Deno.env.get("COMPANY_EMAIL") || "stephaniebuisson1115@gmail.com";
    const companyPhone = normalizePhone(Deno.env.get("COMPANY_PHONE") || "+33767166174");
    const companyParts = splitStreet(rawCompanyAddress);

    // Seller info
    const sellerName = `${buyback.first_name || ""} ${buyback.last_name || ""}`.trim() || "Vendeur";
    const sellerPhone = normalizePhone(buyback.phone) || companyPhone;
    const sellerHasAddress = !!(buyback.address_line1 && buyback.postal_code && buyback.city);
    const sellerParts = splitStreet(buyback.address_line1 || "");

    // === STRATEGY 1: Sendcloud Returns API v3 ===
    // This API is specifically designed for prepaid return labels (no is_return hack needed).
    // from_address = seller (origin), to_address = NaturalHairMarket (destination).
    // First, discover available return shipping options.
    let v3ShippingOptionCode: string | null = null;
    try {
      const optionsUrl = new URL("https://panel.sendcloud.sc/api/v3/shipping-options");
      optionsUrl.searchParams.set("from_country", "FR");
      optionsUrl.searchParams.set("to_country", "FR");
      if (buyback.postal_code) optionsUrl.searchParams.set("from_postal_code", buyback.postal_code);
      optionsUrl.searchParams.set("to_postal_code", companyPostal);
      const optRes = await fetch(optionsUrl.toString(), {
        headers: { "Authorization": `Basic ${sendcloudAuth}` },
      });
      if (optRes.ok) {
        const optData = await optRes.json();
        const options: any[] = optData.shipping_options || optData.results || [];
        console.log("v3 shipping options:", JSON.stringify(options.map((o: any) => ({ code: o.code, name: o.name, carriers: o.carrier_codes }))));
        // Prefer Colissimo, then any available
        const colissimo = options.find((o: any) =>
          (o.code || "").toLowerCase().includes("colissimo") ||
          (o.name || "").toLowerCase().includes("colissimo") ||
          (o.carrier_codes || []).some((c: string) => c.toLowerCase().includes("colissimo"))
        );
        const picked = colissimo || options[0];
        if (picked?.code) v3ShippingOptionCode = picked.code;
        console.log("Picked v3 shipping option:", v3ShippingOptionCode);
      } else {
        console.log("v3 shipping options status:", optRes.status, await optRes.text().then(t => t.substring(0, 200)));
      }
    } catch (e) {
      console.error("v3 shipping options error:", e);
    }

    if (v3ShippingOptionCode && sellerHasAddress) {
      const returnPayload = {
        from_address: {
          name: sellerName,
          address_line_1: sellerHasAddress ? `${sellerParts.houseNumber ? sellerParts.houseNumber + " " : ""}${sellerParts.street}`.trim() : rawCompanyAddress,
          ...(sellerParts.houseNumber && sellerHasAddress ? { house_number: sellerParts.houseNumber } : {}),
          city: buyback.city || companyCity,
          postal_code: buyback.postal_code || companyPostal,
          country_code: "FR",
          email: buyback.email || companyEmail,
          phone_number: sellerPhone,
        },
        to_address: {
          name: companyName,
          address_line_1: `${companyParts.houseNumber ? companyParts.houseNumber + " " : ""}${companyParts.street}`.trim(),
          ...(companyParts.houseNumber ? { house_number: companyParts.houseNumber } : {}),
          city: companyCity,
          postal_code: companyPostal,
          country_code: "FR",
          email: companyEmail,
          phone_number: companyPhone,
        },
        ship_with: { shipping_option_code: v3ShippingOptionCode },
        weight: { value: 0.5, unit: "kg" },
        order_number: buybackId,
        request_label: true,
      };

      console.log("=== v3 RETURNS PAYLOAD ===", JSON.stringify(returnPayload));

      const v3Res = await fetch("https://panel.sendcloud.sc/api/v3/returns", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${sendcloudAuth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(returnPayload),
      });
      const v3Text = await v3Res.text();
      console.log("v3 returns response:", v3Res.status, v3Text.substring(0, 600));

      if (v3Res.ok) {
        const v3Data = JSON.parse(v3Text);
        const parcelId = v3Data.parcel?.id || v3Data.id;
        const trackingNumber = v3Data.parcel?.tracking_number || v3Data.tracking_number;
        let labelUrl: string | null =
          v3Data.label?.normal_printer?.[0] ||
          v3Data.label?.label_printer ||
          v3Data.parcel?.label?.normal_printer?.[0] ||
          null;

        if (!labelUrl && parcelId) {
          // Poll for label
          for (let attempt = 0; attempt < 4; attempt++) {
            await new Promise(r => setTimeout(r, 2000));
            const pollRes = await fetch(`https://panel.sendcloud.sc/api/v2/labels/${parcelId}`, {
              headers: { "Authorization": `Basic ${sendcloudAuth}` },
            });
            if (pollRes.ok) {
              const pollData = await pollRes.json();
              const url = pollData.label?.normal_printer?.[0] || pollData.label?.label_printer;
              if (url) { labelUrl = url; break; }
            }
          }
        }

        await supabase.from("hair_buyback_requests").update({
          shipping_label_url: labelUrl,
          shipping_tracking_number: trackingNumber,
          sendcloud_parcel_id: parcelId?.toString(),
          label_generated_at: new Date().toISOString(),
        }).eq("id", buybackId);

        return new Response(
          JSON.stringify({ success: true, tracking_number: trackingNumber, parcel_id: parcelId }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.log("v3 returns failed, falling back to v2...");
    }

    // === STRATEGY 2: Sendcloud v2 parcels — standard outgoing label TO NaturalHairMarket ===
    // No is_return, no from_* fields. sender_address = NaturalHairMarket's registered Sendcloud ID.
    // The label destination is NaturalHairMarket — the seller uses the prepaid label to drop off the package.
    // This mirrors exactly the working create-shipping-label function.

    // Fetch registered sender address ID
    let senderAddressId: number | null = null;
    try {
      const senderRes = await fetch("https://panel.sendcloud.sc/api/v2/user/addresses/sender", {
        headers: { "Authorization": `Basic ${sendcloudAuth}` },
      });
      if (senderRes.ok) {
        const senderData = await senderRes.json();
        const addresses = senderData.sender_addresses || [];
        const defaultAddr = addresses.find((a: any) => a.is_default) || addresses[0];
        if (defaultAddr?.id) senderAddressId = defaultAddr.id;
        console.log("Sender address ID:", senderAddressId, "| address:", defaultAddr?.street, defaultAddr?.city);
      }
    } catch (e) {
      console.error("Could not fetch sender address:", e);
    }

    // Pick a Colissimo shipping method
    let shippingMethodId = 8;
    try {
      const methodsRes = await fetch("https://panel.sendcloud.sc/api/v2/shipping_methods?from_country=FR&to_country=FR", {
        headers: { "Authorization": `Basic ${sendcloudAuth}` },
      });
      if (methodsRes.ok) {
        const methodsData = await methodsRes.json();
        const methods: any[] = methodsData.shipping_methods || [];
        console.log("Available methods:", JSON.stringify(methods.map((m: any) => ({ id: m.id, name: m.name, carrier: m.carrier }))));
        // Exclude non-tracked methods (letters, unstamped, etc.)
        const tracked = methods.filter((m: any) => {
          const name = (m.name || "").toLowerCase();
          return !name.includes("letter") && !name.includes("lettre") && !name.includes("unstamped") && !name.includes("non affranchi");
        });
        const colissimo = tracked.find((m: any) =>
          (m.carrier || "").toLowerCase().includes("colissimo") ||
          (m.name || "").toLowerCase().includes("colissimo")
        );
        const picked = colissimo || tracked[0] || methods[0];
        if (picked?.id) shippingMethodId = picked.id;
        console.log("Picked method:", shippingMethodId, picked?.name);
      }
    } catch (e) {
      console.error("Could not fetch shipping methods:", e);
    }

    // For a prepaid return label: name/address = SELLER (pickup origin), sender_address = NaturalHairMarket (destination)
    const v2Payload: Record<string, any> = {
      name: sellerName,
      address: sellerHasAddress ? sellerParts.street : companyParts.street,
      ...(sellerHasAddress && sellerParts.houseNumber ? { house_number: sellerParts.houseNumber } : {}),
      city: buyback.city || companyCity,
      postal_code: buyback.postal_code || companyPostal,
      country: "FR",
      email: buyback.email || companyEmail,
      telephone: sellerPhone,
      weight: "0.500",
      order_number: buybackId,
      request_label: true,
      shipment: { id: shippingMethodId },
      ...(senderAddressId ? { sender_address: senderAddressId } : {}),
    };

    console.log("=== v2 PARCEL PAYLOAD ===", JSON.stringify({ parcel: v2Payload }));

    const v2Res = await fetch("https://panel.sendcloud.sc/api/v2/parcels", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${sendcloudAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parcel: v2Payload }),
    });

    const v2Text = await v2Res.text();
    console.log("=== v2 PARCEL RESPONSE status:", v2Res.status, "body:", v2Text.substring(0, 800));

    if (!v2Res.ok) {
      let errorMessage = `Sendcloud erreur (${v2Res.status})`;
      try {
        const errorData = JSON.parse(v2Text);
        if (errorData.error?.message) errorMessage = `Sendcloud: ${errorData.error.message}`;
        else errorMessage = `Sendcloud: ${v2Text.substring(0, 400)}`;
      } catch {
        errorMessage = `Sendcloud: ${v2Text.substring(0, 400)}`;
      }
      return new Response(
        JSON.stringify({
          error: errorMessage,
          debug: {
            v2_status: v2Res.status,
            v2_response: (() => { try { return JSON.parse(v2Text); } catch { return v2Text; } })(),
            payload_sent: { parcel: v2Payload },
          },
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const v2Data = JSON.parse(v2Text);
    const parcel = v2Data.parcel;
    const parcelId = parcel.id;
    const trackingNumber = parcel.tracking_number;

    let labelUrl: string | null = parcel.label?.normal_printer?.[0] || parcel.label?.label_printer || null;

    if (!labelUrl && parcelId) {
      try {
        const labelGenRes = await fetch("https://panel.sendcloud.sc/api/v2/labels", {
          method: "POST",
          headers: { "Authorization": `Basic ${sendcloudAuth}`, "Content-Type": "application/json" },
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

    if (!labelUrl && parcelId) {
      for (let attempt = 0; attempt < 4; attempt++) {
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
          console.error(`Poll attempt ${attempt + 1} failed:`, e);
        }
      }
    }

    await supabase.from("hair_buyback_requests").update({
      shipping_label_url: labelUrl,
      shipping_tracking_number: trackingNumber,
      sendcloud_parcel_id: parcelId?.toString(),
      label_generated_at: new Date().toISOString(),
    }).eq("id", buybackId);

    return new Response(
      JSON.stringify({ success: true, tracking_number: trackingNumber, parcel_id: parcelId }),
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
