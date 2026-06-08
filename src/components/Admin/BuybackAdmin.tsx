import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import {
  Scissors, CheckCircle, XCircle, Clock, Search, RefreshCw,
  Mail, Phone, Building2, User, Ruler, Palette, Euro, Image as ImageIcon, Calendar,
} from 'lucide-react';

interface BuybackRequest {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  salon_name: string | null;
  photo_url: string | null;
  hair_condition: 'natural' | 'colored';
  hair_color: 'chestnut' | 'blond_roux_gris' | null;
  hair_length: string;
  calculated_price: string;
  status: 'pending' | 'accepted' | 'refused';
}

const CONDITION_LABELS: Record<string, string> = {
  natural: 'Naturels (Vierges)',
  colored: 'Colores / Meches',
};

const COLOR_LABELS: Record<string, string> = {
  chestnut: 'Chatain / Brun',
  blond_roux_gris: 'Blond / Roux / Gris',
};

const STATUS_CONFIG = {
  pending:  { label: 'En attente',  bg: 'bg-amber-50',   border: 'border-amber-300',  text: 'text-amber-700',  dot: 'bg-amber-400' },
  accepted: { label: 'Accepte',     bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  refused:  { label: 'Refuse',      bg: 'bg-red-50',     border: 'border-red-300',    text: 'text-red-700',    dot: 'bg-red-500' },
};

const ADMIN_EMAIL = 'stephaniebuisson1115@gmail.com';

export default function BuybackAdmin() {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState<BuybackRequest[]>([]);
  const [filtered, setFiltered] = useState<BuybackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'refused'>('pending');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const isAdmin = profile?.email === ADMIN_EMAIL || user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (isAdmin) loadRequests();
  }, [isAdmin, filter]);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) { setFiltered(requests); return; }
    setFiltered(requests.filter(r =>
      `${r.first_name} ${r.last_name} ${r.email} ${r.phone} ${r.salon_name ?? ''}`.toLowerCase().includes(q)
    ));
  }, [search, requests]);

  const loadRequests = async () => {
    setLoading(true);
    const query = supabase
      .from('hair_buyback_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') query.eq('status', filter);

    const { data, error } = await query;
    if (error) {
      showToast('error', 'Erreur lors du chargement des demandes.');
    } else {
      setRequests(data ?? []);
      setFiltered(data ?? []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: 'accepted' | 'refused') => {
    setActionLoading(id);
    const { error } = await supabase
      .from('hair_buyback_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      showToast('error', 'Erreur lors de la mise a jour du statut.');
    } else {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      showToast('success', status === 'accepted' ? 'Demande acceptee avec succes.' : 'Demande refusee.');
    }
    setActionLoading(null);
  };

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (!isAdmin) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-sm">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-800 mb-1">Acces refuse</h2>
          <p className="text-gray-500 text-sm">Cette interface est reservee aux administrateurs NaturalHairMarket.</p>
        </div>
      </div>
    );
  }

  const counts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
    refused: requests.filter(r => r.status === 'refused').length,
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {toast.text}
        </div>
      )}

      {/* Lightbox photo */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="Photo cheveux" className="max-w-2xl max-h-[85vh] rounded-2xl object-contain" />
          <button className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2" onClick={() => setLightbox(null)}>
            <XCircle className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Scissors className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Rachats de cheveux</h2>
            <p className="text-gray-500 text-xs">{requests.length} demande{requests.length !== 1 ? 's' : ''} au total</p>
          </div>
        </div>
        <button
          onClick={loadRequests}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'accepted', 'refused'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              filter === f
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
            }`}
          >
            {f === 'all' && `Toutes (${counts.all})`}
            {f === 'pending' && `En attente (${counts.pending})`}
            {f === 'accepted' && `Acceptees (${counts.accepted})`}
            {f === 'refused' && `Refusees (${counts.refused})`}
          </button>
        ))}
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher par nom, email ou telephone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none bg-white"
        />
      </div>

      {/* Liste des demandes */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucune demande trouvee</p>
          <p className="text-gray-400 text-sm mt-1">Les nouvelles soumissions apparaissent ici automatiquement.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => {
            const sc = STATUS_CONFIG[req.status];
            return (
              <div key={req.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${sc.border}`}>
                {/* Header carte */}
                <div className={`px-5 py-3 ${sc.bg} flex items-center justify-between gap-3 flex-wrap`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${sc.dot}`} />
                    <span className={`text-xs font-bold uppercase tracking-wide ${sc.text}`}>{sc.label}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(req.created_at)}
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid md:grid-cols-3 gap-5">
                    {/* Colonne 1 : Infos vendeur */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Vendeur</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{req.first_name} {req.last_name}</p>
                          {req.salon_name && <p className="text-xs text-gray-500">{req.salon_name}</p>}
                        </div>
                      </div>
                      <a href={`mailto:${req.email}`} className="flex items-center gap-2 text-sm text-emerald-700 hover:underline">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{req.email}</span>
                      </a>
                      <a href={`tel:${req.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                        {req.phone}
                      </a>
                      {req.salon_name && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                          {req.salon_name}
                        </div>
                      )}
                    </div>

                    {/* Colonne 2 : Caracteristiques */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Caracteristiques</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            <span className="font-medium">{CONDITION_LABELS[req.hair_condition]}</span>
                            {req.hair_color && <span className="text-gray-500"> — {COLOR_LABELS[req.hair_color]}</span>}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Ruler className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Longueur : <span className="font-medium">{req.hair_length}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Euro className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Prix calcule : <span className="font-bold text-emerald-700">{req.calculated_price}</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Colonne 3 : Photo + actions */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Photo</h3>
                      {req.photo_url ? (
                        <button
                          onClick={() => setLightbox(req.photo_url!)}
                          className="block w-full"
                        >
                          <img
                            src={req.photo_url}
                            alt="Cheveux"
                            className="w-full h-28 object-cover rounded-xl border border-gray-100 hover:opacity-90 transition-opacity cursor-zoom-in"
                          />
                          <p className="text-xs text-gray-400 mt-1 text-center">Cliquer pour agrandir</p>
                        </button>
                      ) : (
                        <div className="w-full h-28 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-1">
                          <ImageIcon className="w-6 h-6 text-gray-300" />
                          <p className="text-xs text-gray-400">Pas de photo</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {req.status === 'pending' && (
                    <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3">
                      <button
                        onClick={() => updateStatus(req.id, 'accepted')}
                        disabled={actionLoading === req.id}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                      >
                        {actionLoading === req.id ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Accepter le rachat
                      </button>
                      <button
                        onClick={() => updateStatus(req.id, 'refused')}
                        disabled={actionLoading === req.id}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                      >
                        {actionLoading === req.id ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Refuser
                      </button>
                    </div>
                  )}

                  {req.status !== 'pending' && (
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <p className={`text-sm font-semibold text-center ${sc.text}`}>
                        {req.status === 'accepted' ? 'Demande acceptee — le vendeur a ete contacte.' : 'Demande refusee.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
