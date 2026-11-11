import { useEffect } from 'react';
import { FileText, Scale, Users, Shield, Ban, Building2, Gavel, Globe, Lock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function TermsOfService() {
  const { language } = useLanguage();

  useEffect(() => {
    const prevTitle = document.title;
    const m = document.getElementById('meta-description') as HTMLMetaElement | null;
    const prevDesc = m?.content ?? '';
    document.title = language === 'fr' ? 'Mentions Légales & CGU | Natural Hair Market' : 'Legal Notice & Terms of Use | Natural Hair Market';
    if (m) m.content = language === 'fr'
      ? "Mentions légales et Conditions Générales d'Utilisation de Natural Hair Market, marketplace française de vente et d'achat de cheveux naturels humains."
      : "Legal notice and General Terms of Use of Natural Hair Market, a French marketplace for the sale and purchase of natural human hair.";
    return () => { document.title = prevTitle; if (m) m.content = prevDesc; };
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">

          {/* En-tête */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                {language === 'fr' ? 'Mentions Légales' : 'Legal Notice'}
              </h1>
              <p className="text-gray-600 mt-1">{language === 'fr' ? 'Dernière mise à jour : 8 juin 2026' : 'Last updated: June 8, 2026'}</p>
            </div>
          </div>

          <div className="prose prose-emerald max-w-none space-y-8">

            {/* 1. Éditeur du site */}
            <section className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Building2 className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '1. Éditeur du site' : '1. Site Publisher'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'fr' ? (
                  <>
                    Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 pour la
                    Confiance dans l'Économie Numérique (LCEN), les présentes mentions légales sont portées à la
                    connaissance des utilisateurs du site internet <strong>https://naturalhairmarket.com</strong>.
                  </>
                ) : (
                  <>
                    In accordance with the provisions of Articles 6-III and 19 of Law No. 2004-575 of June 21, 2004 for
                    Confidence in the Digital Economy (LCEN), these legal notices are brought to the
                    attention of users of the website <strong>https://naturalhairmarket.com</strong>.
                  </>
                )}
              </p>
              <div className="bg-white rounded-lg p-5 border border-gray-200 space-y-2">
                <p className="text-gray-700"><strong>{language === 'fr' ? 'Nom du site :' : 'Site name:'}</strong> Natural Hair Market</p>
                <p className="text-gray-700"><strong>URL :</strong> https://naturalhairmarket.com</p>
                <p className="text-gray-700"><strong>{language === 'fr' ? 'Éditeur :' : 'Publisher:'}</strong> BUISSON Stéphanie Jeannine</p>
                <p className="text-gray-700"><strong>{language === 'fr' ? 'Forme juridique :' : 'Legal form:'}</strong> {language === 'fr' ? 'Entrepreneur individuel (Micro-entreprise)' : 'Sole proprietorship (Micro-enterprise)'}</p>
                <p className="text-gray-700"><strong>SIREN :</strong> 834 317 794</p>
                <p className="text-gray-700"><strong>SIRET :</strong> 834 317 794 00032</p>
                <p className="text-gray-700"><strong>{language === 'fr' ? 'Immatriculation :' : 'Registration:'}</strong> {language === 'fr' ? 'Immatriculée au Registre du Commerce et des Sociétés (RCS)' : 'Registered with the Trade and Companies Register (RCS)'}</p>
                <p className="text-gray-700">
                  <strong>{language === 'fr' ? 'Activité :' : 'Activity:'}</strong> {language === 'fr' ? (
                    <>Marketplace en ligne spécialisée dans la vente et l'achat de cheveux naturels coupés — activité de courtage et d'intermédiation commerciale.</>
                  ) : (
                    <>Online marketplace specializing in the sale and purchase of cut natural hair — brokerage and commercial intermediary activity.</>
                  )}
                </p>
                <p className="text-gray-700">
                  <strong>{language === 'fr' ? 'TVA :' : 'VAT:'}</strong> {language === 'fr' ? (
                    <>Non assujettie à la TVA conformément à l'article 293 B du Code Général des Impôts (régime de la micro-entreprise — franchise en base de TVA).</>
                  ) : (
                    <>Not subject to VAT in accordance with Article 293 B of the French General Tax Code (micro-enterprise regime — VAT exemption).</>
                  )}
                </p>
                <p className="text-gray-700"><strong>{language === 'fr' ? 'Directeur de la publication :' : 'Publication director:'}</strong> BUISSON Stéphanie Jeannine</p>
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                  <p className="text-gray-700">
                    <strong>{language === 'fr' ? 'Email :' : 'Email:'}</strong>{' '}
                    <a href="mailto:naturalhairmarket@gmail.com" className="text-emerald-600 hover:underline">
                      naturalhairmarket@gmail.com
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <strong>{language === 'fr' ? 'Téléphone (entreprise) :' : 'Phone (business):'}</strong>{' '}
                    <a href="tel:+33767166174" className="text-emerald-600 hover:underline">
                      +33 7 67 16 61 74
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <strong>{language === 'fr' ? 'Téléphone (support/site) :' : 'Phone (support/site):'}</strong>{' '}
                    <a href="tel:+33784898647" className="text-emerald-600 hover:underline">
                      +33 7 84 89 86 47
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Hébergement */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Globe className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '2. Hébergement' : '2. Hosting'}
              </h2>
              <div className="bg-white rounded-lg p-5 border border-gray-200 space-y-2">
                <p className="text-gray-700"><strong>{language === 'fr' ? 'Hébergeur :' : 'Host:'}</strong> OVH SAS (OVHcloud)</p>
                <p className="text-gray-700"><strong>{language === 'fr' ? 'Adresse :' : 'Address:'}</strong> 2 rue Kellermann, 59100 Roubaix, France</p>
                <p className="text-gray-700">
                  <strong>{language === 'fr' ? 'Téléphone :' : 'Phone:'}</strong>{' '}
                  <a href="tel:+33972101007" className="text-emerald-600 hover:underline">
                    +33 9 72 10 10 07
                  </a>{' '}{language === 'fr' ? '(ou 1007)' : '(or 1007)'}
                </p>
                <p className="text-gray-700"><strong>{language === 'fr' ? 'Site web :' : 'Website:'}</strong> https://www.ovhcloud.com</p>
              </div>
            </section>

            {/* 3. Propriété intellectuelle */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '3. Propriété intellectuelle' : '3. Intellectual Property'}
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  {language === 'fr' ? (
                    <>
                      L'ensemble des éléments constituant le site <strong>https://naturalhairmarket.com</strong> (structure,
                      textes, graphismes, logo, icônes, images, sons, logiciels, etc.) est la propriété exclusive de
                      BUISSON Stéphanie Jeannine, ou fait l'objet d'une autorisation d'utilisation.
                    </>
                  ) : (
                    <>
                      All elements constituting the site <strong>https://naturalhairmarket.com</strong> (structure,
                      text, graphics, logo, icons, images, sounds, software, etc.) are the exclusive property of
                      BUISSON Stéphanie Jeannine, or are used with authorization.
                    </>
                  )}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {language === 'fr' ? (
                    <>
                      Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou
                      partielle, du site ou de son contenu, par quelque procédé que ce soit, est interdite sans
                      l'autorisation écrite préalable de l'éditeur, sous peine de poursuites judiciaires.
                    </>
                  ) : (
                    <>
                      Any reproduction, representation, modification, publication, transmission, or distortion, in whole or
                      in part, of the site or its content, by any means whatsoever, is prohibited without
                      the prior written authorization of the publisher, under penalty of legal action.
                    </>
                  )}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {language === 'fr' ? (
                    <>
                      Les contenus publiés par les utilisateurs (annonces, photos) restent leur propriété. En les déposant
                      sur la plateforme, ils accordent à Natural Hair Market une licence non exclusive d'affichage aux
                      fins de fonctionnement du service.
                    </>
                  ) : (
                    <>
                      Content published by users (listings, photos) remains their property. By posting it
                      on the platform, they grant Natural Hair Market a non-exclusive license to display it for
                      the purpose of operating the service.
                    </>
                  )}
                </p>
              </div>
            </section>

            {/* 4. Présentation et activité */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '4. Présentation et activité de la plateforme' : '4. Presentation and Activity of the Platform'}
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  {language === 'fr' ? (
                    <>
                      Natural Hair Market est une marketplace en ligne permettant la mise en relation d'acheteurs et de
                      vendeurs de cheveux naturels coupés (particuliers, salons de coiffure et professionnels).
                    </>
                  ) : (
                    <>
                      Natural Hair Market is an online marketplace that connects buyers and
                      sellers of cut natural hair (individuals, hair salons, and professionals).
                    </>
                  )}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {language === 'fr' ? (
                    <>
                      La plateforme agit en qualité d'intermédiaire et de courtier commercial. Elle ne vend pas
                      directement de produits et n'est ni propriétaire des biens proposés, ni partie prenante dans les
                      transactions conclues entre utilisateurs, sauf à titre de tiers de confiance pour la gestion des
                      paiements et des litiges.
                    </>
                  ) : (
                    <>
                      The platform acts as an intermediary and commercial broker. It does not sell
                      products directly and is neither the owner of the goods offered nor a party to the
                      transactions concluded between users, except as a trusted third party for the management of
                      payments and disputes.
                    </>
                  )}
                </p>
                <div className="bg-white border border-emerald-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'fr' ? (
                      <>
                        Conformément à la Loi pour la Confiance dans l'Économie Numérique (LCEN), Natural Hair Market
                        agit en tant qu'hébergeur de contenus au sens de l'article 6-I-2 de ladite loi. Sa responsabilité
                        ne peut être engagée du fait des contenus publiés par les vendeurs, sauf à avoir eu connaissance
                        de leur caractère manifestement illicite sans agir promptement pour les retirer.
                      </>
                    ) : (
                      <>
                        In accordance with the Law for Confidence in the Digital Economy (LCEN), Natural Hair Market
                        acts as a content host within the meaning of Article 6-I-2 of said law. Its liability
                        cannot be incurred for content published by sellers, unless it had knowledge
                        of its manifestly unlawful nature and failed to act promptly to remove it.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </section>

            {/* 5. Données personnelles */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Lock className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '5. Traitement des données personnelles (RGPD)' : '5. Processing of Personal Data (GDPR)'}
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'fr' ? (
                      <>
                        Dans le cadre de son activité, Natural Hair Market est amenée à collecter et traiter des données
                        à caractère personnel concernant ses utilisateurs (nom, adresse email, adresse postale, numéro de
                        téléphone, données de paiement via Stripe, historique des transactions, etc.).
                      </>
                    ) : (
                      <>
                        In the course of its activity, Natural Hair Market collects and processes personal
                        data concerning its users (name, email address, postal address, phone number,
                        payment data via Stripe, transaction history, etc.).
                      </>
                    )}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'fr' ? (
                      <>
                        Ces traitements sont effectués conformément au Règlement Général sur la Protection des Données
                        (RGPD — Règlement UE 2016/679) et à la loi Informatique et Libertés modifiée.
                      </>
                    ) : (
                      <>
                        These processing operations are carried out in accordance with the General Data Protection
                        Regulation (GDPR — EU Regulation 2016/679) and the amended French Data Protection Act.
                      </>
                    )}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'fr' ? (
                      <>
                        Le responsable du traitement est :{' '}
                        <strong>BUISSON Stéphanie Jeannine</strong>, joignable à l'adresse email{' '}
                        <a href="mailto:naturalhairmarket@gmail.com" className="text-emerald-600 hover:underline">
                          naturalhairmarket@gmail.com
                        </a>.
                      </>
                    ) : (
                      <>
                        The data controller is:{' '}
                        <strong>BUISSON Stéphanie Jeannine</strong>, reachable at the email address{' '}
                        <a href="mailto:naturalhairmarket@gmail.com" className="text-emerald-600 hover:underline">
                          naturalhairmarket@gmail.com
                        </a>.
                      </>
                    )}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
                  <h3 className="font-semibold text-gray-800">{language === 'fr' ? 'Vos droits' : 'Your Rights'}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'fr' ? (
                      <>
                        Conformément à la réglementation en vigueur, vous disposez des droits suivants : droit d'accès,
                        de rectification, d'effacement, de limitation, de portabilité, d'opposition et de retrait du
                        consentement.
                      </>
                    ) : (
                      <>
                        In accordance with applicable regulations, you have the following rights: right of access,
                        rectification, erasure, restriction, portability, objection, and withdrawal of
                        consent.
                      </>
                    )}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'fr' ? (
                      <>
                        Pour exercer ces droits, adressez votre demande à :{' '}
                        <a href="mailto:naturalhairmarket@gmail.com" className="text-emerald-600 font-semibold hover:underline">
                          naturalhairmarket@gmail.com
                        </a>
                      </>
                    ) : (
                      <>
                        To exercise these rights, send your request to:{' '}
                        <a href="mailto:naturalhairmarket@gmail.com" className="text-emerald-600 font-semibold hover:underline">
                          naturalhairmarket@gmail.com
                        </a>
                      </>
                    )}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'fr' ? (
                      <>
                        Vous avez également le droit d'introduire une réclamation auprès de la{' '}
                        <strong>CNIL</strong> — www.cnil.fr.
                      </>
                    ) : (
                      <>
                        You also have the right to lodge a complaint with the{' '}
                        <strong>CNIL</strong> (French Data Protection Authority) — www.cnil.fr.
                      </>
                    )}
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    {language === 'fr' ? (
                      <>
                        Pour plus d'informations, veuillez consulter notre{' '}
                        <strong>Politique de Confidentialité</strong> disponible sur ce site.
                      </>
                    ) : (
                      <>
                        For more information, please consult our{' '}
                        <strong>Privacy Policy</strong> available on this site.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '6. Cookies' : '6. Cookies'}
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  {language === 'fr' ? (
                    <>
                      Le site est susceptible d'utiliser des cookies afin d'améliorer l'expérience utilisateur, de
                      mémoriser les préférences de navigation et d'assurer le bon fonctionnement des services
                      (authentification, session). Des cookies tiers peuvent être déposés par{' '}
                      <strong>Stripe</strong> pour le traitement des paiements.
                    </>
                  ) : (
                    <>
                      The site may use cookies to improve the user experience,
                      remember browsing preferences, and ensure the proper functioning of services
                      (authentication, session). Third-party cookies may be placed by{' '}
                      <strong>Stripe</strong> for payment processing.
                    </>
                  )}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {language === 'fr' ? (
                    <>
                      Conformément à la réglementation applicable, le dépôt de cookies non essentiels est soumis à votre
                      consentement préalable. Vous pouvez à tout moment paramétrer votre navigateur pour refuser ou
                      supprimer les cookies déjà déposés.
                    </>
                  ) : (
                    <>
                      In accordance with applicable regulations, the placement of non-essential cookies is subject to your
                      prior consent. You may at any time configure your browser to refuse or
                      delete cookies that have already been placed.
                    </>
                  )}
                </p>
              </div>
            </section>

            {/* 7. Liens hypertextes */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Globe className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '7. Liens hypertextes' : '7. Hypertext Links'}
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  {language === 'fr' ? (
                    <>
                      Le site peut contenir des liens hypertextes renvoyant vers d'autres sites internet. Natural Hair
                      Market décline toute responsabilité quant à leur contenu, leurs politiques de confidentialité ou
                      leurs pratiques.
                    </>
                  ) : (
                    <>
                      The site may contain hypertext links to other websites. Natural Hair
                      Market disclaims all responsibility for their content, privacy policies, or
                      practices.
                    </>
                  )}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {language === 'fr' ? (
                    <>
                      Tout lien hypertexte pointant vers le présent site doit faire l'objet d'une autorisation écrite
                      préalable de l'éditeur.
                    </>
                  ) : (
                    <>
                      Any hypertext link pointing to this site requires prior written
                      authorization from the publisher.
                    </>
                  )}
                </p>
              </div>
            </section>

            {/* 8. Litiges */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Gavel className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '8. Litiges et règlement en ligne des litiges (RLL)' : '8. Disputes and Online Dispute Resolution (ODR)'}
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'fr' ? (
                      <>
                        En cas de litige, l'utilisateur est invité à contacter Natural Hair Market en priorité à{' '}
                        <a href="mailto:naturalhairmarket@gmail.com" className="text-emerald-600 font-semibold hover:underline">
                          naturalhairmarket@gmail.com
                        </a>{' '}afin de rechercher une solution amiable.
                      </>
                    ) : (
                      <>
                        In the event of a dispute, the user is invited to contact Natural Hair Market in the first instance at{' '}
                        <a href="mailto:naturalhairmarket@gmail.com" className="text-emerald-600 font-semibold hover:underline">
                          naturalhairmarket@gmail.com
                        </a>{' '}to seek an amicable solution.
                      </>
                    )}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'fr' ? (
                      <>À défaut de résolution amiable, le consommateur peut recourir gratuitement au médiateur suivant :</>
                    ) : (
                      <>If no amicable resolution is reached, the consumer may refer the matter free of charge to the following mediator:</>
                    )}
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="font-semibold text-gray-800">AME Conso – Association Médiation Consommation</p>
                    <p className="text-gray-700">{language === 'fr' ? 'Site : www.mediationconso-ame.com' : 'Website: www.mediationconso-ame.com'}</p>
                    <p className="text-gray-700">{language === 'fr' ? 'Adresse : 11 Place Dauphine, 75001 Paris' : 'Address: 11 Place Dauphine, 75001 Paris'}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
                  <h3 className="font-semibold text-gray-800">{language === 'fr' ? 'Plateforme européenne de règlement en ligne des litiges' : 'European Online Dispute Resolution Platform'}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'fr' ? (
                      <>
                        Conformément à l'article 14 du Règlement (UE) n° 524/2013 du 21 mai 2013, la Commission
                        européenne a mis en place une plateforme de règlement en ligne des litiges (RLL) accessible à :
                      </>
                    ) : (
                      <>
                        In accordance with Article 14 of Regulation (EU) No. 524/2013 of May 21, 2013, the European
                        Commission has set up an online dispute resolution (ODR) platform accessible at:
                      </>
                    )}
                  </p>
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'fr' ? (
                      <>
                        Cette plateforme permet aux consommateurs européens de soumettre un litige relatif à un achat ou
                        service effectué en ligne auprès d'un professionnel établi dans l'Union européenne.
                      </>
                    ) : (
                      <>
                        This platform allows European consumers to submit a dispute relating to a purchase or
                        service made online from a professional established in the European Union.
                      </>
                    )}
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">{language === 'fr' ? 'Droit applicable et juridiction compétente' : 'Applicable Law and Jurisdiction'}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'fr' ? (
                      <>
                        Les présentes mentions légales sont régies par le droit français. En cas de litige non résolu par
                        voie amiable ou de médiation, les tribunaux français seront seuls compétents.
                      </>
                    ) : (
                      <>
                        These legal notices are governed by French law. In the event of a dispute not resolved through
                        amicable means or mediation, the French courts shall have sole jurisdiction.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </section>

            {/* 9. Conditions d'utilisation */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                {language === "fr" ? "9. Conditions d'utilisation de la plateforme" : '9. Terms of Use of the Platform'}
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">{language === 'fr' ? '9.1 Inscription' : '9.1 Registration'}</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">{language === "fr" ? "Pour utiliser la plateforme, l'utilisateur doit :" : 'To use the platform, the user must:'}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === "fr" ? "Être âgé d'au moins 18 ans" : 'Be at least 18 years of age'}</li>
                    <li>{language === 'fr' ? 'Fournir des informations exactes et à jour' : 'Provide accurate and up-to-date information'}</li>
                    <li>{language === 'fr' ? 'Maintenir la confidentialité de ses identifiants' : 'Maintain the confidentiality of their login credentials'}</li>
                    <li>{language === 'fr' ? 'Être responsable des actions réalisées depuis son compte' : 'Be responsible for actions performed from their account'}</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">{language === 'fr' ? '9.2 Classement des annonces' : '9.2 Listing Ranking'}</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    {language === 'fr' ? (
                      <>Conformément aux obligations d'information prévues par le droit européen, le classement des annonces est basé sur :</>
                    ) : (
                      <>In accordance with the information requirements under European law, the ranking of listings is based on:</>
                    )}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{language === 'fr' ? 'La date de publication (les plus récentes en premier)' : 'Publication date (most recent first)'}</li>
                    <li>{language === 'fr' ? 'La pertinence par rapport aux filtres sélectionnés (longueur, couleur, etc.)' : 'Relevance to the selected filters (length, color, etc.)'}</li>
                  </ul>
                  <p className="text-gray-700 mt-3 font-semibold">
                    {language === "fr" ? "Aucun paiement ne permet de modifier la position d'une annonce." : 'No payment can modify the position of a listing.'}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">{language === 'fr' ? '9.3 Paiements' : '9.3 Payments'}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'fr' ? (
                      <>
                        Les paiements sont sécurisés et traités par <strong>Stripe</strong>. Natural Hair Market ne
                        stocke aucune donnée bancaire. Les fonds sont bloqués jusqu'à confirmation de réception par
                        l'acheteur. Une commission de 5 % est prélevée sur chaque transaction réussie.
                      </>
                    ) : (
                      <>
                        Payments are secured and processed by <strong>Stripe</strong>. Natural Hair Market does
                        not store any banking data. Funds are held until receipt is confirmed by
                        the buyer. A 5% commission is charged on each successful transaction.
                      </>
                    )}
                  </p>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">{language === 'fr' ? '9.4 Droit de rétractation' : '9.4 Right of Withdrawal'}</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    {language === 'fr' ? (
                      <>Conformément à l'article L221-28 du Code de la consommation :</>
                    ) : (
                      <>In accordance with Article L221-28 of the French Consumer Code:</>
                    )}
                  </p>
                  <div className="bg-white border border-yellow-400 rounded-lg p-4">
                    <p className="text-gray-800 font-bold">
                      {language === 'fr' ? (
                        <>Le droit de rétractation de 14 jours ne s'applique pas aux cheveux coupés une fois l'emballage ouvert. Aucun retour n'est possible dans ce cas.</>
                      ) : (
                        <>The 14-day right of withdrawal does not apply to cut hair once the packaging has been opened. No return is possible in this case.</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 10. Comportements interdits */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Ban className="w-6 h-6 text-red-600" />
                {language === 'fr' ? '10. Comportements interdits' : '10. Prohibited Behavior'}
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">{language === 'fr' ? 'Sont strictement interdits sur la plateforme :' : 'The following are strictly prohibited on the platform:'}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>{language === "fr" ? "La création de faux comptes ou usurpation d'identité" : 'Creating fake accounts or identity theft'}</li>
                  <li>{language === 'fr' ? 'La publication de fausses annonces ou de photos trouvées sur Internet' : 'Posting fake listings or photos found on the Internet'}</li>
                  <li>{language === 'fr' ? 'La vente de cheveux synthétiques présentés comme naturels' : 'Selling synthetic hair presented as natural'}</li>
                  <li>{language === 'fr' ? 'Le contournement de la plateforme pour éviter les frais de commission' : 'Bypassing the platform to avoid commission fees'}</li>
                  <li>{language === "fr" ? "Le harcèlement, les menaces ou comportements abusifs envers d'autres utilisateurs" : 'Harassment, threats, or abusive behavior toward other users'}</li>
                  <li>{language === "fr" ? "Le phishing, le piratage ou toute tentative d'accès non autorisé" : 'Phishing, hacking, or any attempt at unauthorized access'}</li>
                  <li>{language === 'fr' ? 'La manipulation davis ou de notations' : 'Manipulation of reviews or ratings'}</li>
                  <li>{language === 'fr' ? 'Toute utilisation illégale du site' : 'Any illegal use of the site'}</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  {language === 'fr' ? (
                    <>Tout manquement pourra entraîner la suspension ou la suppression du compte, sans préavis.</>
                  ) : (
                    <>Any breach may result in suspension or deletion of the account, without notice.</>
                  )}
                </p>
              </div>
            </section>

            {/* 11. Limitation de responsabilité */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? '11. Limitation de responsabilité' : '11. Limitation of Liability'}
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  {language === 'fr' ? (
                    <>Natural Hair Market ne saurait être tenue responsable en cas :</>
                  ) : (
                    <>Natural Hair Market shall not be held liable in the event of:</>
                  )}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>{language === "fr" ? "D'interruption temporaire du service pour maintenance" : 'Temporary interruption of the service for maintenance'}</li>
                  <li>{language === "fr" ? "De dommages résultant d'une intrusion, d'un virus ou d'une défaillance technique" : 'Damage resulting from an intrusion, a virus, or a technical failure'}</li>
                  <li>{language === 'fr' ? 'De contenus inexacts ou frauduleux publiés par des utilisateurs' : 'Inaccurate or fraudulent content posted by users'}</li>
                  <li>{language === 'fr' ? 'De litiges entre acheteurs et vendeurs relatifs à la qualité des produits' : 'Disputes between buyers and sellers regarding product quality'}</li>
                  <li>{language === "fr" ? "D'allergies, d'infections ou de tout problème de santé lié à l'utilisation des cheveux achetés" : 'Allergies, infections, or any health problem related to the use of purchased hair'}</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  {language === 'fr' ? (
                    <>L'utilisation du site se fait sous la pleine et entière responsabilité de l'utilisateur.</>
                  ) : (
                    <>Use of the site is the sole and entire responsibility of the user.</>
                  )}
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
                {language === 'fr' ? 'Contact' : 'Contact'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'fr' ? (
                  <>Pour toute question relative aux présentes mentions légales :</>
                ) : (
                  <>For any questions regarding these legal notices:</>
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
                    <p className="text-sm text-gray-600 font-medium">{language === 'fr' ? 'Téléphone support' : 'Support phone'}</p>
                    <a href="tel:+33784898647" className="text-emerald-600 font-semibold hover:underline">
                      +33 7 84 89 86 47
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
                    <p className="text-sm text-gray-600 font-medium">{language === 'fr' ? 'Téléphone entreprise' : 'Business phone'}</p>
                    <a href="tel:+33767166174" className="text-emerald-600 font-semibold hover:underline">
                      +33 7 67 16 61 74
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <div className="bg-emerald-600 text-white rounded-lg p-6 mt-8">
              <p className="text-center font-semibold">
                {language === 'fr' ? (
                  <>En naviguant sur https://naturalhairmarket.com, vous reconnaissez avoir pris connaissance des présentes mentions légales et les accepter.</>
                ) : (
                  <>By browsing https://naturalhairmarket.com, you acknowledge that you have read and accept these legal notices.</>
                )}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
