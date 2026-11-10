import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { Tag, AlertCircle, Search, RefreshCw, Phone, Mail, MessageSquare } from 'lucide-react';
import { Database } from '../../lib/database.types';

type OfferRow = Database['public']['Tables']['offers']['Row'];

interface BuyerProfile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
}

interface OfferAdminItem extends OfferRow {
  listing: {
    id: string;
    title: string | null;
    price: string | null;
    profiles: {
      full_name: string | null;
      email: string;
      phone: string | null;
    } | null;
  } | null;
  buyer: BuyerProfile | null;
}

export default function OfferAdmin() {
  const { profile } = useAuth();
  const [offers, setOffers] = useState<OfferAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'withdrawn'>('all');

  const isAdmin = profile?.email === 'stephaniebuisson1115@gmail.com';

  useEffect(() => {
    if (isAdmin) loadOffers();
  }, [isAdmin, statusFilter]);

  const loadOffers = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('offers')
        .select('*, listing:listings(title, price, profiles:seller_id(full_name, email, phone))')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data: offerData, error: offerError } = await query;
      if (offerError) throw offerError;

      const buyerIds = [...new Set((offerData || []).map((o: any) => o.buyer_id).filter(Boolean))];
      const { data: buyerData, error: buyerError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .in('id', buyerIds);

      if (buyerError) throw buyerError;

      const buyerMap = new Map<string, BuyerProfile>();
      (buyerData || []).forEach((b: any) => buyerMap.set(b.id, b as BuyerProfile));

      const enriched: OfferAdminItem[] = (offerData || []).map((o: any) => ({
        ...o,
        buyer: buyerMap.get(o.buyer_id) || null,
      }));

      setOffers(enriched);
    } catch (error: any) {
      console.error('Error loading offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers.filter((offer) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      offer.listing?.title?.toLowerCase().includes(q) ||
      offer.buyer?.full_name?.toLowerCase().includes(q) ||
      offer.buyer?.email?.toLowerCase().includes(q) ||
      offer.listing?.profiles?.full_name?.toLowerCase().includes(q) ||
      offer.listing?.profiles?.email?.toLowerCase().includes(q) ||
      offer.message?.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', label: 'Acceptée' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Refusée' },
      withdrawn: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Retirée' },
    };
    const c = config[status] || config.pending;
    return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
  };

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Tag className="w-8 h-8 text-emerald-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des offres</h1>
              <p className="text-sm text-gray-600">Toutes les offres faites par les acheteurs aux vendeurs</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Total: <span className="font-bold">{filteredOffers.length}</span> offre(s)
            </div>
            <button
              onClick={loadOffers}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              title="Actualiser"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par annonce, acheteur, vendeur, message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'accepted', 'rejected', 'withdrawn'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === s ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s === 'all' ? 'Toutes' : s === 'pending' ? 'En attente' : s === 'accepted' ? 'Acceptées' : s === 'rejected' ? 'Refusées' : 'Retirées'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Aucune offre trouvée.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annonce</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acheteur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendeur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOffers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900 line-clamp-1">{offer.listing?.title || 'Annonce supprimée'}</p>
                      <p className="text-sm text-gray-500">Prix: {offer.listing?.price ?? '—'}€</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">{offer.buyer?.full_name || 'N/A'}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {offer.buyer?.email || '—'}
                      </div>
                      {offer.buyer?.phone && (
                        <a href={`tel:${offer.buyer.phone}`} className="flex items-center gap-1 text-xs text-emerald-700 font-medium mt-0.5 hover:underline">
                          <Phone className="w-3 h-3" />
                          {offer.buyer.phone}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">{offer.listing?.profiles?.full_name || 'N/A'}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {offer.listing?.profiles?.email || '—'}
                      </div>
                      {offer.listing?.profiles?.phone && (
                        <a href={`tel:${offer.listing.profiles.phone}`} className="flex items-center gap-1 text-xs text-emerald-700 font-medium mt-0.5 hover:underline">
                          <Phone className="w-3 h-3" />
                          {offer.listing.profiles.phone}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-emerald-600 text-lg">{Number(offer.amount).toFixed(2)}€</span>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      {offer.message ? (
                        <div className="flex items-start gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-600 italic line-clamp-2">{offer.message}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(offer.status)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(offer.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
