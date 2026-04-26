import { useState } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../../lib/supabaseClient';
import { getStripe } from '../../lib/stripe';
import { ShippingSelection } from '../Shipping/ShippingSelection';

interface PaymentModalProps {
  listingId: string;
  listingTitle: string;
  amount: number;
  weightGrams?: number;
  onClose: () => void;
  onSuccess: () => void;
}

interface PaymentFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

function PaymentForm({ onSuccess, onError, loading, setLoading }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [elementReady, setElementReady] = useState(false);
  const [elementLoadError, setElementLoadError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements || !elementReady) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}#orders`,
        },
      });

      if (error) {
        onError(`Erreur Stripe (${error.type}): ${error.message || 'Erreur inattendue'}`);
        setLoading(false);
      } else {
        onSuccess();
      }
    } catch (err: any) {
      onError(err.message || 'Erreur lors du paiement');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {elementLoadError && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-red-800">Impossible de charger le formulaire de paiement</p>
            <p className="text-xs text-red-700 mt-0.5 font-mono break-all">{elementLoadError}</p>
          </div>
        </div>
      )}
      {!elementReady && !elementLoadError && (
        <div className="flex items-center justify-center py-6 gap-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Chargement du formulaire de paiement...</span>
        </div>
      )}
      <div className={elementReady ? 'block' : 'invisible h-0 overflow-hidden'}>
        <PaymentElement
          options={{ layout: 'tabs' }}
          onReady={() => setElementReady(true)}
          onLoadError={(e) => {
            const msg = (e as any)?.error?.message || (e as any)?.message || JSON.stringify(e);
            setElementLoadError(msg);
          }}
        />
      </div>
      {elementReady && (
        <button
          onClick={handleSubmit}
          disabled={!stripe || !elementReady || loading}
          className="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Traitement en cours...
            </>
          ) : (
            'Confirmer le paiement'
          )}
        </button>
      )}
    </div>
  );
}

export function PaymentModal({
  listingId,
  listingTitle,
  amount,
  weightGrams = 100,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [shippingData, setShippingData] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [creatingIntent, setCreatingIntent] = useState(false);

  const stripePromise = getStripe();

  const marketplaceCommissionRate = 0.10;
  const marketplaceCommission = amount * marketplaceCommissionRate;
  const shippingCost = shippingData?.cost || 0;
  const totalAmount = amount + marketplaceCommission + shippingCost;
  const sellerReceives = amount;

  const createPaymentIntent = async () => {
    if (!shippingData || !shippingData.address) {
      setError('Veuillez renseigner une adresse de livraison');
      return;
    }
    if (shippingData.method === 'mondial_relay' && !shippingData.relayPointId) {
      setError('Veuillez sélectionner un point relais');
      return;
    }

    setCreatingIntent(true);
    setError(null);
    setDebugInfo(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Non authentifie - veuillez vous reconnecter');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ listingId, shippingData: shippingData || {} }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        const errMsg = responseData.error || `Erreur serveur (HTTP ${response.status})`;
        throw new Error(errMsg);
      }

      const { clientSecret: secret } = responseData;

      if (!secret || typeof secret !== 'string' || !secret.includes('_secret_')) {
        setDebugInfo(`Valeur recue pour clientSecret: "${secret}"`);
        throw new Error('Le serveur n\'a pas retourne une cle de paiement valide.');
      }

      setClientSecret(secret);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la creation du paiement');
    } finally {
      setCreatingIntent(false);
    }
  };

  const needsRelayPoint = shippingData?.method === 'mondial_relay';
  const isShippingValid = shippingData && shippingData.sendcloudMethodId && shippingData.address &&
    (!needsRelayPoint || shippingData.relayPointId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between z-10 rounded-t-xl">
          <h3 className="text-sm font-bold text-gray-800">Paiement</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 space-y-3">
          {!clientSecret ? (
            <>
              <div>
                <ShippingSelection
                  onShippingSelected={setShippingData}
                  selectedMethod={shippingData?.method}
                  weight={weightGrams}
                />
              </div>

              <div className="p-2 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-1 text-xs">{listingTitle}</h4>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix de l'article:</span>
                    <span className="font-semibold">{amount.toFixed(2)} EUR</span>
                  </div>
                  {shippingCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frais de livraison ({shippingData?.method}):</span>
                      <span className="font-semibold">{shippingCost.toFixed(2)} EUR</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Commission ({(marketplaceCommissionRate * 100).toFixed(0)}%):</span>
                    <span className="font-semibold">+{marketplaceCommission.toFixed(2)} EUR</span>
                  </div>
                  <div className="border-t border-gray-200 pt-1 flex justify-between">
                    <span className="text-gray-600">Le vendeur recevra:</span>
                    <span className="font-semibold text-emerald-600">{sellerReceives.toFixed(2)} EUR</span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-1 flex justify-between text-xs">
                    <span className="font-bold text-gray-800">Total a payer:</span>
                    <span className="font-bold text-teal-600">{totalAmount.toFixed(2)} EUR</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-red-800">{error}</p>
                    {debugInfo && (
                      <p className="text-[10px] text-red-600 mt-1 font-mono break-all">{debugInfo}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={onClose}
                  disabled={creatingIntent}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={createPaymentIntent}
                  disabled={creatingIntent || !isShippingValid}
                  className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                >
                  {creatingIntent ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    `Continuer - ${totalAmount.toFixed(2)} EUR`
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="p-2 bg-gray-50 rounded-lg mb-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Total a payer:</span>
                  <span className="font-bold text-teal-600">{totalAmount.toFixed(2)} EUR</span>
                </div>
              </div>

              {error && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-800">{error}</p>
                </div>
              )}

              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#059669',
                      borderRadius: '8px',
                    },
                  },
                }}
              >
                <PaymentForm
                  onSuccess={onSuccess}
                  onError={setError}
                  loading={loading}
                  setLoading={setLoading}
                />
              </Elements>

              <button
                onClick={() => setClientSecret(null)}
                disabled={loading}
                className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm mt-2"
              >
                Retour
              </button>

              <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg mt-2">
                <p className="text-[11px] text-blue-800">
                  Paiement securise par Stripe. Vos informations bancaires ne sont jamais stockees sur notre plateforme.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
