import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

    // No stored URL — fetch from Sendcloud API using parcel ID
    if (!labelUrl && transaction.sendcloud_parcel_id) {
      const parcelId = transaction.sendcloud_parcel_id;

      // Try label endpoint first
      const labelRes = await fetch(`https://panel.sendcloud.sc/api/v2/labels/${parcelId}`, {
        headers: { "Authorization": `Basic ${sendcloudAuth}` },
      });
      if (labelRes.ok) {
        const labelData = await labelRes.json();
        const normalPrinter = labelData.label?.normal_printer?.[0];
        const labelPrinter = labelData.label?.label_printer;
        labelUrl = normalPrinter || labelPrinter || null;
        console.log("Label API response:", JSON.stringify(labelData).substring(0, 400));
      } else {
        console.log("Label endpoint status:", labelRes.status);
      }

      // If still no URL, try fetching the parcel directly
      if (!labelUrl) {
        const parcelRes = await fetch(`https://panel.sendcloud.sc/api/v2/parcels/${parcelId}`, {
          headers: { "Authorization": `Basic ${sendcloudAuth}` },
        });
        if (parcelRes.ok) {
          const parcelData = await parcelRes.json();
          const parcel = parcelData.parcel;
          const normalPrinter = parcel?.label?.normal_printer?.[0];
          const labelPrinter = parcel?.label?.label_printer;
          labelUrl = normalPrinter || labelPrinter || null;
          console.log("Parcel label data:", JSON.stringify(parcel?.label));
        }
      }

      // Persist if found
      if (labelUrl) {
        await supabase
          .from("transactions")
          .update({ shipping_label_pdf_url: labelUrl })
          .eq("id", transactionId);
      }
    }

    if (!labelUrl) {
      return new Response(
        JSON.stringify({ error: "Étiquette non disponible. Sendcloud génère les étiquettes de façon asynchrone, réessayez dans quelques secondes." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Proxy the PDF through this function with Sendcloud auth
    const pdfRes = await fetch(labelUrl, {
      headers: { "Authorization": `Basic ${sendcloudAuth}` },
    });

    console.log("PDF fetch status:", pdfRes.status, "url:", labelUrl.substring(0, 80));

    if (!pdfRes.ok) {
      // If the URL is a signed/public URL, try without auth
      const pdfRes2 = await fetch(labelUrl);
      if (!pdfRes2.ok) {
        throw new Error(`Impossible de télécharger l'étiquette (${pdfRes.status})`);
      }
      const blob2 = await pdfRes2.arrayBuffer();
      return new Response(blob2, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="etiquette-expedition.pdf"`,
        },
      });
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
