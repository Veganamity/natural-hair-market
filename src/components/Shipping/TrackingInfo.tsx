import { Package, ExternalLink, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';

interface TrackingInfoProps {
  trackingNumber?: string | null;
  shippingStatus?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
}

export function TrackingInfo({
  trackingNumber,
  shippingStatus,
  shippedAt,
  deliveredAt,
}: TrackingInfoProps) {
  const getStatusIcon = () => {
    switch (shippingStatus) {
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'shipped':
      case 'in_transit':
        return <Truck className="w-6 h-6 text-blue-600" />;
      case 'exception':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (shippingStatus) {
      case 'pending':
        return 'En attente d\'expédition';
      case 'label_created':
        return 'Étiquette créée - En attente d\'envoi';
      case 'shipped':
        return 'Colis expédié';
      case 'in_transit':
        return 'En cours de livraison';
      case 'delivered':
        return 'Colis livré';
      case 'exception':
        return 'Problème de livraison';
      case 'cancelled':
        return 'Expédition annulée';
      default:
        return 'En attente d\'expédition';
    }
  };

  const getStatusColor = () => {
    switch (shippingStatus) {
      case 'delivered':
        return 'bg-green-50 border-green-200';
      case 'shipped':
      case 'in_transit':
        return 'bg-blue-50 border-blue-200';
      case 'exception':
        return 'bg-red-50 border-red-200';
      case 'cancelled':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`rounded-lg border p-6 ${getStatusColor()}`}>
      <div className="flex items-start space-x-4">
        {getStatusIcon()}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Suivi de livraison
          </h3>
          <p className="text-sm text-gray-700 mb-4">{getStatusMessage()}</p>

          {trackingNumber && (
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-600 mb-1">Numéro de suivi</p>
              <code className="text-sm font-mono text-gray-900 font-medium">
                {trackingNumber}
              </code>
            </div>
          )}

          {shippedAt && (
            <div className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Expédié le :</span>{' '}
              {formatDate(shippedAt)}
            </div>
          )}

          {deliveredAt && (
            <div className="text-sm text-gray-700 mb-4">
              <span className="font-medium">Livré le :</span>{' '}
              {formatDate(deliveredAt)}
            </div>
          )}

          {trackingNumber && shippingStatus !== 'pending' && shippingStatus !== 'cancelled' && (
            <a
              href={`https://tracking.sendcloud.sc/forward?carrier=&tracking_number=${trackingNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              <Package className="w-4 h-4" />
              <span>Suivre mon colis</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
