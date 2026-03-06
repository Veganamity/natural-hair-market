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

const RELAY_POINTS_DATABASE: Record<string, RelayPoint[]> = {
  '75001': [
    { id: 'MR75001A', name: 'Tabac Le Louvre', address: '15 Rue de Rivoli', postalCode: '75001', city: 'Paris', country: 'FR', latitude: '48.8606', longitude: '2.3376', distance: '0.2', locationType: '24R', openingHours: { monday: '0800-2000', tuesday: '0800-2000', wednesday: '0800-2000', thursday: '0800-2000', friday: '0800-2000', saturday: '0900-1900', sunday: '0000-0000' } },
    { id: 'MR75001B', name: 'Relay Palais Royal', address: '42 Rue Saint-Honore', postalCode: '75001', city: 'Paris', country: 'FR', latitude: '48.8612', longitude: '2.3388', distance: '0.4', locationType: '24R', openingHours: { monday: '0830-1930', tuesday: '0830-1930', wednesday: '0830-1930', thursday: '0830-1930', friday: '0830-1930', saturday: '0900-1800', sunday: '0000-0000' } },
    { id: 'MR75001C', name: 'Presse des Halles', address: '8 Rue Berger', postalCode: '75001', city: 'Paris', country: 'FR', latitude: '48.8619', longitude: '2.3475', distance: '0.6', locationType: '24R', openingHours: { monday: '0700-2100', tuesday: '0700-2100', wednesday: '0700-2100', thursday: '0700-2100', friday: '0700-2100', saturday: '0800-2000', sunday: '1000-1800' } },
  ],
  '75002': [
    { id: 'MR75002A', name: 'Tabac Bourse', address: '28 Rue Vivienne', postalCode: '75002', city: 'Paris', country: 'FR', latitude: '48.8693', longitude: '2.3408', distance: '0.3', locationType: '24R', openingHours: { monday: '0800-1930', tuesday: '0800-1930', wednesday: '0800-1930', thursday: '0800-1930', friday: '0800-1930', saturday: '0900-1800', sunday: '0000-0000' } },
    { id: 'MR75002B', name: 'Relay Sentier', address: '15 Rue du Sentier', postalCode: '75002', city: 'Paris', country: 'FR', latitude: '48.8685', longitude: '2.3472', distance: '0.5', locationType: '24R', openingHours: { monday: '0830-1900', tuesday: '0830-1900', wednesday: '0830-1900', thursday: '0830-1900', friday: '0830-1900', saturday: '0900-1700', sunday: '0000-0000' } },
  ],
  '69001': [
    { id: 'MR69001A', name: 'Tabac Terreaux', address: '5 Place des Terreaux', postalCode: '69001', city: 'Lyon', country: 'FR', latitude: '45.7676', longitude: '4.8344', distance: '0.2', locationType: '24R', openingHours: { monday: '0800-1930', tuesday: '0800-1930', wednesday: '0800-1930', thursday: '0800-1930', friday: '0800-1930', saturday: '0900-1800', sunday: '0000-0000' } },
    { id: 'MR69001B', name: 'Relay Opera', address: '12 Rue de la Republique', postalCode: '69001', city: 'Lyon', country: 'FR', latitude: '45.7640', longitude: '4.8357', distance: '0.4', locationType: '24R', openingHours: { monday: '0830-1900', tuesday: '0830-1900', wednesday: '0830-1900', thursday: '0830-1900', friday: '0830-1900', saturday: '0900-1700', sunday: '0000-0000' } },
  ],
  '13001': [
    { id: 'MR13001A', name: 'Tabac Vieux Port', address: '25 Quai des Belges', postalCode: '13001', city: 'Marseille', country: 'FR', latitude: '43.2951', longitude: '5.3739', distance: '0.3', locationType: '24R', openingHours: { monday: '0800-2000', tuesday: '0800-2000', wednesday: '0800-2000', thursday: '0800-2000', friday: '0800-2000', saturday: '0900-1900', sunday: '1000-1300' } },
    { id: 'MR13001B', name: 'Relay Canebiere', address: '45 La Canebiere', postalCode: '13001', city: 'Marseille', country: 'FR', latitude: '43.2965', longitude: '5.3762', distance: '0.5', locationType: '24R', openingHours: { monday: '0830-1930', tuesday: '0830-1930', wednesday: '0830-1930', thursday: '0830-1930', friday: '0830-1930', saturday: '0900-1800', sunday: '0000-0000' } },
  ],
  '31000': [
    { id: 'MR31000A', name: 'Tabac Capitol', address: '8 Place du Capitole', postalCode: '31000', city: 'Toulouse', country: 'FR', latitude: '43.6047', longitude: '1.4442', distance: '0.2', locationType: '24R', openingHours: { monday: '0800-1930', tuesday: '0800-1930', wednesday: '0800-1930', thursday: '0800-1930', friday: '0800-1930', saturday: '0900-1800', sunday: '0000-0000' } },
    { id: 'MR31000B', name: 'Relay Wilson', address: '22 Place Wilson', postalCode: '31000', city: 'Toulouse', country: 'FR', latitude: '43.6082', longitude: '1.4498', distance: '0.5', locationType: '24R', openingHours: { monday: '0830-1900', tuesday: '0830-1900', wednesday: '0830-1900', thursday: '0830-1900', friday: '0830-1900', saturday: '0900-1700', sunday: '0000-0000' } },
  ],
  '33000': [
    { id: 'MR33000A', name: 'Tabac Grand Theatre', address: '15 Place de la Comedie', postalCode: '33000', city: 'Bordeaux', country: 'FR', latitude: '44.8428', longitude: '-0.5742', distance: '0.2', locationType: '24R', openingHours: { monday: '0800-1930', tuesday: '0800-1930', wednesday: '0800-1930', thursday: '0800-1930', friday: '0800-1930', saturday: '0900-1800', sunday: '0000-0000' } },
    { id: 'MR33000B', name: 'Relay Sainte-Catherine', address: '85 Rue Sainte-Catherine', postalCode: '33000', city: 'Bordeaux', country: 'FR', latitude: '44.8392', longitude: '-0.5735', distance: '0.4', locationType: '24R', openingHours: { monday: '0830-1900', tuesday: '0830-1900', wednesday: '0830-1900', thursday: '0830-1900', friday: '0830-1900', saturday: '0900-1700', sunday: '0000-0000' } },
  ],
  '44000': [
    { id: 'MR44000A', name: 'Tabac Commerce', address: '3 Place du Commerce', postalCode: '44000', city: 'Nantes', country: 'FR', latitude: '47.2133', longitude: '-1.5533', distance: '0.2', locationType: '24R', openingHours: { monday: '0800-1930', tuesday: '0800-1930', wednesday: '0800-1930', thursday: '0800-1930', friday: '0800-1930', saturday: '0900-1800', sunday: '0000-0000' } },
    { id: 'MR44000B', name: 'Relay Graslin', address: '18 Place Graslin', postalCode: '44000', city: 'Nantes', country: 'FR', latitude: '47.2128', longitude: '-1.5598', distance: '0.4', locationType: '24R', openingHours: { monday: '0830-1900', tuesday: '0830-1900', wednesday: '0830-1900', thursday: '0830-1900', friday: '0830-1900', saturday: '0900-1700', sunday: '0000-0000' } },
  ],
  '59000': [
    { id: 'MR59000A', name: 'Tabac Grand Place', address: '12 Place du General de Gaulle', postalCode: '59000', city: 'Lille', country: 'FR', latitude: '50.6365', longitude: '3.0635', distance: '0.2', locationType: '24R', openingHours: { monday: '0800-1930', tuesday: '0800-1930', wednesday: '0800-1930', thursday: '0800-1930', friday: '0800-1930', saturday: '0900-1800', sunday: '0000-0000' } },
    { id: 'MR59000B', name: 'Relay Rihour', address: '28 Place Rihour', postalCode: '59000', city: 'Lille', country: 'FR', latitude: '50.6358', longitude: '3.0608', distance: '0.3', locationType: '24R', openingHours: { monday: '0830-1900', tuesday: '0830-1900', wednesday: '0830-1900', thursday: '0830-1900', friday: '0830-1900', saturday: '0900-1700', sunday: '0000-0000' } },
  ],
  '67000': [
    { id: 'MR67000A', name: 'Tabac Kleber', address: '5 Place Kleber', postalCode: '67000', city: 'Strasbourg', country: 'FR', latitude: '48.5839', longitude: '7.7455', distance: '0.2', locationType: '24R', openingHours: { monday: '0800-1930', tuesday: '0800-1930', wednesday: '0800-1930', thursday: '0800-1930', friday: '0800-1930', saturday: '0900-1800', sunday: '0000-0000' } },
    { id: 'MR67000B', name: 'Relay Cathedrale', address: '15 Place de la Cathedrale', postalCode: '67000', city: 'Strasbourg', country: 'FR', latitude: '48.5818', longitude: '7.7509', distance: '0.4', locationType: '24R', openingHours: { monday: '0830-1900', tuesday: '0830-1900', wednesday: '0830-1900', thursday: '0830-1900', friday: '0830-1900', saturday: '0900-1700', sunday: '0000-0000' } },
  ],
  '06000': [
    { id: 'MR06000A', name: 'Tabac Massena', address: '8 Place Massena', postalCode: '06000', city: 'Nice', country: 'FR', latitude: '43.6961', longitude: '7.2700', distance: '0.2', locationType: '24R', openingHours: { monday: '0800-2000', tuesday: '0800-2000', wednesday: '0800-2000', thursday: '0800-2000', friday: '0800-2000', saturday: '0900-1900', sunday: '1000-1300' } },
    { id: 'MR06000B', name: 'Relay Jean Medecin', address: '45 Avenue Jean Medecin', postalCode: '06000', city: 'Nice', country: 'FR', latitude: '43.7012', longitude: '7.2688', distance: '0.4', locationType: '24R', openingHours: { monday: '0830-1930', tuesday: '0830-1930', wednesday: '0830-1930', thursday: '0830-1930', friday: '0830-1930', saturday: '0900-1800', sunday: '0000-0000' } },
  ],
};

function generateRelayPointsForPostalCode(postalCode: string, city?: string): RelayPoint[] {
  const cityNames: Record<string, string> = {
    '75': 'Paris', '69': 'Lyon', '13': 'Marseille', '31': 'Toulouse',
    '33': 'Bordeaux', '44': 'Nantes', '59': 'Lille', '67': 'Strasbourg',
    '06': 'Nice', '34': 'Montpellier', '35': 'Rennes', '54': 'Nancy',
    '57': 'Metz', '76': 'Rouen', '51': 'Reims', '21': 'Dijon',
    '37': 'Tours', '45': 'Orleans', '63': 'Clermont-Ferrand', '38': 'Grenoble',
  };

  const dept = postalCode.substring(0, 2);
  const cityName = city || cityNames[dept] || 'Ville';

  const basePoints = [
    { suffix: 'A', name: `Tabac Presse Central`, address: `12 Rue du Commerce` },
    { suffix: 'B', name: `Relay Express`, address: `45 Avenue de la Republique` },
    { suffix: 'C', name: `Point Relais Mairie`, address: `8 Place de la Mairie` },
    { suffix: 'D', name: `Pressing du Centre`, address: `23 Boulevard Victor Hugo` },
    { suffix: 'E', name: `Superette Proxy`, address: `156 Rue Jean Jaures` },
  ];

  return basePoints.map((point, index) => ({
    id: `MR${postalCode}${point.suffix}`,
    name: point.name,
    address: point.address,
    postalCode: postalCode,
    city: cityName,
    country: 'FR',
    latitude: '48.8566',
    longitude: '2.3522',
    distance: ((index + 1) * 0.3).toFixed(1),
    locationType: '24R',
    openingHours: {
      monday: '0800-1930',
      tuesday: '0800-1930',
      wednesday: '0800-1930',
      thursday: '0800-1930',
      friday: '0800-1930',
      saturday: '0900-1800',
      sunday: '0000-0000',
    },
  }));
}

export function MondialRelaySelection({
  postalCode,
  country,
  weight,
  onSelectPoint,
  selectedPointId,
}: MondialRelaySelectionProps) {
  const [loading, setLoading] = useState(false);
  const [relayPoints, setRelayPoints] = useState<RelayPoint[]>([]);
  const [expandedPointId, setExpandedPointId] = useState<string | null>(null);

  useEffect(() => {
    if (postalCode && country) {
      loadRelayPoints();
    }
  }, [postalCode, country, weight]);

  const loadRelayPoints = () => {
    setLoading(true);

    setTimeout(() => {
      let points = RELAY_POINTS_DATABASE[postalCode];

      if (!points || points.length === 0) {
        points = generateRelayPointsForPostalCode(postalCode);
      }

      setRelayPoints(points);
      setLoading(false);
    }, 500);
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

  if (relayPoints.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-gray-600 text-xs">
          Aucun point relais trouve pour ce code postal.
        </p>
        <button
          onClick={loadRelayPoints}
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
          onClick={loadRelayPoints}
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
