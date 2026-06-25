import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ListingCard } from '../Listings/ListingCard';
import { ListingListItem } from '../Listings/ListingListItem';
import { ListingDetails } from '../Listings/ListingDetails';
import { Database } from '../../lib/database.types';
import { Search, SlidersHorizontal, Grid2x2 as Grid, List, X, ChevronDown } from 'lucide-react';

type Listing = Database['public']['Tables']['listings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface MarketplaceViewProps {
  onListingClick?: () => void;
  isGuest?: boolean;
  initialListingId?: string | null;
  onSellerClick?: (sellerId: string) => void;
  externalSearch?: string;
}

export function MarketplaceView({ onListingClick, isGuest = false, initialListingId, onSellerClick, externalSearch }: MarketplaceViewProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(externalSearch ?? '');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minLength, setMinLength] = useState('');
  const [maxLength, setMaxLength] = useState('');
  const [lengthUnit, setLengthUnit] = useState<'cm' | 'inches'>('cm');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const cmToInches = (cm: number) => Math.round(cm / 2.54);
  const inchesToCm = (inches: number) => Math.round(inches * 2.54);

  const activeFilterCount = [
    filterType !== 'all',
    minPrice !== '',
    maxPrice !== '',
    minLength !== '',
    maxLength !== '',
  ].filter(Boolean).length;

  useEffect(() => {
    fetchListings();
    fetchFavorites();
  }, []);

  useEffect(() => {
    if (externalSearch !== undefined) setSearchQuery(externalSearch);
  }, [externalSearch]);

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        profiles:seller_id (
          id,
          full_name,
          email,
          avatar_url,
          location,
          is_certified_salon,
          is_verified_salon
        )
      `)
      .in('status', ['active', 'sold'])
      .order('status', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching listings:', error);
    }

    if (data) {
      console.log('Fetched listings with profiles:', data);
      setListings(data);
      if (initialListingId) {
        const target = data.find((l) => l.id === initialListingId);
        if (target) setSelectedListing(target);
      }
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

      const minLengthCm = minLength ? (lengthUnit === 'cm' ? parseFloat(minLength) : inchesToCm(parseFloat(minLength))) : null;
      const maxLengthCm = maxLength ? (lengthUnit === 'cm' ? parseFloat(maxLength) : inchesToCm(parseFloat(maxLength))) : null;
      const listingLengthCm = listing.hair_length ? parseFloat(listing.hair_length) : null;

      const matchesLengthRange =
        (!minLengthCm || (listingLengthCm !== null && listingLengthCm >= minLengthCm)) &&
        (!maxLengthCm || (listingLengthCm !== null && listingLengthCm <= maxLengthCm));

      return matchesSearch && matchesFilter && matchesPriceRange && matchesLengthRange;
    });

    const statusWeight = (s: string) => (s === 'active' ? 0 : 1);

    switch (sortBy) {
      case 'recent':
        return filtered.sort((a, b) =>
          statusWeight(a.status) - statusWeight(b.status) ||
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'price_asc':
        return filtered.sort((a, b) =>
          statusWeight(a.status) - statusWeight(b.status) || a.price - b.price
        );
      case 'price_desc':
        return filtered.sort((a, b) =>
          statusWeight(a.status) - statusWeight(b.status) || b.price - a.price
        );
      case 'relevant':
      default:
        return filtered.sort((a, b) => statusWeight(a.status) - statusWeight(b.status));
    }
  })();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des annonces...</div>
      </div>
    );
  }

  const hairTypeOptions = [
    { value: 'all', label: t('marketplace.allTypes') },
    { value: 'straight', label: t('hairTypes.straight') },
    { value: 'wavy', label: t('hairTypes.wavy') },
    { value: 'curly', label: t('hairTypes.curly') },
    { value: 'coily', label: t('hairTypes.coily') },
  ];

  return (
    <div className="space-y-4">

      {/* ── Barre de recherche principale ── */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 h-11 shadow-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder={t('marketplace.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-transparent outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 h-11 px-4 rounded-xl border text-sm font-medium transition-all ${
            filtersOpen || activeFilterCount > 0
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:text-emerald-700 shadow-sm'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filtres</span>
          {activeFilterCount > 0 && (
            <span className={`text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${filtersOpen ? 'bg-white text-emerald-700' : 'bg-emerald-500 text-white'}`}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Panneau de filtres avancés ── */}
      {filtersOpen && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 space-y-4">
          {/* Type de cheveux — chips */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              {hairTypeOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilterType(value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filterType === value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Prix & Longueur sur une ligne */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('marketplace.priceRange')}</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder={t('marketplace.min')}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none"
                />
                <span className="text-gray-400 text-sm flex-shrink-0">—</span>
                <input
                  type="number"
                  placeholder={t('marketplace.max')}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none"
                />
                <span className="text-gray-500 text-sm flex-shrink-0">€</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('marketplace.length')}</p>
                <div className="flex items-center gap-0.5 bg-gray-100 rounded-md p-0.5">
                  {(['cm', 'inches'] as const).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setLengthUnit(unit)}
                      className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                        lengthUnit === unit ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {unit === 'cm' ? 'cm' : '"'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder={t('marketplace.min')}
                  value={minLength}
                  onChange={(e) => setMinLength(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none"
                />
                <span className="text-gray-400 text-sm flex-shrink-0">—</span>
                <input
                  type="number"
                  placeholder={t('marketplace.max')}
                  value={maxLength}
                  onChange={(e) => setMaxLength(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none"
                />
                <span className="text-gray-500 text-sm flex-shrink-0">{lengthUnit === 'cm' ? 'cm' : '"'}</span>
              </div>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="pt-1 border-t border-gray-100">
              <button
                onClick={() => { setFilterType('all'); setMinPrice(''); setMaxPrice(''); setMinLength(''); setMaxLength(''); }}
                className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Barre résultats + tri + vue ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-800">{filteredAndSortedListings.length}</span> annonce{filteredAndSortedListings.length !== 1 ? 's' : ''}
        </p>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <div className="relative flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 h-8 text-sm text-gray-600 shadow-sm">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-transparent outline-none cursor-pointer pr-4 text-sm font-medium text-gray-700"
            >
              <option value="relevant">{t('marketplace.relevance')}</option>
              <option value="recent">{t('marketplace.mostRecent')}</option>
              <option value="price_asc">{t('marketplace.priceLowToHigh')}</option>
              <option value="price_desc">{t('marketplace.priceHighToLow')}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
          </div>

          {/* View toggle — grid first */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Mosaïque"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Liste"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Résultats ── */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
          {filteredAndSortedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              seller={(listing as any).profiles}
              onFavoriteToggle={handleFavoriteToggle}
              isFavorited={favorites.has(listing.id)}
              onSellerClick={!isGuest ? onSellerClick : undefined}
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
        <div className="space-y-3">
          {filteredAndSortedListings.map((listing) => (
            <ListingListItem
              key={listing.id}
              listing={listing}
              seller={(listing as any).profiles}
              onFavoriteToggle={handleFavoriteToggle}
              isFavorited={favorites.has(listing.id)}
              onSellerClick={!isGuest ? onSellerClick : undefined}
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

      {filteredAndSortedListings.length === 0 && !loading && (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-gray-600">Aucune annonce trouvée</p>
          <p className="text-sm mt-1">Essayez d'autres termes ou réinitialisez les filtres</p>
        </div>
      )}

      {selectedListing && !isGuest && (
        <ListingDetails
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onFavoriteToggle={handleFavoriteToggle}
          isFavorited={favorites.has(selectedListing.id)}
          onSellerClick={onSellerClick}
        />
      )}
    </div>
  );
}
