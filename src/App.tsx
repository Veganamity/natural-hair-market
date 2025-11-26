import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
import { BuyerRules } from './components/Legal/BuyerRules';
import { FAQ } from './components/Legal/FAQ';
import { AboutUs } from './components/Legal/AboutUs';
import SalonVerificationAdmin from './components/Admin/SalonVerificationAdmin';
import ListingAdmin from './components/Admin/ListingAdmin';
import SalonCertificationForm from './components/Salon/SalonCertificationForm';
import { LandingPage } from './components/Landing/LandingPage';
import { Database } from './lib/database.types';
import { supabase } from './lib/supabaseClient';
import { Plus, Home, User, LogOut, Menu, X, Heart, Tag, Receipt, Package, HelpCircle, ArrowLeft } from 'lucide-react';

type Listing = Database['public']['Tables']['listings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

function AppContent() {
  const { user, loading, signOut } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot-password' | 'reset-password'>('login');
  const [currentView, setCurrentView] = useState<'landing' | 'marketplace' | 'profile' | 'favorites' | 'offers' | 'transactions' | 'orders' | 'privacy' | 'terms' | 'sales' | 'refund' | 'safety' | 'seller-rules' | 'buyer-rules' | 'faq' | 'about' | 'admin-salons' | 'admin-listings' | 'salon-certifie'>('landing');
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordReset(true);
        setAuthMode('reset-password');
      }
      if (event === 'SIGNED_IN') {
        setCurrentView('marketplace');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Chargement...</div>
      </div>
    );
  }

  if (!user || isPasswordReset) {
    if (currentView === 'landing') {
      return <LandingPage
        onGetStarted={() => {
          setCurrentView('marketplace');
        }}
        onNavigate={(view) => setCurrentView(view)}
      />;
    }

    if (currentView === 'privacy' || currentView === 'terms' || currentView === 'sales' || currentView === 'refund' || currentView === 'safety' || currentView === 'seller-rules' || currentView === 'buyer-rules' || currentView === 'faq' || currentView === 'about') {
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
                <button
                  onClick={() => setCurrentView('landing')}
                  className="px-2 py-1.5 sm:px-3 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
                >
                  Retour
                </button>
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
            {currentView === 'buyer-rules' && <BuyerRules />}
            {currentView === 'faq' && <FAQ onClose={() => setCurrentView('landing')} />}
            {currentView === 'about' && <AboutUs onClose={() => setCurrentView('landing')} />}
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
                    onClick={() => setCurrentView('landing')}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    title="Retour à l'accueil"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h1 className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent truncate">
                    NaturalHairMarket
                  </h1>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setCurrentView('profile');
                    }}
                    className="px-2 py-1.5 sm:px-3 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium text-xs sm:text-sm whitespace-nowrap"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setCurrentView('profile');
                    }}
                    className="px-2 py-1.5 sm:px-3 sm:py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-xs sm:text-sm whitespace-nowrap"
                  >
                    Inscription
                  </button>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
            <MarketplaceView onListingClick={() => {
              setAuthMode('signup');
              setCurrentView('profile');
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
                  onClick={() => setCurrentView('marketplace')}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  title="Retour au Marketplace"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <h1 className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent truncate">
                NaturalHairMarket
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setCurrentView('marketplace')}
                className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 text-sm ${
                  currentView === 'marketplace'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                Marketplace
              </button>
              <button
                onClick={() => setCurrentView('favorites')}
                className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 text-sm ${
                  currentView === 'favorites'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-4 h-4" />
                Favoris
              </button>
              <button
                onClick={() => setCurrentView('offers')}
                className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 text-sm ${
                  currentView === 'offers'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Tag className="w-4 h-4" />
                Offres
              </button>
              <button
                onClick={() => setCurrentView('orders')}
                className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 text-sm ${
                  currentView === 'orders'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Package className="w-4 h-4" />
                Commandes
              </button>
              <button
                onClick={() => setCurrentView('transactions')}
                className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 text-sm ${
                  currentView === 'transactions'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Receipt className="w-4 h-4" />
                Historique
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 text-sm ${
                  currentView === 'profile'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User className="w-4 h-4" />
                Profil
              </button>
              <button
                onClick={() => setShowCreateListing(true)}
                className="ml-1 px-3 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 text-sm"
              >
                <Plus className="w-4 h-4" />
                Nouvelle annonce
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
              {currentView !== 'marketplace' && (
                <button
                  onClick={() => {
                    setCurrentView('marketplace');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-gray-600 hover:bg-gray-100 border-b border-gray-200 pb-3"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Retour au Marketplace
                </button>
              )}
              <button
                onClick={() => {
                  setCurrentView('marketplace');
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentView === 'marketplace'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                Marketplace
              </button>
              <button
                onClick={() => {
                  setCurrentView('favorites');
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentView === 'favorites'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-5 h-5" />
                Favoris
              </button>
              <button
                onClick={() => {
                  setCurrentView('offers');
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentView === 'offers'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Tag className="w-5 h-5" />
                Offres
              </button>
              <button
                onClick={() => {
                  setCurrentView('orders');
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentView === 'orders'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Package className="w-5 h-5" />
                Commandes
              </button>
              <button
                onClick={() => {
                  setCurrentView('transactions');
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentView === 'transactions'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Receipt className="w-5 h-5" />
                Historique
              </button>
              <button
                onClick={() => {
                  setCurrentView('profile');
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentView === 'profile'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
                Profil
              </button>
              <button
                onClick={() => {
                  setShowCreateListing(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Nouvelle annonce
              </button>
              <button
                onClick={signOut}
                className="w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
        {currentView === 'marketplace' && <MarketplaceView isGuest={false} />}
        {currentView === 'favorites' && <FavoritesView />}
        {currentView === 'offers' && <OffersView />}
        {currentView === 'orders' && <OrderManagement />}
        {currentView === 'transactions' && <TransactionsView />}
        {currentView === 'profile' && <ProfileView onNavigate={(view) => setCurrentView(view as any)} />}
        {currentView === 'admin-salons' && <SalonVerificationAdmin />}
        {currentView === 'admin-listings' && <ListingAdmin />}
        {currentView === 'salon-certifie' && <SalonCertificationForm />}
        {currentView === 'privacy' && <PrivacyPolicy />}
        {currentView === 'terms' && <TermsOfService />}
        {currentView === 'sales' && <SalesTerms />}
        {currentView === 'refund' && <RefundPolicy />}
        {currentView === 'safety' && <SafetyQuality />}
        {currentView === 'seller-rules' && <SellerRules />}
        {currentView === 'buyer-rules' && <BuyerRules />}
        {currentView === 'faq' && <FAQ onClose={() => setCurrentView('marketplace')} />}
        {currentView === 'about' && <AboutUs onClose={() => setCurrentView('marketplace')} />}
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
              <button
                onClick={() => setCurrentView('about')}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
              >
                À propos
              </button>
              <button
                onClick={() => setCurrentView('faq')}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
              >
                FAQ
              </button>
              <button
                onClick={() => setCurrentView('terms')}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
              >
                Conditions d'utilisation
              </button>
              <button
                onClick={() => setCurrentView('privacy')}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
              >
                Politique de confidentialité
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
