import { useState } from 'react';
import { X, CreditCard, Building2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { getStripe } from '../../lib/stripe';
import { ShippingSelection } from '../Shipping/ShippingSelection';

interface PaymentModalProps {
  listingId: string;
  listingTitle: string;
  amount: number;
  sellerShippingFee: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({
  listingId,
  listingTitle,
  amount,
  sellerShippingFee,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'sepa_debit' | 'card'>('sepa_debit');
  const [shippingData, setShippingData] = useState<any>(null);

  const marketplaceCommissionRate = 0.10;
  const marketplaceCommission = amount * marketplaceCommissionRate;
  const shippingCost = shippingData?.cost || 0;
  const totalAmount = amount + marketplaceCommission + sellerShippingFee + shippingCost;
  const sellerReceives = amount + sellerShippingFee;

  const handlePayment = async () => {
    if (shippingData) {
      if ((shippingData.method === 'chronopost' || shippingData.method === 'colissimo') && !shippingData.address) {
        setError('Veuillez renseigner une adresse de livraison');
        return;
      }

      if (shippingData.method === 'mondial_relay' && !shippingData.relayPointId) {
        setError('Veuillez sélectionner un point relais');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Non authentifié');
      }

      const paymentData: any = {
        listingId,
        shippingData: shippingData || {},
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du paiement');
      }

      const { clientSecret } = await response.json();

      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe non disponible');
      }

      const { error: stripeError } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}`,
          payment_method_data: {
            type: paymentMethod,
          },
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      alert('Paiement initié avec succes! Le vendeur recevra le paiement dans 1-3 jours ouvrables.');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-1.5 flex items-center justify-between z-10 rounded-t-xl">
          <h3 className="text-sm font-bold text-gray-800">Paiement</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 space-y-2">
          <div>
            <ShippingSelection
              onShippingSelected={setShippingData}
              selectedMethod={shippingData?.method}
            />
          </div>

          <div className="p-2 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-1 text-xs">{listingTitle}</h4>
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-600">Prix de l'article:</span>
                <span className="font-semibold">{amount.toFixed(2)} EUR</span>
              </div>
              {sellerShippingFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais vendeur:</span>
                  <span className="font-semibold">{sellerShippingFee.toFixed(2)} EUR</span>
                </div>
              )}
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

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Paiement
            </label>
            <div className="space-y-1.5">
              <button
                onClick={() => setPaymentMethod('sepa_debit')}
                className={`w-full p-2 rounded-lg border-2 transition-all flex items-center gap-1.5 ${
                  paymentMethod === 'sepa_debit'
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building2 className={`w-4 h-4 ${paymentMethod === 'sepa_debit' ? 'text-emerald-600' : 'text-gray-400'}`} />
                <div className="text-left flex-1">
                  <div className="font-semibold text-gray-800 text-xs">SEPA</div>
                  <div className="text-[10px] text-gray-600">1-3 jours</div>
                </div>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-2 rounded-lg border-2 transition-all flex items-center gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className={`w-4 h-4 ${paymentMethod === 'card' ? 'text-emerald-600' : 'text-gray-400'}`} />
                <div className="text-left flex-1">
                  <div className="font-semibold text-gray-800 text-xs">Carte</div>
                  <div className="text-[10px] text-gray-600">Immediat</div>
                </div>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-1.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-1.5">
              <AlertCircle className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-800">{error}</p>
            </div>
          )}

          <div className="p-1.5 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-[10px] text-blue-800">
              Paiement Stripe Connect securise. Le vendeur expedie directement et recoit le paiement sous 1-3 jours.
            </p>
          </div>

          <div className="flex gap-2 sticky bottom-0 bg-white pt-2 pb-1 border-t border-gray-200 -mx-3 px-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 text-xs"
            >
              Annuler
            </button>
            <button
              onClick={handlePayment}
              disabled={loading || !shippingData || !shippingData.address}
              className="flex-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            >
              {loading ? 'Traitement...' : `Payer ${totalAmount.toFixed(2)} EUR`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
