import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Fetch a fresh label URL from Sendcloud using the correct API routes.
// Stored URLs expire — always re-fetch from Sendcloud.
async function getFreshLabelUrl(parcelId: string, sendcloudAuth: string): Promise<string | null> {
  const id = parseInt(parcelId, 10);

  // Route 1: GET /labels/normal_printer?ids={id} — the correct route per Sendcloud API
  try {
    const url = `https://panel.sendcloud.sc/api/v2/labels/normal_printer?ids=${id}&start_from=0`;
    const res = await fetch(url, {
      headers: { "Authorization": `Basic ${sendcloudAuth}` },
    });
    console.log("GET normal_printer status:", res.status);
    if (res.ok) {
      // This endpoint returns the PDF directly — return the URL itself for download
      return url;
    }
  } catch (e) {
    console.error("GET normal_printer error:", e);
  }

  // Route 2: POST /labels to (re-)trigger generation, then get the URL
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
      const labelUrl = data.label?.normal_printer?.[0] || data.label?.label_printer || null;
      if (labelUrl) return labelUrl;
    }
  } catch (e) {
    console.error("POST /labels error:", e);
  }

  // Route 3: GET /parcels/{id} — label URL may be embedded in parcel object
  try {
    const parcelRes = await fetch(`https://panel.sendcloud.sc/api/v2/parcels/${id}`, {
      headers: { "Authorization": `Basic ${sendcloudAuth}` },
    });
    console.log("GET /parcels status:", parcelRes.status);
    if (parcelRes.ok) {
      const data = await parcelRes.json();
      const labelUrl = data.parcel?.label?.normal_printer?.[0] || data.parcel?.label?.label_printer || null;
      if (labelUrl) return labelUrl;
    }
  } catch (e) {
    console.error("GET /parcels error:", e);
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

    let labelUrl: string | null = null;

    // Always get a fresh URL from Sendcloud when we have a parcel ID
    if (transaction.sendcloud_parcel_id) {
      labelUrl = await getFreshLabelUrl(transaction.sendcloud_parcel_id, sendcloudAuth);
      if (labelUrl) {
        await supabase
          .from("transactions")
          .update({ shipping_label_pdf_url: labelUrl })
          .eq("id", transactionId);
      }
    }

    // Fallback: use stored URL (only if no parcel_id)
    if (!labelUrl) {
      labelUrl = transaction.shipping_label_pdf_url || null;
    }

    if (!labelUrl) {
      return new Response(
        JSON.stringify({ error: "Étiquette non disponible. Réessayez dans quelques secondes." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch PDF bytes server-side with Sendcloud credentials
    const pdfRes = await fetch(labelUrl, {
      headers: { "Authorization": `Basic ${sendcloudAuth}` },
    });

    console.log("PDF fetch status:", pdfRes.status, "url:", labelUrl.substring(0, 120));

    if (!pdfRes.ok) {
      // Clear stale stored URL so next attempt re-fetches
      await supabase
        .from("transactions")
        .update({ shipping_label_pdf_url: null })
        .eq("id", transactionId);
      throw new Error(`Impossible de télécharger le PDF (${pdfRes.status}). Réessayez.`);
    }

    const contentType = pdfRes.headers.get("content-type") || "application/pdf";
    const pdfBuffer = await pdfRes.arrayBuffer();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
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
