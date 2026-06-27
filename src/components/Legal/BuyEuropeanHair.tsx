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
} from 'lucide-react';

interface BuyEuropeanHairProps {
  onGoToMarketplace: () => void;
  onSignUp: () => void;
}

const faqs = [
  {
    q: "Qu'est-ce qui distingue les cheveux naturels européens des autres origines ?",
    a: "Les cheveux européens présentent une structure capillaire très fine, une cuticule alignée naturellement et une compatibilité chromatique exceptionnelle avec les teintes naturelles. Ils ne nécessitent aucun traitement acide pour aligner les écailles, ce qui leur confère une durabilité supérieure dans les extensions et les perruques. Leur finesse et leur légèreté assurent un rendu naturel inégalé.",
  },
  {
    q: "Comment puis-je acheter des cheveux naturels européens sur Natural Hair Market ?",
    a: "Il vous suffit de créer un compte gratuit, de parcourir le catalogue et de passer commande directement sur l'annonce souhaitée. Le paiement est sécurisé par Stripe. Une fois la commande validée, le vendeur expédie les cheveux et vous recevez la confirmation dès réception. Chaque transaction est protégée par notre programme acheteur.",
  },
  {
    q: "Les cheveux proposés sur la marketplace sont-ils tous naturels et non traités ?",
    a: "Chaque annonce précise explicitement l'état des cheveux : naturels vierges (jamais colorés), colorés, méchés ou traités. Les vendeurs sont tenus de décrire fidèlement leurs cheveux et de fournir des photos conformes. Notre équipe modère les annonces et peut retirer celles qui ne respectent pas nos standards de qualité et de transparence.",
  },
  {
    q: "Quels types de professionnels achètent des cheveux naturels européens ?",
    a: "Notre marketplace accueille des perruquiers, des extensions artistiques, des stylistes spécialisés dans les intégrations capillaires et des salons certifiés. Les particuliers peuvent également acheter des cheveux pour leurs propres extensions. Tous les acheteurs sont identifiés et validés par notre équipe pour garantir la sécurité des transactions.",
  },
  {
    q: "Quelle est la politique de retour en cas de non-conformité ?",
    a: "Si les cheveux reçus ne correspondent pas à la description de l'annonce (couleur, longueur, état), vous pouvez ouvrir un litige dans les 72 heures suivant la réception. Notre équipe examine la situation et peut ordonner un remboursement complet. La traçabilité des échanges et les photos de l'annonce font foi lors de l'arbitrage.",
  },
  {
    q: "Les cheveux sont-ils sourcés de manière éthique ?",
    a: "Natural Hair Market est une marketplace de vente entre particuliers : les vendeurs sont des personnes qui ont décidé librement de vendre leurs propres cheveux coupés. Chaque vendeur fixe son propre prix, sans pression ni intermédiaire. Cette approche garantit un sourcing 100 % éthique, transparent et traçable — chaque lot de cheveux correspond à une personne identifiée.",
  },
];

const GUARANTEES = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    bg: 'bg-emerald-50 border-emerald-100',
    title: 'Paiement sécurisé',
    desc: 'Chaque transaction est protégée par Stripe. Les fonds sont conservés jusqu\'à confirmation de réception conforme.',
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
    bg: 'bg-blue-50 border-blue-100',
    title: 'Traçabilité garantie',
    desc: 'Chaque lot de cheveux est associé à un vendeur identifié. Origine européenne, sourcing particulier à particulier.',
  },
  {
    icon: <Award className="w-6 h-6 text-amber-500" />,
    bg: 'bg-amber-50 border-amber-100',
    title: 'Modération des annonces',
    desc: 'Notre équipe modère chaque annonce pour s\'assurer que les descriptions et photos sont conformes à la réalité.',
  },
  {
    icon: <Lock className="w-6 h-6 text-teal-600" />,
    bg: 'bg-teal-50 border-teal-100',
    title: 'Programme acheteur',
    desc: 'En cas de non-conformité, vous pouvez ouvrir un litige. Remboursement intégral si les cheveux ne correspondent pas.',
  },
];

const HOW_IT_WORKS = [
  {
    num: 1,
    color: 'bg-emerald-600',
    border: 'border-emerald-100',
    bg: 'bg-emerald-50',
    icon: <Search className="w-5 h-5 text-emerald-600" />,
    title: 'Explorez le catalogue',
    body: 'Parcourez les annonces filtrées par longueur, couleur, texture et état. Chaque lot inclut des photos et une description détaillée du vendeur.',
  },
  {
    num: 2,
    color: 'bg-blue-600',
    border: 'border-blue-100',
    bg: 'bg-blue-50',
    icon: <Heart className="w-5 h-5 text-blue-600" />,
    title: 'Sélectionnez votre lot',
    body: 'Ajoutez vos coups de cœur en favoris, contactez le vendeur si besoin et passez commande en quelques clics. Paiement 100 % sécurisé.',
  },
  {
    num: 3,
    color: 'bg-amber-500',
    border: 'border-amber-100',
    bg: 'bg-amber-50',
    icon: <Truck className="w-5 h-5 text-amber-500" />,
    title: 'Réception sécurisée',
    body: 'Le vendeur expédie avec signature obligatoire. Vérifiez la conformité à réception et confirmez la commande pour libérer le paiement.',
  },
  {
    num: 4,
    color: 'bg-teal-600',
    border: 'border-teal-100',
    bg: 'bg-teal-50',
    icon: <CheckCircle className="w-5 h-5 text-teal-600" />,
    title: 'Commande validée',
    body: 'Votre lot est confirmé, le vendeur est payé. En cas de non-conformité, notre équipe vous accompagne et peut déclencher un remboursement.',
  },
];

export function BuyEuropeanHair({ onGoToMarketplace, onSignUp }: BuyEuropeanHairProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.getElementById('meta-description') as HTMLMetaElement | null;
    const prevDesc = metaDesc?.content ?? '';

    document.title = 'Achat Cheveux Naturels Européens | Natural Hair Market';
    if (metaDesc) {
      metaDesc.content = 'Découvrez notre sélection exclusive de cheveux naturels européens haut de gamme. Idéal pour des extensions, perruques et tissages de qualité professionnelle.';
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
            Marché cheveux naturels européens
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Achat de Cheveux Naturels Européens
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Natural Hair Market est le premier marché en ligne dédié à l'<strong>achat de cheveux naturels européens</strong>. Parcourez des stocks de mèches vierges et colorées, directement sourcées auprès de particuliers en France et en Europe. Traçabilité complète, paiement sécurisé et livraison avec signature.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onGoToMarketplace}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-sm text-base"
            >
              <Search className="w-5 h-5" />
              Parcourir le catalogue
            </button>
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

        {/* Intro SEO */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5 text-gray-600 text-sm md:text-base leading-relaxed">

          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Pourquoi acheter des cheveux naturels européens ?
          </h2>
          <p>
            Sur le marché mondial des cheveux humains, les <strong>cheveux naturels européens</strong> occupent une place d'exception. Leur structure capillaire — fine, lisse, à cuticule naturellement alignée — les distingue radicalement des fibres synthétiques ou des cheveux asiatiques traités chimiquement que l'on retrouve dans la plupart des circuits d'extensions industriels. Pour les perruquiers, les fabricants d'extensions et les salons spécialisés, l'<strong>achat cheveux naturels européens</strong> représente un investissement dans la qualité, la durabilité et le rendu naturel inégalé de leurs créations.
          </p>
          <p>
            La diversité chromatique naturelle des cheveux européens est l'autre atout décisif. Les châtains profonds, les blonds vénitiens, les roux ardents et les gris argentés typiques de l'Europe occidentale et centrale sont des teintes quasi impossibles à reproduire fidèlement avec des fibres synthétiques ou des cheveux colorés. Pour tout professionnel ou particulier souhaitant <strong>acheter cheveux naturels européens</strong> à des fins d'extensions ou de confection de perruques, cette authenticité chromatique est un critère non négociable.
          </p>
          <p>
            Natural Hair Market est la première plateforme française dédiée à l'<strong>achat de cheveux naturels</strong> en circuit direct. Chaque mèche disponible provient d'un vendeur particulier ou d'un salon partenaire localisé en France ou en Europe. La traçabilité est totale, le sourcing est éthique et chaque transaction est sécurisée par Stripe.
          </p>

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-2">
            Cheveux bruts vs cheveux traités : pourquoi choisir les bruts ?
          </h2>
          <p>
            La distinction entre <strong>cheveux naturels bruts</strong> et cheveux traités est fondamentale pour tout acheteur professionnel. Les <strong>cheveux vierges européens</strong> — aussi appelés cheveux bruts ou <strong>cheveux naturels non colorés</strong> — n'ont jamais subi de traitement chimique : aucune coloration, aucune décoloration, aucun lissage brésilien, aucun défrisage. Leur structure interne (cortex et cuticule) est donc intacte, ce qui leur confère des propriétés que les cheveux traités ne peuvent plus offrir.
          </p>
          <p>
            Les avantages des <strong>cheveux naturels bruts</strong> pour l'<strong>achat cheveux naturels pour extensions</strong> ou pour la confection de perruques sont multiples. Premièrement, leur résistance : un cheveu vierge supporte mieux les procédés de coloration, de décoloration et de chaleur que des cheveux déjà fragilisés par des traitements antérieurs. Deuxièmement, leur durabilité : une extension en cheveux bruts européens peut durer deux à trois fois plus longtemps qu'une extension en cheveux traités. Troisièmement, leur rendu : la cuticule intacte réfléchit la lumière uniformément, donnant un aspect brillant et sain absolument naturel.
          </p>
          <p>
            Pour l'<strong>achat cheveux naturels pour perruque</strong> médicale ou artistique, les cheveux bruts sont systématiquement préférés : leur légèreté, leur résistance au lavage répété et leur comportement prévisible face aux outils coiffants en font la matière première idéale. Sur Natural Hair Market, chaque annonce précise explicitement si les cheveux sont vierges, colorés ou traités, pour vous permettre de faire un choix éclairé.
          </p>

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-2">
            Pour qui : particuliers, perruquiers et fabricants d'extensions
          </h2>
          <p>
            Natural Hair Market est conçu pour répondre aux besoins de plusieurs profils d'acheteurs. Les <strong>perruquiers et ateliers de perruques</strong> y trouvent un approvisionnement régulier en <strong>cheveux vierges européens</strong> de toutes longueurs, idéaux pour la confection sur mesure. La traçabilité et l'éthique du sourcing répondent aux exigences croissantes de leurs clients professionnels et médicaux.
          </p>
          <p>
            Les <strong>fabricants d'extensions et salons spécialisés</strong> qui cherchent un <strong>fournisseur cheveux naturels européens</strong> fiable apprécient la qualité constante des mèches disponibles et la possibilité de passer des commandes régulières. Chaque lot est photographié, mesuré et décrit avec précision par le vendeur. L'<strong>achat cheveux naturels pour extensions</strong> n'a jamais été aussi transparent.
          </p>
          <p>
            Enfin, les <strong>particuliers</strong> — qu'ils recherchent des extensions personnelles de haute qualité ou des cheveux pour une perruque médicale suite à une chimiothérapie ou une alopécie — bénéficient du même niveau de protection et de qualité que les professionnels. La plateforme est accessible à tous, sans minimum de commande.
          </p>

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-2">
            Nos garanties : traçabilité, éthique, qualité et origine certifiée
          </h2>
          <p>
            La traçabilité est au cœur de notre démarche. Contrairement aux revendeurs de cheveux en gros qui importent des lots anonymes depuis l'Asie, chaque mèche disponible sur Natural Hair Market est associée à un vendeur identifié, localisé en France ou en Europe. L'origine est connue, vérifiable, et chaque transaction laisse une trace complète. C'est ce qui fait de notre plateforme un véritable <strong>fournisseur cheveux naturels européens</strong> de référence.
          </p>
          <p>
            Sur le plan éthique, notre modèle est irréprochable : les vendeurs sont des personnes qui ont librement décidé de vendre leurs propres cheveux, à un prix qu'ils ont eux-mêmes fixé. Il n'y a ni intermédiaire, ni exploitation, ni opacité. La qualité est contrôlée à double niveau : d'abord par notre équipe de modération qui valide chaque annonce, puis par l'acheteur à réception. Tout écart signalé dans les 72 heures suivant la réception est traité par notre équipe support avec possibilité de remboursement intégral.
          </p>

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-2">
            Comment acheter sur Natural Hair Market : 3 étapes simples
          </h2>
          <p>
            L'<strong>achat cheveux naturels</strong> sur notre plateforme se déroule en trois étapes intuitives. <strong>Étape 1</strong> : créez votre compte gratuitement et parcourez le catalogue filtrable par longueur, couleur, texture et état (vierge ou coloré). <strong>Étape 2</strong> : sélectionnez la mèche qui correspond à vos besoins, vérifiez les photos et la description, puis passez commande via notre système de paiement Stripe sécurisé. <strong>Étape 3</strong> : recevez votre commande, vérifiez sa conformité et confirmez la réception pour libérer le paiement au vendeur. En cas de problème, notre équipe intervient immédiatement.
          </p>
          <p>
            Ce processus simple et sécurisé fait de Natural Hair Market la solution de référence pour tout <strong>achat cheveux naturels européens</strong> en France, qu'il s'agisse d'une commande unique ou d'un approvisionnement professionnel régulier.
          </p>

        </section>

        {/* Garanties */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vos garanties acheteur</h2>
          <p className="text-gray-500 text-sm mb-6">Chaque achat est protégé de bout en bout par notre système de confiance.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {GUARANTEES.map((g) => (
              <div key={g.title} className={`border rounded-2xl p-5 ${g.bg}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">{g.icon}</div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">{g.title}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{g.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comment ça marche */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Comment acheter des cheveux naturels en 4 étapes ?</h2>
          <p className="text-gray-500 text-sm mb-6">Du catalogue au colis reçu, voici le parcours complet d'un achat sur Natural Hair Market.</p>
          <div className="space-y-4">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.num} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full ${step.color} flex items-center justify-center font-bold text-white text-base`}>
                    {step.num}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {step.icon}
                    <h3 className="font-semibold text-gray-800">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Profils acheteurs */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pour qui est fait Natural Hair Market ?</h2>
          <p className="text-gray-500 text-sm mb-6">Notre marketplace s'adresse à toutes les personnes souhaitant <strong>acheter des cheveux naturels</strong> de qualité en France et en Europe.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: <Scissors className="w-7 h-7 text-emerald-600" />,
                bg: 'bg-emerald-50 border-emerald-100',
                title: 'Perruquiers & ateliers',
                desc: 'Approvisionnez vos créations avec des cheveux naturels européens vierges. Stocks disponibles en permanence, lots de toutes longueurs.',
              },
              {
                icon: <Users className="w-7 h-7 text-blue-600" />,
                bg: 'bg-blue-50 border-blue-100',
                title: 'Salons & extensions',
                desc: 'Achetez des mèches conformes à vos exigences professionnelles. Traçabilité totale, origine certifiée, livraison sécurisée.',
              },
              {
                icon: <Heart className="w-7 h-7 text-rose-500" />,
                bg: 'bg-rose-50 border-rose-100',
                title: 'Particuliers',
                desc: 'Extensions personnelles de haute qualité, ou cheveux pour perruque médicale. Commandez en toute confiance depuis chez vous.',
              },
            ].map((item) => (
              <div key={item.title} className={`border rounded-2xl p-5 text-center ${item.bg}`}>
                <div className="flex justify-center mb-3">{item.icon}</div>
                <p className="font-bold text-gray-900 mb-2">{item.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Témoignages */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-5">Ils ont acheté sur Natural Hair Market</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                name: 'Marc D.',
                role: 'Perruquier, Paris',
                text: 'La traçabilité est exactement ce que je cherchais. Je connais l\'origine de chaque mèche, la couleur est vraiment naturelle. Mes clientes sont ravies.',
                detail: 'Mèches blondes, 60 cm',
              },
              {
                name: 'Sophie L.',
                role: 'Salon extensions, Lyon',
                text: 'Des cheveux européens de très bonne qualité, conformes aux photos. Livraison rapide avec signature. Je recommande chaudement.',
                detail: 'Lot châtain, 45 cm',
              },
              {
                name: 'Isabelle K.',
                role: 'Particulière, Bordeaux',
                text: 'J\'avais besoin de cheveux pour une perruque médicale. La démarche est simple, rassurante et les cheveux correspondent parfaitement.',
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

        {/* Où on livre */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <h2 className="text-xl font-bold text-gray-900">Disponible partout en France et en Europe</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Nos vendeurs sont principalement basés en <strong>France</strong>, en Belgique, en Suisse et dans d'autres pays européens. La livraison vers tous les pays de l'Union Européenne est disponible. Chaque expédition est effectuée avec signature obligatoire pour garantir la réception et la traçabilité du colis.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            La <strong>cheveux naturels européens vente</strong> en ligne n'a jamais été aussi accessible : créez votre compte, parcourez les annonces disponibles et commandez en quelques clics. Notre support est disponible 7j/7 pour répondre à toutes vos questions avant et après l'achat.
          </p>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Questions fréquentes sur l'achat de cheveux naturels</h2>
          <p className="text-gray-500 text-sm mb-6">Tout ce que vous devez savoir avant votre premier <strong>achat cheveux naturels</strong> sur Natural Hair Market.</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800 text-sm leading-relaxed">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-gray-600 text-sm leading-relaxed bg-emerald-50 border border-emerald-100 rounded-xl p-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-emerald-600 rounded-2xl p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4">
            <Search className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Prêt à acheter des cheveux naturels européens ?</h2>
          <p className="text-emerald-100 mb-6 max-w-md mx-auto leading-relaxed text-sm">
            Des stocks disponibles en permanence, des vendeurs vérifiés, une livraison sécurisée. Rejoignez les acheteurs professionnels et particuliers qui font confiance à Natural Hair Market.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onGoToMarketplace}
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-semibold px-7 py-3 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm text-sm"
            >
              <Search className="w-4 h-4" />
              Voir les annonces disponibles
            </button>
            <button
              onClick={onSignUp}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"
            >
              <ArrowRight className="w-4 h-4" />
              Créer mon compte gratuitement
            </button>
          </div>
          <p className="text-emerald-200 text-xs mt-4">
            Achat cheveux naturels sécurisé · Traçabilité garantie · Livraison avec signature
          </p>
        </section>

      </div>
    </div>
  );
}
