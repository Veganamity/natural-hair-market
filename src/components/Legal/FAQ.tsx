import { X, HelpCircle, ChevronDown, Scissors, ShoppingBag, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FAQProps {
  onClose: () => void;
  onNavigate?: (view: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

const SELL_FAQS: FAQItem[] = [
  {
    question: 'Quels types de cheveux puis-je vendre sur Natural Hair Market ?',
    answer:
      'Natural Hair Market accepte tous les cheveux humains naturels : cheveux naturels européens, cheveux naturels français, cheveux colorés, méchés, gris, blancs, bouclés, lisses ou crépus. Ils doivent être coupés, attachés à la racine et en bon état (secs, propres, non emmêlés). Les cheveux synthétiques, ramassés au sol ou abîmés sont strictement refusés. Chaque annonce de vente de cheveux est vérifiée par notre équipe avant publication pour garantir la qualité offerte aux acheteurs.',
  },
  {
    question: 'Quelle longueur minimum est requise pour vendre ses cheveux ?',
    answer:
      'La longueur minimum pour vendre ses cheveux sur Natural Hair Market est de 15 cm, mesurés de la racine à la pointe. En dessous de cette longueur, les mèches ne peuvent être proposées qu\'en lot spécial pour des usages artistiques (FX, théâtre, tissage). Plus vos cheveux sont longs, plus le prix rachat cheveux naturels sera élevé : une mèche de 40 cm ou plus est particulièrement recherchée par les perruquiers et fabricants d\'extensions en Europe.',
  },
  {
    question: 'Comment sont évalués et estimés mes cheveux ?',
    answer:
      'Le prix rachat cheveux naturels dépend de plusieurs critères : la longueur (en centimètres), le poids (en grammes), la couleur (vierge, colorée ou grise) et la texture. Notre calculateur de prix intégré vous donne une estimation instantanée et gratuite en quelques secondes. Les cheveux naturels vierges non colorés obtiennent les valorisations les plus élevées. Les cheveux gris naturels sont également très prisés sur le marché européen. Vous fixez ensuite librement votre prix de vente.',
  },
  {
    question: 'Comment et quand suis-je payé après la vente ?',
    answer:
      'Dès qu\'un acheteur valide sa commande, le paiement est sécurisé sur notre plateforme via Stripe. Une fois la mèche expédiée et réceptionnée par l\'acheteur, le virement est libéré sur votre compte bancaire sous 48 heures ouvrées. Le vendeur touche 100 % du prix affiché dans son annonce — Natural Hair Market ne prélève aucune commission sur la vente. Les frais de livraison sont entièrement à la charge de l\'acheteur, vous n\'avancez rien.',
  },
  {
    question: 'Est-ce légal de vendre ses cheveux en France ?',
    answer:
      'Oui, vendre ses cheveux est tout à fait légal en France et en Europe. Aucun texte de loi n\'interdit la cession volontaire et consentie de cheveux humains. C\'est une pratique ancienne et encadrée, notamment dans le secteur de la perruquerie, des extensions capillaires et de la prothèse capillaire médicale. Natural Hair Market agit comme intermédiaire transparent et sécurisé entre vendeurs particuliers ou salons et acheteurs professionnels ou particuliers, dans le strict respect de la réglementation en vigueur.',
  },
];

const BUY_FAQS: FAQItem[] = [
  {
    question: 'Comment acheter des cheveux naturels sur la plateforme ?',
    answer:
      'L\'achat cheveux naturels sur Natural Hair Market est simple et sécurisé. Parcourez les annonces filtrables par longueur, couleur, texture et localisation. Une fois votre mèche idéale trouvée, ajoutez-la au panier et réglez en ligne via Stripe (carte bancaire). Une commission transparente de 10 % est ajoutée au prix vendeur. Natural Hair Market coordonne ensuite l\'expédition avec le vendeur. Vous recevez votre commande à domicile ou en point relais partout en France et en Europe.',
  },
  {
    question: 'Quelle est l\'origine et la traçabilité des cheveux proposés ?',
    answer:
      'Tous les cheveux proposés en achat cheveux naturels européens sur Natural Hair Market proviennent exclusivement de donneurs volontaires : particuliers français et européens, salons de coiffure partenaires. Chaque annonce est vérifiée par notre équipe (photos réelles, longueur conforme, état certifié). Les cheveux naturels européens sont particulièrement valorisés pour leur qualité, leur densité et leur compatibilité avec les techniques de pose d\'extensions ou de confection de perruques médicales et prothèses capillaires.',
  },
  {
    question: 'Quelles garanties sont offertes aux acheteurs ?',
    answer:
      'Natural Hair Market protège chaque acheteur de cheveux naturels. Le paiement est conservé en sécurité jusqu\'à confirmation de réception de la commande — vous ne débloquez le virement vers le vendeur qu\'après avoir validé la conformité de la mèche reçue. En cas de litige (mèche non conforme, différence de longueur ou de couleur), notre service après-vente intervient pour ouvrir un dossier de médiation, organiser un retour et procéder au remboursement intégral si nécessaire. Vous n\'êtes jamais seul face à un problème.',
  },
];

function FAQAccordion({ items, color }: { items: FAQItem[]; color: 'amber' | 'emerald' }) {
  const [open, setOpen] = useState<number | null>(null);

  const accent = color === 'amber'
    ? { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' }
    : { border: 'border-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className={`border rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md ${open === i ? accent.border : 'border-gray-200'}`}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
            aria-expanded={open === i}
          >
            <span className="font-semibold text-gray-800 pr-4 text-sm md:text-base leading-snug">
              {item.question}
            </span>
            <ChevronDown
              className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${open === i ? `rotate-180 ${accent.text}` : 'text-gray-400'}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${open === i ? 'max-h-96' : 'max-h-0'}`}
          >
            <div className={`px-6 pb-5 pt-2 text-gray-600 leading-relaxed text-sm border-t border-gray-100 ${accent.bg}`}>
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FAQ({ onClose, onNavigate }: FAQProps) {
  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.getElementById('meta-description') as HTMLMetaElement | null;
    const prevDesc = metaDesc?.content ?? '';

    document.title = 'FAQ - Vendre et acheter des cheveux naturels | Natural Hair Market';
    if (metaDesc) {
      metaDesc.content = 'Toutes les réponses à vos questions sur la vente et l\'achat de cheveux naturels sur Natural Hair Market.';
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.content = prevDesc;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full my-8">

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-xl flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-8 h-8 flex-shrink-0" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold leading-tight">
                Questions fréquentes sur la vente et l'achat de cheveux naturels
              </h1>
              <p className="text-emerald-100 text-sm mt-0.5 hidden md:block">
                Natural Hair Market — toutes vos réponses en un seul endroit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0 ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Intro + quick-links */}
        <div className="px-8 pt-8 pb-2">
          <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-3xl">
            Vous souhaitez <strong>vendre ses cheveux</strong> pour la première fois ou réaliser un{' '}
            <strong>achat cheveux naturels</strong> de qualité ? Retrouvez ci-dessous les réponses aux
            questions les plus fréquentes, organisées par profil. Pour aller plus loin, consultez
            notre guide complet pour{' '}
            <button
              onClick={() => onNavigate?.('sell-my-hair')}
              className="text-emerald-600 font-semibold hover:underline"
            >
              vendre mes cheveux
            </button>
            {' '}ou{' '}
            <button
              onClick={() => onNavigate?.('buy-european-hair')}
              className="text-emerald-600 font-semibold hover:underline"
            >
              l'achat cheveux naturels européens
            </button>
            .
          </p>

          {/* Stat badges */}
          <div className="flex flex-wrap gap-3 mt-5 mb-6">
            {[
              { icon: Scissors, label: '5 questions vendeurs', color: 'amber' },
              { icon: ShoppingBag, label: '3 questions acheteurs', color: 'emerald' },
              { icon: Shield, label: 'Transactions 100% sécurisées', color: 'teal' },
            ].map(({ icon: Icon, label, color }) => (
              <span
                key={label}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-${color}-50 text-${color}-700 border border-${color}-200`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-8 pb-6 space-y-10 max-h-[calc(100vh-320px)] overflow-y-auto">

          {/* Catégorie 1 — Vendeurs */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Scissors className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Questions sur la vente de cheveux
                </h2>
                <p className="text-sm text-gray-500">
                  Publication gratuite · Aucune commission vendeur · Paiement sécurisé
                </p>
              </div>
            </div>
            <FAQAccordion items={SELL_FAQS} color="amber" />
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => onNavigate?.('sell-my-hair')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800 hover:underline transition-colors"
              >
                <Scissors className="w-4 h-4" />
                Voir notre guide complet pour vendre mes cheveux naturels →
              </button>
            </div>
          </section>

          {/* Catégorie 2 — Acheteurs */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Questions sur l'achat de cheveux naturels
                </h2>
                <p className="text-sm text-gray-500">
                  Achat cheveux naturels européens · Qualité vérifiée · 10% de commission acheteur
                </p>
              </div>
            </div>
            <FAQAccordion items={BUY_FAQS} color="emerald" />
            <div className="mt-4">
              <button
                onClick={() => onNavigate?.('buy-european-hair')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                En savoir plus sur l'achat cheveux naturels européens →
              </button>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-base font-bold text-gray-800 mb-3">
              Vous n'avez pas trouvé votre réponse ?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Notre équipe répond à toutes vos questions sur la vente et l'achat de cheveux naturels
              sous 24h.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:naturalhairmarket@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                naturalhairmarket@gmail.com
              </a>
              <a
                href="tel:+33784898647"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +33 7 84 89 86 47
              </a>
            </div>
          </section>

        </div>

        {/* Footer sticky */}
        <div className="sticky bottom-0 bg-gray-50 px-8 py-4 rounded-b-xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
