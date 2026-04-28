/**
 * Title SEO : Vendre mes cheveux - Prix, criteres & comment ca marche
 * Meta description : Vendez vos cheveux naturels ou colores sur NaturalHairMarket.
 * Prix libre, criteres clairs, transaction securisee. Decouvrez comment ca se passe.
 *
 * Mots-cles cibles : vendre ses cheveux, vendre mes cheveux, prix cheveux,
 * comment vendre ses cheveux, vendre cheveux naturels, vendre cheveux colores
 */

import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Camera,
  Ruler,
  Layers,
  Palette,
  AlertTriangle,
  Package,
  DollarSign,
  Shield,
  ArrowRight,
  User,
  Scissors,
} from 'lucide-react';

interface SellMyHairProps {
  onStartSelling?: () => void;
}

const faqs: { q: string; a: string }[] = [
  {
    q: "Qui peut vendre ses cheveux sur NaturalHairMarket ?",
    a: "Toute personne majeure (18 ans et plus) proprietaire de ses cheveux peut vendre sur la plateforme. Les particuliers comme les professionnels (salons) sont les bienvenus.",
  },
  {
    q: "Quels types de cheveux sont acceptes ?",
    a: "Les cheveux humains naturels, colores, decolo res ou traites (lissage, keratine, henne, etc.) sont acceptes, a condition que l'etat et les traitements soient clairement mentionnes dans l'annonce. Toutes les textures sont acceptees : raides, ondules, boucles, crepus.",
  },
  {
    q: "Les cheveux decolores ou colores sont-ils acceptes ?",
    a: "Oui. Les cheveux decolores et colores sont acceptes sur NaturalHairMarket. Il est obligatoire de le preciser dans l'annonce afin que l'acheteur puisse evaluer la qualite en connaissance de cause.",
  },
  {
    q: "Est-ce que les cheveux tresses sont acceptes ?",
    a: "Les cheveux doivent etre detresses, propres et attaches en queue ou en tresse simple avant la mise en vente. Des cheveux encore en extension ou tresses avec des ajouts synthetiques ne sont pas acceptes.",
  },
  {
    q: "Comment envoyer mes photos ?",
    a: "Lors de la creation de votre annonce sur la plateforme, vous pouvez telecharger vos photos directement. Privilegiez un fond clair, une bonne lumiere naturelle, et prenez au moins une photo de pres et une de loin pour montrer la longueur reelle.",
  },
  {
    q: "Combien de temps pour qu'une annonce soit en ligne ?",
    a: "Une fois votre annonce complete soumise sur la plateforme, elle est publiee rapidement selon les delais de moderation en vigueur. NaturalHairMarket se reserve le droit de valider ou refuser toute annonce non conforme.",
  },
  {
    q: "Est-ce que le prix peut changer apres inspection ?",
    a: "Dans le cadre d'une marketplace, c'est le vendeur qui fixe son prix librement. Cependant, si un acheteur recoit un lot dont l'etat ne correspond pas a la description, il peut ouvrir un litige via la plateforme. Il est donc important d'evaluer honnetement ses cheveux des la creation de l'annonce.",
  },
  {
    q: "Paiement : quand et comment ?",
    a: "Le paiement est effectue via la plateforme NaturalHairMarket de facon securisee. Les fonds sont liberes au vendeur apres confirmation de reception par l'acheteur ou a l'expiration du delai de protection automatique. Le paiement hors plateforme est strictement interdit.",
  },
  {
    q: "Que se passe-t-il si mes cheveux ne sont pas acceptes ?",
    a: "Si votre annonce ne respecte pas les regles de la plateforme (cheveux synthetiques, description inexacte, photos volees...), elle sera refusee ou supprimee. Vous recevrez une notification et pourrez corriger votre annonce si le motif le permet.",
  },
  {
    q: "Comment je contacte NaturalHairMarket ?",
    a: "Vous pouvez contacter l'equipe par email a naturalhairmarket@gmail.com ou par telephone au 09 72 21 69 48 pour toute question relative a votre annonce ou a une transaction.",
  },
  {
    q: "Les donnees personnelles sont-elles protegees ?",
    a: "Oui. NaturalHairMarket traite vos donnees personnelles conformement au RGPD. Vos informations ne sont jamais revendues a des tiers. Consultez notre Politique de confidentialite pour en savoir plus.",
  },
  {
    q: "Puis-je vendre des cheveux courts ?",
    a: "La longueur minimale acceptee est a confirmer avec l'equipe NaturalHairMarket. En regle generale, plus les cheveux sont longs, plus leur valeur est elevee sur le marche. Des cheveux tres courts peuvent etre moins demandes.",
  },
  {
    q: `Comment je sais si mes cheveux sont "en bon etat" ?`,
    a: "Des cheveux en bon etat sont propres, sans odeur, sans parasites, non cassants, sans fourches excessives et conserves correctement. Un cheveu sec, abime ou tres poreux (suite a decolorations repetees) doit etre signale dans l'annonce.",
  },
  {
    q: `Les cheveux doivent-ils etre "sans noeuds" ?`,
    a: "Idealement, les cheveux doivent etre demeles, attaches en queue ou en tresse simple, et propres. Des noeuds importants ou des enchevelements peuvent reduire leur valeur percue et doivent etre mentionnes.",
  },
  {
    q: "Puis-je vendre plusieurs fois sur la plateforme ?",
    a: "Oui, vous pouvez creer plusieurs annonces et vendre autant de fois que vous le souhaitez, dans la limite des regles de la plateforme. Chaque lot de cheveux doit faire l'objet d'une annonce distincte avec ses propres photos et description.",
  },
];

export function SellMyHair({ onStartSelling }: SellMyHairProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 text-emerald-700 text-sm font-medium mb-5">
            <Scissors className="w-4 h-4" />
            Marketplace de cheveux humains
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Vendre mes cheveux naturels ou&nbsp;colores&nbsp;:
            <br className="hidden md:block" />
            <span className="text-emerald-600"> prix, criteres et comment ca se passe</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            NaturalHairMarket est une marketplace ou vous fixez votre prix librement. Publiez votre annonce, decrivez vos cheveux honnetement, et attendez qu&apos;un acheteur vous contacte — le tout de facon securisee.
          </p>
          <button
            onClick={onStartSelling}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-sm text-base"
          >
            Commencer a vendre
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

        {/* Comment ca se passe */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Comment ca se passe ?</h2>
          <p className="text-gray-500 mb-6 text-sm">De la creation de votre annonce au paiement, voici les etapes.</p>
          <div className="space-y-4">
            {[
              {
                num: 1,
                title: "Je cree mon annonce et j'envoie mes photos",
                body: "Creez votre compte sur NaturalHairMarket, puis remplissez votre annonce : longueur, texture, couleur, etat, traitements eventuels. Ajoutez des photos authentiques et definissez librement votre prix.",
                icon: <Camera className="w-5 h-5 text-emerald-600" />,
              },
              {
                num: 2,
                title: "Evaluation des criteres par les acheteurs",
                body: "Les acheteurs consultent vos annonces et evaluent la qualite selon les criteres renseignes : longueur, densite, etat, type (naturels, decolores, colores). Plus votre description est precise, plus votre annonce est credible.",
                icon: <Ruler className="w-5 h-5 text-emerald-600" />,
              },
              {
                num: 3,
                title: "Proposition de prix et conditions",
                body: "Sur NaturalHairMarket, vous fixez votre prix directement. Les acheteurs peuvent vous faire une offre differente via le systeme d'offres de la plateforme. Vous etes libre d'accepter ou de refuser.",
                icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
              },
              {
                num: 4,
                title: "Validation et envoi",
                body: "Une fois la commande confirmee, vous recevez une notification pour proceder a l'expedition. Vous disposez de 3 jours ouvrables pour envoyer le colis avec un numero de suivi valide.",
                icon: <Package className="w-5 h-5 text-emerald-600" />,
              },
              {
                num: 5,
                title: "Paiement (selon validation de la reception)",
                body: "Les fonds sont securises sur la plateforme jusqu'a confirmation de reception par l'acheteur ou expiration du delai de protection automatique. Le versement est ensuite effectue selon les conditions en vigueur.",
                icon: <Shield className="w-5 h-5 text-emerald-600" />,
              },
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-base">
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

        {/* Criteres pour vendre */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Criteres pour vendre ses cheveux</h2>
          <p className="text-gray-500 mb-6 text-sm">Ces elements influencent directement la valeur percue de votre lot et la confiance des acheteurs.</p>
          <div className="grid md:grid-cols-2 gap-4">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Ruler className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-gray-800">Longueur</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Mesuree en centimetres du cuir chevelu jusqu&apos;aux pointes. Longueur minimale acceptee&nbsp;: <span className="font-medium text-gray-700 italic">a confirmer</span>. Plus les cheveux sont longs, plus leur valeur est generalement elevee sur la plateforme.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-gray-800">Densite</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Evaluez la densite de votre chevelure : <strong>faible</strong> (queue fine), <strong>moyenne</strong> (queue normale) ou <strong>forte</strong> (queue tres epaisse). Le poids en grammes, si vous pouvez le mesurer, est un indicateur objectif tres apprecie.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-gray-800">Etat</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Soyez honnete sur l&apos;etat reel : secheresse, fourches, cassures, porosite (surtout apres decoloration), odeur. Des cheveux en bon etat, propres et sans fourches excessives auront une valeur percue plus elevee.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-gray-800">Type de cheveux</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Precisez si vos cheveux sont <strong>naturels</strong> (jamais traites), <strong>decolores</strong>, <strong>colores</strong>, lisses, ou traites (keratine, defrisage, henne...). Chaque traitement doit etre mentionne clairement dans l&apos;annonce.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-gray-800">Qualite des photos</h3>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">Fond</p>
                  <p className="text-gray-600 text-xs">Fond clair (mur blanc, drap blanc) pour faire ressortir la couleur reelle.</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">Lumiere</p>
                  <p className="text-gray-600 text-xs">Lumiere naturelle de preference. Evitez les flash qui blanchissent et masquent la texture.</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">Angles</p>
                  <p className="text-gray-600 text-xs">Au moins une photo de loin (longueur visible) et une de pres (texture, etat des pointes).</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Prix & marketplace */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Prix &amp; marketplace : comment ca fonctionne</h2>
          <p className="text-gray-500 mb-6 text-sm">NaturalHairMarket est une place de marche entre particuliers et professionnels.</p>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
              <DollarSign className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Le vendeur fixe son prix librement</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Il n&apos;existe pas de grille tarifaire imposee sur NaturalHairMarket. Vous etes libre de proposer le prix que vous estimez juste. Le prix affiche dans votre annonce est celui que l&apos;acheteur voit et accepte (ou negocie via une offre).
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Le prix final depend de la qualite reelle</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Les acheteurs se basent sur les criteres renseignes (longueur, densite, etat, type) pour evaluer si votre prix est coherent. Une description fidele et des photos de qualite augmentent vos chances de vendre rapidement au prix souhaite.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
              <Shield className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Transaction 100% securisee via la plateforme</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Toutes les transactions passent par NaturalHairMarket. Les paiements hors plateforme sont interdits. Les fonds sont proteges jusqu&apos;a confirmation de reception. En cas de litige, la plateforme intervient comme mediateur.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Que faire avant l'envoi */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Que faire avant l&apos;envoi ?</h2>
          <p className="text-gray-500 mb-6 text-sm">Quelques precautions pour que votre colis arrive en parfait etat.</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { ok: true, text: "Attacher les cheveux en queue ou en tresse simple avant de les couper ou de les emballer" },
                { ok: true, text: "Envelopper dans du papier de soie ou une pochette plastique pour eviter l'humidite" },
                { ok: true, text: "Placer dans une enveloppe rigide ou une petite boite pour eviter l'ecrasement" },
                { ok: true, text: "Utiliser un mode d'envoi avec suivi et numero de tracking valide" },
                { ok: false, text: "Ne pas envoyer des cheveux humides ou mouilles (risque de moisissure)" },
                { ok: false, text: "Ne pas plier la queue de cheval en deux si les cheveux sont longs" },
                { ok: false, text: "Ne pas melanger plusieurs lots dans le meme emballage sans le preciser" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  {item.ok
                    ? <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  }
                  {item.text}
                </div>
              ))}
            </div>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-800 text-sm">
                <strong>Bon a savoir :</strong> Les cheveux envoyes doivent correspondre fidelement aux photos et a la description de l&apos;annonce. Tout ecart constate par l&apos;acheteur peut donner lieu a un litige.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Questions frequentes sur la vente de cheveux</h2>
          <p className="text-gray-500 mb-6 text-sm">Tout ce que vous devez savoir avant de vendre vos cheveux.</p>
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
                    <p className="text-gray-600 text-sm leading-relaxed bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-600 rounded-2xl p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4">
            <Scissors className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Pret(e) a vendre vos cheveux ?</h2>
          <p className="text-emerald-100 mb-6 max-w-md mx-auto leading-relaxed text-sm">
            Creez votre annonce en quelques minutes. Criteres clairs, prix libre, transaction securisee. NaturalHairMarket vous accompagne a chaque etape.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onStartSelling}
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-semibold px-7 py-3 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm text-sm"
            >
              <User className="w-4 h-4" />
              Creer mon compte et vendre
            </button>
            <button
              onClick={onStartSelling}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"
            >
              Deposer une annonce
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-emerald-200 text-xs mt-4">
            Evaluation rapide · Criteres transparents · Paiement securise
          </p>
        </section>

      </div>
    </div>
  );
}
