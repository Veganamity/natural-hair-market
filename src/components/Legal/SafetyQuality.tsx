import { Shield, CheckCircle, XCircle, AlertTriangle, Award, Eye, Users, Mail, Phone } from 'lucide-react';

export function SafetyQuality() {
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
                Sécurité & Qualité des cheveux
              </h1>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6 mb-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              NaturalHairMarket s'engage à offrir un espace sécurisé permettant la vente et l'achat de
              cheveux humains naturels. Cette page détaille toutes les informations importantes pour comprendre :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              <li>les standards de qualité attendus</li>
              <li>les règles à respecter pour publier une annonce</li>
              <li>les protections mises en place pour les acheteurs</li>
              <li>les responsabilités de chacun</li>
            </ul>
            <div className="bg-white border border-emerald-300 rounded-lg p-4">
              <p className="text-gray-800 font-semibold">
                NaturalHairMarket est une plateforme d'intermédiation : nous ne sommes pas vendeurs et
                ne manipulons pas les produits.
              </p>
              <p className="text-gray-700 mt-2">
                Les vendeurs sont entièrement responsables de la qualité des cheveux qu'ils publient.
              </p>
            </div>
          </div>

          <div className="prose prose-emerald max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                1. Authenticité des cheveux
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">
                  Chaque vendeur doit obligatoirement certifier que :
                </p>
                <div className="bg-white rounded-lg p-4 border border-emerald-300 space-y-2 mb-4">
                  <p className="text-gray-700 flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    les cheveux sont 100 % humains
                  </p>
                  <p className="text-gray-700 flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    les cheveux ne sont pas synthétiques
                  </p>
                  <p className="text-gray-700 flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    les cheveux ne sont pas d'origine frauduleuse
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-2">
                    Cette certification est validée par une case obligatoire lors du dépôt d'annonce :
                  </p>
                  <p className="text-gray-800 italic font-semibold">
                    « Je certifie que les cheveux déposés sur cette annonce sont 100 % humains, naturels et non synthétiques. »
                  </p>
                </div>
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                  <p className="text-red-700 font-bold mb-2">Toute fausse déclaration entraîne :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>annulation de la vente</li>
                    <li>remboursement à l'acheteur</li>
                    <li>suspension définitive du compte vendeur</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                2. Hygiène & état des cheveux
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">
                  Les cheveux mis en vente doivent obligatoirement être :
                </p>
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">propres</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">secs</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">exempts de parasites</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">sans odeur désagréable</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">correctement attachés</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">coupés récemment</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-200 flex items-center gap-2 md:col-span-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">en bon état général</span>
                  </div>
                </div>
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                  <p className="text-gray-700 mb-2 font-semibold">Les cheveux :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mb-3">
                    <li>sales</li>
                    <li>moisis</li>
                    <li>emmêlés de manière excessive</li>
                    <li>contenant des résidus inconnus</li>
                    <li>ou mal conservés</li>
                  </ul>
                  <p className="text-red-700 font-bold">➡️ sont strictement interdits à la vente.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                3. Mention obligatoire des traitements
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  Les vendeurs doivent indiquer de manière transparente si les cheveux ont subi :
                </p>
                <div className="grid md:grid-cols-2 gap-2 mb-4">
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    coloration
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    décoloration
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    lissage
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    permanente
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    kératine
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm">
                    henné
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-yellow-200 text-gray-700 text-sm md:col-span-2">
                    tout traitement chimique
                  </div>
                </div>
                <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                  <p className="text-red-800 font-semibold">
                    Vendre des cheveux traités sans le préciser est considéré comme une fausse déclaration.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Eye className="w-6 h-6 text-emerald-600" />
                4. Longueur, couleur et texture : règles de clarté
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">Les vendeurs doivent fournir :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>une mesure exacte de la longueur</li>
                  <li>une mention réelle de la couleur</li>
                  <li>la texture réelle (lisse, ondulé, bouclé, crépu)</li>
                </ul>
                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    Variations naturelles (ton clair/foncé selon écran ou lumière) ne sont pas considérées
                    comme défaut, mais toute différence majeure doit être signalée.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-red-600" />
                5. Sécurité du consommateur
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">Pour des raisons d'hygiène :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>les cheveux ne doivent présenter aucun risque sanitaire</li>
                  <li>aucun produit potentiellement dangereux ne doit être ajouté</li>
                  <li>les cheveux ne doivent pas être porteurs de parasites, poux ou substances toxiques</li>
                </ul>
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <p className="text-gray-700 mb-2 font-semibold">
                    Il est conseillé aux acheteurs, après réception :
                  </p>
                  <ul className="list-none text-gray-700 space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      d'inspecter le produit
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      de laver et sécher les cheveux
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      de conserver les cheveux dans un environnement propre
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                6. Absence de droit de rétractation
              </h2>
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  Les cheveux humains coupés sont considérés comme :
                </p>
                <div className="bg-white border border-yellow-400 rounded-lg p-4 mb-4">
                  <p className="text-gray-800 font-bold text-lg">
                    ➡️ des biens d'hygiène personnelle
                  </p>
                </div>
                <p className="text-gray-700 mb-3">
                  Conformément à l'article L221-28 du Code de la consommation :
                </p>
                <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4 space-y-2">
                  <p className="text-red-700 font-semibold flex items-center gap-2">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    Aucun retour n'est possible après ouverture du colis
                  </p>
                  <p className="text-red-700 font-semibold flex items-center gap-2">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    Le droit de rétractation de 14 jours ne s'applique pas
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-gray-700 mb-2 font-semibold">Sauf :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>non-conformité avérée</li>
                    <li>fraude du vendeur</li>
                    <li>produit synthétique vendu comme naturel</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                7. Protection des acheteurs
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4 font-semibold">
                  NaturalHairMarket a mis en place :
                </p>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border-l-4 border-emerald-600 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Système de certification obligatoire "100 % humains"</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-emerald-600 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Analyse des litiges par notre équipe (aucun contact direct vendeur-acheteur)</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-emerald-600 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Remboursement en cas de non-conformité</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-emerald-600 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Signalement d'annonce suspecte</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-emerald-600 flex items-start gap-3">
                    <Award className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Badge "Salon Vérifié" pour les vendeurs professionnels fournissant leur SIRET/SIREN</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-emerald-600 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Paiement sécurisé Stripe avec blocage des fonds jusqu'à validation</span>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-gray-700 mb-2 font-semibold">Ces mesures permettent de limiter :</p>
                  <div className="grid md:grid-cols-2 gap-2">
                    <span className="text-gray-700">• les fraudes</span>
                    <span className="text-gray-700">• les annonces synthétiques</span>
                    <span className="text-gray-700">• les arnaques</span>
                    <span className="text-gray-700">• les fausses descriptions</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                8. Signalement d'une annonce suspecte
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  Les utilisateurs peuvent signaler une annonce suspecte s'ils pensent que :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>les cheveux ne sont pas naturels</li>
                  <li>la description est fausse</li>
                  <li>les photos semblent volées</li>
                  <li>le vendeur paraît suspect</li>
                </ul>
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <p className="text-gray-700 mb-2 font-semibold">NaturalHairMarket examine et peut :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>suspendre l'annonce</li>
                    <li>bloquer le vendeur</li>
                    <li>exiger des preuves</li>
                    <li>annuler une vente en cours</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
                9. Responsabilité des vendeurs
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">
                  Les vendeurs sont légalement responsables :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>de la véracité de leurs annonces</li>
                  <li>de l'hygiène des cheveux</li>
                  <li>de leur authenticité</li>
                  <li>de leur conformité</li>
                  <li>de l'expédition correcte</li>
                </ul>
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                  <p className="text-red-700 font-bold mb-2">Toute fraude entraîne :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>remboursement total</li>
                    <li>suppression définitive du compte</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                10. Conseils de sécurité pour les acheteurs
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Pour garantir une expérience sécurisée, nous recommandons de :
                </p>
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">consulter attentivement la description</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">vérifier la longueur et texture indiquées</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">vérifier l'état du paquet à réception</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">signaler immédiatement (dans les 24 heures) tout problème</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">conserver les cheveux dans un environnement propre et sec</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">laver les cheveux avant utilisation</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-emerald-600" />
                11. Contact
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pour toute question concernant la sécurité et la qualité :
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
                NaturalHairMarket met tout en œuvre pour garantir des transactions sécurisées et transparentes
                entre acheteurs et vendeurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
