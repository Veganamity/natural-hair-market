import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';
import { LoginForm } from './components/Auth/LoginForm';
import { SignUpForm } from './components/Auth/SignUpForm';
import { ForgotPasswordForm } from './components/Auth/ForgotPasswordForm';
import { ResetPasswordForm } from './components/Auth/ResetPasswordForm';
import { MarketplaceView } from './components/Marketplace/MarketplaceView';
import { CreateListingForm } from './components/Listings/CreateListingForm';
import { ProfileView } from './components/Profile/ProfileView';
import { ProfileCompletionModal } from './components/Profile/ProfileCompletionModal';
import { FavoritesView } from './components/Favorites/FavoritesView';
import { OffersView } from './components/Offers/OffersView';
import { TransactionsView } from './components/Transactions/TransactionsView';
import { OrderManagement } from './components/Orders/OrderManagement';
import { PrivacyPolicy } from './components/Legal/PrivacyPolicy';
import { TermsOfService } from './components/Legal/TermsOfService';
import { SalesTerms } from './components/Legal/SalesTerms';
import { RefundPolicy } from './components/Legal/RefundPolicy';
import { SafetyQuality } from './components/Legal/SafetyQuality';
import { SellerRules } from './components/Legal/SellerRules';
import { SellMyHair } from './components/Legal/SellMyHair';
import { BuyerRules } from './components/Legal/BuyerRules';
import { FAQ } from './components/Legal/FAQ';
import { AboutUs } from './components/Legal/AboutUs';
import { GuideCoupe } from './components/Legal/GuideCoupe';
import { Partners } from './components/Legal/Partners';
import SalonVerificationAdmin from './components/Admin/SalonVerificationAdmin';
import ListingAdmin from './components/Admin/ListingAdmin';
import BuybackAdmin from './components/Admin/BuybackAdmin';
import MyBuybackRequests from './components/Buyback/MyBuybackRequests';
import SalonCertificationForm from './components/Salon/SalonCertificationForm';
import { LandingPage } from './components/Landing/LandingPage';
import { ListingPage } from './components/Listings/ListingPage';
import { AppFooter } from './components/AppFooter';
import { NotFound } from './components/NotFound';
import { CartView } from './components/Cart/CartView';
import { CartProvider, useCart } from './contexts/CartContext';
import { SellerStorePage } from './components/Seller/SellerStorePage';
import { Database } from './lib/database.types';
import { supabase } from './lib/supabaseClient';
import { extractListingIdFromPath, buildListingPath } from './lib/listingSlug';
import { useUnreadOffersCount } from './hooks/useUnreadOffers';
import { Plus, Home, User, LogOut, Menu, X, Heart, Tag, Receipt, Package, ArrowLeft, ChevronDown, ShoppingCart, Search, Scissors } from 'lucide-react';

type Listing = Database['public']['Tables']['listings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

// Mapping complet path → view (toutes les vues ont une vraie URL propre)
const PATH_TO_VIEW: Record<string, string> = {
  '/': 'landing',
  '/marketplace': 'marketplace',
  '/profile': 'profile',
  '/favorites': 'favorites',
  '/offers': 'offers',
  '/transactions': 'transactions',
  '/orders': 'orders',
  '/cart': 'cart',
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/mentions-legales': 'terms',
  '/sales': 'sales',
  '/refund': 'refund',
  '/safety': 'safety',
  '/seller-rules': 'seller-rules',
  '/vendre-mes-cheveux': 'sell-my-hair',
  '/sell-my-hair': 'sell-my-hair',
  '/buyer-rules': 'buyer-rules',
  '/faq': 'faq',
  '/about': 'about',
  '/guide-coupe-conservation': 'guide-coupe',
  '/admin-salons': 'admin-salons',
  '/admin-listings': 'admin-listings',
  '/admin-buybacks': 'admin-buybacks',
  '/admin': 'admin-buybacks',
  '/salon-certifie': 'salon-certifie',
  '/seller-store': 'seller-store',
  '/partenaires': 'partners',
};

// Mapping view → URL canonique
const VIEW_TO_PATH: Record<string, string> = {
  landing: '/',
  marketplace: '/marketplace',
  profile: '/profile',
  favorites: '/favorites',
  offers: '/offers',
  transactions: '/transactions',
  orders: '/orders',
  cart: '/cart',
  privacy: '/privacy',
  terms: '/terms',
  sales: '/sales',
  refund: '/refund',
  safety: '/safety',
  'seller-rules': '/seller-rules',
  'sell-my-hair': '/vendre-mes-cheveux',
  'buyer-rules': '/buyer-rules',
  faq: '/faq',
  about: '/about',
  'guide-coupe': '/guide-coupe-conservation',
  'admin-salons': '/admin-salons',
  'admin-listings': '/admin-listings',
  'admin-buybacks': '/admin-buybacks',
  'salon-certifie': '/salon-certifie',
  'seller-store': '/seller-store',
  partners: '/partenaires',
};

type ViewName =
  | 'landing' | 'marketplace' | 'profile' | 'favorites' | 'offers'
  | 'transactions' | 'orders' | 'cart' | 'privacy' | 'terms' | 'sales'
  | 'refund' | 'safety' | 'seller-rules' | 'sell-my-hair' | 'buyer-rules' | 'faq' | 'about'
  | 'guide-coupe'
  | 'admin-salons' | 'admin-listings' | 'admin-buybacks' | 'salon-certifie' | 'seller-store'
  | 'my-buybacks' | 'partners' | 'listing-page' | 'not-found';

function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
}

function getInitialView(): ViewName {
  const pathname = normalizePath(window.location.pathname);
  if (pathname.startsWith('/annonce/')) return 'listing-page';
  const hash = window.location.hash.slice(1).split('?')[0].split('&')[0];
  const pathView = PATH_TO_VIEW[pathname];
  if (pathView) return pathView as ViewName;
  if (hash && PATH_TO_VIEW[`/${hash}`]) return PATH_TO_VIEW[`/${hash}`] as ViewName;
  if (pathname === '/') return 'landing';
  return 'not-found';
}

function AppContent() {
  const { user, profile, loading, signOut } = useAuth();
  const { t } = useLanguage();
  const { unreadCount } = useUnreadOffersCount();
  const { cartCount } = useCart();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot-password' | 'reset-password'>('login');
  const [currentView, setCurrentView] = useState<ViewName>(getInitialView);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [preselectedListingId, setPreselectedListingId] = useState<string | null>(null);
  const [listingPageId, setListingPageId] = useState<string | null>(() => {
    if (window.location.pathname.startsWith('/annonce/')) {
      return extractListingIdFromPath(window.location.pathname);
    }
    return null;
  });
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [headerSearch, setHeaderSearch] = useState('');

  useEffect(() => {
    const hashPart = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
    const searchParams = new URLSearchParams(hashPart || window.location.search);
    const paymentIntentId = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');
    if (paymentIntentId && redirectStatus === 'succeeded') {
      setPaymentSuccessMessage(t('payment.successMessage'));
      window.history.replaceState({ view: 'orders' }, '', '/orders');
      setCurrentView('orders');
      setTimeout(() => setPaymentSuccessMessage(null), 8000);

      (async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return;
          await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/confirm-payment`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ paymentIntentId }),
            }
          );
        } catch (e) {
          console.error('Failed to confirm payment status:', e);
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (!loading && user && currentView === 'landing') {
      setCurrentView('marketplace');
      window.history.replaceState({ view: 'marketplace' }, '', '/marketplace');
    }
  }, [user, loading]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordReset(true);
        setAuthMode('reset-password');
      }
      if (event === 'SIGNED_IN') {
        setCurrentView('marketplace');
        window.history.replaceState({ view: 'marketplace' }, '', '/marketplace');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.view) {
        if (event.state.view === 'listing-page' && event.state.listingId) {
          setListingPageId(event.state.listingId);
        }
        setCurrentView(event.state.view as ViewName);
        return;
      }
      const pathname = window.location.pathname;
      if (pathname.startsWith('/annonce/')) {
        const id = extractListingIdFromPath(pathname);
        if (id) setListingPageId(id);
        setCurrentView('listing-page');
        return;
      }
      const pathView = PATH_TO_VIEW[pathname];
      if (pathView) {
        setCurrentView(pathView as ViewName);
        return;
      }
      setCurrentView('landing');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (accountMenuOpen && !target.closest('.relative')) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [accountMenuOpen]);

  const BASE_URL = 'https://www.naturalhairmarket.com';

  const PAGE_META: Record<string, { title: string; description: string }> = {
    landing: {
      title: 'Achat & Vente de Cheveux Naturels | Natural Hair Market',
      description: 'La 1ère marketplace pour acheter et vendre des cheveux naturels humains en Europe. Trouvez des extensions de haute qualité au meilleur prix.',
    },
    marketplace: {
      title: 'Marketplace Cheveux Naturels | Natural Hair Market',
      description: 'Parcourez des centaines d\'annonces de cheveux naturels humains à vendre en Europe : blonds, bruns, châtains. Achat sécurisé.',
    },
    'sell-my-hair': {
      title: 'Vendre mes Cheveux Naturels | Natural Hair Market',
      description: 'Vendez vos cheveux naturels en toute sécurité. Estimez le prix de vos cheveux et publiez votre annonce gratuitement. Longueur minimale 15 cm.',
    },
    faq: {
      title: 'FAQ – Questions fréquentes | Natural Hair Market',
      description: 'Toutes les réponses à vos questions sur l\'achat et la vente de cheveux naturels sur Natural Hair Market.',
    },
    about: {
      title: 'À propos | Natural Hair Market',
      description: 'Découvrez Natural Hair Market, la première marketplace française dédiée à l\'achat et la vente de cheveux naturels humains en Europe.',
    },
    'guide-coupe': {
      title: 'Guide Coupe & Conservation des Cheveux | Natural Hair Market',
      description: 'Comment couper et conserver vos cheveux pour les vendre au meilleur prix. Conseils pratiques pour les vendeurs de cheveux naturels.',
    },
    privacy: {
      title: 'Politique de confidentialité | Natural Hair Market',
      description: 'Politique de confidentialité et protection des données personnelles de Natural Hair Market.',
    },
    terms: {
      title: 'Conditions d\'utilisation | Natural Hair Market',
      description: 'Conditions générales d\'utilisation de la marketplace Natural Hair Market.',
    },
    sales: {
      title: 'Conditions générales de vente | Natural Hair Market',
      description: 'Conditions générales de vente applicables aux transactions sur Natural Hair Market.',
    },
    refund: {
      title: 'Politique de remboursement | Natural Hair Market',
      description: 'Notre politique de remboursement et de protection des acheteurs sur Natural Hair Market.',
    },
    safety: {
      title: 'Qualité & Sécurité | Natural Hair Market',
      description: 'Comment Natural Hair Market garantit la qualité et la sécurité des transactions de cheveux naturels.',
    },
    'seller-rules': {
      title: 'Règles vendeurs | Natural Hair Market',
      description: 'Règles et conseils pour vendre des cheveux naturels sur Natural Hair Market.',
    },
    'buyer-rules': {
      title: 'Règles acheteurs | Natural Hair Market',
      description: 'Règles et conseils pour acheter des cheveux naturels sur Natural Hair Market.',
    },
    partners: {
      title: 'Nos Partenaires | Natural Hair Market',
      description: 'Découvrez les partenaires de Natural Hair Market : salons certifiés et prestataires de services.',
    },
  };

  useEffect(() => {
    // Never set canonical to /not-found
    if (currentView === 'not-found') return;

    // For listing pages, use the actual /annonce/... URL already in the browser
    let path: string;
    if (currentView === 'listing-page' && window.location.pathname.startsWith('/annonce/')) {
      path = window.location.pathname;
    } else {
      path = VIEW_TO_PATH[currentView] ?? `/${currentView}`;
    }

    const canonical = document.getElementById('canonical-url') as HTMLLinkElement | null;
    if (canonical) canonical.href = `${BASE_URL}${path}`;

    const meta = PAGE_META[currentView];
    if (meta) {
      document.title = meta.title;
      const descEl = document.getElementById('meta-description') as HTMLMetaElement | null;
      if (descEl) descEl.content = meta.description;
    }
  }, [currentView]);

  const navigateToView = (view: ViewName, listingId?: string | null) => {
    if (view === 'marketplace' && listingId === undefined) {
      setPreselectedListingId(null);
    }
    setCurrentView(view);
    const path = VIEW_TO_PATH[view] ?? `/${view}`;
    window.history.pushState({ view }, '', path);
    window.scrollTo(0, 0);
  };

  const navigateToSellerStore = (sellerId: string) => {
    setSelectedSellerId(sellerId);
    setCurrentView('seller-store');
    window.history.pushState({ view: 'seller-store' }, '', '/seller-store');
    window.scrollTo(0, 0);
  };

  const navigateToListingPage = (listing: { id: string; hair_length: string; hair_type: string; hair_color: string }) => {
    const path = buildListingPath(listing);
    setListingPageId(listing.id);
    setCurrentView('listing-page');
    window.history.pushState({ view: 'listing-page', listingId: listing.id }, '', path);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">{t('common.loadingApp')}</div>
      </div>
    );
  }

  if (!user || isPasswordReset) {
    if (currentView === 'landing') {
      return <LandingPage
        onGetStarted={() => {
          navigateToView('marketplace');
        }}
        onSell={() => {
          setAuthMode('signup');
          setCurrentView('auth' as ViewName);
        }}
        onLogin={() => {
          setAuthMode('login');
          setCurrentView('auth' as ViewName);
        }}
        onNavigate={(view) => navigateToView(view)}
      />;
    }

    if (currentView === 'listing-page' && listingPageId) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
          <nav className="bg-white shadow-md sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => navigateToView('marketplace')} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">NaturalHairMarket</h1>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setAuthMode('login'); navigateToView('profile'); }} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm">Se connecter</button>
                <button onClick={() => { setAuthMode('signup'); navigateToView('profile'); }} className="px-3 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 text-sm">S'inscrire</button>
              </div>
            </div>
          </nav>
          <ListingPage
            listingId={listingPageId}
            onBack={() => navigateToView('marketplace')}
            onLoginClick={() => { setAuthMode('signup'); navigateToView('profile'); }}
            onBuyClick={() => { setAuthMode('signup'); navigateToView('profile'); }}
          />
          <AppFooter onNavigate={navigateToView} />
        </div>
      );
    }

    const PUBLIC_VIEWS = new Set([
      'privacy', 'terms', 'sales', 'refund', 'safety', 'seller-rules',
      'sell-my-hair', 'buyer-rules', 'faq', 'about', 'guide-coupe', 'partners',
    ]);
    if (PUBLIC_VIEWS.has(currentView)) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
          <nav className="bg-white shadow-md sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <h1 className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent truncate">
                    NaturalHairMarket
                  </h1>
                </div>
                <a
                  href="/"
                  onClick={(e) => { e.preventDefault(); setCurrentView('landing'); window.history.pushState({}, '', '/'); }}
                  className="px-2 py-1.5 sm:px-3 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
                >
                  {t('common.back')}
                </a>
              </div>
            </div>
          </nav>
          <main className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
            {currentView === 'privacy' && <PrivacyPolicy />}
            {currentView === 'terms' && <TermsOfService />}
            {currentView === 'sales' && <SalesTerms />}
            {currentView === 'refund' && <RefundPolicy />}
            {currentView === 'safety' && <SafetyQuality />}
            {currentView === 'seller-rules' && <SellerRules />}
            {currentView === 'sell-my-hair' && <SellMyHair onStartSelling={() => { setAuthMode('signup'); setCurrentView('auth' as ViewName); }} />}
            {currentView === 'buyer-rules' && <BuyerRules />}
            {currentView === 'faq' && <FAQ onClose={() => { setCurrentView('landing'); window.history.pushState({}, '', '/'); }} />}
            {currentView === 'about' && <AboutUs onClose={() => { setCurrentView('landing'); window.history.pushState({}, '', '/'); }} />}
            {currentView === 'guide-coupe' && <GuideCoupe onStartSelling={() => { setCurrentView('landing'); window.history.pushState({}, '', '/'); }} />}
            {currentView === 'partners' && <Partners />}
          </main>
          <AppFooter onNavigate={navigateToView} />
        </div>
      );
    }

    if (currentView === 'marketplace') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
          <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
              <div className="flex items-center justify-between h-16 gap-3">
                <div className="flex items-center gap-1 min-w-0 flex-shrink-0">
                  <button
                    onClick={() => navigateToView('landing')}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    title={t('nav.backToHome')}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent truncate">
                    NaturalHairMarket
                  </h1>
                </div>

                {/* Search bar */}
                <div className="hidden sm:flex flex-1 max-w-sm items-center bg-gray-50 border border-gray-200 rounded-lg px-3 gap-2 h-9">
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Rechercher…"
                    className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                    onFocus={() => {}}
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <LanguageSelector />
                  <button
                    onClick={() => { setAuthMode('login'); navigateToView('profile'); }}
                    className="px-2 py-1.5 sm:px-3 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium text-xs sm:text-sm whitespace-nowrap"
                  >
                    {t('nav.login')}
                  </button>
                  <button
                    onClick={() => { setAuthMode('signup'); navigateToView('profile'); }}
                    className="px-2 py-1.5 sm:px-3 sm:py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-all text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5 shadow-sm"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Déposer une annonce</span>
                    <span className="sm:hidden">Vendre</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
            <MarketplaceView onListingClick={() => {
              setAuthMode('signup');
              navigateToView('profile');
            }} isGuest={true} />
          </main>
        </div>
      );
    }

    if (currentView === 'not-found') {
      return <NotFound onGoHome={() => { setCurrentView('landing'); window.history.pushState({}, '', '/'); }} onGoBack={() => window.history.back()} />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 to-teal-100/20" />
        <div className="relative z-10">
          {authMode === 'login' ? (
            <LoginForm
              onToggleMode={() => setAuthMode('signup')}
              onForgotPassword={() => setAuthMode('forgot-password')}
            />
          ) : authMode === 'signup' ? (
            <SignUpForm onToggleMode={() => setAuthMode('login')} />
          ) : authMode === 'forgot-password' ? (
            <ForgotPasswordForm onBack={() => setAuthMode('login')} />
          ) : (
            <ResetPasswordForm />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Profil incomplet — modal bloquant */}
      {user && profile && !(profile.full_name?.trim() && profile.phone?.trim() && profile.address_line1?.trim() && profile.postal_code?.trim() && profile.city?.trim()) && (
        <ProfileCompletionModal />
      )}
      <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 gap-2">
            <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-shrink-0">
              {currentView !== 'marketplace' && (
                <button
                  onClick={() => navigateToView('marketplace')}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  title={t('nav.backToMarketplace')}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent truncate">
                NaturalHairMarket
              </h1>
              <div className="hidden lg:block ml-2">
                <LanguageSelector />
              </div>
            </div>

            {/* Search bar — visible only on marketplace */}
            {currentView === 'marketplace' && (
              <div className="hidden sm:flex flex-1 max-w-sm items-center bg-gray-50 border border-gray-200 rounded-lg px-3 gap-2 h-9">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  placeholder="Rechercher des cheveux…"
                  className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
            )}

            <div className="hidden md:flex items-center gap-0.5 flex-shrink-0">
              {/* Buyer group */}
              <button
                onClick={() => navigateToView('marketplace')}
                className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 text-sm ${
                  currentView === 'marketplace'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                {t('nav.marketplace')}
              </button>

              <button
                onClick={() => navigateToView('cart')}
                className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 text-sm relative ${
                  currentView === 'cart'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                {t('nav.cart')}
              </button>

              <div className="relative">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 text-sm ${
                    ['favorites', 'offers', 'orders', 'transactions', 'profile'].includes(currentView)
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  {t('nav.myAccount')}
                  <ChevronDown className={`w-4 h-4 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => { navigateToView('profile'); setAccountMenuOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                        currentView === 'profile' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      {t('nav.profile')}
                    </button>
                    <button
                      onClick={() => { navigateToView('favorites'); setAccountMenuOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                        currentView === 'favorites' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                      {t('nav.favorites')}
                    </button>
                    <button
                      onClick={() => { navigateToView('offers'); setAccountMenuOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                        currentView === 'offers' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="relative">
                        <Tag className="w-4 h-4" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </div>
                      {t('nav.offers')}
                      {unreadCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => { navigateToView('orders'); setAccountMenuOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                        currentView === 'orders' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Package className="w-4 h-4" />
                      {t('nav.orders')}
                    </button>
                    <button
                      onClick={() => { navigateToView('transactions'); setAccountMenuOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                        currentView === 'transactions' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Receipt className="w-4 h-4" />
                      {t('nav.history')}
                    </button>
                  </div>
                )}
              </div>

              {/* Seller CTA — amber to stand out */}
              <button
                onClick={() => setShowCreateListing(true)}
                className="ml-2 px-3 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-all transform hover:scale-105 flex items-center gap-1.5 text-sm shadow-sm whitespace-nowrap flex-shrink-0"
              >
                <Scissors className="w-4 h-4 flex-shrink-0" />
                <span className="hidden lg:inline">Déposer une annonce</span>
                <span className="lg:hidden">Vendre</span>
              </button>
              <button
                onClick={signOut}
                className="ml-1 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-3 space-y-2">
              <div className="px-4 pb-3 border-b border-gray-200">
                <LanguageSelector />
              </div>
              {currentView !== 'marketplace' && (
                <button
                  onClick={() => { navigateToView('marketplace'); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-gray-600 hover:bg-gray-100 border-b border-gray-200 pb-3"
                >
                  <ArrowLeft className="w-5 h-5" />
                  {t('nav.backToMarketplace')}
                </button>
              )}
              <button
                onClick={() => { navigateToView('marketplace'); setMobileMenuOpen(false); }}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentView === 'marketplace' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                {t('nav.marketplace')}
              </button>
              <button
                onClick={() => { navigateToView('cart'); setMobileMenuOpen(false); }}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentView === 'cart' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                {t('nav.cart')}
                {cartCount > 0 && (
                  <span className="ml-auto bg-emerald-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => { navigateToView('favorites'); setMobileMenuOpen(false); }}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentView === 'favorites' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-5 h-5" />
                {t('nav.favorites')}
              </button>
              <button
                onClick={() => { navigateToView('offers'); setMobileMenuOpen(false); }}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentView === 'offers' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="relative">
                  <Tag className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                  )}
                </div>
                {t('nav.offers')}
                {unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => { navigateToView('orders'); setMobileMenuOpen(false); }}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentView === 'orders' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Package className="w-5 h-5" />
                {t('nav.orders')}
              </button>
              <button
                onClick={() => { navigateToView('transactions'); setMobileMenuOpen(false); }}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentView === 'transactions' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Receipt className="w-5 h-5" />
                {t('nav.transactions')}
              </button>
              <button
                onClick={() => { navigateToView('profile'); setMobileMenuOpen(false); }}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentView === 'profile' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
                {t('nav.profile')}
              </button>
              <button
                onClick={() => { setShowCreateListing(true); setMobileMenuOpen(false); }}
                className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors flex items-center gap-2"
              >
                <Scissors className="w-5 h-5" />
                Déposer une annonce
              </button>
              <button
                onClick={() => { signOut(); setMobileMenuOpen(false); }}
                className="w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                {t('nav.logout')}
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
        {paymentSuccessMessage && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-emerald-800 font-semibold text-sm">{paymentSuccessMessage}</p>
          </div>
        )}
        {currentView === 'marketplace' && (
          <MarketplaceView
            isGuest={false}
            initialListingId={preselectedListingId}
            key={preselectedListingId || 'marketplace'}
            onSellerClick={navigateToSellerStore}
            externalSearch={headerSearch}
          />
        )}
        {currentView === 'seller-store' && selectedSellerId && (
          <SellerStorePage
            sellerId={selectedSellerId}
            onBack={() => navigateToView('marketplace')}
          />
        )}
        {currentView === 'listing-page' && listingPageId && (
          <ListingPage
            listingId={listingPageId}
            onBack={() => navigateToView('marketplace')}
            onLoginClick={() => navigateToView('profile')}
            onBuyClick={(id) => {
              setPreselectedListingId(id);
              navigateToView('marketplace');
            }}
          />
        )}
        {currentView === 'cart' && <CartView />}
        {currentView === 'favorites' && <FavoritesView />}
        {currentView === 'offers' && <OffersView />}
        {currentView === 'orders' && <OrderManagement />}
        {currentView === 'transactions' && <TransactionsView />}
        {currentView === 'profile' && <ProfileView onNavigate={(view) => navigateToView(view as ViewName)} />}
        {currentView === 'admin-salons' && <SalonVerificationAdmin />}
        {currentView === 'admin-buybacks' && <BuybackAdmin />}
        {currentView === 'my-buybacks' && <MyBuybackRequests onBack={() => navigateToView('profile')} />}
        {currentView === 'admin-listings' && (
          <ListingAdmin
            onViewListing={(listingId) => {
              setPreselectedListingId(listingId);
              navigateToView('marketplace');
            }}
          />
        )}
        {currentView === 'salon-certifie' && <SalonCertificationForm />}
        {currentView === 'privacy' && <PrivacyPolicy />}
        {currentView === 'terms' && <TermsOfService />}
        {currentView === 'sales' && <SalesTerms />}
        {currentView === 'refund' && <RefundPolicy />}
        {currentView === 'safety' && <SafetyQuality />}
        {currentView === 'seller-rules' && <SellerRules />}
        {currentView === 'sell-my-hair' && <SellMyHair onStartSelling={() => setShowCreateListing(true)} />}
        {currentView === 'buyer-rules' && <BuyerRules />}
        {currentView === 'faq' && <FAQ onClose={() => navigateToView('marketplace')} />}
        {currentView === 'about' && <AboutUs onClose={() => navigateToView('marketplace')} />}
        {currentView === 'guide-coupe' && <GuideCoupe onStartSelling={() => navigateToView('sell-my-hair')} />}
        {currentView === 'not-found' && (
          <div className="-mx-2 sm:-mx-4 lg:-mx-6 -my-4 sm:-my-8">
            <NotFound onGoHome={() => navigateToView('landing')} onGoBack={() => window.history.back()} />
          </div>
        )}
      </main>

      {showCreateListing && (
        <CreateListingForm
          onClose={() => setShowCreateListing(false)}
          onSuccess={() => {
            setShowCreateListing(false);
            setCurrentView('marketplace');
          }}
        />
      )}

      <AppFooter onNavigate={navigateToView} />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
