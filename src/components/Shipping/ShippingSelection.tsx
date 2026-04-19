import { useState, useEffect, useRef } from 'react';
import { Truck, Package, MapPin, Loader2, AlertCircle, Globe } from 'lucide-react';
import { AddressSelector, ShippingAddress } from '../Payment/AddressSelector';
import { MondialRelaySelection } from './MondialRelaySelection';
import { SendcloudMethod, isRelayMethod } from './shippingUtils';

type ShippingMethodKey = string;

interface ShippingSelectionProps {
  onShippingSelected: (data: {
    method: ShippingMethodKey;
    sendcloudMethodId: number;
    cost: number;
    address?: ShippingAddress;
    relayPointId?: string;
    relayPointName?: string;
    relayPointAddress?: string;
    relayPointPostalCode?: string;
    relayPointCity?: string;
  }) => void;
  selectedMethod?: ShippingMethodKey;
  weight?: number;
}

function methodIcon(carrier: string, isSelected: boolean) {
  const base = isSelected ? 'text-teal-600' : 'text-gray-400';
  const name = carrier?.toLowerCase() ?? '';
  if (name.includes('relay') || name.includes('mondial')) return <MapPin className={`w-4 h-4 mb-1 ${base}`} />;
  if (name.includes('chrono') || name.includes('ups') || name.includes('dhl') || name.includes('fedex')) return <Truck className={`w-4 h-4 mb-1 ${base}`} />;
  if (name.includes('colissimo') || name.includes('letter')) return <Package className={`w-4 h-4 mb-1 ${base}`} />;
  return <Globe className={`w-4 h-4 mb-1 ${base}`} />;
}

function selectedColor(carrier: string) {
  const name = carrier?.toLowerCase() ?? '';
  if (name.includes('relay') || name.includes('mondial')) return 'border-teal-600 bg-teal-50';
  if (name.includes('chrono')) return 'border-blue-600 bg-blue-50';
  if (name.includes('ups')) return 'border-amber-600 bg-amber-50';
  if (name.includes('dhl')) return 'border-yellow-500 bg-yellow-50';
  return 'border-emerald-600 bg-emerald-50';
}

function priceColor(carrier: string) {
  const name = carrier?.toLowerCase() ?? '';
  if (name.includes('relay') || name.includes('mondial')) return 'text-teal-600';
  if (name.includes('chrono')) return 'text-blue-600';
  if (name.includes('ups')) return 'text-amber-600';
  if (name.includes('dhl')) return 'text-yellow-600';
  return 'text-emerald-600';
}

export function ShippingSelection({ onShippingSelected, selectedMethod, weight = 100 }: ShippingSelectionProps) {
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const [shippingMethods, setShippingMethods] = useState<SendcloudMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [methodsError, setMethodsError] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [selectedRelayPoint, setSelectedRelayPoint] = useState<any>(null);
  const lastCountryRef = useRef<string>('');

  useEffect(() => {
    if (selectedAddress?.country && selectedAddress.country !== lastCountryRef.current) {
      lastCountryRef.current = selectedAddress.country;
      fetchMethods(selectedAddress.country);
    }
  }, [selectedAddress?.country, weight]);

  const fetchMethods = async (country: string) => {
    setLoadingMethods(true);
    setMethodsError('');
    setSelectedMethodId(null);
    setSelectedRelayPoint(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-shipping-methods`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ toCountry: country, weightGrams: weight }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Erreur lors du chargement des méthodes');

      const methods: SendcloudMethod[] = data.shipping_methods || [];
      setShippingMethods(methods);

      if (methods.length > 0) {
        setSelectedMethodId(methods[0].id);
      }
    } catch (err: any) {
      setMethodsError(err.message);
    } finally {
      setLoadingMethods(false);
    }
  };

  useEffect(() => {
    emitShipping();
  }, [selectedMethodId, selectedAddress, selectedRelayPoint]);

  const emitShipping = () => {
    const method = shippingMethods.find(m => m.id === selectedMethodId);
    if (!method || !selectedAddress) return;

    const isRelay = isRelayMethod(method);

    const data: any = {
      method: isRelay ? 'mondial_relay' : method.carrier?.toLowerCase().includes('chrono') ? 'chronopost' : method.carrier?.toLowerCase() ?? method.name?.toLowerCase(),
      sendcloudMethodId: method.id,
      cost: method.price ?? 0,
      address: selectedAddress,
    };

    if (isRelay && selectedRelayPoint) {
      data.relayPointId = selectedRelayPoint.id;
      data.relayPointName = selectedRelayPoint.name;
      data.relayPointAddress = `${selectedRelayPoint.address}, ${selectedRelayPoint.postalCode} ${selectedRelayPoint.city}`;
      data.relayPointPostalCode = selectedRelayPoint.postalCode;
      data.relayPointCity = selectedRelayPoint.city;
    }

    onShippingSelected(data);
  };

  const selectedMethodObj = shippingMethods.find(m => m.id === selectedMethodId) ?? null;
  const requiresRelay = selectedMethodObj ? isRelayMethod(selectedMethodObj) : false;

  return (
    <div className="space-y-2">
      <AddressSelector
        onSelectAddress={setSelectedAddress}
        selectedAddress={selectedAddress}
      />

      {selectedAddress && (
        <div>
          <h3 className="text-xs font-bold text-gray-800 mb-1.5">Mode de livraison</h3>

          {loadingMethods && (
            <div className="flex items-center gap-2 py-3 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Chargement des options de livraison...</span>
            </div>
          )}

          {methodsError && (
            <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>{methodsError}</span>
            </div>
          )}

          {!loadingMethods && !methodsError && shippingMethods.length === 0 && (
            <p className="text-xs text-gray-500 py-2">Aucune méthode disponible pour ce pays.</p>
          )}

          {!loadingMethods && shippingMethods.length > 0 && (
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {shippingMethods.map((m) => {
                const isSelected = m.id === selectedMethodId;
                return (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedMethodId(m.id); setSelectedRelayPoint(null); }}
                    className={`p-2 border rounded-lg transition-all text-left ${
                      isSelected ? selectedColor(m.carrier) : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      {methodIcon(m.carrier, isSelected)}
                      <h4 className="font-semibold text-gray-800 text-[10px] leading-tight">{m.name}</h4>
                      <span className={`font-bold text-xs mt-0.5 ${isSelected ? priceColor(m.carrier) : 'text-gray-600'}`}>
                        {(m.price ?? 0).toFixed(2).replace('.', ',')} €
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {requiresRelay && selectedAddress && (
        <MondialRelaySelection
          postalCode={selectedAddress.postal_code}
          country={selectedAddress.country}
          weight={weight}
          onSelectPoint={(point) => { setSelectedRelayPoint(point); }}
          selectedPointId={selectedRelayPoint?.id}
          street={selectedAddress.address_line1}
          city={selectedAddress.city}
        />
      )}
    </div>
  );
}
