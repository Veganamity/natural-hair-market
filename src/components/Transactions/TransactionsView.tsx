import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/database.types';
import { Receipt, TrendingUp, TrendingDown, Package, Truck, MapPin, HandHeart } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'purchases' | 'sales'>('purchases');

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;

    setLoading(true);

    const { data: purchasesData } = await supabase
      .from('transactions')
      .select('*, listing:listings(*), buyer:profiles!transactions_buyer_id_fkey(*), seller:profiles!transactions_seller_id_fkey(*)')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });

    const { data: salesData } = await supabase
      .from('transactions')
      .select('*, listing:listings(*), buyer:profiles!transactions_buyer_id_fkey(*), seller:profiles!transactions_seller_id_fkey(*)')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    setPurchases((purchasesData as any) || []);
    setSales((salesData as any) || []);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };

    const labels = {
      pending: 'En attente',
      processing: 'En cours',
      completed: 'Terminé',
      failed: 'Échoué',
      refunded: 'Remboursé',
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

        <div className="flex gap-2 mb-4">
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
        </div>
      </div>

      <div className="space-y-4">
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
                    {getStatusBadge(transaction.status)}
                  </div>
                  <div className="flex items-center gap-6 mb-2">
                    <div>
                      <span className="text-sm text-gray-600">Montant payé:</span>
                      <span className="ml-2 font-bold text-gray-800 text-lg">{Number(transaction.amount).toFixed(2)}€</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Commission:</span>
                      <span className="ml-2 font-semibold text-red-600">{Number(transaction.platform_fee).toFixed(2)}€</span>
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
                    {getStatusBadge(transaction.status)}
                  </div>
                  <div className="flex items-center gap-6 mb-2">
                    <div>
                      <span className="text-sm text-gray-600">Prix de vente:</span>
                      <span className="ml-2 font-semibold text-gray-800">{Number(transaction.amount).toFixed(2)}€</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Commission:</span>
                      <span className="ml-2 font-semibold text-red-600">-{Number(transaction.platform_fee).toFixed(2)}€</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Vous recevez:</span>
                      <span className="ml-2 font-bold text-emerald-600 text-lg">{Number(transaction.seller_amount).toFixed(2)}€</span>
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
                  {transaction.status === 'completed' && (
                    <p className="text-xs text-emerald-600 font-medium mt-1">
                      Paiement envoyé à votre compte bancaire
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
