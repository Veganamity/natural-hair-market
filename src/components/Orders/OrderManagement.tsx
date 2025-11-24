import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/database.types';
import { Package, Check, X, Clock, CheckCircle, XCircle } from 'lucide-react';
import { ShippingLabelManager } from '../Shipping/ShippingLabelManager';
import { TrackingInfo } from '../Shipping/TrackingInfo';

type Transaction = Database['public']['Tables']['transactions']['Row'] & {
  listing: Database['public']['Tables']['listings']['Row'] | null;
  buyer: Database['public']['Tables']['profiles']['Row'] | null;
  seller: Database['public']['Tables']['profiles']['Row'] | null;
};

export function OrderManagement() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, activeTab]);

  const fetchTransactions = async () => {
    if (!user) return;

    setLoading(true);

    const query = supabase
      .from('transactions')
      .select('*, listing:listings(*), buyer:profiles!transactions_buyer_id_fkey(*), seller:profiles!transactions_seller_id_fkey(*)')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (activeTab === 'pending') {
      query.in('status', ['pending', 'processing']);
    } else {
      query.in('status', ['completed', 'cancelled', 'refunded', 'failed']);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data as any);
    }

    setLoading(false);
  };

  const handleConfirmDelivery = async (transactionId: string) => {
    if (!confirm('Confirmer la livraison et capturer le paiement ?')) return;

    setProcessingId(transactionId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/capture-payment`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transactionId }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to capture payment');
      }

      alert('Paiement capturé avec succès !');
      fetchTransactions();
    } catch (error: any) {
      console.error('Error capturing payment:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelOrder = async (transactionId: string) => {
    if (!confirm('Annuler cette commande et rembourser l\'acheteur ?')) return;

    setProcessingId(transactionId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cancel-payment`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transactionId, reason: 'requested_by_customer' }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to cancel payment');
      }

      alert('Commande annulée avec succès !');
      fetchTransactions();
    } catch (error: any) {
      console.error('Error cancelling payment:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'En cours' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Complété' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Annulé' },
      refunded: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Remboursé' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Échoué' },
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getDeliveryBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Non expédié' },
      shipped: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Expédié' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Livré' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Annulé' },
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des commandes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Package className="w-7 h-7 text-teal-600" />
          Gestion des Commandes
        </h2>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            En attente ({transactions.filter(t => ['pending', 'processing'].includes(t.status)).length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'completed'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Historique ({transactions.filter(t => !['pending', 'processing'].includes(t.status)).length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500">Aucune commande</p>
          </div>
        )}

        {transactions.map((transaction) => {
          const isSellerView = transaction.seller_id === user?.id;
          const otherParty = isSellerView ? transaction.buyer : transaction.seller;
          const canConfirm = isSellerView && transaction.status === 'processing';
          const canCancel = ['pending', 'processing'].includes(transaction.status);

          return (
            <div key={transaction.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg mb-1">
                        {transaction.listing?.title || 'Annonce supprimée'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {isSellerView ? 'Acheteur' : 'Vendeur'}: <span className="font-semibold">{otherParty?.full_name || 'Utilisateur'}</span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {getStatusBadge(transaction.status)}
                      {getDeliveryBadge(transaction.delivery_status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-sm text-gray-600">Montant total:</span>
                      <span className="ml-2 font-bold text-gray-800">{transaction.amount}€</span>
                    </div>
                    {isSellerView && (
                      <div>
                        <span className="text-sm text-gray-600">Vous recevez:</span>
                        <span className="ml-2 font-bold text-green-600">{transaction.seller_amount}€</span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">Commission:</span>
                      <span className="ml-2 font-semibold text-gray-700">{transaction.platform_fee}€</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Date:</span>
                      <span className="ml-2 text-gray-700">{new Date(transaction.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {transaction.shipping_carrier && (
                      <div>
                        <span className="text-sm text-gray-600">Transporteur:</span>
                        <span className="ml-2 font-semibold text-gray-800">{transaction.shipping_carrier}</span>
                      </div>
                    )}
                    {transaction.shipping_price && transaction.shipping_price > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">Frais d'envoi:</span>
                        <span className="ml-2 font-semibold text-gray-800">{Number(transaction.shipping_price).toFixed(2)}€</span>
                      </div>
                    )}
                  </div>

                  {transaction.capture_method === 'manual' && transaction.status === 'processing' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Clock className="w-4 h-4" />
                        <p className="text-sm font-medium">
                          Paiement autorisé - En attente de confirmation de livraison
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {(canConfirm || canCancel) && (
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    {canConfirm && (
                      <button
                        onClick={() => handleConfirmDelivery(transaction.id)}
                        disabled={processingId === transaction.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {processingId === transaction.id ? 'En cours...' : 'Confirmer livraison'}
                      </button>
                    )}
                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(transaction.id)}
                        disabled={processingId === transaction.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-4 h-4" />
                        {processingId === transaction.id ? 'En cours...' : 'Annuler'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                {isSellerView ? (
                  <ShippingLabelManager
                    transactionId={transaction.id}
                    shippingLabelUrl={transaction.shipping_label_url}
                    trackingNumber={transaction.tracking_number}
                    shippingStatus={transaction.shipping_status}
                    onUpdate={fetchTransactions}
                  />
                ) : (
                  <TrackingInfo
                    trackingNumber={transaction.tracking_number}
                    shippingStatus={transaction.shipping_status}
                    shippedAt={transaction.shipped_at}
                    deliveredAt={transaction.delivered_at}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
