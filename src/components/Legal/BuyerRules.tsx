import { ShoppingBag, CheckCircle, XCircle, AlertTriangle, Shield, CreditCard, Package, FileText, Ban, Eye, Scale, Mail, Phone } from 'lucide-react';

export function BuyerRules() {
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
                Règlement acheteur
              </h1>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-6 mb-8">
            <p className="text-gray-700 leading-relaxed mb-3">
              En utilisant NaturalHairMarket pour acheter des cheveux humains, vous acceptez pleinement le présent
              règlement ainsi que les CGU, CGV et la Politique de remboursement de la plateforme.
            </p>
            <div className="bg-white border border-teal-300 rounded-lg p-4">
              <p className="text-gray-800 font-semibold">
                NaturalHairMarket est une plateforme d'intermédiation :
              </p>
              <p className="text-gray-700 mt-1">
                nous ne sommes pas vendeurs et ne détenons pas physiquement les produits.
              </p>
            </div>
          </div>

          <div className="prose prose-teal max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <ShoppingBag className="w-6 h-6 text-teal-600" />
                1. Conditions pour acheter
              </h2>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">Pour effectuer un achat, vous devez :</p>
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">avoir au moins 18 ans</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">disposer d'un compte utilisateur valide</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">fournir des informations exactes</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">utiliser un moyen de paiement valide</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">accepter nos CGU / CGV</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Eye className="w-6 h-6 text-teal-600" />
                2. Informations avant achat
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">Avant d'acheter, l'acheteur doit :</p>
                <div className="space-y-2 mb-4">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">lire la description complète de l'annonce</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">vérifier la longueur, texture et couleur indiquées</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">vérifier si les cheveux ont été traités (coloration, décoloration, lissage)</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">vérifier le prix, les frais d'expédition et les conditions</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">s'assurer que le produit correspond à ses attentes</span>
                  </div>
                </div>
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <p className="text-gray-800 font-semibold">
                    Une commande passée implique que l'acheteur a compris et accepté les caractéristiques du produit.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                3. Droit de rétractation (non applicable)
              </h2>
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">
                  Les cheveux humains coupés sont des produits d'hygiène personnelle.
                </p>
                <p className="text-gray-700 mb-3">
                  Conformément à l'article L221-28 du Code de la consommation :
                </p>
                <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-4 space-y-2">
                  <p className="text-red-700 font-semibold flex items-center gap-2">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    Aucun droit de rétractation de 14 jours ne s'applique
                  </p>
                  <p className="text-red-700 font-semibold flex items-center gap-2">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    Aucun retour n'est possible après ouverture
                  </p>
                  <p className="text-red-700 font-semibold flex items-center gap-2">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    Les retours pour "changement d'avis" sont interdits
                  </p>
                </div>
                <div className="bg-white border border-yellow-400 rounded-lg p-4">
                  <p className="text-gray-700 mb-2 font-semibold">Les seuls remboursements possibles sont liés :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>à la non-expédition</li>
                    <li>à une perte de colis</li>
                    <li>à une non-conformité avérée</li>
                    <li>à une fraude du vendeur</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CreditCard className="w-6 h-6 text-emerald-600" />
                4. Paiement et sécurité
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  Les paiements sont effectués par <strong>Stripe</strong>, un prestataire sécurisé.
                </p>
                <p className="text-gray-700 mb-4">
                  NaturalHairMarket ne stocke aucune donnée bancaire.
                </p>
                <div className="bg-white border border-emerald-200 rounded-lg p-4">
                  <p className="text-gray-700 mb-2 font-semibold">Les fonds restent bloqués jusqu'à :</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      confirmation de réception par l'acheteur
                    </div>
                    <p className="text-center font-semibold text-gray-600">OU</p>
                    <div className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      délai automatique de 48 heures après livraison
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Package className="w-6 h-6 text-teal-600" />
                5. Réception du produit
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">À réception du colis, l'acheteur doit :</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    vérifier l'état du paquet
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    ouvrir et inspecter les cheveux
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    comparer avec la description de l'annonce
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    s'assurer de la conformité
                  </div>
                </div>
                <div className="bg-red-50 border-2 border-red-400 rounded-lg p-5 mb-4">
                  <p className="text-red-800 font-bold mb-3">En cas de problème, l'acheteur doit impérativement respecter les délais :</p>
                  <div className="space-y-2">
                    <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-red-700 font-semibold">➡️ SIGNALER LE PROBLÈME DANS LES 24 HEURES</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-red-700 font-semibold">➡️ NE PAS confirmer la réception</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-red-700 font-semibold">➡️ contacter naturalhairmarket@gmail.com en envoyant des photos</span>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                  <p className="text-gray-800 font-bold mb-2">Passé ce délai :</p>
                  <div className="space-y-1 text-gray-700">
                    <p className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      la vente est considérée comme conforme
                    </p>
                    <p className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      aucun remboursement n'est possible
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                6. Procédure en cas de problème
              </h2>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  Comme il n'existe pas de messagerie interne, l'acheteur doit contacter exclusivement NaturalHairMarket :
                </p>
                <div className="bg-white border-2 border-orange-400 rounded-lg p-4 mb-4">
                  <p className="text-orange-600 font-semibold text-lg text-center">📧 naturalhairmarket@gmail.com</p>
                </div>
                <div className="bg-white border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-2 font-semibold">NaturalHairMarket :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>analyse les preuves (photos, description, suivi)</li>
                    <li>contacte le vendeur</li>
                    <li>rend une décision impartiale</li>
                  </ul>
                </div>
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <p className="text-gray-700 mb-2 font-semibold">Nous pouvons :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>rembourser l'acheteur</li>
                    <li>demander un remboursement au vendeur</li>
                    <li>libérer les fonds au vendeur si le produit est conforme</li>
                    <li>suspendre un vendeur en cas de fraude</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                7. Remboursements possibles
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">Un remboursement est possible si :</p>
                <div className="space-y-2 mb-4">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">le vendeur n'a pas expédié dans les 3 jours ouvrables</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">le colis est perdu et non traçable</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">les cheveux ne sont pas conformes (longueur, couleur, texture, état, traitements)</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">les cheveux reçus sont synthétiques</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">les cheveux sont sales, abîmés ou impropres</span>
                  </div>
                </div>
                <div className="bg-white border-2 border-emerald-400 rounded-lg p-4">
                  <p className="text-emerald-800 font-bold">
                    Dans ces cas : ➡️ l'acheteur est remboursé du produit + livraison + commission 10%
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                8. Ce qui ne donne PAS droit à remboursement
              </h2>
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
                <p className="text-red-700 mb-3 font-bold">
                  Aucun remboursement ne sera accordé dans les cas suivants :
                </p>
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">simple changement d'avis</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">le colis a été ouvert sans justification valable</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">problème signalé après 24h</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">légère différence de teinte due à l'écran / lumière</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">utilisation du produit par l'acheteur</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">absence de preuve</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">les cheveux correspondent à l'annonce</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Ban className="w-6 h-6 text-red-600" />
                9. Interdiction des transactions hors plateforme
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-700 mb-3 font-bold">Il est strictement interdit à l'acheteur de :</p>
                <div className="space-y-2 mb-4">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">demander au vendeur de conclure la vente ailleurs</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">contourner les paiements sécurisés</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">éviter la commission NaturalHairMarket</span>
                  </div>
                </div>
                <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                  <p className="text-red-800 font-bold mb-2">Toute tentative entraîne :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>suppression du compte</li>
                    <li>impossibilité d'effectuer de nouveaux achats</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-teal-600" />
                10. Sécurité et hygiène
              </h2>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">L'acheteur reconnaît que :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>les cheveux doivent être lavés avant utilisation</li>
                  <li>il doit vérifier l'état du produit avant usage</li>
                  <li>il doit manipuler les cheveux dans un environnement propre</li>
                  <li>NaturalHairMarket ne peut garantir l'absence absolue de risques sanitaires</li>
                  <li>l'usage final des cheveux relève de la responsabilité de l'acheteur</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-teal-600" />
                11. Responsabilités de l'acheteur
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">L'acheteur est responsable :</p>
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">de la vérification immédiate du produit</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">de fournir des preuves en cas de litige</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">de respecter les délais légaux</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">de lire attentivement l'annonce avant l'achat</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">d'utiliser les cheveux correctement et de manière hygiénique</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Scale className="w-6 h-6 text-blue-600" />
                12. Médiation légale
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">Si un litige persiste :</p>
                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <p className="font-semibold text-gray-800 mb-2">AME Conso – Médiateur de la consommation</p>
                  <p className="text-gray-700">www.mediationconso-ame.com</p>
                  <p className="text-gray-700 mt-2">11 Place Dauphine, 75001 Paris</p>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-teal-600" />
                13. Contact
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pour toute question ou assistance :
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-teal-200">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email</p>
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
                    <p className="text-sm text-gray-600 font-medium">Téléphone</p>
                    <a href="tel:0972216948" className="text-teal-600 font-semibold hover:underline">
                      09 72 21 69 48
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <div className="bg-teal-600 text-white rounded-lg p-6 mt-8">
              <p className="text-center font-semibold">
                Le respect de ce règlement garantit une expérience d'achat transparente et sécurisée
                sur NaturalHairMarket.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
