import { useState, useEffect } from 'react';
import { Truck, Package, MapPin } from 'lucide-react';
import { AddressSelector, ShippingAddress } from '../Payment/AddressSelector';
import { MondialRelaySelection } from './MondialRelaySelection';

interface CartShippingSelectionProps {
  onShippingSelected: (data: {
    method: 'mondial_relay' | 'chronopost' | 'colissimo';
    cost: number;
    address?: ShippingAddress;
    relayPointId?: string;
    relayPointName?: string;
    relayPointAddress?: string;
  }) => void;
  selectedMethod?: 'mondial_relay' | 'chronopost' | 'colissimo';
  totalWeightGrams: number;
}

function getMondialRelayCost(weightGrams: number): number {
  if (weightGrams <= 250) return 3.49;
  if (weightGrams <= 500) return 4.49;
  if (weightGrams <= 1000) return 4.99;
  if (weightGrams <= 2000) return 5.99;
  if (weightGrams <= 5000) return 7.49;
  if (weightGrams <= 10000) return 9.99;
  if (weightGrams <= 20000) return 13.99;
  return 17.99;
}

function getColissimoCost(weightGrams: number): number {
  if (weightGrams <= 250) return 4.99;
  if (weightGrams <= 500) return 5.99;
  if (weightGrams <= 1000) return 6.99;
  if (weightGrams <= 2000) return 7.99;
  if (weightGrams <= 5000) return 9.49;
  if (weightGrams <= 10000) return 12.99;
  if (weightGrams <= 20000) return 17.99;
  return 22.99;
}

function getChronopostCost(weightGrams: number): number {
  if (weightGrams <= 250) return 6.99;
  if (weightGrams <= 500) return 7.99;
  if (weightGrams <= 1000) return 8.99;
  if (weightGrams <= 2000) return 10.99;
  if (weightGrams <= 5000) return 13.99;
  if (weightGrams <= 10000) return 18.99;
  if (weightGrams <= 20000) return 24.99;
  return 29.99;
}

export function CartShippingSelection({
  onShippingSelected,
  selectedMethod,
  totalWeightGrams,
}: CartShippingSelectionProps) {
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const [shippingMethod, setShippingMethod] = useState<'mondial_relay' | 'chronopost' | 'colissimo'>(
    selectedMethod || 'colissimo'
  );
  const [selectedRelayPoint, setSelectedRelayPoint] = useState<any>(null);

  const mondialRelayCost = getMondialRelayCost(totalWeightGrams);
  const colissimoCost = getColissimoCost(totalWeightGrams);
  const chronopostCost = getChronopostCost(totalWeightGrams);

  useEffect(() => {
    calculateShipping();
  }, [shippingMethod, selectedAddress, selectedRelayPoint, totalWeightGrams]);

  const calculateShipping = () => {
    let cost = 0;
    if (shippingMethod === 'mondial_relay') cost = mondialRelayCost;
    else if (shippingMethod === 'chronopost') cost = chronopostCost;
    else if (shippingMethod === 'colissimo') cost = colissimoCost;

    const shippingData: any = { method: shippingMethod, cost };

    if ((shippingMethod === 'chronopost' || shippingMethod === 'colissimo') && selectedAddress) {
      shippingData.address = selectedAddress;
    } else if (shippingMethod === 'mondial_relay' && selectedRelayPoint) {
      shippingData.relayPointId = selectedRelayPoint.id;
      shippingData.relayPointName = selectedRelayPoint.name;
      shippingData.relayPointAddress = `${selectedRelayPoint.address}, ${selectedRelayPoint.postalCode} ${selectedRelayPoint.city}`;
      if (selectedAddress) shippingData.address = selectedAddress;
    }

    onShippingSelected(shippingData);
  };

  const weightLabel = totalWeightGrams >= 1000
    ? `${(totalWeightGrams / 1000).toFixed(2)} kg`
    : `${totalWeightGrams} g`;

  return (
    <div className="space-y-2">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-xs font-bold text-gray-800">Mode de livraison</h3>
          <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
            Poids total: {weightLabel}
          </span>
        </div>

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
              <span className="font-bold text-emerald-600 text-xs">{colissimoCost.toFixed(2).replace('.', ',')} €</span>
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
              <span className="font-bold text-teal-600 text-xs">{mondialRelayCost.toFixed(2).replace('.', ',')} €</span>
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
              <span className="font-bold text-blue-600 text-xs">{chronopostCost.toFixed(2).replace('.', ',')} €</span>
              <p className="text-[9px] text-gray-500">Express</p>
            </div>
          </button>
        </div>

        {totalWeightGrams > 1000 && (
          <p className="text-[9px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mt-1.5">
            Tarifs ajustés en fonction du poids total du colis ({weightLabel})
          </p>
        )}
      </div>

      <AddressSelector
        onSelectAddress={setSelectedAddress}
        selectedAddress={selectedAddress}
      />

      {shippingMethod === 'mondial_relay' && selectedAddress && (
        <MondialRelaySelection
          postalCode={selectedAddress.postal_code}
          country={selectedAddress.country}
          weight={totalWeightGrams}
          onSelectPoint={setSelectedRelayPoint}
          selectedPointId={selectedRelayPoint?.id}
          street={selectedAddress.street}
          city={selectedAddress.city}
        />
      )}
    </div>
  );
}
