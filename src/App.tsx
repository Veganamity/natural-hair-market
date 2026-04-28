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
import SalonVerificationAdmin from './components/Admin/SalonVerificationAdmin';
import ListingAdmin from './components/Admin/ListingAdmin';
import SalonCertificationForm from './components/Salon/SalonCertificationForm';
import { LandingPage } from './components/Landing/LandingPage';
import { CartView } from './components/Cart/CartView';
import { CartProvider, useCart } from './contexts/CartContext';
import { SellerStorePage } from './components/Seller/SellerStorePage';
import { Database } from './lib/database.types';
import { supabase } from './lib/supabaseClient';
import { useUnreadOffersCount } from './hooks/useUnreadOffers';
import { Plus, Home, User, LogOut, Menu, X, Heart, Tag, Receipt, Package, ArrowLeft, ChevronDown, ShoppingCart } from 'lucide-react';

type Listing = Database['public']['Tables']['listings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

// Pages légales accessibles via une URL propre (sans #)
const LEGAL_PATHS: Record<string, string> = {
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/sales': 'sales',
  '/refund': 'refund',
  '/safety': 'safety',
  '/seller-rules': 'seller-rules',
  '/vendre-mes-cheveux': 'sell-my-hair',
  '/buyer-rules': 'buyer-rules',
  '/faq': 'faq',
  '/about': 'about',
};

type ViewName =
  | 'landing' | 'marketplace' | 'profile' | 'favorites' | 'offers'
  | 'transactions' | 'orders' | 'cart' | 'privacy' | 'terms' | 'sales'
  | 'refund' | 'safety' | 'seller-rules' | 'sell-my-hair' | 'buyer-rules' | 'faq' | 'about'
  | 'admin-salons' | 'admin-listings' | 'salon-certifie' | 'seller-store';

const HASH_VIEWS = new Set<string>([
  'landing', 'marketplace', 'profile', 'favorites', 'offers', 'transactions',
  'orders', 'cart', 'privacy', 'terms', 'sales', 'refund', 'safety',
  'seller-rules', 'sell-my-hair', 'buyer-rules', 'faq', 'about', 'admin-salons',
  'admin-listings', 'salon-certifie',
]);

function getInitialView(): ViewName {
  // Chemin propre (/privacy, /terms, etc.) — priorité absolue
  const pathView = LEGAL_PATHS[window.location.pathname];
  if (pathView) return pathView as ViewName;
  // Hash legacy (#marketplace, etc.)
  const hash = window.location.hash.slice(1).split('?')[0].split('&')[0];
  if (hash && HASH_VIEWS.has(hash)) return hash as ViewName;
  return 'landing';
}

function AppContent() {
  const { user, loading, signOut } = useAuth();
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
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);

  useEffect(() => {
    const hashPart = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
    const searchParams = new URLSearchParams(hashPart || window.location.search);
    const paymentIntentId = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');
    if (paymentIntentId && redirectStatus === 'succeeded') {
      setPaymentSuccessMessage(t('payment.successMessage'));
      window.history.replaceState({}, '', '#orders');
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
      window.history.replaceState({ view: 'marketplace' }, '', '#marketplace');
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
        window.history.replaceState({ view: 'marketplace' }, '', '#marketplace');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.view) {
        setCurrentView(event.state.view);
        return;
      }
      // Chemin propre (/privacy, etc.)
      const pathView = LEGAL_PATHS[window.location.pathname];
      if (pathView) {
        setCurrentView(pathView as ViewName);
        return;
      }
      // Hash legacy
      const hash = window.location.hash.slice(1).split('?')[0].split('&')[0];
      if (hash && !hash.includes('access_token') && !hash.includes('error') && HASH_VIEWS.has(hash)) {
        setCurrentView(hash as ViewName);
      } else {
        setCurrentView('landing');
      }
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

  // Navigation : pages légales → URL propre (/privacy), autres → hash (#marketplace)
  const navigateToView = (view: ViewName, listingId?: string | null) => {
    if (view === 'marketplace' && listingId === undefined) {
      setPreselectedListingId(null);
    }
    setCurrentView(view);
    if (LEGAL_PATHS[`/${view}`] !== undefined) {
      window.history.pushState({ view }, '', `/${view}`);
    } else {
      window.history.pushState({ view }, '', `#${view}`);
    }
  };

  const navigateToSellerStore = (sellerId: string) => {
    setSelectedSellerId(sellerId);
    setCurrentView('seller-store');
    window.history.pushState({ view: 'seller-store' }, '', '#seller-store');
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
        onNavigate={(view) => navigateToView(view)}
      />;
    }

    if (LEGAL_PATHS[`/${currentView}`] !== undefined) {
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
            {currentView === 'sell-my-hair' && <SellMyHair onStartSelling={() => { setCurrentView('landing'); window.history.pushState({}, '', '/'); }} />}
            {currentView === 'buyer-rules' && <BuyerRules />}
            {currentView === 'faq' && <FAQ onClose={() => { setCurrentView('landing'); window.history.pushState({}, '', '/'); }} />}
            {currentView === 'about' && <AboutUs onClose={() => { setCurrentView('landing'); window.history.pushState({}, '', '/'); }} />}
          </main>
        </div>
      );
    }

    if (currentView === 'marketplace') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
          <nav className="bg-white shadow-md sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  <button
                    onClick={() => navigateToView('landing')}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    title={t('nav.backToHome')}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h1 className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent truncate">
                    NaturalHairMarket
                  </h1>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <LanguageSelector />
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      navigateToView('profile');
                    }}
                    className="px-2 py-1.5 sm:px-3 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium text-xs sm:text-sm whitespace-nowrap"
                  >
                    {t('nav.login')}
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      navigateToView('profile');
                    }}
                    className="px-2 py-1.5 sm:px-3 sm:py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-xs sm:text-sm whitespace-nowrap"
                  >
                    {t('nav.signup')}
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
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
              {currentView !== 'marketplace' && (
                <button
                  onClick={() => navigateToView('marketplace')}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  title={t('nav.backToMarketplace')}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <h1 className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent truncate">
                NaturalHairMarket
              </h1>
              <div className="hidden md:block ml-2">
                <LanguageSelector />
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1">
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

              <button
                onClick={() => setShowCreateListing(true)}
                className="ml-1 px-3 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 text-sm"
              >
                <Plus className="w-4 h-4" />
                {t('nav.newListing')}
              </button>
              <button
                onClick={signOut}
                className="ml-1 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
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
                className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {t('nav.newListing')}
              </button>
              <button
                onClick={signOut}
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
          />
        )}
        {currentView === 'seller-store' && selectedSellerId && (
          <SellerStorePage
            sellerId={selectedSellerId}
            onBack={() => navigateToView('marketplace')}
          />
        )}
        {currentView === 'cart' && <CartView />}
        {currentView === 'favorites' && <FavoritesView />}
        {currentView === 'offers' && <OffersView />}
        {currentView === 'orders' && <OrderManagement />}
        {currentView === 'transactions' && <TransactionsView />}
        {currentView === 'profile' && <ProfileView onNavigate={(view) => navigateToView(view as ViewName)} />}
        {currentView === 'admin-salons' && <SalonVerificationAdmin />}
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
        {currentView === 'sell-my-hair' && <SellMyHair onStartSelling={() => navigateToView('marketplace')} />}
        {currentView === 'buyer-rules' && <BuyerRules />}
        {currentView === 'faq' && <FAQ onClose={() => navigateToView('marketplace')} />}
        {currentView === 'about' && <AboutUs onClose={() => navigateToView('marketplace')} />}
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

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              © 2025 Marketplace de cheveux humains naturels & colorés. Tous droits réservés.
            </p>
            <div className="flex gap-4">
              <a
                href="/about"
                onClick={(e) => { e.preventDefault(); navigateToView('about'); }}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
              >
                À propos
              </a>
              <a
                href="/vendre-mes-cheveux"
                onClick={(e) => { e.preventDefault(); navigateToView('sell-my-hair'); }}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
              >
                Vendre mes cheveux
              </a>
              <a
                href="/faq"
                onClick={(e) => { e.preventDefault(); navigateToView('faq'); }}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
              >
                FAQ
              </a>
              <a
                href="/terms"
                onClick={(e) => { e.preventDefault(); navigateToView('terms'); }}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
              >
                Conditions d'utilisation
              </a>
              <a
                href="/privacy"
                onClick={(e) => { e.preventDefault(); navigateToView('privacy'); }}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
              >
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </footer>
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
