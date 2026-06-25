import { Search, Euro, ShoppingBag, TrendingUp, CheckCircle, Sparkles, Users, Shield, ChevronDown, Scissors, Package, CreditCard, Camera, Tag, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Database } from '../../lib/database.types';
import { ListingCard } from '../Listings/ListingCard';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSelector } from '../LanguageSelector';

type Listing = Database['public']['Tables']['listings']['Row'];

interface LandingPageProps {
  onGetStarted: () => void;
  onSell?: () => void;
  onLogin?: () => void;
  onNavigate?: (view: 'faq' | 'about' | 'terms' | 'sales' | 'refund' | 'safety' | 'seller-rules' | 'sell-my-hair' | 'buyer-rules' | 'privacy' | 'guide-coupe' | 'partners') => void;
}

export function LandingPage({ onGetStarted, onSell, onLogin, onNavigate }: LandingPageProps) {
  const { t } = useLanguage();
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroSearch, setHeroSearch] = useState('');
  const [activeHowTab, setActiveHowTab] = useState<'buyer' | 'seller'>('buyer');

  const faqItems = [
    {
      question: "Quels types de cheveux puis-je acheter ou vendre ?",
      answer: "Sur Natural Hair Market, vous pouvez acheter et vendre tous types de cheveux humains : cheveux européens, cheveux brésiliens, cheveux indiens, lisses, bouclés, ou même des cheveux naturels colorés. La seule règle est de proposer des cheveux de qualité."
    },
    {
      question: "La plateforme est-elle sécurisée pour les acheteurs et les vendeurs ?",
      answer: "Absolument. Notre marketplace met en relation les acheteurs et les vendeurs dans un environnement de confiance, conçu spécifiquement pour le marché des cheveux naturels."
    },
    {
      question: "Pourquoi choisir des cheveux humains naturels ?",
      answer: "Les cheveux humains naturels offrent une durée de vie beaucoup plus longue, un aspect indétectable et peuvent être coiffés, lissés ou colorés exactement comme vos propres cheveux, contrairement aux fibres synthétiques."
    }
  ];

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
        .limit(12);

      if (error) throw error;
      setFeaturedListings(data || []);
      setError('');
    } catch (error: any) {
      console.error('Error fetching featured listings:', error);
      if (error?.message === 'Failed to fetch' || error?.name === 'TypeError') {
        setError('Impossible de charger les annonces. Vérifiez votre connexion internet.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HEADER ─── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/file_0000000094ac71f49db79e27f27b239c.png"
              alt="Natural Hair Market"
              className="h-9 w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <button
              onClick={onLogin ?? onGetStarted}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors"
            >
              Se connecter
            </button>
            <button
              onClick={onSell ?? onLogin ?? onGetStarted}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold text-sm transition-all transform hover:scale-105 shadow-md"
            >
              Déposer une annonce
            </button>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 text-white">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-700/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-700/50 border border-emerald-500/40 text-emerald-200 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            La marketplace de référence en Europe
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
            Vos cheveux naturels<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">méritent une seconde vie</span>
          </h1>

          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Achetez ou vendez des mèches de haute qualité directement entre particuliers et professionnels. Gratuit pour les vendeurs, transparent pour tous.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="flex items-center bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 flex-1 px-4">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onGetStarted()}
                  placeholder="Rechercher des cheveux (couleur, longueur…)"
                  className="flex-1 py-4 text-gray-800 placeholder-gray-400 bg-transparent outline-none text-sm md:text-base"
                />
              </div>
              <button
                onClick={onGetStarted}
                className="px-5 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors whitespace-nowrap"
              >
                Rechercher
              </button>
            </div>
          </div>

          {/* Two main CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onSell ?? onLogin ?? onGetStarted}
              className="flex items-center gap-2.5 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl w-full sm:w-auto justify-center"
            >
              <Scissors className="w-5 h-5" />
              Je vends mes cheveux
            </button>
            <button
              onClick={onGetStarted}
              className="flex items-center gap-2.5 px-8 py-4 bg-white/10 hover:bg-white/20 border-2 border-white/50 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 backdrop-blur-sm w-full sm:w-auto justify-center"
            >
              <ShoppingBag className="w-5 h-5" />
              Je cherche des cheveux
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-10 text-emerald-200 text-sm">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Publication gratuite pour les vendeurs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>10% de commission acheteur seulement</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMMENT ÇA MARCHE EN 3 ÉTAPES ─── */}
      <section className="py-14 md:py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full font-semibold text-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Simple & Rapide
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Comment ça marche ?
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              En 3 étapes seulement, achetez ou vendez vos cheveux en toute sérénité.
            </p>
          </div>

          {/* Tab selector */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => setActiveHowTab('buyer')}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  activeHowTab === 'buyer'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  J'achète
                </span>
              </button>
              <button
                onClick={() => setActiveHowTab('seller')}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  activeHowTab === 'seller'
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Scissors className="w-4 h-4" />
                  Je vends
                </span>
              </button>
            </div>
          </div>

          {activeHowTab === 'buyer' ? (
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  step: '1',
                  icon: Search,
                  color: 'emerald',
                  title: 'Parcourez les annonces',
                  desc: 'Filtrez par couleur, longueur, poids et budget. Des centaines de mèches disponibles chaque jour.'
                },
                {
                  step: '2',
                  icon: CreditCard,
                  color: 'teal',
                  title: 'Commandez en sécurité',
                  desc: 'Achat immédiat ou faites une offre. Paiement sécurisé par carte bancaire. +10% de commission transparente.'
                },
                {
                  step: '3',
                  icon: Package,
                  color: 'emerald',
                  title: 'Recevez à domicile',
                  desc: 'Livraison rapide avec suivi de colis. Vos cheveux naturels vous parviennent emballés avec soin.'
                }
              ].map(({ step, icon: Icon, color, title, desc }) => (
                <div key={step} className="relative group">
                  <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-100 transition-all h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 text-${color}-600`} />
                      </div>
                      <span className="text-5xl font-extrabold text-gray-100 leading-none mt-1">{step}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                  {parseInt(step) < 3 && (
                    <div className="hidden md:block absolute top-10 -right-5 z-10 text-gray-200 text-2xl font-bold">→</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  step: '1',
                  icon: Camera,
                  color: 'amber',
                  title: 'Photographiez & mesurez',
                  desc: 'Prenez des photos de qualité, mesurez la longueur et le poids de votre mèche. C\'est tout !'
                },
                {
                  step: '2',
                  icon: Tag,
                  color: 'orange',
                  title: 'Publiez gratuitement',
                  desc: 'Créez votre annonce en quelques clics, fixez votre prix librement. La publication est 100% gratuite.'
                },
                {
                  step: '3',
                  icon: Truck,
                  color: 'amber',
                  title: 'Encaissez 100%',
                  desc: 'Une fois vendu, envoyez la mèche et recevez la totalité de votre prix. Aucun frais vendeur.'
                }
              ].map(({ step, icon: Icon, color, title, desc }) => (
                <div key={step} className="relative group">
                  <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:border-amber-100 transition-all h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 text-${color}-600`} />
                      </div>
                      <span className="text-5xl font-extrabold text-gray-100 leading-none mt-1">{step}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                  {parseInt(step) < 3 && (
                    <div className="hidden md:block absolute top-10 -right-5 z-10 text-gray-200 text-2xl font-bold">→</div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            {activeHowTab === 'buyer' ? (
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-base transition-all transform hover:scale-105 shadow-lg"
              >
                <Search className="w-4 h-4" />
                Parcourir les annonces
              </button>
            ) : (
              <button
                onClick={onSell ?? onLogin ?? onGetStarted}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-base transition-all transform hover:scale-105 shadow-lg"
              >
                <Scissors className="w-4 h-4" />
                Déposer mon annonce gratuitement
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── ANNONCES RÉCENTES ─── */}
      <section className="py-10 md:py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-800">
                {t('landing.recentListings')}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {t('landing.recentListingsSubtitle')}
              </p>
            </div>
            <button
              onClick={onGetStarted}
              className="hidden sm:flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition-colors"
            >
              Voir tout →
            </button>
          </div>

          {!loading && featuredListings.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-6">
              {featuredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onClick={onGetStarted}
                />
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 max-w-2xl mx-auto">
              <p className="font-semibold mb-2">{error}</p>
            </div>
          )}

          <div className="text-center mt-2">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
            >
              {t('landing.viewAllListings')}
            </button>
          </div>
        </div>
      </section>

      {/* ─── ACHETEURS / VENDEURS (split) ─── */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Acheteurs */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold mb-4 text-sm">
                <ShoppingBag className="w-4 h-4" />
                Pour les acheteurs
              </div>
              <h3 className="text-2xl font-extrabold text-gray-800 mb-2">
                Trouvez vos cheveux idéaux
              </h3>
              <p className="text-gray-600 mb-5">
                Des centaines de mèches de haute qualité disponibles. 10% de commission transparente, aucun abonnement.
              </p>
              <ul className="space-y-2.5 mb-6">
                {['Cheveux européens naturels', 'Mèches 15cm à 70cm+', 'Colorés, gris, bouclés, lisses', 'Qualité vérifiée, photos réelles'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all transform hover:scale-[1.02] shadow-md"
              >
                Parcourir les annonces
              </button>
            </div>

            {/* Vendeurs */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold mb-4 text-sm">
                <TrendingUp className="w-4 h-4" />
                Pour les vendeurs
              </div>
              <h3 className="text-2xl font-extrabold text-gray-800 mb-2">
                Vendez gratuitement
              </h3>
              <p className="text-gray-600 mb-5">
                Particuliers, salons, professionnels — publiez vos mèches et encaissez 100% du prix affiché. Zéro frais vendeur.
              </p>
              <ul className="space-y-2.5 mb-6">
                {['Publication 100% gratuite', 'Aucune commission vendeur', 'Vous touchez votre prix intégral', 'Paiement rapide et sécurisé'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={onSell ?? onLogin ?? onGetStarted}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition-all transform hover:scale-[1.02] shadow-md"
              >
                Déposer une annonce
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── POURQUOI NOUS ─── */}
      <section className="py-10 md:py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 text-center mb-8">
            Pourquoi choisir Natural Hair Market ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: CheckCircle, title: 'Gratuit pour les vendeurs', desc: 'Aucun frais d\'inscription ni de publication. Jamais.', color: 'emerald' },
              { icon: Euro, title: '10% de commission acheteur', desc: 'Une commission transparente, appliquée au paiement seulement.', color: 'teal' },
              { icon: Sparkles, title: 'Cheveux français & européens', desc: 'Les plus recherchés au monde pour leur qualité exceptionnelle.', color: 'emerald' },
              { icon: Shield, title: 'Annonces vérifiées', desc: 'Qualité, propreté, photo réelle. Chaque annonce est contrôlée.', color: 'teal' },
              { icon: Search, title: 'Transparence totale', desc: 'Aucun intermédiaire, aucune revente, prix fixé par le vendeur.', color: 'emerald' },
              { icon: Users, title: 'Plateforme éthique', desc: 'Valorisation des cheveux coupés — lutte contre le gaspillage.', color: 'teal' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
                <div className={`w-11 h-11 bg-${color}-100 rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANDE ─── */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-r from-emerald-700 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Prêt à rejoindre la marketplace ?
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
            Des milliers de mèches vous attendent. Inscrivez-vous gratuitement et commencez dès aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onSell ?? onLogin ?? onGetStarted}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
            >
              Vendre mes cheveux
            </button>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border-2 border-white/50 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 backdrop-blur-sm"
            >
              Acheter des cheveux
            </button>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-3">
              Foire Aux Questions
            </h2>
            <p className="text-gray-500">
              Tout ce que vous devez savoir sur l'achat et la vente de cheveux naturels.
            </p>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors"
                  aria-expanded={openFaq === index}
                >
                  <span className="font-semibold text-gray-800 pr-4">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-emerald-600 flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}
                >
                  <div className="px-6 pb-5 pt-1 text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-gray-900 text-gray-300 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <img
              src="/file_0000000094ac71f49db79e27f27b239c.png"
              alt="Natural Hair Market"
              className="h-10 w-auto mx-auto mb-3 opacity-80"
            />
            <p className="mb-4 text-sm text-gray-400">
              La première marketplace française dédiée aux cheveux naturels & colorés humains
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6 max-w-xl mx-auto">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-white font-semibold text-sm">Email</h4>
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
                <h4 className="text-white font-semibold text-sm">Téléphone</h4>
              </div>
              <a href="tel:+33784898647" className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">
                +33 7 84 89 86 47
              </a>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6">
            <a href="/a-propos" onClick={(e) => { e.preventDefault(); onNavigate?.('about'); }} className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">À propos</a>
            <a href="/mentions-legales" onClick={(e) => { e.preventDefault(); onNavigate?.('terms'); }} className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">Mentions légales</a>
            <a href="/faq" onClick={(e) => { e.preventDefault(); onNavigate?.('faq'); }} className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">FAQ</a>
            <a href="/cgu" onClick={(e) => { e.preventDefault(); onNavigate?.('terms'); }} className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">CGU</a>
            <a href="/cgv" onClick={(e) => { e.preventDefault(); onNavigate?.('sales'); }} className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">CGV</a>
            <a href="/remboursements" onClick={(e) => { e.preventDefault(); onNavigate?.('refund'); }} className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">Remboursements</a>
            <a href="/securite-qualite" onClick={(e) => { e.preventDefault(); onNavigate?.('safety'); }} className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">Sécurité & Qualité</a>
            <a href="/vendre-mes-cheveux" onClick={(e) => { e.preventDefault(); onNavigate?.('sell-my-hair'); }} className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">Vendre mes cheveux</a>
            <a href="/reglement-vendeur" onClick={(e) => { e.preventDefault(); onNavigate?.('seller-rules'); }} className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">Règlement vendeur</a>
            <a href="/reglement-acheteur" onClick={(e) => { e.preventDefault(); onNavigate?.('buyer-rules'); }} className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">Règlement acheteur</a>
            <a href="/politique-de-confidentialite" onClick={(e) => { e.preventDefault(); onNavigate?.('privacy'); }} className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">Politique de confidentialité</a>
            <a href="/guide-coupe-conservation" onClick={(e) => { e.preventDefault(); onNavigate?.('guide-coupe'); }} className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">Guide de coupe</a>
            <a href="/partenaires" onClick={(e) => { e.preventDefault(); onNavigate?.('partners'); }} className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">Nos Partenaires</a>
          </nav>

          <p className="text-xs text-gray-500 text-center">
            © 2025 Natural Hair Market — Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
