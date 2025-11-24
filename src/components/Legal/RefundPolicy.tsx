import { FileText, Scale, AlertCircle, Shield, CheckCircle, XCircle, Clock, Mail, Phone } from 'lucide-react';

export function RefundPolicy() {
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
                Politique de Remboursement
              </h1>
              <p className="text-gray-600 mt-1">Dernière mise à jour : 18 novembre 2025</p>
            </div>
          </div>

          <div className="prose prose-emerald max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                1. Objet de la politique de remboursement
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  La présente politique encadre les conditions de remboursement applicables aux transactions
                  réalisées via la plateforme NaturalHairMarket.
                </p>
                <div className="bg-white rounded-lg p-4 border border-emerald-200">
                  <p className="text-gray-700 mb-2">
                    NaturalHairMarket est une plateforme d'intermédiation, permettant la mise en relation
                    entre vendeurs et acheteurs.
                  </p>
                  <p className="text-gray-800 font-semibold">
                    ➡️ NaturalHairMarket n'est pas vendeur des produits et ne les détient pas physiquement.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-4">
                  <p className="text-gray-700 mb-2 font-semibold">Cette politique respecte :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>le Code de la consommation</li>
                    <li>le Code civil</li>
                    <li>la Directive européenne 2011/83/UE</li>
                    <li>l'article L221-28 sur les exceptions au droit de rétractation</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                2. Absence de droit de rétractation – Produits d'hygiène
              </h2>
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  Conformément à l'article L221-28, 5° du Code de la consommation :
                </p>
                <div className="bg-white border border-red-300 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 italic">
                    Les biens d'hygiène personnalisés ne peuvent être retournés lorsqu'ils ont été ouverts
                    ou manipulés par le consommateur.
                  </p>
                  <p className="text-gray-800 font-semibold mt-2">
                    Les cheveux humains coupés constituent un produit d'hygiène.
                  </p>
                </div>
                <div className="bg-red-100 rounded-lg p-4 border border-red-300">
                  <p className="text-gray-700 font-semibold mb-2">Par conséquent :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Aucun droit de rétractation de 14 jours ne s'applique.</li>
                    <li>Aucun retour n'est possible, surtout après ouverture du paquet.</li>
                    <li>Les vendeurs ne sont pas tenus d'accepter les retours pour simple changement d'avis.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                3. Cas où un remboursement est possible
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Un remboursement peut être accordé uniquement dans les situations suivantes :
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">3.1 Le vendeur n'a pas expédié la commande</h3>
                  <p className="text-gray-700 mb-2">
                    Si le vendeur n'expédie pas le produit dans les 3 jours ouvrables, la commande peut être annulée.
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-blue-200 mt-3">
                    <p className="text-gray-800 font-semibold">
                      ➡️ L'acheteur est remboursé intégralement (produit + livraison + commission de 0,99 €).
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">3.2 Le produit n'a jamais été reçu</h3>
                  <p className="text-gray-700 mb-3">
                    Si le colis est perdu ou non livré, l'acheteur peut demander un remboursement.
                  </p>
                  <p className="text-gray-700 mb-2">Le vendeur doit fournir :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mb-3">
                    <li>une preuve d'expédition</li>
                    <li>un numéro de suivi valide</li>
                  </ul>
                  <p className="text-gray-800 font-semibold">
                    Sans preuve → remboursement automatique à l'acheteur.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">3.3 Le produit n'est pas conforme à la description</h3>
                  <p className="text-gray-700 mb-2">Exemples :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mb-3">
                    <li>cheveux synthétiques vendus comme naturels</li>
                    <li>couleur très différente</li>
                    <li>longueur non conforme</li>
                    <li>cheveux abîmés, sales, avec odeur ou parasites</li>
                    <li>cheveux chimiquement traités alors que l'annonce disait "non traités"</li>
                  </ul>
                  <div className="bg-white rounded-lg p-3 border border-red-200">
                    <p className="text-gray-800 font-semibold">
                      ➡️ Dans ces cas, le vendeur est tenu d'accepter le remboursement.
                    </p>
                    <p className="text-gray-700 mt-2">
                      NaturalHairMarket peut suspendre les fonds jusqu'à résolution.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                4. Procédure de demande de remboursement
              </h2>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  Comme NaturalHairMarket ne propose pas de messagerie interne, toute demande de remboursement
                  doit être envoyée directement à :
                </p>
                <div className="bg-white rounded-lg p-4 border-2 border-emerald-400 mb-4">
                  <p className="text-emerald-600 font-semibold text-lg text-center">📧 naturalhairmarket@gmail.com</p>
                </div>
                <p className="text-gray-700 mb-4">
                  L'acheteur doit contacter NaturalHairMarket dans les 24 heures suivant la réception, sans confirmer
                  la réception du produit, et fournir des photos de l'article reçu.
                </p>
                <p className="text-gray-700 mb-4">
                  NaturalHairMarket contacte ensuite le vendeur et agit comme unique médiateur entre les deux parties.
                </p>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-5 border-l-4 border-emerald-600 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      Étape 1 — Déclaration du problème (dans les 24h)
                    </h3>
                    <p className="text-gray-700 mb-2">L'acheteur doit :</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>NE PAS confirmer la réception</li>
                      <li>envoyer une demande à naturalhairmarket@gmail.com</li>
                      <li>fournir des photos et une explication claire</li>
                      <li>envoyer la demande dans les 24 heures suivant la réception du colis</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-5 border-l-4 border-blue-600 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      Étape 2 — Analyse du dossier par NaturalHairMarket
                    </h3>
                    <p className="text-gray-700 mb-2">Notre équipe vérifie :</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 mb-3">
                      <li>la description de l'annonce</li>
                      <li>les photos fournies</li>
                      <li>les preuves d'expédition du vendeur</li>
                      <li>la conformité réelle du produit reçu</li>
                    </ul>
                    <p className="text-gray-700 italic">
                      NaturalHairMarket contacte le vendeur directement (pas de contact direct vendeur/acheteur).
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-5 border-l-4 border-teal-600 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      Étape 3 — Décision
                    </h3>
                    <p className="text-gray-700 mb-2">Selon la situation, NaturalHairMarket peut :</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>annuler la vente</li>
                      <li>rembourser l'acheteur</li>
                      <li>libérer les fonds au vendeur</li>
                      <li>suspendre le compte du vendeur en cas de fraude avérée</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                5. Remboursements approuvés
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">Un remboursement est approuvé lorsque :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>le vendeur n'a pas expédié</li>
                  <li>le colis est perdu et non traçable</li>
                  <li>le produit reçu n'est pas conforme</li>
                  <li>les cheveux sont synthétiques alors que l'annonce disait "naturels"</li>
                  <li>le vendeur ne répond pas</li>
                  <li>le vendeur fournit de fausses informations</li>
                </ul>
                <div className="bg-white rounded-lg p-4 border border-emerald-300">
                  <p className="text-gray-700 mb-2 font-semibold">Dans ce cas, le remboursement comprend :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>prix des cheveux</li>
                    <li>frais de livraison</li>
                    <li>commission de 0,99 €</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                6. Cas où les remboursements sont refusés
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">Aucun remboursement ne sera accordé si :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>l'acheteur a ouvert ou manipulé les cheveux</li>
                  <li>l'acheteur signale un problème après 24 heures</li>
                  <li>le produit est conforme à l'annonce</li>
                  <li>l'acheteur change d'avis</li>
                  <li>l'acheteur fournit des preuves insuffisantes</li>
                  <li>le vendeur a expédié un produit conforme</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-emerald-600" />
                7. Délais de remboursement
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">Après approbation :</p>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-gray-800 font-semibold mb-2">
                    ➡️ Le remboursement est effectué sous 3 à 5 jours ouvrables via Stripe.
                  </p>
                  <p className="text-gray-700">
                    ➡️ Le délai bancaire peut varier selon l'établissement de l'acheteur.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                8. Médiation légale
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  Si le litige persiste malgré notre intervention :
                </p>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 mb-2 font-semibold">
                    📌 Le consommateur peut saisir gratuitement un médiateur de la consommation :
                  </p>
                  <p className="font-semibold text-gray-800">AME Conso – Association Médiation Consommation</p>
                  <p className="text-gray-700">Site : www.mediationconso-ame.com</p>
                  <p className="text-gray-700">Adresse : 11 Place Dauphine, 75001 Paris</p>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-emerald-600" />
                9. Contact
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pour toute demande de remboursement :
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email</p>
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
                    <p className="text-sm text-gray-600 font-medium">Téléphone</p>
                    <a href="tel:0972216948" className="text-emerald-600 font-semibold hover:underline">
                      09 72 21 69 48
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <div className="bg-emerald-600 text-white rounded-lg p-6 mt-8">
              <p className="text-center font-semibold">
                Cette politique de remboursement est établie pour protéger à la fois les acheteurs et les vendeurs,
                tout en respectant la législation française en vigueur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
