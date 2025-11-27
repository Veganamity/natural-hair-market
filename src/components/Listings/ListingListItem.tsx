import { Heart, MapPin, Calendar, Globe, BadgeCheck } from 'lucide-react';
import { Database } from '../../lib/database.types';

type Listing = Database['public']['Tables']['listings']['Row'];

interface ListingListItemProps {
  listing: Listing;
  seller?: any;
  onFavoriteToggle?: (listingId: string) => void;
  isFavorited?: boolean;
  onClick?: () => void;
}

export function ListingListItem({
  listing,
  seller,
  onFavoriteToggle,
  isFavorited,
  onClick
}: ListingListItemProps) {
  const images = Array.isArray(listing.images) ? listing.images : [];
  const mainImage = images[0] || 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg';

  const hairTypeLabels: Record<string, string> = {
    straight: 'Raides',
    wavy: 'Ondulés',
    curly: 'Bouclés',
    coily: 'Frisés',
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const cmToInches = (cm: number) => Math.round(cm / 2.54);

  const formatLength = (lengthStr: string) => {
    const cm = parseInt(lengthStr);
    if (isNaN(cm)) return lengthStr;
    const inches = cmToInches(cm);
    return `${cm}cm (${inches}")`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
      <div className="flex flex-col sm:flex-row gap-4 p-4" onClick={onClick}>
        <div className="relative w-full sm:w-48 h-48 sm:h-32 flex-shrink-0">
          <img
            src={mainImage}
            alt={listing.title}
            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onFavoriteToggle) {
                onFavoriteToggle(listing.id);
              }
            }}
            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-colors ${
              isFavorited
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                {listing.title}
              </h3>
              <div className="flex-shrink-0 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-base font-bold">
                {listing.price}€
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
              <span className="font-medium">{formatLength(listing.hair_length)}</span>
              <span>•</span>
              <span>{hairTypeLabels[listing.hair_type] || listing.hair_type}</span>
              <span>•</span>
              <span className="font-medium">Couleur: {listing.hair_color}</span>
              {listing.country && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-medium">{listing.country}</span>
                  </div>
                </>
              )}
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
              {listing.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(listing.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              {seller?.is_certified_salon && (
                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full" title="Salon Certifié">
                  <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs text-blue-700 font-medium">Salon Certifié</span>
                </div>
              )}
              {listing.status === 'active' && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  Disponible
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
