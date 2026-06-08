/**
 * Title SEO : Vendre mes cheveux - Prix, criteres & comment ca marche
 * Meta description : Vendez vos cheveux naturels ou colores sur NaturalHairMarket.
 * Prix libre, criteres clairs, transaction securisee. Decouvrez comment ca se passe.
 */

import { useState, useRef } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Camera,
  Ruler,
  Layers,
  Palette,
  AlertTriangle,
  Package,
  DollarSign,
  Shield,
  ArrowRight,
  User,
  Scissors,
  Droplets,
  Wind,
  CheckCircle,
  Upload,
  Send,
  Sparkles,
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface SellMyHairProps {
  onStartSelling?: () => void;
}

// --- Prix calculés ---
type Condition = 'natural' | 'colored';
type ColorType = 'chestnut' | 'blond_roux_gris';

const LENGTHS_NATURAL = ['15-25 cm', '25-35 cm', '35-45 cm', '45-55 cm', '55 cm+'];
const LENGTHS_COLORED = ['30-45 cm'];

const PRICES: Record<ColorType, Record<string, string>> = {
  chestnut: {
    '15-25 cm': '5 €',
    '25-35 cm': '20 €',
    '35-45 cm': '45 €',
    '45-55 cm': '80 €',
    '55 cm+': '120 €',
  },
  blond_roux_gris: {
    '15-25 cm': '10 €',
    '25-35 cm': '40 €',
    '35-45 cm': '90 €',
    '45-55 cm': '160 €',
    '55 cm+': 'Sur devis – Mini 250 €',
  },
};

function getPrice(condition: Condition, color: ColorType | '', length: string): string {
  if (!length) return '';
  if (condition === 'colored') return '10 €';
  if (!color) return '';
  return PRICES[color][length] ?? '';
}

function isPriceOnDemand(price: string) {
  return price.startsWith('Sur devis');
}

// --- FAQ ---
const faqs: { q: string; a: string }[] = [
  {
    q: "Qui peut vendre ses cheveux sur NaturalHairMarket ?",
    a: "Toute personne majeure (18 ans et plus) proprietaire de ses cheveux peut vendre sur la plateforme. Les particuliers comme les professionnels (salons) sont les bienvenus.",
  },
  {
    q: "Quels types de cheveux sont acceptes ?",
    a: "Les cheveux humains naturels, colores, decolores ou traites (lissage, keratine, henne, etc.) sont acceptes, a condition que l'etat et les traitements soient clairement mentionnes dans l'annonce. Toutes les textures sont acceptees : raides, ondules, boucles, crepus.",
  },
  {
    q: "Les cheveux decolores ou colores sont-ils acceptes ?",
    a: "Oui. Les cheveux decolores et colores sont acceptes sur NaturalHairMarket. Il est obligatoire de le preciser dans l'annonce afin que l'acheteur puisse evaluer la qualite en connaissance de cause.",
  },
  {
    q: "Comment envoyer mes photos ?",
    a: "Lors de la creation de votre annonce sur la plateforme, vous pouvez telecharger vos photos directement. Privilegiez un fond clair, une bonne lumiere naturelle, et prenez au moins une photo de pres et une de loin pour montrer la longueur reelle.",
  },
  {
    q: "Paiement : quand et comment ?",
    a: "Le paiement est effectue via la plateforme NaturalHairMarket de facon securisee. Les fonds sont proteges jusqu'a confirmation de reception par l'acheteur. Le versement au vendeur intervient selon les conditions affichees dans l'interface.",
  },
  {
    q: "Comment je contacte NaturalHairMarket ?",
    a: "Vous pouvez contacter l'equipe par email a naturalhairmarket@gmail.com ou par telephone au 09 72 21 69 48 pour toute question relative a votre annonce ou a une transaction.",
  },
  {
    q: "Puis-je vendre plusieurs fois sur la plateforme ?",
    a: "Oui, vous pouvez creer plusieurs annonces et vendre autant de fois que vous le souhaitez, dans la limite des regles de la plateforme. Chaque lot de cheveux doit faire l'objet d'une annonce distincte avec ses propres photos et description.",
  },
];

const PREP_STEPS = [
  {
    icon: <Droplets className="w-6 h-6 text-blue-500" />,
    num: 1,
    title: 'Lavage',
    desc: 'Laver les cheveux pour les nettoyer et les desinfecter soigneusement.',
    bg: 'bg-blue-50 border-blue-100',
  },
  {
    icon: <Wind className="w-6 h-6 text-amber-500" />,
    num: 2,
    title: 'Sechage',
    desc: 'Secher completement au seche-cheveux sans lisser. Aspect naturel obligatoire.',
    bg: 'bg-amber-50 border-amber-100',
  },
  {
    icon: <Layers className="w-6 h-6 text-emerald-600" />,
    num: 3,
    title: 'Preparation',
    desc: 'Separer et securiser les cheveux en queues de cheval individuelles.',
    bg: 'bg-emerald-50 border-emerald-100',
  },
  {
    icon: <Ruler className="w-6 h-6 text-violet-500" />,
    num: 4,
    title: 'Mesure & coupe',
    desc: 'Mesurer pour s\'assurer que la longueur est d\'au moins 15 cm, puis couper.',
    bg: 'bg-violet-50 border-violet-100',
  },
  {
    icon: <Package className="w-6 h-6 text-rose-500" />,
    num: 5,
    title: 'Tressage & mise en sac',
    desc: 'Tresser en queue de cheval et placer dans un sac de type congelation avec fermeture.',
    bg: 'bg-rose-50 border-rose-100',
  },
];

export function SellMyHair({ onStartSelling }: SellMyHairProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // --- Calculateur ---
  const [condition, setCondition] = useState<Condition | ''>('');
  const [colorType, setColorType] = useState<ColorType | ''>('');
  const [length, setLength] = useState('');

  const availableLengths = condition === 'colored' ? LENGTHS_COLORED : LENGTHS_NATURAL;
  const calculatedPrice = condition ? getPrice(condition as Condition, colorType, length) : '';

  // --- Formulaire ---
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    salon_name: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!condition) {
      setSubmitError('Veuillez selectionner l\'etat de vos cheveux.');
      return;
    }
    if (condition === 'natural' && !colorType) {
      setSubmitError('Veuillez selectionner la couleur de vos cheveux.');
      return;
    }
    if (!length) {
      setSubmitError('Veuillez selectionner la longueur de vos cheveux.');
      return;
    }

    setSubmitting(true);

    try {
      let photo_url: string | null = null;

      if (photoFile) {
        const ext = photoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError, data } = await supabase.storage
          .from('buyback-photos')
          .upload(fileName, photoFile, { upsert: false });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage
          .from('buyback-photos')
          .getPublicUrl(data.path);
        photo_url = publicUrl;
      }

      const { error: insertError } = await supabase
        .from('hair_buyback_requests')
        .insert({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          salon_name: form.salon_name.trim() || null,
          photo_url,
          hair_condition: condition,
          hair_color: condition === 'natural' ? colorType || null : null,
          hair_length: length,
          calculated_price: calculatedPrice || 'Non calcule',
          status: 'pending',
        });

      if (insertError) throw insertError;

      setSubmitSuccess(true);
      setForm({ first_name: '', last_name: '', email: '', phone: '', salon_name: '' });
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (err) {
      setSubmitError((err as Error).message || 'Une erreur est survenue. Veuillez reessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 text-emerald-700 text-sm font-medium mb-5">
            <Scissors className="w-4 h-4" />
            Rachat & vente de cheveux humains
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Vendre mes cheveux naturels ou colores&nbsp;:
            <br className="hidden md:block" />
            <span className="text-emerald-600"> prix, preparation et demande de rachat</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Estimez la valeur de vos cheveux en quelques secondes, preparez-les selon nos consignes, puis transmettez votre demande de rachat directement a NaturalHairMarket.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-sm text-base"
            >
              <Send className="w-5 h-5" />
              Transmettre ma demande
            </button>
            <button
              onClick={onStartSelling}
              className="inline-flex items-center gap-2 border-2 border-emerald-200 text-emerald-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-colors text-base"
            >
              Voir le marketplace
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">

        {/* ===== SECTION A : Calculateur de prix ===== */}
        <section>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">A</div>
            <h2 className="text-2xl font-bold text-gray-900">Calculateur de prix – Estimez la valeur de vos cheveux</h2>
          </div>
          <p className="text-gray-500 mb-6 text-sm ml-11">Selectionnez les caracteristiques de vos cheveux pour obtenir une estimation de rachat instantanee.</p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

            {/* Choix 1 : Etat */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">1. Etat des cheveux</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { value: 'natural', label: 'Naturels (Vierges)', desc: 'Jamais colores ni traites chimiquement', emoji: '🌿' },
                  { value: 'colored', label: 'Colores / Meches', desc: 'Coloration, decoloration ou meches', emoji: '🎨' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setCondition(opt.value as Condition);
                      setColorType('');
                      setLength('');
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      condition === opt.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{opt.emoji}</span>
                    <p className={`font-semibold text-sm ${condition === opt.value ? 'text-emerald-700' : 'text-gray-800'}`}>{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Choix 2 : Couleur (si naturels) */}
            {condition === 'natural' && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">2. Couleur naturelle</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { value: 'chestnut', label: 'Chatain / Brun', desc: 'Teintes brunes et chatain fonce', color: 'bg-amber-800' },
                    { value: 'blond_roux_gris', label: 'Blond / Roux / Gris', desc: 'Pepites rares tres recherchees', color: 'bg-yellow-300' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setColorType(opt.value as ColorType); setLength(''); }}
                      className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                        colorType === opt.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full ${opt.color} flex-shrink-0 border-2 border-white shadow-sm mt-0.5`} />
                      <div>
                        <p className={`font-semibold text-sm ${colorType === opt.value ? 'text-emerald-700' : 'text-gray-800'}`}>{opt.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Choix 3 : Longueur */}
            {(condition === 'colored' || (condition === 'natural' && colorType)) && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  {condition === 'natural' ? '3.' : '2.'} Longueur des cheveux
                </p>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-emerald-500 focus:ring-0 outline-none text-sm bg-white"
                >
                  <option value="">-- Choisir une longueur --</option>
                  {availableLengths.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Resultat */}
            {calculatedPrice && (
              <div className={`rounded-xl p-5 text-center border-2 ${isPriceOnDemand(calculatedPrice) ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-300'}`}>
                <p className="text-sm font-medium text-gray-600 mb-1">Estimation de rachat</p>
                <p className={`text-3xl font-black ${isPriceOnDemand(calculatedPrice) ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {calculatedPrice}
                </p>
                {isPriceOnDemand(calculatedPrice) && (
                  <p className="text-xs text-amber-600 mt-1">Prix exact sur devis apres reception et verification des cheveux.</p>
                )}
                {!isPriceOnDemand(calculatedPrice) && (
                  <p className="text-xs text-emerald-600 mt-1">Prix indicatif sous reserve de verification a reception.</p>
                )}
                <button
                  onClick={scrollToForm}
                  className="mt-4 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
                >
                  <Send className="w-4 h-4" />
                  Transmettre ma demande de rachat
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Grille tarifaire image */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Grille tarifaire de reference</h2>
          <p className="text-gray-500 mb-4 text-sm">Ces prix sont indicatifs et bases sur des cheveux en bon etat. Le prix definitif est confirme apres inspection a reception.</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <img
              src="/ab1b549f-6bc6-4966-b017-7d9be074b365.png"
              alt="Grille tarifaire des cheveux bruts sur NaturalHairMarket"
              className="w-full h-auto"
            />
          </div>
        </section>

        {/* ===== SECTION B : Consignes de preparation ===== */}
        <section>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">B</div>
            <h2 className="text-2xl font-bold text-gray-900">Consignes de preparation obligatoires</h2>
          </div>
          <p className="text-gray-500 mb-6 text-sm ml-11">Ces 5 etapes sont indispensables pour que votre demande soit acceptee. Des cheveux mal prepares seront retournes.</p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
            <img
              src="/398249a7-e404-4b31-8512-bf2eac66a382.png"
              alt="Le processus de collecte de cheveux en 5 etapes"
              className="w-full h-auto"
            />
          </div>

          <div className="grid sm:grid-cols-5 gap-3">
            {PREP_STEPS.map((step) => (
              <div key={step.num} className={`border rounded-xl p-4 text-center ${step.bg}`}>
                <div className="flex justify-center mb-2">{step.icon}</div>
                <p className="text-xs font-bold text-gray-800 mb-1">{step.num}. {step.title}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800 text-sm">
              <strong>Longueur minimale : 15 cm.</strong> Pas de lissage, juste seche au seche-cheveux. Les cheveux doivent correspondre fidelement aux photos transmises.
            </p>
          </div>
        </section>

        {/* ===== SECTION C : Formulaire de soumission ===== */}
        <section ref={formRef}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">C</div>
            <h2 className="text-2xl font-bold text-gray-900">Transmettre ma demande de rachat</h2>
          </div>
          <p className="text-gray-500 mb-6 text-sm ml-11">
            Remplissez le formulaire ci-dessous. Notre equipe vous contactera sous 48h pour confirmer le rachat et les modalites d'envoi.
          </p>

          {submitSuccess ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-emerald-800 mb-2">Demande envoyee avec succes !</h3>
              <p className="text-emerald-700 text-sm max-w-md mx-auto leading-relaxed">
                Nous avons bien recu votre demande de rachat. Notre equipe l'examine et vous contactera par email ou telephone sous <strong>48h ouvrables</strong>.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="mt-5 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Faire une nouvelle demande
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Caracteristiques des cheveux */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-4">
                  <p className="text-sm font-bold text-emerald-800">Caracteristiques de vos cheveux</p>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Etat <span className="text-red-500">*</span></label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {[
                        { value: 'natural', label: 'Naturels (Vierges)', desc: 'Jamais colores ni traites' },
                        { value: 'colored', label: 'Colores / Meches', desc: 'Coloration ou decoloration' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setCondition(opt.value as Condition); setColorType(''); setLength(''); }}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            condition === opt.value
                              ? 'border-emerald-500 bg-white'
                              : 'border-gray-200 bg-white hover:border-emerald-300'
                          }`}
                        >
                          <p className={`font-semibold text-xs ${condition === opt.value ? 'text-emerald-700' : 'text-gray-800'}`}>{opt.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {condition === 'natural' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Couleur naturelle <span className="text-red-500">*</span></label>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {[
                          { value: 'chestnut', label: 'Chatain / Brun', dot: 'bg-amber-800' },
                          { value: 'blond_roux_gris', label: 'Blond / Roux / Gris', dot: 'bg-yellow-300 border border-yellow-400' },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setColorType(opt.value as ColorType); setLength(''); }}
                            className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-2 ${
                              colorType === opt.value
                                ? 'border-emerald-500 bg-white'
                                : 'border-gray-200 bg-white hover:border-emerald-300'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full flex-shrink-0 ${opt.dot}`} />
                            <p className={`font-semibold text-xs ${colorType === opt.value ? 'text-emerald-700' : 'text-gray-800'}`}>{opt.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(condition === 'colored' || (condition === 'natural' && colorType)) && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Longueur <span className="text-red-500">*</span></label>
                      <select
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:border-emerald-500 outline-none text-sm bg-white"
                      >
                        <option value="">-- Choisir une longueur --</option>
                        {availableLengths.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {calculatedPrice && (
                    <div className={`rounded-xl p-3 flex items-center justify-between gap-3 ${isPriceOnDemand(calculatedPrice) ? 'bg-amber-50 border border-amber-300' : 'bg-white border border-emerald-300'}`}>
                      <p className="text-xs text-gray-600">Estimation de rachat</p>
                      <p className={`text-lg font-black ${isPriceOnDemand(calculatedPrice) ? 'text-amber-700' : 'text-emerald-700'}`}>{calculatedPrice}</p>
                    </div>
                  )}
                </div>

                {/* Coordonnees */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Prenom <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={form.first_name}
                      onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                      placeholder="Marie"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nom <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={form.last_name}
                      onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                      placeholder="Dupont"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="marie@exemple.fr"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Telephone <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="06 12 34 56 78"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Nom du salon <span className="text-gray-400 font-normal">(optionnel – si vous etes professionnel)</span>
                  </label>
                  <input
                    type="text"
                    value={form.salon_name}
                    onChange={(e) => setForm({ ...form, salon_name: e.target.value })}
                    placeholder="Salon Belleza Paris"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Photo de vos cheveux <span className="text-gray-400 font-normal">(recommande – accelere le traitement)</span>
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Apercu" className="w-full max-h-48 object-contain rounded-lg" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-600">Cliquez pour ajouter une photo</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP – Max 10 Mo</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                  {photoPreview && (
                    <button
                      type="button"
                      onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                      className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
                    >
                      Supprimer la photo
                    </button>
                  )}
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Transmettre ma demande de rachat
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  En soumettant ce formulaire, vous acceptez d'etre contacte par NaturalHairMarket concernant votre demande de rachat.
                </p>
              </form>
            </div>
          )}
        </section>

        {/* Comment ca se passe */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Comment se deroule le rachat ?</h2>
          <p className="text-gray-500 mb-6 text-sm">De votre demande au paiement, voici les etapes.</p>
          <div className="space-y-4">
            {[
              { num: 1, title: "Soumission de votre demande", body: "Remplissez le formulaire ci-dessus avec vos coordonnees et les caracteristiques de vos cheveux. Notre equipe reçoit votre demande et l'examine.", icon: <Send className="w-5 h-5 text-emerald-600" /> },
              { num: 2, title: "Validation et accord de prix", body: "Nous vous contactons sous 48h pour valider la demande et confirmer le prix. En cas de blond/roux/gris de plus de 55 cm, un devis personnalise vous est fourni.", icon: <CheckCircle className="w-5 h-5 text-emerald-600" /> },
              { num: 3, title: "Envoi de vos cheveux", body: "Une fois l'accord confirme, vous envoyez vos cheveux par courrier suivi a l'adresse communiquee. Les frais d'envoi sont a votre charge.", icon: <Package className="w-5 h-5 text-emerald-600" /> },
              { num: 4, title: "Verification et paiement", body: "A reception, nous verifions que les cheveux correspondent a la description. Le paiement est effectue par virement dans les 5 jours ouvrables.", icon: <Shield className="w-5 h-5 text-emerald-600" /> },
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-base">{step.num}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {step.icon}
                    <h3 className="font-semibold text-gray-800">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Prix & marketplace */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Prix &amp; criteres de rachat</h2>
          <p className="text-gray-500 mb-6 text-sm">Ces elements influencent directement la valeur percue de votre lot.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3"><Ruler className="w-5 h-5 text-emerald-600" /><h3 className="font-semibold text-gray-800">Longueur</h3></div>
              <p className="text-gray-600 text-sm leading-relaxed">Mesuree en centimetres du cuir chevelu jusqu'aux pointes. Longueur minimale : <strong>15 cm</strong>. Plus les cheveux sont longs, plus leur valeur est elevee.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3"><Layers className="w-5 h-5 text-emerald-600" /><h3 className="font-semibold text-gray-800">Densite</h3></div>
              <p className="text-gray-600 text-sm leading-relaxed">Evaluez la densite de votre chevelure : <strong>faible</strong> (queue fine), <strong>moyenne</strong> (queue normale) ou <strong>forte</strong> (queue tres epaisse). Le poids en grammes est un indicateur objectif apprecie.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5 text-amber-500" /><h3 className="font-semibold text-gray-800">Etat</h3></div>
              <p className="text-gray-600 text-sm leading-relaxed">Des cheveux en bon etat, propres et sans fourches excessives auront une valeur plus elevee. Signalez toujours la secheresse, les cassures ou la porosite excessive.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3"><Palette className="w-5 h-5 text-emerald-600" /><h3 className="font-semibold text-gray-800">Couleur</h3></div>
              <p className="text-gray-600 text-sm leading-relaxed">Les cheveux <strong>blonds, roux ou gris naturels</strong> sont les plus recherches (pepites). Les chatains/bruns sont courants. Les colores/meches ont une valeur reduite.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Questions frequentes sur la vente de cheveux</h2>
          <p className="text-gray-500 mb-6 text-sm">Tout ce que vous devez savoir avant de vendre vos cheveux.</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800 text-sm leading-relaxed">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-gray-600 text-sm leading-relaxed bg-emerald-50 border border-emerald-100 rounded-xl p-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-600 rounded-2xl p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4">
            <Scissors className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Pret(e) a vendre vos cheveux ?</h2>
          <p className="text-emerald-100 mb-6 max-w-md mx-auto leading-relaxed text-sm">
            Estimez la valeur de vos cheveux, preparez-les selon nos consignes, et transmettez votre demande en quelques minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-semibold px-7 py-3 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm text-sm"
            >
              <Send className="w-4 h-4" />
              Faire ma demande de rachat
            </button>
            <button
              onClick={onStartSelling}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"
            >
              <User className="w-4 h-4" />
              Voir le marketplace
            </button>
          </div>
          <p className="text-emerald-200 text-xs mt-4">
            Reponse sous 48h · Criteres transparents · Paiement securise
          </p>
        </section>

      </div>
    </div>
  );
}
