import { useState, useEffect, useCallback } from 'react';
import {
  ConnectComponentsProvider,
  ConnectAccountOnboarding,
  ConnectAccountManagement,
  ConnectPayments,
  ConnectPayouts,
  ConnectBalances,
} from '@stripe/react-connect-js';
import { loadConnectAndInitialize } from '@stripe/connect-js';
import { supabase } from '../../lib/supabaseClient';
import { Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';

type ComponentType = 'onboarding' | 'account_management' | 'payments' | 'payouts' | 'balances';

interface StripeConnectEmbeddedProps {
  component: ComponentType;
  onOnboardingComplete?: () => void;
  onClose?: () => void;
  className?: string;
}

export function StripeConnectEmbedded({
  component,
  onOnboardingComplete,
  onClose,
  className = '',
}: StripeConnectEmbeddedProps) {
  const [stripeConnectInstance, setStripeConnectInstance] = useState<ReturnType<typeof loadConnectAndInitialize> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientSecret = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Non authentifié');

    const componentMap: Record<ComponentType, string> = {
      onboarding: 'account_onboarding',
      account_management: 'account_management',
      payments: 'payments',
      payouts: 'payouts',
      balances: 'balances',
    };

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-account-session`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ component: componentMap[component] }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erreur lors de la création de la session');
    }

    const { clientSecret } = await response.json();
    return clientSecret;
  }, [component]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
        if (!publishableKey) throw new Error('Clé Stripe manquante');

        const instance = loadConnectAndInitialize({
          publishableKey,
          fetchClientSecret,
          appearance: {
            overlays: 'dialog',
            variables: {
              colorPrimary: '#059669',
              colorBackground: '#ffffff',
              colorText: '#1f2937',
              colorDanger: '#dc2626',
              borderRadius: '8px',
              fontFamily: 'system-ui, sans-serif',
              spacingUnit: '4px',
            },
          },
          locale: 'fr-FR',
        });

        setStripeConnectInstance(instance);
      } catch (err: any) {
        setError(err.message || 'Erreur d\'initialisation');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [fetchClientSecret]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-gray-600 text-sm">Chargement du module bancaire...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-semibold text-sm">Impossible de charger le module bancaire</p>
            <p className="text-red-700 text-xs mt-1">
              Une erreur est survenue lors de l'initialisation. Veuillez fermer et réessayer. Si le problème persiste, contactez le support.
            </p>
            <p className="text-red-500 text-xs mt-1 font-mono">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stripeConnectInstance) return null;

  return (
    <div className={className}>
      <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
        {component === 'onboarding' && (
          <ConnectAccountOnboarding
            onExit={() => {
              onOnboardingComplete?.();
              onClose?.();
            }}
          />
        )}
        {component === 'account_management' && (
          <ConnectAccountManagement />
        )}
        {component === 'payments' && (
          <ConnectPayments />
        )}
        {component === 'payouts' && (
          <ConnectPayouts />
        )}
        {component === 'balances' && (
          <ConnectBalances />
        )}
      </ConnectComponentsProvider>
    </div>
  );
}

interface StripeOnboardingModalProps {
  onComplete: () => void;
  onClose: () => void;
}

export function StripeOnboardingModal({ onComplete, onClose }: StripeOnboardingModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartOnboarding = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Non authentifié');

      const returnUrl = `${window.location.origin}${window.location.pathname}?stripe_onboarding=success`;
      const refreshUrl = `${window.location.origin}${window.location.pathname}?stripe_refresh=true`;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-stripe-account-link`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ returnUrl, refreshUrl }),
        }
      );

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Impossible de générer le lien de configuration');
      }

      window.location.href = data.url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Configuration du compte vendeur</h3>
            <p className="text-xs text-gray-500 mt-0.5">Renseignez vos informations pour recevoir vos paiements</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-emerald-800">Documents requis par Stripe :</p>
            <ul className="text-sm text-emerald-700 space-y-1 list-disc list-inside">
              <li>Pièce d'identité (CNI ou passeport)</li>
              <li>Coordonnées bancaires (IBAN/RIB)</li>
              <li>Informations personnelles</li>
            </ul>
          </div>

          <p className="text-sm text-gray-600">
            Vous allez être redirigé vers Stripe pour configurer votre compte vendeur en toute sécurité.
            Une fois terminé, vous serez renvoyé automatiquement sur cette page.
          </p>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleStartOnboarding}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              {loading ? 'Redirection...' : 'Configurer avec Stripe'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
