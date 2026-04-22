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

  // POST /labels or GET /labels → { label: { normal_printer: [...], label_printer: "..." } }
  const label = d.label as Record<string, unknown> | undefined;
  if (label) {
    const np = label.normal_printer;
    if (Array.isArray(np) && np.length > 0) return String(np[0]);
    if (typeof np === "string" && np.length > 0) return np;
    const lp = label.label_printer;
    if (Array.isArray(lp) && lp.length > 0) return String(lp[0]);
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
      if (Array.isArray(lp) && lp.length > 0) return String(lp[0]);
      if (typeof lp === "string" && lp.length > 0) return lp;
    }
  }

  return null;
}

// Download PDF binary from a Sendcloud label URL.
// Handles manual redirect so auth header is re-sent on each hop within sendcloud.sc,
// but dropped for external (e.g. S3) redirects.
async function fetchPdfBinary(
  pdfUrl: string,
  authHeader: string,
): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
  const noStore = { cache: "no-store" as RequestCache };
  let currentUrl = pdfUrl;
  const MAX_HOPS = 5;

  for (let hop = 0; hop < MAX_HOPS; hop++) {
    const isSendcloud = currentUrl.includes("sendcloud.sc") || currentUrl.includes("sendcloud.com");
    const headers: Record<string, string> = isSendcloud
      ? { "Authorization": authHeader }
      : {};

    console.log(`Hop ${hop + 1}: GET ${currentUrl} (auth=${isSendcloud})`);

    const res = await fetch(currentUrl, {
      headers,
      redirect: "manual",
      ...noStore,
    });

    console.log(
      `Hop ${hop + 1} response: status=${res.status} content-type=${res.headers.get("content-type")} content-length=${res.headers.get("content-length")} location=${res.headers.get("location")}`,
    );

    if (res.status === 301 || res.status === 302 || res.status === 307 || res.status === 308) {
      const location = res.headers.get("location");
      if (!location) {
        console.error("Redirect with no Location header at hop", hop + 1);
        return null;
      }
      currentUrl = location.startsWith("http")
        ? location
        : `https://panel.sendcloud.sc${location}`;
      continue;
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Fetch failed at hop ${hop + 1} with status ${res.status}:`, errText.slice(0, 600));
      return null;
    }

    const buffer = await res.arrayBuffer();
    console.log("PDF buffer size:", buffer.byteLength);

    if (buffer.byteLength < 100) {
      console.warn("PDF buffer suspiciously small:", buffer.byteLength);
      return null;
    }

    const contentType = res.headers.get("content-type") || "application/pdf";
    return { buffer, contentType };
  }

  console.error("Too many redirects for URL:", pdfUrl);
  return null;
}

// Single attempt per edge function invocation: ask Sendcloud for the label URL then
// download it. Returns null if the label is not ready yet (front-end will retry).
async function tryFetchLabel(
  parcelId: number,
  apiKey: string,
  apiSecret: string,
): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
  const authHeader = `Basic ${btoa(`${apiKey}:${apiSecret}`)}`;
  const noStore = { cache: "no-store" as RequestCache };

  console.log("Auth key prefix:", apiKey.slice(0, 6), "| secret prefix:", apiSecret.slice(0, 4));

  let pdfUrl: string | null = null;

  // Step 1: POST /labels — triggers generation and returns URL when ready
  try {
    const res = await fetch("https://panel.sendcloud.sc/api/v2/labels", {
      method: "POST",
      headers: { "Authorization": authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ label: { parcels: [parcelId] } }),
      ...noStore,
    });
    const body = await res.json();
    console.log("POST /labels status:", res.status, "| body:", JSON.stringify(body).slice(0, 400));
    pdfUrl = extractPdfUrl(body);
  } catch (e) {
    console.error("POST /labels error:", e);
  }

  // Step 2: GET /labels/{id}
  if (!pdfUrl) {
    try {
      const res = await fetch(`https://panel.sendcloud.sc/api/v2/labels/${parcelId}`, {
        headers: { "Authorization": authHeader },
        ...noStore,
      });
      const body = await res.json();
      console.log("GET /labels status:", res.status, "| body:", JSON.stringify(body).slice(0, 400));
      pdfUrl = extractPdfUrl(body);
    } catch (e) {
      console.error("GET /labels error:", e);
    }
  }

  // Step 3: GET /parcels/{id} as fallback
  if (!pdfUrl) {
    try {
      const res = await fetch(`https://panel.sendcloud.sc/api/v2/parcels/${parcelId}`, {
        headers: { "Authorization": authHeader },
        ...noStore,
      });
      const body = await res.json();
      console.log("GET /parcels status:", res.status, "| body:", JSON.stringify(body).slice(0, 500));
      pdfUrl = extractPdfUrl(body);
    } catch (e) {
      console.error("GET /parcels error:", e);
    }
  }

  if (!pdfUrl) {
    console.log("No PDF URL found for parcel", parcelId);
    return null;
  }

  return fetchPdfBinary(pdfUrl, authHeader);
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

    console.log("transactionId:", transactionId, "| parcelId:", transaction.sendcloud_parcel_id);

    const result = await tryFetchLabel(
      Number(transaction.sendcloud_parcel_id),
      sendcloudApiKey,
      sendcloudApiSecret,
    );

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
