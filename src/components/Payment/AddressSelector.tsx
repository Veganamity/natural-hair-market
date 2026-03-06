import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, Plus, Check } from 'lucide-react';
import { addressService, SavedAddress, AddressInput } from '../../lib/addressService';

interface AddressSelectorProps {
  onSelectAddress: (address: SavedAddress) => void;
  selectedAddressId?: string;
}

export function AddressSelector({ onSelectAddress, selectedAddressId }: AddressSelectorProps) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    address_line1: '',
    address_line2: '',
    postal_code: '',
    city: '',
    country: 'FR',
    phone: '',
    is_default: false,
  });

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const data = await addressService.list();

      setAddresses(data || []);

      if (data && data.length > 0 && !selectedAddressId) {
        const defaultAddress = data.find(addr => addr.is_default) || data[0];
        onSelectAddress(defaultAddress);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const addressInput: AddressInput = {
        full_name: formData.full_name,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2 || undefined,
        postal_code: formData.postal_code,
        city: formData.city,
        country: formData.country,
        phone: formData.phone,
        is_default: formData.is_default,
      };

      const newAddress = await addressService.create(addressInput);

      alert('Adresse ajoutée avec succès');
      setShowNewAddressForm(false);
      setFormData({
        full_name: '',
        address_line1: '',
        address_line2: '',
        postal_code: '',
        city: '',
        country: 'FR',
        phone: '',
        is_default: false,
      });

      await fetchAddresses();

      if (newAddress) {
        onSelectAddress(newAddress);
      }
    } catch (error: any) {
      console.error('Error saving address:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Chargement des adresses...</div>;
  }

  if (showNewAddressForm) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-800">Nouvelle adresse</h3>
          <button
            onClick={() => setShowNewAddressForm(false)}
            className="text-xs text-gray-600 hover:text-gray-800"
          >
            Retour
          </button>
        </div>

        <form onSubmit={handleSubmitNewAddress} className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-0.5">
              Nom complet
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-0.5">
              Adresse
            </label>
            <input
              type="text"
              value={formData.address_line1}
              onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-0.5">
              Complement (optionnel)
            </label>
            <input
              type="text"
              value={formData.address_line2}
              onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">
                Code postal
              </label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">
                Ville
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">
                Pays
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="FR">France</option>
                <option value="BE">Belgique</option>
                <option value="CH">Suisse</option>
                <option value="LU">Luxembourg</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">
                Telephone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-3 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors text-sm"
          >
            Ajouter l'adresse
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-800">Adresse de livraison</h3>
        <button
          onClick={() => setShowNewAddressForm(true)}
          className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Nouvelle
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-600 mb-2">Aucune adresse</p>
          <button
            onClick={() => setShowNewAddressForm(true)}
            className="px-3 py-1.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors inline-flex items-center gap-1 text-xs"
          >
            <Plus className="w-3 h-3" />
            Ajouter
          </button>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => onSelectAddress(address)}
              className={`border rounded-lg p-2 cursor-pointer transition-all ${
                selectedAddressId === address.id
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-teal-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-semibold text-gray-800 text-xs truncate">{address.full_name}</h4>
                    {address.is_default && (
                      <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 text-[9px] font-semibold rounded flex-shrink-0">
                        Defaut
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-600 truncate">{address.address_line1}</p>
                  <p className="text-[10px] text-gray-600">
                    {address.postal_code} {address.city}
                  </p>
                </div>
                {selectedAddressId === address.id && (
                  <div className="ml-2 flex-shrink-0">
                    <div className="w-4 h-4 bg-teal-600 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
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
