import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { ListingCard } from '../Listings/ListingCard';
import { Database } from '../../lib/database.types';
import { Heart } from 'lucide-react';

type Listing = Database['public']['Tables']['listings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface FavoriteWithDetails {
  listing: Listing;
  seller: Profile;
}

export function FavoritesView() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id);

      if (favoritesError) throw favoritesError;

      if (!favoritesData || favoritesData.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const listingIds = favoritesData.map((f) => f.listing_id);

      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select('*, profiles(*)')
        .in('id', listingIds)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (listingsError) throw listingsError;

      const formattedFavorites = (listingsData || []).map((listing: any) => ({
        listing: listing,
        seller: listing.profiles,
      }));

      setFavorites(formattedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user!.id)
        .eq('listing_id', listingId);

      if (error) throw error;

      setFavorites((prev) => prev.filter((f) => f.listing.id !== listingId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Heart className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Aucun favori pour le moment
        </h3>
        <p className="text-gray-500">
          Ajoutez des annonces à vos favoris pour les retrouver facilement ici
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Heart className="w-7 h-7 text-emerald-600" />
          Mes Favoris
        </h2>
        <p className="text-gray-600 mt-1">
          {favorites.length} {favorites.length === 1 ? 'annonce' : 'annonces'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map(({ listing, seller }) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            seller={seller}
            onFavoriteChange={() => handleRemoveFavorite(listing.id)}
            isFavorite={true}
          />
        ))}
      </div>
    </div>
  );
}
