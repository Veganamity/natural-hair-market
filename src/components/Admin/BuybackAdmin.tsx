import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { Scissors, CheckCircle, XCircle, Clock, Search, RefreshCw, Mail, Phone, Building2, User, Ruler, Palette, Euro, Image as ImageIcon, Calendar, MapPin, CreditCard, Banknote as BanknoteIcon, Package, ExternalLink, Truck } from 'lucide-react';

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
  status: 'pending' | 'accepted' | 'paid' | 'refused';
  address_line1: string | null;
  postal_code: string | null;
  city: string | null;
  iban: string | null;
  bank_holder_name: string | null;
  final_price: number | null;
  paid_at: string | null;
  payment_reference: string | null;
  shipping_label_url: string | null;
  shipping_tracking_number: string | null;
  label_generated_at: string | null;
  weight_grams: number | null;
  exact_price: number | null;
  strands_json: Array<{
    condition: string; colorType: string; length: string;
    weightGrams: string; rateStr: string; exactPrice: number | null;
  }> | null;
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
  pending:  { label: 'En attente',       bg: 'bg-amber-50',   border: 'border-amber-300',   text: 'text-amber-700',   dot: 'bg-amber-400' },
  accepted: { label: 'Accepte – A payer', bg: 'bg-blue-50',    border: 'border-blue-300',    text: 'text-blue-700',    dot: 'bg-blue-500' },
  paid:     { label: 'Paye',             bg: 'bg-emerald-50', border: 'border-emerald-300',  text: 'text-emerald-700', dot: 'bg-emerald-500' },
  refused:  { label: 'Refuse',           bg: 'bg-red-50',     border: 'border-red-300',     text: 'text-red-700',     dot: 'bg-red-500' },
};

const ADMIN_EMAIL = 'stephaniebuisson1115@gmail.com';

export default function BuybackAdmin() {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState<BuybackRequest[]>([]);
  const [filtered, setFiltered] = useState<BuybackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'paid' | 'refused'>('pending');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [paymentForms, setPaymentForms] = useState<Record<string, { price: string; ref: string }>>({});
  const [labelLoading, setLabelLoading] = useState<string | null>(null);

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    let query = db.from('hair_buyback_requests').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('status', filter);

    const { data, error } = await query;
    if (error) {
      showToast('error', 'Erreur lors du chargement des demandes.');
    } else {
      setRequests((data ?? []) as BuybackRequest[]);
      setFiltered((data ?? []) as BuybackRequest[]);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: 'accepted' | 'refused') => {
    setActionLoading(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('hair_buyback_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      showToast('error', 'Erreur lors de la mise a jour du statut.');
    } else {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      showToast('success', status === 'accepted'
        ? 'Demande acceptee. Renseignez le montant et marquez comme paye.'
        : 'Demande refusee.');
    }
    setActionLoading(null);
  };

  const markAsPaid = async (id: string) => {
    const pf = paymentForms[id] ?? {};
    const priceNum = pf.price ? parseFloat(pf.price.replace(',', '.')) : null;
    setActionLoading(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('hair_buyback_requests')
      .update({
        status: 'paid',
        final_price: priceNum,
        paid_at: new Date().toISOString(),
        payment_reference: pf.ref?.trim() || null,
      })
      .eq('id', id);

    if (error) {
      showToast('error', 'Erreur lors du marquage comme paye.');
    } else {
      setRequests(prev => prev.map(r => r.id === id ? {
        ...r,
        status: 'paid' as const,
        final_price: priceNum,
        paid_at: new Date().toISOString(),
        payment_reference: pf.ref?.trim() || null,
      } : r));
      showToast('success', 'Virement marque comme effectue.');
    }
    setActionLoading(null);
  };

  const generateLabel = async (id: string) => {
    setLabelLoading(id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-buyback-label`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ buybackId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur inconnue');
      setRequests(prev => prev.map(r => r.id === id ? {
        ...r,
        shipping_label_url: data.shipping_label_url,
        shipping_tracking_number: data.tracking_number,
        label_generated_at: new Date().toISOString(),
      } : r));
      showToast('success', 'Etiquette generee avec succes !');
      if (data.shipping_label_url) window.open(data.shipping_label_url, '_blank');
    } catch (err) {
      showToast('error', (err as Error).message || 'Erreur lors de la generation de l\'etiquette.');
    }
    setLabelLoading(null);
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
    paid: requests.filter(r => r.status === 'paid').length,
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
        {(['all', 'pending', 'accepted', 'paid', 'refused'] as const).map((f) => (
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
            {f === 'accepted' && `A payer (${counts.accepted})`}
            {f === 'paid' && `Payees (${counts.paid})`}
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
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        Caracteristiques{req.strands_json && req.strands_json.length > 0 ? ` (${req.strands_json.length} meches)` : ''}
                      </h3>
                      {req.strands_json && req.strands_json.length > 0 ? (
                        /* Multi-meches */
                        <div className="space-y-1.5">
                          {req.strands_json.map((s, i) => (
                            <div key={i} className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                              <div>
                                <p className="text-xs font-semibold text-gray-800">
                                  Meche {i + 1} – {CONDITION_LABELS[s.condition] || s.condition}
                                  {s.colorType ? ` – ${COLOR_LABELS[s.colorType] || s.colorType}` : ''}
                                </p>
                                <p className="text-xs text-gray-500">{s.length}{s.weightGrams ? ` · ${s.weightGrams}g` : ''}</p>
                              </div>
                              <p className="text-sm font-bold text-emerald-700 flex-shrink-0">
                                {s.exactPrice != null ? `${s.exactPrice.toFixed(2)} €` : s.rateStr}
                              </p>
                            </div>
                          ))}
                          {req.exact_price != null && (
                            <div className="flex items-center justify-between bg-emerald-600 rounded-lg px-3 py-1.5">
                              <p className="text-xs font-bold text-white">Total</p>
                              <p className="text-sm font-black text-white">{req.exact_price} €</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Meche unique */
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
                            <span className="text-sm text-gray-700">
                              {req.hair_length}
                              {req.weight_grams ? <span className="text-gray-500"> · {req.weight_grams}g</span> : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Euro className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span className="text-sm font-bold text-emerald-700">
                              {req.exact_price != null ? `${req.exact_price} €` : req.calculated_price}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Colonne 3 : Photo */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Photo</h3>
                      {req.photo_url ? (
                        <button onClick={() => setLightbox(req.photo_url!)} className="block w-full">
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

                  {/* Actions: En attente */}
                  {req.status === 'pending' && (
                    <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3">
                      <button
                        onClick={() => updateStatus(req.id, 'accepted')}
                        disabled={actionLoading === req.id}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                      >
                        {actionLoading === req.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Accepter le rachat
                      </button>
                      <button
                        onClick={() => updateStatus(req.id, 'refused')}
                        disabled={actionLoading === req.id}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                      >
                        {actionLoading === req.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Refuser
                      </button>
                    </div>
                  )}

                  {/* Actions: Accepte → Proceder au reglement */}
                  {req.status === 'accepted' && (
                    <div className="mt-5 pt-4 border-t border-gray-100 space-y-4">
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Proceder au reglement</p>

                      {/* Adresse d'expedition */}
                      {req.address_line1 ? (
                        <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-500" />
                            <p className="text-xs font-semibold text-gray-600">Adresse du vendeur (pour etiquette d'envoi)</p>
                          </div>
                          <p className="text-sm text-gray-800">{req.address_line1}</p>
                          <p className="text-sm text-gray-800">{req.postal_code} {req.city}</p>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`${req.address_line1}, ${req.postal_code} ${req.city}`);
                              showToast('success', 'Adresse copiee dans le presse-papier.');
                            }}
                            className="mt-1 text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            Copier l'adresse
                          </button>
                        </div>
                      ) : (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-700">
                          Adresse non renseignee — contacter le vendeur par email ou telephone.
                        </div>
                      )}

                      {/* Coordonnees bancaires */}
                      {req.iban ? (
                        <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                            <p className="text-xs font-semibold text-gray-600">Coordonnees bancaires</p>
                          </div>
                          <p className="text-sm text-gray-800 font-medium">{req.bank_holder_name}</p>
                          <p className="text-sm font-mono text-gray-700 break-all">{req.iban}</p>
                          <button
                            type="button"
                            onClick={() => { navigator.clipboard.writeText(req.iban!); showToast('success', 'IBAN copie.'); }}
                            className="mt-1 text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            Copier l'IBAN
                          </button>
                        </div>
                      ) : (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-700">
                          IBAN non renseigne — demander au vendeur ses coordonnees bancaires.
                        </div>
                      )}

                      {/* Montant final + reference */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Montant verse (€)</label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder={req.calculated_price.replace(' €', '')}
                            value={paymentForms[req.id]?.price ?? ''}
                            onChange={(e) => setPaymentForms(pf => ({ ...pf, [req.id]: { ...pf[req.id], price: e.target.value } }))}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-emerald-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Reference virement</label>
                          <input
                            type="text"
                            placeholder="REF-XXXX"
                            value={paymentForms[req.id]?.ref ?? ''}
                            onChange={(e) => setPaymentForms(pf => ({ ...pf, [req.id]: { ...pf[req.id], ref: e.target.value } }))}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-emerald-500 outline-none"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => markAsPaid(req.id)}
                        disabled={actionLoading === req.id}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                      >
                        {actionLoading === req.id
                          ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : <BanknoteIcon className="w-4 h-4" />}
                        Marquer le virement comme effectue
                      </button>

                      {/* Etiquette d'expedition */}
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5" />
                          Etiquette d'expedition (vendeur → NaturalHairMarket)
                        </p>
                        {req.shipping_label_url ? (
                          <div className="space-y-2">
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold text-emerald-700">Etiquette generee</p>
                                {req.shipping_tracking_number && (
                                  <p className="text-xs text-gray-500 font-mono mt-0.5">Suivi : {req.shipping_tracking_number}</p>
                                )}
                              </div>
                              <a
                                href={req.shipping_label_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Ouvrir PDF
                              </a>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => generateLabel(req.id)}
                            disabled={labelLoading === req.id}
                            className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                          >
                            {labelLoading === req.id
                              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              : <Package className="w-4 h-4" />}
                            Generer l'etiquette Sendcloud
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Statut: Paye */}
                  {req.status === 'paid' && (
                    <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <p className="text-sm font-semibold text-emerald-700">Virement effectue</p>
                      </div>
                      {req.final_price != null && (
                        <p className="text-xs text-gray-600">Montant verse : <span className="font-bold text-gray-800">{req.final_price} €</span></p>
                      )}
                      {req.paid_at && (
                        <p className="text-xs text-gray-500">Le {formatDate(req.paid_at)}</p>
                      )}
                      {req.payment_reference && (
                        <p className="text-xs text-gray-500 font-mono">Ref : {req.payment_reference}</p>
                      )}
                      {req.iban && (
                        <p className="text-xs text-gray-500 font-mono break-all">IBAN : {req.iban}</p>
                      )}
                      {req.shipping_label_url && (
                        <div className="flex items-center gap-2 pt-1">
                          <Truck className="w-3.5 h-3.5 text-gray-400" />
                          <a
                            href={req.shipping_label_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Etiquette expedition
                          </a>
                          {req.shipping_tracking_number && (
                            <span className="text-xs text-gray-500 font-mono">— {req.shipping_tracking_number}</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Statut: Refuse */}
                  {req.status === 'refused' && (
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <p className="text-sm font-semibold text-center text-red-600">Demande refusee.</p>
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
