import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Extract a PDF URL from any known Sendcloud response shape
function extractPdfUrl(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  // POST /labels → { label: { normal_printer: [...], label_printer: "..." } }
  const label = d.label as Record<string, unknown> | undefined;
  if (label) {
    const np = label.normal_printer;
    if (Array.isArray(np) && np.length > 0) return String(np[0]);
    if (typeof np === "string" && np.length > 0) return np;
    const lp = label.label_printer;
    if (typeof lp === "string" && lp.length > 0) return lp;
  }

  // GET /parcels/{id} → { parcel: { label: { normal_printer: [...] } } }
  const parcel = d.parcel as Record<string, unknown> | undefined;
  if (parcel) {
    const pl = parcel.label as Record<string, unknown> | undefined;
    if (pl) {
      const np = pl.normal_printer;
      if (Array.isArray(np) && np.length > 0) return String(np[0]);
      if (typeof np === "string" && np.length > 0) return np;
      const lp = pl.label_printer;
      if (typeof lp === "string" && lp.length > 0) return lp;
    }
  }

  return null;
}

// Single attempt: trigger label generation and return the PDF binary in one call.
// Returns null if not ready yet (caller should retry).
async function tryFetchLabel(
  parcelId: number,
  sendcloudAuth: string,
): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
  const noCache = { cache: "no-store" as RequestCache };

  // Step 1: POST /labels — triggers async generation and may return URL immediately
  let pdfUrl: string | null = null;
  try {
    const postRes = await fetch("https://panel.sendcloud.sc/api/v2/labels", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${sendcloudAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ label: { parcels: [parcelId] } }),
      ...noCache,
    });
    const postBody = await postRes.json();
    console.log("POST /labels status:", postRes.status, "body:", JSON.stringify(postBody).slice(0, 300));
    pdfUrl = extractPdfUrl(postBody);
  } catch (e) {
    console.error("POST /labels error:", e);
  }

  // Step 2: GET /labels/{id} if POST didn't give us a URL
  if (!pdfUrl) {
    try {
      const getRes = await fetch(`https://panel.sendcloud.sc/api/v2/labels/${parcelId}`, {
        headers: { "Authorization": `Basic ${sendcloudAuth}` },
        ...noCache,
      });
      const getBody = await getRes.json();
      console.log("GET /labels status:", getRes.status, "body:", JSON.stringify(getBody).slice(0, 300));
      pdfUrl = extractPdfUrl(getBody);
    } catch (e) {
      console.error("GET /labels error:", e);
    }
  }

  // Step 3: GET /parcels/{id} as last resort
  if (!pdfUrl) {
    try {
      const parcelRes = await fetch(`https://panel.sendcloud.sc/api/v2/parcels/${parcelId}`, {
        headers: { "Authorization": `Basic ${sendcloudAuth}` },
        ...noCache,
      });
      const parcelBody = await parcelRes.json();
      console.log("GET /parcels status:", parcelRes.status, "body:", JSON.stringify(parcelBody).slice(0, 400));
      pdfUrl = extractPdfUrl(parcelBody);
    } catch (e) {
      console.error("GET /parcels error:", e);
    }
  }

  if (!pdfUrl) {
    console.log("No PDF URL found for parcel", parcelId);
    return null;
  }

  // Step 4: download the actual PDF binary
  console.log("Downloading PDF from:", pdfUrl);
  const pdfRes = await fetch(pdfUrl, {
    headers: { "Authorization": `Basic ${sendcloudAuth}` },
    ...noCache,
  });
  console.log("PDF binary status:", pdfRes.status, "content-type:", pdfRes.headers.get("content-type"), "content-length:", pdfRes.headers.get("content-length"));

  if (!pdfRes.ok) {
    console.warn("PDF binary fetch failed:", pdfRes.status);
    return null;
  }

  const buffer = await pdfRes.arrayBuffer();
  console.log("PDF buffer size:", buffer.byteLength);

  if (buffer.byteLength < 100) {
    console.warn("PDF buffer suspiciously small:", buffer.byteLength);
    return null;
  }

  const contentType = pdfRes.headers.get("content-type") || "application/pdf";
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
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
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
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!transaction.sendcloud_parcel_id) {
      return new Response(
        JSON.stringify({ error: "Aucun colis Sendcloud trouvé pour cette commande." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const sendcloudApiKey = Deno.env.get("SENDCLOUD_API_KEY");
    const sendcloudApiSecret = Deno.env.get("SENDCLOUD_API_SECRET");
    if (!sendcloudApiKey || !sendcloudApiSecret) {
      throw new Error("Sendcloud credentials not configured");
    }
    const sendcloudAuth = btoa(`${sendcloudApiKey}:${sendcloudApiSecret}`);

    console.log("transactionId:", transactionId, "parcelId:", transaction.sendcloud_parcel_id);

    const result = await tryFetchLabel(Number(transaction.sendcloud_parcel_id), sendcloudAuth);

    if (!result) {
      return new Response(
        JSON.stringify({ error: "L'étiquette est en cours de génération. Réessayez dans quelques secondes.", retryable: true }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(result.buffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": result.contentType,
        "Content-Disposition": `attachment; filename="etiquette-expedition.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("download-shipping-label error:", (error as Error).message);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
