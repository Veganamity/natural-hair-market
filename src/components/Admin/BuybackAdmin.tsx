import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import {
  Scissors, CheckCircle, XCircle, Clock, Search, RefreshCw,
  Mail, Phone, Building2, User, Ruler, Palette, Euro,
  Image as ImageIcon, Calendar, MapPin, CreditCard,
  Banknote as BanknoteIcon, Download, Send, AlertTriangle, ExternalLink,
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
  status: 'pending' | 'accepted' | 'paid' | 'refused' | 'cancelled';
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
  label_sent_at: string | null;
  weight_grams: number | null;
  exact_price: number | null;
  cancellation_reason: string | null;
  cancelled_at: string | null;
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
  pending:   { label: 'En attente',        bg: 'bg-amber-50',   border: 'border-amber-300',   text: 'text-amber-700',   dot: 'bg-amber-400' },
  accepted:  { label: 'Accepte – A payer', bg: 'bg-blue-50',    border: 'border-blue-300',    text: 'text-blue-700',    dot: 'bg-blue-500' },
  paid:      { label: 'Paye',              bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  refused:   { label: 'Refuse',            bg: 'bg-red-50',     border: 'border-red-300',     text: 'text-red-700',     dot: 'bg-red-500' },
  cancelled: { label: 'Annule',            bg: 'bg-gray-50',    border: 'border-gray-300',    text: 'text-gray-600',    dot: 'bg-gray-400' },
};

const ADMIN_EMAIL = 'stephaniebuisson1115@gmail.com';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

export default function BuybackAdmin() {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState<BuybackRequest[]>([]);
  const [filtered, setFiltered] = useState<BuybackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'paid' | 'refused' | 'cancelled'>('pending');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [paymentForms, setPaymentForms] = useState<Record<string, { price: string; ref: string }>>({});
  const [labelForms, setLabelForms] = useState<Record<string, { url: string; tracking: string }>>({});
  const [cancelForms, setCancelForms] = useState<Record<string, string>>({});
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);

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

  const getAccessToken = async (): Promise<string | null> => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  const sendEmail = async (requestId: string, emailType: 'accepted' | 'label_sent' | 'cancelled') => {
    const token = await getAccessToken();
    if (!token) return;
    await fetch(`${SUPABASE_URL}/functions/v1/send-buyback-email`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ request_id: requestId, email_type: emailType }),
    });
  };

  const acceptRequest = async (id: string) => {
    setActionLoading(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('hair_buyback_requests')
      .update({ status: 'accepted' })
      .eq('id', id);
    if (error) {
      showToast('error', 'Erreur lors de la mise a jour du statut.');
    } else {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' as const } : r));
      await sendEmail(id, 'accepted');
      showToast('success', 'Demande acceptee — email envoye au vendeur.');
    }
    setActionLoading(null);
  };

  const refuseRequest = async (id: string) => {
    setActionLoading(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('hair_buyback_requests')
      .update({ status: 'refused' })
      .eq('id', id);
    if (error) {
      showToast('error', 'Erreur lors de la mise a jour du statut.');
    } else {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'refused' as const } : r));
      showToast('success', 'Demande refusee.');
    }
    setActionLoading(null);
  };

  const cancelAccepted = async (id: string) => {
    const reason = cancelForms[id]?.trim() ?? '';
    setActionLoading(id);
    const now = new Date().toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('hair_buyback_requests')
      .update({ status: 'cancelled', cancellation_reason: reason || null, cancelled_at: now })
      .eq('id', id);
    if (error) {
      showToast('error', 'Erreur lors de l\'annulation.');
    } else {
      setRequests(prev => prev.map(r => r.id === id
        ? { ...r, status: 'cancelled' as const, cancellation_reason: reason || null, cancelled_at: now }
        : r));
      await sendEmail(id, 'cancelled');
      setCancelConfirm(null);
      showToast('success', 'Acceptation annulee — email envoye au vendeur.');
    }
    setActionLoading(null);
  };

  const saveLabelAndSend = async (id: string, sendMail: boolean) => {
    const lf = labelForms[id] ?? { url: '', tracking: '' };
    const url = lf.url.trim();
    if (!url) { showToast('error', 'Veuillez saisir l\'URL de l\'etiquette.'); return; }
    setActionLoading(id + '-label');
    const now = new Date().toISOString();
    const updates: Record<string, unknown> = {
      shipping_label_url: url,
      shipping_tracking_number: lf.tracking.trim() || null,
      label_generated_at: now,
    };
    if (sendMail) updates.label_sent_at = now;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('hair_buyback_requests')
      .update(updates)
      .eq('id', id);
    if (error) {
      showToast('error', 'Erreur lors de la sauvegarde de l\'etiquette.');
    } else {
      setRequests(prev => prev.map(r => r.id === id ? {
        ...r,
        shipping_label_url: url,
        shipping_tracking_number: lf.tracking.trim() || null,
        label_generated_at: now,
        label_sent_at: sendMail ? now : r.label_sent_at,
      } : r));
      if (sendMail) await sendEmail(id, 'label_sent');
      showToast('success', sendMail ? 'Etiquette sauvegardee et email envoye.' : 'Etiquette sauvegardee.');
    }
    setActionLoading(null);
  };

  const resendLabel = async (id: string) => {
    setActionLoading(id + '-resend');
    const now = new Date().toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('hair_buyback_requests').update({ label_sent_at: now }).eq('id', id);
    await sendEmail(id, 'label_sent');
    setRequests(prev => prev.map(r => r.id === id ? { ...r, label_sent_at: now } : r));
    showToast('success', 'Email etiquette renvoye.');
    setActionLoading(null);
  };

  const markAsPaid = async (id: string) => {
    const pf = paymentForms[id] ?? {};
    const priceNum = pf.price ? parseFloat(pf.price.replace(',', '.')) : null;
    setActionLoading(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('hair_buyback_requests')
      .update({ status: 'paid', final_price: priceNum, paid_at: new Date().toISOString(), payment_reference: pf.ref?.trim() || null })
      .eq('id', id);
    if (error) {
      showToast('error', 'Erreur lors du marquage comme paye.');
    } else {
      setRequests(prev => prev.map(r => r.id === id ? {
        ...r, status: 'paid' as const, final_price: priceNum,
        paid_at: new Date().toISOString(), payment_reference: pf.ref?.trim() || null,
      } : r));
      showToast('success', 'Virement marque comme effectue.');
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
    paid: requests.filter(r => r.status === 'paid').length,
    refused: requests.filter(r => r.status === 'refused').length,
    cancelled: requests.filter(r => r.status === 'cancelled').length,
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
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
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
        {(['all', 'pending', 'accepted', 'paid', 'refused', 'cancelled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              filter === f ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
            }`}
          >
            {f === 'all' && `Toutes (${counts.all})`}
            {f === 'pending' && `En attente (${counts.pending})`}
            {f === 'accepted' && `A payer (${counts.accepted})`}
            {f === 'paid' && `Payees (${counts.paid})`}
            {f === 'refused' && `Refusees (${counts.refused})`}
            {f === 'cancelled' && `Annulees (${counts.cancelled})`}
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

      {/* Liste */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucune demande trouvee</p>
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
                    {/* Colonne 1 : Vendeur */}
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
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{req.email}</span>
                      </a>
                      <a href={`tel:${req.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />{req.phone}
                      </a>
                      {req.salon_name && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Building2 className="w-3.5 h-3.5 flex-shrink-0" />{req.salon_name}
                        </div>
                      )}
                    </div>

                    {/* Colonne 2 : Caracteristiques */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        Caracteristiques{req.strands_json && req.strands_json.length > 0 ? ` (${req.strands_json.length} meches)` : ''}
                      </h3>
                      {req.strands_json && req.strands_json.length > 0 ? (
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
                        onClick={() => acceptRequest(req.id)}
                        disabled={actionLoading === req.id}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                      >
                        {actionLoading === req.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Accepter le rachat
                      </button>
                      <button
                        onClick={() => refuseRequest(req.id)}
                        disabled={actionLoading === req.id}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                      >
                        {actionLoading === req.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Refuser
                      </button>
                    </div>
                  )}

                  {/* Actions: Accepte */}
                  {req.status === 'accepted' && (
                    <div className="mt-5 pt-4 border-t border-gray-100 space-y-5">

                      {/* Etiquette d'expedition */}
                      <div>
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3">Etiquette d'expedition</p>
                        {req.shipping_label_url ? (
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-2">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                <span className="text-xs font-semibold text-blue-800">Etiquette enregistree</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <a
                                  href={req.shipping_label_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-semibold"
                                >
                                  <Download className="w-3.5 h-3.5" />Telecharger
                                </a>
                                <a
                                  href={req.shipping_label_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                                >
                                  <ExternalLink className="w-3 h-3" />Ouvrir
                                </a>
                              </div>
                            </div>
                            {req.shipping_tracking_number && (
                              <p className="text-xs text-gray-600">Suivi : <span className="font-mono font-semibold">{req.shipping_tracking_number}</span></p>
                            )}
                            {req.label_sent_at && (
                              <p className="text-xs text-gray-500">Dernier envoi email : {formatDate(req.label_sent_at)}</p>
                            )}
                            <button
                              onClick={() => resendLabel(req.id)}
                              disabled={actionLoading === req.id + '-resend'}
                              className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
                            >
                              {actionLoading === req.id + '-resend'
                                ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : <Send className="w-3 h-3" />}
                              Renvoyer l'email etiquette
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-2">
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">URL de l'etiquette *</label>
                                <input
                                  type="url"
                                  placeholder="https://..."
                                  value={labelForms[req.id]?.url ?? ''}
                                  onChange={(e) => setLabelForms(lf => ({ ...lf, [req.id]: { ...lf[req.id], url: e.target.value } }))}
                                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Numero de suivi (optionnel)</label>
                                <input
                                  type="text"
                                  placeholder="1A2B3C4D..."
                                  value={labelForms[req.id]?.tracking ?? ''}
                                  onChange={(e) => setLabelForms(lf => ({ ...lf, [req.id]: { ...lf[req.id], tracking: e.target.value } }))}
                                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveLabelAndSend(req.id, false)}
                                disabled={actionLoading === req.id + '-label'}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 font-semibold py-2 rounded-xl transition-colors text-sm"
                              >
                                {actionLoading === req.id + '-label' ? <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
                                Enregistrer seulement
                              </button>
                              <button
                                onClick={() => saveLabelAndSend(req.id, true)}
                                disabled={actionLoading === req.id + '-label'}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 rounded-xl transition-colors text-sm"
                              >
                                {actionLoading === req.id + '-label' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                                Enregistrer et envoyer
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Adresse et IBAN */}
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Reglement</p>
                        {req.address_line1 ? (
                          <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <MapPin className="w-3.5 h-3.5 text-gray-500" />
                              <p className="text-xs font-semibold text-gray-600">Adresse du vendeur</p>
                            </div>
                            <p className="text-sm text-gray-800">{req.address_line1}</p>
                            <p className="text-sm text-gray-800">{req.postal_code} {req.city}</p>
                            <button
                              onClick={() => { navigator.clipboard.writeText(`${req.address_line1}, ${req.postal_code} ${req.city}`); showToast('success', 'Adresse copiee.'); }}
                              className="mt-1 text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              Copier l'adresse
                            </button>
                          </div>
                        ) : (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-700">
                            Adresse non renseignee — contacter le vendeur.
                          </div>
                        )}
                        {req.iban ? (
                          <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                              <p className="text-xs font-semibold text-gray-600">Coordonnees bancaires</p>
                            </div>
                            <p className="text-sm text-gray-800 font-medium">{req.bank_holder_name}</p>
                            <p className="text-sm font-mono text-gray-700 break-all">{req.iban}</p>
                            <button
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
                          {actionLoading === req.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <BanknoteIcon className="w-4 h-4" />}
                          Marquer le virement comme effectue
                        </button>
                      </div>

                      {/* Annuler l'acceptation */}
                      <div className="border-t border-gray-100 pt-4">
                        {cancelConfirm === req.id ? (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
                            <p className="text-sm font-semibold text-red-700">Confirmer l'annulation de l'acceptation</p>
                            <p className="text-xs text-red-600">Le vendeur sera notifie par email. Cette action ne peut pas etre annulee.</p>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">Motif de l'annulation (optionnel)</label>
                              <textarea
                                rows={2}
                                placeholder="Ex : qualite insuffisante des cheveux recus..."
                                value={cancelForms[req.id] ?? ''}
                                onChange={(e) => setCancelForms(cf => ({ ...cf, [req.id]: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-red-400 outline-none resize-none"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setCancelConfirm(null)}
                                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={() => cancelAccepted(req.id)}
                                disabled={actionLoading === req.id}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-2 rounded-xl transition-colors text-sm"
                              >
                                {actionLoading === req.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <XCircle className="w-4 h-4" />}
                                Confirmer l'annulation
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setCancelConfirm(req.id)}
                            className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Annuler l'acceptation (erreur)
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
                      {req.paid_at && <p className="text-xs text-gray-500">Le {formatDate(req.paid_at)}</p>}
                      {req.payment_reference && <p className="text-xs text-gray-500 font-mono">Ref : {req.payment_reference}</p>}
                      {req.iban && <p className="text-xs text-gray-500 font-mono break-all">IBAN : {req.iban}</p>}
                      {req.shipping_label_url && (
                        <a
                          href={req.shipping_label_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-900 font-semibold"
                        >
                          <Download className="w-3.5 h-3.5" />Etiquette d'expedition
                        </a>
                      )}
                    </div>
                  )}

                  {/* Statut: Refuse */}
                  {req.status === 'refused' && (
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <p className="text-sm font-semibold text-center text-red-600">Demande refusee.</p>
                    </div>
                  )}

                  {/* Statut: Annule */}
                  {req.status === 'cancelled' && (
                    <div className="mt-5 pt-4 border-t border-gray-100 space-y-1">
                      <p className="text-sm font-semibold text-gray-600">Acceptation annulee.</p>
                      {req.cancellation_reason && (
                        <p className="text-xs text-gray-500">Motif : <span className="italic">{req.cancellation_reason}</span></p>
                      )}
                      {req.cancelled_at && <p className="text-xs text-gray-400">Le {formatDate(req.cancelled_at)}</p>}
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
