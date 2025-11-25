import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SendcloudWebhookPayload {
  action: string;
  timestamp: number;
  parcel: {
    id: number;
    order_number: string;
    tracking_number: string;
    tracking_url: string;
    status: {
      id: number;
      message: string;
    };
    shipment?: {
      name: string;
    };
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: SendcloudWebhookPayload = await req.json();

    const { action, parcel } = payload;

    if (!parcel || !parcel.order_number) {
      return new Response(
        JSON.stringify({ error: "Invalid webhook payload" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const transactionId = parcel.order_number;
    const trackingNumber = parcel.tracking_number;
    const statusMessage = parcel.status?.message?.toLowerCase() || "";

    let shippingStatus = "in_transit";
    if (statusMessage.includes("delivered")) {
      shippingStatus = "delivered";
    } else if (statusMessage.includes("exception") || statusMessage.includes("failed")) {
      shippingStatus = "exception";
    } else if (statusMessage.includes("transit") || statusMessage.includes("on the way")) {
      shippingStatus = "in_transit";
    } else if (statusMessage.includes("picked up") || statusMessage.includes("shipped")) {
      shippingStatus = "shipped";
    }

    const updateData: any = {
      shipping_status: shippingStatus,
      tracking_number: trackingNumber,
    };

    if (shippingStatus === "shipped" && !parcel.status.id) {
      updateData.shipped_at = new Date().toISOString();
    }

    if (shippingStatus === "delivered") {
      updateData.delivered_at = new Date().toISOString();
      updateData.delivery_status = "delivered";
    }

    const { error: updateError } = await supabase
      .from("transactions")
      .update(updateData)
      .eq("id", transactionId);

    if (updateError) {
      throw new Error(`Failed to update transaction: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook processed successfully",
        transaction_id: transactionId,
        shipping_status: shippingStatus,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Sendcloud webhook error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});