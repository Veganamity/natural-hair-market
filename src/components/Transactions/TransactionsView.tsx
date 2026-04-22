import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/database.types';
import { Receipt, TrendingUp, TrendingDown, Package, Truck, MapPin, HandHeart, Wallet, BarChart2, ChevronDown, ChevronUp, Download, Printer, Loader2, AlertCircle } from 'lucide-react';
import { StripeConnectEmbedded } from '../Stripe/StripeConnectEmbedded';
import { downloadInvoicePDF } from '../../lib/invoiceGenerator';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type Listing = Database['public']['Tables']['listings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface TransactionWithDetails extends Transaction {
  listing: Listing | null;
  buyer: Profile;
  seller: Profile;
}

export function TransactionsView() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<TransactionWithDetails[]>([]);
  const [sales, setSales] = useState<TransactionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'purchases' | 'sales' | 'dashboard'>('purchases');
  const [generatingLabel, setGeneratingLabel] = useState<string | null>(null);
  const [labelErrors, setLabelErrors] = useState<Record<string, string>>({});
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [stripeOnboardingCompleted, setStripeOnboardingCompleted] = useState(false);
  const [showBalances, setShowBalances] = useState(false);
  const [showPayments, setShowPayments] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;

    setLoading(true);

    const [purchasesRes, salesRes, profileRes] = await Promise.all([
      supabase
        .from('transactions')
        .select('*, listing:listings(*)')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('transactions')
        .select('*, listing:listings(*)')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('profiles')
        .select('stripe_account_id, stripe_onboarding_completed')
        .eq('id', user.id)
        .maybeSingle(),
    ]);

    if (purchasesRes.error) console.error('Purchases fetch error:', purchasesRes.error);
    if (salesRes.error) console.error('Sales fetch error:', salesRes.error);

    const rawPurchases = purchasesRes.data || [];
    const rawSales = salesRes.data || [];

    const allUserIds = new Set<string>();
    [...rawPurchases, ...rawSales].forEach((t: any) => {
      if (t.buyer_id) allUserIds.add(t.buyer_id);
      if (t.seller_id) allUserIds.add(t.seller_id);
    });

    let profilesMap: Record<string, Profile> = {};
    if (allUserIds.size > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('id', Array.from(allUserIds));
      (profilesData || []).forEach((p: Profile) => {
        profilesMap[p.id] = p;
      });
    }

    const enrich = (t: any): TransactionWithDetails => ({
      ...t,
      buyer: profilesMap[t.buyer_id] || { id: t.buyer_id, full_name: 'Utilisateur' } as Profile,
      seller: profilesMap[t.seller_id] || { id: t.seller_id, full_name: 'Utilisateur' } as Profile,
    });

    setPurchases(rawPurchases.map(enrich));
    setSales(rawSales.map(enrich));

    if (profileRes.data) {
      setStripeAccountId(profileRes.data.stripe_account_id);
      setStripeOnboardingCompleted(profileRes.data.stripe_onboarding_completed ?? false);
    }
    setLoading(false);
  };

  const generateMondialRelayLabel = async (transaction: TransactionWithDetails) => {
    if (!transaction.relay_point_id) return;
    setGeneratingLabel(transaction.id);
    setLabelErrors(prev => ({ ...prev, [transaction.id]: '' }));

    const TIMEOUT_MS = 20000;
    const RETRY_DELAY_MS = 3000;
    const deadline = Date.now() + TIMEOUT_MS;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Non authentifié');

      while (Date.now() < deadline) {
        let response: Response;
        try {
          response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/download-shipping-label`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ transactionId: transaction.id }),
            }
          );
        } catch (networkErr) {
          console.error('Network error during label fetch:', networkErr);
          throw new Error('Erreur réseau lors du téléchargement.');
        }

        console.log('download-shipping-label response status:', response.status, 'content-type:', response.headers.get('content-type'));

        if (response.ok) {
          const blob = await response.blob();
          console.log('Blob size:', blob.size, 'type:', blob.type);
          if (blob.size > 100) {
            const objectUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = objectUrl;
            a.download = 'etiquette-expedition.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(objectUrl);
            await fetchTransactions();
            return;
          }
          console.warn('Blob too small, retrying...');
        } else if (response.status === 503) {
          console.log('503: label not ready yet, retrying...');
        } else {
          const err = await response.json().catch(() => ({ error: `Erreur ${response.status}` }));
          throw new Error(err.error || `Erreur ${response.status}`);
        }

        const remaining = deadline - Date.now();
        if (remaining <= 0) break;
        await new Promise(r => setTimeout(r, Math.min(RETRY_DELAY_MS, remaining)));
      }

      throw new Error("Délai d'attente dépassé. L'étiquette n'est pas encore disponible, réessayez dans quelques instants.");
    } catch (err: any) {
      setLabelErrors(prev => ({ ...prev, [transaction.id]: err.message || 'Erreur inconnue' }));
    } finally {
      setGeneratingLabel(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-gray-100 text-gray-600',
    };

    const labels: Record<string, string> = {
      pending: 'En attente',
      processing: 'En cours',
      completed: 'Terminé',
      failed: 'Échoué',
      refunded: 'Remboursé',
      cancelled: 'Annulé',
      disputed: 'Litige',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPurchases = purchases.reduce((sum, t) => sum + (t.status === 'completed' ? Number(t.amount) : 0), 0);
  const totalSales = sales.reduce((sum, t) => sum + (t.status === 'completed' ? Number(t.seller_amount) : 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des transactions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Receipt className="w-7 h-7 text-emerald-600" />
          Mes Transactions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Total Dépensé</h3>
              <TrendingDown className="w-5 h-5 opacity-75" />
            </div>
            <p className="text-3xl font-bold">{totalPurchases.toFixed(2)}€</p>
            <p className="text-xs opacity-75 mt-1">{purchases.filter(t => t.status === 'completed').length} achats terminés</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Total Gagné</h3>
              <TrendingUp className="w-5 h-5 opacity-75" />
            </div>
            <p className="text-3xl font-bold">{totalSales.toFixed(2)}€</p>
            <p className="text-xs opacity-75 mt-1">{sales.filter(t => t.status === 'completed').length} ventes terminées</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'purchases'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Achats ({purchases.length})
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'sales'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Ventes ({sales.length})
          </button>
          {stripeAccountId && stripeOnboardingCompleted && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Wallet className="w-4 h-4" />
              Mon Tableau de bord
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === 'dashboard' && stripeAccountId && stripeOnboardingCompleted && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">Mon Solde & Virements</p>
                    <p className="text-xs text-gray-500">Consultez votre solde disponible et vos virements</p>
                  </div>
                </div>
                {showBalances ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {showBalances && (
                <div className="border-t border-gray-100 p-4">
                  <StripeConnectEmbedded component="balances" />
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <button
                onClick={() => setShowPayments(!showPayments)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <BarChart2 className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">Mes Paiements reçus</p>
                    <p className="text-xs text-gray-500">Détail de tous les paiements sur votre compte</p>
                  </div>
                </div>
                {showPayments ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {showPayments && (
                <div className="border-t border-gray-100 p-4">
                  <StripeConnectEmbedded component="payments" />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'purchases' && purchases.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500">Aucun achat</p>
          </div>
        )}

        {activeTab === 'sales' && sales.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500">Aucune vente</p>
          </div>
        )}

        {activeTab === 'purchases' &&
          purchases.map((transaction) => (
            <div key={transaction.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg mb-1">
                        {transaction.listing?.title || 'Article supprimé'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Vendeur: <span className="font-semibold">{transaction.seller.full_name || 'Utilisateur'}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(transaction.status)}
                      <button
                        onClick={() => downloadInvoicePDF({ transaction, listing: transaction.listing, buyer: transaction.buyer, seller: transaction.seller })}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                        title="Télécharger la facture"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Facture
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mb-2">
                    <div>
                      <span className="text-sm text-gray-600">Montant payé:</span>
                      <span className="ml-2 font-bold text-gray-800 text-lg">{Number(transaction.amount).toFixed(2)}€</span>
                    </div>
                  </div>
                  {transaction.shipping_method && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {transaction.shipping_method === 'mondial_relay' ? (
                          <Package className="w-4 h-4 text-teal-600" />
                        ) : transaction.shipping_method === 'hand_delivery' ? (
                          <HandHeart className="w-4 h-4 text-green-600" />
                        ) : (
                          <Truck className="w-4 h-4 text-teal-600" />
                        )}
                        <span className="text-sm font-semibold text-gray-800">
                          {transaction.shipping_method === 'mondial_relay'
                            ? 'Mondial Relay'
                            : transaction.shipping_method === 'hand_delivery'
                            ? 'Remise en main propre'
                            : 'Chronopost'}
                        </span>
                        {transaction.shipping_cost ? (
                          <span className="text-sm text-gray-600">
                            ({Number(transaction.shipping_cost).toFixed(2)}€)
                          </span>
                        ) : (
                          <span className="text-sm text-green-600 font-semibold">(Gratuit)</span>
                        )}
                      </div>
                      {transaction.shipping_method === 'mondial_relay' && transaction.relay_point_name && (
                        <div className="flex items-start gap-2 text-xs text-gray-600">
                          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">{transaction.relay_point_name}</p>
                            <p>{transaction.relay_point_address}</p>
                          </div>
                        </div>
                      )}
                      {transaction.tracking_number && (
                        <p className="text-xs text-gray-600 mt-2">
                          Suivi: <span className="font-mono font-semibold">{transaction.tracking_number}</span>
                        </p>
                      )}
                      {transaction.shipped_at && (
                        <p className="text-xs text-teal-600 mt-1">
                          Expédié le {formatDate(transaction.shipped_at)}
                        </p>
                      )}
                      {transaction.delivered_at && (
                        <p className="text-xs text-green-600 mt-1">
                          Livré le {formatDate(transaction.delivered_at)}
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">{formatDate(transaction.created_at)}</p>
                </div>
              </div>
            </div>
          ))}

        {activeTab === 'sales' &&
          sales.map((transaction) => (
            <div key={transaction.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg mb-1">
                        {transaction.listing?.title || 'Article supprimé'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Acheteur: <span className="font-semibold">{transaction.buyer.full_name || 'Utilisateur'}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(transaction.status)}
                      <button
                        onClick={() => downloadInvoicePDF({ transaction, listing: transaction.listing, buyer: transaction.buyer, seller: transaction.seller })}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                        title="Télécharger la facture"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Facture
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Prix de vente</span>
                      <span className="font-semibold text-gray-800 text-sm">{Number(transaction.amount).toFixed(2)}€</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Commission</span>
                      <span className="font-semibold text-red-600 text-sm">-{Number(transaction.platform_fee).toFixed(2)}€</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Vous recevez</span>
                      <span className="font-bold text-emerald-600 text-sm">{Number(transaction.seller_amount).toFixed(2)}€</span>
                    </div>
                  </div>
                  {transaction.shipping_method && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {transaction.shipping_method === 'mondial_relay' ? (
                          <Package className="w-4 h-4 text-teal-600" />
                        ) : transaction.shipping_method === 'hand_delivery' ? (
                          <HandHeart className="w-4 h-4 text-green-600" />
                        ) : (
                          <Truck className="w-4 h-4 text-teal-600" />
                        )}
                        <span className="text-sm font-semibold text-gray-800">
                          {transaction.shipping_method === 'mondial_relay'
                            ? 'Mondial Relay'
                            : transaction.shipping_method === 'hand_delivery'
                            ? 'Remise en main propre'
                            : 'Chronopost'}
                        </span>
                        {transaction.shipping_cost ? (
                          <span className="text-sm text-gray-600">
                            ({Number(transaction.shipping_cost).toFixed(2)}€)
                          </span>
                        ) : (
                          <span className="text-sm text-green-600 font-semibold">(Gratuit)</span>
                        )}
                      </div>
                      {transaction.shipping_method === 'mondial_relay' && transaction.relay_point_name && (
                        <div className="flex items-start gap-2 text-xs text-gray-600">
                          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">{transaction.relay_point_name}</p>
                            <p>{transaction.relay_point_address}</p>
                          </div>
                        </div>
                      )}
                      {(transaction.shipping_method === 'mondial_relay' || (transaction as any).relay_point_id) && (
                        <div className="mt-3 space-y-1">
                          <button
                            onClick={() => generateMondialRelayLabel(transaction)}
                            disabled={generatingLabel === transaction.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {generatingLabel === transaction.id ? (
                              <><Loader2 className="w-3.5 h-3.5 animate-spin" />Téléchargement...</>
                            ) : (
                              <><Download className="w-3.5 h-3.5" />Télécharger l'étiquette</>
                            )}
                          </button>
                          {labelErrors[transaction.id] && (
                            <div className="flex items-center gap-1 text-xs text-red-600">
                              <AlertCircle className="w-3 h-3 flex-shrink-0" />
                              <span>{labelErrors[transaction.id]}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {transaction.tracking_number && (
                        <p className="text-xs text-gray-600 mt-2">
                          Suivi: <span className="font-mono font-semibold">{transaction.tracking_number}</span>
                        </p>
                      )}
                      {transaction.shipped_at && (
                        <p className="text-xs text-teal-600 mt-1">
                          Expédié le {formatDate(transaction.shipped_at)}
                        </p>
                      )}
                      {transaction.delivered_at && (
                        <p className="text-xs text-green-600 mt-1">
                          Livré le {formatDate(transaction.delivered_at)}
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">{formatDate(transaction.created_at)}</p>
                  {transaction.status === 'completed' && (
                    <p className="text-xs text-emerald-600 font-medium mt-1">
                      Paiement envoyé à votre compte bancaire
                    </p>
                  )}
                  {transaction.status === 'refunded' && (
                    <p className="text-xs text-orange-600 font-medium mt-1">
                      Paiement remboursé à l'acheteur
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
