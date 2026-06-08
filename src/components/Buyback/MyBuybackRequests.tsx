import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import {
  Scissors, Clock, CheckCircle, XCircle, Banknote,
  Calendar, ChevronLeft, Palette, Ruler,
} from 'lucide-react';

interface BuybackRequest {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  hair_condition: string;
  hair_color: string | null;
  hair_length: string;
  calculated_price: string;
  status: 'pending' | 'accepted' | 'paid' | 'refused';
  final_price: number | null;
  paid_at: string | null;
  shipping_label_url: string | null;
  shipping_tracking_number: string | null;
  strands_json: Array<{
    condition: string; colorType: string; length: string;
    weightGrams: string; rateStr: string; exactPrice: number | null;
  }> | null;
  exact_price: number | null;
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
  pending:  { label: 'En attente d\'examen',    bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   dot: 'bg-amber-400',   icon: Clock },
  accepted: { label: 'Accepte – Virement en cours', bg: 'bg-blue-50', border: 'border-blue-200',   text: 'text-blue-700',    dot: 'bg-blue-500',    icon: CheckCircle },
  paid:     { label: 'Paye',                    bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500', icon: Banknote },
  refused:  { label: 'Non retenu',              bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-600',     dot: 'bg-red-400',     icon: XCircle },
};

interface Props {
  onBack?: () => void;
}

export default function MyBuybackRequests({ onBack }: Props) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BuybackRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadRequests();
  }, [user]);

  const loadRequests = async () => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('hair_buyback_requests')
      .select('id, created_at, first_name, last_name, hair_condition, hair_color, hair_length, calculated_price, status, final_price, paid_at, shipping_label_url, shipping_tracking_number, strands_json, exact_price')
      .order('created_at', { ascending: false });
    setRequests((data ?? []) as BuybackRequest[]);
    setLoading(false);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Scissors className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Mes demandes de rachat</h2>
          <p className="text-gray-500 text-xs">{requests.length} demande{requests.length !== 1 ? 's' : ''} soumise{requests.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Scissors className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-semibold">Aucune demande de rachat</p>
          <p className="text-gray-400 text-sm mt-1">
            Vous n'avez pas encore soumis de demande. Rendez-vous sur "Vendre mes cheveux" pour commencer.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const sc = STATUS_CONFIG[req.status];
            const StatusIcon = sc.icon;
            return (
              <div key={req.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${sc.border}`}>
                {/* Status bar */}
                <div className={`px-5 py-3 ${sc.bg} flex items-center justify-between gap-3 flex-wrap`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${sc.dot}`} />
                    <StatusIcon className={`w-4 h-4 ${sc.text}`} />
                    <span className={`text-xs font-bold uppercase tracking-wide ${sc.text}`}>{sc.label}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(req.created_at)}
                  </div>
                </div>

                <div className="p-5">
                  {/* Caracteristiques */}
                  <div className="space-y-2 mb-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                      Cheveux{req.strands_json && req.strands_json.length > 0 ? ` (${req.strands_json.length} meche${req.strands_json.length > 1 ? 's' : ''})` : ''}
                    </h3>
                    {req.strands_json && req.strands_json.length > 0 ? (
                      <div className="space-y-1.5">
                        {req.strands_json.map((s, i) => (
                          <div key={i} className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                            <div>
                              <p className="text-xs font-semibold text-gray-800">
                                Meche {i + 1} — {CONDITION_LABELS[s.condition] || s.condition}
                                {s.colorType ? ` — ${COLOR_LABELS[s.colorType] || s.colorType}` : ''}
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
                            <p className="text-xs font-bold text-white">Total estimatif</p>
                            <p className="text-sm font-black text-white">{req.exact_price} €</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Palette className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="font-medium">{CONDITION_LABELS[req.hair_condition] || req.hair_condition}</span>
                          {req.hair_color && <span className="text-gray-500">— {COLOR_LABELS[req.hair_color] || req.hair_color}</span>}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Ruler className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          {req.hair_length}
                        </div>
                        <p className="text-sm font-bold text-emerald-700">{req.exact_price != null ? `${req.exact_price} €` : req.calculated_price}</p>
                      </div>
                    )}
                  </div>

                  {/* Details selon statut */}
                  {req.status === 'pending' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                      Votre demande est en cours d'examen. Nous vous contacterons sous 48h par email ou telephone.
                    </div>
                  )}

                  {req.status === 'accepted' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
                      Demande acceptee ! Le virement bancaire sera effectue dans les 5 jours ouvrables sur votre IBAN. Vous recevrez l'etiquette d'expedition par email.
                    </div>
                  )}

                  {req.status === 'paid' && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <p className="text-sm font-semibold text-emerald-700">Virement effectue</p>
                      </div>
                      {req.final_price != null && (
                        <p className="text-sm text-gray-700">Montant : <span className="font-bold text-gray-900">{req.final_price} €</span></p>
                      )}
                      {req.paid_at && (
                        <p className="text-xs text-gray-500 mt-0.5">Le {formatDate(req.paid_at)}</p>
                      )}
                    </div>
                  )}

                  {req.status === 'refused' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                      Nous n'avons pas pu retenir cette demande. N'hesitez pas a nous contacter pour plus d'informations.
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
