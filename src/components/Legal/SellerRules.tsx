import { useState } from 'react';
import { UserCheck, CheckCircle, XCircle, AlertTriangle, Shield, Package, Clock, CreditCard, Scale, FileText, Ban, DollarSign, Mail, Phone, ChevronDown, ChevronUp, Star, Ruler, Palette, Layers, Camera } from 'lucide-react';

const faqs = [
  {
    q: 'Est-ce que les vendeurs fixent eux-mêmes leur prix ?',
    a: 'Oui, entièrement. Sur NaturalHairMarket, le vendeur est libre de fixer le prix qu\'il souhaite directement dans son annonce. La plateforme ne propose pas de grille tarifaire : c\'est le vendeur qui évalue la valeur de ses cheveux selon leur qualité, leur longueur, leur texture et leur état. L\'acheteur consulte l\'annonce et décide d\'acheter ou non au prix affiché.',
  },
  {
    q: 'Quels types de cheveux sont acceptés ?',
    a: 'NaturalHairMarket accepte les cheveux humains naturels ainsi que les cheveux colorés ou traités (décoloration, coloration, kératine, lissage, etc.) à condition que ces traitements soient clairement mentionnés dans l\'annonce. Toutes les textures sont les bienvenues : raides, ondulées, bouclées, crépues. Les cheveux synthétiques ou mélangés sont strictement interdits.',
  },
  {
    q: 'Que faut-il mettre dans l\'annonce ?',
    a: 'Pour qu\'une annonce soit complète et crédible, le vendeur doit renseigner : la longueur exacte, la texture, la couleur réelle, les traitements éventuels, l\'état général (sécheresse, fourches, cassures), le poids si mesuré, et la période de coupe. Les photos doivent être authentiques, prises par le vendeur, et représentatives du produit réel. Les photos volées ou retouchées sont interdites.',
  },
  {
    q: 'Comment la qualité est-elle prise en compte ? Le prix peut-il évoluer si l\'état réel diffère des photos ?',
    a: 'L\'acheteur se base sur les informations et les photos fournies dans l\'annonce pour prendre sa décision. Si le produit reçu ne correspond pas fidèlement à la description (état, qualité, traitements), l\'acheteur peut ouvrir un litige via la plateforme. NaturalHairMarket analysera les preuves et pourra décider d\'un remboursement partiel ou total. Le vendeur est donc fortement encouragé à décrire son produit avec la plus grande honnêteté, notamment concernant l\'état réel des cheveux.',
  },
  {
    q: 'Comment se passe l\'envoi après la commande ?',
    a: 'Une fois la commande validée, le vendeur s\'engage à expédier les cheveux dans les 3 jours ouvrables. Il doit bien emballer le colis, utiliser un mode d\'envoi adapté et fournir un numéro de suivi valide. La plateforme génère une étiquette d\'expédition. En cas de non-expédition, la commande est annulée et l\'acheteur est intégralement remboursé.',
  },
  {
    q: 'Comment fonctionne le paiement et la sécurité de la transaction ?',
    a: 'Toutes les transactions sont traitées via la plateforme NaturalHairMarket. Les fonds sont sécurisés et ne sont libérés au vendeur qu\'une fois la réception confirmée par l\'acheteur, ou à l\'expiration d\'un délai automatique après livraison. En cas de litige, les fonds restent bloqués jusqu\'à la décision de NaturalHairMarket. Aucune transaction en dehors de la plateforme n\'est autorisée.',
  },
  {
    q: 'Faut-il déclarer ses ventes aux impôts ?',
    a: 'Oui. Chaque vendeur est responsable de déclarer ses ventes et de respecter ses obligations fiscales selon son statut (particulier occasionnel, auto-entrepreneur, salon professionnel). NaturalHairMarket ne fournit pas de conseil fiscal, mais rappelle que la loi s\'applique à toutes les ventes réalisées sur la plateforme.',
  },
  {
    q: 'Que se passe-t-il si mon annonce ou mon compte est suspendu ?',
    a: 'NaturalHairMarket peut suspendre ou supprimer un compte en cas de fraude, de vente de cheveux synthétiques, de fausse description, de photos volées, de non-expédition répétée ou de non-coopération lors d\'un litige. La décision peut être définitive et sans préavis. En cas de question, vous pouvez contacter le support à naturalhairmarket@gmail.com.',
  },
];

export function SellerRules() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* SEO meta simulation via page title structure */}
      <div className="max-w-4xl mx-auto">

        {/* H1 unique */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl shadow-lg mb-4">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            Vendre mes cheveux naturels ou colorés&nbsp;: prix libre &amp; critères d'évaluation
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Sur NaturalHairMarket, vous fixez votre prix librement. Voici tout ce que vous devez savoir pour créer une annonce claire, attractive et conforme.
          </p>
        </div>

        <div className="space-y-8">

          {/* Comment ça marche */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-emerald-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5" />
                Comment ça marche ?
              </h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3 text-emerald-700 font-bold text-lg">1</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Créer son annonce</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Le vendeur remplit son annonce avec les informations détaillées sur ses cheveux, fixe son prix librement et ajoute des photos authentiques.
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center text-emerald-400">
                  <div className="w-8 h-0.5 bg-emerald-200 flex-1"></div>
                  <div className="w-3 h-3 border-t-2 border-r-2 border-emerald-400 rotate-45 -ml-1.5"></div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3 text-emerald-700 font-bold text-lg">2</div>
                  <h3 className="font-semibold text-gray-800 mb-2">L'acheteur consulte</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    L'acheteur parcourt les annonces, compare les critères (longueur, texture, couleur, état) et choisit selon ses besoins et le prix proposé.
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center text-emerald-400">
                  <div className="w-8 h-0.5 bg-emerald-200 flex-1"></div>
                  <div className="w-3 h-3 border-t-2 border-r-2 border-emerald-400 rotate-45 -ml-1.5"></div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3 text-emerald-700 font-bold text-lg">3</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Commande &amp; envoi</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    La transaction est finalisée via la plateforme de façon sécurisée. Le vendeur expédie les cheveux dans les 3 jours ouvrables avec suivi.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Prix : comment ça se passe */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-teal-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Prix : comment ça se passe ?
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">Le vendeur fixe son prix librement</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Il n'existe pas de grille tarifaire imposée sur NaturalHairMarket. Chaque vendeur est libre de définir le prix de son annonce en fonction de la valeur qu'il estime juste pour ses cheveux.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">Le prix peut varier selon les caractéristiques réelles</p>
                  <p className="text-gray-600 text-sm mt-1">
                    La valeur perçue d'un lot de cheveux dépend de plusieurs facteurs : longueur, densité, texture, couleur (naturelle, décolorée ou colorée), et état général. Un vendeur avec des cheveux longs, épais et non traités pourra généralement proposer un prix plus élevé qu'un lot court ou abîmé.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">Honnêteté obligatoire</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Si l'état réel des cheveux ne correspond pas à la description de l'annonce, l'acheteur peut ouvrir un litige. NaturalHairMarket peut décider d'un remboursement partiel ou total. Une description précise protège à la fois le vendeur et l'acheteur.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quels types de cheveux */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-emerald-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Quels types de cheveux sont acceptés ?
              </h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Acceptés
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />Cheveux humains 100 % naturels</li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />Cheveux colorés (avec mention obligatoire)</li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />Cheveux décolorés (avec mention obligatoire)</li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />Cheveux traités : lissage, kératine, henné (avec mention)</li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />Toutes textures : raides, ondulés, bouclés, crépus</li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />Cheveux propres, secs et bien attachés</li>
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Refusés
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />Cheveux synthétiques</li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />Mélange synthétique + humain</li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />Cheveux sales, humides ou moisis</li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />Cheveux traités sans le mentionner</li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />Cheveux obtenus sans consentement</li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />Annonces fictives ou mensongères</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Critères qui influencent l'évaluation */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-800 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Star className="w-5 h-5" />
                Critères qui influencent l'évaluation
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-5 text-sm">
                Ces critères sont les principaux éléments sur lesquels les acheteurs se basent pour évaluer la valeur d'un lot de cheveux. Plus ils sont renseignés précisément, plus votre annonce sera crédible.
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <Ruler className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Longueur</p>
                    <p className="text-gray-500 text-xs mt-1">Exprimée en centimètres. Plus les cheveux sont longs, plus leur valeur est généralement élevée.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <Layers className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Densité</p>
                    <p className="text-gray-500 text-xs mt-1">Un lot épais et dense a plus de valeur. Le poids (en grammes) est un indicateur utile.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16c0 2.21 3.134 4 7 4s7-1.79 7-4M7 16V8m0 8c0-2.21 3.134-4 7-4s7 1.79 7 4M7 8c0-2.21 3.134-4 7-4s7 1.79 7 4m0 0v8" /></svg>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Texture</p>
                    <p className="text-gray-500 text-xs mt-1">Raides, ondulés, bouclés ou crépus. Précisez la texture naturelle, avant tout traitement.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <Palette className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Couleur</p>
                    <p className="text-gray-500 text-xs mt-1">Naturelle, décolorée ou colorée. Indiquez si la couleur est naturelle ou obtenue par traitement chimique.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">État général</p>
                    <p className="text-gray-500 text-xs mt-1">Sécheresse, fourches, cassures, brillance. Soyez honnête sur l'état réel pour éviter tout litige.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <Camera className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Qualité des photos</p>
                    <p className="text-gray-500 text-xs mt-1">Des photos nettes, en bonne lumière, prises par le vendeur rassurent l'acheteur et valorisent l'annonce.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Règlement vendeur condensé */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-slate-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Règles essentielles du vendeur
              </h2>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Conditions</h3>
                {[
                  'Avoir au moins 18 ans',
                  'Être propriétaire légitime des cheveux',
                  'Fournir des informations exactes et à jour',
                  'Accepter les CGU et CGV de la plateforme',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Obligations</h3>
                {[
                  'Expédier sous 3 jours ouvrables',
                  'Fournir un numéro de suivi valide',
                  'Certifier l\'authenticité des cheveux',
                  'Mentionner tout traitement chimique effectué',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-emerald-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Questions fréquentes
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-6 py-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-800 text-sm leading-relaxed">{faq.q}</span>
                    {openFaq === i
                      ? <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    }
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5">
                      <p className="text-gray-600 text-sm leading-relaxed bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-600" />
                Besoin d'aide ?
              </h2>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-4">
              <a
                href="mailto:naturalhairmarket@gmail.com"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-emerald-700 font-semibold text-sm">naturalhairmarket@gmail.com</p>
                </div>
              </a>
              <a
                href="tel:0972216948"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Téléphone</p>
                  <p className="text-emerald-700 font-semibold text-sm">09 72 21 69 48</p>
                </div>
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
