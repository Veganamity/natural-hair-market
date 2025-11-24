import { FileText, Scale, ShoppingCart, CreditCard, AlertCircle, Shield, Ban, Truck, Gavel } from 'lucide-react';

export function SalesTerms() {
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
                Conditions Générales de Vente
              </h1>
              <p className="text-gray-600 mt-1">Dernière mise à jour : 18 novembre 2025</p>
            </div>
          </div>

          <div className="prose prose-emerald max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                1. Objet
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les présentes Conditions Générales de Vente (CGV) encadrent les transactions réalisées via
                  la plateforme NaturalHairMarket, éditée par Stéphanie Buisson.
                </p>
                <div className="bg-white rounded-lg p-4 border border-emerald-200">
                  <p className="text-gray-700 font-semibold mb-2">NaturalHairMarket :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>met en relation vendeurs (salons ou particuliers) et acheteurs</li>
                    <li>assure la mise à disposition d'un système sécurisé de paiement</li>
                    <li>perçoit une commission fixe de 0,99 € payée par l'acheteur pour chaque transaction</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mt-4">
                  <p className="text-gray-800 font-semibold">
                    NaturalHairMarket n'est pas vendeur des produits listés sur la plateforme.
                  </p>
                  <p className="text-gray-700 mt-2">
                    Les vendeurs sont exclusivement responsables des produits qu'ils proposent.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CreditCard className="w-6 h-6 text-emerald-600" />
                2. Commission et frais
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">2.1 Commission NaturalHairMarket</h3>
                  <p className="text-gray-700 mb-3">Pour chaque transaction réussie :</p>
                  <div className="bg-emerald-600 text-white rounded-lg p-4 mb-4">
                    <p className="text-center text-xl font-bold">
                      ➡️ L'acheteur paie une commission de 0,99 € TTC
                    </p>
                  </div>
                  <p className="text-gray-700 mb-2">Cette commission correspond :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>aux frais de gestion du site</li>
                    <li>aux frais techniques (hébergement, maintenance)</li>
                    <li>à la gestion du paiement sécurisé</li>
                    <li>à la rémunération de l'éditeur de la plateforme</li>
                  </ul>
                  <p className="text-gray-700 mt-4 font-semibold">
                    Cette commission est non remboursable, sauf en cas d'annulation totale de la transaction.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">2.2 Prix des produits</h3>
                  <p className="text-gray-700">
                    Les prix sont fixés librement par les vendeurs.
                    NaturalHairMarket ne contrôle pas les prix mais peut supprimer des annonces manifestement
                    frauduleuses ou abusives.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">2.3 Frais d'expédition</h3>
                  <p className="text-gray-700 mb-2">Les frais de livraison :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>sont à la charge de l'acheteur</li>
                    <li>sont déterminés par le vendeur</li>
                    <li>sont affichés avant le paiement</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
                3. Processus de commande
              </h2>
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">3.1 Paiement sécurisé</h3>
                  <p className="text-gray-700 mb-2">
                    Tous les paiements passent par Stripe.
                  </p>
                  <p className="text-gray-700 font-semibold">
                    Aucune donnée bancaire n'est stockée par NaturalHairMarket.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">3.2 Blocage des fonds</h3>
                  <p className="text-gray-700 mb-3">
                    Les fonds versés par l'acheteur sont bloqués jusqu'à :
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-yellow-300">
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>confirmation de réception par l'acheteur</li>
                      <li className="font-semibold">OU expiration du délai automatique de 48 heures après livraison</li>
                    </ul>
                  </div>
                  <p className="text-gray-700 mt-3">
                    Une fois ce délai passé, le paiement est automatiquement libéré au vendeur.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">3.3 Confirmation de réception</h3>
                  <p className="text-gray-700">
                    L'acheteur doit confirmer la réception depuis son espace "Commandes".
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                4. Obligations du vendeur
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">Le vendeur s'engage à :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>vendre uniquement des cheveux 100 % humains</li>
                  <li>expédier le produit dans un délai de 3 jours ouvrables</li>
                  <li>décrire honnêtement l'article</li>
                  <li>indiquer si les cheveux sont traités chimiquement</li>
                  <li>fournir des photos fidèles</li>
                  <li>expédier un produit propre, sain, non dangereux</li>
                  <li>respecter les obligations fiscales applicables à son statut</li>
                </ul>
                <div className="bg-white border-2 border-red-400 rounded-lg p-4 mt-4">
                  <p className="text-red-700 font-bold mb-2">⚠️ Toute fausse déclaration expose le vendeur à :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>suppression définitive du compte</li>
                    <li>remboursement total exigé à l'acheteur</li>
                    <li>signalement aux autorités si fraude avérée</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
                5. Obligations de l'acheteur
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">L'acheteur s'engage à :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>utiliser un moyen de paiement valide</li>
                  <li>fournir une adresse correcte</li>
                  <li>vérifier l'article dès réception</li>
                  <li>signaler tout problème dans un délai de 24 heures</li>
                </ul>
                <p className="text-gray-700 mt-4 font-semibold">
                  Si aucune réclamation n'est faite dans ce délai, la vente est considérée comme conforme.
                </p>
                <div className="bg-white border border-blue-300 rounded-lg p-4 mt-4">
                  <p className="text-gray-800 font-semibold mb-2">Communication en cas de problème :</p>
                  <p className="text-gray-700">
                    En cas de problème lié à la conformité du produit, l'acheteur doit contacter NaturalHairMarket
                    et non le vendeur directement.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-emerald-600" />
                6. Produits concernés – Exclusion du droit de rétractation
              </h2>
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  Conformément à l'article L221-28 du Code de la consommation :
                </p>
                <div className="bg-white border border-yellow-400 rounded-lg p-4">
                  <p className="text-gray-800 font-bold text-lg mb-3">
                    ➡️ Les cheveux humains coupés sont des biens d'hygiène ne pouvant être retournés pour raisons sanitaires.
                  </p>
                  <p className="text-gray-700 mb-2">Par conséquent :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>aucun retour n'est possible après ouverture du colis</li>
                    <li>aucun droit de rétractation de 14 jours ne s'applique</li>
                  </ul>
                </div>
                <p className="text-gray-700 mt-3">
                  Le vendeur peut néanmoins proposer un remboursement volontaire.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Ban className="w-6 h-6 text-emerald-600" />
                7. Annulation d'une transaction
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">Une commande peut être annulée uniquement :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>si le vendeur n'expédie pas l'article</li>
                  <li>si le vendeur annule la commande</li>
                  <li>si l'acheteur annule AVANT expédition</li>
                  <li>si NaturalHairMarket identifie une fraude</li>
                </ul>
                <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-4 mt-4">
                  <p className="text-gray-800 font-semibold">
                    Dans ce cas :
                    ➡️ Le paiement est remboursé à l'acheteur (commission comprise).
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Gavel className="w-6 h-6 text-emerald-600" />
                8. Réclamations et litiges
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    L'acheteur doit signaler tout problème directement à NaturalHairMarket, qui prendra contact avec le vendeur.
                    Les utilisateurs ne disposent pas d'un système de messagerie directe.
                  </p>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 font-semibold mb-2">NaturalHairMarket analyse les éléments fournis et peut, selon la situation :</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>rembourser l'acheteur</li>
                      <li>libérer les fonds au vendeur</li>
                      <li>annuler la transaction</li>
                      <li>suspendre le compte du vendeur en cas de fraude</li>
                    </ul>
                  </div>
                  <p className="text-gray-700 italic">
                    NaturalHairMarket agit comme médiateur interne, mais ne garantit pas la résolution.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Médiation légale</h3>
                  <p className="text-gray-700 mb-3">
                    En cas d'échec de résolution :
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <p className="font-semibold text-gray-800">AME Conso – médiateur agréé</p>
                    <p className="text-gray-700">www.mediationconso-ame.com</p>
                    <p className="text-gray-700">11 Place Dauphine, 75001 Paris</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-red-600" />
                9. Responsabilités
              </h2>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">9.1 NaturalHairMarket</h3>
                  <p className="text-gray-700 mb-2">NaturalHairMarket n'est pas responsable :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>de la qualité des cheveux</li>
                    <li>de l'authenticité déclarée par les vendeurs</li>
                    <li>des erreurs de description</li>
                    <li>des retards d'envoi</li>
                    <li>des pertes de colis</li>
                    <li>des litiges entre utilisateurs</li>
                    <li>des fraudes commises par les vendeurs</li>
                    <li>des dommages résultant de l'utilisation des produits</li>
                  </ul>
                  <p className="text-gray-700 mt-3 font-semibold">
                    NaturalHairMarket n'est responsable que des fautes lui étant directement imputables.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">9.2 Vendeur</h3>
                  <p className="text-gray-700 mb-2">Le vendeur est responsable :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>de la véracité de son annonce</li>
                    <li>de l'état réel du produit</li>
                    <li>de son expédition</li>
                    <li>de son emballage</li>
                    <li>de toute fausse déclaration</li>
                    <li>des remboursements en cas de fraude ou non-conformité</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">9.3 Acheteur</h3>
                  <p className="text-gray-700 mb-2">L'acheteur est responsable :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>d'utiliser correctement les cheveux</li>
                    <li>de vérifier l'état du produit</li>
                    <li>de faire un usage hygiénique</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Ban className="w-6 h-6 text-emerald-600" />
                10. Interdiction des transactions hors plateforme
              </h2>
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  Il est strictement interdit de conclure une vente en dehors de NaturalHairMarket afin d'éviter
                  la commission ou le paiement sécurisé.
                </p>
                <div className="bg-white rounded-lg p-4 border border-red-300">
                  <p className="text-gray-700 font-semibold mb-2">Toute tentative entraîne :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>suppression immédiate du compte</li>
                    <li>blocage des paiements en cours</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                11. Données personnelles
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">NaturalHairMarket collecte les données nécessaires :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>au paiement</li>
                  <li>à la livraison</li>
                  <li>à la mise en relation</li>
                  <li>à la prévention des fraudes</li>
                </ul>
                <div className="bg-white rounded-lg p-4 border border-emerald-200 mt-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Conformément au RGPD :</strong> vous disposez d'un droit d'accès, rectification,
                    suppression, opposition et portabilité.
                  </p>
                  <p className="text-gray-700 font-semibold">
                    Demande : naturalhairmarket@gmail.com
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Modification des CGV</h2>
              <p className="text-gray-700 leading-relaxed">
                NaturalHairMarket peut modifier les CGV à tout moment.
                Les modifications importantes seront notifiées aux utilisateurs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">13. Loi applicable</h2>
              <p className="text-gray-700 leading-relaxed">
                Les présentes CGV sont régies par la loi française.
                Tout litige relève des tribunaux français.
              </p>
            </section>

            <section className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                Contact
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pour toute question concernant ces conditions générales de vente, vous pouvez nous contacter :
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
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
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
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
                En effectuant un achat sur NaturalHairMarket, vous reconnaissez avoir lu, compris et accepté ces conditions générales de vente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
