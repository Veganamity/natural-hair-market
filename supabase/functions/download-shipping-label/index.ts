import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Sendcloud label flow:
// 1. GET /labels/{parcelId}  →  JSON with { label: { normal_printer: [url, ...], label_printer: url } }
// 2. Fetch that returned URL with Basic auth  →  PDF binary
async function fetchLabelPdf(parcelId: string, sendcloudAuth: string): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
  const id = parseInt(parcelId, 10);

  // Step 1: get the label metadata (JSON) to find the real PDF URL
  let pdfUrl: string | null = null;

  // Try POST /labels first to ensure label is generated
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
      pdfUrl = data.label?.normal_printer?.[0] || data.label?.label_printer || null;
      console.log("POST /labels pdfUrl:", pdfUrl);
    }
  } catch (e) {
    console.error("POST /labels error:", e);
  }

  // Then GET /labels/{id} to get the metadata with URL
  if (!pdfUrl) {
    try {
      const getRes = await fetch(`https://panel.sendcloud.sc/api/v2/labels/${id}`, {
        headers: { "Authorization": `Basic ${sendcloudAuth}` },
      });
      console.log("GET /labels/{id} status:", getRes.status);
      if (getRes.ok) {
        const data = await getRes.json();
        pdfUrl = data.label?.normal_printer?.[0] || data.label?.label_printer || null;
        console.log("GET /labels/{id} pdfUrl:", pdfUrl);
      }
    } catch (e) {
      console.error("GET /labels/{id} error:", e);
    }
  }

  // Fallback: GET /parcels/{id} — label URL may be in parcel object
  if (!pdfUrl) {
    try {
      const parcelRes = await fetch(`https://panel.sendcloud.sc/api/v2/parcels/${id}`, {
        headers: { "Authorization": `Basic ${sendcloudAuth}` },
      });
      console.log("GET /parcels/{id} status:", parcelRes.status);
      if (parcelRes.ok) {
        const data = await parcelRes.json();
        pdfUrl = data.parcel?.label?.normal_printer?.[0] || data.parcel?.label?.label_printer || null;
        console.log("GET /parcels/{id} pdfUrl:", pdfUrl);
      }
    } catch (e) {
      console.error("GET /parcels/{id} error:", e);
    }
  }

  if (!pdfUrl) {
    console.error("No PDF URL found for parcel", parcelId);
    return null;
  }

  // Step 2: fetch the actual PDF binary from the URL returned by Sendcloud
  console.log("Fetching PDF from:", pdfUrl);
  const pdfRes = await fetch(pdfUrl, {
    headers: { "Authorization": `Basic ${sendcloudAuth}` },
  });
  console.log("PDF fetch status:", pdfRes.status);

  if (!pdfRes.ok) {
    console.error("PDF fetch failed:", pdfRes.status, await pdfRes.text().catch(() => ""));
    return null;
  }

  const contentType = pdfRes.headers.get("content-type") || "application/pdf";
  const buffer = await pdfRes.arrayBuffer();
  return { buffer, contentType };
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
      .select("shipping_label_pdf_url, sendcloud_parcel_id")
      .eq("id", transactionId)
      .maybeSingle();

    if (!transaction) {
      return new Response(
        JSON.stringify({ error: "Transaction introuvable" }),
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

    if (!transaction.sendcloud_parcel_id) {
      return new Response(
        JSON.stringify({ error: "Aucun colis Sendcloud trouvé pour cette commande. L'étiquette n'a pas encore été générée." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await fetchLabelPdf(transaction.sendcloud_parcel_id, sendcloudAuth);

    if (!result) {
      return new Response(
        JSON.stringify({ error: "Impossible de récupérer le PDF depuis Sendcloud. Réessayez dans quelques secondes." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
