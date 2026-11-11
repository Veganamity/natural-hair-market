import { HelpCircle, ChevronDown, Scissors, ShoppingBag, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface FAQProps {
  onClose?: () => void;
  onNavigate?: (view: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

const SELL_FAQS_FR: FAQItem[] = [
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

const BUY_FAQS_FR: FAQItem[] = [
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

const SELL_FAQS_EN: FAQItem[] = [
  {
    question: 'What types of hair can I sell on Natural Hair Market?',
    answer:
      'Natural Hair Market accepts all natural human hair: European natural hair, French natural hair, colored hair, highlighted hair, gray hair, white hair, curly, straight or kinky hair. It must be cut, tied at the root and in good condition (dry, clean, untangled). Synthetic hair, floor-swept hair or damaged hair is strictly refused. Each hair sale listing is verified by our team before publication to guarantee the quality offered to buyers.',
  },
  {
    question: 'What is the minimum length required to sell hair?',
    answer:
      'The minimum length to sell your hair on Natural Hair Market is 15 cm, measured from root to tip. Below this length, strands can only be offered as special lots for artistic uses (FX, theater, weaving). The longer your hair, the higher the natural hair buyback price: a strand of 40 cm or more is particularly sought after by wig makers and extension manufacturers in Europe.',
  },
  {
    question: 'How is my hair evaluated and appraised?',
    answer:
      'The natural hair buyback price depends on several criteria: length (in centimeters), weight (in grams), color (virgin, colored or gray) and texture. Our built-in price calculator gives you an instant, free estimate in seconds. Virgin uncolored natural hair gets the highest valuations. Natural gray hair is also highly prized in the European market. You then freely set your selling price.',
  },
  {
    question: 'How and when am I paid after the sale?',
    answer:
      'As soon as a buyer confirms their order, payment is secured on our platform via Stripe. Once the strand is shipped and received by the buyer, the transfer is released to your bank account within 48 business hours. The seller receives 100% of the price shown in their listing — Natural Hair Market takes no commission on the sale. Shipping costs are entirely borne by the buyer; you advance nothing.',
  },
  {
    question: 'Is it legal to sell your hair in France?',
    answer:
      'Yes, selling your hair is perfectly legal in France and Europe. No law prohibits the voluntary and consensual sale of human hair. It is an ancient and regulated practice, particularly in the wig-making, hair extension and medical hair prosthesis sectors. Natural Hair Market acts as a transparent and secure intermediary between individual or salon sellers and professional or individual buyers, in strict compliance with current regulations.',
  },
];

const BUY_FAQS_EN: FAQItem[] = [
  {
    question: 'How to buy natural hair on the platform?',
    answer:
      'Buying natural hair on Natural Hair Market is simple and secure. Browse listings filterable by length, color, texture and location. Once you find your ideal strand, add it to your cart and pay online via Stripe (bank card). A transparent 10% commission is added to the seller\'s price. Natural Hair Market then coordinates shipping with the seller. You receive your order at home or at a pickup point anywhere in France and Europe.',
  },
  {
    question: 'What is the origin and traceability of the hair offered?',
    answer:
      'All hair offered for purchase as European natural hair on Natural Hair Market comes exclusively from voluntary donors: French and European individuals, partner hair salons. Each listing is verified by our team (real photos, compliant length, certified condition). European natural hair is particularly valued for its quality, density and compatibility with extension application techniques or the making of medical wigs and hair prostheses.',
  },
  {
    question: 'What guarantees are offered to buyers?',
    answer:
      'Natural Hair Market protects every natural hair buyer. Payment is held securely until confirmation of order receipt — you only release the transfer to the seller after validating the conformity of the received strand. In case of a dispute (non-conforming strand, difference in length or color), our after-sales service intervenes to open a mediation file, organize a return and proceed with a full refund if necessary. You are never alone facing a problem.',
  },
];

const ALL_FAQS_FR = [...SELL_FAQS_FR, ...BUY_FAQS_FR];

function FAQAccordion({ items, color }: { items: FAQItem[]; color: 'amber' | 'emerald' }) {
  const [open, setOpen] = useState<number | null>(null);

  const accent = color === 'amber'
    ? { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-700' }
    : { border: 'border-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-700' };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className={`border rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md ${open === i ? accent.border : 'border-gray-200'}`}
          itemScope
          itemProp="mainEntity"
          itemType="https://schema.org/Question"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
            aria-expanded={open === i}
          >
            <span className="font-semibold text-gray-800 pr-4 text-sm md:text-base leading-snug" itemProp="name">
              {item.question}
            </span>
            <ChevronDown
              className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${open === i ? `rotate-180 ${accent.text}` : 'text-gray-400'}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${open === i ? 'max-h-96' : 'max-h-0'}`}
            itemScope
            itemProp="acceptedAnswer"
            itemType="https://schema.org/Answer"
          >
            <div className={`px-6 pb-5 pt-2 text-gray-600 leading-relaxed text-sm border-t border-gray-100 ${accent.bg}`} itemProp="text">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FAQ({ onNavigate }: FAQProps) {
  const { language } = useLanguage();

  const SELL_FAQS = language === 'fr' ? SELL_FAQS_FR : SELL_FAQS_EN;
  const BUY_FAQS = language === 'fr' ? BUY_FAQS_FR : BUY_FAQS_EN;

  useEffect(() => {
    document.title = language === 'fr'
      ? 'FAQ – Vendre et acheter des cheveux naturels | Natural Hair Market'
      : 'FAQ – Sell and buy natural hair | Natural Hair Market';

    const metaDesc = document.getElementById('meta-description') as HTMLMetaElement | null;
    if (metaDesc) metaDesc.content = language === 'fr'
      ? 'Toutes les réponses à vos questions sur la vente et l\'achat de cheveux naturels sur Natural Hair Market. Légalité, prix, garanties, livraison.'
      : 'All the answers to your questions about selling and buying natural hair on Natural Hair Market. Legality, pricing, guarantees, shipping.';

    const ogTitle = document.getElementById('og-title') as HTMLMetaElement | null;
    if (ogTitle) ogTitle.content = language === 'fr'
      ? 'FAQ – Vendre et acheter des cheveux naturels | Natural Hair Market'
      : 'FAQ – Sell and buy natural hair | Natural Hair Market';

    const ogDesc = document.getElementById('og-description') as HTMLMetaElement | null;
    if (ogDesc) ogDesc.content = language === 'fr'
      ? 'Toutes les réponses à vos questions sur la vente et l\'achat de cheveux naturels sur Natural Hair Market.'
      : 'All the answers to your questions about selling and buying natural hair on Natural Hair Market.';

    const ogUrl = document.getElementById('og-url') as HTMLMetaElement | null;
    if (ogUrl) ogUrl.content = 'https://www.naturalhairmarket.com/faq';

    const script = document.createElement('script');
    script.id = 'faq-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'name': 'FAQ – Vente et achat de cheveux naturels | Natural Hair Market',
      'url': 'https://www.naturalhairmarket.com/faq',
      'description': 'Questions fréquentes sur la vente et l\'achat de cheveux naturels humains sur Natural Hair Market, la première marketplace européenne de cheveux naturels.',
      'publisher': {
        '@type': 'Organization',
        'name': 'Natural Hair Market',
        'url': 'https://www.naturalhairmarket.com',
        'logo': 'https://www.naturalhairmarket.com/file_0000000094ac71f49db79e27f27b239c.png',
        'contactPoint': {
          '@type': 'ContactPoint',
          'email': 'naturalhairmarket@gmail.com',
          'telephone': '+33784898647',
          'contactType': 'customer service',
          'availableLanguage': 'French',
        },
      },
      'mainEntity': ALL_FAQS_FR.map(({ question, answer }) => ({
        '@type': 'Question',
        'name': question,
        'acceptedAnswer': { '@type': 'Answer', 'text': answer },
      })),
    });
    document.head.appendChild(script);

    return () => {
      document.getElementById('faq-jsonld')?.remove();
    };
  }, [language]);

  const badges = language === 'fr'
    ? [
        { icon: Scissors, label: '5 questions vendeurs', color: 'amber' },
        { icon: ShoppingBag, label: '3 questions acheteurs', color: 'emerald' },
        { icon: Shield, label: 'Transactions 100 % sécurisées', color: 'teal' },
      ]
    : [
        { icon: Scissors, label: '5 seller questions', color: 'amber' },
        { icon: ShoppingBag, label: '3 buyer questions', color: 'emerald' },
        { icon: Shield, label: '100% secure transactions', color: 'teal' },
      ];

  return (
    <article
      className="max-w-4xl mx-auto"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      {/* En-tête */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              {language === 'fr' ? 'Questions fréquentes — vente & achat de cheveux naturels' : 'Frequently Asked Questions — selling & buying natural hair'}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {language === 'fr' ? 'Natural Hair Market · Réponses mises à jour en 2025' : 'Natural Hair Market · Answers updated in 2025'}
            </p>
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed max-w-3xl text-sm md:text-base">
          {language === 'fr' ? (
            <>Vous souhaitez <strong>vendre ses cheveux</strong> pour la première fois ou réaliser un{' '}
            <strong>achat cheveux naturels</strong> de qualité ? Retrouvez ci-dessous les réponses aux
            questions les plus fréquentes. Pour aller plus loin, consultez notre guide{' '}
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
              acheter des cheveux naturels européens
            </button>
            .</>
          ) : (
            <>Want to <strong>sell your hair</strong> for the first time or make a quality{' '}
            <strong>natural hair purchase</strong>? Find below the answers to the
            most frequently asked questions. To learn more, check our guide to{' '}
            <button
              onClick={() => onNavigate?.('sell-my-hair')}
              className="text-emerald-600 font-semibold hover:underline"
            >
              selling my hair
            </button>
            {' '}or{' '}
            <button
              onClick={() => onNavigate?.('buy-european-hair')}
              className="text-emerald-600 font-semibold hover:underline"
            >
              buying European natural hair
            </button>
            .</>
          )}
        </p>

        <div className="flex flex-wrap gap-3 mt-5">
          {badges.map(({ icon: Icon, label, color }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-${color}-50 text-${color}-700 border border-${color}-200`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </span>
          ))}
        </div>
      </header>

      {/* Section vendeurs */}
      <section aria-labelledby="faq-vendeurs" className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Scissors className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 id="faq-vendeurs" className="text-xl font-bold text-gray-900">
              {language === 'fr' ? 'Questions sur la vente de cheveux' : 'Questions about selling hair'}
            </h2>
            <p className="text-sm text-gray-500">
              {language === 'fr' ? 'Publication gratuite · Aucune commission vendeur · Paiement sécurisé' : 'Free listing · No seller commission · Secure payment'}
            </p>
          </div>
        </div>
        <FAQAccordion items={SELL_FAQS} color="amber" />
        <div className="mt-4">
          <button
            onClick={() => onNavigate?.('sell-my-hair')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800 hover:underline transition-colors"
          >
            <Scissors className="w-4 h-4" />
            {language === 'fr' ? 'Voir notre guide complet pour vendre mes cheveux naturels →' : 'See our complete guide to selling my natural hair →'}
          </button>
        </div>
      </section>

      {/* Section acheteurs */}
      <section aria-labelledby="faq-acheteurs" className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 id="faq-acheteurs" className="text-xl font-bold text-gray-900">
              {language === "fr" ? "Questions sur l'achat de cheveux naturels" : 'Questions about buying natural hair'}
            </h2>
            <p className="text-sm text-gray-500">
              {language === 'fr' ? 'Cheveux naturels européens · Qualité vérifiée · 10 % de commission acheteur' : 'European natural hair · Verified quality · 10% buyer commission'}
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
            {language === "fr" ? "En savoir plus sur l'achat cheveux naturels européens →" : 'Learn more about buying European natural hair →'}
          </button>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <h2 className="text-base font-bold text-gray-800 mb-2">
          {language === 'fr' ? "Vous n'avez pas trouvé votre réponse ?" : "Didn't find your answer?"}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {language === 'fr'
            ? "Notre équipe répond à toutes vos questions sur la vente et l'achat de cheveux naturels sous 24h."
            : "Our team answers all your questions about selling and buying natural hair within 24h."}
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
    </article>
  );
}
