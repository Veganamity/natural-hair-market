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

    // If label already exists, return success without re-creating
    const { data: existing } = await supabase
      .from("hair_buyback_requests")
      .select("shipping_label_url, shipping_tracking_number, sendcloud_parcel_id")
      .eq("id", buybackId)
      .maybeSingle();

    if (existing?.sendcloud_parcel_id) {
      return new Response(
        JSON.stringify({ success: true, tracking_number: existing.shipping_tracking_number }),
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

    // NaturalHairMarket company info (destination / recipient at relay)
    const companyName = Deno.env.get("COMPANY_NAME") || "NaturalHairMarket";
    const rawCompanyAddress = Deno.env.get("COMPANY_ADDRESS") || "17 rue d'Hanoi";
    const companyCity = Deno.env.get("COMPANY_CITY") || "Belfort";
    const companyPostal = Deno.env.get("COMPANY_POSTAL_CODE") || "90000";
    const companyEmail = Deno.env.get("COMPANY_EMAIL") || "stephaniebuisson1115@gmail.com";
    const companyPhone = normalizePhone(Deno.env.get("COMPANY_PHONE") || "+33767166174");
    const companyParts = splitStreet(rawCompanyAddress);

    // Seller info (for logging/reference)
    const sellerName = `${buyback.first_name || ""} ${buyback.last_name || ""}`.trim() || "Vendeur";
    const sellerPhone = normalizePhone(buyback.phone) || companyPhone;
    console.log("Creating buyback label for seller:", sellerName, "| postal:", buyback.postal_code, "| city:", buyback.city);

    // Target relay point name (NaturalHairMarket's pickup point)
    const TARGET_RELAY_NAME = Deno.env.get("BUYBACK_RELAY_POINT_NAME") || "BAK KAL";

    // ── Step 1: Search Sendcloud service points near NaturalHairMarket (90000 Belfort) ──
    let targetServicePointId: number | null = null;
    let targetRelayAddress: string | null = null;

    try {
      const spUrl = `https://servicepoints.sendcloud.sc/api/v2/service-points/?country=FR&postal_code=${companyPostal}&carrier=mondial_relay&auth_key=${sendcloudApiKey}`;
      console.log("Searching service points:", spUrl);
      const spRes = await fetch(spUrl);
      console.log("Service points status:", spRes.status);

      if (spRes.ok) {
        const points: any[] = await spRes.json();
        console.log(`Found ${points.length} service points. Names:`, points.slice(0, 10).map((p: any) => p.name));

        // Find BAK KAL by name (flexible match)
        const normalizeForMatch = (s: string) => (s || "").toUpperCase().replace(/[\s\-_']/g, "");
        const targetNorm = normalizeForMatch(TARGET_RELAY_NAME);

        const match = points.find((p: any) => {
          const nameParts = normalizeForMatch(p.name);
          return nameParts.includes(targetNorm) || targetNorm.includes(nameParts) ||
            normalizeForMatch(p.name).includes("BAKKAL") ||
            normalizeForMatch(p.name).includes("BAK") && normalizeForMatch(p.name).includes("KAL");
        });

        if (match) {
          targetServicePointId = match.id;
          targetRelayAddress = `${match.street || ""} ${match.house_number || ""}, ${match.postal_code || ""} ${match.city || ""}`.trim();
          console.log("Found target relay point:", match.id, match.name, targetRelayAddress);
        } else {
          console.log("Target relay not found by name. Available points:", JSON.stringify(points.slice(0, 5).map((p: any) => ({ id: p.id, name: p.name, city: p.city }))));
          // Use first available relay point as fallback
          if (points.length > 0) {
            targetServicePointId = points[0].id;
            targetRelayAddress = `${points[0].street || ""} ${points[0].house_number || ""}, ${points[0].postal_code || ""} ${points[0].city || ""}`.trim();
            console.log("Fallback: using first relay point:", points[0].id, points[0].name);
          }
        }
      }
    } catch (e) {
      console.error("Service points search error:", e);
    }

    // ── Step 2: Find Mondial Relay shipping method for this service point ──
    let mondialRelayMethodId: number | null = null;

    if (targetServicePointId) {
      try {
        const methodsUrl = `https://panel.sendcloud.sc/api/v2/shipping_methods?service_point_id=${targetServicePointId}&from_country=FR&to_country=FR`;
        const mRes = await fetch(methodsUrl, {
          headers: { "Authorization": `Basic ${sendcloudAuth}` },
        });
        if (mRes.ok) {
          const mData = await mRes.json();
          const methods: any[] = mData.shipping_methods || [];
          console.log("Methods for service point:", JSON.stringify(methods.map((m: any) => ({ id: m.id, name: m.name, carrier: m.carrier, min_weight: m.min_weight, max_weight: m.max_weight }))));

          const mondialMethod = methods.find((m: any) =>
            (m.carrier || "").toLowerCase().includes("mondial") ||
            (m.name || "").toLowerCase().includes("mondial")
          );
          if (mondialMethod) {
            mondialRelayMethodId = mondialMethod.id;
            console.log("Found Mondial Relay method:", mondialRelayMethodId, mondialMethod.name);
          } else if (methods.length > 0) {
            mondialRelayMethodId = methods[0].id;
            console.log("No Mondial Relay method, using first:", mondialRelayMethodId, methods[0].name);
          }
        }
      } catch (e) {
        console.error("Shipping methods error:", e);
      }
    }

    // ── Step 3: Get NaturalHairMarket's sender address ID ──
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
        console.log("Sender address ID:", senderAddressId);
      }
    } catch (e) {
      console.error("Could not fetch sender address:", e);
    }

    // ── Step 4: Build and send parcel payload ──
    // For a Mondial Relay relay-point delivery:
    // - name/address/city/postal = NaturalHairMarket (recipient at relay)
    // - to_service_point = BAK KAL relay service point ID
    // - sender_address = NaturalHairMarket's registered Sendcloud address
    // Weight: 1kg (Mondial Relay standard, avoids minimum weight issues)

    if (!targetServicePointId || !mondialRelayMethodId) {
      return new Response(
        JSON.stringify({
          error: `Impossible de trouver le point relais "${TARGET_RELAY_NAME}" ou sa méthode d'expédition Mondial Relay dans Sendcloud. Vérifiez que Mondial Relay est activé sur votre compte Sendcloud.`,
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const parcelPayload: Record<string, any> = {
      name: companyName,
      address: `${companyParts.houseNumber ? companyParts.houseNumber + " " : ""}${companyParts.street}`.trim(),
      ...(companyParts.houseNumber ? { house_number: companyParts.houseNumber } : {}),
      city: companyCity,
      postal_code: companyPostal,
      country: "FR",
      email: companyEmail,
      telephone: companyPhone,
      weight: "1.000",
      order_number: buybackId,
      request_label: true,
      to_service_point: targetServicePointId,
      shipment: { id: mondialRelayMethodId },
      ...(senderAddressId ? { sender_address: senderAddressId } : {}),
    };

    console.log("=== MONDIAL RELAY PARCEL PAYLOAD ===", JSON.stringify({ parcel: parcelPayload }));

    const parcelsRes = await fetch("https://panel.sendcloud.sc/api/v2/parcels", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${sendcloudAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parcel: parcelPayload }),
    });

    const parcelsText = await parcelsRes.text();
    console.log("=== PARCELS RESPONSE status:", parcelsRes.status, "body:", parcelsText.substring(0, 800));

    if (!parcelsRes.ok) {
      let errorMessage = `Sendcloud erreur (${parcelsRes.status})`;
      try {
        const errorData = JSON.parse(parcelsText);
        if (errorData.error?.message) errorMessage = `Sendcloud: ${errorData.error.message}`;
        else errorMessage = `Sendcloud: ${parcelsText.substring(0, 400)}`;
      } catch {
        errorMessage = `Sendcloud: ${parcelsText.substring(0, 400)}`;
      }
      return new Response(
        JSON.stringify({
          error: errorMessage,
          debug: {
            service_point_id: targetServicePointId,
            method_id: mondialRelayMethodId,
            sendcloud_status: parcelsRes.status,
            sendcloud_response: (() => { try { return JSON.parse(parcelsText); } catch { return parcelsText; } })(),
            payload_sent: { parcel: parcelPayload },
          },
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const parcelsData = JSON.parse(parcelsText);
    const parcel = parcelsData.parcel;
    const parcelId = parcel.id;
    const trackingNumber = parcel.tracking_number;

    let labelUrl: string | null = parcel.label?.normal_printer?.[0] || parcel.label?.label_printer || null;

    // Try explicit label generation if not included in parcel response
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

    // Poll for async label generation
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

    console.log("Label created successfully. Parcel ID:", parcelId, "| Tracking:", trackingNumber, "| Label URL:", labelUrl ? "OK" : "pending");

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
