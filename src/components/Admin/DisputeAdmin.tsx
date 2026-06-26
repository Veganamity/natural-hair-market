import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { AlertOctagon, CheckCircle, RotateCcw, Clock, User, Package, AlertCircle } from 'lucide-react';

interface DisputedTransaction {
  id: string;
  created_at: string;
  amount: number;
  seller_amount: number;
  status: string;
  delivery_status: string;
  dispute_opened_at: string | null;
  dispute_reason: string | null;
  dispute_resolved_at: string | null;
  dispute_resolution: string | null;
  stripe_payment_intent_id: string | null;
  buyer_id: string;
  seller_id: string;
  listing: { title: string } | null;
  buyer_profile: { full_name: string | null; email: string } | null;
  seller_profile: { full_name: string | null; email: string } | null;
}

export default function DisputeAdmin() {
  const { profile } = useAuth();
  const [disputes, setDisputes] = useState<DisputedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filter, setFilter] = useState<'open' | 'resolved'>('open');

  const isAdmin = profile?.email === 'stephaniebuisson1115@gmail.com';

  useEffect(() => {
    if (isAdmin) loadDisputes();
  }, [isAdmin, filter]);

  const loadDisputes = async () => {
    setLoading(true);
    setMessage(null);

    let query = supabase
      .from('transactions')
      .select(`
        id, created_at, amount, seller_amount, status, delivery_status,
        dispute_opened_at, dispute_reason, dispute_resolved_at, dispute_resolution,
        stripe_payment_intent_id, buyer_id, seller_id,
        listing:listings(title)
      `)
      .order('dispute_opened_at', { ascending: false });

    if (filter === 'open') {
      query = query.eq('status', 'disputed');
    } else {
      query = query.not('dispute_resolved_at', 'is', null);
    }

    const { data, error } = await query;
    if (error) {
      setMessage({ type: 'error', text: `Erreur: ${error.message}` });
      setLoading(false);
      return;
    }

    const rows = (data || []) as any[];

    const allUserIds = [...new Set([
      ...rows.map((r: any) => r.buyer_id),
      ...rows.map((r: any) => r.seller_id),
    ].filter(Boolean))];

    let profileMap: Record<string, { full_name: string | null; email: string }> = {};
    if (allUserIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', allUserIds);
      for (const p of profilesData || []) {
        profileMap[p.id] = { full_name: p.full_name, email: p.email };
      }
    }

    const enriched = rows.map((r: any) => ({
      ...r,
      buyer_profile: profileMap[r.buyer_id] || null,
      seller_profile: profileMap[r.seller_id] || null,
    }));

    setDisputes(enriched as DisputedTransaction[]);
    setLoading(false);
  };

  const resolveDispute = async (transactionId: string, resolution: 'refund_buyer' | 'pay_seller') => {
    const label = resolution === 'refund_buyer' ? "rembourser l'acheteur" : 'payer le vendeur';
    if (!confirm(`Confirmer la résolution : ${label} ?`)) return;

    setProcessingId(transactionId);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resolve-dispute`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transactionId, resolution }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to resolve dispute');

      setMessage({
        type: 'success',
        text: resolution === 'refund_buyer'
          ? 'Litige résolu : acheteur remboursé, annonce remise en vente.'
          : 'Litige résolu : paiement capturé et transféré au vendeur.',
      });
      loadDisputes();
    } catch (error: any) {
      setMessage({ type: 'error', text: `Erreur: ${error.message}` });
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-8 h-8 text-amber-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des litiges</h1>
              <p className="text-sm text-gray-500">Résolvez les litiges entre acheteurs et vendeurs</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('open')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'open' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              En cours
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'resolved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Résolus
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-5 p-4 rounded-lg border text-sm font-medium ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mb-3" />
            <p className="text-gray-500">Chargement...</p>
          </div>
        ) : disputes.length === 0 ? (
          <div className="text-center py-16">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">
              {filter === 'open' ? 'Aucun litige en cours.' : 'Aucun litige résolu.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {disputes.map((tx) => (
              <div key={tx.id} className="border border-gray-200 rounded-xl p-5 hover:border-amber-200 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <h3 className="font-semibold text-gray-900 truncate">
                        {(tx.listing as any)?.title || 'Annonce supprimée'}
                      </h3>
                      <span className="text-xs font-mono text-gray-400 flex-shrink-0">#{tx.id.substring(0, 8)}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-sm">
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Acheteur</p>
                          <p className="text-gray-800 font-semibold">{tx.buyer_profile?.full_name || '—'}</p>
                          <p className="text-gray-500 text-xs">{tx.buyer_profile?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Vendeur</p>
                          <p className="text-gray-800 font-semibold">{tx.seller_profile?.full_name || '—'}</p>
                          <p className="text-gray-500 text-xs">{tx.seller_profile?.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Montant acheteur</p>
                        <p className="font-bold text-gray-800">{Number(tx.amount).toFixed(2)}€</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Montant vendeur</p>
                        <p className="font-bold text-emerald-600">{Number(tx.seller_amount).toFixed(2)}€</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Litige ouvert le</p>
                        <p className="font-medium text-amber-700 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(tx.dispute_opened_at)}
                        </p>
                      </div>
                    </div>

                    {tx.dispute_reason && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                        <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">Motif signalé par l'acheteur</p>
                        <p className="text-sm text-amber-900 italic">"{tx.dispute_reason}"</p>
                      </div>
                    )}

                    {tx.dispute_resolution && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Résolution</p>
                        <p className="text-sm text-green-800 font-medium">
                          {tx.dispute_resolution === 'refund_buyer' ? 'Acheteur remboursé' : 'Vendeur payé'}
                          {' — '}{formatDate(tx.dispute_resolved_at)}
                        </p>
                      </div>
                    )}
                  </div>

                  {filter === 'open' && (
                    <div className="flex flex-col gap-2 min-w-[180px]">
                      <button
                        onClick={() => resolveDispute(tx.id, 'refund_buyer')}
                        disabled={processingId === tx.id}
                        className="px-4 py-2.5 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                        {processingId === tx.id ? 'En cours...' : "Rembourser l'acheteur"}
                      </button>
                      <button
                        onClick={() => resolveDispute(tx.id, 'pay_seller')}
                        disabled={processingId === tx.id}
                        className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {processingId === tx.id ? 'En cours...' : 'Payer le vendeur'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
