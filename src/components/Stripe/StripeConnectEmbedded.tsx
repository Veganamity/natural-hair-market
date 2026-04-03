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
import { Loader2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

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
            <p className="text-red-800 font-semibold text-sm">Erreur de chargement</p>
            <p className="text-red-700 text-xs mt-1">{error}</p>
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
  const [completed, setCompleted] = useState(false);

  const handleComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({
          stripe_onboarding_completed: true,
          stripe_account_status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
    }
    setCompleted(true);
    setTimeout(() => {
      onComplete();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Configuration du compte vendeur</h3>
            <p className="text-xs text-gray-500 mt-0.5">Renseignez vos informations pour recevoir vos paiements</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {completed ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <CheckCircle className="w-16 h-16 text-emerald-500" />
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">Compte configuré !</p>
                <p className="text-gray-600 text-sm mt-1">Vous pouvez maintenant recevoir des paiements.</p>
              </div>
            </div>
          ) : (
            <StripeConnectEmbedded
              component="onboarding"
              onOnboardingComplete={handleComplete}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
