import { useEffect } from 'react';
import { FileText, ShoppingCart, CreditCard, AlertCircle, Shield, Ban, Gavel } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function SalesTerms() {
  const { language } = useLanguage();

  useEffect(() => {
    const prevTitle = document.title;
    const m = document.getElementById('meta-description') as HTMLMetaElement | null;
    const prevDesc = m?.content ?? '';
    document.title = language === 'fr' ? 'Conditions Générales de Vente | Natural Hair Market' : 'General Terms and Conditions of Sale | Natural Hair Market';
    if (m) m.content = language === 'fr'
      ? "Consultez les Conditions Générales de Vente de Natural Hair Market. Règles applicables à l'achat et à la vente de cheveux naturels sur notre plateforme."
      : "Review the General Terms and Conditions of Sale of Natural Hair Market. Rules applicable to the purchase and sale of natural hair on our platform.";
    return () => { document.title = prevTitle; if (m) m.content = prevDesc; };
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                {language === 'fr' ? 'Conditions Générales de Vente' : 'General Terms and Conditions of Sale'}
              </h1>
              <p className="text-gray-600 mt-1">{language === 'fr' ? 'Dernière mise à jour : 18 novembre 2025' : 'Last updated: November 18, 2025'}</p>
            </div>
          </div>

          <div className="prose prose-emerald max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '1. Objet' : '1. Purpose'}
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {language === 'fr' ? (
                    <>
                      Les présentes Conditions Générales de Vente (CGV) encadrent les transactions réalisées via
                      la plateforme NaturalHairMarket, éditée par Stéphanie Buisson.
                    </>
                  ) : (
                    <>
                      These General Terms and Conditions of Sale (GTCS) govern transactions carried out via
                      the NaturalHairMarket platform, published by Stéphanie Buisson.
                    </>
                  )}
                </p>
                <div className="bg-white rounded-lg p-4 border border-emerald-200">
                  <p className="text-gray-700 font-semibold mb-2">{language === 'fr' ? 'NaturalHairMarket :' : 'NaturalHairMarket:'}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'met en relation vendeurs (salons ou particuliers) et acheteurs' : 'connects sellers (salons or individuals) and buyers'}</li>
                    <li>{language === "fr" ? "assure la mise à disposition d'un système sécurisé de paiement" : 'provides a secure payment system'}</li>
                    <li>{language === "fr" ? "perçoit une commission de 10% payée par l'acheteur pour chaque transaction" : 'collects a 10% commission paid by the buyer for each transaction'}</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mt-4">
                  <p className="text-gray-800 font-semibold">
                    {language === "fr" ? "NaturalHairMarket n'est pas vendeur des produits listés sur la plateforme." : 'NaturalHairMarket is not the seller of the products listed on the platform.'}
                  </p>
                  <p className="text-gray-700 mt-2">
                    {language === "fr" ? "Les vendeurs sont exclusivement responsables des produits qu'ils proposent." : 'Sellers are solely responsible for the products they offer.'}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CreditCard className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '2. Commission et frais' : '2. Commission and Fees'}
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{language === 'fr' ? '2.1 Commission NaturalHairMarket' : '2.1 NaturalHairMarket Commission'}</h3>
                  <p className="text-gray-700 mb-3">{language === 'fr' ? 'Pour chaque transaction réussie :' : 'For each successful transaction:'}</p>
                  <div className="bg-emerald-600 text-white rounded-lg p-4 mb-4">
                    <p className="text-center text-xl font-bold">
                      {language === "fr" ? "➡️ L'acheteur paie une commission de 10% TTC" : '➡️ The buyer pays a 10% commission (VAT included)'}
                    </p>
                  </div>
                  <p className="text-gray-700 mb-2">{language === 'fr' ? 'Cette commission correspond :' : 'This commission covers:'}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'aux frais de gestion du site' : 'site management fees'}</li>
                    <li>{language === 'fr' ? 'aux frais techniques (hébergement, maintenance)' : 'technical costs (hosting, maintenance)'}</li>
                    <li>{language === 'fr' ? 'à la gestion du paiement sécurisé' : 'secure payment management'}</li>
                    <li>{language === 'fr' ? 'à la rémunération de léditeur de la plateforme' : 'remuneration of the platform publisher'}</li>
                  </ul>
                  <p className="text-gray-700 mt-4 font-semibold">
                    {language === 'fr' ? (
                      <>Cette commission est non remboursable, sauf en cas d'annulation totale de la transaction.</>
                    ) : (
                      <>This commission is non-refundable, except in the event of total cancellation of the transaction.</>
                    )}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{language === 'fr' ? '2.2 Prix des produits' : '2.2 Product Prices'}</h3>
                  <p className="text-gray-700">
                    {language === 'fr' ? (
                      <>
                        Les prix sont fixés librement par les vendeurs.
                        NaturalHairMarket ne contrôle pas les prix mais peut supprimer des annonces manifestement
                        frauduleuses ou abusives.
                      </>
                    ) : (
                      <>
                        Prices are set freely by sellers.
                        NaturalHairMarket does not control prices but may remove listings that are manifestly
                        fraudulent or abusive.
                      </>
                    )}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{language === "fr" ? "2.3 Frais d'expédition" : '2.3 Shipping Fees'}</h3>
                  <p className="text-gray-700 mb-2">{language === 'fr' ? 'Les frais de livraison :' : 'Shipping fees:'}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'sont à la charge de lacheteur' : 'are borne by the buyer'}</li>
                    <li>{language === 'fr' ? 'sont déterminés par le vendeur' : 'are determined by the seller'}</li>
                    <li>{language === 'fr' ? 'sont affichés avant le paiement' : 'are displayed before payment'}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '3. Processus de commande' : '3. Order Process'}
              </h2>
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{language === 'fr' ? '3.1 Paiement sécurisé' : '3.1 Secure Payment'}</h3>
                  <p className="text-gray-700 mb-2">
                    {language === 'fr' ? (
                      <>Tous les paiements passent par Stripe.</>
                    ) : (
                      <>All payments are processed through Stripe.</>
                    )}
                  </p>
                  <p className="text-gray-700 font-semibold">
                    {language === 'fr' ? (
                      <>Aucune donnée bancaire n'est stockée par NaturalHairMarket.</>
                    ) : (
                      <>No banking data is stored by NaturalHairMarket.</>
                    )}
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{language === 'fr' ? '3.2 Blocage des fonds' : '3.2 Holding of Funds'}</h3>
                  <p className="text-gray-700 mb-3">
                    {language === 'fr' ? (
                      <>Les fonds versés par l'acheteur sont bloqués jusqu'à :</>
                    ) : (
                      <>Funds paid by the buyer are held until:</>
                    )}
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-yellow-300">
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>{language === "fr" ? "confirmation de réception par l'acheteur" : 'confirmation of receipt by the buyer'}</li>
                      <li className="font-semibold">{language === 'fr' ? 'OU expiration du délai automatique de 48 heures après livraison' : 'OR expiration of the automatic 48-hour period after delivery'}</li>
                    </ul>
                  </div>
                  <p className="text-gray-700 mt-3">
                    {language === 'fr' ? (
                      <>Une fois ce délai passé, le paiement est automatiquement libéré au vendeur.</>
                    ) : (
                      <>Once this period has elapsed, payment is automatically released to the seller.</>
                    )}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{language === 'fr' ? '3.3 Confirmation de réception' : '3.3 Confirmation of Receipt'}</h3>
                  <p className="text-gray-700">
                    {language === 'fr' ? (
                      <>L'acheteur doit confirmer la réception depuis son espace "Commandes".</>
                    ) : (
                      <>The buyer must confirm receipt from their "Orders" section.</>
                    )}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '4. Obligations du vendeur' : '4. Seller Obligations'}
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">{language === "fr" ? "Le vendeur s'engage à :" : 'The seller undertakes to:'}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>{language === 'fr' ? 'vendre uniquement des cheveux 100 % humains' : 'sell only 100% human hair'}</li>
                  <li>{language === 'fr' ? 'expédier le produit dans un délai de 3 jours ouvrables' : 'ship the product within 3 business days'}</li>
                  <li>{language === "fr" ? "décrire honnêtement l'article" : 'describe the item honestly'}</li>
                  <li>{language === 'fr' ? 'indiquer si les cheveux sont traités chimiquement' : 'indicate whether the hair has been chemically treated'}</li>
                  <li>{language === 'fr' ? 'fournir des photos fidèles' : 'provide accurate photos'}</li>
                  <li>{language === 'fr' ? 'expédier un produit propre, sain, non dangereux' : 'ship a clean, safe, non-hazardous product'}</li>
                  <li>{language === 'fr' ? 'respecter les obligations fiscales applicables à son statut' : 'comply with the tax obligations applicable to their status'}</li>
                </ul>
                <div className="bg-white border-2 border-red-400 rounded-lg p-4 mt-4">
                  <p className="text-red-700 font-bold mb-2">{language === 'fr' ? '⚠️ Toute fausse déclaration expose le vendeur à :' : '⚠️ Any false declaration exposes the seller to:'}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'suppression définitive du compte' : 'permanent account deletion'}</li>
                    <li>{language === 'fr' ? 'remboursement total exigé à lacheteur' : 'full refund required to the buyer'}</li>
                    <li>{language === 'fr' ? 'signalement aux autorités si fraude avérée' : 'reporting to the authorities if fraud is confirmed'}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
                {language === "fr" ? "5. Obligations de l'acheteur" : '5. Buyer Obligations'}
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">{language === "fr" ? "L'acheteur s'engage à :" : 'The buyer undertakes to:'}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>{language === 'fr' ? 'utiliser un moyen de paiement valide' : 'use a valid payment method'}</li>
                  <li>{language === 'fr' ? 'fournir une adresse correcte' : 'provide a correct address'}</li>
                  <li>{language === 'fr' ? 'vérifier larticle dès réception' : 'inspect the item upon receipt'}</li>
                  <li>{language === 'fr' ? 'signaler tout problème dans un délai de 24 heures' : 'report any problem within 24 hours'}</li>
                </ul>
                <p className="text-gray-700 mt-4 font-semibold">
                  {language === 'fr' ? (
                    <>Si aucune réclamation n'est faite dans ce délai, la vente est considérée comme conforme.</>
                  ) : (
                    <>If no claim is made within this period, the sale is considered to be in conformity.</>
                  )}
                </p>
                <div className="bg-white border border-blue-300 rounded-lg p-4 mt-4">
                  <p className="text-gray-800 font-semibold mb-2">{language === 'fr' ? 'Communication en cas de problème :' : 'Communication in case of a problem:'}</p>
                  <p className="text-gray-700">
                    {language === 'fr' ? (
                      <>En cas de problème lié à la conformité du produit, l'acheteur doit contacter NaturalHairMarket et non le vendeur directement.</>
                    ) : (
                      <>In the event of a problem related to product conformity, the buyer must contact NaturalHairMarket and not the seller directly.</>
                    )}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '6. Produits concernés – Exclusion du droit de rétractation' : '6. Products Concerned – Exclusion of the Right of Withdrawal'}
              </h2>
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  {language === 'fr' ? (
                    <>Conformément à l'article L221-28 du Code de la consommation :</>
                  ) : (
                    <>In accordance with Article L221-28 of the French Consumer Code:</>
                  )}
                </p>
                <div className="bg-white border border-yellow-400 rounded-lg p-4">
                  <p className="text-gray-800 font-bold text-lg mb-3">
                    {language === 'fr' ? (
                      <>➡️ Les cheveux humains coupés sont des biens d'hygiène ne pouvant être retournés pour raisons sanitaires.</>
                    ) : (
                      <>➡️ Cut human hair is a hygiene product that cannot be returned for sanitary reasons.</>
                    )}
                  </p>
                  <p className="text-gray-700 mb-2">{language === 'fr' ? 'Par conséquent :' : 'Consequently:'}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === "fr" ? "aucun retour n'est possible après ouverture du colis" : 'no return is possible after opening the package'}</li>
                    <li>{language === "fr" ? "aucun droit de rétractation de 14 jours ne s'applique" : 'no 14-day right of withdrawal applies'}</li>
                  </ul>
                </div>
                <p className="text-gray-700 mt-3">
                  {language === 'fr' ? (
                    <>Le vendeur peut néanmoins proposer un remboursement volontaire.</>
                  ) : (
                    <>The seller may nevertheless offer a voluntary refund.</>
                  )}
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Ban className="w-6 h-6 text-emerald-600" />
                {language === "fr" ? "7. Annulation d'une transaction" : "7. Cancellation of a Transaction"}
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">{language === 'fr' ? 'Une commande peut être annulée uniquement :' : 'An order may be cancelled only:'}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>{language === 'fr' ? 'si le vendeur nexpédie pas larticle' : 'if the seller does not ship the item'}</li>
                  <li>{language === 'fr' ? 'si le vendeur annule la commande' : 'if the seller cancels the order'}</li>
                  <li>{language === "fr" ? "si l'acheteur annule AVANT expédition" : 'if the buyer cancels BEFORE shipment'}</li>
                  <li>{language === 'fr' ? 'si NaturalHairMarket identifie une fraude' : 'if NaturalHairMarket identifies fraud'}</li>
                </ul>
                <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-4 mt-4">
                  <p className="text-gray-800 font-semibold">
                    {language === 'fr' ? (
                      <>Dans ce cas : ➡️ Le paiement est remboursé à l'acheteur (commission comprise).</>
                    ) : (
                      <>In this case: ➡️ Payment is refunded to the buyer (commission included).</>
                    )}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Gavel className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '8. Réclamations et litiges' : '8. Claims and Disputes'}
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    {language === 'fr' ? (
                      <>
                        L'acheteur doit signaler tout problème directement à NaturalHairMarket, qui prendra contact avec le vendeur.
                        Les utilisateurs ne disposent pas d'un système de messagerie directe.
                      </>
                    ) : (
                      <>
                        The buyer must report any problem directly to NaturalHairMarket, which will contact the seller.
                        Users do not have a direct messaging system.
                      </>
                    )}
                  </p>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 font-semibold mb-2">{language === 'fr' ? 'NaturalHairMarket analyse les éléments fournis et peut, selon la situation :' : 'NaturalHairMarket reviews the information provided and may, depending on the situation:'}</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>{language === 'fr' ? 'rembourser lacheteur' : 'refund the buyer'}</li>
                      <li>{language === 'fr' ? 'libérer les fonds au vendeur' : 'release the funds to the seller'}</li>
                      <li>{language === 'fr' ? 'annuler la transaction' : 'cancel the transaction'}</li>
                      <li>{language === 'fr' ? 'suspendre le compte du vendeur en cas de fraude' : 'suspend the seller account in case of fraud'}</li>
                    </ul>
                  </div>
                  <p className="text-gray-700 italic">
                    {language === 'fr' ? (
                      <>NaturalHairMarket agit comme médiateur interne, mais ne garantit pas la résolution.</>
                    ) : (
                      <>NaturalHairMarket acts as an internal mediator, but does not guarantee resolution.</>
                    )}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">{language === 'fr' ? 'Médiation légale' : 'Legal Mediation'}</h3>
                  <p className="text-gray-700 mb-3">
                    {language === 'fr' ? (
                      <>En cas d'échec de résolution :</>
                    ) : (
                      <>If resolution fails:</>
                    )}
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <p className="font-semibold text-gray-800">{language === 'fr' ? 'AME Conso – médiateur agréé' : 'AME Conso – accredited mediator'}</p>
                    <p className="text-gray-700">www.mediationconso-ame.com</p>
                    <p className="text-gray-700">11 Place Dauphine, 75001 Paris</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-red-600" />
                {language === 'fr' ? '9. Responsabilités' : '9. Liability'}
              </h2>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">9.1 NaturalHairMarket</h3>
                  <p className="text-gray-700 mb-2">{language === "fr" ? "NaturalHairMarket n'est pas responsable :" : 'NaturalHairMarket is not responsible for:'}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'de la qualité des cheveux' : 'the quality of the hair'}</li>
                    <li>{language === "fr" ? "de l'authenticité déclarée par les vendeurs" : 'the authenticity declared by sellers'}</li>
                    <li>{language === 'fr' ? 'des erreurs de description' : 'description errors'}</li>
                    <li>{language === 'fr' ? 'des retards denvoi' : 'shipping delays'}</li>
                    <li>{language === 'fr' ? 'des pertes de colis' : 'lost packages'}</li>
                    <li>{language === 'fr' ? 'des litiges entre utilisateurs' : 'disputes between users'}</li>
                    <li>{language === 'fr' ? 'des fraudes commises par les vendeurs' : 'fraud committed by sellers'}</li>
                    <li>{language === "fr" ? "des dommages résultant de l'utilisation des produits" : 'damage resulting from the use of the products'}</li>
                  </ul>
                  <p className="text-gray-700 mt-3 font-semibold">
                    {language === 'fr' ? (
                      <>NaturalHairMarket n'est responsable que des fautes lui étant directement imputables.</>
                    ) : (
                      <>NaturalHairMarket is only responsible for faults directly attributable to it.</>
                    )}
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{language === 'fr' ? '9.2 Vendeur' : '9.2 Seller'}</h3>
                  <p className="text-gray-700 mb-2">{language === 'fr' ? 'Le vendeur est responsable :' : 'The seller is responsible for:'}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'de la véracité de son annonce' : 'the accuracy of their listing'}</li>
                    <li>{language === "fr" ? "de l'état réel du produit" : 'the actual condition of the product'}</li>
                    <li>{language === 'fr' ? 'de son expédition' : 'its shipment'}</li>
                    <li>{language === 'fr' ? 'de son emballage' : 'its packaging'}</li>
                    <li>{language === 'fr' ? 'de toute fausse déclaration' : 'any false declaration'}</li>
                    <li>{language === 'fr' ? 'des remboursements en cas de fraude ou non-conformité' : 'refunds in case of fraud or non-conformity'}</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{language === 'fr' ? '9.3 Acheteur' : '9.3 Buyer'}</h3>
                  <p className="text-gray-700 mb-2">{language === "fr" ? "L'acheteur est responsable :" : 'The buyer is responsible for:'}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'dutiliser correctement les cheveux' : 'using the hair correctly'}</li>
                    <li>{language === 'fr' ? 'de vérifier létat du produit' : 'checking the condition of the product'}</li>
                    <li>{language === 'fr' ? 'de faire un usage hygiénique' : 'hygienic use'}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Ban className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '10. Interdiction des transactions hors plateforme' : '10. Prohibition of Off-Platform Transactions'}
              </h2>
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  {language === 'fr' ? (
                    <>Il est strictement interdit de conclure une vente en dehors de NaturalHairMarket afin d'éviter la commission ou le paiement sécurisé.</>
                  ) : (
                    <>It is strictly prohibited to complete a sale outside of NaturalHairMarket in order to avoid the commission or secure payment.</>
                  )}
                </p>
                <div className="bg-white rounded-lg p-4 border border-red-300">
                  <p className="text-gray-700 font-semibold mb-2">{language === 'fr' ? 'Toute tentative entraîne :' : 'Any attempt results in:'}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'suppression immédiate du compte' : 'immediate account deletion'}</li>
                    <li>{language === 'fr' ? 'blocage des paiements en cours' : 'blocking of pending payments'}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '11. Données personnelles' : '11. Personal Data'}
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">{language === 'fr' ? 'NaturalHairMarket collecte les données nécessaires :' : 'NaturalHairMarket collects the data necessary for:'}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>{language === 'fr' ? 'au paiement' : 'payment'}</li>
                  <li>{language === 'fr' ? 'à la livraison' : 'delivery'}</li>
                  <li>{language === 'fr' ? 'à la mise en relation' : 'matching buyers and sellers'}</li>
                  <li>{language === 'fr' ? 'à la prévention des fraudes' : 'fraud prevention'}</li>
                </ul>
                <div className="bg-white rounded-lg p-4 border border-emerald-200 mt-4">
                  <p className="text-gray-700 mb-2">
                    <strong>{language === 'fr' ? 'Conformément au RGPD :' : 'In accordance with the GDPR:'}</strong> {language === 'fr' ? (
                      <>vous disposez d'un droit d'accès, rectification, suppression, opposition et portabilité.</>
                    ) : (
                      <>you have the right to access, rectify, delete, object to, and port your data.</>
                    )}
                  </p>
                  <p className="text-gray-700 font-semibold">
                    {language === 'fr' ? 'Demande : naturalhairmarket@gmail.com' : 'Requests: naturalhairmarket@gmail.com'}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{language === 'fr' ? '12. Modification des CGV' : '12. Amendments to the GTCS'}</h2>
              <p className="text-gray-700 leading-relaxed">
                {language === 'fr' ? (
                  <>
                    NaturalHairMarket peut modifier les CGV à tout moment.
                    Les modifications importantes seront notifiées aux utilisateurs.
                  </>
                ) : (
                  <>
                    NaturalHairMarket may amend the GTCS at any time.
                    Significant changes will be notified to users.
                  </>
                )}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{language === 'fr' ? '13. Loi applicable' : '13. Applicable Law'}</h2>
              <p className="text-gray-700 leading-relaxed">
                {language === 'fr' ? (
                  <>
                    Les présentes CGV sont régies par la loi française.
                    Tout litige relève des tribunaux français.
                  </>
                ) : (
                  <>
                    These GTCS are governed by French law.
                    Any dispute falls under the jurisdiction of the French courts.
                  </>
                )}
              </p>
            </section>

            <section className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? 'Contact' : 'Contact'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'fr' ? (
                  <>Pour toute question concernant ces conditions générales de vente, vous pouvez nous contacter :</>
                ) : (
                  <>For any questions regarding these general terms and conditions of sale, you may contact us:</>
                )}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
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
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
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
                {language === 'fr' ? (
                  <>En effectuant un achat sur NaturalHairMarket, vous reconnaissez avoir lu, compris et accepté ces conditions générales de vente.</>
                ) : (
                  <>By making a purchase on NaturalHairMarket, you acknowledge that you have read, understood, and accepted these general terms and conditions of sale.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
