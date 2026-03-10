import { useState, useEffect } from 'react';
import { Truck, Package, MapPin } from 'lucide-react';
import { AddressSelector, ShippingAddress } from '../Payment/AddressSelector';
import { MondialRelaySelection } from './MondialRelaySelection';

interface ShippingSelectionProps {
  onShippingSelected: (data: {
    method: 'mondial_relay' | 'chronopost' | 'colissimo';
    cost: number;
    address?: ShippingAddress;
    relayPointId?: string;
    relayPointName?: string;
    relayPointAddress?: string;
  }) => void;
  selectedMethod?: 'mondial_relay' | 'chronopost' | 'colissimo';
  weight?: number;
}

export function ShippingSelection({ onShippingSelected, selectedMethod, weight = 100 }: ShippingSelectionProps) {
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const [shippingMethod, setShippingMethod] = useState<'mondial_relay' | 'chronopost' | 'colissimo'>(selectedMethod || 'colissimo');
  const [selectedRelayPoint, setSelectedRelayPoint] = useState<any>(null);

  useEffect(() => {
    calculateShipping();
  }, [shippingMethod, selectedAddress, selectedRelayPoint]);

  const handleAddressSelect = (address: ShippingAddress) => {
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
      shippingData.address = selectedAddress;
    } else if (shippingMethod === 'mondial_relay' && selectedRelayPoint) {
      shippingData.relayPointId = selectedRelayPoint.id;
      shippingData.relayPointName = selectedRelayPoint.name;
      shippingData.relayPointAddress = `${selectedRelayPoint.address}, ${selectedRelayPoint.postalCode} ${selectedRelayPoint.city}`;
      if (selectedAddress) {
        shippingData.address = selectedAddress;
      }
    }

    onShippingSelected(shippingData);
  };

  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-xs font-bold text-gray-800 mb-1.5">Mode de livraison</h3>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => setShippingMethod('colissimo')}
            className={`p-2 border rounded-lg transition-all ${
              shippingMethod === 'colissimo'
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <Package className={`w-4 h-4 mb-1 ${shippingMethod === 'colissimo' ? 'text-emerald-600' : 'text-gray-400'}`} />
              <h4 className="font-semibold text-gray-800 text-[10px]">Colissimo</h4>
              <span className="font-bold text-emerald-600 text-xs">6,99</span>
              <p className="text-[9px] text-gray-500">48h</p>
            </div>
          </button>

          <button
            onClick={() => setShippingMethod('mondial_relay')}
            className={`p-2 border rounded-lg transition-all ${
              shippingMethod === 'mondial_relay'
                ? 'border-teal-600 bg-teal-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <MapPin className={`w-4 h-4 mb-1 ${shippingMethod === 'mondial_relay' ? 'text-teal-600' : 'text-gray-400'}`} />
              <h4 className="font-semibold text-gray-800 text-[10px]">Mondial Relay</h4>
              <span className="font-bold text-teal-600 text-xs">4,99</span>
              <p className="text-[9px] text-gray-500">Point relais</p>
            </div>
          </button>

          <button
            onClick={() => setShippingMethod('chronopost')}
            className={`p-2 border rounded-lg transition-all ${
              shippingMethod === 'chronopost'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <Truck className={`w-4 h-4 mb-1 ${shippingMethod === 'chronopost' ? 'text-blue-600' : 'text-gray-400'}`} />
              <h4 className="font-semibold text-gray-800 text-[10px]">Chronopost</h4>
              <span className="font-bold text-blue-600 text-xs">8,99</span>
              <p className="text-[9px] text-gray-500">Express</p>
            </div>
          </button>
        </div>
      </div>

      <AddressSelector
        onSelectAddress={handleAddressSelect}
        selectedAddress={selectedAddress}
      />

      {shippingMethod === 'mondial_relay' && selectedAddress && (
        <MondialRelaySelection
          postalCode={selectedAddress.postal_code}
          country={selectedAddress.country}
          weight={weight}
          onSelectPoint={setSelectedRelayPoint}
          selectedPointId={selectedRelayPoint?.id}
          street={selectedAddress.street}
          city={selectedAddress.city}
        />
      )}
    </div>
  );
}
