import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function followRedirects(url: string, authHeader: string): Promise<Response | null> {
  let current = url;
  for (let hop = 0; hop < 6; hop++) {
    const isSendcloud = current.includes("sendcloud.sc") || current.includes("sendcloud.com");
    const res = await fetch(current, {
      headers: isSendcloud ? { "Authorization": authHeader } : {},
      redirect: "manual",
    });
    if (res.status === 301 || res.status === 302 || res.status === 307 || res.status === 308) {
      const loc = res.headers.get("location");
      if (!loc) return null;
      current = loc.startsWith("http") ? loc : `https://panel.sendcloud.sc${loc}`;
      continue;
    }
    return res;
  }
  return null;
}

async function fetchLabelPdf(parcelId: number, authHeader: string): Promise<ArrayBuffer | null> {
  // Try POST /labels to trigger generation
  let pdfUrl: string | null = null;
  try {
    const res = await fetch("https://panel.sendcloud.sc/api/v2/labels", {
      method: "POST",
      headers: { "Authorization": authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ label: { parcels: [parcelId] } }),
    });
    const body = await res.json();
    const label = body.label;
    if (label) {
      pdfUrl = (Array.isArray(label.normal_printer) ? label.normal_printer[0] : label.normal_printer)
        || (Array.isArray(label.label_printer) ? label.label_printer[0] : label.label_printer)
        || null;
    }
  } catch (e) {
    console.error("POST /labels error:", e);
  }

  // Fallback: GET /labels/{id}
  if (!pdfUrl) {
    try {
      const res = await fetch(`https://panel.sendcloud.sc/api/v2/labels/${parcelId}`, {
        headers: { "Authorization": authHeader },
      });
      const body = await res.json();
      const label = body.label;
      if (label) {
        pdfUrl = (Array.isArray(label.normal_printer) ? label.normal_printer[0] : label.normal_printer)
          || (Array.isArray(label.label_printer) ? label.label_printer[0] : label.label_printer)
          || null;
      }
    } catch (e) {
      console.error("GET /labels error:", e);
    }
  }

  // Fallback: GET /parcels/{id}
  if (!pdfUrl) {
    try {
      const res = await fetch(`https://panel.sendcloud.sc/api/v2/parcels/${parcelId}`, {
        headers: { "Authorization": authHeader },
      });
      const body = await res.json();
      const label = body.parcel?.label;
      if (label) {
        pdfUrl = (Array.isArray(label.normal_printer) ? label.normal_printer[0] : label.normal_printer) || null;
      }
    } catch (e) {
      console.error("GET /parcels error:", e);
    }
  }

  if (!pdfUrl) {
    console.log("No PDF URL found for parcel", parcelId);
    return null;
  }

  console.log("Fetching PDF from:", pdfUrl);

  // Retry up to 4 times (label generation can take a few seconds)
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await followRedirects(pdfUrl, authHeader);
    if (!res) return null;
    if (res.status === 404 && attempt < 4) {
      await new Promise(r => setTimeout(r, 2000));
      continue;
    }
    if (!res.ok) {
      console.error("PDF fetch failed:", res.status, await res.text().then(t => t.slice(0, 200)));
      return null;
    }
    const buf = await res.arrayBuffer();
    if (buf.byteLength > 100) return buf;
    await new Promise(r => setTimeout(r, 2000));
  }
  return null;
}

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
      throw new Error("Sendcloud credentials not configured");
    }

    const { buybackId } = await req.json();
    if (!buybackId) {
      return new Response(
        JSON.stringify({ error: "buybackId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: buyback } = await supabase
      .from("hair_buyback_requests")
      .select("sendcloud_parcel_id, shipping_label_url")
      .eq("id", buybackId)
      .maybeSingle();

    if (!buyback?.sendcloud_parcel_id) {
      return new Response(
        JSON.stringify({ error: "Aucun colis Sendcloud trouve pour ce rachat." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = `Basic ${btoa(`${sendcloudApiKey}:${sendcloudApiSecret}`)}`;
    const pdfBuffer = await fetchLabelPdf(Number(buyback.sendcloud_parcel_id), authHeader);

    if (!pdfBuffer) {
      return new Response(
        JSON.stringify({ error: "L'etiquette est en cours de generation. Reessayez dans quelques secondes.", retryable: true }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="etiquette-rachat-${buybackId}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("download-buyback-label error:", (error as Error).message);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
