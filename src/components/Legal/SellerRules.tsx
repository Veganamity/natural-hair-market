import { useState, useEffect } from 'react';
import { UserCheck, CheckCircle, XCircle, AlertTriangle, Shield, Package, Scale, FileText, DollarSign, Mail, Phone, ChevronDown, ChevronUp, Star, Ruler, Palette, Layers, Camera } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function SellerRules() {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: language === 'fr' ? 'Est-ce que les vendeurs fixent eux-mêmes leur prix ?' : 'Do sellers set their own prices?',
      a: language === 'fr'
        ? "Oui, entièrement. Sur NaturalHairMarket, le vendeur est libre de fixer le prix qu'il souhaite directement dans son annonce. La plateforme ne propose pas de grille tarifaire : c'est le vendeur qui évalue la valeur de ses cheveux selon leur qualité, leur longueur, leur texture et leur état. L'acheteur consulte l'annonce et décide d'acheter ou non au prix affiché."
        : "Yes, entirely. On NaturalHairMarket, the seller is free to set whatever price they want directly in their listing. The platform does not offer a pricing grid: it is the seller who evaluates the value of their hair based on its quality, length, texture and condition. The buyer browses the listing and decides whether or not to buy at the displayed price.",
    },
    {
      q: language === 'fr' ? 'Quels types de cheveux sont acceptés ?' : 'What types of hair are accepted?',
      a: language === 'fr'
        ? "NaturalHairMarket accepte les cheveux humains naturels ainsi que les cheveux colorés ou traités (décoloration, coloration, kératine, lissage, etc.) à condition que ces traitements soient clairement mentionnés dans l'annonce. Toutes les textures sont les bienvenues : raides, ondulées, bouclées, crépues. Les cheveux synthétiques ou mélangés sont strictement interdits."
        : "NaturalHairMarket accepts natural human hair as well as colored or treated hair (bleaching, coloring, keratin, straightening, etc.) provided that these treatments are clearly mentioned in the listing. All textures are welcome: straight, wavy, curly, coily. Synthetic or blended hair is strictly prohibited.",
    },
    {
      q: language === 'fr' ? "Que faut-il mettre dans l'annonce ?" : 'What should be included in the listing?',
      a: language === 'fr'
        ? "Pour qu'une annonce soit complète et crédible, le vendeur doit renseigner : la longueur exacte, la texture, la couleur réelle, les traitements éventuels, l'état général (sécheresse, fourches, cassures), le poids si mesuré, et la période de coupe. Les photos doivent être authentiques, prises par le vendeur, et représentatives du produit réel. Les photos volées ou retouchées sont interdites."
        : "For a listing to be complete and credible, the seller must provide: the exact length, texture, actual color, any treatments, overall condition (dryness, split ends, breakage), weight if measured, and the cutting period. Photos must be authentic, taken by the seller, and representative of the actual product. Stolen or retouched photos are prohibited.",
    },
    {
      q: language === 'fr' ? "Comment la qualité est-elle prise en compte ? Le prix peut-il évoluer si l'état réel diffère des photos ?" : 'How is quality taken into account? Can the price change if the actual condition differs from the photos?',
      a: language === 'fr'
        ? "L'acheteur se base sur les informations et les photos fournies dans l'annonce pour prendre sa décision. Si le produit reçu ne correspond pas fidèlement à la description (état, qualité, traitements), l'acheteur peut ouvrir un litige via la plateforme. NaturalHairMarket analysera les preuves et pourra décider d'un remboursement partiel ou total. Le vendeur est donc fortement encouragé à décrire son produit avec la plus grande honnêteté, notamment concernant l'état réel des cheveux."
        : "The buyer relies on the information and photos provided in the listing to make their decision. If the received product does not faithfully match the description (condition, quality, treatments), the buyer can open a dispute via the platform. NaturalHairMarket will analyze the evidence and may decide on a partial or full refund. The seller is therefore strongly encouraged to describe their product with the utmost honesty, particularly regarding the actual condition of the hair.",
    },
    {
      q: language === 'fr' ? 'Comment se passe l\'envoi après la commande ?' : 'How does shipping work after an order?',
      a: language === 'fr'
        ? "Une fois la commande validée, le vendeur s'engage à expédier les cheveux dans les 3 jours ouvrables. Il doit bien emballer le colis, utiliser un mode d'envoi adapté et fournir un numéro de suivi valide. La plateforme génère une étiquette d'expédition. En cas de non-expédition, la commande est annulée et l'acheteur est intégralement remboursé."
        : "Once the order is confirmed, the seller commits to shipping the hair within 3 business days. They must properly package the parcel, use an appropriate shipping method and provide a valid tracking number. The platform generates a shipping label. In case of non-shipment, the order is cancelled and the buyer is fully refunded.",
    },
    {
      q: language === 'fr' ? 'Comment fonctionne le paiement et la sécurité de la transaction ?' : 'How does payment and transaction security work?',
      a: language === 'fr'
        ? "Toutes les transactions sont traitées via la plateforme NaturalHairMarket. Les fonds sont sécurisés et ne sont libérés au vendeur qu'une fois la réception confirmée par l'acheteur, ou à l'expiration d'un délai automatique après livraison. En cas de litige, les fonds restent bloqués jusqu'à la décision de NaturalHairMarket. Aucune transaction en dehors de la plateforme n'est autorisée."
        : "All transactions are processed through the NaturalHairMarket platform. Funds are secured and only released to the seller once receipt is confirmed by the buyer, or upon expiration of an automatic period after delivery. In case of a dispute, funds remain held until NaturalHairMarket's decision. No transactions outside the platform are allowed.",
    },
    {
      q: language === 'fr' ? 'Faut-il déclarer ses ventes aux impôts ?' : 'Do sales need to be declared for taxes?',
      a: language === 'fr'
        ? "Oui. Chaque vendeur est responsable de déclarer ses ventes et de respecter ses obligations fiscales selon son statut (particulier occasionnel, auto-entrepreneur, salon professionnel). NaturalHairMarket ne fournit pas de conseil fiscal, mais rappelle que la loi s'applique à toutes les ventes réalisées sur la plateforme."
        : "Yes. Each seller is responsible for declaring their sales and meeting their tax obligations according to their status (occasional individual, auto-entrepreneur, professional salon). NaturalHairMarket does not provide tax advice, but reminds that the law applies to all sales made on the platform.",
    },
    {
      q: language === 'fr' ? 'Que se passe-t-il si mon annonce ou mon compte est suspendu ?' : 'What happens if my listing or account is suspended?',
      a: language === 'fr'
        ? "NaturalHairMarket peut suspendre ou supprimer un compte en cas de fraude, de vente de cheveux synthétiques, de fausse description, de photos volées, de non-expédition répétée ou de non-coopération lors d'un litige. La décision peut être définitive et sans préavis. En cas de question, vous pouvez contacter le support à naturalhairmarket@gmail.com."
        : "NaturalHairMarket may suspend or delete an account in case of fraud, selling synthetic hair, false description, stolen photos, repeated non-shipment or non-cooperation during a dispute. The decision may be final and without notice. If you have questions, you can contact support at naturalhairmarket@gmail.com.",
    },
  ];

  useEffect(() => {
    const prevTitle = document.title;
    const m = document.getElementById('meta-description') as HTMLMetaElement | null;
    const prevDesc = m?.content ?? '';
    document.title = language === 'fr'
      ? 'Règlement vendeur - Vendre ses cheveux | Natural Hair Market'
      : 'Seller Rules - Sell Your Hair | Natural Hair Market';
    if (m) m.content = language === 'fr'
      ? "Règlement vendeur de Natural Hair Market : critères d'acceptation, prix libre, obligations d'expédition et conditions pour vendre ses cheveux naturels."
      : "Natural Hair Market seller rules: acceptance criteria, free pricing, shipping obligations and conditions for selling your natural hair.";
    return () => { document.title = prevTitle; if (m) m.content = prevDesc; };
  }, [language]);

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
            {language === 'fr'
              ? 'Vendre mes cheveux naturels ou colorés : prix libre & critères d\'évaluation'
              : 'Selling my natural or colored hair: free pricing & evaluation criteria'}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            {language === 'fr'
              ? "Sur NaturalHairMarket, vous fixez votre prix librement. Voici tout ce que vous devez savoir pour créer une annonce claire, attractive et conforme."
              : "On NaturalHairMarket, you set your price freely. Here is everything you need to know to create a clear, attractive and compliant listing."}
          </p>
        </div>

        <div className="space-y-8">

          {/* Comment ça marche */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-emerald-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5" />
                {language === 'fr' ? 'Comment ça marche ?' : 'How does it work?'}
              </h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3 text-emerald-700 font-bold text-lg">1</div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {language === 'fr' ? 'Créer son annonce' : 'Create your listing'}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {language === 'fr'
                      ? "Le vendeur remplit son annonce avec les informations détaillées sur ses cheveux, fixe son prix librement et ajoute des photos authentiques."
                      : "The seller fills out their listing with detailed information about their hair, sets their price freely and adds authentic photos."}
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center text-emerald-400">
                  <div className="w-8 h-0.5 bg-emerald-200 flex-1"></div>
                  <div className="w-3 h-3 border-t-2 border-r-2 border-emerald-400 rotate-45 -ml-1.5"></div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3 text-emerald-700 font-bold text-lg">2</div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {language === "fr" ? "L'acheteur consulte" : 'The buyer browses'}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {language === 'fr'
                      ? "L'acheteur parcourt les annonces, compare les critères (longueur, texture, couleur, état) et choisit selon ses besoins et le prix proposé."
                      : "The buyer browses listings, compares criteria (length, texture, color, condition) and chooses according to their needs and the offered price."}
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center text-emerald-400">
                  <div className="w-8 h-0.5 bg-emerald-200 flex-1"></div>
                  <div className="w-3 h-3 border-t-2 border-r-2 border-emerald-400 rotate-45 -ml-1.5"></div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3 text-emerald-700 font-bold text-lg">3</div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {language === 'fr' ? 'Commande & envoi' : 'Order & shipping'}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {language === 'fr'
                      ? "La transaction est finalisée via la plateforme de façon sécurisée. Le vendeur expédie les cheveux dans les 3 jours ouvrables avec suivi."
                      : "The transaction is finalized securely through the platform. The seller ships the hair within 3 business days with tracking."}
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
                {language === 'fr' ? 'Prix : comment ça se passe ?' : 'Pricing: how does it work?'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">
                    {language === 'fr' ? 'Le vendeur fixe son prix librement' : 'The seller sets their price freely'}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {language === 'fr'
                      ? "Il n'existe pas de grille tarifaire imposée sur NaturalHairMarket. Chaque vendeur est libre de définir le prix de son annonce en fonction de la valeur qu'il estime juste pour ses cheveux."
                      : "There is no imposed pricing grid on NaturalHairMarket. Each seller is free to set the price of their listing based on the value they consider fair for their hair."}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">
                    {language === 'fr' ? 'Le prix peut varier selon les caractéristiques réelles' : 'The price may vary based on actual characteristics'}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {language === 'fr'
                      ? "La valeur perçue d'un lot de cheveux dépend de plusieurs facteurs : longueur, densité, texture, couleur (naturelle, décolorée ou colorée), et état général. Un vendeur avec des cheveux longs, épais et non traités pourra généralement proposer un prix plus élevé qu'un lot court ou abîmé."
                      : "The perceived value of a batch of hair depends on several factors: length, density, texture, color (natural, bleached or colored), and overall condition. A seller with long, thick and untreated hair can generally command a higher price than a short or damaged batch."}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">
                    {language === 'fr' ? 'Honnêteté obligatoire' : 'Honesty is mandatory'}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {language === 'fr'
                      ? "Si l'état réel des cheveux ne correspond pas à la description de l'annonce, l'acheteur peut ouvrir un litige. NaturalHairMarket peut décider d'un remboursement partiel ou total. Une description précise protège à la fois le vendeur et l'acheteur."
                      : "If the actual condition of the hair does not match the listing description, the buyer can open a dispute. NaturalHairMarket may decide on a partial or full refund. An accurate description protects both the seller and the buyer."}
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
                {language === 'fr' ? 'Quels types de cheveux sont acceptés ?' : 'What types of hair are accepted?'}
              </h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {language === 'fr' ? 'Acceptés' : 'Accepted'}
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />{language === 'fr' ? 'Cheveux humains 100 % naturels' : '100% natural human hair'}</li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />{language === 'fr' ? 'Cheveux colorés (avec mention obligatoire)' : 'Colored hair (with mandatory disclosure)'}</li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />{language === 'fr' ? 'Cheveux décolorés (avec mention obligatoire)' : 'Bleached hair (with mandatory disclosure)'}</li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />{language === 'fr' ? 'Cheveux traités : lissage, kératine, henné (avec mention)' : 'Treated hair: straightening, keratin, henna (with disclosure)'}</li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />{language === 'fr' ? 'Toutes textures : raides, ondulés, bouclés, crépus' : 'All textures: straight, wavy, curly, coily'}</li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />{language === 'fr' ? 'Cheveux propres, secs et bien attachés' : 'Clean, dry and properly tied hair'}</li>
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    {language === 'fr' ? 'Refusés' : 'Rejected'}
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />{language === 'fr' ? 'Cheveux synthétiques' : 'Synthetic hair'}</li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />{language === 'fr' ? 'Mélange synthétique + humain' : 'Synthetic + human blend'}</li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />{language === 'fr' ? 'Cheveux sales, humides ou moisis' : 'Dirty, damp or moldy hair'}</li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />{language === 'fr' ? 'Cheveux traités sans le mentionner' : 'Treated hair without disclosure'}</li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />{language === 'fr' ? 'Cheveux obtenus sans consentement' : 'Hair obtained without consent'}</li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />{language === 'fr' ? 'Annonces fictives ou mensongères' : 'Fake or misleading listings'}</li>
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
                {language === "fr" ? "Critères qui influencent l'évaluation" : 'Criteria that influence evaluation'}
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-5 text-sm">
                {language === 'fr'
                  ? "Ces critères sont les principaux éléments sur lesquels les acheteurs se basent pour évaluer la valeur d'un lot de cheveux. Plus ils sont renseignés précisément, plus votre annonce sera crédible."
                  : "These criteria are the main elements buyers rely on to evaluate the value of a batch of hair. The more precisely they are provided, the more credible your listing will be."}
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <Ruler className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{language === 'fr' ? 'Longueur' : 'Length'}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {language === 'fr'
                        ? "Exprimée en centimètres. Plus les cheveux sont longs, plus leur valeur est généralement élevée."
                        : "Expressed in centimeters. The longer the hair, the higher its value generally is."}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <Layers className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{language === 'fr' ? 'Densité' : 'Density'}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {language === 'fr'
                        ? "Un lot épais et dense a plus de valeur. Le poids (en grammes) est un indicateur utile."
                        : "A thick and dense batch has more value. Weight (in grams) is a useful indicator."}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16c0 2.21 3.134 4 7 4s7-1.79 7-4M7 16V8m0 8c0-2.21 3.134-4 7-4s7 1.79 7 4M7 8c0-2.21 3.134-4 7-4s7 1.79 7 4m0 0v8" /></svg>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{language === 'fr' ? 'Texture' : 'Texture'}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {language === 'fr'
                        ? "Raides, ondulés, bouclés ou crépus. Précisez la texture naturelle, avant tout traitement."
                        : "Straight, wavy, curly or coily. Specify the natural texture, before any treatment."}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <Palette className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{language === 'fr' ? 'Couleur' : 'Color'}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {language === 'fr'
                        ? "Naturelle, décolorée ou colorée. Indiquez si la couleur est naturelle ou obtenue par traitement chimique."
                        : "Natural, bleached or colored. Indicate whether the color is natural or achieved through chemical treatment."}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{language === 'fr' ? 'État général' : 'Overall condition'}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {language === 'fr'
                        ? "Sécheresse, fourches, cassures, brillance. Soyez honnête sur l'état réel pour éviter tout litige."
                        : "Dryness, split ends, breakage, shine. Be honest about the actual condition to avoid any dispute."}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <Camera className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{language === 'fr' ? 'Qualité des photos' : 'Photo quality'}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {language === 'fr'
                        ? "Des photos nettes, en bonne lumière, prises par le vendeur rassurent l'acheteur et valorisent l'annonce."
                        : "Clear photos, in good lighting, taken by the seller reassure the buyer and enhance the listing."}
                    </p>
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
                {language === 'fr' ? 'Règles essentielles du vendeur' : 'Essential seller rules'}
              </h2>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                  {language === 'fr' ? 'Conditions' : 'Requirements'}
                </h3>
                {[
                  language === 'fr' ? 'Avoir au moins 18 ans' : 'Be at least 18 years old',
                  language === 'fr' ? 'Être propriétaire légitime des cheveux' : 'Be the legitimate owner of the hair',
                  language === 'fr' ? 'Fournir des informations exactes et à jour' : 'Provide accurate and up-to-date information',
                  language === 'fr' ? 'Accepter les CGU et CGV de la plateforme' : 'Accept the platform Terms of Service and Terms of Sale',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                  {language === 'fr' ? 'Obligations' : 'Obligations'}
                </h3>
                {[
                  language === 'fr' ? 'Expédier sous 3 jours ouvrables' : 'Ship within 3 business days',
                  language === 'fr' ? 'Fournir un numéro de suivi valide' : 'Provide a valid tracking number',
                  language === 'fr' ? "Certifier l'authenticité des cheveux" : 'Certify the authenticity of the hair',
                  language === 'fr' ? 'Mentionner tout traitement chimique effectué' : 'Disclose any chemical treatment performed',
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
                {language === 'fr' ? 'Questions fréquentes' : 'Frequently asked questions'}
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
                {language === "fr" ? "Besoin d'aide ?" : 'Need help?'}
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
                  <p className="text-xs text-gray-500 font-medium">{language === 'fr' ? 'Email' : 'Email'}</p>
                  <p className="text-emerald-700 font-semibold text-sm">naturalhairmarket@gmail.com</p>
                </div>
              </a>
              <a
                href="tel:+33784898647"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{language === 'fr' ? 'Téléphone' : 'Phone'}</p>
                  <p className="text-emerald-700 font-semibold text-sm">+33 7 84 89 86 47</p>
                </div>
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
