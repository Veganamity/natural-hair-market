import { Search, Euro, ShoppingBag, TrendingUp, CheckCircle, Sparkles, Users, Shield, ChevronDown, Scissors, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Database } from '../../lib/database.types';
import { ListingCard } from '../Listings/ListingCard';
import { useLanguage } from '../../contexts/LanguageContext';
import { AppFooter } from '../AppFooter';
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
  const [carouselIndex, setCarouselIndex] = useState(0);

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

      {/* ─── CARROUSEL ANNONCES RÉCENTES ─── */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-semibold text-xs mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Nouvelles annonces
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {t('landing.recentListings')}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{t('landing.recentListingsSubtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCarouselIndex(i => Math.max(0, i - 1))}
                disabled={carouselIndex === 0}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCarouselIndex(i => Math.min(featuredListings.length - 1, i + 1))}
                disabled={featuredListings.length === 0 || carouselIndex >= featuredListings.length - 6}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={onGetStarted}
                className="hidden sm:flex items-center gap-1.5 ml-2 text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition-colors"
              >
                Voir tout →
              </button>
            </div>
          </div>

          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-gray-100 animate-pulse aspect-[3/4]" />
              ))}
            </div>
          )}

          {!loading && featuredListings.length > 0 && (
            <div className="overflow-hidden">
              <div
                className="flex gap-3 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(calc(-${carouselIndex} * (100% / 6 + 0.5rem)))` }}
              >
                {featuredListings.map((listing) => (
                  <div key={listing.id} className="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.33%-8px)] md:w-[calc(25%-9px)] lg:w-[calc(16.67%-10px)]">
                    <ListingCard listing={listing} onClick={onGetStarted} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-2xl mx-auto">
              <p className="font-semibold text-sm">{error}</p>
            </div>
          )}

          <div className="text-center mt-8">
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
      <section className="py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Vous êtes…</h2>
            <p className="text-gray-500 text-sm">La marketplace s'adapte à votre profil</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Acheteurs */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-7 border border-emerald-100 flex flex-col">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold mb-4 text-sm self-start">
                <ShoppingBag className="w-4 h-4" />
                Acheteur
              </div>
              <h3 className="text-xl font-extrabold text-gray-800 mb-2">Trouvez vos cheveux idéaux</h3>
              <p className="text-gray-600 text-sm mb-5 flex-1">
                Des centaines de mèches de haute qualité disponibles. 10% de commission transparente, aucun abonnement.
              </p>
              <ul className="space-y-2 mb-6">
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

            {/* Particulier vendeur */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-7 border border-amber-100 flex flex-col">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold mb-4 text-sm self-start">
                <Scissors className="w-4 h-4" />
                Particulier
              </div>
              <h3 className="text-xl font-extrabold text-gray-800 mb-2">Vendez vos cheveux gratuitement</h3>
              <p className="text-gray-600 text-sm mb-5 flex-1">
                Vous souhaitez vendre votre mèche ? Publiez en quelques minutes et encaissez 100% du prix affiché.
              </p>
              <ul className="space-y-2 mb-6">
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

            {/* Salon de coiffure */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-7 border border-blue-100 flex flex-col relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Badge vérifié</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold mb-4 text-sm self-start">
                <TrendingUp className="w-4 h-4" />
                Salon de coiffure
              </div>
              <h3 className="text-xl font-extrabold text-gray-800 mb-2">Écoulez vos chutes de coupe</h3>
              <p className="text-gray-600 text-sm mb-5 flex-1">
                Salons, coiffeurs indépendants — valorisez les mèches issues de vos coupes. Obtenez le badge <strong className="text-blue-700">"Salon Vérifié"</strong> avec votre SIRET.
              </p>
              <ul className="space-y-2 mb-6">
                {['Badge "Salon Vérifié" sur vos annonces', 'Confiance accrue des acheteurs', 'Ventes en volume possibles', 'Certification gratuite avec SIRET'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={onSell ?? onLogin ?? onGetStarted}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all transform hover:scale-[1.02] shadow-md"
              >
                Créer mon compte salon
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
      <AppFooter onNavigate={(view) => onNavigate?.(view)} />
    </div>
  );
}
