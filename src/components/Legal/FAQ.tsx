import { X, HelpCircle } from 'lucide-react';

interface FAQProps {
  onClose: () => void;
}

export function FAQ({ onClose }: FAQProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full my-8">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-xl flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-8 h-8" />
            <h2 className="text-2xl font-bold">FAQ : Foire aux Questions</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-emerald-600 pb-2">
              1. Questions générales
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Qu'est-ce que NaturalHairMarket ?</h4>
                <p className="text-gray-600">
                  NaturalHairMarket est une marketplace française spécialisée dans l'achat et la vente de cheveux humains naturels, colorés ou méchés, vendus par des salons et particuliers.
                  Nous agissons comme intermédiaire sécurisé entre vendeurs et acheteurs.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Le site est-il réservé à la France ?</h4>
                <p className="text-gray-600">
                  La plateforme est basée en France, mais ouverte aux acheteurs et vendeurs de toute l'Europe.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Qui peut vendre sur NaturalHairMarket ?</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Salons de coiffure</li>
                  <li>Particuliers</li>
                  <li>Professionnels du cheveu</li>
                </ul>
                <p className="text-gray-600 mt-2">Tant que les cheveux sont humains, coupés, attachés et en bon état.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Qui peut acheter ?</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Perruquiers</li>
                  <li>Grossistes</li>
                  <li>Fabricants d'extensions</li>
                  <li>Cinéma / FX / théâtre</li>
                  <li>Particuliers exigeants</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-emerald-600 pb-2">
              2. Pour les vendeurs (salons & particuliers)
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Publier une annonce est-il gratuit ?</h4>
                <p className="text-gray-600">Oui. La mise en vente est 100 % gratuite.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">NaturalHairMarket prend-il une commission sur la vente ?</h4>
                <p className="text-gray-600">
                  Non. Le vendeur reçoit l'intégralité du montant de sa vente.
                  Les frais de 0,99 € sont payés uniquement par l'acheteur, au moment de l'achat.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Qui prend en charge les frais d'envoi ?</h4>
                <p className="text-gray-600 font-semibold">
                  ➡️ Toujours l'acheteur. Le vendeur n'avance rien.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Comment envoyer la mèche ?</h4>
                <p className="text-gray-600 mb-2">
                  Le vendeur reçoit une étiquette d'envoi prépayée par l'acheteur (ou instructions précises).
                  Il doit simplement :
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>protéger la mèche</li>
                  <li>l'emballer proprement</li>
                  <li>déposer le colis au point relais / bureau de poste indiqué</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Comment attacher correctement la mèche ?</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>attacher fermement les racines</li>
                  <li>ajouter une attache au milieu si la mèche est longue</li>
                  <li>garder les cheveux secs, propres et démêlés</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Puis-je vendre des cheveux colorés, méchés ou décolorés ?</h4>
                <p className="text-gray-600">
                  Oui, entièrement accepté. La couleur doit simplement être indiquée clairement dans l'annonce.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-emerald-600 pb-2">
              3. Pour les acheteurs
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Pourquoi payer 0,99 € ?</h4>
                <p className="text-gray-600 mb-2">Ce frais fixe couvre :</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>la sécurisation de la transaction</li>
                  <li>la vérification des annonces</li>
                  <li>l'intervention possible du service après-vente</li>
                  <li>la gestion intermédiaire entre vendeur et acheteur</li>
                </ul>
                <p className="text-gray-600 mt-2">Il est appliqué uniquement au moment de l'achat.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Comment se déroule l'achat ?</h4>
                <ol className="list-decimal list-inside text-gray-600 space-y-1 ml-4">
                  <li>Vous choisissez une mèche.</li>
                  <li>Vous la payez + 0,99 € de frais.</li>
                  <li>NaturalHairMarket contacte le vendeur.</li>
                  <li>Le vendeur envoie la mèche selon vos instructions.</li>
                  <li>Vous recevez votre colis.</li>
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Puis-je contacter directement le vendeur ?</h4>
                <p className="text-gray-600">
                  Non. Pour votre sécurité, tous les échanges passent par NaturalHairMarket.
                  Aucun contact direct n'est autorisé.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Que faire si la mèche reçue ne correspond pas à l'annonce ?</h4>
                <p className="text-gray-600 mb-2">
                  Contactez immédiatement notre service après-vente.
                  Nous ouvrons un dossier de vérification et nous gérons :
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>la médiation</li>
                  <li>l'éventuel retour</li>
                  <li>le remboursement si nécessaire</li>
                </ul>
                <p className="text-gray-600 mt-2 font-semibold">
                  👉 L'acheteur n'a jamais affaire directement au vendeur.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-emerald-600 pb-2">
              4. Paiements & sécurité
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Comment se passe le paiement ?</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>L'acheteur paie NaturalHairMarket</li>
                  <li>Les frais de 0,99 € sont ajoutés</li>
                  <li>Le vendeur est ensuite payé en totalité par la plateforme</li>
                </ul>
                <p className="text-gray-600 mt-2 font-semibold">
                  👉 Cela garantit la sécurité pour les deux parties.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Quels moyens de paiement sont disponibles ?</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Carte bancaire</li>
                  <li>Paiement sécurisé en ligne</li>
                  <li>Systèmes anti-fraude</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">NaturalHairMarket garde-t-il l'argent ?</h4>
                <p className="text-gray-600">
                  Seulement pendant la transaction.
                  Ensuite, le montant est transféré au vendeur selon les modalités prévues.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Est-ce sécurisé ?</h4>
                <p className="text-gray-600">
                  Oui. Le paiement passe par un système sécurisé et vérifié.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-emerald-600 pb-2">
              5. Expédition
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Qui paie l'envoi ?</h4>
                <p className="text-gray-600 font-semibold">
                  ➡️ L'acheteur paie TOUJOURS les frais d'expédition.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Comment ça fonctionne ?</h4>
                <ol className="list-decimal list-inside text-gray-600 space-y-1 ml-4">
                  <li>L'acheteur règle les frais d'envoi.</li>
                  <li>NaturalHairMarket fournit au vendeur une étiquette prépayée ou instructions.</li>
                  <li>Le vendeur dépose simplement le colis.</li>
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Comment protéger la mèche ?</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>sachet propre</li>
                  <li>mèche bien attachée</li>
                  <li>film ou papier de protection</li>
                  <li>envoi dans enveloppe ou petit colis rigide</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-emerald-600 pb-2">
              6. Qualité des cheveux
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Quels types de cheveux sont acceptés ?</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>naturels</li>
                  <li>colorés</li>
                  <li>gris / blancs</li>
                  <li>méchés</li>
                  <li>décolorés</li>
                  <li>ondulés, bouclés, lisses</li>
                  <li>crépus</li>
                  <li>fines ou épaisses</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Cheveux refusés :</h4>
                <ul className="list-none text-gray-600 space-y-1 ml-4">
                  <li>❌ cheveux synthétiques</li>
                  <li>❌ cheveux ramassés (non coupés)</li>
                  <li>❌ cheveux humides ou sales</li>
                  <li>❌ mèches de moins de 25 cm</li>
                  <li>❌ cheveux emmêlés / moisis / abîmés</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Les cheveux colorés se vendent-ils bien ?</h4>
                <p className="text-gray-600">
                  Oui, mais à un prix légèrement inférieur aux cheveux naturels vierges.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Les cheveux gris naturels se vendent-ils ?</h4>
                <p className="text-gray-600">
                  Oui, et souvent très chers.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-emerald-600 pb-2">
              7. Règles & interdictions
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Puis-je vendre une mèche sans l'attacher ?</h4>
                <p className="text-gray-600">
                  Non. La mèche doit toujours être attachée solidement.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Puis-je vendre plusieurs mèches en une seule annonce ?</h4>
                <p className="text-gray-600 mb-2">Oui, si elles :</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>ont la même longueur</li>
                  <li>sont de la même couleur</li>
                  <li>ont la même texture</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Peut-on vendre des cheveux très courts ?</h4>
                <p className="text-gray-600">
                  Seulement en lot, pour usage FX, tissage ou art.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-emerald-600 pb-2">
              8. Compte & gestion des annonces
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Comment créer un compte ?</h4>
                <p className="text-gray-600">
                  En quelques clics, via l'onglet "Créer un compte".
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Puis-je modifier mon annonce ?</h4>
                <p className="text-gray-600">
                  Oui, depuis votre espace personnel.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Comment supprimer une annonce ?</h4>
                <p className="text-gray-600">
                  Depuis votre tableau de bord → "Supprimer".
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Comment contacter le service après-vente ?</h4>
                <p className="text-gray-600 mb-3">
                  Vous pouvez nous contacter par :
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Email</p>
                      <a href="mailto:naturalhairmarket@gmail.com" className="text-emerald-600 font-semibold hover:underline text-sm">
                        naturalhairmarket@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Téléphone</p>
                      <a href="tel:0972216948" className="text-emerald-600 font-semibold hover:underline text-sm">
                        09 72 21 69 48
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-8 py-4 rounded-b-xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
