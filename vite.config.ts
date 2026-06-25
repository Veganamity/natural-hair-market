import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'https://www.naturalhairmarket.com';

const STATIC_PAGES = [
  {
    path: '/marketplace',
    title: 'Marketplace Cheveux Naturels | Natural Hair Market',
    description: "Parcourez des centaines d'annonces de cheveux naturels humains à vendre en Europe : blonds, bruns, châtains. Achat sécurisé.",
  },
  {
    path: '/vendre-mes-cheveux',
    title: 'Vendre mes Cheveux Naturels | Natural Hair Market',
    description: 'Vendez vos cheveux naturels en toute sécurité. Estimez le prix de vos cheveux et publiez votre annonce gratuitement. Longueur minimale 15 cm.',
  },
  {
    path: '/sell-my-hair',
    title: 'Vendre mes Cheveux Naturels | Natural Hair Market',
    description: 'Vendez vos cheveux naturels en toute sécurité. Estimez le prix de vos cheveux et publiez votre annonce gratuitement. Longueur minimale 15 cm.',
  },
  {
    path: '/faq',
    title: 'FAQ – Questions fréquentes | Natural Hair Market',
    description: "Toutes les réponses à vos questions sur l'achat et la vente de cheveux naturels sur Natural Hair Market.",
  },
  {
    path: '/about',
    title: 'À propos | Natural Hair Market',
    description: 'Découvrez Natural Hair Market, la première marketplace française dédiée à l\'achat et la vente de cheveux naturels humains en Europe.',
  },
  {
    path: '/guide-coupe-conservation',
    title: 'Guide Coupe & Conservation des Cheveux | Natural Hair Market',
    description: 'Comment couper et conserver vos cheveux pour les vendre au meilleur prix. Conseils pratiques pour les vendeurs de cheveux naturels.',
  },
  {
    path: '/safety',
    title: 'Qualité & Sécurité | Natural Hair Market',
    description: 'Comment Natural Hair Market garantit la qualité et la sécurité des transactions de cheveux naturels.',
  },
  {
    path: '/seller-rules',
    title: 'Règles vendeurs | Natural Hair Market',
    description: 'Règles et conseils pour vendre des cheveux naturels sur Natural Hair Market.',
  },
  {
    path: '/buyer-rules',
    title: 'Règles acheteurs | Natural Hair Market',
    description: 'Règles et conseils pour acheter des cheveux naturels sur Natural Hair Market.',
  },
  {
    path: '/partenaires',
    title: 'Nos Partenaires | Natural Hair Market',
    description: 'Découvrez les partenaires de Natural Hair Market : salons certifiés et prestataires de services.',
  },
  {
    path: '/privacy',
    title: 'Politique de confidentialité | Natural Hair Market',
    description: 'Politique de confidentialité et protection des données personnelles de Natural Hair Market.',
  },
  {
    path: '/terms',
    title: "Conditions d'utilisation | Natural Hair Market",
    description: "Conditions générales d'utilisation de la marketplace Natural Hair Market.",
  },
  {
    path: '/mentions-legales',
    title: "Conditions d'utilisation | Natural Hair Market",
    description: "Conditions générales d'utilisation de la marketplace Natural Hair Market.",
  },
  {
    path: '/sales',
    title: 'Conditions générales de vente | Natural Hair Market',
    description: 'Conditions générales de vente applicables aux transactions sur Natural Hair Market.',
  },
  {
    path: '/refund',
    title: 'Politique de remboursement | Natural Hair Market',
    description: 'Notre politique de remboursement et de protection des acheteurs sur Natural Hair Market.',
  },
];

function prerenderRoutesPlugin(): Plugin {
  return {
    name: 'prerender-routes',
    apply: 'build',
    closeBundle() {
      const distDir = join(process.cwd(), 'dist');
      let baseHtml: string;
      try {
        baseHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');
      } catch {
        console.warn('prerender-routes: dist/index.html not found, skipping.');
        return;
      }

      for (const page of STATIC_PAGES) {
        const segments = page.path.split('/').filter(Boolean);
        const dir = join(distDir, ...segments);
        mkdirSync(dir, { recursive: true });

        const escapedTitle = page.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const escapedDesc = page.description.replace(/"/g, '&quot;');

        const html = baseHtml
          .replace(/<title>[^<]*<\/title>/, `<title>${escapedTitle}</title>`)
          .replace(/(<meta id="meta-description"[^>]*content=")[^"]*(")/,  `$1${escapedDesc}$2`)
          .replace(/(<meta id="og-title"[^>]*content=")[^"]*(")/,  `$1${escapedTitle}$2`)
          .replace(/(<meta id="og-description"[^>]*content=")[^"]*(")/,  `$1${escapedDesc}$2`)
          .replace(/(<meta id="og-url"[^>]*content=")[^"]*(")/,  `$1${BASE_URL}${page.path}$2`)
          .replace(/(<link[^>]*id="canonical-url"[^>]*href=")[^"]*(")/,  `$1${BASE_URL}${page.path}$2`)
          .replace(/(<link[^>]*href=")[^"]*("[^>]*id="canonical-url")/,  `$1${BASE_URL}${page.path}$2`);

        writeFileSync(join(dir, 'index.html'), html);
      }

      console.log(`\n✓ Pre-rendered ${STATIC_PAGES.length} static routes for SEO\n`);
    },
  };
}

export default defineConfig({
  plugins: [react(), prerenderRoutesPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true,
    port: 5173,
    historyApiFallback: true,
  },
});
