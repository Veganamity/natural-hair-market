import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { MapPin, Check, AlertCircle } from 'lucide-react';
import { COUNTRIES, EU_COUNTRIES, WORLD_COUNTRIES } from '../../lib/countries';

export interface ShippingAddress {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  postal_code: string;
  city: string;
  country: string;
  phone: string;
}

interface AddressSelectorProps {
  onSelectAddress: (address: ShippingAddress) => void;
  selectedAddress?: ShippingAddress | null;
}

export function AddressSelector({ onSelectAddress, selectedAddress }: AddressSelectorProps) {
  const { user } = useAuth();
  const [profileAddress, setProfileAddress] = useState<ShippingAddress | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ShippingAddress>({
    full_name: '',
    address_line1: '',
    address_line2: '',
    postal_code: '',
    city: '',
    country: 'FR',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfileAddress();
    }
  }, [user]);

  const fetchProfileAddress = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, phone, address_line1, address_line2, postal_code, city, country')
        .eq('id', user!.id)
        .maybeSingle();

      if (error) throw error;

      if (profile && profile.address_line1 && profile.postal_code && profile.city) {
        const address: ShippingAddress = {
          full_name: profile.full_name || '',
          address_line1: profile.address_line1,
          address_line2: profile.address_line2 || '',
          postal_code: profile.postal_code,
          city: profile.city,
          country: profile.country || 'FR',
          phone: profile.phone || '',
        };
        setProfileAddress(address);
        setFormData(address);
        onSelectAddress(address);
      } else {
        setFormData({
          full_name: profile?.full_name || '',
          address_line1: '',
          address_line2: '',
          postal_code: '',
          city: '',
          country: 'FR',
          phone: profile?.phone || '',
        });
        setEditMode(true);
      }
    } catch (error) {
      console.error('Error fetching profile address:', error);
      setEditMode(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.address_line1 || !formData.postal_code || !formData.city || !formData.phone) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2 || null,
          postal_code: formData.postal_code,
          city: formData.city,
          country: formData.country,
        })
        .eq('id', user!.id);

      if (error) throw error;

      setProfileAddress(formData);
      onSelectAddress(formData);
      setEditMode(false);
    } catch (error: any) {
      console.error('Error saving address:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-sm text-gray-500">Chargement...</div>;
  }

  if (editMode || !profileAddress) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            Adresse de livraison
          </h3>
          {profileAddress && (
            <button
              onClick={() => setEditMode(false)}
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
          )}
        </div>

        {!profileAddress && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              Veuillez renseigner votre adresse de livraison. Elle sera sauvegardee dans votre profil.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Nom complet *
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Adresse *
            </label>
            <input
              type="text"
              value={formData.address_line1}
              onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
              placeholder="Numero et nom de rue"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Complement d'adresse
            </label>
            <input
              type="text"
              value={formData.address_line2}
              onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
              placeholder="Batiment, etage, etc."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Code postal *
              </label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Ville *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Pays *
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <optgroup label="France">
                  <option value="FR">France</option>
                </optgroup>
                <optgroup label="Europe">
                  {EU_COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Monde entier">
                  {WORLD_COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Telephone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="06 12 34 56 78"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors text-sm"
          >
            Confirmer l'adresse
          </button>
        </form>
      </div>
    );
  }

  const handleCountryChange = (newCountry: string) => {
    const updated = { ...profileAddress!, country: newCountry };
    setProfileAddress(updated);
    setFormData(updated);
    onSelectAddress(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-teal-600" />
          Adresse de livraison
        </h3>
        <button
          onClick={() => setEditMode(true)}
          className="text-xs text-teal-600 hover:text-teal-700 font-medium"
        >
          Modifier
        </button>
      </div>

      <div className="border border-teal-500 bg-teal-50 rounded-lg p-3 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 text-sm">{profileAddress!.full_name}</h4>
            <p className="text-xs text-gray-600 mt-1">{profileAddress!.address_line1}</p>
            {profileAddress!.address_line2 && (
              <p className="text-xs text-gray-600">{profileAddress!.address_line2}</p>
            )}
            <p className="text-xs text-gray-600">
              {profileAddress!.postal_code} {profileAddress!.city}
            </p>
            <p className="text-xs text-gray-600">{profileAddress!.phone}</p>
          </div>
          <div className="ml-2 flex-shrink-0">
            <div className="w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        <div className="border-t border-teal-200 pt-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Pays de livraison
          </label>
          <select
            value={profileAddress!.country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
          >
            <optgroup label="France">
              <option value="FR">France</option>
            </optgroup>
            <optgroup label="Europe">
              {EU_COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </optgroup>
            <optgroup label="Monde entier">
              {WORLD_COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  );
}
