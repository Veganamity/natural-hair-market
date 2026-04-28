import { X, Info, Shield, CheckCircle, Heart, Users, TrendingUp, Package, CreditCard, Truck } from 'lucide-react';

interface AboutUsProps {
  onClose: () => void;
}

export function AboutUs({ onClose }: AboutUsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full my-8">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-xl flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Info className="w-8 h-8" />
            {/* H1 unique de la page */}
            <h1 className="text-2xl font-bold">NaturalHairMarket</h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">

          {/* Introduction */}
          <section>
            <p className="text-gray-600 leading-relaxed mb-4">
              NaturalHairMarket est la première marketplace dédiée à la vente et à l'achat de cheveux humains naturels et colorés, coupés dans les salons de coiffure ou par des particuliers en France et en Europe.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Nous avons créé cette plateforme pour offrir une alternative simple, éthique et sécurisée à un marché jusque-là opaque et difficile d'accès.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Notre mission : connecter vendeurs et acheteurs via une plateforme de transaction sécurisée, transparente et équitable.
            </p>
          </section>

          {/* Notre vision */}
          <section className="bg-emerald-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              Notre vision
            </h2>
            <p className="text-gray-600 mb-4">Nous croyons à un marché du cheveu :</p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-800 mb-1">plus transparent</p>
                  <p className="text-gray-600">
                    Les prix varient énormément selon les intermédiaires.
                    NaturalHairMarket rétablit un lien direct entre vendeurs et acheteurs.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-800 mb-1">plus éthique</p>
                  <p className="text-gray-600">
                    Nos annonces proviennent de personnes consentantes, qui vendent leurs cheveux volontairement et de manière encadrée.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-800 mb-1">plus accessible</p>
                  <p className="text-gray-600">
                    Nous voulons rendre les cheveux européens — rares et très demandés — accessibles sans avoir à passer par des circuits complexes ou opaques.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-800 mb-1">plus équitable</p>
                  <p className="text-gray-600">
                    Le vendeur touche 100 % du montant de sa vente.
                    L'acheteur paie uniquement 10 % de commission sur la transaction.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Notre rôle */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-600" />
              Notre rôle : un intermédiaire de confiance
            </h2>
            <p className="text-gray-600 mb-6">
              Contrairement aux plateformes classiques, NaturalHairMarket n'est pas un simple site d'annonces.
              Nous jouons un rôle central à chaque étape de la transaction :
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Vérification des annonces
                </h3>
                <p className="text-gray-600 ml-7">
                  Chaque annonce est contrôlée pour assurer qu'elle correspond à nos critères :
                </p>
                <ul className="list-disc list-inside text-gray-600 ml-11 mt-2 space-y-1">
                  <li>cheveux humains uniquement</li>
                  <li>mèches attachées</li>
                  <li>longueur correcte</li>
                  <li>état conforme</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Sécurisation de la transaction
                </h3>
                <p className="text-gray-600 ml-7">
                  Le paiement passe par NaturalHairMarket pour protéger à la fois le vendeur et l'acheteur.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Organisation de l'envoi
                </h3>
                <p className="text-gray-600 ml-7">
                  Les frais de livraison sont à la charge de l'acheteur, qui organise l'expédition. Le vendeur reçoit des instructions claires.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Service après-vente
                </h3>
                <p className="text-gray-600 ml-7">
                  En cas de doute ou de problème, notre équipe intervient immédiatement.
                  Aucun vendeur et aucun acheteur n'est laissé seul.
                </p>
              </div>
            </div>

            {/* Bloc Comment ça marche */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-5 text-center">Comment ça marche — 3 étapes</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-5 shadow-sm flex flex-col gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 mb-1">1. Annonce &amp; vérification</p>
                    <p className="text-gray-600 text-sm">
                      Cheveux humains uniquement, mèches attachées, longueur et état conformes.
                      Chaque annonce est vérifiée avant mise en ligne.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 shadow-sm flex flex-col gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 mb-1">2. Transaction sécurisée</p>
                    <p className="text-gray-600 text-sm">
                      Le paiement transite par NaturalHairMarket pour protéger vendeurs et acheteurs à chaque étape.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 shadow-sm flex flex-col gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 mb-1">3. Envoi &amp; service après-vente</p>
                    <p className="text-gray-600 text-sm">
                      L'acheteur organise la livraison. En cas de doute ou de litige, notre équipe intervient rapidement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pourquoi NaturalHairMarket existe */}
          <section className="bg-teal-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pourquoi NaturalHairMarket existe ?</h2>
            <p className="text-gray-600 mb-4">Pendant des années, nous avons constaté :</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>des salons qui jetaient ou stockaient des mèches très précieuses</li>
              <li>des particuliers qui n'avaient aucune idée que leurs cheveux avaient de la valeur</li>
              <li>des acheteurs (perruquiers, prothésistes, grossistes) forcés d'importer des cheveux souvent de qualité douteuse</li>
              <li>un marché dominé par des intermédiaires invisibles</li>
            </ul>
            <p className="text-gray-600 mb-2 font-semibold">Nous avons décidé de changer les règles.</p>
            <p className="text-gray-600 mb-2">
              NaturalHairMarket connecte directement ceux qui coupent et ceux qui transforment.
            </p>
            <p className="text-gray-600 font-semibold">
              C'est plus juste pour tout le monde.
            </p>
          </section>

          {/* Nos valeurs */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-emerald-600" />
              Nos valeurs
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-2">1. Transparence</h3>
                <p className="text-gray-600">
                  Chaque mèche doit être clairement décrite : longueur, poids, couleur, état.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-2">2. Sécurité</h3>
                <p className="text-gray-600">
                  Toutes les transactions passent par nous pour protéger chaque utilisateur.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-2">3. Accessibilité</h3>
                <p className="text-gray-600">
                  Les vendeurs ne paient rien. Les acheteurs paient seulement 10 % de commission.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-2">4. Éthique</h3>
                <p className="text-gray-600">
                  Pas de cheveux ramassés, pas de cheveux synthétiques, pas d'ambiguïté.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 md:col-span-2">
                <h3 className="font-bold text-gray-800 mb-2">5. Respect du travail des salons</h3>
                <p className="text-gray-600">
                  Nous aidons les coiffeurs à valoriser un matériau qu'ils ne valorisaient pas.
                </p>
              </div>
            </div>
          </section>

          {/* À qui s'adresse */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-600" />
              À qui s'adresse NaturalHairMarket ?
            </h2>
            <p className="text-gray-500 text-sm mb-5 font-medium">
              NaturalHairMarket vérifie et encadre chaque vente.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-emerald-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Aux vendeurs
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>salons de coiffure</li>
                  <li>particuliers</li>
                  <li>personnes souhaitant valoriser leurs cheveux coupés</li>
                </ul>
              </div>

              <div className="bg-teal-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  Aux acheteurs
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>perruquiers</li>
                  <li>prothésistes capillaires</li>
                  <li>fabricants d'extensions</li>
                  <li>artistes FX, théâtre, cinéma</li>
                  <li>particuliers recherchant de vrais cheveux humains</li>
                </ul>
              </div>
            </div>
            <p className="text-gray-600 mt-4 text-center font-medium">
              Nous rassemblons tous les acteurs de ce marché en un seul endroit.
            </p>
          </section>

          {/* Notre engagement */}
          <section className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Notre engagement</h2>
            <p className="text-gray-600 mb-3">NaturalHairMarket s'engage à :</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>offrir la plus grande transparence sur les cheveux vendus</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>sécuriser chaque étape du processus de transaction</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>maintenir des standards stricts de qualité</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>intervenir dès qu'un problème est signalé</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>développer une communauté sérieuse et respectueuse</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>faire évoluer le marché du cheveu en France et en Europe</span>
              </li>
            </ul>
          </section>

          {/* Le mot de la fondatrice */}
          <section className="bg-white border-2 border-emerald-600 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3 italic">Le mot de la fondatrice</h2>
            <p className="text-gray-600 leading-relaxed italic mb-4">
              « J'ai créé NaturalHairMarket pour mettre fin au gaspillage des cheveux coupés en salon, pour offrir une alternative aux importations douteuses, et pour permettre à chacun de vendre ses cheveux dans un cadre juste et sécurisé. Aujourd'hui, c'est la première plateforme française qui protège à la fois les vendeurs et les acheteurs. »
            </p>
            <p className="text-gray-800 font-semibold text-right">— Fondatrice de NaturalHairMarket</p>
          </section>

          {/* Rejoignez NaturalHairMarket */}
          <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Rejoignez NaturalHairMarket</h2>
            <p className="text-emerald-50 mb-6 leading-relaxed">
              NaturalHairMarket est plus qu'une marketplace : c'est un nouveau standard, une plateforme fiable, éthique et innovante pour tous ceux qui travaillent avec les cheveux humains.
            </p>
            <div className="space-y-3 text-left max-w-2xl mx-auto">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Vendeurs : créez votre annonce gratuitement</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Acheteurs : trouvez des cheveux naturels ou colorés en quelques secondes</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Une équipe est là pour vous accompagner</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Un service après-vente réactif</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Une plateforme sécurisée et simple d'utilisation</span>
              </div>
            </div>
          </section>

          {/* Nous contacter */}
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Nous contacter</h2>
            <div className="space-y-3 max-w-md mx-auto">
              <a
                href="mailto:naturalhairmarket@gmail.com"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition-colors">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Email</p>
                  <span className="text-emerald-600 font-semibold hover:underline">
                    naturalhairmarket@gmail.com
                  </span>
                </div>
              </a>
              <a
                href="tel:0784898647"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition-colors">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Téléphone</p>
                  <span className="text-emerald-600 font-semibold">
                    07 84 89 86 47
                  </span>
                </div>
              </a>
            </div>
            <p className="text-center text-gray-600 text-sm mt-4">
              Notre équipe est disponible pour répondre à toutes vos questions.
            </p>
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
