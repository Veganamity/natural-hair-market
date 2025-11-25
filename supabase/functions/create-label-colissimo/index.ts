import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CreateColissimoLabelRequest {
  transactionId: string;
}

interface ColissimoLabelRequest {
  contractNumber: string;
  password: string;
  outputFormat: {
    outputPrintingType: string;
  };
  letter: {
    service: {
      productCode: string;
      depositDate: string;
      transportationAmount?: number;
      orderNumber: string;
    };
    parcel: {
      weight: number;
    };
    sender: {
      address: {
        companyName?: string;
        lastName: string;
        firstName?: string;
        line2: string;
        countryCode: string;
        city: string;
        zipCode: string;
        phoneNumber?: string;
        email?: string;
      };
    };
    addressee: {
      address: {
        companyName?: string;
        lastName: string;
        firstName?: string;
        line2: string;
        countryCode: string;
        city: string;
        zipCode: string;
        phoneNumber?: string;
        email?: string;
      };
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
    const colissimoApiKey = Deno.env.get("COLISSIMO_API_KEY");
    const colissimoPassword = Deno.env.get("COLISSIMO_PASSWORD");
    const colissimoAccountNumber = Deno.env.get("COLISSIMO_ACCOUNT_NUMBER");

    if (!colissimoApiKey || !colissimoPassword || !colissimoAccountNumber) {
      throw new Error("Colissimo API credentials not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { transactionId }: CreateColissimoLabelRequest = await req.json();

    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: "Transaction ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .select(
        `
        *,
        shipping_address:shipping_addresses(*),
        buyer:buyer_id(email, full_name),
        seller:seller_id(full_name, address_line1, address_line2, postal_code, city, country, phone),
        listing:listings(title, hair_weight, price)
      `
      )
      .eq("id", transactionId)
      .maybeSingle();

    if (txError || !transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.shipping_label_url) {
      return new Response(
        JSON.stringify({
          message: "Label already exists",
          shipping_label_url: transaction.shipping_label_url,
          tracking_number: transaction.tracking_number,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const shippingAddress = transaction.shipping_address;
    const seller = transaction.seller;

    if (!shippingAddress || !seller) {
      throw new Error("Shipping address or seller information missing");
    }

    const weightInGrams = parseInt(transaction.listing?.hair_weight?.replace(/[^\d]/g, "") || "100");

    const nameParts = shippingAddress.full_name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || nameParts[0];

    const sellerNameParts = seller.full_name?.split(" ") || ["Vendeur"];
    const sellerFirstName = sellerNameParts[0] || "";
    const sellerLastName = sellerNameParts.slice(1).join(" ") || sellerNameParts[0];

    const today = new Date();
    const depositDate = today.toISOString().split("T")[0];

    const productCode = weightInGrams <= 250 ? "DOM" : "DOS";

    const colissimoRequest: ColissimoLabelRequest = {
      contractNumber: colissimoAccountNumber,
      password: colissimoPassword,
      outputFormat: {
        outputPrintingType: "PDF_A4_300dpi",
      },
      letter: {
        service: {
          productCode: productCode,
          depositDate: depositDate,
          transportationAmount: transaction.listing?.price || 0,
          orderNumber: transactionId,
        },
        parcel: {
          weight: weightInGrams,
        },
        sender: {
          address: {
            lastName: sellerLastName,
            firstName: sellerFirstName,
            line2: seller.address_line1 || "",
            countryCode: seller.country || "FR",
            city: seller.city || "",
            zipCode: seller.postal_code || "",
            phoneNumber: seller.phone || "",
          },
        },
        addressee: {
          address: {
            lastName: lastName,
            firstName: firstName,
            line2: shippingAddress.address_line1,
            countryCode: shippingAddress.country || "FR",
            city: shippingAddress.city,
            zipCode: shippingAddress.postal_code,
            phoneNumber: shippingAddress.phone || "",
            email: transaction.buyer?.email || "",
          },
        },
      },
    };

    const colissimoResponse = await fetch(
      "https://ws.colissimo.fr/sls-ws/SlsServiceWSRest/2.0/generateLabel",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(colissimoRequest),
      }
    );

    if (!colissimoResponse.ok) {
      const errorData = await colissimoResponse.text();
      throw new Error(`Colissimo API error: ${errorData}`);
    }

    const colissimoResult = await colissimoResponse.json();

    if (!colissimoResult.labelV2Response || colissimoResult.messages?.[0]?.type === "ERROR") {
      const errorMessage = colissimoResult.messages?.[0]?.messageContent || "Unknown error";
      throw new Error(`Colissimo error: ${errorMessage}`);
    }

    const labelUrl = colissimoResult.labelV2Response.label;
    const trackingNumber = colissimoResult.labelV2Response.parcelNumber;

    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        shipping_label_url: labelUrl,
        tracking_number: trackingNumber,
        shipping_status: "label_created",
        shipping_carrier: "Colissimo",
      })
      .eq("id", transactionId);

    if (updateError) {
      throw new Error(`Failed to update transaction: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        shipping_label_url: labelUrl,
        tracking_number: trackingNumber,
        carrier: "Colissimo",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Colissimo label creation error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});