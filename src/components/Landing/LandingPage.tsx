import { Search, Euro, ShoppingBag, TrendingUp, CheckCircle, Sparkles, Users, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Database } from '../../lib/database.types';
import { ListingCard } from '../Listings/ListingCard';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSelector } from '../LanguageSelector';

type Listing = Database['public']['Tables']['listings']['Row'];

interface LandingPageProps {
  onGetStarted: () => void;
  onNavigate?: (view: 'faq' | 'about' | 'terms' | 'sales' | 'refund' | 'safety' | 'seller-rules' | 'buyer-rules' | 'privacy') => void;
}

export function LandingPage({ onGetStarted, onNavigate }: LandingPageProps) {
  const { t } = useLanguage();
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setFeaturedListings(data || []);
    } catch (error) {
      console.error('Error fetching featured listings:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-6 md:py-8 px-4 relative">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/file_0000000094ac71f49db79e27f27b239c.png"
              alt={t('landing.title')}
              className="h-32 w-auto md:h-40"
            />
          </div>
          <p className="text-base sm:text-lg md:text-xl mb-1 font-semibold">
            {t('landing.title')}
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-2 font-medium">
            {t('landing.subtitle')}
          </p>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center mb-3 md:mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs sm:text-sm md:text-sm font-semibold">{t('landing.sellersFree')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs sm:text-sm md:text-sm font-semibold">{t('landing.buyersFee')}</span>
            </div>
          </div>
          <button
            onClick={onGetStarted}
            className="bg-white text-emerald-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
          >
            {t('landing.getStarted')}
          </button>
        </div>
      </header>

      <section className="py-3 md:py-4 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-2 md:mb-3">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1">
              {t('landing.recentListings')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              {t('landing.recentListingsSubtitle')}
            </p>
          </div>

          {!loading && featuredListings.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
              {featuredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onClick={onGetStarted}
                />
              ))}
            </div>
          )}

          <div className="text-center">
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
            >
              {t('landing.viewAllListings')}
            </button>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{t('landing.forEveryone')}</h3>
              <p className="text-gray-600">
                {t('landing.forEveryoneDesc')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{t('landing.transparent')}</h3>
              <p className="text-gray-600">
                {t('landing.transparentDesc')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{t('landing.quality')}</h3>
              <p className="text-gray-600">
                {t('landing.qualityDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-semibold mb-3 text-sm">
              <ShoppingBag className="w-4 h-4" />
              Pour les acheteurs
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Achetez des cheveux humains naturels dès 0,99€ de frais
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Parcourez des centaines de mèches disponibles, mises en ligne chaque jour
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Types de cheveux disponibles</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Cheveux européens naturels</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Mèches longues 25cm, 30cm, 40cm, 50cm, 60cm+</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Cheveux bruns, blonds, châtains, cuivrés</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Cheveux gris et blancs naturels (très recherchés)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Cheveux colorés (rouge, bleu, violet, noir carbone)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Cheveux méchés / balayage / ombré</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Cheveux lisses, ondulés, bouclés</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Mèches épaisses pour extensions</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-xl border border-teal-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Chaque annonce contient</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Longueur exacte</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Poids en grammes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Couleur et état (naturel, coloré, décoloré)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Origine de la mèche (pays)</span>
                </li>
              </ul>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-200">
                <div className="flex items-center gap-2 mb-2">
                  <Euro className="w-5 h-5 text-teal-600" />
                  <h4 className="font-bold text-gray-800 text-sm">Frais acheteur : 0,99€</h4>
                </div>
                <p className="text-gray-700 text-sm mb-2">
                  Appliqué uniquement au moment de l'achat
                </p>
                <p className="text-gray-600 text-sm">
                  ✓ Aucun abonnement<br />
                  ✓ Aucun coût caché<br />
                  ✓ Prix de la mèche + 0,99€ de frais
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Idéal pour :</h3>
            <div className="grid md:grid-cols-5 gap-3">
              <div className="bg-white p-3 rounded-lg text-center">
                <p className="font-semibold text-gray-800">Perruquiers</p>
              </div>
              <div className="bg-white p-3 rounded-lg text-center">
                <p className="font-semibold text-gray-800 text-sm">Grossistes</p>
              </div>
              <div className="bg-white p-3 rounded-lg text-center">
                <p className="font-semibold text-gray-800 text-sm">Fabricants d'extensions</p>
              </div>
              <div className="bg-white p-3 rounded-lg text-center">
                <p className="font-semibold text-gray-800 text-sm">Artistes FX</p>
              </div>
              <div className="bg-white p-3 rounded-lg text-center">
                <p className="font-semibold text-gray-800 text-sm">Particuliers exigeants</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10 px-4 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-3 py-1.5 rounded-full font-semibold mb-3 text-sm">
              <TrendingUp className="w-4 h-4" />
              Pour les vendeurs
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Vendez vos cheveux coupés – 100% gratuit pour les salons
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Vous coupez des mèches longues chaque semaine ? Valorisez-les !
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Avantages vendeurs</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Publiez gratuitement</p>
                      <p className="text-gray-600 text-sm">Aucun frais d'inscription ou de publication</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Aucune commission</p>
                      <p className="text-gray-600 text-sm">Gardez 100% de vos revenus</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Vous gagnez 100% du prix</p>
                      <p className="text-gray-600 text-sm">C'est l'acheteur qui paie 0,99€</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Valorisez ce que vous jetiez</p>
                      <p className="text-gray-600 text-sm">Transformez vos chutes en revenus</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Vous pouvez vendre</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700">Cheveux naturels non traités</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700">Cheveux colorés</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700">Cheveux méchés ou décolorés</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700">Cheveux gris ou blancs naturels</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700">Cheveux lisses / ondulés / bouclés</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700">Mèches épaisses ou fines</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700">Cheveux longs (25cm à 70+ cm)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Processus simple en 6 étapes</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-2">1</div>
                <p className="font-semibold text-gray-800">Attachez proprement la mèche</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-2">2</div>
                <p className="font-semibold text-gray-800 text-sm">Mesurez la longueur</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-2">3</div>
                <p className="font-semibold text-gray-800 text-sm">Indiquez poids, couleur, état</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-2">4</div>
                <p className="font-semibold text-gray-800 text-sm">Fixez votre prix</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-2">5</div>
                <p className="font-semibold text-gray-800 text-sm">Publiez gratuitement</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-2">6</div>
                <p className="font-semibold text-gray-800">Touchez 100% du montant</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
            Pourquoi choisir notre Marketplace ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-emerald-300 transition-colors">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Gratuit pour les vendeurs</h3>
              <p className="text-gray-600">Les salons ne payent rien. Jamais.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-emerald-300 transition-colors">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Euro className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">0,99€ pour les acheteurs</h3>
              <p className="text-gray-600">Un frais fixe, transparent, appliqué au paiement.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-emerald-300 transition-colors">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Cheveux français & européens</h3>
              <p className="text-gray-600">Les plus recherchés au monde.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-emerald-300 transition-colors">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Annonces vérifiées</h3>
              <p className="text-gray-600">Qualité, propreté, photo réelle.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-emerald-300 transition-colors">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Transparence totale</h3>
              <p className="text-gray-600">Aucun intermédiaire, aucune revente.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-emerald-300 transition-colors">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Plateforme éthique</h3>
              <p className="text-gray-600">Valorisation → lutte contre le gaspillage.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
            Comment fonctionne la Marketplace ?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-emerald-600 mb-4">Pour les vendeurs</h3>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="font-bold text-emerald-600">1.</span>
                  <span className="text-gray-700">Photographiez la mèche</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-emerald-600">2.</span>
                  <span className="text-gray-700">Remplissez les informations</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-emerald-600">3.</span>
                  <span className="text-gray-700">Publiez gratuitement</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-emerald-600">4.</span>
                  <span className="text-gray-700">Recevez des offres d'acheteurs</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-emerald-600">5.</span>
                  <span className="text-gray-700">Vous encaissez 100% du prix</span>
                </li>
              </ol>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-teal-600 mb-4">Pour les acheteurs</h3>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="font-bold text-teal-600">1.</span>
                  <span className="text-gray-700">Trouvez votre mèche idéale</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-teal-600">2.</span>
                  <span className="text-gray-700">Achat immédiat ou offre d'achat</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-teal-600">3.</span>
                  <span className="text-gray-700">Payez la mèche + 0,99€</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-teal-600">4.</span>
                  <span className="text-gray-700">Réceptionnez chez vous</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Le futur du marché du cheveu humain en France
          </h2>
          <div className="space-y-2 mb-6 text-base">
            <p className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Le vendeur ne paie rien
            </p>
            <p className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              L'acheteur paie un frais minimum et transparent
            </p>
            <p className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Le marché devient équitable
            </p>
            <p className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Les cheveux européens trouvent leur plateforme spécialisée
            </p>
            <p className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Les salons gagnent de l'argent avec ce qu'ils jetaient
            </p>
          </div>
          <button
            onClick={onGetStarted}
            className="bg-white text-emerald-700 px-6 py-3 rounded-lg text-base font-bold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl"
          >
            Se connecter
          </button>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Marketplace de cheveux humains naturels & colorés</h3>
            <p className="mb-4 text-sm">
              La première marketplace française dédiée aux cheveux naturels & colorés humains
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6 max-w-2xl mx-auto">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-white font-semibold">Email</h4>
              </div>
              <a href="mailto:naturalhairmarket@gmail.com" className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">
                naturalhairmarket@gmail.com
              </a>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h4 className="text-white font-semibold">Téléphone</h4>
              </div>
              <a href="tel:0972216948" className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">
                09 72 21 69 48
              </a>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {onNavigate && (
              <>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                >
                  À propos
                </button>
                <button
                  onClick={() => onNavigate('faq')}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                >
                  FAQ
                </button>
                <button
                  onClick={() => onNavigate('terms')}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                >
                  CGU
                </button>
                <button
                  onClick={() => onNavigate('sales')}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                >
                  CGV
                </button>
                <button
                  onClick={() => onNavigate('refund')}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                >
                  Remboursements
                </button>
                <button
                  onClick={() => onNavigate('safety')}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                >
                  Sécurité & Qualité
                </button>
                <button
                  onClick={() => onNavigate('seller-rules')}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                >
                  Règlement vendeur
                </button>
                <button
                  onClick={() => onNavigate('buyer-rules')}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                >
                  Règlement acheteur
                </button>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                >
                  Politique de confidentialité
                </button>
              </>
            )}
          </div>

          <p className="text-sm text-gray-400 text-center">
            © 2025 Marketplace de cheveux humains naturels & colorés. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
