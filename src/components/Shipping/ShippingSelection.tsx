import { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { AddressSelector, ShippingAddress } from '../Payment/AddressSelector';
import { SendcloudServicePointWidget, ServicePoint } from './SendcloudServicePointWidget';
import { SendcloudMethod, isRelayMethod } from './shippingUtils';
import { ShippingMethodList } from './ShippingMethodList';

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

function carriersParam(method: SendcloudMethod): string {
  const s = `${method.carrier ?? ''} ${method.name ?? ''}`.toLowerCase();
  if (s.includes('mondial') || s.includes('relay') || s.includes('relais') || s.includes('locker') || s.includes('shop2shop')) return 'mondial_relay';
  if (s.includes('ups')) return 'ups';
  if (s.includes('colissimo')) return 'colissimo';
  if (s.includes('chronopost') || s.includes('chrono')) return 'chronopost';
  if (s.includes('dhl')) return 'dhl';
  if (s.includes('gls')) return 'gls';
  return method.carrier ?? '';
}

export function ShippingSelection({ onShippingSelected, weight = 100 }: ShippingSelectionProps) {
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const [shippingMethods, setShippingMethods] = useState<SendcloudMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [methodsError, setMethodsError] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [selectedServicePoint, setSelectedServicePoint] = useState<ServicePoint | null>(null);
  const prevCountryRef = useRef<string | null>(null);

  useEffect(() => {
    const country = selectedAddress?.country ?? null;
    if (country && country !== prevCountryRef.current) {
      prevCountryRef.current = country;
      fetchMethods(country);
    }
  }, [selectedAddress]);

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
      data.relayPointAddress = `${selectedServicePoint.street} ${selectedServicePoint.house_number}`.trim();
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
            <ShippingMethodList
              methods={shippingMethods}
              selectedMethodId={selectedMethodId}
              onSelect={(id) => {
                setSelectedMethodId(id);
                setSelectedServicePoint(null);
              }}
            />
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
            onSelect={setSelectedServicePoint}
            selectedPoint={selectedServicePoint}
          />
        </div>
      )}
    </div>
  );
}
