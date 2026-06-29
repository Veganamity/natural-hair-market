interface AppFooterProps {
  onNavigate: (view: string) => void;
}

const NAV_LINKS = [
  { label: 'À propos', href: '/a-propos', view: 'about' },
  { label: 'Mentions légales', href: '/mentions-legales', view: 'terms' },
  { label: 'FAQ', href: '/faq', view: 'faq' },
  { label: 'CGU', href: '/cgu', view: 'terms' },
  { label: 'CGV', href: '/cgv', view: 'sales' },
  { label: 'Remboursements', href: '/remboursements', view: 'refund' },
  { label: 'Sécurité & Qualité', href: '/securite-qualite', view: 'safety' },
  { label: 'Vendre mes cheveux', href: '/vendre-mes-cheveux', view: 'sell-my-hair' },
  { label: 'Règlement vendeur', href: '/reglement-vendeur', view: 'seller-rules' },
  { label: 'Règlement acheteur', href: '/reglement-acheteur', view: 'buyer-rules' },
  { label: 'Politique de confidentialité', href: '/politique-de-confidentialite', view: 'privacy' },
  { label: 'Guide de coupe', href: '/guide-coupe-conservation', view: 'guide-coupe' },
  { label: 'Nos Partenaires', href: '/partenaires', view: 'partners' },
  { label: 'Achats cheveux naturels européens', href: '/achat-cheveux-naturels-europeens', view: 'buy-european-hair' },
];

export function AppFooter({ onNavigate }: AppFooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-4 mt-auto">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-6">
          <img
            src="/file_0000000094ac71f49db79e27f27b239c.png"
            alt="Natural Hair Market"
            className="h-10 w-auto mx-auto mb-3 opacity-80"
          />
          <p className="text-sm text-gray-400">
            La première marketplace française dédiée aux cheveux naturels & colorés humains
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 max-w-xl mx-auto">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold text-sm">Email</h4>
            </div>
            <a href="mailto:naturalhairmarket@gmail.com" className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors break-all">
              naturalhairmarket@gmail.com
            </a>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold text-sm">Téléphone</h4>
            </div>
            <a href="tel:+33784898647" className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">
              +33 7 84 89 86 47
            </a>
          </div>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6">
          {NAV_LINKS.map(({ label, href, view }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => { e.preventDefault(); onNavigate(view); }}
              className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors whitespace-nowrap"
            >
              {label}
            </a>
          ))}
        </nav>

        <p className="text-xs text-gray-500 text-center">
          © 2025 Natural Hair Market — Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
