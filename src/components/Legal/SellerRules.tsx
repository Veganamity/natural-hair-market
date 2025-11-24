import { UserCheck, CheckCircle, XCircle, AlertTriangle, Shield, Package, Clock, CreditCard, Scale, FileText, Ban, DollarSign, Mail, Phone } from 'lucide-react';

export function SellerRules() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Règlement vendeur
              </h1>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-gray-700 leading-relaxed mb-3">
              La participation en tant que vendeur sur NaturalHairMarket implique l'acceptation complète du présent règlement.
            </p>
            <p className="text-gray-800 font-semibold">
              NaturalHairMarket est une plateforme d'intermédiation : les vendeurs sont responsables de leurs annonces
              et de la qualité des produits proposés.
            </p>
          </div>

          <div className="prose prose-blue max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <UserCheck className="w-6 h-6 text-blue-600" />
                1. Conditions pour devenir vendeur
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">Pour vendre sur NaturalHairMarket, vous devez :</p>
                <div className="space-y-2 mb-4">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">avoir au moins 18 ans</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">disposer d'un compte utilisateur valide</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">fournir des informations exactes et à jour</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">être propriétaire légitime des cheveux que vous vendez</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">accepter l'ensemble des CGU, CGV et règles de sécurité</span>
                  </div>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    Les vendeurs professionnels (salons) peuvent fournir leur SIRET/SIREN afin d'obtenir le
                    badge <strong>"Salon Vérifié"</strong>.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                2. Produits autorisés à la vente
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">Sont autorisés :</p>
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">cheveux humains 100 % naturels</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">cheveux propres, attachés et coupés récemment</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">cheveux non traités OU traités avec mention obligatoire</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">cheveux de toutes textures (raides, ondulés, bouclés, crépus)</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                3. Produits strictement interdits
              </h2>
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
                <p className="text-red-700 mb-3 font-bold">Sont interdits :</p>
                <div className="space-y-2 mb-4">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">cheveux synthétiques</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">cheveux mélangés synthétique + humain</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">cheveux contaminés, sales, humides ou moisis</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">cheveux traités chimiquement sans l'indiquer clairement</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">cheveux obtenus illégalement ou sans consentement</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">annonces basées sur des photos volées (Google, Instagram, etc.)</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">annonces fictives ou mensongères</span>
                  </div>
                </div>
                <div className="bg-red-100 border border-red-400 rounded-lg p-4">
                  <p className="text-red-800 font-bold mb-2">Toute infraction entraînera :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>annulation de vente</li>
                    <li>suspension définitive du compte</li>
                    <li>signalement aux autorités si nécessaire</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                4. Certification obligatoire d'authenticité
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  Pour publier une annonce, le vendeur doit cocher la mention obligatoire :
                </p>
                <div className="bg-white border-2 border-blue-400 rounded-lg p-4 mb-4">
                  <p className="text-gray-800 font-semibold italic">
                    « Je certifie que les cheveux déposés sur cette annonce sont 100 % humains, naturels et non
                    synthétiques, et correspondent fidèlement à la description fournie. »
                  </p>
                </div>
                <p className="text-gray-700 mb-3">
                  Sans cette validation, aucune annonce ne peut être déposée.
                </p>
                <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                  <p className="text-red-800 font-bold">
                    Toute fausse déclaration = bannissement immédiat.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                5. Règles d'hygiène et de qualité
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">
                  Les cheveux doivent respecter les critères suivants :
                </p>
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">propres et secs</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">exempts de parasites</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">sans odeur</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">attachés en queue ou tresse</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">conservés correctement</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">en bon état général</span>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-700 font-semibold">
                    Les cheveux doivent être envoyés tels qu'ils apparaissent dans les photos de l'annonce.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                6. Transparence obligatoire sur les traitements
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  Le vendeur doit préciser si les cheveux ont subi :
                </p>
                <div className="grid md:grid-cols-2 gap-2 mb-4">
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    coloration
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    décoloration
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    permanente
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    lissage
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    défrisage
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    kératine
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    henné
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    traitement chimique
                  </div>
                </div>
                <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                  <p className="text-red-800 font-semibold">
                    Vendre des cheveux traités sans le dire constitue une fraude.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                7. Description et photos de l'annonce
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">La description doit être fidèle et complète :</p>
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                  <ul className="space-y-1 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      longueur exacte
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      poids si mesuré
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      couleur réelle
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      texture réelle
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      traitements effectués
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      état général
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      période de coupe
                    </li>
                  </ul>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-2 font-semibold">Les photos doivent être :</p>
                  <ul className="space-y-1 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      authentiques
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      prises par le vendeur
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      représentatives du produit réel
                    </li>
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                  <p className="text-red-700 mb-2 font-bold">Interdictions :</p>
                  <ul className="space-y-1 text-gray-700">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      photos retouchées
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      photos volées
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      photos trompeuses
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      photos issues de banques d'images
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
                8. Délais d'expédition
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="bg-white border-2 border-blue-400 rounded-lg p-4 mb-4">
                  <p className="text-gray-800 font-bold text-lg">
                    ➡️ Le vendeur s'engage à expédier les cheveux dans les 3 jours ouvrables après validation de la commande.
                  </p>
                </div>
                <p className="text-gray-700 mb-3">Le vendeur doit :</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    bien emballer les cheveux
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    fournir un numéro de suivi valide
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    utiliser un mode d'envoi adapté
                  </div>
                </div>
                <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                  <p className="text-red-800 font-semibold">
                    En cas de non-expédition → la commande est annulée et l'acheteur est remboursé.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CreditCard className="w-6 h-6 text-emerald-600" />
                9. Paiements et blocage des fonds
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Les paiements sont traités par Stripe.
                </p>
                <div className="bg-white border border-emerald-200 rounded-lg p-4 mb-3">
                  <p className="text-gray-700 mb-2">NaturalHairMarket :</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      bloque les fonds jusqu'à ce que l'acheteur confirme la réception
                    </li>
                    <li className="text-center font-semibold text-gray-600">OU</li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      jusqu'à expiration du délai automatique de 48 heures après livraison
                    </li>
                  </ul>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    En cas de litige, les fonds sont bloqués jusqu'à décision de NaturalHairMarket.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Scale className="w-6 h-6 text-blue-600" />
                10. Gestion des litiges
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Comme la plateforme ne propose pas de messagerie interne entre vendeurs et acheteurs,
                  NaturalHairMarket agit comme seul intermédiaire.
                </p>
                <div className="bg-white border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-2 font-semibold">En cas de litige, NaturalHairMarket :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>contacte le vendeur</li>
                    <li>analyse les preuves (photos, description, suivi)</li>
                    <li>décide de libérer ou non les fonds</li>
                    <li>peut exiger un remboursement</li>
                    <li>peut suspendre le compte en cas de fraude</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-800 font-semibold">
                    Le vendeur doit répondre à NaturalHairMarket dans un délai raisonnable (48h).
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                11. Responsabilités du vendeur
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">
                  Le vendeur est entièrement responsable :
                </p>
                <div className="space-y-2 mb-4">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">de l'authenticité des cheveux</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">de la qualité réelle du produit</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">de la véracité de la description</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">de l'emballage et l'expédition</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">des traitements effectués</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">de toute fausse déclaration</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">du respect des lois sur la vente de biens</span>
                  </div>
                </div>
                <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                  <p className="text-red-800 font-bold">
                    En cas de fraude → suspension définitive.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Ban className="w-6 h-6 text-red-600" />
                12. Interdiction des transactions hors plateforme
              </h2>
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
                <p className="text-red-700 mb-3 font-bold">Il est strictement interdit de :</p>
                <div className="space-y-2 mb-4">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">conclure la transaction hors plateforme</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">demander un paiement externe</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">négocier hors NaturalHairMarket</span>
                  </div>
                </div>
                <div className="bg-red-100 border border-red-400 rounded-lg p-4">
                  <p className="text-red-800 font-bold">
                    Toute tentative → suppression immédiate du compte.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <DollarSign className="w-6 h-6 text-emerald-600" />
                13. Obligations fiscales du vendeur
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">Le vendeur est responsable de :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>déclarer ses ventes</li>
                  <li>respecter ses obligations fiscales (auto-entrepreneur, salon, particulier occasionnel)</li>
                  <li>tenir ses registres si professionnel</li>
                </ul>
                <div className="bg-white border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-700 italic">
                    NaturalHairMarket ne fournit pas de conseil fiscal.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Ban className="w-6 h-6 text-red-600" />
                14. Suspension et suppression de compte
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  Le compte vendeur peut être suspendu ou supprimé en cas de :
                </p>
                <div className="grid md:grid-cols-2 gap-2 mb-4">
                  <div className="bg-white rounded-lg p-2 border border-red-200 text-gray-700 text-sm">
                    fraude
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-red-200 text-gray-700 text-sm">
                    vente de cheveux synthétiques
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-red-200 text-gray-700 text-sm">
                    non-expédition répétée
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-red-200 text-gray-700 text-sm">
                    comportements suspects
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-red-200 text-gray-700 text-sm">
                    fausses descriptions
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-red-200 text-gray-700 text-sm">
                    photos volées
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-red-200 text-gray-700 text-sm md:col-span-2">
                    non-coopération lors d'un litige
                  </div>
                </div>
                <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                  <p className="text-red-800 font-bold">
                    La décision peut être définitive et sans préavis.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
                15. Contact vendeur
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pour toute question ou assistance :
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email</p>
                    <a href="mailto:naturalhairmarket@gmail.com" className="text-blue-600 font-semibold hover:underline">
                      naturalhairmarket@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Téléphone</p>
                    <a href="tel:0972216948" className="text-blue-600 font-semibold hover:underline">
                      09 72 21 69 48
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <div className="bg-blue-600 text-white rounded-lg p-6 mt-8">
              <p className="text-center font-semibold">
                Le respect de ce règlement garantit une expérience de vente transparente, sécurisée et conforme
                aux standards de qualité de NaturalHairMarket.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
