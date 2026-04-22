import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 10; // up to 20 seconds

async function getPdfUrlFromSendcloud(id: number, sendcloudAuth: string): Promise<string | null> {
  // POST /labels triggers generation and returns URL if ready
  try {
    const postRes = await fetch("https://panel.sendcloud.sc/api/v2/labels", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${sendcloudAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ label: { parcels: [id] } }),
    });
    console.log("POST /labels status:", postRes.status);
    if (postRes.ok) {
      const data = await postRes.json();
      const url = data.label?.normal_printer?.[0] || data.label?.label_printer || null;
      if (url) return url;
    }
  } catch (e) {
    console.error("POST /labels error:", e);
  }

  // GET /labels/{id} — JSON metadata with URL
  try {
    const getRes = await fetch(`https://panel.sendcloud.sc/api/v2/labels/${id}`, {
      headers: { "Authorization": `Basic ${sendcloudAuth}` },
    });
    console.log("GET /labels/{id} status:", getRes.status);
    if (getRes.ok) {
      const data = await getRes.json();
      const url = data.label?.normal_printer?.[0] || data.label?.label_printer || null;
      if (url) return url;
    }
  } catch (e) {
    console.error("GET /labels/{id} error:", e);
  }

  // Fallback: parcel object embeds label URL
  try {
    const parcelRes = await fetch(`https://panel.sendcloud.sc/api/v2/parcels/${id}`, {
      headers: { "Authorization": `Basic ${sendcloudAuth}` },
    });
    console.log("GET /parcels/{id} status:", parcelRes.status);
    if (parcelRes.ok) {
      const data = await parcelRes.json();
      const url = data.parcel?.label?.normal_printer?.[0] || data.parcel?.label?.label_printer || null;
      if (url) return url;
    }
  } catch (e) {
    console.error("GET /parcels/{id} error:", e);
  }

  return null;
}

// Poll Sendcloud until the PDF URL is available (label generation is async)
async function fetchLabelPdf(parcelId: string, sendcloudAuth: string): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
  const id = parseInt(parcelId, 10);

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    console.log(`Attempt ${attempt}/${MAX_ATTEMPTS} for parcel ${id}`);

    const pdfUrl = await getPdfUrlFromSendcloud(id, sendcloudAuth);

    if (pdfUrl) {
      console.log("Fetching PDF binary from:", pdfUrl);
      const pdfRes = await fetch(pdfUrl, {
        headers: { "Authorization": `Basic ${sendcloudAuth}` },
      });
      console.log("PDF fetch status:", pdfRes.status);

      if (pdfRes.ok) {
        const contentType = pdfRes.headers.get("content-type") || "application/pdf";
        const buffer = await pdfRes.arrayBuffer();
        return { buffer, contentType };
      }
      // URL returned but fetch failed — label may still be generating, keep polling
      console.warn("PDF URL found but fetch failed:", pdfRes.status, "— will retry");
    }

    if (attempt < MAX_ATTEMPTS) {
      await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
    }
  }

  console.error("Label not ready after", MAX_ATTEMPTS, "attempts for parcel", id);
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

    const { transactionId } = await req.json();
    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: "transactionId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: transaction } = await supabase
      .from("transactions")
      .select("sendcloud_parcel_id")
      .eq("id", transactionId)
      .maybeSingle();

    if (!transaction) {
      return new Response(
        JSON.stringify({ error: "Transaction introuvable" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!transaction.sendcloud_parcel_id) {
      return new Response(
        JSON.stringify({ error: "Aucun colis Sendcloud trouvé pour cette commande. L'étiquette n'a pas encore été générée." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sendcloudApiKey = Deno.env.get("SENDCLOUD_API_KEY");
    const sendcloudApiSecret = Deno.env.get("SENDCLOUD_API_SECRET");
    if (!sendcloudApiKey || !sendcloudApiSecret) {
      throw new Error("Sendcloud credentials not configured");
    }
    const sendcloudAuth = btoa(`${sendcloudApiKey}:${sendcloudApiSecret}`);

    console.log("transactionId:", transactionId, "parcelId:", transaction.sendcloud_parcel_id);

    const result = await fetchLabelPdf(transaction.sendcloud_parcel_id, sendcloudAuth);

    if (!result) {
      return new Response(
        JSON.stringify({ error: "L'étiquette est en cours de génération chez Sendcloud. Réessayez dans quelques secondes.", retryable: true }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(result.buffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": result.contentType,
        "Content-Disposition": `attachment; filename="etiquette-expedition.pdf"`,
      },
    });
  } catch (error) {
    console.error("download-shipping-label error:", (error as Error).message);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
