import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { COUNTRIES } from '../../lib/countries';
import { User, MapPin, Phone, Building2, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';

export function ProfileCompletionModal() {
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    postal_code: '',
    city: '',
    country: 'FR',
    siret: '',
  });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const step1Valid = form.first_name.trim() && form.last_name.trim() && form.phone.trim();
  const step2Valid = form.address_line1.trim() && form.postal_code.trim() && form.city.trim();

  const handleNext = () => {
    if (!step1Valid) return;
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!step2Valid || !user) return;
    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: `${form.first_name.trim()} ${form.last_name.trim()}`,
        phone: form.phone.trim(),
        address_line1: form.address_line1.trim(),
        address_line2: form.address_line2.trim() || null,
        postal_code: form.postal_code.trim(),
        city: form.city.trim(),
        country: form.country,
        location: COUNTRIES.find(c => c.code === form.country)?.name ?? form.country,
        siret: form.siret.trim() || null,
      })
      .eq('id', user.id);

    if (updateError) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setSaving(false);
      return;
    }

    await refreshProfile();
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 pt-8 pb-6 text-white">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center">Complétez votre profil</h2>
          <p className="text-emerald-100 text-sm text-center mt-1">
            Ces informations sont nécessaires pour acheter et vendre sur la plateforme.
          </p>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${step >= 1 ? 'text-white' : 'text-white/50'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                step > 1 ? 'bg-white text-emerald-700 border-white' : step === 1 ? 'border-white text-white' : 'border-white/40 text-white/40'
              }`}>
                {step > 1 ? <CheckCircle className="w-3.5 h-3.5" /> : '1'}
              </div>
              Identité
            </div>
            <div className="w-8 h-px bg-white/30" />
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${step >= 2 ? 'text-white' : 'text-white/50'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                step === 2 ? 'border-white text-white' : 'border-white/40 text-white/40'
              }`}>
                2
              </div>
              Adresse
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg mb-4 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Prénom <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={set('first_name')}
                    placeholder="Marie"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nom <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={set('last_name')}
                    placeholder="Dupont"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Téléphone <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> SIRET / SIREN <span className="text-gray-400 font-normal">(optionnel — salons uniquement)</span></span>
                </label>
                <input
                  type="text"
                  value={form.siret}
                  onChange={set('siret')}
                  placeholder="123 456 789 00012"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all"
                />
              </div>

              <button
                onClick={handleNext}
                disabled={!step1Valid}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl font-semibold text-sm transition-all"
              >
                Continuer
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Adresse <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={form.address_line1}
                  onChange={set('address_line1')}
                  placeholder="12 rue de la Paix"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Complément d'adresse <span className="text-gray-400 font-normal">(optionnel)</span></label>
                <input
                  type="text"
                  value={form.address_line2}
                  onChange={set('address_line2')}
                  placeholder="Appt 3, Bât. B…"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Code postal <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.postal_code}
                    onChange={set('postal_code')}
                    placeholder="75001"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ville <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={set('city')}
                    placeholder="Paris"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pays <span className="text-red-500">*</span></label>
                <select
                  value={form.country}
                  onChange={set('country')}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all bg-white"
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-all"
                >
                  Retour
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!step2Valid || saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl font-semibold text-sm transition-all"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Enregistrer
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-4">
            Ces informations sont nécessaires pour sécuriser vos transactions et respecter nos conditions d'utilisation.
          </p>
        </div>
      </div>
    </div>
  );
}
