import { createClient } from "npm:@supabase/supabase-js@2";

const SITE_URL = "https://www.naturalhairmarket.com";
const FALLBACK_IMAGE = `${SITE_URL}/file_0000000094ac71f49db79e27f27b239c.png`;

const HAIR_TYPE_LABELS: Record<string, string> = {
  straight: "Raides",
  wavy: "Ondulés",
  curly: "Bouclés",
  coily: "Frisés",
};

const CONDITION_LABELS: Record<string, string> = {
  excellent: "Excellent",
  good: "Bon état",
  fair: "Correct",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildListingPath(listing: {
  id: string;
  hair_length: string;
  hair_type: string;
  hair_color: string;
}): string {
  const slug = [
    "cheveux",
    `${listing.hair_length}cm`,
    slugify(listing.hair_type),
    slugify(listing.hair_color),
  ].join("-");
  return `/annonce/${slug}-${listing.id}`;
}

function extractListingIdFromPath(path: string): string | null {
  const match = path.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i
  );
  return match ? match[1] : null;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function renderListingHTML(
  listing: Record<string, any>,
  seller: Record<string, any> | null,
  canonicalPath: string
): string {
  const images: string[] = Array.isArray(listing.images) ? listing.images : [];
  const mainImage = images[0] || FALLBACK_IMAGE;
  const cm = parseInt(listing.hair_length) || 0;
  const inches = Math.round(cm / 2.54);
  const isSold = listing.status === "sold";
  const typeLabel = HAIR_TYPE_LABELS[listing.hair_type] || listing.hair_type || "";
  const conditionLabel = CONDITION_LABELS[listing.condition] || listing.condition || "";
  const title = `${escapeHtml(listing.title)} – ${listing.price}€ | Natural Hair Market`;
  const desc = `Cheveux naturels ${cm}cm (${inches}") ${typeLabel.toLowerCase()}, couleur ${listing.hair_color}. ${(listing.description || "").slice(0, 150)}`;
  const sellerName = seller?.full_name || "Vendeur";
  const sellerInitial = (sellerName[0] || "V").toUpperCase();
  const createdDate = new Date(listing.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    image: images.length ? images : [FALLBACK_IMAGE],
    offers: {
      "@type": "Offer",
      price: listing.price.toString(),
      priceCurrency: "EUR",
      availability: isSold
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      url: `${SITE_URL}${canonicalPath}`,
    },
  };

  const thumbnails = images
    .slice(0, 6)
    .map(
      (img, i) =>
        `<img src="${escapeAttr(img)}" alt=""${i === 0 ? ' class="active"' : ""} />`
    )
    .join("");

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta id="meta-description" name="description" content="${escapeAttr(desc)}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${SITE_URL}${escapeAttr(canonicalPath)}" id="canonical-url" />
<meta property="og:type" content="product" />
<meta property="og:site_name" content="Natural Hair Market" />
<meta property="og:title" content="${escapeAttr(listing.title)} – ${listing.price}€" />
<meta property="og:description" content="${escapeAttr(desc)}" />
<meta property="og:url" content="${SITE_URL}${escapeAttr(canonicalPath)}" />
<meta property="og:image" content="${escapeAttr(mainImage)}" />
<meta property="og:locale" content="fr_FR" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeAttr(listing.title)} – ${listing.price}€" />
<meta name="twitter:description" content="${escapeAttr(desc)}" />
<meta name="twitter:image" content="${escapeAttr(mainImage)}" />
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<link rel="icon" type="image/png" href="${FALLBACK_IMAGE}" />
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,-apple-system,sans-serif;background:linear-gradient(135deg,#ecfdf5 0%,#f0fdfa 100%);min-height:100vh;color:#1a1a1a}
nav{background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.1);padding:0 1.5rem;height:4rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:40}
nav .brand{font-size:1.25rem;font-weight:800;background:linear-gradient(to right,#047857,#0f766e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
nav a{display:flex;align-items:center;gap:.5rem;text-decoration:none;color:#6b7280;font-size:.875rem;font-weight:500}
nav a:hover{color:#047857}
.container{max-width:80rem;margin:0 auto;padding:1.5rem 1rem}
.breadcrumb{display:flex;align-items:center;gap:.5rem;font-size:.875rem;color:#6b7280;margin-bottom:1rem}
.breadcrumb a{color:#6b7280;text-decoration:none}
.breadcrumb a:hover{color:#047857}
.breadcrumb span{color:#1f2937;font-weight:500}
.grid{display:grid;grid-template-columns:1fr;gap:2rem}
@media(min-width:1024px){.grid{grid-template-columns:1fr 1fr}}
.gallery{border-radius:1rem;overflow:hidden;background:#fff;box-shadow:0 4px 12px rgba(0,0,0,.08);aspect-ratio:1;position:relative}
.gallery img{width:100%;height:100%;object-fit:cover}
.sold-badge{position:absolute;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center}
.sold-badge span{background:#dc2626;color:#fff;font-size:1.25rem;font-weight:700;padding:.5rem 1.5rem;border-radius:9999px;transform:rotate(-8deg);box-shadow:0 4px 12px rgba(0,0,0,.3)}
.thumbnails{display:flex;gap:.5rem;margin-top:.75rem;overflow-x:auto;padding-bottom:.25rem}
.thumbnails img{width:4rem;height:4rem;border-radius:.5rem;object-fit:cover;border:2px solid transparent;flex-shrink:0}
.thumbnails img.active{border-color:#10b981;box-shadow:0 2px 8px rgba(16,185,129,.3)}
.details{display:flex;flex-direction:column;gap:1.25rem}
.title-row{display:flex;align-items:flex-start;justify-content:space-between;gap:.75rem}
h1{font-size:1.5rem;font-weight:700;color:#111827;line-height:1.25}
.price{font-size:1.25rem;font-weight:700;padding:.375rem 1rem;border-radius:9999px;flex-shrink:0;white-space:nowrap}
.price.available{background:#047857;color:#fff}
.price.sold{background:#e5e7eb;color:#6b7280}
.badges{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.5rem}
.badge{display:inline-flex;align-items:center;gap:.375rem;padding:.25rem .75rem;border-radius:9999px;font-size:.875rem;font-weight:500}
.badge.available{background:#dcfce7;color:#15803d}
.badge.sold{background:#fee2e2;color:#b91c1c}
.badge.offers{background:#fef3c7;color:#b45309}
.specs{background:#fff;border-radius:.75rem;padding:1rem;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.specs h2{font-size:.75rem;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.625rem}
.specs-grid{display:grid;grid-template-columns:1fr 1fr;gap:.5rem .75rem}
.spec{display:flex;flex-direction:column}
.spec .label{font-size:.875rem;color:#6b7280}
.spec .value{font-size:.875rem;font-weight:600;color:#111827}
.description{background:#fff;border-radius:.75rem;padding:1rem;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.description h2{font-size:.75rem;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.5rem}
.description p{font-size:.875rem;color:#374151;line-height:1.6;white-space:pre-line}
.date{display:flex;align-items:center;gap:.375rem;margin-top:.75rem;font-size:.75rem;color:#9ca3af}
.seller{background:#fff;border-radius:.75rem;padding:1rem;box-shadow:0 1px 4px rgba(0,0,0,.06);display:flex;align-items:center;gap:.75rem}
.seller-avatar{width:2.5rem;height:2.5rem;border-radius:9999px;background:#d1fae5;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden}
.seller-avatar img{width:100%;height:100%;object-fit:cover}
.seller-avatar span{color:#047857;font-weight:700;font-size:1.125rem}
.seller-info{flex:1;min-width:0}
.seller-name{font-weight:600;color:#1f2937;font-size:.875rem}
.seller-cert{display:inline-flex;align-items:center;gap:.25rem;background:#eff6ff;color:#1d4ed8;padding:.125rem .5rem;border-radius:9999px;font-size:.75rem;font-weight:500;margin-left:.375rem}
.seller-location{font-size:.75rem;color:#6b7280;margin-top:.125rem}
.trust{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin-top:.25rem}
.trust-item{display:flex;flex-direction:column;align-items:center;gap:.375rem;text-align:center}
.trust-icon{width:2rem;height:2rem;background:#d1fae5;border-radius:9999px;display:flex;align-items:center;justify-content:center}
.trust-icon svg{width:1rem;height:1rem;color:#047857}
.trust-label{font-size:.6875rem;color:#4b5563;line-height:1.25}
</style>
</head>
<body>
<nav>
<a href="${SITE_URL}/marketplace">← Marketplace</a>
<span class="brand">NaturalHairMarket</span>
</nav>
<div class="container">
<div class="breadcrumb">
<a href="${SITE_URL}/marketplace">Marketplace</a>
<span>/</span>
<span>${escapeHtml(listing.title)}</span>
</div>
<div class="grid">
<div>
<div class="gallery">
<img src="${escapeAttr(mainImage)}" alt="${escapeAttr(listing.title)}" />
${isSold ? '<div class="sold-badge"><span>VENDU</span></div>' : ""}
</div>
${images.length > 1 ? `<div class="thumbnails">${thumbnails}</div>` : ""}
</div>
<div class="details">
<div>
<div class="title-row">
<h1>${escapeHtml(listing.title)}</h1>
<span class="price ${isSold ? "sold" : "available"}">${listing.price}€</span>
</div>
<div class="badges">
${isSold ? '<span class="badge sold">Vendu</span>' : '<span class="badge available">Disponible</span>'}
${listing.accept_offers && !isSold ? '<span class="badge offers">Offres acceptées</span>' : ""}
</div>
</div>
<div class="specs">
<h2>Caractéristiques</h2>
<div class="specs-grid">
<div class="spec"><span class="label">Longueur</span><span class="value">${cm}cm (${inches}")</span></div>
<div class="spec"><span class="label">Type</span><span class="value">${escapeHtml(typeLabel)}</span></div>
<div class="spec"><span class="label">Couleur</span><span class="value">${escapeHtml(listing.hair_color || "")}</span></div>
${listing.hair_texture ? `<div class="spec"><span class="label">Texture</span><span class="value">${escapeHtml(listing.hair_texture)}</span></div>` : ""}
${listing.hair_weight ? `<div class="spec"><span class="label">Poids</span><span class="value">${escapeHtml(listing.hair_weight)}</span></div>` : ""}
${conditionLabel ? `<div class="spec"><span class="label">État</span><span class="value">${escapeHtml(conditionLabel)}</span></div>` : ""}
<div class="spec"><span class="label">Coloré</span><span class="value">${listing.is_dyed ? "Oui" : "Non"}</span></div>
<div class="spec"><span class="label">Traité</span><span class="value">${listing.is_treated ? "Oui" : "Non (naturel)"}</span></div>
${listing.country ? `<div class="spec"><span class="label">Pays</span><span class="value">${escapeHtml(listing.country)}</span></div>` : ""}
</div>
</div>
<div class="description">
<h2>Description</h2>
<p>${escapeHtml(listing.description || "")}</p>
<div class="date">Publié le ${createdDate}</div>
</div>
${seller ? `<div class="seller">
<div class="seller-avatar">${seller.avatar_url ? `<img src="${escapeAttr(seller.avatar_url)}" alt="" />` : `<span>${sellerInitial}</span>`}</div>
<div class="seller-info">
<div><span class="seller-name">${escapeHtml(sellerName)}</span>${seller.is_certified_salon ? '<span class="seller-cert">Salon Certifié</span>' : ""}</div>
${seller.location ? `<div class="seller-location">${escapeHtml(seller.location)}</div>` : ""}
</div>
</div>` : ""}
<div class="trust">
<div class="trust-item"><div class="trust-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></div><span class="trust-label">Paiement sécurisé</span></div>
<div class="trust-item"><div class="trust-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 9c-3.093 0-6.062.737-8.7 2.062M12 9V5.25A2.25 2.25 0 0114.25 3h3.5A2.25 2.25 0 0120 5.25v3.5A2.25 2.25 0 0117.75 11h-3.5A2.25 2.25 0 0112 9z"/></svg></div><span class="trust-label">Livraison partout en Europe</span></div>
<div class="trust-item"><div class="trust-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg></div><span class="trust-label">Cheveux 100% naturels</span></div>
</div>
</div>
</div>
</div>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const listingId = extractListingIdFromPath(url.pathname);

  if (!listingId) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/html", ...corsHeaders },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: listing, error } = await supabase
      .from("listings")
      .select(
        `*,
        profiles:seller_id (
          id,
          full_name,
          avatar_url,
          location,
          bio,
          is_certified_salon,
          is_verified_salon
        )`
      )
      .eq("id", listingId)
      .maybeSingle();

    if (error || !listing) {
      return new Response("Not Found", {
        status: 404,
        headers: { "Content-Type": "text/html", ...corsHeaders },
      });
    }

    if (listing.status !== "active" && listing.status !== "sold") {
      return new Response("Not Found", {
        status: 404,
        headers: { "Content-Type": "text/html", ...corsHeaders },
      });
    }

    const seller = (listing as any).profiles || null;
    const canonicalPath = buildListingPath(listing);
    const html = renderListingHTML(listing, seller, canonicalPath);

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=3600",
        ...corsHeaders,
      },
    });
  } catch (err) {
    console.error("listing-page error:", err);
    return new Response("Internal Server Error", {
      status: 500,
      headers: { "Content-Type": "text/html", ...corsHeaders },
    });
  }
});
