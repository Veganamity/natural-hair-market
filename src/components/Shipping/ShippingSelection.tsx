import { useState, useEffect, useRef } from 'react';
import { Truck, Package, MapPin, Loader2, AlertCircle, Globe, Check } from 'lucide-react';
import { AddressSelector, ShippingAddress } from '../Payment/AddressSelector';
import { SendcloudServicePointWidget, ServicePoint } from './SendcloudServicePointWidget';
import { SendcloudMethod, isRelayMethod } from './shippingUtils';

interface ShippingSelectionProps {
  onShippingSelected: (data: {
    method: string;
    sendcloudMethodId: number;
    cost: number;
    address?: ShippingAddress;
    relayPointId?: string;
    relayPointName?: string;
    relayPointAddress?: string;
    relayPointPostalCode?: string;
    relayPointCity?: string;
  }) => void;
  selectedMethod?: string;
  weight?: number;
}

function carrierIcon(carrier: string) {
  const name = carrier?.toLowerCase() ?? '';
  if (name.includes('relay') || name.includes('mondial')) return <MapPin className="w-4 h-4" />;
  if (name.includes('chrono') || name.includes('ups') || name.includes('dhl') || name.includes('fedex')) return <Truck className="w-4 h-4" />;
  if (name.includes('colissimo')) return <Package className="w-4 h-4" />;
  return <Globe className="w-4 h-4" />;
}

function carrierAccent(carrier: string): { border: string; bg: string; text: string; icon: string } {
  const name = carrier?.toLowerCase() ?? '';
  if (name.includes('relay') || name.includes('mondial')) return { border: 'border-teal-500', bg: 'bg-teal-50', text: 'text-teal-700', icon: 'text-teal-500' };
  if (name.includes('chrono')) return { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-500' };
  if (name.includes('ups')) return { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-500' };
  if (name.includes('dhl')) return { border: 'border-yellow-400', bg: 'bg-yellow-50', text: 'text-yellow-700', icon: 'text-yellow-500' };
  if (name.includes('colissimo')) return { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-500' };
  return { border: 'border-gray-400', bg: 'bg-gray-50', text: 'text-gray-700', icon: 'text-gray-500' };
}

function carriersParam(method: SendcloudMethod): string {
  const name = method.carrier?.toLowerCase() ?? '';
  if (name.includes('mondial') || method.name?.toLowerCase().includes('mondial')) return 'mondial_relay';
  if (name.includes('ups')) return 'ups';
  if (name.includes('colissimo')) return 'colissimo';
  if (name.includes('chronopost') || name.includes('chrono')) return 'chronopost';
  return method.carrier ?? '';
}

export function ShippingSelection({ onShippingSelected, weight = 100 }: ShippingSelectionProps) {
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const [shippingMethods, setShippingMethods] = useState<SendcloudMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [methodsError, setMethodsError] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [selectedServicePoint, setSelectedServicePoint] = useState<ServicePoint | null>(null);
  const lastCountryRef = useRef<string>('');

  useEffect(() => {
    if (selectedAddress?.country && selectedAddress.country !== lastCountryRef.current) {
      lastCountryRef.current = selectedAddress.country;
      fetchMethods(selectedAddress.country);
    }
  }, [selectedAddress?.country]);

  const fetchMethods = async (country: string) => {
    setLoadingMethods(true);
    setMethodsError('');
    setSelectedMethodId(null);
    setSelectedServicePoint(null);

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
      if (methods.length > 0) setSelectedMethodId(methods[0].id);
    } catch (err: any) {
      setMethodsError(err.message);
    } finally {
      setLoadingMethods(false);
    }
  };

  useEffect(() => {
    emitShipping();
  }, [selectedMethodId, selectedAddress, selectedServicePoint]);

  const emitShipping = () => {
    const method = shippingMethods.find(m => m.id === selectedMethodId);
    if (!method || !selectedAddress) return;

    const isRelay = isRelayMethod(method);
    const data: any = {
      method: isRelay ? 'mondial_relay' : method.carrier?.toLowerCase() ?? method.name?.toLowerCase(),
      sendcloudMethodId: method.id,
      cost: method.price ?? 0,
      address: selectedAddress,
    };

    if (isRelay && selectedServicePoint) {
      data.relayPointId = String(selectedServicePoint.id);
      data.relayPointName = selectedServicePoint.name;
      data.relayPointAddress = `${selectedServicePoint.street} ${selectedServicePoint.house_number}`;
      data.relayPointPostalCode = selectedServicePoint.postal_code;
      data.relayPointCity = selectedServicePoint.city;
    }

    onShippingSelected(data);
  };

  const selectedMethodObj = shippingMethods.find(m => m.id === selectedMethodId) ?? null;
  const requiresRelay = selectedMethodObj ? isRelayMethod(selectedMethodObj) : false;

  return (
    <div className="space-y-3">
      <AddressSelector
        onSelectAddress={setSelectedAddress}
        selectedAddress={selectedAddress}
      />

      {selectedAddress && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-800">Mode de livraison</h3>

          {loadingMethods && (
            <div className="flex items-center gap-2 py-3 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Chargement des options...</span>
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
            <div className="space-y-1.5">
              {shippingMethods.map((m) => {
                const isSelected = m.id === selectedMethodId;
                const accent = carrierAccent(m.carrier);
                const relay = isRelayMethod(m);
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMethodId(m.id);
                      setSelectedServicePoint(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 border rounded-xl transition-all text-left ${
                      isSelected
                        ? `${accent.border} ${accent.bg} shadow-sm`
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className={isSelected ? accent.icon : 'text-gray-400'}>
                      {carrierIcon(m.carrier)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${isSelected ? accent.text : 'text-gray-800'}`}>
                        {m.name}
                      </p>
                      {relay && (
                        <p className="text-[10px] text-gray-500 mt-0.5">Livraison en point relais</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-sm font-bold ${isSelected ? accent.text : 'text-gray-700'}`}>
                        {(m.price ?? 0) === 0 ? 'Gratuit' : `${(m.price ?? 0).toFixed(2).replace('.', ',')} €`}
                      </span>
                      {isSelected && (
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center ${accent.bg} border ${accent.border}`}>
                          <Check className={`w-3 h-3 ${accent.text}`} />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {requiresRelay && selectedAddress && selectedMethodObj && (
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-gray-800">Point relais</p>
          <SendcloudServicePointWidget
            postalCode={selectedAddress.postal_code}
            country={selectedAddress.country}
            carriers={carriersParam(selectedMethodObj)}
            language="fr"
            onSelect={(point) => setSelectedServicePoint(point)}
            selectedPoint={selectedServicePoint}
          />
        </div>
      )}
    </div>
  );
}
