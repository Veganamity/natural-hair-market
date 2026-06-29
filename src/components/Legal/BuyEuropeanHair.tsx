import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Users,
  Truck,
  Award,
  ChevronDown,
  ChevronUp,
  Search,
  Lock,
  Heart,
  Scissors,
  MapPin,
  Package,
  CreditCard,
} from 'lucide-react';

interface BuyEuropeanHairProps {
  onGoToMarketplace: () => void;
  onSignUp: () => void;
}

const FAQS = [
  {
    q: 'Les cheveux sont-ils vraiment naturels ?',
    a: "Oui. Chaque annonce précise l'état exact des cheveux : vierges (jamais colorés), colorés ou traités. Les vendeurs sont tenus de décrire fidèlement leur lot et de fournir des photos conformes. Notre équipe modère chaque annonce avant publication. Tout écart signalé dans les 72 heures suivant la réception déclenche une procédure de remboursement.",
  },
  {
    q: 'Puis-je retourner ma commande ?',
    a: "Si les cheveux reçus ne correspondent pas à la description (couleur, longueur, état), ouvrez un litige dans les 72 heures après réception. Notre équipe examine les photos et échanges, puis peut ordonner un remboursement intégral. La traçabilité complète des transactions facilite la résolution rapide de chaque litige.",
  },
  {
    q: 'Quels types de cheveux européens trouve-t-on ?',
    a: "La marketplace propose des cheveux lisses, ondulés, bouclés et crépus. Les teintes naturelles vont du blond platine au châtain foncé, en passant par le roux et le gris argenté. Les longueurs disponibles s'étendent de 30 cm à plus de 80 cm. Tous les lots proviennent de vendeurs identifiés, basés en France ou en Europe.",
  },
  {
    q: 'Comment sont fixés les prix ?',
    a: "Chaque vendeur fixe librement son prix. Il n'y a ni prix imposé, ni intermédiaire. Ce modèle direct permet des prix compétitifs pour l'acheteur et une rémunération juste pour le vendeur. Les prix varient selon la longueur, la texture, la couleur et l'état des cheveux. Comparez plusieurs annonces pour trouver le meilleur rapport qualité-prix.",
  },
];

const GUARANTEES = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    bg: 'bg-emerald-50 border-emerald-100',
    title: 'Paiement sécurisé',
    desc: "Chaque transaction est protégée par Stripe. Les fonds sont conservés jusqu'à confirmation de réception conforme.",
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
    bg: 'bg-blue-50 border-blue-100',
    title: 'Traçabilité garantie',
    desc: 'Chaque lot est associé à un vendeur identifié. Origine européenne, sourcing direct particulier à particulier.',
  },
  {
    icon: <Award className="w-6 h-6 text-amber-500" />,
    bg: 'bg-amber-50 border-amber-100',
    title: 'Modération des annonces',
    desc: "Notre équipe valide chaque annonce pour s'assurer que les descriptions et photos sont conformes à la réalité.",
  },
  {
    icon: <Lock className="w-6 h-6 text-teal-600" />,
    bg: 'bg-teal-50 border-teal-100',
    title: 'Programme acheteur',
    desc: 'En cas de non-conformité, ouvrez un litige. Remboursement intégral si les cheveux ne correspondent pas.',
  },
];

export function BuyEuropeanHair({ onGoToMarketplace, onSignUp }: BuyEuropeanHairProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.getElementById('meta-description') as HTMLMetaElement | null;
    const prevDesc = metaDesc?.content ?? '';
    document.title = 'Acheter des cheveux naturels européens | Natural Hair Market';
    if (metaDesc) {
      metaDesc.content = 'Achetez des cheveux naturels humains européens directement auprès de vendeurs vérifiés. Cheveux vierges, colorés, lisses ou bouclés. Paiement sécurisé, livraison Colissimo ou Mondial Relay.';
    }
    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.content = prevDesc;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 text-emerald-700 text-sm font-medium mb-5">
            <Globe className="w-4 h-4" />
            Marketplace cheveux naturels européens
          </div>

          {/* H1 imposé — ne pas modifier */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Achetez des cheveux naturels humains en Europe
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mb-3">
            Prix directs entre particuliers. Cheveux bruts, non traités. Le plus grand choix de{' '}
            <strong>cheveux naturels humains</strong> en Europe.
          </p>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed mb-8">
            Parcourez des centaines d'annonces vérifiées. Achetez en toute confiance grâce au paiement sécurisé Stripe et à notre programme acheteur.
          </p>

          {/* [PHOTO : exemple de mèche de cheveux européens de haute qualité] */}
          <div className="w-full max-w-2xl mx-auto rounded-2xl border border-gray-100 mb-8 overflow-hidden shadow-sm">
            <img
              src="/Nano_Banana-2026-06-29-13-24-29.png"
              alt="Mèches de cheveux naturels européens de différentes origines et textures — Natural Hair Market"
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* Lien interne 1 */}
            <button
              onClick={onGoToMarketplace}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-sm text-base"
            >
              <Search className="w-5 h-5" />
              Parcourir les annonces
            </button>
            {/* Lien interne 2 */}
            <button
              onClick={onSignUp}
              className="inline-flex items-center gap-2 border-2 border-emerald-200 text-emerald-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-colors text-base"
            >
              <ArrowRight className="w-5 h-5" />
              Créer un compte acheteur
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-14">

        {/* SECTION 1 — Types de cheveux */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Cheveux européens, russes, brésiliens — tous les types disponibles
          </h2>

          {/* [PHOTO : collage de différentes textures de cheveux disponibles] */}
          <div className="w-full h-40 bg-gradient-to-r from-amber-50 to-rose-50 rounded-xl border border-gray-100 overflow-hidden mb-5">
            <img
              src="https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Collage de différentes textures de cheveux disponibles sur la marketplace"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-gray-600 leading-relaxed mb-4">
            Natural Hair Market propose le plus large choix de <strong>cheveux naturels humains</strong> en Europe.{' '}
            Vous y trouvez des <strong>cheveux européens</strong> vierges aux teintes naturelles rares — blond platine, châtain, roux, gris argenté —{' '}
            mais aussi des cheveux d'origine russe, ukrainienne ou brésilienne.{' '}
            Chaque annonce précise l'origine, la texture et l'état exact du lot.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            L'<strong>achat cheveux naturels</strong> n'a jamais été aussi simple.{' '}
            Filtrez par texture pour trouver exactement ce dont vous avez besoin.{' '}
            Les cheveux lisses conviennent aux extensions classiques.{' '}
            Les cheveux ondulés offrent un rendu naturel immédiat.{' '}
            Les cheveux bouclés s'adaptent à toutes les morphologies.{' '}
            Les cheveux crépus sont prisés pour les perruques sur mesure.
          </p>
          <p className="text-gray-600 leading-relaxed mb-5">
            Les longueurs disponibles couvrent tous les besoins : courtes (30–40 cm) — moyennes (40–55 cm) — longues (55–70 cm) — très longues (70 cm et plus).{' '}
            Les plus grands lots atteignent 90 cm. Chaque vendeur indique la longueur exacte avec photos à l'appui.
          </p>

          <div className="flex flex-wrap gap-2 text-sm font-medium">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-lg">
              Cheveux lisses
            </span>
            <span className="text-gray-400 self-center">—</span>
            <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg">
              Cheveux ondulés
            </span>
            <span className="text-gray-400 self-center">—</span>
            <span className="bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-lg">
              Cheveux bouclés
            </span>
            <span className="text-gray-400 self-center">—</span>
            <span className="bg-rose-50 text-rose-700 border border-rose-100 px-3 py-1.5 rounded-lg">
              Cheveux crépus
            </span>
          </div>

          {/* Lien interne 3 */}
          <div className="mt-6">
            <button
              onClick={onGoToMarketplace}
              className="inline-flex items-center gap-2 text-emerald-700 font-semibold text-sm hover:underline"
            >
              <Search className="w-4 h-4" />
              Voir toutes les annonces par texture
            </button>
          </div>
        </section>

        {/* SECTION 2 — Vendeurs vérifiés */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Des vendeurs vérifiés, des cheveux 100 % humains
          </h2>

          {/* [PHOTO : badge/sceau de vérification ou vendeur en action] */}
          <div className="w-full h-40 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-gray-100 overflow-hidden mb-5">
            <img
              src="https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Vendeur vérifié sur la marketplace cheveux naturels Natural Hair Market"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-gray-600 leading-relaxed mb-4">
            Sur cette <strong>marketplace cheveux naturels</strong>, chaque vendeur est identifié et chaque annonce est modérée avant publication.{' '}
            Notre équipe vérifie la cohérence entre les photos et la description.{' '}
            Les annonces non conformes sont retirées immédiatement.{' '}
            Vous achetez en sachant exactement ce que vous recevez.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Les <strong>cheveux naturels humains</strong> proposés proviennent exclusivement de particuliers ayant vendu leurs propres cheveux.{' '}
            Aucun lot importé en masse. Aucune fibre synthétique.{' '}
            Chaque mèche correspond à une personne réelle, localisée en France ou en Europe.{' '}
            La traçabilité est totale et vérifiable.
          </p>
          <p className="text-gray-600 leading-relaxed mb-5">
            Notre programme acheteur protège chaque transaction.{' '}
            Si les cheveux reçus ne correspondent pas à l'annonce, ouvrez un litige dans les 72 heures.{' '}
            Notre équipe examine la situation.{' '}
            Le remboursement intégral est déclenché si la non-conformité est confirmée.{' '}
            Vous ne prenez aucun risque.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {GUARANTEES.map((g) => (
              <div key={g.title} className={`border rounded-xl p-4 ${g.bg}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">{g.icon}</div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1 text-sm">{g.title}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{g.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3 — Comment acheter */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Comment acheter en toute sécurité
          </h2>

          {/* [PHOTO : illustration du processus d'achat ou colis Colissimo] */}
          <div className="w-full h-40 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-gray-100 overflow-hidden mb-5">
            <img
              src="https://images.pexels.com/photos/4393668/pexels-photo-4393668.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Processus d'achat sécurisé sur Natural Hair Market, livraison Colissimo"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-gray-600 leading-relaxed mb-4">
            L'<strong>achat cheveux naturels européens</strong> sur Natural Hair Market se déroule en quatre étapes simples.{' '}
            Chaque étape est conçue pour garantir votre sécurité et celle du vendeur.{' '}
            Aucune avance de fonds sans protection. Aucun paiement hors plateforme.
          </p>

          <div className="space-y-4 mb-5">
            {[
              {
                num: 1,
                color: 'bg-emerald-600',
                icon: <Search className="w-5 h-5 text-emerald-600" />,
                bg: 'bg-emerald-50 border-emerald-100',
                title: 'Parcourez les annonces',
                body: "Filtrez par texture, longueur, couleur et état (vierge, coloré, traité). Consultez les photos, la description et le profil du vendeur. Ajoutez vos favoris pour comparer.",
              },
              {
                num: 2,
                color: 'bg-blue-600',
                icon: <Heart className="w-5 h-5 text-blue-600" />,
                bg: 'bg-blue-50 border-blue-100',
                title: 'Contactez le vendeur',
                body: "Posez vos questions directement via la messagerie intégrée. Demandez des photos supplémentaires si besoin. Le vendeur répond avant que vous ne passiez commande.",
              },
              {
                num: 3,
                color: 'bg-amber-500',
                icon: <CreditCard className="w-5 h-5 text-amber-500" />,
                bg: 'bg-amber-50 border-amber-100',
                title: 'Paiement sécurisé',
                body: "Payez en ligne via Stripe. Les fonds sont retenus jusqu'à confirmation de réception conforme. Aucun paiement direct au vendeur. Votre argent est protégé.",
              },
              {
                num: 4,
                color: 'bg-teal-600',
                icon: <Package className="w-5 h-5 text-teal-600" />,
                bg: 'bg-teal-50 border-teal-100',
                title: 'Livraison & confirmation',
                body: "Le vendeur expédie par Colissimo ou Mondial Relay avec signature obligatoire. Vérifiez la conformité à réception. Confirmez pour libérer le paiement. En cas de problème, ouvrez un litige sous 72 h.",
              },
            ].map((step) => (
              <div key={step.num} className={`border rounded-xl p-4 ${step.bg} flex gap-4`}>
                <div className="flex-shrink-0">
                  <div className={`w-9 h-9 rounded-full ${step.color} flex items-center justify-center font-bold text-white text-sm`}>
                    {step.num}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {step.icon}
                    <h3 className="font-semibold text-gray-800 text-sm">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-2">
            <strong>Modes de livraison disponibles :</strong>
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-5">
            Colissimo avec signature — Mondial Relay en point relais — Livraison dans toute l'Europe
          </p>

          {/* Lien interne 4 */}
          <button
            onClick={onGoToMarketplace}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            <Search className="w-4 h-4" />
            Commencer mon achat cheveux naturels
          </button>
        </section>

        {/* SECTION 4 — Pourquoi Natural Hair Market */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Pourquoi Natural Hair Market plutôt qu'une boutique classique
          </h2>

          <p className="text-gray-600 leading-relaxed mb-4">
            Les boutiques classiques et les perruqueries vendent des stocks achetés en gros, souvent en Asie.{' '}
            L'origine est opaque. Les prix intègrent de nombreux intermédiaires.{' '}
            La qualité est variable et difficile à vérifier avant l'achat.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Natural Hair Market fonctionne différemment.{' '}
            C'est une <strong>marketplace cheveux naturels</strong> en circuit direct.{' '}
            Chaque lot de <strong>cheveux européens</strong> vient d'un vendeur particulier identifié.{' '}
            Vous connaissez l'origine exacte avant d'acheter.{' '}
            Les prix sont fixés librement par le vendeur, sans marge d'intermédiaire.
          </p>
          <p className="text-gray-600 leading-relaxed mb-5">
            Les cheveux proposés sont bruts et non traités.{' '}
            Aucun processus industriel n'a dégradé la cuticule.{' '}
            Vous recevez des cheveux dans leur état d'origine — prêts à colorer, à travailler, à intégrer.{' '}
            Ce niveau de transparence est impossible à trouver dans une boutique classique.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {[
              { icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, text: 'Prix directs entre particuliers — sans intermédiaire' },
              { icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, text: 'Cheveux bruts non traités — cuticule intacte' },
              { icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, text: 'Choix unique en Europe — centaines d\'annonces' },
              { icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, text: 'Transparence totale — origine certifiée, photos réelles' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                <p className="text-sm text-gray-700 font-medium">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Profils acheteurs */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {[
              {
                icon: <Scissors className="w-7 h-7 text-emerald-600" />,
                bg: 'bg-emerald-50 border-emerald-100',
                title: 'Perruquiers & ateliers',
                desc: 'Approvisionnez vos créations avec des cheveux vierges européens. Stocks disponibles en permanence, tous longueurs.',
              },
              {
                icon: <Users className="w-7 h-7 text-blue-600" />,
                bg: 'bg-blue-50 border-blue-100',
                title: 'Salons & extensions',
                desc: 'Achetez des mèches conformes à vos exigences. Traçabilité totale, origine certifiée, livraison sécurisée.',
              },
              {
                icon: <Heart className="w-7 h-7 text-rose-500" />,
                bg: 'bg-rose-50 border-rose-100',
                title: 'Particuliers',
                desc: 'Extensions personnelles de haute qualité ou cheveux pour perruque médicale. Commandez sans minimum.',
              },
            ].map((item) => (
              <div key={item.title} className={`border rounded-xl p-4 text-center ${item.bg}`}>
                <div className="flex justify-center mb-3">{item.icon}</div>
                <p className="font-bold text-gray-900 mb-2 text-sm">{item.title}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Lien interne 5 */}
          <button
            onClick={onSignUp}
            className="inline-flex items-center gap-2 border-2 border-emerald-200 text-emerald-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4" />
            Créer mon compte gratuitement
          </button>
        </section>

        {/* Témoignages */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-5">
            Ils ont acheté sur Natural Hair Market
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                name: 'Marc D.',
                role: 'Perruquier, Paris',
                text: "La traçabilité est exactement ce que je cherchais. Je connais l'origine de chaque mèche. Mes clientes sont ravies.",
                detail: 'Mèches blondes, 60 cm',
              },
              {
                name: 'Sophie L.',
                role: 'Salon extensions, Lyon',
                text: 'Des cheveux européens de très bonne qualité, conformes aux photos. Livraison rapide avec signature. Je recommande.',
                detail: 'Lot châtain, 45 cm',
              },
              {
                name: 'Isabelle K.',
                role: 'Particulière, Bordeaux',
                text: "J'avais besoin de cheveux pour une perruque médicale. La démarche est simple, rassurante et les cheveux correspondent parfaitement.",
                detail: 'Mèche rousse, 50 cm',
              },
            ].map((t) => (
              <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-sm font-bold text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-0.5">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Livraison */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <h2 className="text-xl font-bold text-gray-900">Disponible partout en France et en Europe</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Nos vendeurs sont principalement basés en <strong>France</strong>, en Belgique, en Suisse et dans d'autres pays européens.{' '}
            La livraison vers tous les pays de l'Union Européenne est disponible.{' '}
            Chaque expédition est effectuée avec signature obligatoire.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Colissimo — Mondial Relay — Livraison internationale Europe
          </p>
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <Truck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-sm text-emerald-800 font-medium">
              Expédition sécurisée · Signature obligatoire · Suivi en temps réel
            </p>
          </div>
        </section>

        {/* SECTION 5 — FAQ avec schema.org */}
        <section itemScope itemType="https://schema.org/FAQPage">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Questions fréquentes</h2>
          <p className="text-gray-500 text-sm mb-6">
            Tout ce que vous devez savoir avant votre <strong>achat cheveux naturels européens</strong>.
          </p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
            {FAQS.map((faq, i) => (
              <div key={i} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <span itemProp="name" className="font-medium text-gray-800 text-sm leading-relaxed">
                    {faq.q}
                  </span>
                  {openFaq === i
                    ? <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  }
                </button>
                <div
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                  className={openFaq === i ? 'block' : 'hidden'}
                >
                  <div className="px-5 pb-5">
                    <p itemProp="text" className="text-gray-600 text-sm leading-relaxed bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-emerald-600 rounded-2xl p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4">
            <Search className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">
            Prêt à acheter des cheveux naturels européens ?
          </h2>
          <p className="text-emerald-100 mb-6 max-w-md mx-auto leading-relaxed text-sm">
            Des stocks disponibles en permanence. Des vendeurs vérifiés. Une livraison sécurisée.{' '}
            Rejoignez les acheteurs professionnels et particuliers qui font confiance à Natural Hair Market.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* Lien interne 6 */}
            <button
              onClick={onGoToMarketplace}
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-semibold px-7 py-3 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm text-sm"
            >
              <Search className="w-4 h-4" />
              Voir les annonces disponibles
            </button>
            {/* Lien interne 7 */}
            <button
              onClick={onSignUp}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"
            >
              <ArrowRight className="w-4 h-4" />
              Créer mon compte gratuitement
            </button>
          </div>
          <p className="text-emerald-200 text-xs mt-4">
            Achat cheveux naturels sécurisé · Traçabilité garantie · Livraison Colissimo ou Mondial Relay
          </p>
        </section>

      </div>
    </div>
  );
}
