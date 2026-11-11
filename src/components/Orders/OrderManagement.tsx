import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
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
  authorization_expires_at?: string | null;
};

function DeadlineBanner({ transaction, isSellerView }: { transaction: Transaction; isSellerView: boolean }) {
  const { t, language } = useLanguage();
  const locale = language === 'fr' ? 'fr-FR' : 'en-US';
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
            {t('orders.deadlineExpired')}
          </p>
        </div>
      );
    }

    if (isUrgent) {
      return (
        <div className="bg-orange-50 border border-orange-300 rounded-lg p-3 mb-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-orange-800 font-medium">
            {t('orders.deadlineUrgent')
              .replace('{date}', deadline.toLocaleDateString(locale))
              .replace('{time}', deadline.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }))
              .replace('{hoursLeft}', String(hoursLeft))}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 flex items-start gap-2">
        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          {t('orders.deadlineWarning').split('{date}')[0]}
          <strong>{deadline.toLocaleDateString(locale)}</strong>
          {t('orders.deadlineWarning').split('{date}')[1]}
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
            {t('orders.confirmDeadline').split('{date}')[0]}
            <strong>{deadline.toLocaleDateString(locale)}</strong>
            {t('orders.confirmDeadline').split('{date}')[1].replace('{daysLeft}', String(daysLeft))}
          </p>
        </div>
      );
    }
  }

  // Authorization expiry warning for the buyer (funds will be auto-captured if deadline passes)
  if (!isSellerView && transaction.authorization_expires_at && ['pending', 'processing'].includes(transaction.status)) {
    const authDeadline = new Date(transaction.authorization_expires_at);
    const hoursLeft = Math.round((authDeadline.getTime() - now.getTime()) / 3600000);

    if (hoursLeft > 0 && hoursLeft <= 48) {
      return (
        <div className="bg-orange-50 border border-orange-300 rounded-lg p-3 mb-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-orange-800 font-medium">
            {t('orders.confirmDeadlineWarning').split('{date}')[0]}
            <strong>{authDeadline.toLocaleDateString(locale)}</strong> {language === 'fr' ? 'à' : 'at'} {authDeadline.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
            {t('orders.confirmDeadlineWarning').split('{date}')[1]}
          </p>
        </div>
      );
    }

    if (hoursLeft > 48) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 flex items-start gap-2">
          <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            {t('orders.confirmDeadlineWarning').split('{date}')[0]}
            <strong>{authDeadline.toLocaleDateString(locale)}</strong>
            {t('orders.confirmDeadlineWarning').split('{date}')[1]}
          </p>
        </div>
      );
    }
  }

  return null;
}

export function OrderManagement() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const locale = language === 'fr' ? 'fr-FR' : 'en-US';
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
      alert(t('orders.disputeOpened'));
      fetchTransactions();
    } catch (error: any) {
      alert(`${t('common.error')}: ${error.message}`);
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
    if (!confirm(t('orders.confirmReceptionMsg'))) return;

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

      alert(t('orders.receptionConfirmed'));
      fetchTransactions();
    } catch (error: any) {
      console.error('Error capturing payment:', error);
      alert(`${t('common.error')}: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelOrder = async (transactionId: string, hasPayment: boolean, isBuyer: boolean) => {
    const confirmMsg = hasPayment
      ? isBuyer
        ? t('orders.cancelConfirmBuyer')
        : t('orders.cancelConfirmSeller')
      : t('orders.cancelConfirmNoPayment');

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
          body: JSON.stringify({ transactionId, reason: t('orders.cancelReason') }),
        }
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to cancel transaction');

      const successMsg = hasPayment
        ? result.action === 'refunded'
          ? t('orders.cancelSuccessRefunded')
          : t('orders.cancelSuccess')
        : t('orders.cancelSuccessNoPayment');

      alert(successMsg);
      fetchTransactions();
    } catch (error: any) {
      console.error('Error cancelling transaction:', error);
      alert(`${t('common.error')}: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: t('orders.pending') },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: t('orders.paymentAuthorized') },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: t('orders.completed') },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', label: t('orders.cancelled') },
      refunded: { bg: 'bg-orange-100', text: 'text-orange-800', label: t('orders.refunded') },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: t('orders.failed') },
      disputed: { bg: 'bg-amber-100', text: 'text-amber-800', label: t('orders.disputed') },
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
      pending: { bg: 'bg-gray-100', text: 'text-gray-800', label: t('orders.notShipped') },
      shipped: { bg: 'bg-blue-100', text: 'text-blue-800', label: t('orders.shipped') },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: t('orders.delivered') },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: t('orders.cancelled') },
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
        <div className="text-gray-500">{t('orders.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-1">
          <Package className="w-7 h-7 text-teal-600" />
          {t('orders.title')}
        </h2>
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-4">
          <Shield className="w-4 h-4 flex-shrink-0" />
          <span>{t('orders.securityBanner')}</span>
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
            {t('orders.inProgress')} ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'completed'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('orders.history')}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500">{t('orders.noOrders')}</p>
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
                        {transaction.listing?.title || t('transactions.articleDeleted')}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {isSellerView ? t('orders.buyer') : t('orders.seller')}: <span className="font-semibold">{otherParty?.full_name || t('common.user')}</span>
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
                        <p className="text-sm font-semibold text-amber-800">{t('orders.disputeInProgress')}</p>
                        <p className="text-xs text-amber-700 mt-0.5">
                          {t('orders.disputeDesc')}
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
                            ? t('orders.paymentSecured')
                            : t('orders.paymentSecuredBuyer')}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-sm text-gray-600">{t('orders.totalAmount')}</span>
                      <span className="ml-2 font-bold text-gray-800">{Number(transaction.amount).toFixed(2)}€</span>
                    </div>
                    {isSellerView && (
                      <div>
                        <span className="text-sm text-gray-600">{t('orders.youReceive')}</span>
                        <span className="ml-2 font-bold text-green-600">{Number(transaction.seller_amount).toFixed(2)}€</span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">{t('orders.commission')}</span>
                      <span className="ml-2 font-semibold text-gray-700">{Number(transaction.platform_fee).toFixed(2)}€</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">{t('orders.date')}</span>
                      <span className="ml-2 text-gray-700">{new Date(transaction.created_at).toLocaleDateString(locale)}</span>
                    </div>
                    {transaction.shipping_carrier && (
                      <div>
                        <span className="text-sm text-gray-600">{t('orders.carrier')}</span>
                        <span className="ml-2 font-semibold text-gray-800">{transaction.shipping_carrier}</span>
                      </div>
                    )}
                    {transaction.shipping_price && transaction.shipping_price > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">{t('orders.shippingFee')}</span>
                        <span className="ml-2 font-semibold text-gray-800">{Number(transaction.shipping_price).toFixed(2)}€</span>
                      </div>
                    )}
                    {isSellerView && transaction.shipping_deadline_at && transaction.delivery_status === 'pending' && (
                      <div className="col-span-2">
                        <span className="text-sm text-gray-600">{t('orders.shippingDeadline')}</span>
                        <span className="ml-2 font-semibold text-amber-700">
                          {new Date(transaction.shipping_deadline_at).toLocaleDateString(locale)}
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
                      {processingId === transaction.id ? t('common.loading') : t('orders.confirmReception')}
                    </button>
                  )}
                  {canDispute && (
                    <button
                      onClick={() => setDisputeModal({ transactionId: transaction.id })}
                      disabled={processingId === transaction.id}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <AlertOctagon className="w-4 h-4" />
                      {t('orders.reportProblem')}
                    </button>
                  )}
                  {canCancel && (
                    <button
                      onClick={() => handleCancelOrder(transaction.id, hasPaymentIntent, isBuyerView)}
                      disabled={processingId === transaction.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-4 h-4" />
                      {processingId === transaction.id ? t('common.loading') : isBuyerView ? t('orders.cancelRefund') : t('orders.cancel')}
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
                      {t('orders.downloadInvoice')}
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
                <h3 className="text-lg font-bold text-gray-900">{t('orders.disputeModalTitle')}</h3>
                <p className="text-sm text-gray-500">{t('orders.disputeModalDesc')}</p>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('orders.describeProblem')} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                rows={4}
                placeholder={t('orders.problemPlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setDisputeModal(null); setDisputeReason(''); }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => handleOpenDispute(disputeModal.transactionId, disputeReason)}
                disabled={!disputeReason.trim() || processingId === disputeModal.transactionId}
                className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingId === disputeModal.transactionId ? t('orders.openingDispute') : t('orders.openDispute')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
