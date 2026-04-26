import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Database } from '../../lib/database.types';
import { useCart } from '../../contexts/CartContext';
import { ArrowLeft, BadgeCheck, MapPin, Package, ShoppingCart, Plus, Check, Scale, Tag, Store } from 'lucide-react';
import { ListingDetails } from '../Listings/ListingDetails';

type Listing = Database['public']['Tables']['listings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface SellerStorePageProps {
  sellerId: string;
  onBack: () => void;
}

const hairTypeLabels: Record<string, string> = {
  straight: 'Raides',
  wavy: 'Ondulés',
  curly: 'Bouclés',
  coily: 'Frisés',
};

export function SellerStorePage({ sellerId, onBack }: SellerStorePageProps) {
  const { addToCart, isInCart, cartItems } = useCart();
  const [seller, setSeller] = useState<Profile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [sellerRes, listingsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', sellerId).maybeSingle(),
        supabase
          .from('listings')
          .select('*')
          .eq('seller_id', sellerId)
          .in('status', ['active', 'sold'])
          .order('status', { ascending: true })
          .order('created_at', { ascending: false }),
      ]);

      if (sellerRes.data) setSeller(sellerRes.data);
      if (listingsRes.data) setListings(listingsRes.data);
      setLoading(false);
    };

    fetchData();
  }, [sellerId]);

  const activeListings = listings.filter((l) => l.status === 'active' && l.instant_buy_enabled);
  const allActiveListings = listings.filter((l) => l.status === 'active');
  const soldListings = listings.filter((l) => l.status === 'sold');

  const sellerCartItems = cartItems.filter((item) => item.sellerId === sellerId);
  const cartTotal = sellerCartItems.reduce((sum, item) => sum + item.listing.price, 0);

  const handleFavoriteToggle = async (listingId: string) => {
    if (favorites.has(listingId)) {
      setFavorites((prev) => {
        const next = new Set(prev);
        next.delete(listingId);
        return next;
      });
    } else {
      setFavorites((prev) => new Set(prev).add(listingId));
    }
  };

  const getMainImage = (listing: Listing) => {
    const imgs = Array.isArray(listing.images) ? listing.images : [];
    return imgs[0] || 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg';
  };

  const cmToInches = (cm: number) => Math.round(cm / 2.54);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 text-sm">Chargement de la boutique...</div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Vendeur introuvable.</p>
        <button onClick={onBack} className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au marketplace
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-emerald-600 to-teal-600" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="w-20 h-20 bg-white rounded-2xl border-4 border-white shadow-md flex items-center justify-center flex-shrink-0">
              {seller.avatar_url ? (
                <img src={seller.avatar_url} alt={seller.full_name || ''} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="text-3xl font-bold text-emerald-700">
                  {(seller.full_name?.[0] || seller.email[0]).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0 pt-10">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-800">{seller.full_name || 'Vendeur'}</h1>
                {seller.is_certified_salon && (
                  <span className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Salon Certifié
                  </span>
                )}
              </div>
              {seller.location && (
                <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {seller.location}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-800">{allActiveListings.length}</p>
              <p className="text-gray-500 text-xs">Disponibles</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="text-xl font-bold text-gray-800">{soldListings.length}</p>
              <p className="text-gray-500 text-xs">Vendus</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="text-xl font-bold text-gray-800">{listings.length}</p>
              <p className="text-gray-500 text-xs">Total</p>
            </div>
          </div>
        </div>
      </div>

      {sellerCartItems.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-800">
              {sellerCartItems.length} article{sellerCartItems.length > 1 ? 's' : ''} de ce vendeur dans votre panier
            </span>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {cartTotal.toFixed(2)} €
            </span>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
            <Tag className="w-3 h-3" />
            1 seule livraison
          </span>
        </div>
      )}

      {allActiveListings.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-gray-800">Annonces disponibles</h2>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {allActiveListings.length}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allActiveListings.map((listing) => {
              const inCart = isInCart(listing.id);
              const canBuy = listing.instant_buy_enabled;
              return (
                <div
                  key={listing.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-emerald-300 transition-all group"
                >
                  <div className="relative cursor-pointer" onClick={() => setSelectedListing(listing)}>
                    <img
                      src={getMainImage(listing)}
                      alt={listing.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-0.5 shadow-sm">
                      <span className="text-sm font-bold text-emerald-700">{listing.price}€</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p
                      className="text-xs font-semibold text-gray-800 truncate mb-1 cursor-pointer hover:text-emerald-700 transition-colors"
                      onClick={() => setSelectedListing(listing)}
                    >
                      {listing.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-2 flex-wrap">
                      <span className="flex items-center gap-0.5">
                        <Scale className="w-3 h-3" />
                        {listing.hair_length} cm ({cmToInches(parseInt(listing.hair_length))}")
                      </span>
                      <span>{hairTypeLabels[listing.hair_type] || listing.hair_type}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
                      <Package className="w-3 h-3" />
                      {listing.hair_color}
                      {listing.weight_grams && <span className="ml-1 text-gray-400">— {listing.weight_grams}g</span>}
                    </div>
                    {canBuy ? (
                      <button
                        onClick={() => {
                          if (!inCart) {
                            addToCart(listing, sellerId, seller.full_name || seller.email || 'Vendeur');
                          }
                        }}
                        className={`w-full py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors ${
                          inCart
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {inCart ? (
                          <>
                            <Check className="w-3 h-3" />
                            Dans le panier
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            Ajouter au panier
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedListing(listing)}
                        className="w-full py-1.5 rounded-lg text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors"
                      >
                        Voir l'annonce
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {soldListings.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-bold text-gray-500">Annonces vendues</h2>
            <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full">
              {soldListings.length}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 opacity-60">
            {soldListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="relative">
                  <img
                    src={getMainImage(listing)}
                    alt={listing.title}
                    className="w-full h-32 object-cover grayscale"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-gray-800/70 text-white text-xs font-bold px-3 py-1 rounded-full">Vendu</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-500 truncate">{listing.title}</p>
                  <p className="text-sm font-bold text-gray-400 mt-1">{listing.price}€</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {allActiveListings.length === 0 && soldListings.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Store className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Ce vendeur n'a pas encore d'annonces.</p>
        </div>
      )}

      {selectedListing && (
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
