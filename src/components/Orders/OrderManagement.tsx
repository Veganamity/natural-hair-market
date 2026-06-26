import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/database.types';
import { Package, Clock, CheckCircle, XCircle, Download, AlertTriangle, Shield, AlertOctagon } from 'lucide-react';
import { ShippingLabelManager } from '../Shipping/ShippingLabelManager';
import { TrackingInfo } from '../Shipping/TrackingInfo';
import { downloadInvoicePDF } from '../../lib/invoiceGenerator';

type Transaction = Database['public']['Tables']['transactions']['Row'] & {
  listing: Database['public']['Tables']['listings']['Row'] | null;
  buyer: Database['public']['Tables']['profiles']['Row'] | null;
  seller: Database['public']['Tables']['profiles']['Row'] | null;
  shipping_deadline_at?: string | null;
  delivery_deadline_at?: string | null;
};

function DeadlineBanner({ transaction, isSellerView }: { transaction: Transaction; isSellerView: boolean }) {
  const now = new Date();

  if (isSellerView && transaction.delivery_status === 'pending' && transaction.shipping_deadline_at) {
    const deadline = new Date(transaction.shipping_deadline_at);
    const hoursLeft = Math.round((deadline.getTime() - now.getTime()) / 3600000);
    const isOverdue = deadline < now;
    const isUrgent = !isOverdue && hoursLeft <= 24;

    if (isOverdue) {
      return (
        <div className="bg-red-50 border border-red-300 rounded-lg p-3 mb-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 font-medium">
            Délai d'expédition dépassé — cette commande sera annulée et l'acheteur remboursé automatiquement.
          </p>
        </div>
      );
    }

    if (isUrgent) {
      return (
        <div className="bg-orange-50 border border-orange-300 rounded-lg p-3 mb-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-orange-800 font-medium">
            Urgent : expédiez le colis avant le {deadline.toLocaleDateString('fr-FR')} à {deadline.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} (dans {hoursLeft}h).
          </p>
        </div>
      );
    }

    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 flex items-start gap-2">
        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Expédiez avant le <strong>{deadline.toLocaleDateString('fr-FR')}</strong> pour éviter l'annulation automatique.
        </p>
      </div>
    );
  }

  if (!isSellerView && transaction.delivery_status === 'shipped' && transaction.delivery_deadline_at) {
    const deadline = new Date(transaction.delivery_deadline_at);
    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / 86400000);

    if (daysLeft <= 3 && daysLeft > 0) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 flex items-start gap-2">
          <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Confirmez la réception avant le <strong>{deadline.toLocaleDateString('fr-FR')}</strong> ({daysLeft} jour{daysLeft > 1 ? 's' : ''} restant{daysLeft > 1 ? 's' : ''}). Après ce délai, le paiement sera libéré automatiquement au vendeur.
          </p>
        </div>
      );
    }
  }

  return null;
}

export function OrderManagement() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [disputeModal, setDisputeModal] = useState<{ transactionId: string } | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleOpenDispute = async (transactionId: string, reason: string) => {
    setProcessingId(transactionId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/open-dispute`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transactionId, reason }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to open dispute');

      setDisputeModal(null);
      setDisputeReason('');
      alert('Litige ouvert. L\'administrateur examinera votre demande dans les plus brefs délais.');
      fetchTransactions();
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user, activeTab]);

  const fetchTransactions = async () => {
    if (!user) return;
    setLoading(true);

    const { data: allData, error: allError } = await supabase
      .from('transactions')
      .select('*, listing:listings(*)')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('Error fetching transactions:', allError);
      setLoading(false);
      return;
    }

    const pendingStatuses = ['pending', 'processing'];
    const historyStatuses = ['cancelled', 'refunded', 'failed'];

    const filtered = (allData || []).filter(t => {
      if (activeTab === 'pending') {
        if (pendingStatuses.includes(t.status)) return true;
        if (t.status === 'completed' && !['delivered', 'cancelled'].includes(t.delivery_status)) return true;
        return false;
      } else {
        if (historyStatuses.includes(t.status)) return true;
        if (t.status === 'completed' && ['delivered', 'cancelled'].includes(t.delivery_status)) return true;
        return false;
      }
    });

    const allUserIds = new Set<string>();
    filtered.forEach((t: any) => {
      if (t.buyer_id) allUserIds.add(t.buyer_id);
      if (t.seller_id) allUserIds.add(t.seller_id);
    });

    let profilesMap: Record<string, any> = {};
    if (allUserIds.size > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('id', Array.from(allUserIds));
      (profilesData || []).forEach((p: any) => { profilesMap[p.id] = p; });
    }

    const enriched = filtered.map((t: any) => ({
      ...t,
      buyer: profilesMap[t.buyer_id] || null,
      seller: profilesMap[t.seller_id] || null,
    }));

    setTransactions(enriched as any);
    setLoading(false);
  };

  const handleConfirmDelivery = async (transactionId: string) => {
    if (!confirm('Confirmer la réception du colis ? Le paiement sera immédiatement libéré au vendeur.')) return;

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

      if (!response.ok) throw new Error(result.error || 'Failed to capture payment');

      alert('Livraison confirmée ! Le paiement a été libéré au vendeur.');
      fetchTransactions();
    } catch (error: any) {
      console.error('Error capturing payment:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelOrder = async (transactionId: string, hasPayment: boolean, isBuyer: boolean) => {
    const confirmMsg = hasPayment
      ? isBuyer
        ? 'Annuler cette commande ? Vous serez remboursé intégralement. Les fonds n\'ont pas encore été prélevés sur votre compte.'
        : 'Annuler cette commande et rembourser l\'acheteur ?'
      : 'Annuler cette transaction ?';

    if (!confirm(confirmMsg)) return;

    setProcessingId(transactionId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const endpoint = hasPayment ? 'cancel-payment' : 'cancel-transaction';

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transactionId, reason: 'Annulation par l\'utilisateur' }),
        }
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to cancel transaction');

      const successMsg = hasPayment
        ? result.action === 'refunded'
          ? 'Commande annulée. Le remboursement sera crédité sur votre moyen de paiement sous 5 à 10 jours ouvrés.'
          : 'Commande annulée avec succès.'
        : 'Transaction annulée avec succès.';

      alert(successMsg);
      fetchTransactions();
    } catch (error: any) {
      console.error('Error cancelling transaction:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Paiement autorisé' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Complété' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Annulé' },
      refunded: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Remboursé' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Échoué' },
      disputed: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Litige en cours' },
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
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-1">
          <Package className="w-7 h-7 text-teal-600" />
          Gestion des Commandes
        </h2>
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-4">
          <Shield className="w-4 h-4 flex-shrink-0" />
          <span>Paiements sécurisés — les fonds ne sont transférés au vendeur qu'après confirmation de réception.</span>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            En cours ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'completed'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Historique
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
          const isBuyerView = transaction.buyer_id === user?.id;
          const otherParty = isSellerView ? transaction.buyer : transaction.seller;
          const notYetShipped = !['shipped', 'delivered'].includes(transaction.delivery_status);
          const canCancel = ['pending', 'processing', 'completed'].includes(transaction.status) && notYetShipped && transaction.status !== 'disputed';
          const canConfirmDelivery = isBuyerView && transaction.delivery_status === 'shipped' && ['pending', 'processing', 'completed'].includes(transaction.status) && transaction.status !== 'disputed';
          const canDispute = isBuyerView && transaction.delivery_status === 'shipped' && ['pending', 'processing'].includes(transaction.status);
          const hasPaymentIntent = !!transaction.stripe_payment_intent_id;

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

                  <DeadlineBanner transaction={transaction} isSellerView={isSellerView} />

                  {transaction.status === 'disputed' && (
                    <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mb-3 flex items-start gap-2">
                      <AlertOctagon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-800">Litige en cours</p>
                        <p className="text-xs text-amber-700 mt-0.5">
                          L'administrateur examine votre litige. Les fonds sont bloqués jusqu'à résolution.
                        </p>
                        {(transaction as any).dispute_reason && (
                          <p className="text-xs text-amber-600 mt-1 italic">"{(transaction as any).dispute_reason}"</p>
                        )}
                      </div>
                    </div>
                  )}
                  {transaction.status === 'processing' && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Shield className="w-4 h-4" />
                        <p className="text-sm font-medium">
                          {isSellerView
                            ? 'Paiement autorisé et sécurisé — sera libéré à la confirmation de livraison par l\'acheteur.'
                            : 'Votre paiement est sécurisé — il ne sera débité qu\'à la confirmation de livraison.'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-sm text-gray-600">Montant total:</span>
                      <span className="ml-2 font-bold text-gray-800">{Number(transaction.amount).toFixed(2)}€</span>
                    </div>
                    {isSellerView && (
                      <div>
                        <span className="text-sm text-gray-600">Vous recevez:</span>
                        <span className="ml-2 font-bold text-green-600">{Number(transaction.seller_amount).toFixed(2)}€</span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">Commission:</span>
                      <span className="ml-2 font-semibold text-gray-700">{Number(transaction.platform_fee).toFixed(2)}€</span>
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
                    {isSellerView && transaction.shipping_deadline_at && transaction.delivery_status === 'pending' && (
                      <div className="col-span-2">
                        <span className="text-sm text-gray-600">Date limite d'expédition:</span>
                        <span className="ml-2 font-semibold text-amber-700">
                          {new Date(transaction.shipping_deadline_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[200px]">
                  {canConfirmDelivery && (
                    <button
                      onClick={() => handleConfirmDelivery(transaction.id)}
                      disabled={processingId === transaction.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {processingId === transaction.id ? 'En cours...' : 'Confirmer réception'}
                    </button>
                  )}
                  {canDispute && (
                    <button
                      onClick={() => setDisputeModal({ transactionId: transaction.id })}
                      disabled={processingId === transaction.id}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <AlertOctagon className="w-4 h-4" />
                      Signaler un problème
                    </button>
                  )}
                  {canCancel && (
                    <button
                      onClick={() => handleCancelOrder(transaction.id, hasPaymentIntent, isBuyerView)}
                      disabled={processingId === transaction.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-4 h-4" />
                      {processingId === transaction.id ? 'En cours...' : isBuyerView ? 'Annuler & Rembourser' : 'Annuler'}
                    </button>
                  )}
                  {['completed', 'cancelled', 'refunded'].includes(transaction.status) && (
                    <button
                      onClick={() => downloadInvoicePDF({
                        transaction,
                        listing: transaction.listing,
                        buyer: transaction.buyer!,
                        seller: transaction.seller!,
                      })}
                      className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger la facture
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                {isSellerView ? (
                  <ShippingLabelManager
                    transactionId={transaction.id}
                    shippingLabelUrl={transaction.shipping_label_pdf_url}
                    trackingNumber={transaction.shipping_label_tracking_number || transaction.tracking_number}
                    shippingStatus={transaction.shipping_status || transaction.delivery_status}
                    relayPointName={transaction.relay_point_name}
                    relayPointAddress={transaction.relay_point_address}
                    shippingMethod={transaction.shipping_method}
                    relayPointId={transaction.relay_point_id}
                    sendcloudParcelId={transaction.sendcloud_parcel_id}
                    onUpdate={fetchTransactions}
                  />
                ) : (
                  <TrackingInfo
                    trackingNumber={transaction.shipping_label_tracking_number || transaction.tracking_number}
                    shippingStatus={transaction.shipping_status || transaction.delivery_status}
                    shippedAt={transaction.shipped_at}
                    deliveredAt={transaction.delivered_at}
                    shippingMethod={transaction.shipping_method}
                    relayPointName={transaction.relay_point_name}
                    relayPointAddress={transaction.relay_point_address}
                    labelError={transaction.label_generation_error}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dispute modal */}
      {disputeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertOctagon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Signaler un problème</h3>
                <p className="text-sm text-gray-500">Les fonds resteront bloqués jusqu'à résolution par l'administrateur.</p>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Décrivez le problème <span className="text-red-500">*</span>
              </label>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                rows={4}
                placeholder="Ex: Le colis est arrivé endommagé, la mèche ne correspond pas à la description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setDisputeModal(null); setDisputeReason(''); }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleOpenDispute(disputeModal.transactionId, disputeReason)}
                disabled={!disputeReason.trim() || processingId === disputeModal.transactionId}
                className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingId === disputeModal.transactionId ? 'Envoi...' : 'Ouvrir le litige'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
