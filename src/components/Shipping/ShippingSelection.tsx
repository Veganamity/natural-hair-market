import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/database.types';
import { Truck, Package, MapPin, Plus, Check } from 'lucide-react';

type ShippingAddress = Database['public']['Tables']['shipping_addresses']['Row'];

interface ShippingSelectionProps {
  onShippingSelected: (data: {
    method: 'mondial_relay' | 'chronopost';
    cost: number;
    addressId?: string;
    relayPointId?: string;
    relayPointName?: string;
    relayPointAddress?: string;
  }) => void;
  selectedMethod?: 'mondial_relay' | 'chronopost';
}

export function ShippingSelection({ onShippingSelected, selectedMethod }: ShippingSelectionProps) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [shippingMethod, setShippingMethod] = useState<'mondial_relay' | 'chronopost'>(selectedMethod || 'mondial_relay');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedRelayPoint, setSelectedRelayPoint] = useState<any>(null);
  const [relayPoints, setRelayPoints] = useState<any[]>([]);
  const [selectedAddressForRelay, setSelectedAddressForRelay] = useState<string>('');
  const [loadingRelayPoints, setLoadingRelayPoints] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    postal_code: '',
    city: '',
    country: 'FR',
    is_default: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  useEffect(() => {
    calculateShipping();
  }, [shippingMethod, selectedAddress, selectedRelayPoint]);

  useEffect(() => {
    if (shippingMethod === 'mondial_relay' && selectedAddressForRelay) {
      const address = addresses.find(a => a.id === selectedAddressForRelay);
      if (address && address.postal_code) {
        fetchRelayPoints(address.postal_code);
      }
    }
  }, [selectedAddressForRelay, shippingMethod, addresses]);

  const fetchAddresses = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('shipping_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (data) {
      setAddresses(data);
      const defaultAddr = data.find((addr) => addr.is_default);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr.id);
      }
    }
  };

  const calculateShipping = () => {
    let cost = 0;

    if (shippingMethod === 'mondial_relay') {
      cost = 4.99;
    } else if (shippingMethod === 'chronopost') {
      cost = 8.99;
    }

    const shippingData: any = {
      method: shippingMethod,
      cost,
    };

    if (shippingMethod === 'chronopost' && selectedAddress) {
      shippingData.addressId = selectedAddress;
    } else if (shippingMethod === 'mondial_relay' && selectedRelayPoint) {
      shippingData.relayPointId = selectedRelayPoint.id;
      shippingData.relayPointName = selectedRelayPoint.name;
      shippingData.relayPointAddress = selectedRelayPoint.address;
    }

    onShippingSelected(shippingData);
  };

  const fetchRelayPoints = async (postalCode: string) => {
    setLoadingRelayPoints(true);
    try {
      const mockRelayPointsByZip: Record<string, any[]> = {
        '75001': [
          { id: 'MR001', name: 'Relay Point Tabac Presse', address: '15 Rue de la République, 75001 Paris', distance: '0.5 km' },
          { id: 'MR002', name: 'Relay Point Supermarché', address: '42 Rue de Rivoli, 75001 Paris', distance: '0.8 km' },
        ],
        '75008': [
          { id: 'MR003', name: 'Relay Point Supermarché', address: '42 Avenue des Champs-Élysées, 75008 Paris', distance: '0.3 km' },
          { id: 'MR004', name: 'Relay Point Pharmacie', address: '78 Rue du Faubourg Saint-Honoré, 75008 Paris', distance: '1.0 km' },
        ],
        '75005': [
          { id: 'MR005', name: 'Relay Point Boulangerie', address: '8 Boulevard Saint-Germain, 75005 Paris', distance: '0.4 km' },
          { id: 'MR006', name: 'Relay Point Librairie', address: '25 Rue des Écoles, 75005 Paris', distance: '0.9 km' },
        ],
      };

      const zipPrefix = postalCode.substring(0, 5);
      const points = mockRelayPointsByZip[zipPrefix] || [
        { id: `MR_${postalCode}_1`, name: 'Relay Point Centre-ville', address: `12 Rue Principale, ${postalCode}`, distance: '0.5 km' },
        { id: `MR_${postalCode}_2`, name: 'Relay Point Commerce', address: `45 Avenue de la Gare, ${postalCode}`, distance: '1.2 km' },
      ];

      setRelayPoints(points);
    } catch (error) {
      console.error('Error fetching relay points:', error);
      setRelayPoints([]);
    } finally {
      setLoadingRelayPoints(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { data, error } = await supabase
      .from('shipping_addresses')
      .insert({
        ...newAddress,
        user_id: user.id,
      })
      .select()
      .single();

    if (!error && data) {
      setAddresses([...addresses, data]);
      setSelectedAddress(data.id);
      setShowAddressForm(false);
      setNewAddress({
        full_name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        postal_code: '',
        city: '',
        country: 'FR',
        is_default: false,
      });
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Choisir le mode de livraison</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setShippingMethod('mondial_relay')}
            className={`p-4 border-2 rounded-xl transition-all ${
              shippingMethod === 'mondial_relay'
                ? 'border-teal-600 bg-teal-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <Package className="w-6 h-6 text-teal-600 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-800">Mondial Relay</h4>
                  <span className="font-bold text-teal-600">4,99€</span>
                </div>
                <p className="text-sm text-gray-600">
                  Retrait en point relais sous 3-5 jours
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
                ? 'border-teal-600 bg-teal-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <Truck className="w-6 h-6 text-teal-600 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-800">Chronopost</h4>
                  <span className="font-bold text-teal-600">8,99€</span>
                </div>
                <p className="text-sm text-gray-600">
                  Livraison à domicile sous 24-48h
                </p>
              </div>
              {shippingMethod === 'chronopost' && (
                <Check className="w-5 h-5 text-teal-600" />
              )}
            </div>
          </button>
        </div>
      </div>

      {shippingMethod === 'mondial_relay' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-600" />
              Choisir un point relais
            </h4>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Ajouter une adresse
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={newAddress.full_name}
                  onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  required
                />
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Adresse ligne 1"
                value={newAddress.address_line1}
                onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                required
              />
              <input
                type="text"
                placeholder="Adresse ligne 2 (optionnel)"
                value={newAddress.address_line2}
                onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Code postal"
                  value={newAddress.postal_code}
                  onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Ville"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="default-address-relay"
                  checked={newAddress.is_default}
                  onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="default-address-relay" className="text-sm text-gray-700">
                  Définir comme adresse par défaut
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors text-sm"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          {addresses.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4 mb-4">
              Aucune adresse enregistrée. Ajoutez une adresse pour voir les points relais disponibles.
            </p>
          ) : (
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionnez votre adresse
              </label>
              {addresses.map((address) => (
                <button
                  key={address.id}
                  onClick={() => setSelectedAddressForRelay(address.id)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedAddressForRelay === address.id
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{address.full_name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.address_line1}
                        {address.address_line2 && `, ${address.address_line2}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.postal_code} {address.city}
                      </p>
                      {address.is_default && (
                        <span className="inline-block mt-2 px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded">
                          Adresse par défaut
                        </span>
                      )}
                    </div>
                    {selectedAddressForRelay === address.id && (
                      <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {loadingRelayPoints && (
            <p className="text-center text-gray-500 py-4">Recherche des points relais...</p>
          )}

          {!loadingRelayPoints && selectedAddressForRelay && relayPoints.length === 0 && (
            <p className="text-center text-gray-500 py-4">Aucun point relais trouvé pour cette adresse.</p>
          )}

          {!loadingRelayPoints && relayPoints.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Points relais disponibles</h5>
              <div className="space-y-2">
                {relayPoints.map((point) => (
                  <button
                    key={point.id}
                    onClick={() => setSelectedRelayPoint(point)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      selectedRelayPoint?.id === point.id
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{point.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{point.address}</p>
                        <p className="text-xs text-teal-600 mt-1">{point.distance}</p>
                      </div>
                      {selectedRelayPoint?.id === point.id && (
                        <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {shippingMethod === 'chronopost' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-600" />
              Adresse de livraison
            </h4>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Ajouter une adresse
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={newAddress.full_name}
                  onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  required
                />
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Adresse ligne 1"
                value={newAddress.address_line1}
                onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                required
              />
              <input
                type="text"
                placeholder="Adresse ligne 2 (optionnel)"
                value={newAddress.address_line2}
                onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Code postal"
                  value={newAddress.postal_code}
                  onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Ville"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="default-address"
                  checked={newAddress.is_default}
                  onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="default-address" className="text-sm text-gray-700">
                  Définir comme adresse par défaut
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors text-sm"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          {addresses.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              Aucune adresse enregistrée. Ajoutez une adresse de livraison.
            </p>
          ) : (
            <div className="space-y-2">
              {addresses.map((address) => (
                <button
                  key={address.id}
                  onClick={() => setSelectedAddress(address.id)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedAddress === address.id
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{address.full_name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.address_line1}
                        {address.address_line2 && `, ${address.address_line2}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.postal_code} {address.city}
                      </p>
                      <p className="text-sm text-gray-600">{address.phone}</p>
                      {address.is_default && (
                        <span className="inline-block mt-2 px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded">
                          Adresse par défaut
                        </span>
                      )}
                    </div>
                    {selectedAddress === address.id && (
                      <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
