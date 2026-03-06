import { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Package, Loader2, Map, List, RefreshCw } from 'lucide-react';

interface RelayPoint {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  distance: string;
  locationType: string;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

interface MondialRelaySelectionProps {
  postalCode: string;
  country: string;
  weight: number;
  onSelectPoint: (point: RelayPoint) => void;
  selectedPointId?: string;
}

declare global {
  interface Window {
    L: any;
  }
}

export function MondialRelaySelection({
  postalCode,
  country,
  weight,
  onSelectPoint,
  selectedPointId,
}: MondialRelaySelectionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [relayPoints, setRelayPoints] = useState<RelayPoint[]>([]);
  const [expandedPointId, setExpandedPointId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (postalCode && country) {
      searchRelayPoints();
    }
  }, [postalCode, country, weight]);

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else if (window.L) {
      setMapLoaded(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (viewMode === 'map' && mapLoaded && relayPoints.length > 0 && mapContainerRef.current) {
      initializeMap();
    }
  }, [viewMode, mapLoaded, relayPoints]);

  const initializeMap = () => {
    if (!window.L || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const validPoints = relayPoints.filter(p => p.latitude && p.longitude);
    if (validPoints.length === 0) return;

    const firstPoint = validPoints[0];
    const centerLat = parseFloat(firstPoint.latitude);
    const centerLng = parseFloat(firstPoint.longitude);

    const map = window.L.map(mapContainerRef.current).setView([centerLat, centerLng], 13);
    mapInstanceRef.current = map;

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const selectedIcon = window.L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: #059669; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const defaultIcon = window.L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: #0ea5e9; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    validPoints.forEach((point) => {
      const lat = parseFloat(point.latitude);
      const lng = parseFloat(point.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      const isSelected = point.id === selectedPointId;
      const icon = isSelected ? selectedIcon : defaultIcon;

      const marker = window.L.marker([lat, lng], { icon }).addTo(map);

      marker.bindPopup(`
        <div style="min-width: 180px; font-family: system-ui, sans-serif;">
          <h4 style="font-weight: 600; margin: 0 0 4px 0; font-size: 13px; color: #111;">${point.name}</h4>
          <p style="margin: 0 0 2px 0; font-size: 11px; color: #666;">${point.address}</p>
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #666;">${point.postalCode} ${point.city}</p>
          <button onclick="window.selectRelayPoint('${point.id}')" style="
            width: 100%;
            padding: 6px 12px;
            background: #059669;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
          ">
            ${isSelected ? 'Selectionne' : 'Selectionner ce point'}
          </button>
        </div>
      `);

      marker.on('click', () => {
        onSelectPoint(point);
      });

      markersRef.current.push(marker);
    });

    const bounds = window.L.latLngBounds(validPoints.map(p => [parseFloat(p.latitude), parseFloat(p.longitude)]));
    map.fitBounds(bounds, { padding: [30, 30] });

    (window as any).selectRelayPoint = (pointId: string) => {
      const point = relayPoints.find(p => p.id === pointId);
      if (point) {
        onSelectPoint(point);
      }
    };
  };

  const searchRelayPoints = async () => {
    setLoading(true);
    setError('');

    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-mondial-relay-points`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          postalCode,
          country,
          weight,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Erreur HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data?.success) {
        throw new Error(data?.error || 'Erreur de recherche des points relais');
      }

      setRelayPoints(data.relayPoints || []);
    } catch (err) {
      console.error('Mondial Relay error:', err);

      let errorMessage = 'Service temporairement indisponible';

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Delai depasse. Le service Mondial Relay ne repond pas.';
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = `Impossible de contacter le serveur. Verifiez votre connexion. (URL: ${apiUrl})`;
        } else if (err.message.includes('NetworkError')) {
          errorMessage = 'Erreur reseau. Verifiez votre connexion internet.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatOpeningHours = (hours: string): string => {
    if (!hours || hours === '0000-0000') return 'Ferme';

    const matches = hours.match(/(\d{2})(\d{2})-(\d{2})(\d{2})/);
    if (!matches) return hours;

    const [, h1, m1, h2, m2] = matches;
    return `${h1}:${m1} - ${h2}:${m2}`;
  };

  const getDayName = (day: keyof RelayPoint['openingHours']): string => {
    const days = {
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche',
    };
    return days[day];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
        <span className="ml-2 text-gray-600 text-sm">Recherche des points relais...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <p className="text-red-600 text-xs">{error}</p>
        <button
          onClick={searchRelayPoints}
          className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Reessayer
        </button>
      </div>
    );
  }

  if (relayPoints.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-gray-600 text-xs">
          Aucun point relais trouve pour ce code postal.
        </p>
        <button
          onClick={searchRelayPoints}
          className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Rechercher a nouveau
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-xs">
          Points relais ({relayPoints.length})
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'list' ? 'bg-white shadow text-emerald-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Vue liste"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'map' ? 'bg-white shadow text-emerald-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Vue carte"
            >
              <Map className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={searchRelayPoints}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Actualiser
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <div
            ref={mapContainerRef}
            style={{ height: '280px', width: '100%' }}
            className="bg-gray-100"
          />
          {selectedPointId && (
            <div className="p-2 bg-emerald-50 border-t border-emerald-200">
              {(() => {
                const selected = relayPoints.find(p => p.id === selectedPointId);
                if (!selected) return null;
                return (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-[11px] truncate">{selected.name}</p>
                      <p className="text-[10px] text-gray-600 truncate">{selected.address}, {selected.postalCode} {selected.city}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      ) : (
        <div className="max-h-48 overflow-y-auto space-y-1.5">
          {relayPoints.map((point) => (
            <div
              key={point.id}
              className={`border rounded-lg p-2 cursor-pointer transition-all ${
                selectedPointId === point.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-emerald-300'
              }`}
              onClick={() => onSelectPoint(point)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Package className="w-3 h-3 text-emerald-600" />
                    <h4 className="font-semibold text-gray-900 text-[10px]">{point.name}</h4>
                    {point.distance && (
                      <span className="text-[9px] text-gray-500">
                        ({point.distance} km)
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-1.5 text-[10px] text-gray-600">
                    <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div>{point.address}</div>
                      <div>{point.postalCode} {point.city}</div>
                    </div>
                  </div>

                  {expandedPointId === point.id && point.openingHours && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="flex items-start gap-1.5">
                        <Clock className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-[9px] text-gray-600 space-y-0.5">
                          {(Object.keys(point.openingHours) as Array<keyof RelayPoint['openingHours']>).map((day) => (
                            <div key={day} className="flex justify-between gap-3">
                              <span className="font-medium">{getDayName(day)}:</span>
                              <span>{formatOpeningHours(point.openingHours[day])}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedPointId(expandedPointId === point.id ? null : point.id);
                    }}
                    className="text-[9px] text-emerald-600 hover:text-emerald-700 font-medium mt-1"
                  >
                    {expandedPointId === point.id ? 'Masquer les horaires' : 'Voir les horaires'}
                  </button>
                </div>

                {selectedPointId === point.id && (
                  <div className="ml-2">
                    <div className="w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
