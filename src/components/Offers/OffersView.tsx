import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/database.types';
import { Check, X, Tag, Eye, CreditCard } from 'lucide-react';
import { ListingDetails } from '../Listings/ListingDetails';
import { PaymentModal } from '../Payment/PaymentModal';

type Offer = Database['public']['Tables']['offers']['Row'];
type Listing = Database['public']['Tables']['listings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface OfferWithDetails extends Offer {
  listing: Listing;
  buyer: Profile;
}

export function OffersView() {
  const { user } = useAuth();
  const [receivedOffers, setReceivedOffers] = useState<OfferWithDetails[]>([]);
  const [sentOffers, setSentOffers] = useState<OfferWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOfferForPayment, setSelectedOfferForPayment] = useState<OfferWithDetails | null>(null);

  useEffect(() => {
    fetchOffers();
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('favorites')
      .select('listing_id')
      .eq('user_id', user.id);

    if (data) {
      setFavorites(data.map((fav) => fav.listing_id));
    }
  };

  const fetchOffers = async () => {
    if (!user) return;

    setLoading(true);

    const { data: userListings } = await supabase
      .from('listings')
      .select('id')
      .eq('seller_id', user.id);

    const listingIds = userListings?.map((l) => l.id) || [];

    if (listingIds.length > 0) {
      const { data: received } = await supabase
        .from('offers')
        .select('*, listing:listings(*)')
        .in('listing_id', listingIds)
        .order('created_at', { ascending: false });

      if (received) {
        const offersWithBuyers = await Promise.all(
          received.map(async (offer: any) => {
            const { data: buyer } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', offer.buyer_id)
              .maybeSingle();
            return { ...offer, buyer };
          })
        );
        setReceivedOffers(offersWithBuyers as any);
      }
    }

    const { data: sent } = await supabase
      .from('offers')
      .select('*, listing:listings(*)')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });

    if (sent) {
      const offersWithBuyers = await Promise.all(
        sent.map(async (offer: any) => {
          const { data: buyer } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', offer.buyer_id)
            .maybeSingle();
          return { ...offer, buyer };
        })
      );
      setSentOffers(offersWithBuyers as any);
    }
    setLoading(false);
  };

  const handleAcceptOffer = async (offerId: string) => {
    const { error } = await supabase
      .from('offers')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', offerId);

    if (!error) {
      alert('Offre acceptée!');
      fetchOffers();
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    const { error } = await supabase
      .from('offers')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', offerId);

    if (!error) {
      alert('Offre refusée');
      fetchOffers();
    }
  };

  const handleWithdrawOffer = async (offerId: string) => {
    const { error } = await supabase
      .from('offers')
      .update({ status: 'withdrawn', updated_at: new Date().toISOString() })
      .eq('id', offerId);

    if (!error) {
      alert('Offre retirée');
      fetchOffers();
    }
  };



  const handleFavoriteToggle = async (listingId: string) => {
    if (!user) return;

    if (favorites.includes(listingId)) {
      await supabase
        .from('favorites')
        .delete()
        .eq('listing_id', listingId)
        .eq('user_id', user.id);
      setFavorites(favorites.filter((id) => id !== listingId));
    } else {
      await supabase
        .from('favorites')
        .insert({ listing_id: listingId, user_id: user.id });
      setFavorites([...favorites, listingId]);
    }
  };

  const handlePayForOffer = (offer: OfferWithDetails) => {
    setSelectedOfferForPayment(offer);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedOfferForPayment(null);
    fetchOffers();
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800',
    };

    const labels = {
      pending: 'En attente',
      accepted: 'Acceptée',
      rejected: 'Refusée',
      withdrawn: 'Retirée',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des offres...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Tag className="w-7 h-7 text-teal-600" />
          Mes Offres
        </h2>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'received'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Reçues ({receivedOffers.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'sent'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Envoyées ({sentOffers.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === 'received' && receivedOffers.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500">Aucune offre reçue</p>
          </div>
        )}

        {activeTab === 'sent' && sentOffers.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500">Aucune offre envoyée</p>
          </div>
        )}

        {activeTab === 'received' &&
          receivedOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <button
                        onClick={() => setSelectedListing(offer.listing)}
                        className="font-bold text-gray-800 text-lg mb-1 hover:text-teal-600 transition-colors flex items-center gap-2"
                      >
                        {offer.listing.title}
                        <Eye className="w-4 h-4" />
                      </button>
                      <p className="text-sm text-gray-600 mb-2">
                        De: <span className="font-semibold">{offer.buyer.full_name || 'Utilisateur'}</span>
                      </p>
                    </div>
                    {getStatusBadge(offer.status)}
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <div>
                      <span className="text-sm text-gray-600">Prix demandé:</span>
                      <span className="ml-2 font-semibold text-gray-800">{offer.listing.price}€</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Offre:</span>
                      <span className="ml-2 font-bold text-teal-600 text-lg">{offer.amount}€</span>
                    </div>
                  </div>
                  {offer.message && (
                    <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">
                      "{offer.message}"
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {offer.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptOffer(offer.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Accepter
                      </button>
                      <button
                        onClick={() => handleRejectOffer(offer.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

        {activeTab === 'sent' &&
          sentOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <button
                        onClick={() => setSelectedListing(offer.listing)}
                        className="font-bold text-gray-800 text-lg mb-1 hover:text-teal-600 transition-colors flex items-center gap-2"
                      >
                        {offer.listing.title}
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                    {getStatusBadge(offer.status)}
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <div>
                      <span className="text-sm text-gray-600">Prix demandé:</span>
                      <span className="ml-2 font-semibold text-gray-800">{offer.listing.price}€</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Votre offre:</span>
                      <span className="ml-2 font-bold text-teal-600 text-lg">{offer.amount}€</span>
                    </div>
                  </div>
                  {offer.message && (
                    <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">
                      "{offer.message}"
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {offer.status === 'pending' && (
                    <button
                      onClick={() => handleWithdrawOffer(offer.id)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Retirer l'offre
                    </button>
                  )}
                  {offer.status === 'accepted' && (
                    <button
                      onClick={() => handlePayForOffer(offer)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Payer maintenant
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {selectedListing && (
        <ListingDetails
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onMessage={() => {}}
          onFavoriteToggle={handleFavoriteToggle}
          isFavorited={favorites.includes(selectedListing.id)}
        />
      )}

      {showPaymentModal && selectedOfferForPayment && (
        <PaymentModal
          listingId={selectedOfferForPayment.listing.id}
          listingTitle={selectedOfferForPayment.listing.title}
          amount={selectedOfferForPayment.amount}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedOfferForPayment(null);
          }}
          onSuccess={handlePaymentSuccess}
          listingWeight={selectedOfferForPayment.listing.hair_weight || undefined}
          listingCountry={selectedOfferForPayment.listing.country || undefined}
        />
      )}
    </div>
  );
}
