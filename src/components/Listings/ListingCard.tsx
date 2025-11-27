import { Heart, MapPin, Calendar, Globe, BadgeCheck } from 'lucide-react';
import { Database } from '../../lib/database.types';

type Listing = Database['public']['Tables']['listings']['Row'];

interface ListingCardProps {
  listing: Listing;
  seller?: any;
  onMessage?: (listing: Listing, seller: any) => void;
  onFavoriteChange?: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: (listingId: string) => void;
  isFavorited?: boolean;
  onClick?: () => void;
}

export function ListingCard({
  listing,
  seller,
  onMessage,
  onFavoriteChange,
  isFavorite,
  onFavoriteToggle,
  isFavorited,
  onClick
}: ListingCardProps) {
  const isOldApi = onFavoriteToggle !== undefined;
  const isFav = isOldApi ? isFavorited : isFavorite;
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
    return `${cm}cm (${inches} pouces)`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
      <div className="relative" onClick={onClick}>
        <img
          src={mainImage}
          alt={listing.title}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isOldApi && onFavoriteToggle) {
              onFavoriteToggle(listing.id);
            } else if (onFavoriteChange) {
              onFavoriteChange();
            }
          }}
          className={`absolute top-1.5 right-1.5 p-1 rounded-full backdrop-blur-sm transition-colors ${
            isFav
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-gray-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-1.5 left-1.5 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
          {listing.price}€
        </div>
      </div>

      <div className="p-2.5" onClick={onClick}>
        <h3 className="text-sm font-bold text-gray-800 mb-1.5 line-clamp-1">
          {listing.title}
        </h3>

        <div className="space-y-1 mb-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="font-medium">{formatLength(listing.hair_length)}</span>
            <span>•</span>
            <span>{hairTypeLabels[listing.hair_type] || listing.hair_type}</span>
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-medium">Couleur:</span> {listing.hair_color}
          </div>
          {listing.country && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Globe className="w-3 h-3 text-emerald-600" />
              <span className="font-medium">{listing.country}</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-xs mb-2 line-clamp-2">
          {listing.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-1.5">
          <div className="flex items-center gap-0.5">
            <Calendar className="w-3 h-3" />
            <span className="text-[10px]">{formatDate(listing.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            {seller?.is_certified_salon && (
              <div className="flex items-center gap-0.5 bg-blue-50 px-1.5 py-0.5 rounded-full" title="Salon Certifié">
                <BadgeCheck className="w-3 h-3 text-blue-600" />
                <span className="text-[10px] text-blue-700 font-medium">Salon Certifié</span>
              </div>
            )}
            {listing.status === 'active' && (
              <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium text-[10px]">
                Dispo
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
