import { useState } from 'react';
import { Package, Download, ExternalLink, Loader2, CheckCircle, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface ShippingLabelManagerProps {
  transactionId: string;
  shippingLabelUrl?: string | null;
  trackingNumber?: string | null;
  shippingStatus?: string | null;
  relayPointName?: string | null;
  relayPointAddress?: string | null;
  relayPointId?: string | null;
  shippingMethod?: string | null;
  sendcloudParcelId?: string | null;
  onUpdate?: () => void;
}

export function ShippingLabelManager({
  transactionId,
  shippingLabelUrl,
  trackingNumber,
  shippingStatus,
  relayPointName,
  relayPointAddress,
  relayPointId,
  shippingMethod,
  sendcloudParcelId,
  onUpdate,
}: ShippingLabelManagerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedLabelUrl, setGeneratedLabelUrl] = useState<string | null>(null);

  // Service point delivery whenever a relay point ID is stored
  const isMondialRelay = !!relayPointId || shippingMethod === 'mondial_relay';
  const activeLabelUrl = generatedLabelUrl || shippingLabelUrl;

  // Label was created (has parcel ID or label_created status) but URL is missing
  const labelCreatedButMissing = !activeLabelUrl && (sendcloudParcelId || shippingStatus === 'label_created');

  const callGenerateLabel = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-shipping-label`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId }),
      }
    );

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Échec de la génération de l'étiquette");
    return result.shipping_label_url as string | null;
  };

  const handleGenerateLabel = async () => {
    setLoading(true);
    setError('');

    try {
      const labelUrl = await callGenerateLabel();
      if (labelUrl) {
        setGeneratedLabelUrl(labelUrl);
      }
      onUpdate?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = 'etiquette-expedition.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, '_blank');
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
          <h3 className="text-lg font-semibold text-gray-900">
            Expédition {isMondialRelay ? '— Mondial Relay' : ''}
          </h3>
        </div>
        {getStatusBadge()}
      </div>

      {isMondialRelay && (relayPointName || relayPointAddress) && (
        <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-teal-800 uppercase tracking-wide mb-1">Point relais de destination (acheteur)</p>
              {relayPointName && <p className="text-sm font-semibold text-teal-900">{relayPointName}</p>}
              {relayPointAddress && <p className="text-xs text-teal-700">{relayPointAddress}</p>}
              {relayPointId && <p className="text-xs text-teal-600 mt-0.5">ID : {relayPointId}</p>}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* No label yet — show generate button */}
      {!activeLabelUrl && !labelCreatedButMissing && (
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

      {/* Label was created but URL missing — show retry button */}
      {labelCreatedButMissing && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-amber-700 bg-amber-50 px-4 py-3 rounded-lg border border-amber-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Étiquette créée — lien de téléchargement indisponible</span>
          </div>
          <button
            onClick={handleGenerateLabel}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Récupération en cours...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>Récupérer l'étiquette</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Label URL available — show download button */}
      {activeLabelUrl && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-green-700 bg-green-50 px-4 py-3 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Étiquette d'expédition prête</span>
          </div>

          <button
            onClick={() => handleDownload(activeLabelUrl)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Télécharger l'étiquette (PDF)</span>
          </button>

          {trackingNumber && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <p className="text-sm text-gray-600 mb-2">Numéro de suivi</p>
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                <code className="text-sm font-mono text-gray-900">{trackingNumber}</code>
                {isMondialRelay ? (
                  <a
                    href={`https://www.mondialrelay.fr/suivi-de-colis/?numeroExpedition=${trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <span>Suivre</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <a
                    href={`https://tracking.sendcloud.sc/forward?carrier=&tracking_number=${trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <span>Suivre</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
