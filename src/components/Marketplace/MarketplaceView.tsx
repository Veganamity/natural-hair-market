import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { ListingCard } from '../Listings/ListingCard';
import { ListingListItem } from '../Listings/ListingListItem';
import { ListingDetails } from '../Listings/ListingDetails';
import { Database } from '../../lib/database.types';
import { Search, SlidersHorizontal, ArrowUpDown, Grid, List } from 'lucide-react';

type Listing = Database['public']['Tables']['listings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface MarketplaceViewProps {
  onListingClick?: () => void;
  isGuest?: boolean;
}

export function MarketplaceView({ onListingClick, isGuest = false }: MarketplaceViewProps) {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchListings();
    fetchFavorites();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching listings:', error);
    }

    if (data) {
      console.log('Fetched listings:', data);
      setListings(data);
    }
    setLoading(false);
  };

  const fetchFavorites = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('favorites')
      .select('listing_id')
      .eq('user_id', user.id);

    if (data) {
      setFavorites(new Set(data.map((fav) => fav.listing_id)));
    }
  };

  const handleFavoriteToggle = async (listingId: string) => {
    if (!user) {
      if (onListingClick) onListingClick();
      return;
    }

    if (favorites.has(listingId)) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);

      setFavorites((prev) => {
        const newSet = new Set(prev);
        newSet.delete(listingId);
        return newSet;
      });
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, listing_id: listingId });

      setFavorites((prev) => new Set(prev).add(listingId));
    }
  };

  const filteredAndSortedListings = (() => {
    let filtered = listings.filter((listing) => {
      const matchesSearch =
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.hair_color.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterType === 'all' || listing.hair_type === filterType;

      const matchesPriceRange =
        (!minPrice || listing.price >= parseFloat(minPrice)) &&
        (!maxPrice || listing.price <= parseFloat(maxPrice));

      return matchesSearch && matchesFilter && matchesPriceRange;
    });

    switch (sortBy) {
      case 'recent':
        return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'price_asc':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return filtered.sort((a, b) => b.price - a.price);
      case 'relevant':
      default:
        return filtered;
    }
  })();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des annonces...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher des cheveux..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">Tous types</option>
                <option value="straight">Raides</option>
                <option value="wavy">Ondulés</option>
                <option value="curly">Bouclés</option>
                <option value="coily">Frisés</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="relevant">Pertinence</option>
                <option value="recent">Plus récent</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
              <label className="text-sm font-semibold text-gray-700">Fourchette de prix :</label>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <span className="text-gray-500 text-sm">€</span>
                {(minPrice || maxPrice) && (
                  <button
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('');
                    }}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Vue liste"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Vue grille"
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredAndSortedListings.map((listing) => (
            <ListingListItem
              key={listing.id}
              listing={listing}
              onFavoriteToggle={handleFavoriteToggle}
              isFavorited={favorites.has(listing.id)}
              onClick={() => {
                if (isGuest && onListingClick) {
                  onListingClick();
                } else {
                  setSelectedListing(listing);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
          {filteredAndSortedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onFavoriteToggle={handleFavoriteToggle}
              isFavorited={favorites.has(listing.id)}
              onClick={() => {
                if (isGuest && onListingClick) {
                  onListingClick();
                } else {
                  setSelectedListing(listing);
                }
              }}
            />
          ))}
        </div>
      )}

      {selectedListing && !isGuest && (
        <ListingDetails
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onFavoriteToggle={handleFavoriteToggle}
          isFavorited={favorites.has(selectedListing.id)}
        />
      )}
    </div>
  );
}
