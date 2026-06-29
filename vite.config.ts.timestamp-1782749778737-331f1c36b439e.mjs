// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
var BASE_URL = "https://www.naturalhairmarket.com";
var STATIC_PAGES = [
  {
    path: "/marketplace",
    title: "Marketplace Cheveux Naturels | Natural Hair Market",
    description: "Parcourez des centaines d'annonces de cheveux naturels humains \xE0 vendre en Europe : blonds, bruns, ch\xE2tains. Achat s\xE9curis\xE9."
  },
  {
    path: "/vendre-mes-cheveux",
    title: "Vendre mes Cheveux Naturels | Natural Hair Market",
    description: "Vendez vos cheveux naturels en toute s\xE9curit\xE9. Estimez le prix de vos cheveux et publiez votre annonce gratuitement. Longueur minimale 15 cm."
  },
  {
    path: "/sell-my-hair",
    title: "Vendre mes Cheveux Naturels | Natural Hair Market",
    description: "Vendez vos cheveux naturels en toute s\xE9curit\xE9. Estimez le prix de vos cheveux et publiez votre annonce gratuitement. Longueur minimale 15 cm."
  },
  {
    path: "/faq",
    title: "FAQ \u2013 Questions fr\xE9quentes | Natural Hair Market",
    description: "Toutes les r\xE9ponses \xE0 vos questions sur l'achat et la vente de cheveux naturels sur Natural Hair Market."
  },
  {
    path: "/about",
    title: "\xC0 propos | Natural Hair Market",
    description: "D\xE9couvrez Natural Hair Market, la premi\xE8re marketplace fran\xE7aise d\xE9di\xE9e \xE0 l'achat et la vente de cheveux naturels humains en Europe."
  },
  {
    path: "/guide-coupe-conservation",
    title: "Guide Coupe & Conservation des Cheveux | Natural Hair Market",
    description: "Comment couper et conserver vos cheveux pour les vendre au meilleur prix. Conseils pratiques pour les vendeurs de cheveux naturels."
  },
  {
    path: "/safety",
    title: "Qualit\xE9 & S\xE9curit\xE9 | Natural Hair Market",
    description: "Comment Natural Hair Market garantit la qualit\xE9 et la s\xE9curit\xE9 des transactions de cheveux naturels."
  },
  {
    path: "/seller-rules",
    title: "R\xE8gles vendeurs | Natural Hair Market",
    description: "R\xE8gles et conseils pour vendre des cheveux naturels sur Natural Hair Market."
  },
  {
    path: "/buyer-rules",
    title: "R\xE8gles acheteurs | Natural Hair Market",
    description: "R\xE8gles et conseils pour acheter des cheveux naturels sur Natural Hair Market."
  },
  {
    path: "/partenaires",
    title: "Nos Partenaires | Natural Hair Market",
    description: "D\xE9couvrez les partenaires de Natural Hair Market : salons certifi\xE9s et prestataires de services."
  },
  {
    path: "/privacy",
    title: "Politique de confidentialit\xE9 | Natural Hair Market",
    description: "Politique de confidentialit\xE9 et protection des donn\xE9es personnelles de Natural Hair Market."
  },
  {
    path: "/terms",
    title: "Conditions d'utilisation | Natural Hair Market",
    description: "Conditions g\xE9n\xE9rales d'utilisation de la marketplace Natural Hair Market."
  },
  {
    path: "/mentions-legales",
    title: "Conditions d'utilisation | Natural Hair Market",
    description: "Conditions g\xE9n\xE9rales d'utilisation de la marketplace Natural Hair Market."
  },
  {
    path: "/sales",
    title: "Conditions g\xE9n\xE9rales de vente | Natural Hair Market",
    description: "Conditions g\xE9n\xE9rales de vente applicables aux transactions sur Natural Hair Market."
  },
  {
    path: "/refund",
    title: "Politique de remboursement | Natural Hair Market",
    description: "Notre politique de remboursement et de protection des acheteurs sur Natural Hair Market."
  }
];
function prerenderRoutesPlugin() {
  return {
    name: "prerender-routes",
    apply: "build",
    closeBundle() {
      const distDir = join(process.cwd(), "dist");
      let baseHtml;
      try {
        baseHtml = readFileSync(join(distDir, "index.html"), "utf-8");
      } catch {
        console.warn("prerender-routes: dist/index.html not found, skipping.");
        return;
      }
      for (const page of STATIC_PAGES) {
        const segments = page.path.split("/").filter(Boolean);
        const dir = join(distDir, ...segments);
        mkdirSync(dir, { recursive: true });
        const escapedTitle = page.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const escapedDesc = page.description.replace(/"/g, "&quot;");
        const html = baseHtml.replace(/<title>[^<]*<\/title>/, `<title>${escapedTitle}</title>`).replace(/(<meta id="meta-description"[^>]*content=")[^"]*(")/, `$1${escapedDesc}$2`).replace(/(<meta id="og-title"[^>]*content=")[^"]*(")/, `$1${escapedTitle}$2`).replace(/(<meta id="og-description"[^>]*content=")[^"]*(")/, `$1${escapedDesc}$2`).replace(/(<meta id="og-url"[^>]*content=")[^"]*(")/, `$1${BASE_URL}${page.path}$2`).replace(/(<link[^>]*id="canonical-url"[^>]*href=")[^"]*(")/, `$1${BASE_URL}${page.path}$2`).replace(/(<link[^>]*href=")[^"]*("[^>]*id="canonical-url")/, `$1${BASE_URL}${page.path}$2`);
        writeFileSync(join(dir, "index.html"), html);
      }
      console.log(`
\u2713 Pre-rendered ${STATIC_PAGES.length} static routes for SEO
`);
    }
  };
}
var vite_config_default = defineConfig({
  plugins: [react(), prerenderRoutesPlugin()],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  server: {
    host: true,
    port: 5173,
    historyApiFallback: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIFBsdWdpbiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IHJlYWRGaWxlU3luYywgbWtkaXJTeW5jLCB3cml0ZUZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuXG5jb25zdCBCQVNFX1VSTCA9ICdodHRwczovL3d3dy5uYXR1cmFsaGFpcm1hcmtldC5jb20nO1xuXG5jb25zdCBTVEFUSUNfUEFHRVMgPSBbXG4gIHtcbiAgICBwYXRoOiAnL21hcmtldHBsYWNlJyxcbiAgICB0aXRsZTogJ01hcmtldHBsYWNlIENoZXZldXggTmF0dXJlbHMgfCBOYXR1cmFsIEhhaXIgTWFya2V0JyxcbiAgICBkZXNjcmlwdGlvbjogXCJQYXJjb3VyZXogZGVzIGNlbnRhaW5lcyBkJ2Fubm9uY2VzIGRlIGNoZXZldXggbmF0dXJlbHMgaHVtYWlucyBcdTAwRTAgdmVuZHJlIGVuIEV1cm9wZSA6IGJsb25kcywgYnJ1bnMsIGNoXHUwMEUydGFpbnMuIEFjaGF0IHNcdTAwRTljdXJpc1x1MDBFOS5cIixcbiAgfSxcbiAge1xuICAgIHBhdGg6ICcvdmVuZHJlLW1lcy1jaGV2ZXV4JyxcbiAgICB0aXRsZTogJ1ZlbmRyZSBtZXMgQ2hldmV1eCBOYXR1cmVscyB8IE5hdHVyYWwgSGFpciBNYXJrZXQnLFxuICAgIGRlc2NyaXB0aW9uOiAnVmVuZGV6IHZvcyBjaGV2ZXV4IG5hdHVyZWxzIGVuIHRvdXRlIHNcdTAwRTljdXJpdFx1MDBFOS4gRXN0aW1leiBsZSBwcml4IGRlIHZvcyBjaGV2ZXV4IGV0IHB1YmxpZXogdm90cmUgYW5ub25jZSBncmF0dWl0ZW1lbnQuIExvbmd1ZXVyIG1pbmltYWxlIDE1IGNtLicsXG4gIH0sXG4gIHtcbiAgICBwYXRoOiAnL3NlbGwtbXktaGFpcicsXG4gICAgdGl0bGU6ICdWZW5kcmUgbWVzIENoZXZldXggTmF0dXJlbHMgfCBOYXR1cmFsIEhhaXIgTWFya2V0JyxcbiAgICBkZXNjcmlwdGlvbjogJ1ZlbmRleiB2b3MgY2hldmV1eCBuYXR1cmVscyBlbiB0b3V0ZSBzXHUwMEU5Y3VyaXRcdTAwRTkuIEVzdGltZXogbGUgcHJpeCBkZSB2b3MgY2hldmV1eCBldCBwdWJsaWV6IHZvdHJlIGFubm9uY2UgZ3JhdHVpdGVtZW50LiBMb25ndWV1ciBtaW5pbWFsZSAxNSBjbS4nLFxuICB9LFxuICB7XG4gICAgcGF0aDogJy9mYXEnLFxuICAgIHRpdGxlOiAnRkFRIFx1MjAxMyBRdWVzdGlvbnMgZnJcdTAwRTlxdWVudGVzIHwgTmF0dXJhbCBIYWlyIE1hcmtldCcsXG4gICAgZGVzY3JpcHRpb246IFwiVG91dGVzIGxlcyByXHUwMEU5cG9uc2VzIFx1MDBFMCB2b3MgcXVlc3Rpb25zIHN1ciBsJ2FjaGF0IGV0IGxhIHZlbnRlIGRlIGNoZXZldXggbmF0dXJlbHMgc3VyIE5hdHVyYWwgSGFpciBNYXJrZXQuXCIsXG4gIH0sXG4gIHtcbiAgICBwYXRoOiAnL2Fib3V0JyxcbiAgICB0aXRsZTogJ1x1MDBDMCBwcm9wb3MgfCBOYXR1cmFsIEhhaXIgTWFya2V0JyxcbiAgICBkZXNjcmlwdGlvbjogJ0RcdTAwRTljb3V2cmV6IE5hdHVyYWwgSGFpciBNYXJrZXQsIGxhIHByZW1pXHUwMEU4cmUgbWFya2V0cGxhY2UgZnJhblx1MDBFN2Fpc2UgZFx1MDBFOWRpXHUwMEU5ZSBcdTAwRTAgbFxcJ2FjaGF0IGV0IGxhIHZlbnRlIGRlIGNoZXZldXggbmF0dXJlbHMgaHVtYWlucyBlbiBFdXJvcGUuJyxcbiAgfSxcbiAge1xuICAgIHBhdGg6ICcvZ3VpZGUtY291cGUtY29uc2VydmF0aW9uJyxcbiAgICB0aXRsZTogJ0d1aWRlIENvdXBlICYgQ29uc2VydmF0aW9uIGRlcyBDaGV2ZXV4IHwgTmF0dXJhbCBIYWlyIE1hcmtldCcsXG4gICAgZGVzY3JpcHRpb246ICdDb21tZW50IGNvdXBlciBldCBjb25zZXJ2ZXIgdm9zIGNoZXZldXggcG91ciBsZXMgdmVuZHJlIGF1IG1laWxsZXVyIHByaXguIENvbnNlaWxzIHByYXRpcXVlcyBwb3VyIGxlcyB2ZW5kZXVycyBkZSBjaGV2ZXV4IG5hdHVyZWxzLicsXG4gIH0sXG4gIHtcbiAgICBwYXRoOiAnL3NhZmV0eScsXG4gICAgdGl0bGU6ICdRdWFsaXRcdTAwRTkgJiBTXHUwMEU5Y3VyaXRcdTAwRTkgfCBOYXR1cmFsIEhhaXIgTWFya2V0JyxcbiAgICBkZXNjcmlwdGlvbjogJ0NvbW1lbnQgTmF0dXJhbCBIYWlyIE1hcmtldCBnYXJhbnRpdCBsYSBxdWFsaXRcdTAwRTkgZXQgbGEgc1x1MDBFOWN1cml0XHUwMEU5IGRlcyB0cmFuc2FjdGlvbnMgZGUgY2hldmV1eCBuYXR1cmVscy4nLFxuICB9LFxuICB7XG4gICAgcGF0aDogJy9zZWxsZXItcnVsZXMnLFxuICAgIHRpdGxlOiAnUlx1MDBFOGdsZXMgdmVuZGV1cnMgfCBOYXR1cmFsIEhhaXIgTWFya2V0JyxcbiAgICBkZXNjcmlwdGlvbjogJ1JcdTAwRThnbGVzIGV0IGNvbnNlaWxzIHBvdXIgdmVuZHJlIGRlcyBjaGV2ZXV4IG5hdHVyZWxzIHN1ciBOYXR1cmFsIEhhaXIgTWFya2V0LicsXG4gIH0sXG4gIHtcbiAgICBwYXRoOiAnL2J1eWVyLXJ1bGVzJyxcbiAgICB0aXRsZTogJ1JcdTAwRThnbGVzIGFjaGV0ZXVycyB8IE5hdHVyYWwgSGFpciBNYXJrZXQnLFxuICAgIGRlc2NyaXB0aW9uOiAnUlx1MDBFOGdsZXMgZXQgY29uc2VpbHMgcG91ciBhY2hldGVyIGRlcyBjaGV2ZXV4IG5hdHVyZWxzIHN1ciBOYXR1cmFsIEhhaXIgTWFya2V0LicsXG4gIH0sXG4gIHtcbiAgICBwYXRoOiAnL3BhcnRlbmFpcmVzJyxcbiAgICB0aXRsZTogJ05vcyBQYXJ0ZW5haXJlcyB8IE5hdHVyYWwgSGFpciBNYXJrZXQnLFxuICAgIGRlc2NyaXB0aW9uOiAnRFx1MDBFOWNvdXZyZXogbGVzIHBhcnRlbmFpcmVzIGRlIE5hdHVyYWwgSGFpciBNYXJrZXQgOiBzYWxvbnMgY2VydGlmaVx1MDBFOXMgZXQgcHJlc3RhdGFpcmVzIGRlIHNlcnZpY2VzLicsXG4gIH0sXG4gIHtcbiAgICBwYXRoOiAnL3ByaXZhY3knLFxuICAgIHRpdGxlOiAnUG9saXRpcXVlIGRlIGNvbmZpZGVudGlhbGl0XHUwMEU5IHwgTmF0dXJhbCBIYWlyIE1hcmtldCcsXG4gICAgZGVzY3JpcHRpb246ICdQb2xpdGlxdWUgZGUgY29uZmlkZW50aWFsaXRcdTAwRTkgZXQgcHJvdGVjdGlvbiBkZXMgZG9ublx1MDBFOWVzIHBlcnNvbm5lbGxlcyBkZSBOYXR1cmFsIEhhaXIgTWFya2V0LicsXG4gIH0sXG4gIHtcbiAgICBwYXRoOiAnL3Rlcm1zJyxcbiAgICB0aXRsZTogXCJDb25kaXRpb25zIGQndXRpbGlzYXRpb24gfCBOYXR1cmFsIEhhaXIgTWFya2V0XCIsXG4gICAgZGVzY3JpcHRpb246IFwiQ29uZGl0aW9ucyBnXHUwMEU5blx1MDBFOXJhbGVzIGQndXRpbGlzYXRpb24gZGUgbGEgbWFya2V0cGxhY2UgTmF0dXJhbCBIYWlyIE1hcmtldC5cIixcbiAgfSxcbiAge1xuICAgIHBhdGg6ICcvbWVudGlvbnMtbGVnYWxlcycsXG4gICAgdGl0bGU6IFwiQ29uZGl0aW9ucyBkJ3V0aWxpc2F0aW9uIHwgTmF0dXJhbCBIYWlyIE1hcmtldFwiLFxuICAgIGRlc2NyaXB0aW9uOiBcIkNvbmRpdGlvbnMgZ1x1MDBFOW5cdTAwRTlyYWxlcyBkJ3V0aWxpc2F0aW9uIGRlIGxhIG1hcmtldHBsYWNlIE5hdHVyYWwgSGFpciBNYXJrZXQuXCIsXG4gIH0sXG4gIHtcbiAgICBwYXRoOiAnL3NhbGVzJyxcbiAgICB0aXRsZTogJ0NvbmRpdGlvbnMgZ1x1MDBFOW5cdTAwRTlyYWxlcyBkZSB2ZW50ZSB8IE5hdHVyYWwgSGFpciBNYXJrZXQnLFxuICAgIGRlc2NyaXB0aW9uOiAnQ29uZGl0aW9ucyBnXHUwMEU5blx1MDBFOXJhbGVzIGRlIHZlbnRlIGFwcGxpY2FibGVzIGF1eCB0cmFuc2FjdGlvbnMgc3VyIE5hdHVyYWwgSGFpciBNYXJrZXQuJyxcbiAgfSxcbiAge1xuICAgIHBhdGg6ICcvcmVmdW5kJyxcbiAgICB0aXRsZTogJ1BvbGl0aXF1ZSBkZSByZW1ib3Vyc2VtZW50IHwgTmF0dXJhbCBIYWlyIE1hcmtldCcsXG4gICAgZGVzY3JpcHRpb246ICdOb3RyZSBwb2xpdGlxdWUgZGUgcmVtYm91cnNlbWVudCBldCBkZSBwcm90ZWN0aW9uIGRlcyBhY2hldGV1cnMgc3VyIE5hdHVyYWwgSGFpciBNYXJrZXQuJyxcbiAgfSxcbl07XG5cbmZ1bmN0aW9uIHByZXJlbmRlclJvdXRlc1BsdWdpbigpOiBQbHVnaW4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdwcmVyZW5kZXItcm91dGVzJyxcbiAgICBhcHBseTogJ2J1aWxkJyxcbiAgICBjbG9zZUJ1bmRsZSgpIHtcbiAgICAgIGNvbnN0IGRpc3REaXIgPSBqb2luKHByb2Nlc3MuY3dkKCksICdkaXN0Jyk7XG4gICAgICBsZXQgYmFzZUh0bWw6IHN0cmluZztcbiAgICAgIHRyeSB7XG4gICAgICAgIGJhc2VIdG1sID0gcmVhZEZpbGVTeW5jKGpvaW4oZGlzdERpciwgJ2luZGV4Lmh0bWwnKSwgJ3V0Zi04Jyk7XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdwcmVyZW5kZXItcm91dGVzOiBkaXN0L2luZGV4Lmh0bWwgbm90IGZvdW5kLCBza2lwcGluZy4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGNvbnN0IHBhZ2Ugb2YgU1RBVElDX1BBR0VTKSB7XG4gICAgICAgIGNvbnN0IHNlZ21lbnRzID0gcGFnZS5wYXRoLnNwbGl0KCcvJykuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgICBjb25zdCBkaXIgPSBqb2luKGRpc3REaXIsIC4uLnNlZ21lbnRzKTtcbiAgICAgICAgbWtkaXJTeW5jKGRpciwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG5cbiAgICAgICAgY29uc3QgZXNjYXBlZFRpdGxlID0gcGFnZS50aXRsZS5yZXBsYWNlKC8mL2csICcmYW1wOycpLnJlcGxhY2UoLzwvZywgJyZsdDsnKS5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XG4gICAgICAgIGNvbnN0IGVzY2FwZWREZXNjID0gcGFnZS5kZXNjcmlwdGlvbi5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG5cbiAgICAgICAgY29uc3QgaHRtbCA9IGJhc2VIdG1sXG4gICAgICAgICAgLnJlcGxhY2UoLzx0aXRsZT5bXjxdKjxcXC90aXRsZT4vLCBgPHRpdGxlPiR7ZXNjYXBlZFRpdGxlfTwvdGl0bGU+YClcbiAgICAgICAgICAucmVwbGFjZSgvKDxtZXRhIGlkPVwibWV0YS1kZXNjcmlwdGlvblwiW14+XSpjb250ZW50PVwiKVteXCJdKihcIikvLCAgYCQxJHtlc2NhcGVkRGVzY30kMmApXG4gICAgICAgICAgLnJlcGxhY2UoLyg8bWV0YSBpZD1cIm9nLXRpdGxlXCJbXj5dKmNvbnRlbnQ9XCIpW15cIl0qKFwiKS8sICBgJDEke2VzY2FwZWRUaXRsZX0kMmApXG4gICAgICAgICAgLnJlcGxhY2UoLyg8bWV0YSBpZD1cIm9nLWRlc2NyaXB0aW9uXCJbXj5dKmNvbnRlbnQ9XCIpW15cIl0qKFwiKS8sICBgJDEke2VzY2FwZWREZXNjfSQyYClcbiAgICAgICAgICAucmVwbGFjZSgvKDxtZXRhIGlkPVwib2ctdXJsXCJbXj5dKmNvbnRlbnQ9XCIpW15cIl0qKFwiKS8sICBgJDEke0JBU0VfVVJMfSR7cGFnZS5wYXRofSQyYClcbiAgICAgICAgICAucmVwbGFjZSgvKDxsaW5rW14+XSppZD1cImNhbm9uaWNhbC11cmxcIltePl0qaHJlZj1cIilbXlwiXSooXCIpLywgIGAkMSR7QkFTRV9VUkx9JHtwYWdlLnBhdGh9JDJgKVxuICAgICAgICAgIC5yZXBsYWNlKC8oPGxpbmtbXj5dKmhyZWY9XCIpW15cIl0qKFwiW14+XSppZD1cImNhbm9uaWNhbC11cmxcIikvLCAgYCQxJHtCQVNFX1VSTH0ke3BhZ2UucGF0aH0kMmApO1xuXG4gICAgICAgIHdyaXRlRmlsZVN5bmMoam9pbihkaXIsICdpbmRleC5odG1sJyksIGh0bWwpO1xuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZyhgXFxuXHUyNzEzIFByZS1yZW5kZXJlZCAke1NUQVRJQ19QQUdFUy5sZW5ndGh9IHN0YXRpYyByb3V0ZXMgZm9yIFNFT1xcbmApO1xuICAgIH0sXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBwcmVyZW5kZXJSb3V0ZXNQbHVnaW4oKV0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IHRydWUsXG4gICAgcG9ydDogNTE3MyxcbiAgICBoaXN0b3J5QXBpRmFsbGJhY2s6IHRydWUsXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBNEI7QUFDOVAsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsY0FBYyxXQUFXLHFCQUFxQjtBQUN2RCxTQUFTLFlBQVk7QUFFckIsSUFBTSxXQUFXO0FBRWpCLElBQU0sZUFBZTtBQUFBLEVBQ25CO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxhQUFhO0FBQUEsRUFDZjtBQUFBLEVBQ0E7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLGFBQWE7QUFBQSxFQUNmO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsYUFBYTtBQUFBLEVBQ2Y7QUFBQSxFQUNBO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxhQUFhO0FBQUEsRUFDZjtBQUFBLEVBQ0E7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLGFBQWE7QUFBQSxFQUNmO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsYUFBYTtBQUFBLEVBQ2Y7QUFBQSxFQUNBO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxhQUFhO0FBQUEsRUFDZjtBQUFBLEVBQ0E7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLGFBQWE7QUFBQSxFQUNmO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsYUFBYTtBQUFBLEVBQ2Y7QUFBQSxFQUNBO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxhQUFhO0FBQUEsRUFDZjtBQUFBLEVBQ0E7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLGFBQWE7QUFBQSxFQUNmO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsYUFBYTtBQUFBLEVBQ2Y7QUFBQSxFQUNBO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxhQUFhO0FBQUEsRUFDZjtBQUFBLEVBQ0E7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLGFBQWE7QUFBQSxFQUNmO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsYUFBYTtBQUFBLEVBQ2Y7QUFDRjtBQUVBLFNBQVMsd0JBQWdDO0FBQ3ZDLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLGNBQWM7QUFDWixZQUFNLFVBQVUsS0FBSyxRQUFRLElBQUksR0FBRyxNQUFNO0FBQzFDLFVBQUk7QUFDSixVQUFJO0FBQ0YsbUJBQVcsYUFBYSxLQUFLLFNBQVMsWUFBWSxHQUFHLE9BQU87QUFBQSxNQUM5RCxRQUFRO0FBQ04sZ0JBQVEsS0FBSyx3REFBd0Q7QUFDckU7QUFBQSxNQUNGO0FBRUEsaUJBQVcsUUFBUSxjQUFjO0FBQy9CLGNBQU0sV0FBVyxLQUFLLEtBQUssTUFBTSxHQUFHLEVBQUUsT0FBTyxPQUFPO0FBQ3BELGNBQU0sTUFBTSxLQUFLLFNBQVMsR0FBRyxRQUFRO0FBQ3JDLGtCQUFVLEtBQUssRUFBRSxXQUFXLEtBQUssQ0FBQztBQUVsQyxjQUFNLGVBQWUsS0FBSyxNQUFNLFFBQVEsTUFBTSxPQUFPLEVBQUUsUUFBUSxNQUFNLE1BQU0sRUFBRSxRQUFRLE1BQU0sTUFBTTtBQUNqRyxjQUFNLGNBQWMsS0FBSyxZQUFZLFFBQVEsTUFBTSxRQUFRO0FBRTNELGNBQU0sT0FBTyxTQUNWLFFBQVEseUJBQXlCLFVBQVUsWUFBWSxVQUFVLEVBQ2pFLFFBQVEsdURBQXdELEtBQUssV0FBVyxJQUFJLEVBQ3BGLFFBQVEsK0NBQWdELEtBQUssWUFBWSxJQUFJLEVBQzdFLFFBQVEscURBQXNELEtBQUssV0FBVyxJQUFJLEVBQ2xGLFFBQVEsNkNBQThDLEtBQUssUUFBUSxHQUFHLEtBQUssSUFBSSxJQUFJLEVBQ25GLFFBQVEscURBQXNELEtBQUssUUFBUSxHQUFHLEtBQUssSUFBSSxJQUFJLEVBQzNGLFFBQVEscURBQXNELEtBQUssUUFBUSxHQUFHLEtBQUssSUFBSSxJQUFJO0FBRTlGLHNCQUFjLEtBQUssS0FBSyxZQUFZLEdBQUcsSUFBSTtBQUFBLE1BQzdDO0FBRUEsY0FBUSxJQUFJO0FBQUEsc0JBQW9CLGFBQWEsTUFBTTtBQUFBLENBQTBCO0FBQUEsSUFDL0U7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLHNCQUFzQixDQUFDO0FBQUEsRUFDMUMsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxFQUMxQjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sb0JBQW9CO0FBQUEsRUFDdEI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
