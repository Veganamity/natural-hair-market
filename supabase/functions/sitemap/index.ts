import { createClient } from "npm:@supabase/supabase-js@2";

const SITE_URL = "https://naturalhairmarket.com";

const STATIC_PAGES = [
  { loc: "/", priority: "1.0", changefreq: "daily" },
  { loc: "/#marketplace", priority: "0.9", changefreq: "hourly" },
  { loc: "/faq", priority: "0.7", changefreq: "monthly" },
  { loc: "/about", priority: "0.6", changefreq: "monthly" },
  { loc: "/sell-my-hair", priority: "0.8", changefreq: "monthly" },
  { loc: "/safety", priority: "0.6", changefreq: "monthly" },
  { loc: "/terms", priority: "0.4", changefreq: "yearly" },
  { loc: "/sales", priority: "0.4", changefreq: "yearly" },
  { loc: "/refund", priority: "0.5", changefreq: "yearly" },
  { loc: "/seller-rules", priority: "0.6", changefreq: "monthly" },
  { loc: "/buyer-rules", priority: "0.6", changefreq: "monthly" },
  { loc: "/privacy", priority: "0.4", changefreq: "yearly" },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toW3CDate(dateStr: string): string {
  return new Date(dateStr).toISOString().split("T")[0];
}

Deno.serve(async (_req: Request) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: listings } = await supabase
      .from("listings")
      .select("id, created_at, updated_at")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    const today = new Date().toISOString().split("T")[0];

    const staticUrls = STATIC_PAGES.map(
      (page) => `
  <url>
    <loc>${escapeXml(SITE_URL + page.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    ).join("");

    const listingUrls = (listings ?? []).map((listing) => {
      const lastmod = listing.updated_at
        ? toW3CDate(listing.updated_at)
        : listing.created_at
        ? toW3CDate(listing.created_at)
        : today;
      return `
  <url>
    <loc>${escapeXml(`${SITE_URL}/#listing/${listing.id}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${listingUrls}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Sitemap error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
});
