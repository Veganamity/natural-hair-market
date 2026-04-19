import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2, X, Check } from 'lucide-react';

export interface ServicePoint {
  id: number;
  name: string;
  street: string;
  house_number: string;
  city: string;
  postal_code: string;
  country: string;
  carrier: string;
  latitude: number;
  longitude: number;
  formatted_opening_times?: Record<string, string[]>;
  distance?: number;
}

interface SendcloudServicePointWidgetProps {
  postalCode: string;
  country: string;
  carriers: string;
  language?: string;
  onSelect: (point: ServicePoint) => void;
  selectedPoint?: ServicePoint | null;
}

declare global {
  interface Window {
    sendcloud?: {
      servicePoints: {
        open: (
          apiKey: string,
          country: string,
          postalCode: string,
          carriers: string,
          language: string,
          callback: (servicePoint: ServicePoint) => void,
          options?: Record<string, unknown>
        ) => void;
      };
    };
  }
}

const SCRIPT_ID = 'sendcloud-service-point-widget';
const SCRIPT_SRC = 'https://embed.sendcloud.sc/spp/1.0.0/api.min.js';

function loadSendcloudScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(SCRIPT_ID)) {
      if (window.sendcloud) {
        resolve();
      } else {
        const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement;
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', reject);
      }
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function SendcloudServicePointWidget({
  postalCode,
  country,
  carriers,
  language = 'fr',
  onSelect,
  selectedPoint,
}: SendcloudServicePointWidgetProps) {
  const [scriptReady, setScriptReady] = useState(false);
  const [opening, setOpening] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    loadSendcloudScript()
      .then(() => {
        if (mountedRef.current) setScriptReady(true);
      })
      .catch(() => {
        if (mountedRef.current) setScriptReady(false);
      });
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const openWidget = () => {
    const apiKey = import.meta.env.VITE_SENDCLOUD_PUBLIC_KEY;
    if (!apiKey || apiKey.includes('YOUR_SENDCLOUD') || !window.sendcloud?.servicePoints) return;

    setOpening(true);

    window.sendcloud.servicePoints.open(
      apiKey,
      country,
      postalCode,
      carriers,
      language,
      (servicePoint: ServicePoint) => {
        setOpening(false);
        onSelect(servicePoint);
      },
      {}
    );

    setTimeout(() => {
      if (mountedRef.current) setOpening(false);
    }, 2000);
  };

  const publicKey = import.meta.env.VITE_SENDCLOUD_PUBLIC_KEY;
  const keyInvalid = !publicKey || publicKey.includes('YOUR_SENDCLOUD') || publicKey.length < 10;

  if (keyInvalid) {
    return (
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
        <p className="font-semibold">Clé publique Sendcloud non configurée</p>
        <p className="text-amber-700">Ajoutez <code className="bg-amber-100 px-1 rounded">VITE_SENDCLOUD_PUBLIC_KEY</code> dans votre fichier <code>.env</code> pour activer la sélection de points relais.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {selectedPoint ? (
        <div className="border border-emerald-400 bg-emerald-50 rounded-lg p-2.5">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-xs">{selectedPoint.name}</p>
              <p className="text-[11px] text-gray-600">
                {selectedPoint.street} {selectedPoint.house_number}, {selectedPoint.postal_code} {selectedPoint.city}
              </p>
              {selectedPoint.carrier && (
                <span className="inline-block mt-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                  {selectedPoint.carrier}
                </span>
              )}
            </div>
            <button
              onClick={openWidget}
              disabled={!scriptReady}
              className="text-[10px] text-emerald-600 hover:text-emerald-700 font-medium flex-shrink-0"
            >
              Modifier
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={openWidget}
          disabled={!scriptReady || opening}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-dashed border-teal-400 rounded-lg text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {opening || !scriptReady ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Chargement...</span>
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              <span>Choisir un point relais</span>
            </>
          )}
        </button>
      )}

      {!selectedPoint && scriptReady && (
        <p className="text-[10px] text-gray-400 text-center">
          Tous les points relais disponibles (Mondial Relay, UPS, Colissimo…)
        </p>
      )}
    </div>
  );
}
