import { useEffect } from 'react';
import { Info, Shield, CheckCircle, Heart, Users, TrendingUp, Package, CreditCard, Truck } from 'lucide-react';

interface AboutUsProps {
  onClose?: () => void;
  onNavigate?: (view: string) => void;
}

export function AboutUs({ onNavigate }: AboutUsProps) {
  useEffect(() => {
    document.title = 'À propos de Natural Hair Market – La 1ère marketplace de cheveux naturels en Europe';

    const metaDesc = document.getElementById('meta-description') as HTMLMetaElement | null;
    if (metaDesc) metaDesc.content = 'Natural Hair Market est la première marketplace française et européenne dédiée à l\'achat et la vente de cheveux naturels humains. Découvrez notre mission, nos valeurs et notre engagement.';

    const ogTitle = document.getElementById('og-title') as HTMLMetaElement | null;
    if (ogTitle) ogTitle.content = 'À propos de Natural Hair Market – Marketplace de cheveux naturels en Europe';

    const ogDesc = document.getElementById('og-description') as HTMLMetaElement | null;
    if (ogDesc) ogDesc.content = 'Découvrez Natural Hair Market, la première marketplace de cheveux naturels humains en France et en Europe. Mission, valeurs et engagements.';

    const ogUrl = document.getElementById('og-url') as HTMLMetaElement | null;
    if (ogUrl) ogUrl.content = 'https://www.naturalhairmarket.com/about';

    const script = document.createElement('script');
    script.id = 'about-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'AboutPage',
          '@id': 'https://www.naturalhairmarket.com/about#webpage',
          'url': 'https://www.naturalhairmarket.com/about',
          'name': 'À propos de Natural Hair Market – La 1ère marketplace de cheveux naturels en Europe',
          'description': 'Natural Hair Market est la première marketplace française et européenne dédiée à l\'achat et la vente de cheveux naturels humains entre particuliers, salons de coiffure et professionnels.',
          'inLanguage': 'fr-FR',
          'isPartOf': { '@id': 'https://www.naturalhairmarket.com/#website' },
          'about': { '@id': 'https://www.naturalhairmarket.com/#organization' },
          'dateModified': '2025-06-01',
        },
        {
          '@type': 'Organization',
          '@id': 'https://www.naturalhairmarket.com/#organization',
          'name': 'Natural Hair Market',
          'alternateName': 'NaturalHairMarket',
          'url': 'https://www.naturalhairmarket.com',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://www.naturalhairmarket.com/file_0000000094ac71f49db79e27f27b239c.png',
          },
          'description': 'Natural Hair Market est la première marketplace française dédiée à l\'achat et la vente de cheveux naturels humains entre particuliers, salons de coiffure et professionnels des extensions capillaires en Europe.',
          'foundingDate': '2024',
          'foundingLocation': { '@type': 'Place', 'name': 'France' },
          'areaServed': ['FR', 'BE', 'CH', 'LU', 'ES', 'DE', 'IT'],
          'contactPoint': [{
            '@type': 'ContactPoint',
            'email': 'naturalhairmarket@gmail.com',
            'telephone': '+33784898647',
            'contactType': 'customer service',
            'availableLanguage': 'French',
          }],
          'knowsAbout': [
            'vente cheveux naturels',
            'achat cheveux naturels',
            'cheveux naturels européens',
            'extensions capillaires',
            'perruques cheveux humains',
            'marketplace cheveux France',
          ],
        },
      ],
    });
    document.head.appendChild(script);

    return () => {
      document.getElementById('about-jsonld')?.remove();
    };
  }, []);

  return (
    <article
      className="max-w-4xl mx-auto"
      itemScope
      itemType="https://schema.org/AboutPage"
    >
      {/* En-tête */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Info className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              À propos de Natural Hair Market
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">La 1ère marketplace de cheveux naturels en France &amp; en Europe</p>
          </div>
        </div>
        <p className="text-gray-600 leading-relaxed text-sm md:text-base max-w-3xl" itemProp="description">
          NaturalHairMarket est la première marketplace dédiée à la vente et à l'achat de cheveux humains naturels et colorés, coupés dans les salons de coiffure ou par des particuliers en France et en Europe. Nous avons créé cette plateforme pour offrir une alternative simple, éthique et sécurisée à un marché jusque-là opaque et difficile d'accès.
        </p>
      </header>

      {/* Notre vision */}
      <section aria-labelledby="vision" className="bg-emerald-50 rounded-2xl p-6 mb-8">
        <h2 id="vision" className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Notre vision : un marché du cheveu plus juste
        </h2>
        <div className="space-y-4">
          {[
            { titre: 'Transparent', texte: 'Les prix varient énormément selon les intermédiaires. NaturalHairMarket rétablit un lien direct entre vendeurs et acheteurs.' },
            { titre: 'Éthique', texte: 'Nos annonces proviennent de personnes consentantes, qui vendent leurs cheveux volontairement et de manière encadrée.' },
            { titre: 'Accessible', texte: 'Nous rendons les cheveux européens — rares et très demandés — accessibles sans passer par des circuits complexes ou opaques.' },
            { titre: 'Équitable', texte: 'Le vendeur touche 100 % du montant de sa vente. L\'acheteur paie uniquement 10 % de commission sur la transaction.' },
          ].map(({ titre, texte }) => (
            <div key={titre} className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-800 mb-0.5">{titre}</p>
                <p className="text-gray-600 text-sm">{texte}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notre rôle */}
      <section aria-labelledby="role" className="mb-8">
        <h2 id="role" className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          Notre rôle : un intermédiaire de confiance
        </h2>
        <p className="text-gray-600 mb-5 text-sm md:text-base">
          Contrairement aux plateformes classiques, NaturalHairMarket n'est pas un simple site d'annonces. Nous jouons un rôle central à chaque étape de la transaction.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {[
            { titre: 'Vérification des annonces', detail: 'Cheveux humains uniquement, mèches attachées, longueur et état conformes. Chaque annonce est vérifiée avant mise en ligne.' },
            { titre: 'Sécurisation de la transaction', detail: 'Le paiement passe par NaturalHairMarket pour protéger à la fois le vendeur et l\'acheteur.' },
            { titre: 'Organisation de l\'envoi', detail: 'Les frais de livraison sont à la charge de l\'acheteur. Le vendeur reçoit des instructions claires.' },
            { titre: 'Service après-vente', detail: 'En cas de doute ou de problème, notre équipe intervient immédiatement. Aucun utilisateur n\'est laissé seul.' },
          ].map(({ titre, detail }) => (
            <div key={titre} className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                {titre}
              </h3>
              <p className="text-gray-600 text-sm ml-6">{detail}</p>
            </div>
          ))}
        </div>

        {/* Comment ça marche */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-5 text-center">Comment ça marche — 3 étapes</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Package, etape: '1. Annonce & vérification', detail: 'Cheveux humains uniquement, mèches attachées, longueur et état conformes. Chaque annonce est vérifiée avant mise en ligne.' },
              { icon: CreditCard, etape: '2. Transaction sécurisée', detail: 'Le paiement transite par NaturalHairMarket pour protéger vendeurs et acheteurs à chaque étape.' },
              { icon: Truck, etape: '3. Envoi & service après-vente', detail: 'L\'acheteur organise la livraison. En cas de doute ou de litige, notre équipe intervient rapidement.' },
            ].map(({ icon: Icon, etape, detail }) => (
              <div key={etape} className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 mb-1 text-sm">{etape}</p>
                  <p className="text-gray-600 text-xs">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi NHM existe */}
      <section aria-labelledby="pourquoi" className="bg-teal-50 rounded-2xl p-6 mb-8">
        <h2 id="pourquoi" className="text-xl font-bold text-gray-800 mb-4">Pourquoi Natural Hair Market existe ?</h2>
        <p className="text-gray-600 mb-3 text-sm">Pendant des années, nous avons constaté :</p>
        <ul className="space-y-1.5 text-gray-600 text-sm mb-4">
          {[
            'Des salons qui jetaient ou stockaient des mèches très précieuses',
            'Des particuliers qui ignoraient que leurs cheveux avaient de la valeur',
            'Des acheteurs forcés d\'importer des cheveux souvent de qualité douteuse',
            'Un marché dominé par des intermédiaires invisibles',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-gray-700 font-semibold text-sm">
          NaturalHairMarket connecte directement ceux qui coupent et ceux qui transforment. C'est plus juste pour tout le monde.
        </p>
      </section>

      {/* Nos valeurs */}
      <section aria-labelledby="valeurs" className="mb-8">
        <h2 id="valeurs" className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <Heart className="w-5 h-5 text-emerald-600" />
          Nos valeurs
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { num: '1', titre: 'Transparence', detail: 'Chaque mèche est clairement décrite : longueur, poids, couleur, état.' },
            { num: '2', titre: 'Sécurité', detail: 'Toutes les transactions passent par nous pour protéger chaque utilisateur.' },
            { num: '3', titre: 'Accessibilité', detail: 'Les vendeurs ne paient rien. Les acheteurs paient seulement 10 % de commission.' },
            { num: '4', titre: 'Éthique', detail: 'Pas de cheveux ramassés, pas de cheveux synthétiques, pas d\'ambiguïté.' },
          ].map(({ num, titre, detail }) => (
            <div key={num} className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-1 text-sm">{num}. {titre}</h3>
              <p className="text-gray-600 text-sm">{detail}</p>
            </div>
          ))}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:col-span-2">
            <h3 className="font-bold text-gray-800 mb-1 text-sm">5. Respect du travail des salons</h3>
            <p className="text-gray-600 text-sm">Nous aidons les coiffeurs à valoriser un matériau qu'ils ne valorisaient pas.</p>
          </div>
        </div>
      </section>

      {/* À qui s'adresse */}
      <section aria-labelledby="audience" className="mb-8">
        <h2 id="audience" className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          À qui s'adresse Natural Hair Market ?
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-emerald-50 rounded-xl p-5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Aux vendeurs
            </h3>
            <ul className="space-y-1 text-sm text-gray-600">
              {['Salons de coiffure', 'Particuliers', 'Personnes souhaitant valoriser leurs cheveux coupés'].map((v) => (
                <li key={v} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />{v}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-teal-50 rounded-xl p-5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-teal-600" />
              Aux acheteurs
            </h3>
            <ul className="space-y-1 text-sm text-gray-600">
              {['Perruquiers', 'Prothésistes capillaires', 'Fabricants d\'extensions', 'Artistes FX, théâtre, cinéma', 'Particuliers recherchant de vrais cheveux humains'].map((v) => (
                <li key={v} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0 mt-1.5" />{v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Le mot de la fondatrice */}
      <section className="bg-white border-2 border-emerald-600 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-3 italic">Le mot de la fondatrice</h2>
        <blockquote className="text-gray-600 leading-relaxed italic mb-3 text-sm md:text-base" cite="https://www.naturalhairmarket.com/about">
          « J'ai créé NaturalHairMarket pour mettre fin au gaspillage des cheveux coupés en salon, pour offrir une alternative aux importations, et pour permettre à chacun de vendre ses cheveux dans un cadre juste et sécurisé. Aujourd'hui, c'est la première plateforme française qui protège à la fois les vendeurs et les acheteurs. »
        </blockquote>
        <p className="text-gray-800 font-semibold text-right text-sm">— Fondatrice de Natural Hair Market</p>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-8 mb-8 text-center">
        <h2 className="text-xl font-bold mb-3">Rejoignez Natural Hair Market</h2>
        <p className="text-emerald-50 mb-5 text-sm leading-relaxed max-w-xl mx-auto">
          Plus qu'une marketplace : un nouveau standard, une plateforme fiable, éthique et innovante pour tous ceux qui travaillent avec les cheveux humains.
        </p>
        <div className="space-y-2 text-left max-w-xl mx-auto text-sm mb-4">
          {[
            'Vendeurs : créez votre annonce gratuitement',
            'Acheteurs : trouvez des cheveux naturels ou colorés en quelques secondes',
            'Une équipe disponible pour vous accompagner',
            'Service après-vente réactif',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => onNavigate?.('sell-my-hair')}
          className="inline-block mt-2 px-6 py-2.5 bg-white text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition-colors text-sm"
        >
          Commencer à vendre mes cheveux →
        </button>
      </section>

      {/* Contact */}
      <section aria-labelledby="contact" className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 id="contact" className="text-xl font-bold text-gray-800 mb-5 text-center">Nous contacter</h2>
        <div className="space-y-3 max-w-md mx-auto">
          <a
            href="mailto:naturalhairmarket@gmail.com"
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors group"
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition-colors">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Email</p>
              <span className="text-emerald-600 font-semibold text-sm">naturalhairmarket@gmail.com</span>
            </div>
          </a>
          <a
            href="tel:+33784898647"
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors group"
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition-colors">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Téléphone</p>
              <span className="text-emerald-600 font-semibold text-sm">+33 7 84 89 86 47</span>
            </div>
          </a>
        </div>
        <p className="text-center text-gray-500 text-xs mt-4">
          Réponse sous 24h ·{' '}
          <a href="mailto:naturalhairmarket@gmail.com" className="text-emerald-600 font-semibold hover:underline">Nous contacter</a>
        </p>
      </section>
    </article>
  );
}
