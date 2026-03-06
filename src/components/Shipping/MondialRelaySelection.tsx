import { useState, useEffect } from 'react';
import { MapPin, Clock, Package, Loader2 } from 'lucide-react';

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

  useEffect(() => {
    if (postalCode && country) {
      searchRelayPoints();
    }
  }, [postalCode, country, weight]);

  const searchRelayPoints = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-mondial-relay-points`,
        {
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
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur de recherche des points relais');
      }

      const data = await response.json();

      if (!data?.success) {
        throw new Error(data?.error || 'Erreur de recherche des points relais');
      }

      setRelayPoints(data.relayPoints || []);
    } catch (err) {
      console.error('Error searching relay points:', err);
      setError((err as Error).message || 'Service temporairement indisponible');
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
      <div className="flex items-center justify-center py-4">
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
          className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
        >
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
          className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
        >
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
        <button
          onClick={searchRelayPoints}
          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Actualiser
        </button>
      </div>

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
    </div>
  );
}
