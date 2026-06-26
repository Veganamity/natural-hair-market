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
      answer: "Sur Natural Hair Market, vous pouvez acheter et vendre tous types de cheveux humains : cheveux naturels européens, cheveux brésiliens, cheveux indiens, lisses, bouclés, ou cheveux naturels colorés. Chaque annonce de vente de cheveux naturels est contrôlée pour garantir la qualité."
    },
    {
      question: "La plateforme est-elle sécurisée pour les acheteurs et les vendeurs ?",
      answer: "Absolument. Natural Hair Market sécurise chaque transaction via Stripe. Le paiement est conservé jusqu'à confirmation de réception, protégeant aussi bien les acheteurs que les vendeurs de cheveux naturels."
    },
    {
      question: "Pourquoi choisir des cheveux humains naturels ?",
      answer: "Les cheveux humains naturels offrent une durée de vie beaucoup plus longue, un aspect indétectable et peuvent être coiffés, lissés ou colorés exactement comme vos propres cheveux, contrairement aux fibres synthétiques. Les cheveux naturels européens sont particulièrement recherchés pour leur qualité."
    },
    {
      question: "Combien coûte la publication d'une annonce ?",
      answer: "La publication d'une annonce de vente de cheveux naturels est entièrement gratuite pour les vendeurs particuliers et les salons de coiffure. Vous encaissez 100 % du prix que vous fixez. Seuls les acheteurs s'acquittent d'une commission de 10 % au moment du paiement."
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
            Vente & achat de cheveux naturels<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">— Natural Hair Market</span>
          </h1>

          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            La première marketplace française dédiée à la vente de cheveux naturels entre particuliers et professionnels. Publication gratuite pour les vendeurs, paiement sécurisé, livraison assurée.
          </p>

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
              J'achète des cheveux naturels
            </button>
          </div>

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
              <span>Paiement sécurisé Stripe</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTRO SEO ─── */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-semibold text-xs mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              La marketplace de référence en France
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
              Pourquoi Natural Hair Market est la plateforme n°1 pour vendre et acheter des cheveux naturels ?
            </h2>
          </div>
          <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
            <p>
              <strong className="text-gray-800">Natural Hair Market</strong> est né d'un constat simple : des millions de mèches de{' '}
              <strong>cheveux naturels européens</strong> sont perdues chaque année dans les salons de coiffure ou lors de coupes à domicile, alors que de nombreuses personnes recherchent activement des cheveux humains authentiques pour leurs extensions, perruques ou greffes capillaires. Notre mission est de créer le lien direct entre ceux qui souhaitent{' '}
              <strong>vendre leurs cheveux</strong> et ceux qui veulent{' '}
              <strong>acheter des cheveux naturels</strong> de qualité, sans intermédiaire.
            </p>
            <p>
              Sur notre plateforme, la <strong>vente de cheveux naturels</strong> est 100 % gratuite pour les vendeurs particuliers comme pour les salons de coiffure. En quelques minutes, vous publiez votre annonce, fixez votre propre prix et encaissez l'intégralité de la somme affichée. Les acheteurs bénéficient d'une sélection rigoureuse de{' '}
              <strong>cheveux naturels français et européens</strong> — lisses, bouclés, colorés, gris ou blonds — avec une commission unique et transparente de seulement 10 %.
            </p>
            <p>
              Contrairement aux plateformes généralistes, <strong>Natural Hair Market</strong> a été conçu exclusivement pour le marché des cheveux humains. Chaque annonce est contrôlée par notre équipe, chaque transaction est sécurisée via Stripe, et chaque expédition est gérée par des transporteurs partenaires (La Poste, Mondial Relay, Colissimo). Vendeurs et acheteurs bénéficient d'un espace sécurisé avec messagerie intégrée, suivi de colis en temps réel et protection des paiements jusqu'à confirmation de réception.
            </p>
            <p>
              Que vous soyez un particulier souhaitant <strong>vendre ses cheveux</strong> après une coupe, un salon de coiffure cherchant à valoriser ses chutes, ou un acheteur en quête des meilleures mèches de <strong>cheveux naturels</strong> du marché, Natural Hair Market est la solution éthique, rapide et fiable qu'il vous faut. Rejoignez notre communauté grandissante et donnez une seconde vie à vos cheveux naturels dès aujourd'hui.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={() => onNavigate?.('sell-my-hair')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition-all transform hover:scale-105 shadow-md"
            >
              <Scissors className="w-4 h-4" />
              Vendre mes cheveux
            </button>
            <button
              onClick={onGetStarted}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all transform hover:scale-105 shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              Acheter des cheveux naturels
            </button>
          </div>
        </div>
      </section>

      {/* ─── COMMENT ÇA MARCHE ─── */}
      <section className="py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-semibold text-xs mb-3">
              <CheckCircle className="w-3.5 h-3.5" />
              Simple & rapide
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
              Comment ça marche ?
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Que vous souhaitiez vendre vos cheveux naturels ou en acheter, le processus est simple, sécurisé et transparent.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-white rounded-2xl p-7 border border-amber-100 shadow-sm flex flex-col">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <Scissors className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-800 mb-2">Vendre ses cheveux</h3>
              <p className="text-gray-500 text-sm mb-5 flex-1">
                Valorisez votre mèche de cheveux naturels en toute simplicité, sans frais ni intermédiaire.
              </p>
              <ol className="space-y-3 mb-6">
                {[
                  'Créez votre annonce en 5 minutes — photos, longueur, couleur, prix que vous fixez librement',
                  'Un acheteur découvre votre mèche et valide sa commande en toute sécurité',
                  'Expédiez la mèche et recevez votre paiement intégral sous 48 h',
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
                    <span className="text-gray-600 text-sm">{text}</span>
                  </li>
                ))}
              </ol>
              <button
                onClick={onSell ?? onLogin ?? onGetStarted}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-sm transition-colors"
              >
                Déposer une annonce gratuite
              </button>
            </div>

            <div className="bg-white rounded-2xl p-7 border border-emerald-100 shadow-sm flex flex-col">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-800 mb-2">Acheter des cheveux naturels</h3>
              <p className="text-gray-500 text-sm mb-5 flex-1">
                Trouvez la mèche parfaite parmi des centaines d'annonces de cheveux naturels vérifiées.
              </p>
              <ol className="space-y-3 mb-6">
                {[
                  'Filtrez par longueur, couleur, texture et localisation pour trouver votre mèche idéale',
                  "Achetez en sécurité — paiement protégé par Stripe, conservé jusqu'à réception",
                  'Recevez votre commande à domicile ou en point relais partout en France',
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
                    <span className="text-gray-600 text-sm">{text}</span>
                  </li>
                ))}
              </ol>
              <button
                onClick={onGetStarted}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm transition-colors"
              >
                Parcourir les annonces
              </button>
            </div>

            <div className="bg-white rounded-2xl p-7 border border-teal-100 shadow-sm flex flex-col">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <Euro className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-800 mb-2">Recevoir son paiement</h3>
              <p className="text-gray-500 text-sm mb-5 flex-1">
                Un système de paiement 100 % sécurisé, rapide et transparent pour chaque vente de cheveux.
              </p>
              <ol className="space-y-3 mb-6">
                {[
                  "L'acheteur règle en ligne au moment de la commande via Stripe",
                  "Le paiement est conservé sur notre plateforme sécurisée jusqu'à réception",
                  'Après confirmation, le virement est libéré sur votre compte sous 48 h',
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-bold flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
                    <span className="text-gray-600 text-sm">{text}</span>
                  </li>
                ))}
              </ol>
              <button
                onClick={onSell ?? onLogin ?? onGetStarted}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-sm transition-colors"
              >
                Créer mon compte vendeur
              </button>
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

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-7 border border-amber-100 flex flex-col">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold mb-4 text-sm self-start">
                <Scissors className="w-4 h-4" />
                Particulier
              </div>
              <h3 className="text-xl font-extrabold text-gray-800 mb-2">Vendez vos cheveux gratuitement</h3>
              <p className="text-gray-600 text-sm mb-5 flex-1">
                Vous souhaitez vendre votre mèche de cheveux naturels ? Publiez en quelques minutes et encaissez 100% du prix affiché.
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
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 text-center mb-2">
            Pourquoi choisir Natural Hair Market ?
          </h2>
          <p className="text-gray-500 text-sm text-center mb-8 max-w-xl mx-auto">
            4 raisons pour lesquelles acheteurs et vendeurs de cheveux naturels nous font confiance
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Shield,
                title: 'Sécurité garantie',
                desc: 'Chaque transaction est protégée par Stripe, le leader mondial du paiement en ligne. Vos données bancaires ne transitent jamais par nos serveurs. Acheteurs et vendeurs de cheveux naturels sont couverts à chaque étape.',
                color: 'emerald',
              },
              {
                icon: TrendingUp,
                title: 'Rapidité & simplicité',
                desc: 'Publiez une annonce de vente de cheveux naturels en moins de 5 minutes. Les acheteurs trouvent leur mèche idéale grâce à nos filtres avancés. Les transactions sont finalisées en 24 à 48 h.',
                color: 'teal',
              },
              {
                icon: Euro,
                title: 'Prix justes & transparents',
                desc: 'Zéro commission pour les vendeurs, jamais. Les acheteurs de cheveux naturels paient une unique commission de 10 %, clairement indiquée avant paiement. Aucun frais caché, aucun abonnement.',
                color: 'emerald',
              },
              {
                icon: Users,
                title: 'Confiance & qualité',
                desc: 'Chaque annonce est contrôlée par notre équipe. Les salons partenaires obtiennent un badge "Salon Vérifié". La communauté Natural Hair Market grandit grâce à des échanges éthiques et transparents.',
                color: 'teal',
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all flex flex-col">
                <div className={`w-11 h-11 bg-${color}-100 rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{desc}</p>
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
          <p className="text-emerald-100 text-lg mb-2 max-w-xl mx-auto">
            Des milliers de mèches de cheveux naturels vous attendent. Publication gratuite, paiement sécurisé, livraison garantie.
          </p>
          <p className="text-emerald-200 text-sm mb-8 max-w-2xl mx-auto">
            Rejoignez les vendeurs et acheteurs de cheveux naturels qui font confiance à Natural Hair Market — la référence de l'achat et de la vente de cheveux naturels européens en France.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate?.('sell-my-hair')}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
            >
              Vendre mes cheveux
            </button>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border-2 border-white/50 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 backdrop-blur-sm"
            >
              Acheter des cheveux naturels
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
