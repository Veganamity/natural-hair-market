import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, Plus, CreditCard as Edit2, Trash2, Check, X, Star } from 'lucide-react';
import { addressService, SavedAddress, AddressInput } from '../../lib/addressService';

interface AddressFormData {
  full_name: string;
  address_line1: string;
  address_line2: string;
  postal_code: string;
  city: string;
  country: string;
  phone: string;
  is_default: boolean;
}

export function AddressManagement() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
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
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

      if (editingId) {
        await addressService.update(editingId, addressInput);
        alert('Adresse mise à jour avec succès');
      } else {
        await addressService.create(addressInput);
        alert('Adresse ajoutée avec succès');
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchAddresses();
    } catch (error: any) {
      console.error('Error saving address:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  const handleEdit = (address: SavedAddress) => {
    setFormData({
      full_name: address.full_name,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      postal_code: address.postal_code,
      city: address.city,
      country: address.country,
      phone: address.phone,
      is_default: address.is_default,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette adresse ?')) return;

    try {
      await addressService.delete(id);
      alert('Adresse supprimée avec succès');
      fetchAddresses();
    } catch (error: any) {
      console.error('Error deleting address:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressService.setDefault(id);
      fetchAddresses();
    } catch (error: any) {
      console.error('Error setting default:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  const resetForm = () => {
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
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MapPin className="w-7 h-7 text-teal-600" />
          Mes Adresses
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter une adresse
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {editingId ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="is_default" className="text-sm text-gray-700">
                Définir comme adresse par défaut
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {addresses.length === 0 && !showForm && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Aucune adresse enregistrée</p>
          </div>
        )}

        {addresses.map((address) => (
          <div
            key={address.id}
            className="bg-white rounded-xl shadow-md p-6 relative"
          >
            {address.is_default && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                  <Star className="w-3 h-3 fill-current" />
                  Par défaut
                </span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-1">{address.full_name}</h3>
            </div>

            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <p>{address.address_line1}</p>
              {address.address_line2 && <p>{address.address_line2}</p>}
              <p>{address.postal_code} {address.city}</p>
              <p>{address.country}</p>
              <p>Tél: {address.phone}</p>
            </div>

            <div className="flex gap-2">
              {!address.is_default && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-semibold hover:bg-yellow-200 transition-colors flex items-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Définir par défaut
                </button>
              )}
              <button
                onClick={() => handleEdit(address)}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => handleDelete(address.id)}
                className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
