import { useEffect } from 'react';
import { FileText, Scale, Shield, CheckCircle, XCircle, Clock, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function RefundPolicy() {
  const { language } = useLanguage();

  useEffect(() => {
    const prevTitle = document.title;
    const m = document.getElementById('meta-description') as HTMLMetaElement | null;
    const prevDesc = m?.content ?? '';
    document.title = language === 'fr' ? 'Politique de Remboursement | Natural Hair Market' : 'Refund Policy | Natural Hair Market';
    if (m) m.content = language === 'fr'
      ? 'Politique de remboursement de Natural Hair Market : conditions, délais et procédures pour obtenir le remboursement de votre achat de cheveux naturels.'
      : 'Natural Hair Market Refund Policy: conditions, timeframes, and procedures for obtaining a refund for your natural hair purchase.';
    return () => { document.title = prevTitle; if (m) m.content = prevDesc; };
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                {language === 'fr' ? 'Politique de Remboursement' : 'Refund Policy'}
              </h1>
              <p className="text-gray-600 mt-1">{language === 'fr' ? 'Dernière mise à jour : 18 novembre 2025' : 'Last updated: November 18, 2025'}</p>
            </div>
          </div>

          <div className="prose prose-emerald max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '1. Objet de la politique de remboursement' : '1. Purpose of the Refund Policy'}
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {language === 'fr' ? (
                    <>
                      La présente politique encadre les conditions de remboursement applicables aux transactions
                      réalisées via la plateforme NaturalHairMarket.
                    </>
                  ) : (
                    <>
                      This policy governs the refund conditions applicable to transactions
                      carried out via the NaturalHairMarket platform.
                    </>
                  )}
                </p>
                <div className="bg-white rounded-lg p-4 border border-emerald-200">
                  <p className="text-gray-700 mb-2">
                    {language === 'fr' ? (
                      <>
                        NaturalHairMarket est une plateforme d'intermédiation, permettant la mise en relation
                        entre vendeurs et acheteurs.
                      </>
                    ) : (
                      <>
                        NaturalHairMarket is an intermediation platform that connects
                        sellers and buyers.
                      </>
                    )}
                  </p>
                  <p className="text-gray-800 font-semibold">
                    {language === 'fr' ? (
                      <>➡️ NaturalHairMarket n'est pas vendeur des produits et ne les détient pas physiquement.</>
                    ) : (
                      <>➡️ NaturalHairMarket is not the seller of the products and does not physically hold them.</>
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-4">
                  <p className="text-gray-700 mb-2 font-semibold">{language === 'fr' ? 'Cette politique respecte :' : 'This policy complies with:'}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'le Code de la consommation' : 'the French Consumer Code'}</li>
                    <li>{language === 'fr' ? 'le Code civil' : 'the French Civil Code'}</li>
                    <li>{language === 'fr' ? 'la Directive européenne 2011/83/UE' : 'European Directive 2011/83/EU'}</li>
                    <li>{language === "fr" ? "l'article L221-28 sur les exceptions au droit de rétractation" : 'Article L221-28 on exceptions to the right of withdrawal'}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                {language === "fr" ? "2. Absence de droit de rétractation – Produits d'hygiène" : '2. Absence of Right of Withdrawal – Hygiene Products'}
              </h2>
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  {language === 'fr' ? (
                    <>Conformément à l'article L221-28, 5° du Code de la consommation :</>
                  ) : (
                    <>In accordance with Article L221-28, 5° of the French Consumer Code:</>
                  )}
                </p>
                <div className="bg-white border border-red-300 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 italic">
                    {language === 'fr' ? (
                      <>
                        Les biens d'hygiène personnalisés ne peuvent être retournés lorsqu'ils ont été ouverts
                        ou manipulés par le consommateur.
                      </>
                    ) : (
                      <>
                        Personalized hygiene goods cannot be returned once they have been opened
                        or handled by the consumer.
                      </>
                    )}
                  </p>
                  <p className="text-gray-800 font-semibold mt-2">
                    {language === 'fr' ? (
                      <>Les cheveux humains coupés constituent un produit d'hygiène.</>
                    ) : (
                      <>Cut human hair constitutes a hygiene product.</>
                    )}
                  </p>
                </div>
                <div className="bg-red-100 rounded-lg p-4 border border-red-300">
                  <p className="text-gray-700 font-semibold mb-2">{language === 'fr' ? 'Par conséquent :' : 'Consequently:'}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === "fr" ? "Aucun droit de rétractation de 14 jours ne s'applique." : 'No 14-day right of withdrawal applies.'}</li>
                    <li>{language === "fr" ? "Aucun retour n'est possible, surtout après ouverture du paquet." : 'No return is possible, especially after opening the package.'}</li>
                    <li>{language === "fr" ? "Les vendeurs ne sont pas tenus d'accepter les retours pour simple changement d'avis." : 'Sellers are not required to accept returns for a simple change of mind.'}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '3. Cas où un remboursement est possible' : '3. Cases Where a Refund Is Possible'}
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  {language === 'fr' ? (
                    <>Un remboursement peut être accordé uniquement dans les situations suivantes :</>
                  ) : (
                    <>A refund may be granted only in the following situations:</>
                  )}
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{language === "fr" ? "3.1 Le vendeur n'a pas expédié la commande" : '3.1 The Seller Has Not Shipped the Order'}</h3>
                  <p className="text-gray-700 mb-2">
                    {language === 'fr' ? (
                      <>Si le vendeur n'expédie pas le produit dans les 3 jours ouvrables, la commande peut être annulée.</>
                    ) : (
                      <>If the seller does not ship the product within 3 business days, the order may be cancelled.</>
                    )}
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-blue-200 mt-3">
                    <p className="text-gray-800 font-semibold">
                      {language === 'fr' ? (
                        <>➡️ L'acheteur est remboursé intégralement (produit + livraison + commission de 10%).</>
                      ) : (
                        <>➡️ The buyer is fully refunded (product + shipping + 10% commission).</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{language === "fr" ? "3.2 Le produit n'a jamais été reçu" : '3.2 The Product Was Never Received'}</h3>
                  <p className="text-gray-700 mb-3">
                    {language === 'fr' ? (
                      <>Si le colis est perdu ou non livré, l'acheteur peut demander un remboursement.</>
                    ) : (
                      <>If the package is lost or not delivered, the buyer may request a refund.</>
                    )}
                  </p>
                  <p className="text-gray-700 mb-2">{language === 'fr' ? 'Le vendeur doit fournir :' : 'The seller must provide:'}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mb-3">
                    <li>{language === 'fr' ? 'une preuve dexpédition' : 'proof of shipment'}</li>
                    <li>{language === 'fr' ? 'un numéro de suivi valide' : 'a valid tracking number'}</li>
                  </ul>
                  <p className="text-gray-800 font-semibold">
                    {language === 'fr' ? (
                      <>Sans preuve → remboursement automatique à l'acheteur.</>
                    ) : (
                      <>Without proof → automatic refund to the buyer.</>
                    )}
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{language === "fr" ? "3.3 Le produit n'est pas conforme à la description" : '3.3 The Product Does Not Match the Description'}</h3>
                  <p className="text-gray-700 mb-2">{language === 'fr' ? 'Exemples :' : 'Examples:'}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mb-3">
                    <li>{language === 'fr' ? 'cheveux synthétiques vendus comme naturels' : 'synthetic hair sold as natural'}</li>
                    <li>{language === 'fr' ? 'couleur très différente' : 'significantly different color'}</li>
                    <li>{language === 'fr' ? 'longueur non conforme' : 'non-conforming length'}</li>
                    <li>{language === 'fr' ? 'cheveux abîmés, sales, avec odeur ou parasites' : 'damaged, dirty hair, with odor or parasites'}</li>
                    <li>{language === 'fr' ? 'cheveux chimiquement traités alors que lannonce disait "non traités"' : 'chemically treated hair when the listing stated "untreated"'}</li>
                  </ul>
                  <div className="bg-white rounded-lg p-3 border border-red-200">
                    <p className="text-gray-800 font-semibold">
                      {language === 'fr' ? (
                        <>➡️ Dans ces cas, le vendeur est tenu d'accepter le remboursement.</>
                      ) : (
                        <>➡️ In these cases, the seller is required to accept the refund.</>
                      )}
                    </p>
                    <p className="text-gray-700 mt-2">
                      {language === 'fr' ? (
                        <>NaturalHairMarket peut suspendre les fonds jusqu'à résolution.</>
                      ) : (
                        <>NaturalHairMarket may hold the funds until resolution.</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '4. Procédure de demande de remboursement' : '4. Refund Request Procedure'}
              </h2>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  {language === 'fr' ? (
                    <>
                      Comme NaturalHairMarket ne propose pas de messagerie interne, toute demande de remboursement
                      doit être envoyée directement à :
                    </>
                  ) : (
                    <>
                      Since NaturalHairMarket does not offer an internal messaging system, any refund request
                      must be sent directly to:
                    </>
                  )}
                </p>
                <div className="bg-white rounded-lg p-4 border-2 border-emerald-400 mb-4">
                  <p className="text-emerald-600 font-semibold text-lg text-center">📧 naturalhairmarket@gmail.com</p>
                </div>
                <p className="text-gray-700 mb-4">
                  {language === 'fr' ? (
                    <>
                      L'acheteur doit contacter NaturalHairMarket dans les 24 heures suivant la réception, sans confirmer
                      la réception du produit, et fournir des photos de l'article reçu.
                    </>
                  ) : (
                    <>
                      The buyer must contact NaturalHairMarket within 24 hours of receipt, without confirming
                      receipt of the product, and provide photos of the received item.
                    </>
                  )}
                </p>
                <p className="text-gray-700 mb-4">
                  {language === 'fr' ? (
                    <>
                      NaturalHairMarket contacte ensuite le vendeur et agit comme unique médiateur entre les deux parties.
                    </>
                  ) : (
                    <>
                      NaturalHairMarket then contacts the seller and acts as the sole mediator between the two parties.
                    </>
                  )}
                </p>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-5 border-l-4 border-emerald-600 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      {language === 'fr' ? 'Étape 1 — Déclaration du problème (dans les 24h)' : 'Step 1 — Report the Problem (within 24 hours)'}
                    </h3>
                    <p className="text-gray-700 mb-2">{language === "fr" ? "L'acheteur doit :" : 'The buyer must:'}</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>{language === 'fr' ? 'NE PAS confirmer la réception' : 'NOT confirm receipt'}</li>
                      <li>{language === 'fr' ? 'envoyer une demande à naturalhairmarket@gmail.com' : 'send a request to naturalhairmarket@gmail.com'}</li>
                      <li>{language === 'fr' ? 'fournir des photos et une explication claire' : 'provide photos and a clear explanation'}</li>
                      <li>{language === 'fr' ? 'envoyer la demande dans les 24 heures suivant la réception du colis' : 'send the request within 24 hours of receiving the package'}</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 border-l-4 border-blue-600 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      {language === 'fr' ? 'Étape 2 — Analyse du dossier par NaturalHairMarket' : 'Step 2 — Case Review by NaturalHairMarket'}
                    </h3>
                    <p className="text-gray-700 mb-2">{language === 'fr' ? 'Notre équipe vérifie :' : 'Our team verifies:'}</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 mb-3">
                      <li>{language === 'fr' ? 'la description de lannonce' : 'the listing description'}</li>
                      <li>{language === 'fr' ? 'les photos fournies' : 'the photos provided'}</li>
                      <li>{language === 'fr' ? 'les preuves dexpédition du vendeur' : 'the seller proof of shipment'}</li>
                      <li>{language === 'fr' ? 'la conformité réelle du produit reçu' : 'the actual conformity of the received product'}</li>
                    </ul>
                    <p className="text-gray-700 italic">
                      {language === 'fr' ? (
                        <>NaturalHairMarket contacte le vendeur directement (pas de contact direct vendeur/acheteur).</>
                      ) : (
                        <>NaturalHairMarket contacts the seller directly (no direct seller/buyer contact).</>
                      )}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-5 border-l-4 border-teal-600 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      {language === 'fr' ? 'Étape 3 — Décision' : 'Step 3 — Decision'}
                    </h3>
                    <p className="text-gray-700 mb-2">{language === 'fr' ? 'Selon la situation, NaturalHairMarket peut :' : 'Depending on the situation, NaturalHairMarket may:'}</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>{language === 'fr' ? 'annuler la vente' : 'cancel the sale'}</li>
                      <li>{language === 'fr' ? 'rembourser lacheteur' : 'refund the buyer'}</li>
                      <li>{language === 'fr' ? 'libérer les fonds au vendeur' : 'release the funds to the seller'}</li>
                      <li>{language === 'fr' ? 'suspendre le compte du vendeur en cas de fraude avérée' : 'suspend the seller account in case of confirmed fraud'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '5. Remboursements approuvés' : '5. Approved Refunds'}
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">{language === 'fr' ? 'Un remboursement est approuvé lorsque :' : 'A refund is approved when:'}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>{language === 'fr' ? 'le vendeur na pas expédié' : 'the seller has not shipped'}</li>
                  <li>{language === 'fr' ? 'le colis est perdu et non traçable' : 'the package is lost and untraceable'}</li>
                  <li>{language === 'fr' ? 'le produit reçu nest pas conforme' : 'the received product does not conform'}</li>
                  <li>{language === 'fr' ? 'les cheveux sont synthétiques alors que lannonce disait "naturels"' : 'the hair is synthetic when the listing stated "natural"'}</li>
                  <li>{language === 'fr' ? 'le vendeur ne répond pas' : 'the seller does not respond'}</li>
                  <li>{language === 'fr' ? 'le vendeur fournit de fausses informations' : 'the seller provides false information'}</li>
                </ul>
                <div className="bg-white rounded-lg p-4 border border-emerald-300">
                  <p className="text-gray-700 mb-2 font-semibold">{language === 'fr' ? 'Dans ce cas, le remboursement comprend :' : 'In this case, the refund includes:'}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'prix des cheveux' : 'hair price'}</li>
                    <li>{language === 'fr' ? 'frais de livraison' : 'shipping fees'}</li>
                    <li>{language === 'fr' ? 'commission de 10%' : '10% commission'}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                {language === 'fr' ? '6. Cas où les remboursements sont refusés' : '6. Cases Where Refunds Are Denied'}
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">{language === 'fr' ? 'Aucun remboursement ne sera accordé si :' : 'No refund will be granted if:'}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>{language === "fr" ? "l'acheteur a ouvert ou manipulé les cheveux" : 'the buyer has opened or handled the hair'}</li>
                  <li>{language === "fr" ? "l'acheteur signale un problème après 24 heures" : 'the buyer reports a problem after 24 hours'}</li>
                  <li>{language === 'fr' ? 'le produit est conforme à lannonce' : 'the product matches the listing'}</li>
                  <li>{language === "fr" ? "l'acheteur change d'avis" : 'the buyer changes their mind'}</li>
                  <li>{language === "fr" ? "l'acheteur fournit des preuves insuffisantes" : 'the buyer provides insufficient evidence'}</li>
                  <li>{language === 'fr' ? 'le vendeur a expédié un produit conforme' : 'the seller shipped a conforming product'}</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '7. Délais de remboursement' : '7. Refund Timeframes'}
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">{language === 'fr' ? 'Après approbation :' : 'After approval:'}</p>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-gray-800 font-semibold mb-2">
                    {language === 'fr' ? (
                      <>➡️ Le remboursement est effectué sous 3 à 5 jours ouvrables via Stripe.</>
                    ) : (
                      <>➡️ The refund is processed within 3 to 5 business days via Stripe.</>
                    )}
                  </p>
                  <p className="text-gray-700">
                    {language === 'fr' ? (
                      <>➡️ Le délai bancaire peut varier selon l'établissement de l'acheteur.</>
                    ) : (
                      <>➡️ The bank processing time may vary depending on the buyer bank.</>
                    )}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '8. Médiation légale' : '8. Legal Mediation'}
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  {language === 'fr' ? (
                    <>Si le litige persiste malgré notre intervention :</>
                  ) : (
                    <>If the dispute persists despite our intervention:</>
                  )}
                </p>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 mb-2 font-semibold">
                    {language === 'fr' ? (
                      <>📌 Le consommateur peut saisir gratuitement un médiateur de la consommation :</>
                    ) : (
                      <>📌 The consumer may refer the matter free of charge to a consumer mediator:</>
                    )}
                  </p>
                  <p className="font-semibold text-gray-800">AME Conso – Association Médiation Consommation</p>
                  <p className="text-gray-700">{language === 'fr' ? 'Site : www.mediationconso-ame.com' : 'Website: www.mediationconso-ame.com'}</p>
                  <p className="text-gray-700">{language === 'fr' ? 'Adresse : 11 Place Dauphine, 75001 Paris' : 'Address: 11 Place Dauphine, 75001 Paris'}</p>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '9. Contact' : '9. Contact'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'fr' ? (
                  <>Pour toute demande de remboursement :</>
                ) : (
                  <>For any refund request:</>
                )}
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
                {language === 'fr' ? (
                  <>
                    Cette politique de remboursement est établie pour protéger à la fois les acheteurs et les vendeurs,
                    tout en respectant la législation française en vigueur.
                  </>
                ) : (
                  <>
                    This refund policy is established to protect both buyers and sellers,
                    while complying with applicable French legislation.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
