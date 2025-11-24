import { useState } from 'react';
import { Package, Download, ExternalLink, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface ShippingLabelManagerProps {
  transactionId: string;
  shippingLabelUrl?: string | null;
  trackingNumber?: string | null;
  shippingStatus?: string | null;
  onUpdate?: () => void;
}

export function ShippingLabelManager({
  transactionId,
  shippingLabelUrl,
  trackingNumber,
  shippingStatus,
  onUpdate,
}: ShippingLabelManagerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateLabel = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-shipping-label`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate label');
      }

      onUpdate?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      pending: { label: 'En attente', color: 'bg-gray-100 text-gray-800' },
      label_created: { label: 'Étiquette créée', color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Expédié', color: 'bg-green-100 text-green-800' },
      in_transit: { label: 'En transit', color: 'bg-yellow-100 text-yellow-800' },
      delivered: { label: 'Livré', color: 'bg-emerald-100 text-emerald-800' },
      exception: { label: 'Exception', color: 'bg-red-100 text-red-800' },
      cancelled: { label: 'Annulé', color: 'bg-gray-100 text-gray-800' },
    };

    const status = statusConfig[shippingStatus || 'pending'];

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
        {status.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Package className="w-6 h-6 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900">Expédition</h3>
        </div>
        {getStatusBadge()}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!shippingLabelUrl && (
        <button
          onClick={handleGenerateLabel}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Génération en cours...</span>
            </>
          ) : (
            <>
              <Package className="w-5 h-5" />
              <span>Générer l'étiquette d'expédition</span>
            </>
          )}
        </button>
      )}

      {shippingLabelUrl && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-green-700 bg-green-50 px-4 py-3 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Étiquette d'expédition créée</span>
          </div>

          <a
            href={shippingLabelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Télécharger l'étiquette (PDF)</span>
          </a>

          {trackingNumber && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <p className="text-sm text-gray-600 mb-2">Numéro de suivi</p>
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                <code className="text-sm font-mono text-gray-900">{trackingNumber}</code>
                <a
                  href={`https://tracking.sendcloud.sc/forward?carrier=&tracking_number=${trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <span>Suivre</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
