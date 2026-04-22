import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function getLabelUrl(parcelId: string, sendcloudAuth: string): Promise<string | null> {
  // Step 1: try POST /labels to trigger generation
  try {
    const genRes = await fetch("https://panel.sendcloud.sc/api/v2/labels", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${sendcloudAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ label: { parcels: [parseInt(parcelId, 10)] } }),
    });
    if (genRes.ok) {
      const genData = await genRes.json();
      const url = genData.label?.normal_printer?.[0] || genData.label?.label_printer || null;
      if (url) return url;
    }
    console.log("POST /labels status:", genRes.status);
  } catch (e) {
    console.error("POST /labels error:", e);
  }

  // Step 2: poll GET /labels/{parcelId} up to 5 times
  for (let i = 0; i < 5; i++) {
    await new Promise(r => setTimeout(r, 2000));
    try {
      const pollRes = await fetch(`https://panel.sendcloud.sc/api/v2/labels/${parcelId}`, {
        headers: { "Authorization": `Basic ${sendcloudAuth}` },
      });
      if (pollRes.ok) {
        const pollData = await pollRes.json();
        const url = pollData.label?.normal_printer?.[0] || pollData.label?.label_printer || null;
        if (url) return url;
      }
    } catch (e) {
      console.error(`Poll attempt ${i + 1} error:`, e);
    }
  }

  // Step 3: fallback — check parcel object directly
  try {
    const parcelRes = await fetch(`https://panel.sendcloud.sc/api/v2/parcels/${parcelId}`, {
      headers: { "Authorization": `Basic ${sendcloudAuth}` },
    });
    if (parcelRes.ok) {
      const parcelData = await parcelRes.json();
      return parcelData.parcel?.label?.normal_printer?.[0] || parcelData.parcel?.label?.label_printer || null;
    }
  } catch (e) {
    console.error("Parcel fallback error:", e);
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
        JSON.stringify({ error: "Transaction not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sendcloudApiKey = Deno.env.get("SENDCLOUD_API_KEY");
    const sendcloudApiSecret = Deno.env.get("SENDCLOUD_API_SECRET");
    if (!sendcloudApiKey || !sendcloudApiSecret) {
      throw new Error("Sendcloud credentials not configured");
    }
    const sendcloudAuth = btoa(`${sendcloudApiKey}:${sendcloudApiSecret}`);

    let labelUrl: string | null = transaction.shipping_label_pdf_url || null;

    // No stored URL — generate/fetch from Sendcloud
    if (!labelUrl && transaction.sendcloud_parcel_id) {
      labelUrl = await getLabelUrl(transaction.sendcloud_parcel_id, sendcloudAuth);

      if (labelUrl) {
        await supabase
          .from("transactions")
          .update({ shipping_label_pdf_url: labelUrl })
          .eq("id", transactionId);
      }
    }

    if (!labelUrl) {
      return new Response(
        JSON.stringify({ error: "Étiquette non disponible. Réessayez dans quelques secondes." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sendcloud label URLs always require Basic auth
    let pdfBuffer: ArrayBuffer | null = null;
    let contentType = "application/pdf";

    const pdfRes = await fetch(labelUrl, {
      headers: { "Authorization": `Basic ${sendcloudAuth}` },
    });
    if (pdfRes.ok) {
      contentType = pdfRes.headers.get("content-type") || "application/pdf";
      pdfBuffer = await pdfRes.arrayBuffer();
    } else {
      console.log("PDF fetch with auth failed:", pdfRes.status, labelUrl.substring(0, 100));
      throw new Error(`Impossible de télécharger le PDF (${pdfRes.status})`);
    }

    if (!pdfBuffer) {
      throw new Error(`Impossible de télécharger le PDF depuis Sendcloud`);
    }

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
