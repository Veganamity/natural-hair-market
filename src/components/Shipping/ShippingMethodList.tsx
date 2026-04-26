import { Check, MapPin, Home, Zap } from 'lucide-react';
import { SendcloudMethod, isRelayMethod } from './shippingUtils';

interface ShippingMethodListProps {
  methods: SendcloudMethod[];
  selectedMethodId: number | null;
  onSelect: (id: number) => void;
}

function getCarrierKey(carrier: string, name: string): string {
  const c = (carrier ?? '').toLowerCase().trim();
  const n = (name ?? '').toLowerCase();
  if (c === 'mondial_relay' || c.includes('mondial') || n.includes('mondial') || n.includes('shop2shop') || n.includes('locker')) return 'mondial_relay';
  if (c === 'chronopost' || c.includes('chrono') || n.includes('chronopost')) return 'chronopost';
  if (c === 'colissimo' || c.includes('colissimo') || c.includes('laposte') || c.includes('la poste') || n.includes('colissimo')) return 'colissimo';
  if (c === 'ups' || c.includes('ups') || n.includes(' ups ') || n.startsWith('ups')) return 'ups';
  if (c === 'dhl' || c.includes('dhl') || n.includes('dhl')) return 'dhl';
  if (c === 'gls' || c.includes('gls') || n.includes(' gls ') || n.startsWith('gls')) return 'gls';
  if (c === 'bpost' || c.includes('bpost') || n.includes('bpost')) return 'bpost';
  if (c === 'fedex' || c.includes('fedex') || n.includes('fedex')) return 'fedex';
  if (c === 'dpd' || c.includes('dpd') || n.includes('dpd')) return 'dpd';
  if (c === 'hermes' || c.includes('hermes') || c.includes('evri') || n.includes('hermes')) return 'hermes';
  return 'other';
}

function getCategory(method: SendcloudMethod): 'relay' | 'express' | 'home' {
  const n = (method.name ?? '').toLowerCase();
  if (isRelayMethod(method)) return 'relay';
  if (n.includes('express') || n.includes('urgent') || n.includes('same day') || n.includes('next day') || n.includes('lendemain')) return 'express';
  const c = (method.carrier ?? '').toLowerCase();
  if (c === 'chronopost' || c.includes('chrono')) return 'express';
  return 'home';
}

const CATEGORY_CONFIG = {
  relay: {
    label: 'Point relais',
    icon: <MapPin className="w-3.5 h-3.5" />,
    color: 'text-teal-600',
  },
  home: {
    label: 'Livraison a domicile',
    icon: <Home className="w-3.5 h-3.5" />,
    color: 'text-blue-600',
  },
  express: {
    label: 'Express',
    icon: <Zap className="w-3.5 h-3.5" />,
    color: 'text-orange-500',
  },
};

const CARRIER_ACCENT: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  mondial_relay: { border: 'border-teal-400',    bg: 'bg-teal-50',    text: 'text-teal-700',    dot: 'bg-teal-500' },
  chronopost:    { border: 'border-blue-400',     bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500' },
  colissimo:     { border: 'border-yellow-400',   bg: 'bg-yellow-50',  text: 'text-yellow-700',  dot: 'bg-yellow-500' },
  ups:           { border: 'border-amber-400',    bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  dhl:           { border: 'border-red-400',      bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500' },
  gls:           { border: 'border-orange-400',   bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500' },
  bpost:         { border: 'border-rose-400',     bg: 'bg-rose-50',    text: 'text-rose-700',    dot: 'bg-rose-500' },
  fedex:         { border: 'border-sky-400',      bg: 'bg-sky-50',     text: 'text-sky-700',     dot: 'bg-sky-500' },
  dpd:           { border: 'border-red-400',      bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500' },
  hermes:        { border: 'border-pink-400',     bg: 'bg-pink-50',    text: 'text-pink-700',    dot: 'bg-pink-500' },
  other:         { border: 'border-gray-300',     bg: 'bg-gray-50',    text: 'text-gray-700',    dot: 'bg-gray-400' },
};

function CarrierLogo({ carrierKey }: { carrierKey: string }) {
  switch (carrierKey) {
    case 'mondial_relay':
      return (
        <svg viewBox="0 0 80 28" className="h-6 w-auto max-w-[72px]" xmlns="http://www.w3.org/2000/svg">
          <rect width="80" height="28" rx="5" fill="#00B5AD"/>
          <text x="5" y="12" fontSize="9" fontWeight="800" fill="white" fontFamily="Arial, sans-serif">Mondial</text>
          <text x="5" y="23" fontSize="9" fontWeight="800" fill="white" fontFamily="Arial, sans-serif">Relay</text>
        </svg>
      );
    case 'chronopost':
      return (
        <svg viewBox="0 0 88 28" className="h-6 w-auto max-w-[80px]" xmlns="http://www.w3.org/2000/svg">
          <rect width="88" height="28" rx="5" fill="#003F8A"/>
          <text x="5" y="19" fontSize="11" fontWeight="800" fill="white" fontFamily="Arial, sans-serif">chronopost</text>
        </svg>
      );
    case 'colissimo':
      return (
        <svg viewBox="0 0 76 28" className="h-6 w-auto max-w-[70px]" xmlns="http://www.w3.org/2000/svg">
          <rect width="76" height="28" rx="5" fill="#FFD700"/>
          <text x="5" y="19" fontSize="11" fontWeight="800" fill="#222" fontFamily="Arial, sans-serif">Colissimo</text>
        </svg>
      );
    case 'ups':
      return (
        <svg viewBox="0 0 52 28" className="h-6 w-auto max-w-[48px]" xmlns="http://www.w3.org/2000/svg">
          <rect width="52" height="28" rx="5" fill="#FFB500"/>
          <text x="7" y="20" fontSize="14" fontWeight="900" fill="#351C15" fontFamily="Arial, sans-serif">UPS</text>
        </svg>
      );
    case 'dhl':
      return (
        <svg viewBox="0 0 52 28" className="h-6 w-auto max-w-[48px]" xmlns="http://www.w3.org/2000/svg">
          <rect width="52" height="28" rx="5" fill="#FFCC00"/>
          <text x="6" y="20" fontSize="14" fontWeight="900" fill="#D40511" fontFamily="Arial, sans-serif">DHL</text>
        </svg>
      );
    case 'gls':
      return (
        <svg viewBox="0 0 52 28" className="h-6 w-auto max-w-[48px]" xmlns="http://www.w3.org/2000/svg">
          <rect width="52" height="28" rx="5" fill="#F7A800"/>
          <text x="8" y="20" fontSize="14" fontWeight="900" fill="#003087" fontFamily="Arial, sans-serif">GLS</text>
        </svg>
      );
    case 'dpd':
      return (
        <svg viewBox="0 0 52 28" className="h-6 w-auto max-w-[48px]" xmlns="http://www.w3.org/2000/svg">
          <rect width="52" height="28" rx="5" fill="#DC0032"/>
          <text x="8" y="20" fontSize="14" fontWeight="900" fill="white" fontFamily="Arial, sans-serif">DPD</text>
        </svg>
      );
    case 'fedex':
      return (
        <svg viewBox="0 0 60 28" className="h-6 w-auto max-w-[56px]" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="28" rx="5" fill="#4D148C"/>
          <text x="4" y="20" fontSize="13" fontWeight="900" fill="#FF6200" fontFamily="Arial, sans-serif">Fe</text>
          <text x="22" y="20" fontSize="13" fontWeight="900" fill="white" fontFamily="Arial, sans-serif">dEx</text>
        </svg>
      );
    case 'bpost':
      return (
        <svg viewBox="0 0 60 28" className="h-6 w-auto max-w-[56px]" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="28" rx="5" fill="#E30613"/>
          <text x="6" y="20" fontSize="12" fontWeight="800" fill="white" fontFamily="Arial, sans-serif">bpost</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 56 28" className="h-6 w-auto max-w-[52px]" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="28" rx="5" fill="#6B7280"/>
          <text x="8" y="19" fontSize="11" fontWeight="700" fill="white" fontFamily="Arial, sans-serif">Envoi</text>
        </svg>
      );
  }
}

function cleanMethodName(name: string): string {
  return name
    .replace(/\d+(\.\d+)?\s*-\s*\d+(\.\d+)?\s*kg/gi, '')
    .replace(/0\s*-\s*\d+(\.\d+)?\s*kg/gi, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function ShippingMethodList({ methods, selectedMethodId, onSelect }: ShippingMethodListProps) {
  const grouped: Record<'relay' | 'home' | 'express', SendcloudMethod[]> = {
    relay: [],
    home: [],
    express: [],
  };

  for (const m of methods) {
    grouped[getCategory(m)].push(m);
  }

  const categoryOrder: Array<'relay' | 'home' | 'express'> = ['relay', 'home', 'express'];

  return (
    <div className="space-y-4">
      {categoryOrder.map((cat) => {
        const items = grouped[cat];
        if (items.length === 0) return null;
        const config = CATEGORY_CONFIG[cat];

        return (
          <div key={cat}>
            <div className={`flex items-center gap-1.5 mb-2 ${config.color}`}>
              {config.icon}
              <span className="text-[11px] font-bold uppercase tracking-wide">{config.label}</span>
            </div>
            <div className="space-y-1.5">
              {items.map((m) => {
                const isSelected = m.id === selectedMethodId;
                const ck = getCarrierKey(m.carrier, m.name);
                const accent = CARRIER_ACCENT[ck] ?? CARRIER_ACCENT.other;
                const label = cleanMethodName(m.name);

                return (
                  <button
                    key={m.id}
                    onClick={() => onSelect(m.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 border rounded-xl transition-all text-left ${
                      isSelected
                        ? `${accent.border} ${accent.bg} shadow-sm`
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-shrink-0 w-16 flex items-center justify-start">
                      <CarrierLogo carrierKey={ck} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${isSelected ? accent.text : 'text-gray-800'}`}>
                        {label}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {cat === 'relay' && 'Retrait en point relais'}
                        {cat === 'home' && 'Livree chez vous'}
                        {cat === 'express' && 'Livraison rapide'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-sm font-bold tabular-nums ${isSelected ? accent.text : 'text-gray-700'}`}>
                        {(m.price ?? 0) === 0 ? 'Gratuit' : `${(m.price ?? 0).toFixed(2).replace('.', ',')} €`}
                      </span>
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        isSelected
                          ? `${accent.dot} border-transparent`
                          : 'border-gray-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
