import { Shield, Lock, Eye, Database, Mail, User, FileText } from 'lucide-react';

export function PrivacyPolicy() {
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
                Politique de Confidentialité
              </h1>
              <p className="text-gray-600 mt-1">Dernière mise à jour : 18 novembre 2025</p>
            </div>
          </div>

          <div className="prose prose-emerald max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Bienvenue sur NaturalHairMarket. Nous prenons très au sérieux la protection de vos données personnelles.
                Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations
                lorsque vous utilisez notre plateforme de marketplace dédiée aux cheveux naturels.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Database className="w-6 h-6 text-emerald-600" />
                Données que nous collectons
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Informations de compte</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Nom complet</li>
                    <li>Adresse email</li>
                    <li>Numéro de téléphone</li>
                    <li>Localisation</li>
                    <li>Biographie (optionnelle)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Informations de livraison</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Adresse postale complète</li>
                    <li>Code postal et ville</li>
                    <li>Pays</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Informations de paiement</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Informations bancaires (gérées par Stripe)</li>
                    <li>Historique des transactions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Contenu utilisateur</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Annonces et descriptions de produits</li>
                    <li>Photos des cheveux</li>
                    <li>Messages et offres</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Eye className="w-6 h-6 text-emerald-600" />
                Comment nous utilisons vos données
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Gérer votre compte :</strong> Pour créer et maintenir votre profil utilisateur</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Faciliter les transactions :</strong> Pour permettre l'achat et la vente de cheveux naturels entre utilisateurs</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Traiter les paiements :</strong> Pour sécuriser les transactions financières via Stripe</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Organiser les livraisons :</strong> Pour permettre l'envoi des produits achetés</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Communication :</strong> Pour vous envoyer des notifications importantes concernant vos transactions</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Améliorer nos services :</strong> Pour optimiser l'expérience utilisateur et développer de nouvelles fonctionnalités</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Sécurité :</strong> Pour prévenir la fraude et garantir la sécurité de la plateforme</span>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <User className="w-6 h-6 text-emerald-600" />
                Partage de vos données
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous ne vendons jamais vos données personnelles. Nous partageons vos informations uniquement dans les cas suivants :
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
                <p className="text-gray-700">
                  <strong className="text-gray-800">Avec les autres utilisateurs :</strong> Votre nom, localisation et informations
                  de contact sont visibles par les acheteurs/vendeurs avec qui vous transigez.
                </p>
                <p className="text-gray-700">
                  <strong className="text-gray-800">Avec Stripe :</strong> Nos prestataires de paiement reçoivent les informations
                  nécessaires pour traiter les transactions de manière sécurisée.
                </p>
                <p className="text-gray-700">
                  <strong className="text-gray-800">Conformité légale :</strong> Si la loi l'exige, nous pouvons divulguer vos
                  informations aux autorités compétentes.
                </p>
                <p className="text-gray-700">
                  <strong className="text-gray-800">Prestataires de services :</strong> Nous partageons des données avec des
                  prestataires tiers qui nous aident à exploiter notre plateforme (hébergement, analyse, support client).
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Lock className="w-6 h-6 text-emerald-600" />
                Sécurité de vos données
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données :
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Chiffrement</h3>
                  <p className="text-sm text-gray-700">Toutes les données sensibles sont chiffrées en transit et au repos</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Authentification sécurisée</h3>
                  <p className="text-sm text-gray-700">Utilisation de Supabase Auth pour une gestion sécurisée des identités</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Contrôle d'accès</h3>
                  <p className="text-sm text-gray-700">Row Level Security (RLS) pour protéger vos données dans la base de données</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Paiements sécurisés</h3>
                  <p className="text-sm text-gray-700">Stripe gère tous les paiements selon les normes PCI-DSS</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Vos droits</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Conformément au RGPD et aux lois applicables sur la protection des données, vous disposez des droits suivants :
              </p>
              <div className="space-y-3">
                <div className="border-l-4 border-emerald-600 pl-4">
                  <h3 className="font-semibold text-gray-800">Droit d'accès</h3>
                  <p className="text-gray-700 text-sm">Vous pouvez demander une copie de toutes vos données personnelles</p>
                </div>
                <div className="border-l-4 border-emerald-600 pl-4">
                  <h3 className="font-semibold text-gray-800">Droit de rectification</h3>
                  <p className="text-gray-700 text-sm">Vous pouvez modifier vos informations directement depuis votre profil</p>
                </div>
                <div className="border-l-4 border-emerald-600 pl-4">
                  <h3 className="font-semibold text-gray-800">Droit à l'effacement</h3>
                  <p className="text-gray-700 text-sm">Vous pouvez demander la suppression de votre compte et de vos données</p>
                </div>
                <div className="border-l-4 border-emerald-600 pl-4">
                  <h3 className="font-semibold text-gray-800">Droit à la portabilité</h3>
                  <p className="text-gray-700 text-sm">Vous pouvez obtenir vos données dans un format structuré et couramment utilisé</p>
                </div>
                <div className="border-l-4 border-emerald-600 pl-4">
                  <h3 className="font-semibold text-gray-800">Droit d'opposition</h3>
                  <p className="text-gray-700 text-sm">Vous pouvez vous opposer à certains traitements de vos données</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Conservation des données</h2>
              <p className="text-gray-700 leading-relaxed">
                Nous conservons vos données personnelles aussi longtemps que nécessaire pour vous fournir nos services et
                respecter nos obligations légales. En général :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
                <li>Les données de compte sont conservées tant que votre compte est actif</li>
                <li>Les données de transaction sont conservées pendant 10 ans pour des raisons fiscales et légales</li>
                <li>Les données de paiement sont gérées et conservées par Stripe selon leurs propres politiques</li>
                <li>Après suppression de votre compte, vos données sont anonymisées ou supprimées sous 30 jours,
                    sauf obligation légale de conservation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Cookies et technologies similaires</h2>
              <p className="text-gray-700 leading-relaxed">
                Nous utilisons des cookies essentiels pour assurer le bon fonctionnement de la plateforme, notamment pour :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
                <li>Maintenir votre session de connexion</li>
                <li>Mémoriser vos préférences</li>
                <li>Assurer la sécurité de votre compte</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Modifications de cette politique</h2>
              <p className="text-gray-700 leading-relaxed">
                Nous pouvons mettre à jour cette politique de confidentialité de temps en temps. Nous vous informerons
                de tout changement important par email ou via une notification sur la plateforme. La date de dernière
                mise à jour est indiquée en haut de cette page.
              </p>
            </section>

            <section className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-emerald-600" />
                Nous contacter
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pour toute question concernant cette politique de confidentialité ou l'exercice de vos droits,
                vous pouvez nous contacter :
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
          </div>
        </div>
      </div>
    </div>
  );
}
