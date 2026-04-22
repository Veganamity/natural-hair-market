import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Always fetch a fresh URL from Sendcloud — stored URLs expire
async function getFreshLabelUrl(parcelId: string, sendcloudAuth: string): Promise<string | null> {
  // Step 1: GET /labels/{parcelId} — fastest, returns URL if already generated
  try {
    const getRes = await fetch(`https://panel.sendcloud.sc/api/v2/labels/${parcelId}`, {
      headers: { "Authorization": `Basic ${sendcloudAuth}` },
    });
    if (getRes.ok) {
      const data = await getRes.json();
      const url = data.label?.normal_printer?.[0] || data.label?.label_printer || null;
      if (url) {
        console.log("Got fresh URL via GET /labels/", parcelId);
        return url;
      }
    }
    console.log("GET /labels status:", getRes.status);
  } catch (e) {
    console.error("GET /labels error:", e);
  }

  // Step 2: POST /labels to (re-)trigger generation
  try {
    const postRes = await fetch("https://panel.sendcloud.sc/api/v2/labels", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${sendcloudAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ label: { parcels: [parseInt(parcelId, 10)] } }),
    });
    if (postRes.ok) {
      const data = await postRes.json();
      const url = data.label?.normal_printer?.[0] || data.label?.label_printer || null;
      if (url) {
        console.log("Got fresh URL via POST /labels");
        return url;
      }
    }
    console.log("POST /labels status:", postRes.status);
  } catch (e) {
    console.error("POST /labels error:", e);
  }

  // Step 3: Poll GET /labels/{parcelId} up to 4 times (async generation)
  for (let i = 0; i < 4; i++) {
    await new Promise(r => setTimeout(r, 2000));
    try {
      const pollRes = await fetch(`https://panel.sendcloud.sc/api/v2/labels/${parcelId}`, {
        headers: { "Authorization": `Basic ${sendcloudAuth}` },
      });
      if (pollRes.ok) {
        const data = await pollRes.json();
        const url = data.label?.normal_printer?.[0] || data.label?.label_printer || null;
        if (url) {
          console.log("Got fresh URL via poll attempt", i + 1);
          return url;
        }
      }
    } catch (e) {
      console.error(`Poll attempt ${i + 1} error:`, e);
    }
  }

  // Step 4: fallback — GET /parcels/{parcelId}
  try {
    const parcelRes = await fetch(`https://panel.sendcloud.sc/api/v2/parcels/${parcelId}`, {
      headers: { "Authorization": `Basic ${sendcloudAuth}` },
    });
    if (parcelRes.ok) {
      const data = await parcelRes.json();
      const url = data.parcel?.label?.normal_printer?.[0] || data.parcel?.label?.label_printer || null;
      if (url) console.log("Got fresh URL via GET /parcels fallback");
      return url;
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

    // Always prefer a fresh URL from Sendcloud if we have a parcel ID
    if (transaction.sendcloud_parcel_id) {
      labelUrl = await getFreshLabelUrl(transaction.sendcloud_parcel_id, sendcloudAuth);
      if (labelUrl) {
        // Keep stored URL up to date
        await supabase
          .from("transactions")
          .update({ shipping_label_pdf_url: labelUrl })
          .eq("id", transactionId);
      }
    }

    // No parcel ID — try the stored URL as last resort
    if (!labelUrl) {
      labelUrl = transaction.shipping_label_pdf_url || null;
    }

    if (!labelUrl) {
      return new Response(
        JSON.stringify({ error: "Étiquette non disponible. Réessayez dans quelques secondes." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the PDF bytes server-side with Sendcloud credentials
    const pdfRes = await fetch(labelUrl, {
      headers: { "Authorization": `Basic ${sendcloudAuth}` },
    });

    if (!pdfRes.ok) {
      console.error("PDF fetch failed:", pdfRes.status, labelUrl.substring(0, 120));
      // URL may have expired despite being fresh — clear it and tell the user to retry
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
