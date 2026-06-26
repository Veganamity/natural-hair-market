/**
 * Title SEO : Vendre mes cheveux - Prix, criteres & comment ca marche
 * Meta description : Vendez vos cheveux naturels ou colores sur NaturalHairMarket.
 * Prix libre, criteres clairs, transaction securisee. Decouvrez comment ca se passe.
 */

import { useState, useRef, useEffect } from 'react';
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
  MapPin,
  CreditCard,
  Mail,
  Phone,
  Plus,
  Trash2,
  Zap,
  Star,
  Users,
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface SellMyHairProps {
  onStartSelling?: () => void;
}

// --- Prix calculés ---
type Condition = 'natural' | 'colored';
type ColorType = 'chestnut' | 'blond_roux_gris';

const ALL_LENGTHS = [
  '15-24 cm (6"-9")',
  '25 cm (10")',
  '30 cm (12")',
  '35 cm (14")',
  '40 cm (16")',
  '45 cm (18")',
  '50 cm (20")',
  '55 cm (22")',
  '60 cm (24")',
  '66 cm (26")',
  '71 cm (28")',
  '76 cm (30")',
  '81 cm (32")',
  '86 cm (34")',
  '91 cm (36")',
  '96 cm (38")',
  '101 cm (40")',
];

const PRICES_PER_100G: Record<'chestnut' | 'blond_roux_gris' | 'colored', Record<string, number>> = {
  chestnut: {
    '15-24 cm (6"-9")': 5,
    '25 cm (10")': 29,
    '30 cm (12")': 34,
    '35 cm (14")': 46,
    '40 cm (16")': 56,
    '45 cm (18")': 68,
    '50 cm (20")': 76,
    '55 cm (22")': 81,
    '60 cm (24")': 88,
    '66 cm (26")': 107,
    '71 cm (28")': 118,
    '76 cm (30")': 126,
    '81 cm (32")': 136,
    '86 cm (34")': 146,
    '91 cm (36")': 154,
    '96 cm (38")': 159,
    '101 cm (40")': 167,
  },
  blond_roux_gris: {
    '15-24 cm (6"-9")': 10,
    '25 cm (10")': 58,
    '30 cm (12")': 68,
    '35 cm (14")': 92,
    '40 cm (16")': 112,
    '45 cm (18")': 136,
    '50 cm (20")': 152,
    '55 cm (22")': 162,
    '60 cm (24")': 176,
    '66 cm (26")': 214,
    '71 cm (28")': 236,
    '76 cm (30")': 252,
    '81 cm (32")': 272,
    '86 cm (34")': 292,
    '91 cm (36")': 308,
    '96 cm (38")': 318,
    '101 cm (40")': 334,
  },
  colored: {
    '15-24 cm (6"-9")': 3,
    '25 cm (10")': 8,
    '30 cm (12")': 12,
    '35 cm (14")': 16,
    '40 cm (16")': 20,
    '45 cm (18")': 25,
    '50 cm (20")': 30,
    '55 cm (22")': 35,
    '60 cm (24")': 45,
    '66 cm (26")': 45,
    '71 cm (28")': 45,
    '76 cm (30")': 45,
    '81 cm (32")': 45,
    '86 cm (34")': 45,
    '91 cm (36")': 45,
    '96 cm (38")': 45,
    '101 cm (40")': 45,
  },
};

function getPrice(condition: Condition, color: ColorType | '', length: string): string {
  if (!length) return '';
  if (condition === 'colored') {
    const rate = PRICES_PER_100G.colored[length];
    return rate != null ? `${rate} € / 100g` : '';
  }
  if (!color) return '';
  const rate = PRICES_PER_100G[color][length];
  return rate != null ? `${rate} € / 100g` : '';
}

// --- FAQ ---
const faqs: { q: string; a: string }[] = [
  {
    q: "Combien puis-je gagner en vendant mes cheveux ?",
    a: "Le prix rachat cheveux naturels dépend principalement de la longueur et de la couleur. Pour des cheveux châtains naturels de 40 cm, comptez environ 56 € / 100 g. Pour des cheveux blonds ou roux de la même longueur, le tarif monte à 112 € / 100 g. Les mèches très longues (70 cm et plus) peuvent atteindre 200 à 300 € pour 100 g. Utilisez notre calculateur gratuit pour obtenir une estimation précise selon votre profil.",
  },
  {
    q: "Quels types de cheveux sont acceptés pour vendre ses cheveux ?",
    a: "Natural Hair Market accepte tous types de cheveux humains : cheveux naturels vierges (jamais colorés), cheveux colorés, décolorés, méchés, traités au lissage ou à la kératine. Toutes les textures sont acceptées : raides, ondulés, bouclés, crépus. La longueur minimale est de 15 cm. Il est obligatoire de mentionner l'état exact et les traitements subis dans votre annonce ou demande de rachat.",
  },
  {
    q: "Comment se passe l'envoi de mes cheveux ?",
    a: "Pour le rachat direct : une fois votre demande acceptée, notre équipe vous envoie sous 48 h une confirmation avec l'adresse d'expédition. Vous envoyez vos cheveux par courrier suivi (frais à votre charge). Pour la marketplace : vous expédiez directement à l'acheteur dès que la commande est validée. Dans les deux cas, vos cheveux doivent être soigneusement préparés (lavés, séchés, tressés en queue de cheval) et emballés dans un sac congélation fermé.",
  },
  {
    q: "Quelle est la longueur minimale pour vendre ses cheveux naturels ?",
    a: "La longueur minimale acceptée est de 15 cm mesurés du bas de l'élastique jusqu'aux pointes, après coupe. En dessous de cette longueur, les cheveux ne sont pas valorisables sur le marché des extensions et perruques. Plus les cheveux sont longs, plus leur valeur augmente significativement : un lot de 70 cm peut valoir 3 à 5 fois plus qu'un lot de 40 cm à poids équivalent.",
  },
  {
    q: "Comment vendre ses cheveux en ligne sur Natural Hair Market ?",
    a: "Deux options s'offrent à vous : (1) Déposer une annonce gratuite sur notre marketplace — créez votre compte, publiez vos photos et fixez votre propre prix ; vous encaissez 100 % du montant lors de la vente. (2) Soumettre une demande de rachat direct — remplissez le formulaire ci-dessus avec les caractéristiques de votre mèche et votre IBAN ; notre équipe vous recontacte sous 48 h pour confirmer le prix et les modalités d'envoi.",
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

interface Strand {
  id: string;
  condition: Condition;
  colorType: ColorType | '';
  length: string;
  weightGrams: string;
  rateStr: string;
  exactPrice: number | null;
}

function strandLabel(s: Strand): string {
  const condLabel = s.condition === 'natural' ? 'Naturels' : 'Colores';
  const colorLabel = s.colorType === 'chestnut' ? ' Chatain/Brun' : s.colorType === 'blond_roux_gris' ? ' Blond/Roux' : '';
  return `${condLabel}${colorLabel} — ${s.length}`;
}

export function SellMyHair({ onStartSelling }: SellMyHairProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.getElementById('meta-description') as HTMLMetaElement | null;
    const prevDesc = metaDesc?.content ?? '';

    document.title = 'Vendre mes cheveux - Obtenez le meilleur prix | Natural Hair Market';
    if (metaDesc) {
      metaDesc.content = 'Vendez vos cheveux naturels facilement sur Natural Hair Market. Estimation gratuite, paiement rapide et sécurisé. Découvrez comment vendre vos cheveux en 3 étapes simples.';
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.content = prevDesc;
    };
  }, []);

  // --- Calculateur (etat de la meche en cours) ---
  const [condition, setCondition] = useState<Condition | ''>('');
  const [colorType, setColorType] = useState<ColorType | ''>('');
  const [length, setLength] = useState('');
  const [weightGrams, setWeightGrams] = useState('');

  // --- Liste des meches ajoutees ---
  const [strands, setStrands] = useState<Strand[]>([]);

  const availableLengths = ALL_LENGTHS;
  const rateStr = condition ? getPrice(condition as Condition, colorType, length) : '';
  const ratePerHundred = rateStr ? parseFloat(rateStr) : null;
  const grams = parseFloat(weightGrams);
  const exactPrice = ratePerHundred != null && !isNaN(grams) && grams > 0
    ? Math.round(ratePerHundred * grams / 100 * 100) / 100
    : null;
  const calculatedPrice = rateStr;

  const canAddStrand = !!condition && (condition === 'colored' || !!colorType) && !!length;

  const addStrand = () => {
    if (!canAddStrand) return;
    const strand: Strand = {
      id: `${Date.now()}-${Math.random()}`,
      condition: condition as Condition,
      colorType: colorType as ColorType | '',
      length,
      weightGrams,
      rateStr,
      exactPrice,
    };
    setStrands(prev => [...prev, strand]);
    setCondition('');
    setColorType('');
    setLength('');
    setWeightGrams('');
  };

  const removeStrand = (id: string) => setStrands(prev => prev.filter(s => s.id !== id));

  const totalExactPrice = strands.reduce((sum, s) => sum + (s.exactPrice ?? 0), 0);
  const allStrandsHavePrice = strands.length > 0 && strands.every(s => s.exactPrice != null);

  // Meche "courante" (si l'utilisateur n'a pas encore clique Ajouter)
  const currentStrandAsStrands = (): Strand[] => {
    if (strands.length > 0) return strands;
    if (!condition || !length) return [];
    return [{
      id: 'current',
      condition: condition as Condition,
      colorType: colorType as ColorType | '',
      length,
      weightGrams,
      rateStr,
      exactPrice,
    }];
  };

  // --- Formulaire ---
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    salon_name: '',
    address_line1: '',
    postal_code: '',
    city: '',
    iban: '',
    bank_holder_name: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedSummary, setSubmittedSummary] = useState<{
    name: string; email: string; phone: string;
    condition: string; color: string; length: string; price: string;
    address: string; iban: string; holder: string;
    submittedAt: string; strands: Strand[];
  } | null>(null);

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

    const effectiveStrands = currentStrandAsStrands();

    if (effectiveStrands.length === 0) {
      setSubmitError('Veuillez ajouter au moins une meche avant de soumettre.');
      return;
    }
    for (const s of effectiveStrands) {
      if (s.condition === 'natural' && !s.colorType) {
        setSubmitError('Veuillez selectionner la couleur pour chaque meche naturelle.');
        return;
      }
    }

    const primaryStrand = effectiveStrands[0];
    const condition = primaryStrand.condition;
    const colorType = primaryStrand.colorType;
    const length = primaryStrand.length;
    const totalGrams = effectiveStrands.reduce((sum, s) => sum + (parseFloat(s.weightGrams) || 0), 0);
    const totalPrice = allStrandsHavePrice ? totalExactPrice : null;
    const priceLabel = effectiveStrands.length === 1
      ? (primaryStrand.exactPrice != null
          ? `${primaryStrand.exactPrice.toFixed(2)} € (${primaryStrand.weightGrams}g × ${primaryStrand.rateStr})`
          : primaryStrand.rateStr || 'Non calcule')
      : totalPrice != null
          ? `${totalPrice.toFixed(2)} € total (${effectiveStrands.length} meches)`
          : `${effectiveStrands.length} meches – tarifs variables`;

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
          calculated_price: priceLabel,
          weight_grams: totalGrams > 0 ? Math.round(totalGrams) : null,
          exact_price: totalPrice,
          strands_json: effectiveStrands.length > 1 ? effectiveStrands.map(s => ({
            condition: s.condition,
            colorType: s.colorType,
            length: s.length,
            weightGrams: s.weightGrams,
            rateStr: s.rateStr,
            exactPrice: s.exactPrice,
          })) : null,
          address_line1: form.address_line1.trim() || null,
          postal_code: form.postal_code.trim() || null,
          city: form.city.trim() || null,
          country: 'FR',
          iban: form.iban.trim() || null,
          bank_holder_name: form.bank_holder_name.trim() || null,
          status: 'pending',
        });

      if (insertError) throw insertError;

      setSubmittedSummary({
        name: `${form.first_name.trim()} ${form.last_name.trim()}`,
        email: form.email.trim(),
        phone: form.phone.trim(),
        condition: effectiveStrands.length === 1
          ? (condition === 'colored' ? 'Colores / Meches' : 'Naturels (Vierges)')
          : `${effectiveStrands.length} meches`,
        color: effectiveStrands.length === 1
          ? (colorType === 'chestnut' ? 'Chatain / Brun' : colorType === 'blond_roux_gris' ? 'Blond / Roux / Gris' : '')
          : '',
        length: effectiveStrands.length === 1 ? length : effectiveStrands.map(s => s.length).join(', '),
        price: priceLabel,
        address: [form.address_line1.trim(), form.postal_code.trim(), form.city.trim()].filter(Boolean).join(', '),
        iban: form.iban.trim(),
        holder: form.bank_holder_name.trim(),
        submittedAt: new Date().toLocaleString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        strands: effectiveStrands,
      });
      setSubmitSuccess(true);
      setForm({ first_name: '', last_name: '', email: '', phone: '', salon_name: '', address_line1: '', postal_code: '', city: '', iban: '', bank_holder_name: '' });
      setPhotoFile(null);
      setPhotoPreview(null);
      setStrands([]);
      setCondition('');
      setColorType('');
      setLength('');
      setWeightGrams('');
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
            Vendre mes cheveux&nbsp;: la solution simple et sécurisée
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Vous souhaitez <strong>vendre vos cheveux naturels</strong> ? Natural Hair Market vous offre deux options : déposer une annonce gratuite sur notre marketplace ou soumettre une demande de rachat direct. Estimez le <strong>prix rachat cheveux naturels</strong> en quelques secondes, préparez-les selon nos consignes, et recevez votre paiement rapidement et en toute sécurité.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onStartSelling}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-sm text-base"
            >
              <Scissors className="w-5 h-5" />
              Vendre sur la marketplace
            </button>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 border-2 border-emerald-200 text-emerald-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-colors text-base"
            >
              <Send className="w-5 h-5" />
              Rachat direct de mes cheveux
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">

        {/* ===== SEO : H1 + Intro + Avantages + Témoignages + CTA ===== */}
        <section className="space-y-8">

          {/* H2 SEO principal */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              Vendre ses cheveux en ligne&nbsp;:<br className="hidden md:block" />
              <span className="text-emerald-600"> la marketplace de référence pour le prix rachat cheveux naturels</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Natural Hair Market est la première marketplace française spécialisée dans la <strong>vente de cheveux naturels</strong> en ligne. Que vous souhaitiez <strong>vendre vos cheveux naturels</strong> pour la première fois ou <strong>vendre ses cheveux</strong> régulièrement, notre plateforme met en relation vendeurs particuliers et acheteurs professionnels vérifiés partout en France. Publication d'annonce gratuite, paiement garanti, réponse sous 48h.
            </p>
          </div>

          {/* 3 avantages */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Zap className="w-7 h-7 text-amber-500" />,
                bg: 'bg-amber-50 border-amber-100',
                title: 'Paiement rapide',
                desc: 'Virement bancaire sous 5 jours ouvrables après réception et validation de vos cheveux.',
              },
              {
                icon: <Star className="w-7 h-7 text-emerald-600" />,
                bg: 'bg-emerald-50 border-emerald-100',
                title: '100% gratuit',
                desc: 'Aucun frais d\'inscription, aucune commission prélevée au vendeur. La publication est totalement gratuite.',
              },
              {
                icon: <Users className="w-7 h-7 text-blue-500" />,
                bg: 'bg-blue-50 border-blue-100',
                title: 'Acheteurs vérifiés',
                desc: 'Tous nos acheteurs sont identifiés et validés par notre équipe pour garantir des transactions sûres.',
              },
            ].map((item) => (
              <div key={item.title} className={`${item.bg} border rounded-2xl p-5 text-center`}>
                <div className="flex justify-center mb-3">{item.icon}</div>
                <p className="font-bold text-gray-900 mb-1">{item.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA principal */}
          <div className="text-center">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200 text-base"
            >
              <Scissors className="w-5 h-5" />
              Je vends mes cheveux maintenant
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-gray-400 mt-3">Gratuit · Sans engagement · Réponse sous 48h</p>
          </div>

          {/* 3 témoignages clients */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-5">Ils ont vendu leurs cheveux sur NaturalHairMarket</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  name: 'Camille R.',
                  city: 'Lyon',
                  amount: '152 €',
                  hair: 'Blonds naturels, 45 cm',
                  text: 'J\'ai reçu mon virement 4 jours après l\'envoi. Processus simple, équipe très réactive. Je recommande !',
                },
                {
                  name: 'Inès M.',
                  city: 'Paris',
                  amount: '88 €',
                  hair: 'Châtains, 40 cm',
                  text: 'Vendre ses cheveux n\'a jamais été aussi facile. Le formulaire prend 5 minutes et on est guidée à chaque étape.',
                },
                {
                  name: 'Sophie L.',
                  city: 'Bordeaux',
                  amount: '236 €',
                  hair: 'Roux naturels, 71 cm',
                  text: 'Je ne savais pas que mes cheveux roux valaient autant ! Super expérience, paiement rapide et sans accroc.',
                },
              ].map((t) => (
                <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.city} · {t.hair}</p>
                    </div>
                    <span className="text-base font-black text-emerald-600">{t.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* ===== SECTION SEO : Étapes + Critères + Processus paiement ===== */}
        <section className="space-y-8">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Comment vendre ses cheveux naturels en 3 étapes ?</h2>
            <p>
              <strong>Vendre ses cheveux en ligne</strong> n'a jamais été aussi simple grâce à Natural Hair Market. Notre plateforme propose deux façons de valoriser vos cheveux : déposer une annonce gratuite sur la marketplace pour fixer votre propre prix, ou soumettre une demande de <strong>rachat direct</strong> à notre équipe pour recevoir un paiement rapide et sans effort de vente.
            </p>

            <div className="grid md:grid-cols-3 gap-4 pt-2">
              {[
                {
                  num: '1',
                  title: 'Estimez votre prix',
                  text: 'Utilisez notre calculateur gratuit pour connaître le prix rachat cheveux naturels selon votre longueur, couleur et état. Les cheveux blonds, roux ou gris naturels atteignent les tarifs les plus élevés.',
                  color: 'bg-emerald-50 border-emerald-100',
                  numColor: 'bg-emerald-600',
                },
                {
                  num: '2',
                  title: 'Préparez votre mèche',
                  text: 'Lavez, séchez et tressez vos cheveux selon nos consignes obligatoires. La longueur minimale est de 15 cm. Des cheveux bien préparés garantissent un rachat accepté et un paiement plus rapide.',
                  color: 'bg-amber-50 border-amber-100',
                  numColor: 'bg-amber-500',
                },
                {
                  num: '3',
                  title: 'Recevez votre paiement',
                  text: 'Déposez une annonce sur la marketplace (paiement lors de la vente) ou soumettez une demande de rachat direct. Dans les deux cas, le virement est effectué sous 5 jours ouvrables après réception.',
                  color: 'bg-teal-50 border-teal-100',
                  numColor: 'bg-teal-600',
                },
              ].map((item) => (
                <div key={item.num} className={`border rounded-xl p-5 ${item.color}`}>
                  <div className={`w-8 h-8 ${item.numColor} text-white rounded-full font-bold text-sm flex items-center justify-center mb-3`}>{item.num}</div>
                  <h3 className="font-bold text-gray-800 mb-2 text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-2">Quels critères influencent le prix de vente de vos cheveux ?</h2>
            <p>
              Le <strong>prix rachat cheveux naturels</strong> dépend de plusieurs facteurs clés. La <strong>longueur</strong> est le premier critère : à partir de 15 cm pour les mèches colorées, les tarifs augmentent progressivement jusqu'à plus de 300 € pour des cheveux naturels de plus de 70 cm. La <strong>couleur</strong> est déterminante : les cheveux blonds, roux et gris naturels sont des "pépites" très recherchées et atteignent des prix deux à trois fois supérieurs aux châtains. Les cheveux <strong>naturels vierges</strong> (jamais colorés ni traités chimiquement) sont les plus valorisés. Les cheveux colorés ou décolorés sont également acceptés, mais leur valeur est réduite.
            </p>
            <p>
              La <strong>densité</strong> — mesurée en grammes — joue aussi un rôle important. Une mèche de 200 g vaut bien sûr davantage qu'une mèche de 80 g à longueur égale. Enfin, l'<strong>état général</strong> des cheveux (absence de fourches excessives, de cassures ou de porosité élevée) conditionne l'acceptation de votre demande de rachat.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-2">Processus de paiement sécurisé</h2>
            <p>
              Lorsque vous <strong>vendez ses cheveux</strong> via le rachat direct, votre paiement est effectué par virement bancaire dans les 5 jours ouvrables suivant la réception et la validation de votre mèche. Lorsque vous choisissez la marketplace pour <strong>vendre ses cheveux en ligne</strong>, le paiement est déclenché dès qu'un acheteur valide votre commande — les fonds sont sécurisés par Stripe et libérés après confirmation de réception par l'acheteur.
            </p>
            <p>
              Dans les deux cas, aucun frais n'est prélevé sur le montant versé au vendeur. Natural Hair Market ne perçoit aucune commission côté vendeur : vous encaissez 100 % du prix convenu. C'est l'une des raisons pour lesquelles notre plateforme est le premier choix pour <strong>vendre ses cheveux naturels</strong> en France.
            </p>
          </div>

        </section>

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
                  onChange={(e) => { setLength(e.target.value); setWeightGrams(''); }}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-emerald-500 focus:ring-0 outline-none text-sm bg-white"
                >
                  <option value="">-- Choisir une longueur --</option>
                  {availableLengths.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Choix 4 : Poids en grammes */}
            {rateStr && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  {condition === 'natural' ? '4.' : '3.'} Poids de vos cheveux (grammes)
                </p>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="2000"
                    step="1"
                    placeholder="Ex : 150"
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 text-gray-800 focus:border-emerald-500 focus:ring-0 outline-none text-sm bg-white"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">g</span>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Tarif applicable : <span className="font-semibold text-emerald-700">{rateStr}</span></p>
              </div>
            )}

            {/* Meches deja ajoutees */}
            {strands.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">
                  Meches ajoutees ({strands.length})
                </p>
                {strands.map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-emerald-800">Meche {i + 1} — {strandLabel(s)}</p>
                      <p className="text-xs text-emerald-600 mt-0.5">
                        {s.exactPrice != null
                          ? `${s.exactPrice.toFixed(2)} € (${s.weightGrams}g × ${s.rateStr})`
                          : `Tarif : ${s.rateStr}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStrand(s.id)}
                      className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {strands.length > 1 && (
                  <div className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3">
                    <p className="text-sm font-bold text-gray-300">Total estimatif ({strands.length} meches)</p>
                    <p className="text-xl font-black text-emerald-400">
                      {allStrandsHavePrice ? `${totalExactPrice.toFixed(2)} €` : 'Prix variables'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Resultat meche courante */}
            {rateStr && (
              <div className={`rounded-xl p-5 border-2 ${exactPrice != null ? 'bg-emerald-50 border-emerald-400' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-sm font-medium text-gray-600 mb-1 text-center">
                  {strands.length > 0 ? 'Cette meche' : 'Estimation de rachat'}
                </p>
                {exactPrice != null ? (
                  <div className="text-center">
                    <p className="text-4xl font-black text-emerald-700">{exactPrice.toFixed(2)} €</p>
                    <p className="text-xs text-emerald-600 mt-1">Pour {grams} g — base {rateStr}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-2xl font-black text-gray-400">{rateStr}</p>
                    <p className="text-xs text-gray-500 mt-1">Entrez le poids pour obtenir votre estimation precise.</p>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2 text-center">Prix final confirme apres pesee et verification a reception.</p>

                {/* Bouton Ajouter cette meche */}
                {canAddStrand && (
                  <button
                    type="button"
                    onClick={addStrand}
                    className="mt-4 w-full flex items-center justify-center gap-2 border-2 border-dashed border-emerald-500 hover:border-emerald-700 hover:bg-emerald-100 text-emerald-700 font-semibold py-2.5 rounded-xl transition-all text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    {strands.length === 0 ? 'Ajouter cette meche' : 'Ajouter une meche supplementaire'}
                  </button>
                )}

                {/* Bouton soumettre */}
                <button
                  onClick={scrollToForm}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
                >
                  <Send className="w-4 h-4" />
                  {strands.length > 0 ? `Soumettre ma demande (${strands.length} meche${strands.length > 1 ? 's' : ''})` : 'Transmettre ma demande de rachat'}
                </button>
              </div>
            )}
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

          {submitSuccess && submittedSummary ? (
            <div className="space-y-4" id="buyback-receipt">
              {/* Confirmation header */}
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-emerald-800 mb-1">Demande envoyee avec succes !</h3>
                <p className="text-emerald-700 text-sm">Notre equipe vous contactera sous <strong>48h ouvrables</strong>.</p>
              </div>

              {/* Recapitulatif imprimable */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-gray-800 px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-sm">Recapitulatif de votre demande</p>
                    <p className="text-gray-400 text-xs mt-0.5">Soumis le {submittedSummary.submittedAt}</p>
                  </div>
                  <Scissors className="w-5 h-5 text-emerald-400" />
                </div>

                <div className="p-5 space-y-4">
                  {/* Identite */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Vos coordonnees</p>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700"><User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />{submittedSummary.name}</div>
                      <div className="flex items-center gap-2 text-gray-700"><Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />{submittedSummary.email}</div>
                      <div className="flex items-center gap-2 text-gray-700"><Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />{submittedSummary.phone}</div>
                      {submittedSummary.address && <div className="flex items-start gap-2 text-gray-700"><MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />{submittedSummary.address}</div>}
                    </div>
                  </div>

                  <div className="border-t border-gray-100" />

                  {/* Meches */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                      {submittedSummary.strands.length > 1 ? `Meches (${submittedSummary.strands.length})` : 'Caracteristiques des cheveux'}
                    </p>
                    {submittedSummary.strands.length > 1 ? (
                      <div className="space-y-2">
                        {submittedSummary.strands.map((s, i) => (
                          <div key={s.id} className="bg-gray-50 rounded-xl px-3 py-2 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold text-gray-800">Meche {i + 1} — {strandLabel(s)}</p>
                              {s.weightGrams && <p className="text-xs text-gray-500">{s.weightGrams}g</p>}
                            </div>
                            <p className="text-sm font-bold text-emerald-700 flex-shrink-0">
                              {s.exactPrice != null ? `${s.exactPrice.toFixed(2)} €` : s.rateStr}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-3 gap-2">
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs text-gray-500 mb-0.5">Etat</p>
                          <p className="text-sm font-semibold text-gray-800">{submittedSummary.condition}</p>
                        </div>
                        {submittedSummary.color && (
                          <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-500 mb-0.5">Couleur</p>
                            <p className="text-sm font-semibold text-gray-800">{submittedSummary.color}</p>
                          </div>
                        )}
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs text-gray-500 mb-0.5">Longueur</p>
                          <p className="text-sm font-semibold text-gray-800">{submittedSummary.length}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-100" />

                  {/* Tarif */}
                  <div className="flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-3">
                    <p className="text-sm text-gray-700 font-medium">Tarif indicatif de rachat</p>
                    <p className="text-lg font-black text-emerald-700">{submittedSummary.price}</p>
                  </div>

                  {/* IBAN */}
                  {submittedSummary.iban && (
                    <>
                      <div className="border-t border-gray-100" />
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Coordonnees bancaires</p>
                        <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                          <p className="text-xs text-gray-500">Titulaire : <span className="font-semibold text-gray-700">{submittedSummary.holder}</span></p>
                          <p className="text-xs font-mono text-gray-700 break-all">{submittedSummary.iban}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Note */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <p className="text-xs text-amber-800 leading-relaxed">
                      <strong>Prochaine etape :</strong> Notre equipe examine votre demande et vous envoie une etiquette d'expedition prepayee sous 48h. Attendez notre confirmation avant d'envoyer vos cheveux.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  Imprimer ce recapitulatif
                </button>
                <button
                  onClick={() => { setSubmitSuccess(false); setSubmittedSummary(null); }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Faire une nouvelle demande
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Caracteristiques des cheveux – multi-meches */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-800">Meches a racheter</p>
                    {strands.length > 0 && (
                      <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        {strands.length} meche{strands.length > 1 ? 's' : ''} ajoutee{strands.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Meches ajoutees */}
                  {strands.length > 0 && (
                    <div className="space-y-2">
                      {strands.map((s, i) => (
                        <div key={s.id} className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-emerald-800">Meche {i + 1} — {strandLabel(s)}</p>
                            <p className="text-xs text-emerald-600 mt-0.5">
                              {s.exactPrice != null
                                ? `${s.exactPrice.toFixed(2)} € (${s.weightGrams}g × ${s.rateStr})`
                                : s.rateStr || ''}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeStrand(s.id)}
                            className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {/* Total */}
                      {strands.length > 1 && (
                        <div className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-2.5">
                          <p className="text-xs font-bold text-gray-300">Total estimatif</p>
                          <p className="text-base font-black text-emerald-400">
                            {allStrandsHavePrice ? `${totalExactPrice.toFixed(2)} €` : 'A determiner'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Formulaire d'ajout de meche */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-4">
                    <p className="text-xs font-bold text-emerald-800">
                      {strands.length === 0 ? 'Caracteristiques de votre meche' : 'Ajouter une autre meche'}
                    </p>

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
                          onChange={(e) => { setLength(e.target.value); setWeightGrams(''); }}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:border-emerald-500 outline-none text-sm bg-white"
                        >
                          <option value="">-- Choisir une longueur --</option>
                          {availableLengths.map((l) => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {rateStr && (
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Poids (grammes)</label>
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              max="2000"
                              step="1"
                              placeholder="Ex : 150"
                              value={weightGrams}
                              onChange={(e) => setWeightGrams(e.target.value)}
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:border-emerald-500 outline-none bg-white"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">g</span>
                          </div>
                        </div>
                        <div className={`rounded-xl p-2.5 flex items-center justify-between gap-3 border ${exactPrice != null ? 'bg-white border-emerald-300' : 'bg-white border-gray-200'}`}>
                          <p className="text-xs text-gray-600">{exactPrice != null ? `Estimation pour ${grams}g` : 'Tarif / 100g'}</p>
                          <p className={`text-sm font-black ${exactPrice != null ? 'text-emerald-700' : 'text-gray-500'}`}>
                            {exactPrice != null ? `${exactPrice.toFixed(2)} €` : rateStr}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Bouton Ajouter cette meche */}
                    {canAddStrand && (
                      <button
                        type="button"
                        onClick={addStrand}
                        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-emerald-400 hover:border-emerald-600 hover:bg-emerald-100 text-emerald-700 font-semibold py-2.5 rounded-xl transition-all text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        {strands.length === 0 ? 'Ajouter cette meche' : 'Ajouter une meche supplementaire'}
                      </button>
                    )}
                  </div>
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

                {/* Adresse d'expedition */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-bold text-blue-800">Adresse d'expedition</p>
                  </div>
                  <p className="text-xs text-blue-700">Necessaire pour la creation de l'etiquette d'envoi une fois votre demande acceptee.</p>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Adresse <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={form.address_line1}
                      onChange={(e) => setForm({ ...form, address_line1: e.target.value })}
                      placeholder="12 rue de la Paix"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Code postal <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={form.postal_code}
                        onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                        placeholder="75001"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Ville <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="Paris"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Coordonnees bancaires */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <p className="text-sm font-bold text-amber-800">Coordonnees bancaires pour le virement</p>
                  </div>
                  <p className="text-xs text-amber-700">Vos coordonnees sont securisees et accessibles uniquement par l'equipe NaturalHairMarket pour effectuer votre virement.</p>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Titulaire du compte <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={form.bank_holder_name}
                      onChange={(e) => setForm({ ...form, bank_holder_name: e.target.value })}
                      placeholder="Marie Dupont"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">IBAN <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={form.iban}
                      onChange={(e) => setForm({ ...form, iban: e.target.value.toUpperCase() })}
                      placeholder="FR76 3000 6000 0112 3456 7890 189"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none bg-white"
                    />
                  </div>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Questions fréquentes sur la vente de cheveux</h2>
          <p className="text-gray-500 mb-6 text-sm">Tout ce que vous devez savoir avant de vendre ses cheveux naturels en ligne.</p>
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
          <h2 className="text-2xl font-bold mb-3">Prêt(e) à vendre vos cheveux naturels ?</h2>
          <p className="text-emerald-100 mb-2 max-w-md mx-auto leading-relaxed text-sm">
            Choisissez votre mode de vente et commencez dès maintenant.
          </p>
          <p className="text-emerald-200 mb-6 max-w-lg mx-auto leading-relaxed text-xs">
            <strong>Marketplace :</strong> publiez gratuitement et fixez votre prix.&nbsp;
            <strong>Rachat direct :</strong> soumettez votre mèche, on s'occupe de tout.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onStartSelling}
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-semibold px-7 py-3 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm text-sm"
            >
              <Scissors className="w-4 h-4" />
              Vendre sur la marketplace
            </button>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"
            >
              <Send className="w-4 h-4" />
              Rachat direct de mes cheveux
            </button>
          </div>
          <p className="text-emerald-200 text-xs mt-4">
            Réponse sous 48h · Prix rachat cheveux naturels transparents · Paiement sécurisé
          </p>
        </section>

      </div>
    </div>
  );
}
