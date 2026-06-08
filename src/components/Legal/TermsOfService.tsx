import { FileText, Scale, Users, Shield, Ban, Building2, Gavel, Globe, Lock } from 'lucide-react';

export function TermsOfService() {
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
                Mentions Légales
              </h1>
              <p className="text-gray-600 mt-1">Dernière mise à jour : 8 juin 2026</p>
            </div>
          </div>

          <div className="prose prose-emerald max-w-none space-y-8">

            {/* 1. Éditeur du site */}
            <section className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Building2 className="w-6 h-6 text-emerald-600" />
                1. Éditeur du site
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 pour la
                Confiance dans l'Économie Numérique (LCEN), les présentes mentions légales sont portées à la
                connaissance des utilisateurs du site internet <strong>https://naturalhairmarket.com</strong>.
              </p>
              <div className="bg-white rounded-lg p-5 border border-gray-200 space-y-2">
                <p className="text-gray-700"><strong>Nom du site :</strong> Natural Hair Market</p>
                <p className="text-gray-700"><strong>URL :</strong> https://naturalhairmarket.com</p>
                <p className="text-gray-700"><strong>Éditeur :</strong> BUISSON Stéphanie Jeannine</p>
                <p className="text-gray-700"><strong>Forme juridique :</strong> Entrepreneur individuel (Micro-entreprise)</p>
                <p className="text-gray-700"><strong>SIREN :</strong> 834 317 794</p>
                <p className="text-gray-700"><strong>SIRET :</strong> 834 317 794 00032</p>
                <p className="text-gray-700"><strong>Immatriculation :</strong> Immatriculée au Registre du Commerce et des Sociétés (RCS)</p>
                <p className="text-gray-700">
                  <strong>Activité :</strong> Marketplace en ligne spécialisée dans la vente et l'achat de cheveux
                  naturels coupés — activité de courtage et d'intermédiation commerciale.
                </p>
                <p className="text-gray-700">
                  <strong>TVA :</strong> Non assujettie à la TVA conformément à l'article 293 B du Code Général des
                  Impôts (régime de la micro-entreprise — franchise en base de TVA).
                </p>
                <p className="text-gray-700"><strong>Directeur de la publication :</strong> BUISSON Stéphanie Jeannine</p>
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                  <p className="text-gray-700">
                    <strong>Email :</strong>{' '}
                    <a href="mailto:naturalhairmarket@gmail.com" className="text-emerald-600 hover:underline">
                      naturalhairmarket@gmail.com
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Téléphone (entreprise) :</strong>{' '}
                    <a href="tel:+33767166174" className="text-emerald-600 hover:underline">
                      +33 7 67 16 61 74
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Téléphone (support/site) :</strong>{' '}
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
                2. Hébergement
              </h2>
              <div className="bg-white rounded-lg p-5 border border-gray-200 space-y-2">
                <p className="text-gray-700"><strong>Hébergeur :</strong> OVH SAS (OVHcloud)</p>
                <p className="text-gray-700"><strong>Adresse :</strong> 2 rue Kellermann, 59100 Roubaix, France</p>
                <p className="text-gray-700">
                  <strong>Téléphone :</strong>{' '}
                  <a href="tel:+33972101007" className="text-emerald-600 hover:underline">
                    +33 9 72 10 10 07
                  </a>{' '}(ou 1007)
                </p>
                <p className="text-gray-700"><strong>Site web :</strong> https://www.ovhcloud.com</p>
              </div>
            </section>

            {/* 3. Propriété intellectuelle */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                3. Propriété intellectuelle
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  L'ensemble des éléments constituant le site <strong>https://naturalhairmarket.com</strong> (structure,
                  textes, graphismes, logo, icônes, images, sons, logiciels, etc.) est la propriété exclusive de
                  BUISSON Stéphanie Jeannine, ou fait l'objet d'une autorisation d'utilisation.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou
                  partielle, du site ou de son contenu, par quelque procédé que ce soit, est interdite sans
                  l'autorisation écrite préalable de l'éditeur, sous peine de poursuites judiciaires.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Les contenus publiés par les utilisateurs (annonces, photos) restent leur propriété. En les déposant
                  sur la plateforme, ils accordent à Natural Hair Market une licence non exclusive d'affichage aux
                  fins de fonctionnement du service.
                </p>
              </div>
            </section>

            {/* 4. Présentation et activité */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                4. Présentation et activité de la plateforme
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  Natural Hair Market est une marketplace en ligne permettant la mise en relation d'acheteurs et de
                  vendeurs de cheveux naturels coupés (particuliers, salons de coiffure et professionnels).
                </p>
                <p className="text-gray-700 leading-relaxed">
                  La plateforme agit en qualité d'intermédiaire et de courtier commercial. Elle ne vend pas
                  directement de produits et n'est ni propriétaire des biens proposés, ni partie prenante dans les
                  transactions conclues entre utilisateurs, sauf à titre de tiers de confiance pour la gestion des
                  paiements et des litiges.
                </p>
                <div className="bg-white border border-emerald-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    Conformément à la Loi pour la Confiance dans l'Économie Numérique (LCEN), Natural Hair Market
                    agit en tant qu'hébergeur de contenus au sens de l'article 6-I-2 de ladite loi. Sa responsabilité
                    ne peut être engagée du fait des contenus publiés par les vendeurs, sauf à avoir eu connaissance
                    de leur caractère manifestement illicite sans agir promptement pour les retirer.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. Données personnelles */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Lock className="w-6 h-6 text-emerald-600" />
                5. Traitement des données personnelles (RGPD)
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
                  <p className="text-gray-700 leading-relaxed">
                    Dans le cadre de son activité, Natural Hair Market est amenée à collecter et traiter des données
                    à caractère personnel concernant ses utilisateurs (nom, adresse email, adresse postale, numéro de
                    téléphone, données de paiement via Stripe, historique des transactions, etc.).
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Ces traitements sont effectués conformément au Règlement Général sur la Protection des Données
                    (RGPD — Règlement UE 2016/679) et à la loi Informatique et Libertés modifiée.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Le responsable du traitement est :{' '}
                    <strong>BUISSON Stéphanie Jeannine</strong>, joignable à l'adresse email{' '}
                    <a href="mailto:naturalhairmarket@gmail.com" className="text-emerald-600 hover:underline">
                      naturalhairmarket@gmail.com
                    </a>.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
                  <h3 className="font-semibold text-gray-800">Vos droits</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Conformément à la réglementation en vigueur, vous disposez des droits suivants : droit d'accès,
                    de rectification, d'effacement, de limitation, de portabilité, d'opposition et de retrait du
                    consentement.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Pour exercer ces droits, adressez votre demande à :{' '}
                    <a href="mailto:naturalhairmarket@gmail.com" className="text-emerald-600 font-semibold hover:underline">
                      naturalhairmarket@gmail.com
                    </a>
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Vous avez également le droit d'introduire une réclamation auprès de la{' '}
                    <strong>CNIL</strong> — www.cnil.fr.
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    Pour plus d'informations, veuillez consulter notre{' '}
                    <strong>Politique de Confidentialité</strong> disponible sur ce site.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                6. Cookies
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  Le site est susceptible d'utiliser des cookies afin d'améliorer l'expérience utilisateur, de
                  mémoriser les préférences de navigation et d'assurer le bon fonctionnement des services
                  (authentification, session). Des cookies tiers peuvent être déposés par{' '}
                  <strong>Stripe</strong> pour le traitement des paiements.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Conformément à la réglementation applicable, le dépôt de cookies non essentiels est soumis à votre
                  consentement préalable. Vous pouvez à tout moment paramétrer votre navigateur pour refuser ou
                  supprimer les cookies déjà déposés.
                </p>
              </div>
            </section>

            {/* 7. Liens hypertextes */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Globe className="w-6 h-6 text-emerald-600" />
                7. Liens hypertextes
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  Le site peut contenir des liens hypertextes renvoyant vers d'autres sites internet. Natural Hair
                  Market décline toute responsabilité quant à leur contenu, leurs politiques de confidentialité ou
                  leurs pratiques.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Tout lien hypertexte pointant vers le présent site doit faire l'objet d'une autorisation écrite
                  préalable de l'éditeur.
                </p>
              </div>
            </section>

            {/* 8. Litiges */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Gavel className="w-6 h-6 text-emerald-600" />
                8. Litiges et règlement en ligne des litiges (RLL)
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
                  <p className="text-gray-700 leading-relaxed">
                    En cas de litige, l'utilisateur est invité à contacter Natural Hair Market en priorité à{' '}
                    <a href="mailto:naturalhairmarket@gmail.com" className="text-emerald-600 font-semibold hover:underline">
                      naturalhairmarket@gmail.com
                    </a>{' '}afin de rechercher une solution amiable.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    À défaut de résolution amiable, le consommateur peut recourir gratuitement au médiateur suivant :
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="font-semibold text-gray-800">AME Conso – Association Médiation Consommation</p>
                    <p className="text-gray-700">Site : www.mediationconso-ame.com</p>
                    <p className="text-gray-700">Adresse : 11 Place Dauphine, 75001 Paris</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
                  <h3 className="font-semibold text-gray-800">Plateforme européenne de règlement en ligne des litiges</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Conformément à l'article 14 du Règlement (UE) n° 524/2013 du 21 mai 2013, la Commission
                    européenne a mis en place une plateforme de règlement en ligne des litiges (RLL) accessible à :
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
                    Cette plateforme permet aux consommateurs européens de soumettre un litige relatif à un achat ou
                    service effectué en ligne auprès d'un professionnel établi dans l'Union européenne.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Droit applicable et juridiction compétente</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Les présentes mentions légales sont régies par le droit français. En cas de litige non résolu par
                    voie amiable ou de médiation, les tribunaux français seront seuls compétents.
                  </p>
                </div>
              </div>
            </section>

            {/* 9. Conditions d'utilisation */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                9. Conditions d'utilisation de la plateforme
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">9.1 Inscription</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">Pour utiliser la plateforme, l'utilisateur doit :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Être âgé d'au moins 18 ans</li>
                    <li>Fournir des informations exactes et à jour</li>
                    <li>Maintenir la confidentialité de ses identifiants</li>
                    <li>Être responsable des actions réalisées depuis son compte</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">9.2 Classement des annonces</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    Conformément aux obligations d'information prévues par le droit européen, le classement des
                    annonces est basé sur :
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>La date de publication (les plus récentes en premier)</li>
                    <li>La pertinence par rapport aux filtres sélectionnés (longueur, couleur, etc.)</li>
                  </ul>
                  <p className="text-gray-700 mt-3 font-semibold">
                    Aucun paiement ne permet de modifier la position d'une annonce.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">9.3 Paiements</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Les paiements sont sécurisés et traités par <strong>Stripe</strong>. Natural Hair Market ne
                    stocke aucune donnée bancaire. Les fonds sont bloqués jusqu'à confirmation de réception par
                    l'acheteur. Une commission de 5 % est prélevée sur chaque transaction réussie.
                  </p>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">9.4 Droit de rétractation</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    Conformément à l'article L221-28 du Code de la consommation :
                  </p>
                  <div className="bg-white border border-yellow-400 rounded-lg p-4">
                    <p className="text-gray-800 font-bold">
                      Le droit de rétractation de 14 jours ne s'applique pas aux cheveux coupés une fois
                      l'emballage ouvert. Aucun retour n'est possible dans ce cas.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 10. Comportements interdits */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Ban className="w-6 h-6 text-red-600" />
                10. Comportements interdits
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-700 mb-3 font-semibold">Sont strictement interdits sur la plateforme :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>La création de faux comptes ou usurpation d'identité</li>
                  <li>La publication de fausses annonces ou de photos trouvées sur Internet</li>
                  <li>La vente de cheveux synthétiques présentés comme naturels</li>
                  <li>Le contournement de la plateforme pour éviter les frais de commission</li>
                  <li>Le harcèlement, les menaces ou comportements abusifs envers d'autres utilisateurs</li>
                  <li>Le phishing, le piratage ou toute tentative d'accès non autorisé</li>
                  <li>La manipulation d'avis ou de notations</li>
                  <li>Toute utilisation illégale du site</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Tout manquement pourra entraîner la suspension ou la suppression du compte, sans préavis.
                </p>
              </div>
            </section>

            {/* 11. Limitation de responsabilité */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
                11. Limitation de responsabilité
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  Natural Hair Market ne saurait être tenue responsable en cas :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>D'interruption temporaire du service pour maintenance</li>
                  <li>De dommages résultant d'une intrusion, d'un virus ou d'une défaillance technique</li>
                  <li>De contenus inexacts ou frauduleux publiés par des utilisateurs</li>
                  <li>De litiges entre acheteurs et vendeurs relatifs à la qualité des produits</li>
                  <li>D'allergies, d'infections ou de tout problème de santé lié à l'utilisation des cheveux achetés</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  L'utilisation du site se fait sous la pleine et entière responsabilité de l'utilisateur.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
                Contact
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pour toute question relative aux présentes mentions légales :
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
                    <p className="text-sm text-gray-600 font-medium">Téléphone support</p>
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
                    <p className="text-sm text-gray-600 font-medium">Téléphone entreprise</p>
                    <a href="tel:+33767166174" className="text-emerald-600 font-semibold hover:underline">
                      +33 7 67 16 61 74
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <div className="bg-emerald-600 text-white rounded-lg p-6 mt-8">
              <p className="text-center font-semibold">
                En naviguant sur https://naturalhairmarket.com, vous reconnaissez avoir pris connaissance des présentes mentions légales et les accepter.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
