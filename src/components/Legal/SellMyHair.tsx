/**
 * Title SEO : Vendre mes cheveux - Prix, criteres & comment ca marche
 * Meta description : Vendez vos cheveux naturels ou colores sur NaturalHairMarket.
 * Prix libre, criteres clairs, transaction securisee. Decouvrez comment ca se passe.
 */

import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Ruler,
  Layers,
  Palette,
  AlertTriangle,
  DollarSign,
  Shield,
  ArrowRight,
  Scissors,
  Droplets,
  Wind,
  Package,
  CheckCircle,
  Sparkles,
  Plus,
  Trash2,
  Zap,
  Star,
  Users,
  Tag,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SellMyHairProps {
  onStartSelling?: () => void;
  onNavigate?: (view: string) => void;
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
const faqs_fr: { q: string; a: string }[] = [
  {
    q: "Combien puis-je gagner en vendant mes cheveux ?",
    a: "Le prix de vente de vos cheveux dépend principalement de la longueur et de la couleur. Pour des cheveux châtains naturels de 40 cm, comptez environ 56 € / 100 g. Pour des cheveux blonds ou roux de la même longueur, le tarif monte à 112 € / 100 g. Les mèches très longues (70 cm et plus) peuvent atteindre 200 à 300 € pour 100 g. Utilisez notre calculateur gratuit pour obtenir une estimation précise et fixer le prix de votre annonce.",
  },
  {
    q: "Quels types de cheveux sont acceptés pour vendre ses cheveux ?",
    a: "Natural Hair Market accepte tous types de cheveux humains : cheveux naturels vierges (jamais colorés), cheveux colorés, décolorés, méchés, traités au lissage ou à la kératine. Toutes les textures sont acceptées : raides, ondulés, bouclés, crépus. La longueur minimale est de 15 cm. Il est obligatoire de mentionner l'état exact et les traitements subis dans votre annonce.",
  },
  {
    q: "Comment se passe l'envoi de mes cheveux ?",
    a: "Une fois votre annonce publiée et un acheteur trouvé, vous expédiez directement à l'acheteur dès que la commande est validée. Vos cheveux doivent être soigneusement préparés (lavés, séchés, tressés en queue de cheval) et emballés dans un sac congélation fermé.",
  },
  {
    q: "Quelle est la longueur minimale pour vendre ses cheveux naturels ?",
    a: "La longueur minimale acceptée est de 15 cm mesurés du bas de l'élastique jusqu'aux pointes, après coupe. En dessous de cette longueur, les cheveux ne sont pas valorisables sur le marché des extensions et perruques. Plus les cheveux sont longs, plus leur valeur augmente significativement : un lot de 70 cm peut valoir 3 à 5 fois plus qu'un lot de 40 cm à poids équivalent.",
  },
  {
    q: "Comment vendre ses cheveux en ligne sur Natural Hair Market ?",
    a: "Créez votre compte gratuitement, publiez vos photos, utilisez notre calculateur de prix pour fixer un tarif juste, et attendez qu'un acheteur vous contacte. Vous encaissez 100 % du montant lors de la vente. La publication est totalement gratuite et sans commission côté vendeur.",
  },
];

const faqs_en: { q: string; a: string }[] = [
  {
    q: "How much can I earn by selling my hair?",
    a: "The selling price of your hair depends mainly on length and color. For natural chestnut hair of 40 cm, expect about 56 € / 100 g. For blond or red hair of the same length, the rate goes up to 112 € / 100 g. Very long strands (70 cm and above) can reach 200 to 300 € for 100 g. Use our free calculator to get an accurate estimate and set the price of your listing.",
  },
  {
    q: "What types of hair are accepted for selling hair?",
    a: "Natural Hair Market accepts all types of human hair: virgin natural hair (never colored), colored hair, bleached hair, highlighted hair, straightened or keratin-treated hair. All textures are accepted: straight, wavy, curly, kinky. The minimum length is 15 cm. It is mandatory to mention the exact condition and treatments in your listing.",
  },
  {
    q: "How does shipping my hair work?",
    a: "Once your listing is published and a buyer is found, you ship directly to the buyer as soon as the order is confirmed. Your hair must be carefully prepared (washed, dried, braided into a ponytail) and packed in a sealed freezer bag.",
  },
  {
    q: "What is the minimum length to sell natural hair?",
    a: "The minimum accepted length is 15 cm measured from the bottom of the elastic band to the tips, after cutting. Below this length, hair cannot be valued on the extensions and wigs market. The longer the hair, the more its value increases significantly: a 70 cm lot can be worth 3 to 5 times more than a 40 cm lot at equal weight.",
  },
  {
    q: "How to sell hair online on Natural Hair Market?",
    a: "Create your account for free, post your photos, use our price calculator to set a fair price, and wait for a buyer to contact you. You keep 100% of the amount at sale. Listing is completely free with no commission on the seller side.",
  },
];

const PREP_STEPS_FR = [
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

const PREP_STEPS_EN = [
  {
    icon: <Droplets className="w-6 h-6 text-blue-500" />,
    num: 1,
    title: 'Washing',
    desc: 'Wash the hair to clean and carefully disinfect it.',
    bg: 'bg-blue-50 border-blue-100',
  },
  {
    icon: <Wind className="w-6 h-6 text-amber-500" />,
    num: 2,
    title: 'Drying',
    desc: 'Dry completely with a hair dryer without straightening. Natural appearance required.',
    bg: 'bg-amber-50 border-amber-100',
  },
  {
    icon: <Layers className="w-6 h-6 text-emerald-600" />,
    num: 3,
    title: 'Preparation',
    desc: 'Separate and secure the hair into individual ponytails.',
    bg: 'bg-emerald-50 border-emerald-100',
  },
  {
    icon: <Ruler className="w-6 h-6 text-violet-500" />,
    num: 4,
    title: 'Measuring & cutting',
    desc: 'Measure to ensure the length is at least 15 cm, then cut.',
    bg: 'bg-violet-50 border-violet-100',
  },
  {
    icon: <Package className="w-6 h-6 text-rose-500" />,
    num: 5,
    title: 'Braiding & bagging',
    desc: 'Braid into a ponytail and place in a freezer-type bag with a seal.',
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

function strandLabel(s: Strand, language: 'fr' | 'en'): string {
  const condLabel = s.condition === 'natural'
    ? (language === 'fr' ? 'Naturels' : 'Natural')
    : (language === 'fr' ? 'Colores' : 'Colored');
  const colorLabel = s.colorType === 'chestnut'
    ? (language === 'fr' ? ' Chatain/Brun' : ' Chestnut/Brown')
    : s.colorType === 'blond_roux_gris'
      ? (language === 'fr' ? ' Blond/Roux' : ' Blond/Red')
      : '';
  return `${condLabel}${colorLabel} — ${s.length}`;
}

export function SellMyHair({ onStartSelling, onNavigate }: SellMyHairProps) {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = language === 'fr' ? faqs_fr : faqs_en;
  const PREP_STEPS = language === 'fr' ? PREP_STEPS_FR : PREP_STEPS_EN;

  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.getElementById('meta-description') as HTMLMetaElement | null;
    const prevDesc = metaDesc?.content ?? '';

    document.title = language === 'fr'
      ? 'Vendre mes cheveux - Obtenez le meilleur prix | Natural Hair Market'
      : 'Sell My Hair - Get the Best Price | Natural Hair Market';
    if (metaDesc) {
      metaDesc.content = language === 'fr'
        ? 'Vendez vos cheveux naturels facilement sur Natural Hair Market. Estimation gratuite, publication gratuite, acheteurs verifies. Decouvrez comment vendre vos cheveux en 3 etapes simples.'
        : 'Sell your natural hair easily on Natural Hair Market. Free estimate, free listing, verified buyers. Discover how to sell your hair in 3 simple steps.';
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.content = prevDesc;
    };
  }, [language]);

  // --- Calculateur ---
  const [condition, setCondition] = useState<Condition | ''>('');
  const [colorType, setColorType] = useState<ColorType | ''>('');
  const [length, setLength] = useState('');
  const [weightGrams, setWeightGrams] = useState('');
  const [strands, setStrands] = useState<Strand[]>([]);

  const availableLengths = ALL_LENGTHS;
  const rateStr = condition ? getPrice(condition as Condition, colorType, length) : '';
  const ratePerHundred = rateStr ? parseFloat(rateStr) : null;
  const grams = parseFloat(weightGrams);
  const exactPrice = ratePerHundred != null && !isNaN(grams) && grams > 0
    ? Math.round(ratePerHundred * grams / 100 * 100) / 100
    : null;

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

  const calculatorRef = useRef<HTMLDivElement>(null);

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 text-emerald-700 text-sm font-medium mb-5">
            <Scissors className="w-4 h-4" />
            {language === 'fr' ? 'Vente de cheveux humains' : 'Human hair sales'}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {language === 'fr' ? 'Vendre mes cheveux&nbsp;: la solution simple et sécurisée' : 'Sell my hair: the simple and secure solution'}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            {language === 'fr' ? (
              <>Vous souhaitez <strong>vendre vos cheveux naturels</strong> ? Estimez leur valeur en quelques secondes grâce à notre calculateur, puis déposez votre annonce gratuitement sur Natural Hair Market. Fixez votre propre prix et recevez votre paiement en toute sécurité.</>
            ) : (
              <>Want to <strong>sell your natural hair</strong>? Estimate its value in seconds with our calculator, then post your listing for free on Natural Hair Market. Set your own price and receive your payment securely.</>
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onStartSelling}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-sm text-base"
            >
              <Scissors className="w-5 h-5" />
              {language === 'fr' ? 'Déposer mon annonce' : 'Post my listing'}
            </button>
            <button
              onClick={scrollToCalculator}
              className="inline-flex items-center gap-2 border-2 border-emerald-200 text-emerald-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-colors text-base"
            >
              <DollarSign className="w-5 h-5" />
              {language === 'fr' ? 'Estimer le prix de mes cheveux' : 'Estimate the price of my hair'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            <button
              onClick={() => onNavigate?.('landing')}
              className="text-emerald-600 hover:underline text-xs"
            >
              {language === "fr" ? "← Retour à l'accueil" : '← Back to home'}
            </button>
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">

        {/* SEO intro */}
        <section className="space-y-8">

          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              {language === 'fr' ? (
                <>Vendre ses cheveux en ligne&nbsp;:<br className="hidden md:block" />
                <span className="text-emerald-600"> la marketplace de référence pour le prix rachat cheveux naturels</span></>
              ) : (
                <>Selling hair online:<br className="hidden md:block" />
                <span className="text-emerald-600"> the leading marketplace for natural hair buyback prices</span></>
              )}
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {language === 'fr' ? (
                <>Natural Hair Market est la première marketplace française spécialisée dans la <strong>vente de cheveux naturels</strong> en ligne. Que vous souhaitiez <strong>vendre vos cheveux naturels</strong> pour la première fois ou <strong>vendre ses cheveux</strong> régulièrement, notre plateforme met en relation vendeurs particuliers et acheteurs professionnels vérifiés partout en France. Publication d'annonce gratuite, paiement garanti, réponse sous 48h.</>
              ) : (
                <>Natural Hair Market is the first French marketplace specialized in <strong>selling natural hair</strong> online. Whether you want to <strong>sell your natural hair</strong> for the first time or sell hair regularly, our platform connects individual sellers with verified professional buyers throughout France. Free listing, guaranteed payment, response within 48h.</>
              )}
            </p>
          </div>

          {/* 3 avantages */}
          <div className="grid sm:grid-cols-3 gap-4">
            {(language === 'fr'
              ? [
                  {
                    icon: <Zap className="w-7 h-7 text-amber-500" />,
                    bg: 'bg-amber-50 border-amber-100',
                    title: 'Paiement rapide',
                    desc: 'Virement bancaire sous 5 jours ouvrables après réception et validation de vos cheveux par l\'acheteur.',
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
                ]
              : [
                  {
                    icon: <Zap className="w-7 h-7 text-amber-500" />,
                    bg: 'bg-amber-50 border-amber-100',
                    title: 'Fast payment',
                    desc: 'Bank transfer within 5 business days after receipt and validation of your hair by the buyer.',
                  },
                  {
                    icon: <Star className="w-7 h-7 text-emerald-600" />,
                    bg: 'bg-emerald-50 border-emerald-100',
                    title: '100% free',
                    desc: 'No registration fees, no commission charged to the seller. Listing is completely free.',
                  },
                  {
                    icon: <Users className="w-7 h-7 text-blue-500" />,
                    bg: 'bg-blue-50 border-blue-100',
                    title: 'Verified buyers',
                    desc: 'All our buyers are identified and validated by our team to guarantee safe transactions.',
                  },
                ]
            ).map((item) => (
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
              onClick={onStartSelling}
              className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200 text-base"
            >
              <Scissors className="w-5 h-5" />
              {language === 'fr' ? 'Je dépose mon annonce maintenant' : 'I post my listing now'}
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-gray-400 mt-3">
              {language === 'fr' ? 'Gratuit · Sans engagement · Acheteurs vérifiés' : 'Free · No commitment · Verified buyers'}
            </p>
          </div>

          {/* Témoignages */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-5">
              {language === 'fr' ? 'Ils ont vendu leurs cheveux sur NaturalHairMarket' : 'They sold their hair on NaturalHairMarket'}
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {(language === 'fr'
                ? [
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
                  ]
                : [
                    {
                      name: 'Camille R.',
                      city: 'Lyon',
                      amount: '152 €',
                      hair: 'Natural blonde, 45 cm',
                      text: 'I received my transfer 4 days after shipping. Simple process, very responsive team. I recommend it!',
                    },
                    {
                      name: 'Inès M.',
                      city: 'Paris',
                      amount: '88 €',
                      hair: 'Chestnut, 40 cm',
                      text: 'Selling hair has never been so easy. The form takes 5 minutes and you\'re guided at every step.',
                    },
                    {
                      name: 'Sophie L.',
                      city: 'Bordeaux',
                      amount: '236 €',
                      hair: 'Natural red, 71 cm',
                      text: 'I didn\'t know my red hair was worth so much! Great experience, fast payment and no hiccups.',
                    },
                  ]
              ).map((t) => (
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

        {/* SEO contenu */}
        <section className="space-y-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {language === 'fr' ? 'Comment vendre ses cheveux naturels en 3 étapes ?' : 'How to sell your natural hair in 3 steps?'}
            </h2>
            <p>
              {language === 'fr' ? (
                <><strong>Vendre ses cheveux en ligne</strong> n'a jamais été aussi simple grâce à Natural Hair Market. Déposez une annonce gratuite sur la marketplace pour fixer votre propre prix et atteindre des milliers d'acheteurs vérifiés en France et en Europe.</>
              ) : (
                <><strong>Selling hair online</strong> has never been easier thanks to Natural Hair Market. Post a free listing on the marketplace to set your own price and reach thousands of verified buyers in France and Europe.</>
              )}
            </p>

            <div className="grid md:grid-cols-3 gap-4 pt-2">
              {(language === 'fr'
                ? [
                    {
                      num: '1',
                      title: 'Estimez votre prix',
                      text: 'Utilisez notre calculateur gratuit pour connaître le prix marché de vos cheveux selon votre longueur, couleur et état. Ce prix sert de base pour fixer le tarif de votre annonce.',
                      color: 'bg-emerald-50 border-emerald-100',
                      numColor: 'bg-emerald-600',
                    },
                    {
                      num: '2',
                      title: 'Préparez votre mèche',
                      text: 'Lavez, séchez et tressez vos cheveux selon nos consignes. La longueur minimale est de 15 cm. Des cheveux bien préparés garantissent une vente réussie et un paiement plus rapide.',
                      color: 'bg-amber-50 border-amber-100',
                      numColor: 'bg-amber-500',
                    },
                    {
                      num: '3',
                      title: 'Publiez et encaissez',
                      text: 'Créez votre annonce gratuite, ajoutez vos photos et fixez votre prix. Dès qu\'un acheteur valide sa commande, le paiement est sécurisé par Stripe et libéré à la réception.',
                      color: 'bg-teal-50 border-teal-100',
                      numColor: 'bg-teal-600',
                    },
                  ]
                : [
                    {
                      num: '1',
                      title: 'Estimate your price',
                      text: 'Use our free calculator to find the market price of your hair based on your length, color and condition. This price serves as a basis for setting your listing price.',
                      color: 'bg-emerald-50 border-emerald-100',
                      numColor: 'bg-emerald-600',
                    },
                    {
                      num: '2',
                      title: 'Prepare your strand',
                      text: 'Wash, dry and braid your hair according to our instructions. The minimum length is 15 cm. Well-prepared hair ensures a successful sale and faster payment.',
                      color: 'bg-amber-50 border-amber-100',
                      numColor: 'bg-amber-500',
                    },
                    {
                      num: '3',
                      title: 'Publish and get paid',
                      text: 'Create your free listing, add your photos and set your price. As soon as a buyer confirms their order, payment is secured by Stripe and released upon receipt.',
                      color: 'bg-teal-50 border-teal-100',
                      numColor: 'bg-teal-600',
                    },
                  ]
              ).map((item) => (
                <div key={item.num} className={`border rounded-xl p-5 ${item.color}`}>
                  <div className={`w-8 h-8 ${item.numColor} text-white rounded-full font-bold text-sm flex items-center justify-center mb-3`}>{item.num}</div>
                  <h3 className="font-bold text-gray-800 mb-2 text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-2">
              {language === 'fr' ? 'Quels critères influencent le prix de vente de vos cheveux ?' : 'What criteria influence the selling price of your hair?'}
            </h2>
            <p>
              {language === 'fr' ? (
                <>Le <strong>prix rachat cheveux naturels</strong> dépend de plusieurs facteurs clés. La <strong>longueur</strong> est le premier critère : à partir de 15 cm pour les mèches colorées, les tarifs augmentent progressivement jusqu'à plus de 300 € pour des cheveux naturels de plus de 70 cm. La <strong>couleur</strong> est déterminante : les cheveux blonds, roux et gris naturels sont des "pépites" très recherchées et atteignent des prix deux à trois fois supérieurs aux châtains. Les cheveux <strong>naturels vierges</strong> (jamais colorés ni traités chimiquement) sont les plus valorisés.</>
              ) : (
                <>The <strong>natural hair buyback price</strong> depends on several key factors. <strong>Length</strong> is the first criterion: starting from 15 cm for colored strands, rates increase gradually to over 300 € for natural hair longer than 70 cm. <strong>Color</strong> is decisive: natural blond, red and gray hair are rare "gems" that fetch prices two to three times higher than chestnut. <strong>Virgin natural</strong> hair (never colored or chemically treated) is the most highly valued.</>
              )}
            </p>
            <p>
              {language === 'fr' ? (
                <>La <strong>densité</strong> — mesurée en grammes — joue aussi un rôle important. Une mèche de 200 g vaut bien sûr davantage qu'une mèche de 80 g à longueur égale. Enfin, l'<strong>état général</strong> des cheveux (absence de fourches excessives, de cassures ou de porosité élevée) influence le prix que les acheteurs sont prêts à payer.</>
              ) : (
                <>The <strong>density</strong> — measured in grams — also plays an important role. A 200 g strand is of course worth more than an 80 g strand at equal length. Finally, the <strong>general condition</strong> of the hair (absence of excessive split ends, breakage or high porosity) influences the price buyers are willing to pay.</>
              )}
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-2">
              {language === 'fr' ? 'Processus de paiement sécurisé' : 'Secure payment process'}
            </h2>
            <p>
              {language === 'fr' ? (
                <>Lorsque vous <strong>vendez vos cheveux</strong> sur la marketplace, le paiement est déclenché dès qu'un acheteur valide votre commande — les fonds sont sécurisés par Stripe et libérés après confirmation de réception par l'acheteur. Aucun frais n'est prélevé sur le montant versé au vendeur. Natural Hair Market ne perçoit aucune commission côté vendeur : vous encaissez 100 % du prix convenu.</>
              ) : (
                <>When you <strong>sell your hair</strong> on the marketplace, payment is triggered as soon as a buyer confirms your order — funds are secured by Stripe and released after the buyer confirms receipt. No fees are deducted from the amount paid to the seller. Natural Hair Market takes no commission on the seller side: you receive 100% of the agreed price.</>
              )}
            </p>
          </div>
        </section>

        {/* ===== SECTION A : Calculateur de prix ===== */}
        <section ref={calculatorRef}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">A</div>
            <h2 className="text-2xl font-bold text-gray-900">
              {language === 'fr' ? 'Calculateur de prix – Estimez la valeur de vos cheveux' : 'Price Calculator – Estimate the value of your hair'}
            </h2>
          </div>
          <p className="text-gray-500 mb-6 text-sm ml-11">
            {language === 'fr'
              ? <>Ce calculateur est <strong>indicatif</strong> : il vous aide à fixer le bon prix sur votre annonce selon le marché actuel.</>
              : <>This calculator is <strong>indicative</strong>: it helps you set the right price for your listing based on the current market.</>}
          </p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

            {/* Etat */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                {language === 'fr' ? '1. Etat des cheveux' : '1. Hair condition'}
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {(language === 'fr'
                  ? [
                      { value: 'natural', label: 'Naturels (Vierges)', desc: 'Jamais colores ni traites chimiquement', emoji: '🌿' },
                      { value: 'colored', label: 'Colores / Meches', desc: 'Coloration, decoloration ou meches', emoji: '🎨' },
                    ]
                  : [
                      { value: 'natural', label: 'Natural (Virgin)', desc: 'Never colored or chemically treated', emoji: '🌿' },
                      { value: 'colored', label: 'Colored / Highlighted', desc: 'Coloring, bleaching or highlights', emoji: '🎨' },
                    ]
                ).map((opt) => (
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

            {/* Couleur */}
            {condition === 'natural' && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  {language === 'fr' ? '2. Couleur naturelle' : '2. Natural color'}
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {(language === 'fr'
                    ? [
                        { value: 'chestnut', label: 'Chatain / Brun', desc: 'Teintes brunes et chatain fonce', color: 'bg-amber-800' },
                        { value: 'blond_roux_gris', label: 'Blond / Roux / Gris', desc: 'Pepites rares tres recherchees', color: 'bg-yellow-300' },
                      ]
                    : [
                        { value: 'chestnut', label: 'Chestnut / Brown', desc: 'Brown and dark chestnut shades', color: 'bg-amber-800' },
                        { value: 'blond_roux_gris', label: 'Blond / Red / Gray', desc: 'Rare gems highly sought after', color: 'bg-yellow-300' },
                      ]
                  ).map((opt) => (
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

            {/* Longueur */}
            {(condition === 'colored' || (condition === 'natural' && colorType)) && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  {condition === 'natural' ? '3.' : '2.'} {language === 'fr' ? 'Longueur des cheveux' : 'Hair length'}
                </p>
                <select
                  value={length}
                  onChange={(e) => { setLength(e.target.value); setWeightGrams(''); }}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-emerald-500 focus:ring-0 outline-none text-sm bg-white"
                >
                  <option value="">{language === 'fr' ? '-- Choisir une longueur --' : '-- Choose a length --'}</option>
                  {availableLengths.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Poids */}
            {rateStr && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  {condition === 'natural' ? '4.' : '3.'} {language === 'fr' ? 'Poids de vos cheveux (grammes)' : 'Weight of your hair (grams)'}
                </p>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="2000"
                    step="1"
                    placeholder={language === 'fr' ? 'Ex : 150' : 'e.g. 150'}
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 text-gray-800 focus:border-emerald-500 focus:ring-0 outline-none text-sm bg-white"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">g</span>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  {language === 'fr' ? 'Tarif marche : ' : 'Market rate: '}
                  <span className="font-semibold text-emerald-700">{rateStr}</span>
                </p>
              </div>
            )}

            {/* Meches deja ajoutees */}
            {strands.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">
                  {language === 'fr' ? `Meches (${strands.length})` : `Strands (${strands.length})`}
                </p>
                {strands.map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-emerald-800">
                        {language === 'fr' ? `Meche ${i + 1}` : `Strand ${i + 1}`} — {strandLabel(s, language)}
                      </p>
                      <p className="text-xs text-emerald-600 mt-0.5">
                        {s.exactPrice != null
                          ? `${s.exactPrice.toFixed(2)} € (${s.weightGrams}g × ${s.rateStr})`
                          : (language === 'fr' ? `Tarif : ${s.rateStr}` : `Rate: ${s.rateStr}`)}
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
                    <p className="text-sm font-bold text-gray-300">
                      {language === 'fr' ? `Total estimatif (${strands.length} meches)` : `Estimated total (${strands.length} strands)`}
                    </p>
                    <p className="text-xl font-black text-emerald-400">
                      {allStrandsHavePrice ? `${totalExactPrice.toFixed(2)} €` : (language === 'fr' ? 'Prix variables' : 'Variable prices')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Résultat */}
            {rateStr && (
              <div className={`rounded-xl p-5 border-2 ${exactPrice != null ? 'bg-emerald-50 border-emerald-400' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-sm font-medium text-gray-600 mb-1 text-center">
                  {strands.length > 0
                    ? (language === 'fr' ? 'Cette meche' : 'This strand')
                    : (language === 'fr' ? 'Prix indicatif du marche' : 'Indicative market price')}
                </p>
                {exactPrice != null ? (
                  <div className="text-center">
                    <p className="text-4xl font-black text-emerald-700">{exactPrice.toFixed(2)} €</p>
                    <p className="text-xs text-emerald-600 mt-1">
                      {language === 'fr' ? `Pour ${grams} g — base ${rateStr}` : `For ${grams} g — based on ${rateStr}`}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-2xl font-black text-gray-400">{rateStr}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'fr' ? 'Entrez le poids pour obtenir votre estimation precise.' : 'Enter the weight to get your precise estimate.'}
                    </p>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2 text-center">
                  {language === 'fr' ? 'Utilisez ce tarif comme reference pour fixer le prix de votre annonce.' : 'Use this rate as a reference to set the price of your listing.'}
                </p>

                {/* Ajouter une meche */}
                {canAddStrand && (
                  <button
                    type="button"
                    onClick={addStrand}
                    className="mt-4 w-full flex items-center justify-center gap-2 border-2 border-dashed border-emerald-500 hover:border-emerald-700 hover:bg-emerald-100 text-emerald-700 font-semibold py-2.5 rounded-xl transition-all text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    {strands.length === 0
                      ? (language === 'fr' ? 'Ajouter cette meche' : 'Add this strand')
                      : (language === 'fr' ? 'Ajouter une meche supplementaire' : 'Add another strand')}
                  </button>
                )}

                {/* CTA déposer une annonce */}
                <button
                  onClick={onStartSelling}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                >
                  <Tag className="w-4 h-4" />
                  {exactPrice != null
                    ? (language === 'fr' ? `Déposer mon annonce — prix suggéré ${exactPrice.toFixed(2)} €` : `Post my listing — suggested price ${exactPrice.toFixed(2)} €`)
                    : (language === 'fr' ? 'Déposer mon annonce sur la marketplace' : 'Post my listing on the marketplace')}
                </button>
              </div>
            )}

            {/* CTA si rien de sélectionné */}
            {!rateStr && (
              <div className="text-center pt-2">
                <p className="text-xs text-gray-400 mb-3">
                  {language === 'fr' ? 'Ou déposez votre annonce directement sans estimer le prix' : 'Or post your listing directly without estimating the price'}
                </p>
                <button
                  onClick={onStartSelling}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                >
                  <Scissors className="w-4 h-4" />
                  {language === 'fr' ? 'Déposer mon annonce' : 'Post my listing'}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ===== SECTION B : Consignes ===== */}
        <section>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">B</div>
            <h2 className="text-2xl font-bold text-gray-900">
              {language === 'fr' ? 'Consignes de preparation obligatoires' : 'Mandatory preparation guidelines'}
            </h2>
          </div>
          <p className="text-gray-500 mb-6 text-sm ml-11">
            {language === 'fr'
              ? 'Ces 5 etapes sont indispensables pour garantir la qualite de votre lot et rassurer les acheteurs.'
              : 'These 5 steps are essential to guarantee the quality of your lot and reassure buyers.'}
          </p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
            <img
              src="/398249a7-e404-4b31-8512-bf2eac66a382.png"
              alt={language === 'fr'
                ? 'Le processus de collecte de cheveux en 5 etapes'
                : 'The hair collection process in 5 steps'}
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
              {language === 'fr'
                ? <><strong>Longueur minimale : 15 cm.</strong> Pas de lissage, juste seche au seche-cheveux. Les cheveux doivent correspondre fidelement aux photos de votre annonce.</>
                : <><strong>Minimum length: 15 cm.</strong> No straightening, just blow-dry. The hair must faithfully match the photos in your listing.</>}
            </p>
          </div>
        </section>

        {/* ===== SECTION C : Comment ça marche sur la marketplace ===== */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'fr' ? 'Comment fonctionne la marketplace ?' : 'How does the marketplace work?'}
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            {language === 'fr' ? 'De la creation de votre annonce au paiement, voici les etapes.' : 'From creating your listing to payment, here are the steps.'}
          </p>
          <div className="space-y-4">
            {(language === 'fr'
              ? [
                  { num: 1, title: "Creez votre compte gratuitement", body: "Inscrivez-vous en 2 minutes sur Natural Hair Market. Votre profil vendeur est immediatement actif.", icon: <Sparkles className="w-5 h-5 text-emerald-600" /> },
                  { num: 2, title: "Publiez votre annonce", body: "Ajoutez vos photos, utilisez notre calculateur pour fixer le bon prix, et decrivez l'etat de vos cheveux. La publication est totalement gratuite.", icon: <Tag className="w-5 h-5 text-emerald-600" /> },
                  { num: 3, title: "Un acheteur valide votre commande", body: "Notre equipe valide les acheteurs. Des qu'un acheteur paie, vous recevez une notification et les instructions d'expedition.", icon: <CheckCircle className="w-5 h-5 text-emerald-600" /> },
                  { num: 4, title: "Verification et paiement", body: "A reception, l'acheteur confirme la conformite. Le paiement est effectue par virement dans les 5 jours ouvrables. Vous encaissez 100% du prix.", icon: <Shield className="w-5 h-5 text-emerald-600" /> },
                ]
              : [
                  { num: 1, title: "Create your account for free", body: "Sign up in 2 minutes on Natural Hair Market. Your seller profile is immediately active.", icon: <Sparkles className="w-5 h-5 text-emerald-600" /> },
                  { num: 2, title: "Publish your listing", body: "Add your photos, use our calculator to set the right price, and describe the condition of your hair. Listing is completely free.", icon: <Tag className="w-5 h-5 text-emerald-600" /> },
                  { num: 3, title: "A buyer confirms your order", body: "Our team validates buyers. As soon as a buyer pays, you receive a notification and shipping instructions.", icon: <CheckCircle className="w-5 h-5 text-emerald-600" /> },
                  { num: 4, title: "Verification and payment", body: "Upon receipt, the buyer confirms compliance. Payment is made by bank transfer within 5 business days. You keep 100% of the price.", icon: <Shield className="w-5 h-5 text-emerald-600" /> },
                ]
            ).map((step) => (
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

        {/* Prix & critères */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'fr' ? 'Prix &amp; criteres de valorisation' : 'Pricing &amp; valuation criteria'}
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            {language === 'fr' ? 'Ces elements influencent directement la valeur percue de votre lot par les acheteurs.' : 'These elements directly influence the perceived value of your lot by buyers.'}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3"><Ruler className="w-5 h-5 text-emerald-600" /><h3 className="font-semibold text-gray-800">{language === 'fr' ? 'Longueur' : 'Length'}</h3></div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {language === 'fr'
                  ? <>Mesuree en centimetres du cuir chevelu jusqu'aux pointes. Longueur minimale : <strong>15 cm</strong>. Plus les cheveux sont longs, plus leur valeur est elevee.</>
                  : <>Measured in centimeters from the scalp to the tips. Minimum length: <strong>15 cm</strong>. The longer the hair, the higher its value.</>}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3"><Layers className="w-5 h-5 text-emerald-600" /><h3 className="font-semibold text-gray-800">{language === 'fr' ? 'Densite' : 'Density'}</h3></div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {language === 'fr'
                  ? <>Evaluez la densite de votre chevelure : <strong>faible</strong> (queue fine), <strong>moyenne</strong> (queue normale) ou <strong>forte</strong> (queue tres epaisse). Le poids en grammes est un indicateur objectif apprecie.</>
                  : <>Assess the density of your hair: <strong>low</strong> (thin ponytail), <strong>medium</strong> (normal ponytail) or <strong>high</strong> (very thick ponytail). Weight in grams is an appreciated objective indicator.</>}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5 text-amber-500" /><h3 className="font-semibold text-gray-800">{language === 'fr' ? 'Etat' : 'Condition'}</h3></div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {language === 'fr'
                  ? <>Des cheveux en bon etat, propres et sans fourches excessives se vendront plus cher. Signalez toujours la secheresse, les cassures ou la porosite excessive dans votre annonce.</>
                  : <>Hair in good condition, clean and without excessive split ends will sell for more. Always report dryness, breakage or excessive porosity in your listing.</>}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3"><Palette className="w-5 h-5 text-emerald-600" /><h3 className="font-semibold text-gray-800">{language === 'fr' ? 'Couleur' : 'Color'}</h3></div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {language === 'fr'
                  ? <>Les cheveux <strong>blonds, roux ou gris naturels</strong> sont les plus recherches (pepites). Les chatains/bruns sont courants. Les colores/meches ont une valeur reduite.</>
                  : <>Natural <strong>blond, red or gray hair</strong> is the most sought after (rare gems). Chestnut/brown is common. Colored/highlighted hair has a reduced value.</>}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'fr' ? 'Questions fréquentes sur la vente de cheveux' : 'Frequently asked questions about selling hair'}
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            {language === 'fr' ? (
              <>Tout ce que vous devez savoir avant de vendre ses cheveux naturels en ligne. Vous pouvez aussi{' '}
              <button
                onClick={() => onNavigate?.('faq')}
                className="text-emerald-600 hover:underline font-semibold"
              >
                consultez notre FAQ
              </button>
              {' '}générale.</>
            ) : (
              <>Everything you need to know before selling natural hair online. You can also{' '}
              <button
                onClick={() => onNavigate?.('faq')}
                className="text-emerald-600 hover:underline font-semibold"
              >
                check our general FAQ
              </button>
              .</>
            )}
          </p>
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

        {/* CTA final */}
        <section className="bg-emerald-600 rounded-2xl p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4">
            <Scissors className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">
            {language === 'fr' ? 'Prêt(e) à vendre vos cheveux naturels ?' : 'Ready to sell your natural hair?'}
          </h2>
          <p className="text-emerald-100 mb-6 max-w-md mx-auto leading-relaxed text-sm">
            {language === 'fr'
              ? "Créez votre compte gratuitement, publiez votre annonce en quelques minutes et rejoignez des milliers de vendeurs sur Natural Hair Market."
              : "Create your account for free, post your listing in minutes and join thousands of sellers on Natural Hair Market."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onStartSelling}
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-semibold px-7 py-3 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm text-sm"
            >
              <Scissors className="w-4 h-4" />
              {language === 'fr' ? 'Déposer mon annonce gratuitement' : 'Post my listing for free'}
            </button>
            <button
              onClick={scrollToCalculator}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"
            >
              <DollarSign className="w-4 h-4" />
              {language === 'fr' ? 'Estimer le prix de mes cheveux' : 'Estimate the price of my hair'}
            </button>
          </div>
          <p className="text-emerald-200 text-xs mt-4">
            {language === 'fr'
              ? 'Publication gratuite · Prix rachat cheveux naturels transparents · Paiement sécurisé'
              : 'Free listing · Transparent natural hair buyback prices · Secure payment'}
          </p>
          <p className="text-emerald-200 text-xs mt-2">
            {language === 'fr' ? 'Des questions ?' : 'Questions?'}{' '}
            <a href="mailto:naturalhairmarket@gmail.com" className="underline hover:text-white">
              {language === 'fr' ? 'Contactez-nous' : 'Contact us'}
            </a>
            {language === 'fr' ? ' — notre équipe répond sous 24h.' : ' — our team responds within 24h.'}
          </p>
        </section>

      </div>
    </div>
  );
}
