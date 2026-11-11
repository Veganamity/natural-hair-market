import { useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, Award, Eye, Users, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function SafetyQuality() {
  const { language } = useLanguage();

  useEffect(() => {
    const prevTitle = document.title;
    const m = document.getElementById('meta-description') as HTMLMetaElement | null;
    const prevDesc = m?.content ?? '';
    document.title = language === 'fr'
      ? 'Sécurité & Qualité des cheveux naturels | Natural Hair Market'
      : 'Safety & Quality of Natural Hair | Natural Hair Market';
    if (m) m.content = language === 'fr'
      ? 'Découvrez nos critères de qualité et mesures de sécurité pour garantir des cheveux naturels authentiques. Contrôle, vérification et normes sur Natural Hair Market.'
      : 'Discover our quality criteria and safety measures to guarantee authentic natural hair. Inspection, verification and standards on Natural Hair Market.';
    return () => { document.title = prevTitle; if (m) m.content = prevDesc; };
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                {language === 'fr' ? 'Sécurité & Qualité des cheveux' : 'Safety & Quality of Hair'}
              </h1>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6 mb-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              {language === 'fr'
                ? "NaturalHairMarket s'engage à offrir un espace sécurisé permettant la vente et l'achat de cheveux humains naturels. Cette page détaille toutes les informations importantes pour comprendre :"
                : "NaturalHairMarket is committed to providing a secure space for the sale and purchase of natural human hair. This page details all the important information to understand:"}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              <li>{language === 'fr' ? 'les standards de qualité attendus' : 'the expected quality standards'}</li>
              <li>{language === 'fr' ? 'les règles à respecter pour publier une annonce' : 'the rules to follow when posting a listing'}</li>
              <li>{language === 'fr' ? 'les protections mises en place pour les acheteurs' : 'the protections in place for buyers'}</li>
              <li>{language === 'fr' ? 'les responsabilités de chacun' : 'the responsibilities of each party'}</li>
            </ul>
            <div className="bg-white border border-emerald-300 rounded-lg p-4">
              <p className="text-gray-800 font-semibold">
                {language === 'fr'
                  ? "NaturalHairMarket est une plateforme d'intermédiation : nous ne sommes pas vendeurs et ne manipulons pas les produits."
                  : "NaturalHairMarket is an intermediary platform: we are not sellers and do not handle the products."}
              </p>
              <p className="text-gray-700 mt-2">
                {language === 'fr'
                  ? "Les vendeurs sont entièrement responsables de la qualité des cheveux qu'ils publient."
                  : "Sellers are fully responsible for the quality of the hair they list."}
              </p>
            </div>
          </div>

          <div className="prose prose-emerald max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '1. Authenticité des cheveux' : '1. Hair Authenticity'}
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">
                  {language === 'fr' ? 'Chaque vendeur doit obligatoirement certifier que :' : 'Each seller must mandatorily certify that:'}
                </p>
                <div className="bg-white rounded-lg p-4 border border-emerald-300 space-y-2 mb-4">
                  <p className="text-gray-700 flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    {language === 'fr' ? 'les cheveux sont 100 % humains' : 'the hair is 100% human'}
                  </p>
                  <p className="text-gray-700 flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    {language === 'fr' ? 'les cheveux ne sont pas synthétiques' : 'the hair is not synthetic'}
                  </p>
                  <p className="text-gray-700 flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    {language === "fr" ? "les cheveux ne sont pas d'origine frauduleuse" : 'the hair is not of fraudulent origin'}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-2">
                    {language === 'fr'
                      ? "Cette certification est validée par une case obligatoire lors du dépôt d'annonce :"
                      : 'This certification is validated by a mandatory checkbox when posting a listing:'}
                  </p>
                  <p className="text-gray-800 italic font-semibold">
                    {language === 'fr'
                      ? '« Je certifie que les cheveux déposés sur cette annonce sont 100 % humains, naturels et non synthétiques. »'
                      : '"I certify that the hair listed in this ad is 100% human, natural and non-synthetic."'}
                  </p>
                </div>
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                  <p className="text-red-700 font-bold mb-2">
                    {language === 'fr' ? 'Toute fausse déclaration entraîne :' : 'Any false declaration results in:'}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'annulation de la vente' : 'cancellation of the sale'}</li>
                    <li>{language === "fr" ? "remboursement à l'acheteur" : 'refund to the buyer'}</li>
                    <li>{language === 'fr' ? 'suspension définitive du compte vendeur' : 'permanent suspension of the seller account'}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '2. Hygiène & état des cheveux' : '2. Hygiene & Hair Condition'}
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">
                  {language === 'fr' ? 'Les cheveux mis en vente doivent obligatoirement être :' : 'Hair listed for sale must mandatorily be:'}
                </p>
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{language === 'fr' ? 'propres' : 'clean'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{language === 'fr' ? 'secs' : 'dry'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{language === 'fr' ? 'exempts de parasites' : 'free of parasites'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{language === 'fr' ? 'sans odeur désagréable' : 'free of unpleasant odor'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{language === 'fr' ? 'correctement attachés' : 'properly tied'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{language === 'fr' ? 'coupés récemment' : 'recently cut'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2 md:col-span-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{language === 'fr' ? 'en bon état général' : 'in good overall condition'}</span>
                  </div>
                </div>
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                  <p className="text-gray-700 mb-2 font-semibold">
                    {language === 'fr' ? 'Les cheveux :' : 'Hair that is:'}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mb-3">
                    <li>{language === 'fr' ? 'sales' : 'dirty'}</li>
                    <li>{language === 'fr' ? 'moisis' : 'moldy'}</li>
                    <li>{language === 'fr' ? 'emmêlés de manière excessive' : 'excessively tangled'}</li>
                    <li>{language === 'fr' ? 'contenant des résidus inconnus' : 'containing unknown residue'}</li>
                    <li>{language === 'fr' ? 'ou mal conservés' : 'or improperly stored'}</li>
                  </ul>
                  <p className="text-red-700 font-bold">
                    {language === 'fr' ? '➡️ sont strictement interdits à la vente.' : '➡️ is strictly prohibited from being sold.'}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                {language === 'fr' ? '3. Mention obligatoire des traitements' : '3. Mandatory Disclosure of Treatments'}
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  {language === 'fr'
                    ? 'Les vendeurs doivent indiquer de manière transparente si les cheveux ont subi :'
                    : 'Sellers must transparently indicate if the hair has undergone:'}
                </p>
                <div className="grid md:grid-cols-2 gap-2 mb-4">
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    {language === 'fr' ? 'coloration' : 'coloring'}
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    {language === 'fr' ? 'décoloration' : 'bleaching'}
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    {language === 'fr' ? 'lissage' : 'straightening'}
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    {language === 'fr' ? 'permanente' : 'perm'}
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    {language === 'fr' ? 'kératine' : 'keratin treatment'}
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    {language === 'fr' ? 'henné' : 'henna'}
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm md:col-span-2">
                    {language === 'fr' ? 'tout traitement chimique' : 'any chemical treatment'}
                  </div>
                </div>
                <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                  <p className="text-red-800 font-semibold">
                    {language === 'fr'
                      ? 'Vendre des cheveux traités sans le préciser est considéré comme une fausse déclaration.'
                      : 'Selling treated hair without disclosing it is considered a false declaration.'}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Eye className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '4. Longueur, couleur et texture : règles de clarté' : '4. Length, Color and Texture: Clarity Rules'}
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  {language === 'fr' ? 'Les vendeurs doivent fournir :' : 'Sellers must provide:'}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>{language === 'fr' ? 'une mesure exacte de la longueur' : 'an exact length measurement'}</li>
                  <li>{language === 'fr' ? 'une mention réelle de la couleur' : 'a true color description'}</li>
                  <li>{language === 'fr' ? 'la texture réelle (lisse, ondulé, bouclé, crépu)' : 'the actual texture (straight, wavy, curly, coily)'}</li>
                </ul>
                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    {language === 'fr'
                      ? "Variations naturelles (ton clair/foncé selon écran ou lumière) ne sont pas considérées comme défaut, mais toute différence majeure doit être signalée."
                      : 'Natural variations (light/dark tone depending on screen or lighting) are not considered a defect, but any major difference must be disclosed.'}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-red-600" />
                {language === 'fr' ? '5. Sécurité du consommateur' : '5. Consumer Safety'}
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">
                  {language === "fr" ? "Pour des raisons d'hygiène :" : 'For hygiene reasons:'}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>{language === 'fr' ? 'les cheveux ne doivent présenter aucun risque sanitaire' : 'the hair must not present any health risk'}</li>
                  <li>{language === 'fr' ? 'aucun produit potentiellement dangereux ne doit être ajouté' : 'no potentially dangerous product may be added'}</li>
                  <li>{language === 'fr' ? 'les cheveux ne doivent pas être porteurs de parasites, poux ou substances toxiques' : 'the hair must not carry parasites, lice or toxic substances'}</li>
                </ul>
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <p className="text-gray-700 mb-2 font-semibold">
                    {language === "fr" ? "Il est conseillé aux acheteurs, après réception :" : 'Buyers are advised, upon receipt:'}
                  </p>
                  <ul className="list-none text-gray-700 space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      {language === "fr" ? "d'inspecter le produit" : 'to inspect the product'}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      {language === 'fr' ? 'de laver et sécher les cheveux' : 'to wash and dry the hair'}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      {language === 'fr' ? 'de conserver les cheveux dans un environnement propre' : 'to store the hair in a clean environment'}
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                {language === 'fr' ? '6. Absence de droit de rétractation' : '6. No Right of Withdrawal'}
              </h2>
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  {language === 'fr' ? 'Les cheveux humains coupés sont considérés comme :' : 'Cut human hair is considered:'}
                </p>
                <div className="bg-white border border-yellow-400 rounded-lg p-4 mb-4">
                  <p className="text-gray-800 font-bold text-lg">
                    {language === 'fr' ? '➡️ des biens d\'hygiène personnelle' : '➡️ personal hygiene products'}
                  </p>
                </div>
                <p className="text-gray-700 mb-3">
                  {language === 'fr'
                    ? "Conformément à l'article L221-28 du Code de la consommation :"
                    : 'In accordance with Article L221-28 of the Consumer Code:'}
                </p>
                <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4 space-y-2">
                  <p className="text-red-700 font-semibold flex items-center gap-2">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    {language === "fr" ? "Aucun retour n'est possible après ouverture du colis" : 'No return is possible after opening the package'}
                  </p>
                  <p className="text-red-700 font-semibold flex items-center gap-2">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    {language === "fr" ? "Le droit de rétractation de 14 jours ne s'applique pas" : 'The 14-day right of withdrawal does not apply'}
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-gray-700 mb-2 font-semibold">
                    {language === 'fr' ? 'Sauf :' : 'Except:'}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'non-conformité avérée' : 'proven non-conformity'}</li>
                    <li>{language === 'fr' ? 'fraude du vendeur' : 'seller fraud'}</li>
                    <li>{language === 'fr' ? 'produit synthétique vendu comme naturel' : 'synthetic product sold as natural'}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '7. Protection des acheteurs' : '7. Buyer Protection'}
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4 font-semibold">
                  {language === 'fr' ? 'NaturalHairMarket a mis en place :' : 'NaturalHairMarket has implemented:'}
                </p>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border-l-4 border-emerald-600 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'Système de certification obligatoire "100 % humains"' : 'Mandatory "100% human" certification system'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-emerald-600 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === "fr" ? "Analyse des litiges par notre équipe (aucun contact direct vendeur-acheteur)" : 'Dispute analysis by our team (no direct seller-buyer contact)'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-emerald-600 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'Remboursement en cas de non-conformité' : 'Refund in case of non-conformity'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-emerald-600 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === "fr" ? "Signalement d'annonce suspecte" : 'Suspicious listing reporting'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-emerald-600 flex items-start gap-3">
                    <Award className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'Badge "Salon Vérifié" pour les vendeurs professionnels fournissant leur SIRET/SIREN' : '"Verified Salon" badge for professional sellers providing their SIRET/SIREN'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-emerald-600 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === "fr" ? "Paiement sécurisé Stripe avec blocage des fonds jusqu'à validation" : 'Secure Stripe payment with funds held until validation'}</span>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-gray-700 mb-2 font-semibold">
                    {language === 'fr' ? 'Ces mesures permettent de limiter :' : 'These measures help limit:'}
                  </p>
                  <div className="grid md:grid-cols-2 gap-2">
                    <span className="text-gray-700">{language === 'fr' ? '• les fraudes' : '• fraud'}</span>
                    <span className="text-gray-700">{language === 'fr' ? '• les annonces synthétiques' : '• synthetic hair listings'}</span>
                    <span className="text-gray-700">{language === 'fr' ? '• les arnaques' : '• scams'}</span>
                    <span className="text-gray-700">{language === 'fr' ? '• les fausses descriptions' : '• false descriptions'}</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                {language === "fr" ? "8. Signalement d'une annonce suspecte" : '8. Reporting a Suspicious Listing'}
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  {language === 'fr'
                    ? "Les utilisateurs peuvent signaler une annonce suspecte s'ils pensent que :"
                    : 'Users can report a suspicious listing if they believe that:'}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>{language === 'fr' ? 'les cheveux ne sont pas naturels' : 'the hair is not natural'}</li>
                  <li>{language === 'fr' ? 'la description est fausse' : 'the description is false'}</li>
                  <li>{language === 'fr' ? 'les photos semblent volées' : 'the photos appear stolen'}</li>
                  <li>{language === 'fr' ? 'le vendeur paraît suspect' : 'the seller seems suspicious'}</li>
                </ul>
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <p className="text-gray-700 mb-2 font-semibold">
                    {language === 'fr' ? 'NaturalHairMarket examine et peut :' : 'NaturalHairMarket reviews and may:'}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === "fr" ? "suspendre l'annonce" : 'suspend the listing'}</li>
                    <li>{language === 'fr' ? 'bloquer le vendeur' : 'block the seller'}</li>
                    <li>{language === 'fr' ? 'exiger des preuves' : 'require proof'}</li>
                    <li>{language === 'fr' ? 'annuler une vente en cours' : 'cancel an ongoing sale'}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '9. Responsabilité des vendeurs' : '9. Seller Responsibility'}
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">
                  {language === 'fr' ? 'Les vendeurs sont légalement responsables :' : 'Sellers are legally responsible for:'}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>{language === 'fr' ? 'de la véracité de leurs annonces' : 'the accuracy of their listings'}</li>
                  <li>{language === "fr" ? "de l'hygiène des cheveux" : 'the hygiene of the hair'}</li>
                  <li>{language === 'fr' ? 'de leur authenticité' : 'their authenticity'}</li>
                  <li>{language === 'fr' ? 'de leur conformité' : 'their conformity'}</li>
                  <li>{language === "fr" ? "de l'expédition correcte" : 'proper shipping'}</li>
                </ul>
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                  <p className="text-red-700 font-bold mb-2">
                    {language === 'fr' ? 'Toute fraude entraîne :' : 'Any fraud results in:'}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'remboursement total' : 'full refund'}</li>
                    <li>{language === 'fr' ? 'suppression définitive du compte' : 'permanent account deletion'}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '10. Conseils de sécurité pour les acheteurs' : '10. Safety Tips for Buyers'}
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  {language === 'fr' ? 'Pour garantir une expérience sécurisée, nous recommandons de :' : 'To ensure a safe experience, we recommend:'}
                </p>
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'consulter attentivement la description' : 'carefully review the description'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'vérifier la longueur et texture indiquées' : 'verify the indicated length and texture'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === "fr" ? "vérifier l'état du paquet à réception" : 'check the package condition upon receipt'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'signaler immédiatement (dans les 24 heures) tout problème' : 'immediately report (within 24 hours) any problem'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'conserver les cheveux dans un environnement propre et sec' : 'store the hair in a clean and dry environment'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'laver les cheveux avant utilisation' : 'wash the hair before use'}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '11. Contact' : '11. Contact'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'fr' ? 'Pour toute question concernant la sécurité et la qualité :' : 'For any questions regarding safety and quality:'}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{language === 'fr' ? 'Email' : 'Email'}</p>
                    <a href="mailto:naturalhairmarket@gmail.com" className="text-emerald-600 font-semibold hover:underline">
                      naturalhairmarket@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{language === 'fr' ? 'Téléphone' : 'Phone'}</p>
                    <a href="tel:+33784898647" className="text-emerald-600 font-semibold hover:underline">
                      +33 7 84 89 86 47
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <div className="bg-emerald-600 text-white rounded-lg p-6 mt-8">
              <p className="text-center font-semibold">
                {language === 'fr'
                  ? 'NaturalHairMarket met tout en œuvre pour garantir des transactions sécurisées et transparentes entre acheteurs et vendeurs.'
                  : 'NaturalHairMarket does everything possible to ensure secure and transparent transactions between buyers and sellers.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
