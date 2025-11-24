import { useState, useEffect } from 'react';
import { Truck, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface ShippingMethod {
  id: number;
  name: string;
  carrier: string;
  price: number;
  currency: string;
  service_point_required: boolean;
}

interface ShippingMethodSelectorProps {
  country: string;
  postalCode: string;
  weight: number;
  onSelect: (method: ShippingMethod) => void;
  selectedMethodId?: number;
}

export function ShippingMethodSelector({
  country,
  postalCode,
  weight,
  onSelect,
  selectedMethodId,
}: ShippingMethodSelectorProps) {
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (country && postalCode && weight) {
      fetchShippingMethods();
    }
  }, [country, postalCode, weight]);

  const fetchShippingMethods = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Non authentifié');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-shipping-methods`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country,
          postal_code: postalCode,
          weight,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la récupération des méthodes d\'expédition';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Erreur HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.shipping_methods || data.shipping_methods.length === 0) {
        setError('Aucune méthode d\'expédition disponible. Vérifiez la configuration Sendcloud.');
        setMethods([]);
        return;
      }

      setMethods(data.shipping_methods);

      if (data.shipping_methods.length > 0 && !selectedMethodId) {
        onSelect(data.shipping_methods[0]);
      }
    } catch (err) {
      console.error('Erreur récupération transporteurs:', err);
      setError((err as Error).message);
      setMethods([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMethod = (method: ShippingMethod) => {
    onSelect(method);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
          <span className="text-gray-600">Chargement des méthodes d'expédition...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (methods.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
        <p className="text-sm">Aucune méthode d'expédition disponible pour cette destination.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 mb-3">
        <Truck className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">Choisir le transporteur</h3>
      </div>

      <div className="space-y-2">
        {methods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedMethodId === method.id
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="shipping_method"
                value={method.id}
                checked={selectedMethodId === method.id}
                onChange={() => handleSelectMethod(method)}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <p className="font-semibold text-gray-900">{method.carrier}</p>
                <p className="text-sm text-gray-600">{method.name}</p>
                {method.service_point_required && (
                  <p className="text-xs text-blue-600 mt-1">Point relais requis</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">
                {method.price.toFixed(2)} {method.currency}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
