import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, Plus, Check } from 'lucide-react';

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
    label: '',
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
      const { data, error } = await supabase
        .from('saved_addresses')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

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
      const { data, error } = await supabase
        .from('saved_addresses')
        .insert([{ ...formData, user_id: user!.id }])
        .select()
        .single();

      if (error) throw error;

      alert('Adresse ajoutée avec succès');
      setShowNewAddressForm(false);
      setFormData({
        label: '',
        full_name: '',
        address_line1: '',
        address_line2: '',
        postal_code: '',
        city: '',
        country: 'FR',
        phone: '',
        is_default: false,
      });
      fetchAddresses();

      if (data) {
        onSelectAddress(data);
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">Nouvelle adresse de livraison</h3>
          <button
            onClick={() => setShowNewAddressForm(false)}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Retour
          </button>
        </div>

        <form onSubmit={handleSubmitNewAddress} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label (ex: Maison, Travail)
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse ligne 1
            </label>
            <input
              type="text"
              value={formData.address_line1}
              onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse ligne 2 (optionnel)
            </label>
            <input
              type="text"
              value={formData.address_line2}
              onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code postal
              </label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="FR">France</option>
                <option value="BE">Belgique</option>
                <option value="CH">Suisse</option>
                <option value="LU">Luxembourg</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            Ajouter l'adresse
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800">Adresse de livraison</h3>
        <button
          onClick={() => setShowNewAddressForm(true)}
          className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Nouvelle adresse
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">Aucune adresse enregistrée</p>
          <button
            onClick={() => setShowNewAddressForm(true)}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter une adresse
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => onSelectAddress(address)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedAddressId === address.id
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-teal-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-gray-800">{address.label}</h4>
                    {address.is_default && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                        Par défaut
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 font-medium">{address.full_name}</p>
                  <p className="text-sm text-gray-600 mt-1">{address.address_line1}</p>
                  {address.address_line2 && (
                    <p className="text-sm text-gray-600">{address.address_line2}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    {address.postal_code} {address.city}
                  </p>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                </div>
                {selectedAddressId === address.id && (
                  <div className="ml-4">
                    <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
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
