import { useEffect } from 'react';
import { Shield, Lock, Eye, Database, Mail, User, FileText } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function PrivacyPolicy() {
  const { language } = useLanguage();

  useEffect(() => {
    const prevTitle = document.title;
    const m = document.getElementById('meta-description') as HTMLMetaElement | null;
    const prevDesc = m?.content ?? '';
    document.title = language === 'fr' ? 'Politique de Confidentialité | Natural Hair Market' : 'Privacy Policy | Natural Hair Market';
    if (m) m.content = language === 'fr'
      ? 'Politique de confidentialité de Natural Hair Market : collecte, utilisation et protection de vos données personnelles conformément au RGPD.'
      : 'Natural Hair Market Privacy Policy: collection, use, and protection of your personal data in accordance with the GDPR.';
    return () => { document.title = prevTitle; if (m) m.content = prevDesc; };
  }, [language]);

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
                {language === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy'}
              </h1>
              <p className="text-gray-600 mt-1">{language === 'fr' ? 'Dernière mise à jour : 18 novembre 2025' : 'Last updated: November 18, 2025'}</p>
            </div>
          </div>

          <div className="prose prose-emerald max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? 'Introduction' : 'Introduction'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {language === 'fr' ? (
                  <>
                    Bienvenue sur NaturalHairMarket. Nous prenons très au sérieux la protection de vos données personnelles.
                    Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations
                    lorsque vous utilisez notre plateforme de marketplace dédiée aux cheveux naturels.
                  </>
                ) : (
                  <>
                    Welcome to NaturalHairMarket. We take the protection of your personal data very seriously.
                    This privacy policy explains how we collect, use, store, and protect your information
                    when you use our marketplace platform dedicated to natural hair.
                  </>
                )}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Database className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? 'Données que nous collectons' : 'Data We Collect'}
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{language === 'fr' ? 'Informations de compte' : 'Account Information'}</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'Nom complet' : 'Full name'}</li>
                    <li>{language === 'fr' ? 'Adresse email' : 'Email address'}</li>
                    <li>{language === 'fr' ? 'Numéro de téléphone' : 'Phone number'}</li>
                    <li>{language === 'fr' ? 'Localisation' : 'Location'}</li>
                    <li>{language === 'fr' ? 'Biographie (optionnelle)' : 'Biography (optional)'}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{language === 'fr' ? 'Informations de livraison' : 'Delivery Information'}</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'Adresse postale complète' : 'Full postal address'}</li>
                    <li>{language === 'fr' ? 'Code postal et ville' : 'Postal code and city'}</li>
                    <li>{language === 'fr' ? 'Pays' : 'Country'}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{language === 'fr' ? 'Informations de paiement' : 'Payment Information'}</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'Informations bancaires (gérées par Stripe)' : 'Banking information (managed by Stripe)'}</li>
                    <li>{language === 'fr' ? 'Historique des transactions' : 'Transaction history'}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{language === 'fr' ? 'Contenu utilisateur' : 'User Content'}</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'Annonces et descriptions de produits' : 'Listings and product descriptions'}</li>
                    <li>{language === 'fr' ? 'Photos des cheveux' : 'Hair photos'}</li>
                    <li>{language === 'fr' ? 'Messages et offres' : 'Messages and offers'}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Eye className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? 'Comment nous utilisons vos données' : 'How We Use Your Data'}
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>{language === 'fr' ? 'Gérer votre compte :' : 'Manage your account:'}</strong> {language === 'fr' ? 'Pour créer et maintenir votre profil utilisateur' : 'To create and maintain your user profile'}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>{language === 'fr' ? 'Faciliter les transactions :' : 'Facilitate transactions:'}</strong> {language === "fr" ? "Pour permettre l'achat et la vente de cheveux naturels entre utilisateurs" : 'To enable the buying and selling of natural hair between users'}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>{language === 'fr' ? 'Traiter les paiements :' : 'Process payments:'}</strong> {language === 'fr' ? 'Pour sécuriser les transactions financières via Stripe' : 'To secure financial transactions via Stripe'}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>{language === 'fr' ? 'Organiser les livraisons :' : 'Organize deliveries:'}</strong> {language === "fr" ? "Pour permettre l'envoi des produits achetés" : 'To enable the shipping of purchased products'}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>{language === 'fr' ? 'Communication :' : 'Communication:'}</strong> {language === 'fr' ? 'Pour vous envoyer des notifications importantes concernant vos transactions' : 'To send you important notifications regarding your transactions'}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>{language === 'fr' ? 'Améliorer nos services :' : 'Improve our services:'}</strong> {language === "fr" ? "Pour optimiser l'expérience utilisateur et développer de nouvelles fonctionnalités" : 'To optimize the user experience and develop new features'}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>{language === 'fr' ? 'Sécurité :' : 'Security:'}</strong> {language === 'fr' ? 'Pour prévenir la fraude et garantir la sécurité de la plateforme' : 'To prevent fraud and ensure the security of the platform'}</span>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <User className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? 'Partage de vos données' : 'Sharing Your Data'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'fr' ? (
                  <>Nous ne vendons jamais vos données personnelles. Nous partageons vos informations uniquement dans les cas suivants :</>
                ) : (
                  <>We never sell your personal data. We share your information only in the following cases:</>
                )}
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
                <p className="text-gray-700">
                  <strong className="text-gray-800">{language === 'fr' ? 'Avec les autres utilisateurs :' : 'With other users:'}</strong> {language === 'fr' ? (
                    <>Votre nom, localisation et informations de contact sont visibles par les acheteurs/vendeurs avec qui vous transigez.</>
                  ) : (
                    <>Your name, location, and contact information are visible to the buyers/sellers you transact with.</>
                  )}
                </p>
                <p className="text-gray-700">
                  <strong className="text-gray-800">{language === 'fr' ? 'Avec Stripe :' : 'With Stripe:'}</strong> {language === 'fr' ? (
                    <>Nos prestataires de paiement reçoivent les informations nécessaires pour traiter les transactions de manière sécurisée.</>
                  ) : (
                    <>Our payment providers receive the information necessary to process transactions securely.</>
                  )}
                </p>
                <p className="text-gray-700">
                  <strong className="text-gray-800">{language === 'fr' ? 'Conformité légale :' : 'Legal compliance:'}</strong> {language === 'fr' ? (
                    <>Si la loi l'exige, nous pouvons divulguer vos informations aux autorités compétentes.</>
                  ) : (
                    <>If required by law, we may disclose your information to the relevant authorities.</>
                  )}
                </p>
                <p className="text-gray-700">
                  <strong className="text-gray-800">{language === 'fr' ? 'Prestataires de services :' : 'Service providers:'}</strong> {language === 'fr' ? (
                    <>Nous partageons des données avec des prestataires tiers qui nous aident à exploiter notre plateforme (hébergement, analyse, support client).</>
                  ) : (
                    <>We share data with third-party providers who help us operate our platform (hosting, analytics, customer support).</>
                  )}
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Lock className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? 'Sécurité de vos données' : 'Security of Your Data'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'fr' ? (
                  <>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données :</>
                ) : (
                  <>We implement appropriate technical and organizational security measures to protect your data:</>
                )}
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{language === 'fr' ? 'Chiffrement' : 'Encryption'}</h3>
                  <p className="text-sm text-gray-700">{language === 'fr' ? 'Toutes les données sensibles sont chiffrées en transit et au repos' : 'All sensitive data is encrypted in transit and at rest'}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{language === 'fr' ? 'Authentification sécurisée' : 'Secure Authentication'}</h3>
                  <p className="text-sm text-gray-700">{language === 'fr' ? 'Utilisation de Supabase Auth pour une gestion sécurisée des identités' : 'Use of Supabase Auth for secure identity management'}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{language === "fr" ? "Contrôle d'accès" : 'Access Control'}</h3>
                  <p className="text-sm text-gray-700">{language === 'fr' ? 'Row Level Security (RLS) pour protéger vos données dans la base de données' : 'Row Level Security (RLS) to protect your data in the database'}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{language === 'fr' ? 'Paiements sécurisés' : 'Secure Payments'}</h3>
                  <p className="text-sm text-gray-700">{language === 'fr' ? 'Stripe gère tous les paiements selon les normes PCI-DSS' : 'Stripe handles all payments in accordance with PCI-DSS standards'}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{language === 'fr' ? 'Vos droits' : 'Your Rights'}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'fr' ? (
                  <>Conformément au RGPD et aux lois applicables sur la protection des données, vous disposez des droits suivants :</>
                ) : (
                  <>In accordance with the GDPR and applicable data protection laws, you have the following rights:</>
                )}
              </p>
              <div className="space-y-3">
                <div className="border-l-4 border-emerald-600 pl-4">
                  <h3 className="font-semibold text-gray-800">{language === "fr" ? "Droit d'accès" : 'Right of Access'}</h3>
                  <p className="text-gray-700 text-sm">{language === 'fr' ? 'Vous pouvez demander une copie de toutes vos données personnelles' : 'You may request a copy of all your personal data'}</p>
                </div>
                <div className="border-l-4 border-emerald-600 pl-4">
                  <h3 className="font-semibold text-gray-800">{language === 'fr' ? 'Droit de rectification' : 'Right to Rectification'}</h3>
                  <p className="text-gray-700 text-sm">{language === 'fr' ? 'Vous pouvez modifier vos informations directement depuis votre profil' : 'You can update your information directly from your profile'}</p>
                </div>
                <div className="border-l-4 border-emerald-600 pl-4">
                  <h3 className="font-semibold text-gray-800">{language === "fr" ? "Droit à l'effacement" : 'Right to Erasure'}</h3>
                  <p className="text-gray-700 text-sm">{language === 'fr' ? 'Vous pouvez demander la suppression de votre compte et de vos données' : 'You may request the deletion of your account and your data'}</p>
                </div>
                <div className="border-l-4 border-emerald-600 pl-4">
                  <h3 className="font-semibold text-gray-800">{language === 'fr' ? 'Droit à la portabilité' : 'Right to Data Portability'}</h3>
                  <p className="text-gray-700 text-sm">{language === 'fr' ? 'Vous pouvez obtenir vos données dans un format structuré et couramment utilisé' : 'You may obtain your data in a structured and commonly used format'}</p>
                </div>
                <div className="border-l-4 border-emerald-600 pl-4">
                  <h3 className="font-semibold text-gray-800">{language === "fr" ? "Droit d'opposition" : 'Right to Object'}</h3>
                  <p className="text-gray-700 text-sm">{language === 'fr' ? 'Vous pouvez vous opposer à certains traitements de vos données' : 'You may object to certain processing of your data'}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{language === 'fr' ? 'Conservation des données' : 'Data Retention'}</h2>
              <p className="text-gray-700 leading-relaxed">
                {language === 'fr' ? (
                  <>Nous conservons vos données personnelles aussi longtemps que nécessaire pour vous fournir nos services et respecter nos obligations légales. En général :</>
                ) : (
                  <>We retain your personal data for as long as necessary to provide our services and meet our legal obligations. In general:</>
                )}
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
                <li>{language === 'fr' ? 'Les données de compte sont conservées tant que votre compte est actif' : 'Account data is retained as long as your account is active'}</li>
                <li>{language === 'fr' ? 'Les données de transaction sont conservées pendant 10 ans pour des raisons fiscales et légales' : 'Transaction data is retained for 10 years for tax and legal reasons'}</li>
                <li>{language === 'fr' ? 'Les données de paiement sont gérées et conservées par Stripe selon leurs propres politiques' : 'Payment data is managed and retained by Stripe according to their own policies'}</li>
                <li>{language === 'fr' ? (
                  <>Après suppression de votre compte, vos données sont anonymisées ou supprimées sous 30 jours, sauf obligation légale de conservation</>
                ) : (
                  <>After deletion of your account, your data is anonymized or deleted within 30 days, except where legal retention obligations apply</>
                )}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{language === 'fr' ? 'Cookies et technologies similaires' : 'Cookies and Similar Technologies'}</h2>
              <p className="text-gray-700 leading-relaxed">
                {language === 'fr' ? (
                  <>Nous utilisons des cookies essentiels pour assurer le bon fonctionnement de la plateforme, notamment pour :</>
                ) : (
                  <>We use essential cookies to ensure the proper functioning of the platform, including for:</>
                )}
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
                <li>{language === 'fr' ? 'Maintenir votre session de connexion' : 'Maintaining your login session'}</li>
                <li>{language === 'fr' ? 'Mémoriser vos préférences' : 'Remembering your preferences'}</li>
                <li>{language === 'fr' ? 'Assurer la sécurité de votre compte' : 'Ensuring the security of your account'}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{language === 'fr' ? 'Modifications de cette politique' : 'Changes to This Policy'}</h2>
              <p className="text-gray-700 leading-relaxed">
                {language === 'fr' ? (
                  <>Nous pouvons mettre à jour cette politique de confidentialité de temps en temps. Nous vous informerons de tout changement important par email ou via une notification sur la plateforme. La date de dernière mise à jour est indiquée en haut de cette page.</>
                ) : (
                  <>We may update this privacy policy from time to time. We will notify you of any significant changes by email or via a notification on the platform. The date of the last update is shown at the top of this page.</>
                )}
              </p>
            </section>

            <section className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? 'Nous contacter' : 'Contact Us'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'fr' ? (
                  <>Pour toute question concernant cette politique de confidentialité ou l'exercice de vos droits, vous pouvez nous contacter :</>
                ) : (
                  <>For any questions regarding this privacy policy or the exercise of your rights, you may contact us:</>
                )}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
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
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
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
          </div>
        </div>
      </div>
    </div>
  );
}
