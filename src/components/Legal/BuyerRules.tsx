import { useEffect } from 'react';
import { ShoppingBag, CheckCircle, XCircle, AlertTriangle, Shield, CreditCard, Package, FileText, Ban, Eye, Scale, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function BuyerRules() {
  const { language } = useLanguage();

  useEffect(() => {
    const prevTitle = document.title;
    const m = document.getElementById('meta-description') as HTMLMetaElement | null;
    const prevDesc = m?.content ?? '';
    document.title = language === 'fr'
      ? 'Règlement acheteur | Natural Hair Market'
      : 'Buyer Rules | Natural Hair Market';
    if (m) m.content = language === 'fr'
      ? 'Consultez le règlement acheteur de Natural Hair Market : garanties, paiement sécurisé, protection des transactions et politique de remboursement.'
      : 'Read the buyer rules of Natural Hair Market: guarantees, secure payment, transaction protection and refund policy.';
    return () => { document.title = prevTitle; if (m) m.content = prevDesc; };
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent">
                {language === 'fr' ? 'Règlement acheteur' : 'Buyer Rules'}
              </h1>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-6 mb-8">
            <p className="text-gray-700 leading-relaxed mb-3">
              {language === 'fr'
                ? "En utilisant NaturalHairMarket pour acheter des cheveux humains, vous acceptez pleinement le présent règlement ainsi que les CGU, CGV et la Politique de remboursement de la plateforme."
                : 'By using NaturalHairMarket to purchase human hair, you fully accept these rules as well as the Terms of Service, Terms of Sale and Refund Policy of the platform.'}
            </p>
            <div className="bg-white border border-teal-300 rounded-lg p-4">
              <p className="text-gray-800 font-semibold">
                {language === 'fr'
                  ? "NaturalHairMarket est une plateforme d'intermédiation :"
                  : 'NaturalHairMarket is an intermediary platform:'}
              </p>
              <p className="text-gray-700 mt-1">
                {language === 'fr'
                  ? 'nous ne sommes pas vendeurs et ne détenons pas physiquement les produits.'
                  : 'we are not sellers and do not physically hold the products.'}
              </p>
            </div>
          </div>

          <div className="prose prose-teal max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <ShoppingBag className="w-6 h-6 text-teal-600" />
                {language === 'fr' ? '1. Conditions pour acheter' : '1. Requirements to Purchase'}
              </h2>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  {language === 'fr' ? 'Pour effectuer un achat, vous devez :' : 'To make a purchase, you must:'}
                </p>
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'avoir au moins 18 ans' : 'be at least 18 years old'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === "fr" ? "disposer d'un compte utilisateur valide" : 'have a valid user account'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'fournir des informations exactes' : 'provide accurate information'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'utiliser un moyen de paiement valide' : 'use a valid payment method'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'accepter nos CGU / CGV' : 'accept our Terms of Service / Terms of Sale'}</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Eye className="w-6 h-6 text-teal-600" />
                {language === 'fr' ? '2. Informations avant achat' : '2. Information Before Purchase'}
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">
                  {language === "fr" ? "Avant d'acheter, l'acheteur doit :" : 'Before purchasing, the buyer must:'}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === "fr" ? "lire la description complète de l'annonce" : 'read the full listing description'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'vérifier la longueur, texture et couleur indiquées' : 'verify the indicated length, texture and color'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'vérifier si les cheveux ont été traités (coloration, décoloration, lissage)' : 'check whether the hair has been treated (coloring, bleaching, straightening)'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === "fr" ? "vérifier le prix, les frais d'expédition et les conditions" : 'check the price, shipping costs and conditions'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === "fr" ? "s'assurer que le produit correspond à ses attentes" : 'ensure the product meets their expectations'}</span>
                  </div>
                </div>
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <p className="text-gray-800 font-semibold">
                    {language === 'fr'
                      ? "Une commande passée implique que l'acheteur a compris et accepté les caractéristiques du produit."
                      : 'Placing an order implies that the buyer has understood and accepted the product characteristics.'}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                {language === 'fr' ? '3. Droit de rétractation (non applicable)' : '3. Right of Withdrawal (not applicable)'}
              </h2>
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">
                  {language === 'fr'
                    ? "Les cheveux humains coupés sont des produits d'hygiène personnelle."
                    : 'Cut human hair is a personal hygiene product.'}
                </p>
                <p className="text-gray-700 mb-3">
                  {language === 'fr'
                    ? "Conformément à l'article L221-28 du Code de la consommation :"
                    : 'In accordance with Article L221-28 of the Consumer Code:'}
                </p>
                <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-4 space-y-2">
                  <p className="text-red-700 font-semibold flex items-center gap-2">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    {language === "fr" ? "Aucun droit de rétractation de 14 jours ne s'applique" : 'No 14-day right of withdrawal applies'}
                  </p>
                  <p className="text-red-700 font-semibold flex items-center gap-2">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    {language === "fr" ? "Aucun retour n'est possible après ouverture" : 'No return is possible after opening'}
                  </p>
                  <p className="text-red-700 font-semibold flex items-center gap-2">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    {language === 'fr' ? 'Les retours pour "changement d\'avis" sont interdits' : 'Returns for "change of mind" are not allowed'}
                  </p>
                </div>
                <div className="bg-white border border-yellow-400 rounded-lg p-4">
                  <p className="text-gray-700 mb-2 font-semibold">
                    {language === 'fr' ? 'Les seuls remboursements possibles sont liés :' : 'The only possible refunds are related to:'}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'à la non-expédition' : 'non-shipment'}</li>
                    <li>{language === 'fr' ? 'à une perte de colis' : 'package loss'}</li>
                    <li>{language === 'fr' ? 'à une non-conformité avérée' : 'proven non-conformity'}</li>
                    <li>{language === 'fr' ? 'à une fraude du vendeur' : 'seller fraud'}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CreditCard className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '4. Paiement et sécurité' : '4. Payment and Security'}
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  {language === 'fr' ? (
                    <>Les paiements sont effectués par <strong>Stripe</strong>, un prestataire sécurisé.</>
                  ) : (
                    <>Payments are processed by <strong>Stripe</strong>, a secure provider.</>
                  )}
                </p>
                <p className="text-gray-700 mb-4">
                  {language === 'fr' ? 'NaturalHairMarket ne stocke aucune donnée bancaire.' : 'NaturalHairMarket does not store any banking data.'}
                </p>
                <div className="bg-white border border-emerald-200 rounded-lg p-4">
                  <p className="text-gray-700 mb-2 font-semibold">
                    {language === "fr" ? "Les fonds restent bloqués jusqu'à :" : 'Funds remain held until:'}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      {language === "fr" ? "confirmation de réception par l'acheteur" : 'receipt confirmation by the buyer'}
                    </div>
                    <p className="text-center font-semibold text-gray-600">{language === 'fr' ? 'OU' : 'OR'}</p>
                    <div className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      {language === 'fr' ? 'délai automatique de 48 heures après livraison' : 'automatic 48-hour period after delivery'}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Package className="w-6 h-6 text-teal-600" />
                {language === 'fr' ? '5. Réception du produit' : '5. Product Receipt'}
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">
                  {language === "fr" ? "À réception du colis, l'acheteur doit :" : 'Upon receiving the package, the buyer must:'}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    {language === "fr" ? "vérifier l'état du paquet" : 'check the package condition'}
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    {language === 'fr' ? 'ouvrir et inspecter les cheveux' : 'open and inspect the hair'}
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    {language === "fr" ? "comparer avec la description de l'annonce" : 'compare with the listing description'}
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    {language === 'fr' ? 's\'assurer de la conformité' : 'ensure conformity'}
                  </div>
                </div>
                <div className="bg-red-50 border-2 border-red-400 rounded-lg p-5 mb-4">
                  <p className="text-red-800 font-bold mb-3">
                    {language === "fr" ? "En cas de problème, l'acheteur doit impérativement respecter les délais :" : 'In case of a problem, the buyer must strictly respect the deadlines:'}
                  </p>
                  <div className="space-y-2">
                    <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-red-700 font-semibold">{language === 'fr' ? '➡️ SIGNALER LE PROBLÈME DANS LES 24 HEURES' : '➡️ REPORT THE PROBLEM WITHIN 24 HOURS'}</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-red-700 font-semibold">{language === 'fr' ? '➡️ NE PAS confirmer la réception' : '➡️ DO NOT confirm receipt'}</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-red-700 font-semibold">{language === 'fr' ? '➡️ contacter naturalhairmarket@gmail.com en envoyant des photos' : '➡️ contact naturalhairmarket@gmail.com and send photos'}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                  <p className="text-gray-800 font-bold mb-2">
                    {language === 'fr' ? 'Passé ce délai :' : 'After this deadline:'}
                  </p>
                  <div className="space-y-1 text-gray-700">
                    <p className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      {language === 'fr' ? 'la vente est considérée comme conforme' : 'the sale is considered conformant'}
                    </p>
                    <p className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      {language === "fr" ? "aucun remboursement n'est possible" : 'no refund is possible'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                {language === 'fr' ? '6. Procédure en cas de problème' : '6. Procedure in Case of a Problem'}
              </h2>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  {language === 'fr'
                    ? "Comme il n'existe pas de messagerie interne, l'acheteur doit contacter exclusivement NaturalHairMarket :"
                    : 'Since there is no internal messaging system, the buyer must contact NaturalHairMarket exclusively:'}
                </p>
                <div className="bg-white border-2 border-orange-400 rounded-lg p-4 mb-4">
                  <p className="text-orange-600 font-semibold text-lg text-center">📧 naturalhairmarket@gmail.com</p>
                </div>
                <div className="bg-white border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-2 font-semibold">
                    {language === 'fr' ? 'NaturalHairMarket :' : 'NaturalHairMarket:'}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'analyse les preuves (photos, description, suivi)' : 'analyzes the evidence (photos, description, tracking)'}</li>
                    <li>{language === 'fr' ? 'contacte le vendeur' : 'contacts the seller'}</li>
                    <li>{language === 'fr' ? 'rend une décision impartiale' : 'renders an impartial decision'}</li>
                  </ul>
                </div>
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <p className="text-gray-700 mb-2 font-semibold">
                    {language === 'fr' ? 'Nous pouvons :' : 'We can:'}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'rembourser l\'acheteur' : 'refund the buyer'}</li>
                    <li>{language === 'fr' ? 'demander un remboursement au vendeur' : 'request a refund from the seller'}</li>
                    <li>{language === 'fr' ? 'libérer les fonds au vendeur si le produit est conforme' : 'release the funds to the seller if the product is conformant'}</li>
                    <li>{language === 'fr' ? 'suspendre un vendeur en cas de fraude' : 'suspend a seller in case of fraud'}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '7. Remboursements possibles' : '7. Possible Refunds'}
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">
                  {language === 'fr' ? 'Un remboursement est possible si :' : 'A refund is possible if:'}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === "fr" ? "le vendeur n'a pas expédié dans les 3 jours ouvrables" : 'the seller did not ship within 3 business days'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'le colis est perdu et non traçable' : 'the package is lost and not trackable'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'les cheveux ne sont pas conformes (longueur, couleur, texture, état, traitements)' : 'the hair is not conformant (length, color, texture, condition, treatments)'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'les cheveux reçus sont synthétiques' : 'the received hair is synthetic'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'les cheveux sont sales, abîmés ou impropres' : 'the hair is dirty, damaged or unfit for use'}</span>
                  </div>
                </div>
                <div className="bg-white border-2 border-emerald-400 rounded-lg p-4">
                  <p className="text-emerald-800 font-bold">
                    {language === 'fr'
                      ? 'Dans ces cas : ➡️ l\'acheteur est remboursé du produit + livraison + commission 10%'
                      : 'In these cases: ➡️ the buyer is refunded for the product + shipping + 10% commission'}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                {language === 'fr' ? '8. Ce qui ne donne PAS droit à remboursement' : '8. What Does NOT Qualify for a Refund'}
              </h2>
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
                <p className="text-red-700 mb-3 font-bold">
                  {language === 'fr' ? 'Aucun remboursement ne sera accordé dans les cas suivants :' : 'No refund will be granted in the following cases:'}
                </p>
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === "fr" ? "simple changement d'avis" : 'simple change of mind'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'le colis a été ouvert sans justification valable' : 'the package was opened without valid justification'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'problème signalé après 24h' : 'problem reported after 24 hours'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === "fr" ? "légère différence de teinte due à l'écran / lumière" : 'slight shade difference due to screen / lighting'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === "fr" ? "utilisation du produit par l'acheteur" : 'use of the product by the buyer'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'absence de preuve' : 'lack of evidence'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === "fr" ? "les cheveux correspondent à l'annonce" : 'the hair matches the listing'}</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Ban className="w-6 h-6 text-red-600" />
                {language === 'fr' ? '9. Interdiction des transactions hors plateforme' : '9. Prohibition of Off-Platform Transactions'}
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-700 mb-3 font-bold">
                  {language === "fr" ? "Il est strictement interdit à l'acheteur de :" : 'The buyer is strictly prohibited from:'}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'demander au vendeur de conclure la vente ailleurs' : 'asking the seller to complete the sale elsewhere'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'contourner les paiements sécurisés' : 'bypassing secure payments'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'éviter la commission NaturalHairMarket' : 'avoiding the NaturalHairMarket commission'}</span>
                  </div>
                </div>
                <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                  <p className="text-red-800 font-bold mb-2">
                    {language === 'fr' ? 'Toute tentative entraîne :' : 'Any attempt results in:'}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'suppression du compte' : 'account deletion'}</li>
                    <li>{language === "fr" ? "impossibilité d'effectuer de nouveaux achats" : 'inability to make new purchases'}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-teal-600" />
                {language === 'fr' ? '10. Sécurité et hygiène' : '10. Safety and Hygiene'}
              </h2>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">
                  {language === "fr" ? "L'acheteur reconnaît que :" : 'The buyer acknowledges that:'}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>{language === 'fr' ? 'les cheveux doivent être lavés avant utilisation' : 'the hair must be washed before use'}</li>
                  <li>{language === "fr" ? "il doit vérifier l'état du produit avant usage" : 'they must check the product condition before use'}</li>
                  <li>{language === 'fr' ? 'il doit manipuler les cheveux dans un environnement propre' : 'they must handle the hair in a clean environment'}</li>
                  <li>{language === "fr" ? "NaturalHairMarket ne peut garantir l'absence absolue de risques sanitaires" : 'NaturalHairMarket cannot guarantee the absolute absence of health risks'}</li>
                  <li>{language === "fr" ? "l'usage final des cheveux relève de la responsabilité de l'acheteur" : 'the final use of the hair is the responsibility of the buyer'}</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-teal-600" />
                {language === "fr" ? "11. Responsabilités de l'acheteur" : '11. Buyer Responsibilities'}
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">
                  {language === "fr" ? "L'acheteur est responsable :" : 'The buyer is responsible for:'}
                </p>
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'de la vérification immédiate du produit' : 'immediately verifying the product'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'de fournir des preuves en cas de litige' : 'providing evidence in case of a dispute'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === 'fr' ? 'de respecter les délais légaux' : 'respecting legal deadlines'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === "fr" ? "de lire attentivement l'annonce avant l'achat" : 'carefully reading the listing before purchase'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{language === "fr" ? "d'utiliser les cheveux correctement et de manière hygiénique" : 'using the hair correctly and hygienically'}</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Scale className="w-6 h-6 text-blue-600" />
                {language === 'fr' ? '12. Médiation légale' : '12. Legal Mediation'}
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  {language === 'fr' ? 'Si un litige persiste :' : 'If a dispute persists:'}
                </p>
                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <p className="font-semibold text-gray-800 mb-2">
                    {language === 'fr' ? 'AME Conso – Médiateur de la consommation' : 'AME Conso – Consumer Mediator'}
                  </p>
                  <p className="text-gray-700">www.mediationconso-ame.com</p>
                  <p className="text-gray-700 mt-2">11 Place Dauphine, 75001 Paris</p>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-teal-600" />
                {language === 'fr' ? '13. Contact' : '13. Contact'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'fr' ? 'Pour toute question ou assistance :' : 'For any questions or assistance:'}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-teal-200">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{language === 'fr' ? 'Email' : 'Email'}</p>
                    <a href="mailto:naturalhairmarket@gmail.com" className="text-teal-600 font-semibold hover:underline">
                      naturalhairmarket@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-teal-200">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{language === 'fr' ? 'Téléphone' : 'Phone'}</p>
                    <a href="tel:+33784898647" className="text-teal-600 font-semibold hover:underline">
                      +33 7 84 89 86 47
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <div className="bg-teal-600 text-white rounded-lg p-6 mt-8">
              <p className="text-center font-semibold">
                {language === 'fr'
                  ? "Le respect de ce règlement garantit une expérience d'achat transparente et sécurisée sur NaturalHairMarket."
                  : 'Compliance with these rules ensures a transparent and secure shopping experience on NaturalHairMarket.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
