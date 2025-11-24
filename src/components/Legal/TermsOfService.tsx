import { FileText, Scale, ShoppingBag, CreditCard, AlertCircle, Users, Shield, Ban, Building2, Gavel } from 'lucide-react';

export function TermsOfService() {
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
                Conditions Générales d'Utilisation
              </h1>
              <p className="text-gray-600 mt-1">Dernière mise à jour : 18 novembre 2025</p>
            </div>
          </div>

          <div className="prose prose-emerald max-w-none space-y-8">
            <section className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Building2 className="w-6 h-6 text-emerald-600" />
                1. Mentions légales
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  Conformément aux articles 6-III et 19 de la Loi pour la Confiance dans l'Économie Numérique (LCEN),
                  les informations suivantes sont fournies.
                </p>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p><strong>Éditeur du site :</strong> NaturalHairMarket</p>
                  <p><strong>Responsable de la publication :</strong> Stéphanie Buisson</p>
                  <p><strong>Contact :</strong> naturalhairmarket@gmail.com – 09 72 21 69 48</p>
                  <p><strong>Statut juridique :</strong> Entrepreneuse individuelle (SIREN en cours d'attribution)</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 mt-3">
                  <p className="font-semibold mb-2">Hébergeur :</p>
                  <p>OVH SAS</p>
                  <p>2 Rue Kellermann</p>
                  <p>59100 Roubaix – France</p>
                  <p>Téléphone : 09 72 10 10 07</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                2. Acceptation des conditions
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-3">
                  En accédant à NaturalHairMarket, vous reconnaissez avoir lu, compris et accepté intégralement
                  les présentes Conditions Générales d'Utilisation (CGU).
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Si vous n'acceptez pas ces CGU, veuillez ne pas utiliser la plateforme.
                </p>
                <div className="bg-white rounded-lg p-4 border border-emerald-300 mt-4">
                  <p className="text-gray-800 font-semibold">
                    ➡️ NaturalHairMarket est une plateforme de mise en relation permettant l'achat et la vente
                    de cheveux humains coupés.
                  </p>
                  <p className="text-gray-700 mt-2">
                    Nous ne sommes pas vendeurs, ni propriétaires des biens proposés, et n'intervenons pas dans
                    les transactions entre utilisateurs.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
                3. Inscription et compte utilisateur
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Pour utiliser la plateforme, vous devez :</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>avoir au moins 18 ans</li>
                    <li>fournir des informations exactes et à jour</li>
                    <li>maintenir la confidentialité de votre mot de passe</li>
                    <li>être responsable des actions réalisées depuis votre compte</li>
                    <li>nous informer immédiatement en cas d'utilisation frauduleuse</li>
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Suspension ou fermeture de compte</h3>
                  <p className="text-gray-700 mb-2">
                    NaturalHairMarket se réserve le droit de suspendre ou supprimer tout compte :
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>en cas de violation des CGU</li>
                    <li>de fraude</li>
                    <li>de tentative d'escroquerie</li>
                    <li>de récidive de litiges</li>
                    <li>de falsification d'annonces</li>
                    <li>de vente de cheveux synthétiques présentés comme naturels</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <ShoppingBag className="w-6 h-6 text-emerald-600" />
                4. Dépôt d'annonce et vente
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">4.1 Obligations des vendeurs</h3>
                  <p className="text-gray-700 mb-3">Le vendeur doit :</p>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>être le propriétaire légitime des cheveux vendus</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>fournir des descriptions exactes et non trompeuses</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>indiquer si les cheveux sont traités chimiquement</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>expédier les cheveux sous 3 jours ouvrables</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>fournir un produit propre et conforme</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>emballer correctement les cheveux</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>répondre aux questions des acheteurs</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>respecter les lois applicables</span>
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">4.2 Case obligatoire – Authenticité</h3>
                  <p className="text-gray-700 mb-3">
                    Pour chaque annonce, le vendeur doit obligatoirement cocher la mention suivante :
                  </p>
                  <div className="bg-white border-2 border-yellow-400 rounded-lg p-4">
                    <p className="text-gray-800 font-semibold italic">
                      « Je certifie que les cheveux déposés sur cette annonce sont 100 % humains, naturels et non synthétiques.
                      Je comprends qu'en cas de fausse déclaration, je devrai rembourser l'acheteur et pourrai être
                      définitivement banni de la plateforme. »
                    </p>
                  </div>
                  <p className="text-gray-700 mt-3 font-semibold">
                    ➡️ Aucune annonce ne peut être publiée sans cette validation.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-300 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">4.3 Produits strictement interdits</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>cheveux synthétiques présentés comme naturels</li>
                    <li>cheveux obtenus illégalement</li>
                    <li>cheveux contaminés ou dangereux</li>
                    <li>cheveux traités chimiquement sans divulgation</li>
                    <li>faux cheveux humains</li>
                    <li>annonces frauduleuses ou volées</li>
                    <li>photos trouvées sur Internet (interdit)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CreditCard className="w-6 h-6 text-emerald-600" />
                5. Achat sur la plateforme
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">L'acheteur doit :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>utiliser un moyen de paiement valide</li>
                  <li>vérifier l'adresse de livraison</li>
                  <li>inspecter les cheveux dès réception</li>
                  <li>signaler tout problème dans les 24 heures</li>
                  <li>confirmer la réception sous 48 heures</li>
                </ul>
                <p className="text-gray-700 mt-4 font-semibold">
                  En l'absence de confirmation, le paiement est automatiquement versé au vendeur.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-gray-800 font-semibold mb-2">Communication en cas de problème :</p>
                  <p className="text-gray-700">
                    En cas de problème, l'acheteur doit contacter directement NaturalHairMarket, qui jouera le rôle d'intermédiaire,
                    la messagerie interne entre utilisateurs n'existant pas sur la plateforme.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CreditCard className="w-6 h-6 text-emerald-600" />
                6. Paiements et frais
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 space-y-3">
                <p className="text-gray-700">
                  Les paiements sont sécurisés via Stripe.
                </p>
                <p className="text-gray-700">
                  Nous ne stockons aucune donnée bancaire.
                </p>
                <p className="text-gray-700">
                  Les fonds sont bloqués jusqu'à validation de la réception.
                </p>
                <p className="text-gray-700 font-semibold">
                  Commission de plateforme : 5 % par transaction réussie.
                </p>
                <p className="text-gray-700">
                  Les frais d'expédition sont à la charge de l'acheteur.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-emerald-600" />
                7. Droit de rétractation
              </h2>
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  Conformément à l'article L221-28 du Code de la consommation :
                </p>
                <div className="bg-white border border-yellow-400 rounded-lg p-4">
                  <p className="text-gray-800 font-bold">
                    ➡️ Les cheveux coupés (bien d'hygiène) ne bénéficient pas du droit de rétractation.
                  </p>
                  <p className="text-gray-800 font-bold mt-2">
                    ➡️ Aucun retour n'est possible une fois l'emballage ouvert.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Gavel className="w-6 h-6 text-emerald-600" />
                8. Litiges et médiation
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    En cas de litige ou de problème concernant une annonce, l'acheteur doit contacter directement
                    NaturalHairMarket via :
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                    <p className="text-emerald-600 font-semibold text-lg">📧 naturalhairmarket@gmail.com</p>
                  </div>
                  <p className="text-gray-700 mb-3">
                    Comme la plateforme ne propose pas de messagerie interne, NaturalHairMarket agit comme seul
                    intermédiaire entre l'acheteur et le vendeur pour la gestion du litige.
                  </p>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 font-semibold mb-2">NaturalHairMarket analyse :</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>la description de l'annonce</li>
                      <li>les photos et éléments fournis par l'acheteur</li>
                      <li>les preuves d'expédition du vendeur</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-700 font-semibold mb-2">NaturalHairMarket peut :</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>suspendre ou annuler une transaction</li>
                      <li>rembourser l'acheteur si nécessaire</li>
                      <li>libérer les fonds au vendeur si le produit est conforme</li>
                      <li>suspendre le compte d'un vendeur ou d'un acheteur en cas de fraude ou comportement abusif</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Procédure de réclamation</h3>
                  <p className="text-gray-700 mb-3">
                    Pour toute réclamation, l'acheteur doit écrire à <strong>naturalhairmarket@gmail.com</strong> dans
                    un délai de 24 heures après réception du colis, en joignant des photos et une description du problème.
                  </p>
                  <p className="text-gray-700">
                    NaturalHairMarket contactera le vendeur et agira comme intermédiaire.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Médiation légale</h3>
                  <p className="text-gray-700 mb-2">
                    Conformément à la loi, le consommateur peut saisir gratuitement un médiateur de la consommation :
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <p className="font-semibold text-gray-800">AME Conso – Association Médiation Consommation</p>
                    <p className="text-gray-700">www.mediationconso-ame.com</p>
                    <p className="text-gray-700">Adresse postale : 11 Place Dauphine, 75001 Paris</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Ban className="w-6 h-6 text-emerald-600" />
                9. Comportements interdits
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">Sont interdits :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>faux comptes</li>
                  <li>fausses annonces</li>
                  <li>ventes de cheveux synthétiques</li>
                  <li>contournement de la plateforme pour éviter les frais</li>
                  <li>menaces, harcèlement</li>
                  <li>phishing, piratage</li>
                  <li>spam</li>
                  <li>manipulation d'avis</li>
                  <li>utilisation illégale du site</li>
                  <li>fraude sur l'origine des cheveux</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                10. Fonctionnement du classement des annonces
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">Le classement des annonces est basé sur :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>la date de publication</li>
                  <li>la pertinence (ex : longueur, mots-clés)</li>
                  <li>les filtres sélectionnés par l'utilisateur</li>
                </ul>
                <p className="text-gray-700 mt-4 font-semibold">
                  Aucun paiement ne permet de modifier la position d'une annonce.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                11. Rôle de NaturalHairMarket – Statut d'hébergeur
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3">Conformément à la LCEN :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>NaturalHairMarket est un hébergeur de contenus, non un vendeur</li>
                  <li>nous n'avons aucune obligation de surveillance générale</li>
                  <li>nous supprimons uniquement les contenus signalés comme illicites</li>
                  <li>la responsabilité des contenus incombe exclusivement aux vendeurs</li>
                </ul>
                <p className="text-gray-700 mt-4 italic">
                  Cela protège légalement la plateforme en cas d'annonce frauduleuse.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-red-600" />
                12. Responsabilité
              </h2>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">12.1 Responsabilité du vendeur</h3>
                  <p className="text-gray-700 mb-2">Le vendeur est seul responsable :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>de l'authenticité des cheveux</li>
                    <li>de leur propreté</li>
                    <li>des informations publiées</li>
                    <li>de leur caractère non dangereux</li>
                    <li>des remboursements dus en cas de fraude</li>
                    <li>de l'expédition correcte</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">12.2 Responsabilité de l'acheteur</h3>
                  <p className="text-gray-700 mb-2">L'acheteur reconnaît :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>acheter les cheveux en l'état</li>
                    <li>faire sa propre vérification</li>
                    <li>que la plateforme ne garantit pas l'authenticité</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">12.3 Limitation de la responsabilité de NaturalHairMarket</h3>
                  <p className="text-gray-700 mb-3">NaturalHairMarket ne saurait être tenue responsable :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>de l'authenticité des cheveux</li>
                    <li>d'allergies, infections, irritations</li>
                    <li>de l'absence de traitement chimique</li>
                    <li>de photos erronées</li>
                    <li>de produits non conformes</li>
                    <li>de litiges entre utilisateurs</li>
                    <li>de retards d'expédition</li>
                    <li>d'informations fausses</li>
                    <li>d'usurpation d'identité</li>
                    <li>de l'utilisation des cheveux par l'acheteur</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                13. Données personnelles (RGPD)
              </h2>
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">NaturalHairMarket collecte :</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>email</li>
                    <li>téléphone</li>
                    <li>nom utilisateur</li>
                    <li>adresse de livraison</li>
                    <li>données de paiement (via Stripe, non stockées)</li>
                    <li>photos et descriptions d'annonces</li>
                    <li>historique des transactions</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Finalités :</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>gestion du compte</li>
                    <li>publication d'annonces</li>
                    <li>prévention des fraudes</li>
                    <li>paiements</li>
                    <li>contact utilisateur</li>
                    <li>obligations légales</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Vos droits :</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>accès</li>
                    <li>rectification</li>
                    <li>suppression</li>
                    <li>portabilité</li>
                    <li>opposition</li>
                    <li>retrait du consentement</li>
                  </ul>
                  <p className="text-gray-700 mt-3">
                    <strong>Demande à :</strong> naturalhairmarket@gmail.com
                  </p>
                </div>

                <p className="text-gray-700">
                  Les données sont hébergées chez OVH.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">14. Modifications des CGU</h2>
              <p className="text-gray-700 leading-relaxed">
                NaturalHairMarket peut modifier ces CGU à tout moment.
                Toute modification importante fera l'objet d'une notification.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">15. Résiliation</h2>
              <p className="text-gray-700 leading-relaxed">
                Vous pouvez supprimer votre compte à tout moment.
                Nous pouvons supprimer un compte sans préavis en cas de fraude ou non-respect des CGU.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">16. Droit applicable</h2>
              <p className="text-gray-700 leading-relaxed">
                Les CGU sont régies par les lois françaises.
                Tout litige sera soumis aux tribunaux français.
              </p>
            </section>

            <section className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                Contact
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter :
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
                En utilisant NaturalHairMarket, vous reconnaissez avoir lu, compris et accepté ces conditions d'utilisation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
