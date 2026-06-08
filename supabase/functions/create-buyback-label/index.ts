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

    if (!req2.address_line1 || !req2.postal_code || !req2.city) {
      return new Response(
        JSON.stringify({ error: "Adresse du vendeur manquante. Impossible de generer l'etiquette." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sendcloudAuth = btoa(`${sendcloudApiKey}:${sendcloudApiSecret}`);

    // Get NaturalHairMarket sender address from Sendcloud (used as the delivery destination)
    let companyAddress: Record<string, string> = {
      name: "NaturalHairMarket",
      address: "",
      city: "",
      postal_code: "",
      country: "FR",
    };
    try {
      const senderRes = await fetch("https://panel.sendcloud.sc/api/v2/user/addresses/sender", {
        headers: { "Authorization": `Basic ${sendcloudAuth}` },
      });
      if (senderRes.ok) {
        const senderData = await senderRes.json();
        const addresses = senderData.sender_addresses || [];
        const defaultAddr = addresses.find((a: any) => a.is_default) || addresses[0];
        if (defaultAddr) {
          companyAddress = {
            name: defaultAddr.company_name || defaultAddr.contact_name || "NaturalHairMarket",
            address: defaultAddr.street + (defaultAddr.house_number ? ` ${defaultAddr.house_number}` : ""),
            city: defaultAddr.city,
            postal_code: defaultAddr.postal_code,
            country: defaultAddr.country?.iso_2 || "FR",
          };
        }
      }
    } catch (e) {
      console.error("Could not fetch sender address:", e);
    }

    // Find a suitable shipping method (home delivery France → France)
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
        // Prefer Mondial Relay home delivery, then Colissimo, then first available
        const mondialRelay = methods.find((m: any) =>
          (m.carrier || "").toLowerCase().includes("mondial") && !m.name?.toLowerCase().includes("service point")
        );
        const colissimo = methods.find((m: any) =>
          (m.carrier || "").toLowerCase().includes("colissimo") ||
          (m.name || "").toLowerCase().includes("colissimo")
        );
        const picked = mondialRelay || colissimo || methods[0];
        if (picked?.id) shippingMethodId = picked.id;
        console.log("Picked shipping method:", picked?.id, picked?.name, picked?.carrier);
      }
    } catch (e) {
      console.error("Could not fetch shipping methods:", e);
    }

    const sellerName = `${req2.first_name} ${req2.last_name}`;

    // Create parcel: TO = NaturalHairMarket, FROM = seller
    // This generates a prepaid label the seller uses to ship their hair to us.
    const parcelData: Record<string, any> = {
      name: companyAddress.name,
      address: companyAddress.address || "1 rue de la Paix",
      city: companyAddress.city || "Paris",
      postal_code: companyAddress.postal_code || "75001",
      country: companyAddress.country,

      // Override sender = seller
      from_name: sellerName,
      from_address: req2.address_line1,
      from_city: req2.city,
      from_postal_code: req2.postal_code,
      from_country: "FR",
      from_telephone: req2.phone || "",

      weight: "0.500",
      order_number: buybackId,
      request_label: true,
      shipment: { id: shippingMethodId },
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
