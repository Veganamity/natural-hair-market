import { useState, useEffect } from 'react';
import { Truck, Package, MapPin, Check } from 'lucide-react';
import { AddressSelector } from '../Payment/AddressSelector';
import { MondialRelaySelection } from './MondialRelaySelection';

interface SavedAddress {
  id: string;
  label: string;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  postal_code: string;
  city: string;
  country: string;
  phone: string;
  is_default: boolean;
}

interface ShippingSelectionProps {
  onShippingSelected: (data: {
    method: 'mondial_relay' | 'chronopost' | 'colissimo';
    cost: number;
    addressId?: string;
    relayPointId?: string;
    relayPointName?: string;
    relayPointAddress?: string;
  }) => void;
  selectedMethod?: 'mondial_relay' | 'chronopost' | 'colissimo';
  weight?: number;
}

export function ShippingSelection({ onShippingSelected, selectedMethod, weight = 100 }: ShippingSelectionProps) {
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);
  const [shippingMethod, setShippingMethod] = useState<'mondial_relay' | 'chronopost' | 'colissimo'>(selectedMethod || 'colissimo');
  const [selectedRelayPoint, setSelectedRelayPoint] = useState<any>(null);

  useEffect(() => {
    calculateShipping();
  }, [shippingMethod, selectedAddress, selectedRelayPoint]);

  const handleAddressSelect = (address: SavedAddress) => {
    setSelectedAddress(address);
  };

  const calculateShipping = () => {
    let cost = 0;

    if (shippingMethod === 'mondial_relay') {
      cost = 4.99;
    } else if (shippingMethod === 'chronopost') {
      cost = 8.99;
    } else if (shippingMethod === 'colissimo') {
      cost = 6.99;
    }

    const shippingData: any = {
      method: shippingMethod,
      cost,
    };

    if ((shippingMethod === 'chronopost' || shippingMethod === 'colissimo') && selectedAddress) {
      shippingData.addressId = selectedAddress.id;
    } else if (shippingMethod === 'mondial_relay' && selectedRelayPoint) {
      shippingData.relayPointId = selectedRelayPoint.id;
      shippingData.relayPointName = selectedRelayPoint.name;
      shippingData.relayPointAddress = selectedRelayPoint.address;
    }

    onShippingSelected(shippingData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Choisir le mode de livraison</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShippingMethod('colissimo')}
            className={`p-4 border-2 rounded-xl transition-all ${
              shippingMethod === 'colissimo'
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <Package className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-800">Colissimo</h4>
                  <span className="font-bold text-emerald-600">6,99€</span>
                </div>
                <p className="text-sm text-gray-600">
                  Livraison à domicile sous 48h
                </p>
              </div>
              {shippingMethod === 'colissimo' && (
                <Check className="w-5 h-5 text-emerald-600" />
              )}
            </div>
          </button>

          <button
            onClick={() => setShippingMethod('mondial_relay')}
            className={`p-4 border-2 rounded-xl transition-all ${
              shippingMethod === 'mondial_relay'
                ? 'border-teal-600 bg-teal-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-teal-600 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-800">Mondial Relay</h4>
                  <span className="font-bold text-teal-600">4,99€</span>
                </div>
                <p className="text-sm text-gray-600">
                  Retrait en point relais
                </p>
              </div>
              {shippingMethod === 'mondial_relay' && (
                <Check className="w-5 h-5 text-teal-600" />
              )}
            </div>
          </button>

          <button
            onClick={() => setShippingMethod('chronopost')}
            className={`p-4 border-2 rounded-xl transition-all ${
              shippingMethod === 'chronopost'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <Truck className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-800">Chronopost</h4>
                  <span className="font-bold text-blue-600">8,99€</span>
                </div>
                <p className="text-sm text-gray-600">
                  Livraison express 24-48h
                </p>
              </div>
              {shippingMethod === 'chronopost' && (
                <Check className="w-5 h-5 text-blue-600" />
              )}
            </div>
          </button>
        </div>
      </div>

      {shippingMethod === 'mondial_relay' && selectedAddress && (
        <MondialRelaySelection
          postalCode={selectedAddress.postal_code}
          country={selectedAddress.country}
          weight={weight}
          onSelectPoint={setSelectedRelayPoint}
          selectedPointId={selectedRelayPoint?.id}
        />
      )}

      {(shippingMethod === 'chronopost' || shippingMethod === 'colissimo' || shippingMethod === 'mondial_relay') && (
        <AddressSelector
          onSelectAddress={handleAddressSelect}
          selectedAddressId={selectedAddress?.id}
        />
      )}
    </div>
  );
}
