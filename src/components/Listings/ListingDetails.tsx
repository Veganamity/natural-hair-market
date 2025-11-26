import { X, Heart, CheckCircle, XCircle, ShoppingCart, Tag, Flag, BadgeCheck, Hash } from 'lucide-react';
import { Database } from '../../lib/database.types';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { PaymentModal } from '../Payment/PaymentModal';
import { ReportModal } from './ReportModal';

type Listing = Database['public']['Tables']['listings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface ListingDetailsProps {
  listing: Listing;
  onClose: () => void;
  onFavoriteToggle: (listingId: string) => void;
  isFavorited: boolean;
}

const getListingNumber = (id: string): string => {
  return id.substring(0, 8).toUpperCase();
};

export function ListingDetails({
  listing,
  onClose,
  onFavoriteToggle,
  isFavorited,
}: ListingDetailsProps) {
  const { user } = useAuth();
  const [seller, setSeller] = useState<Profile | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  const images = Array.isArray(listing.images) ? listing.images : [];
  const mainImage = images[0] || 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg';

  useEffect(() => {
    const fetchSeller = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', listing.seller_id)
        .maybeSingle();

      if (data) setSeller(data);
    };

    fetchSeller();
  }, [listing.seller_id]);

  const hairTypeLabels: Record<string, string> = {
    straight: 'Raides',
    wavy: 'Ondulés',
    curly: 'Bouclés',
    coily: 'Frisés',
  };

  const conditionLabels: Record<string, string> = {
    excellent: 'Excellent',
    good: 'Bon',
    fair: 'Moyen',
  };

  const isOwner = user?.id === listing.seller_id;

  const handleInstantBuy = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    onClose();
  };

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerAmount || !user) return;

    setIsSubmittingOffer(true);

    try {
      const { error } = await supabase.from('offers').insert({
        listing_id: listing.id,
        buyer_id: user.id,
        amount: parseFloat(offerAmount),
      });

      if (error) throw error;

      alert('Votre offre a été envoyée au vendeur!');
      setShowOfferModal(false);
      setOfferAmount('');
    } catch (error) {
      console.error('Error submitting offer:', error);
      alert('Erreur lors de l\'envoi de l\'offre');
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1 md:p-2">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[98vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-2 py-1 flex items-center justify-between z-10 rounded-t-lg">
          <h2 className="text-xs font-bold text-gray-800">Détails</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 p-1.5">
          <div>
            <img
              src={mainImage}
              alt={listing.title}
              onClick={() => setShowImageModal(true)}
              className="w-full h-32 md:h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            />
          </div>

          <div className="space-y-1">
            <div>
              <h1 className="text-sm font-bold text-gray-800 mb-0.5 leading-tight">{listing.title}</h1>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                  <Hash className="w-3 h-3 text-gray-500" />
                  <span className="font-mono text-[10px] font-semibold text-gray-600">
                    {getListingNumber(listing.id)}
                  </span>
                </div>
                {listing.status === 'active' && (
                  <span className="inline-block bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-[9px] font-medium">
                    Disponible
                  </span>
                )}
              </div>
              <div className="text-lg font-bold text-emerald-600 mb-0.5">{listing.price}€</div>
            </div>

            <div className="space-y-1 border-t border-gray-200 pt-1">
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div>
                  <span className="text-[10px] text-gray-600">Longueur</span>
                  <p className="font-semibold text-gray-800 text-xs">{listing.hair_length}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-600">Type</span>
                  <p className="font-semibold text-gray-800 text-xs">
                    {hairTypeLabels[listing.hair_type] || listing.hair_type}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-600">Couleur</span>
                  <p className="font-semibold text-gray-800 text-xs">{listing.hair_color}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-600">État</span>
                  <p className="font-semibold text-gray-800 text-xs">
                    {conditionLabels[listing.condition] || listing.condition}
                  </p>
                </div>
                {listing.country && (
                  <div>
                    <span className="text-[10px] text-gray-600">Pays</span>
                    <p className="font-semibold text-gray-800 text-xs">{listing.country}</p>
                  </div>
                )}
                {listing.hair_texture && (
                  <div>
                    <span className="text-[10px] text-gray-600">Texture</span>
                    <p className="font-semibold text-gray-800 text-xs">{listing.hair_texture}</p>
                  </div>
                )}
                {listing.hair_weight && (
                  <div>
                    <span className="text-[10px] text-gray-600">Poids</span>
                    <p className="font-semibold text-gray-800 text-xs">{listing.hair_weight}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-1.5 pt-0.5">
                <div className="flex items-center gap-0.5">
                  {listing.is_dyed ? (
                    <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-2.5 h-2.5 text-gray-400" />
                  )}
                  <span className="text-[9px] text-gray-700">Colorés</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {listing.is_treated ? (
                    <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-2.5 h-2.5 text-gray-400" />
                  )}
                  <span className="text-[9px] text-gray-700">Traités</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-1">
              <h3 className="font-semibold text-gray-800 mb-0.5 text-[10px]">Description</h3>
              <p className="text-gray-600 leading-tight text-[9px]">{listing.description}</p>
            </div>

            {seller && (
              <div className="border-t border-gray-200 pt-1">
                <h3 className="font-semibold text-gray-800 mb-0.5 text-[10px]">Vendeur</h3>
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-700 font-semibold text-[10px]">
                      {seller.full_name?.[0] || seller.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-0.5">
                      <p className="font-semibold text-gray-800 text-[10px]">{seller.full_name || 'Utilisateur'}</p>
                      {seller.is_certified_salon && (
                        <div className="flex items-center gap-0.5 bg-blue-50 px-0.5 py-0.5 rounded-full" title="Salon Certifié">
                          <BadgeCheck className="w-2 h-2 text-blue-600" />
                          <span className="text-[8px] text-blue-700 font-medium">Salon Certifié</span>
                        </div>
                      )}
                    </div>
                    {seller.location && (
                      <p className="text-[9px] text-gray-600">{seller.location}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!isOwner && (
              <div className="space-y-1 pt-1">
                <div className="flex gap-1">
                  {listing.instant_buy_enabled && (
                    <button
                      onClick={handleInstantBuy}
                      className="flex-1 px-2 py-1 bg-emerald-600 text-white rounded-md font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-0.5 text-[10px]"
                    >
                      <ShoppingCart className="w-2.5 h-2.5" />
                      Acheter
                    </button>
                  )}
                  {listing.accept_offers && (
                    <button
                      onClick={() => setShowOfferModal(true)}
                      className="flex-1 px-2 py-1 bg-teal-600 text-white rounded-md font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-0.5 text-[10px]"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      Offre
                    </button>
                  )}
                </div>
                <button
                  onClick={() => onFavoriteToggle(listing.id)}
                  className={`w-full px-2 py-1 rounded-md font-semibold transition-colors flex items-center justify-center gap-0.5 text-[10px] ${
                    isFavorited
                      ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-2.5 h-2.5 ${isFavorited ? 'fill-current' : ''}`} />
                  {isFavorited ? 'Retirer' : 'Favoris'}
                </button>
                {user && (
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="w-full px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded-md font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-0.5 text-[10px]"
                  >
                    <Flag className="w-2.5 h-2.5" />
                    Signaler
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg shadow-2xl max-w-xs w-full p-2">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xs font-bold text-gray-800">Offre</h3>
              <button
                onClick={() => setShowOfferModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mb-1.5">
              <p className="text-[9px] text-gray-600">
                Prix: <span className="font-semibold text-emerald-600">{listing.price}€</span>
              </p>
            </div>

            <form onSubmit={handleSubmitOffer} className="space-y-1.5">
              <div>
                <label className="block text-[10px] font-medium text-gray-700 mb-0.5">
                  Votre offre (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max={listing.price}
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-[10px]"
                  placeholder="Entrez votre offre"
                  required
                />
              </div>

              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="flex-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-semibold hover:bg-gray-200 transition-colors text-[10px]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOffer || !offerAmount}
                  className="flex-1 px-2 py-1 bg-teal-600 text-white rounded-md font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[10px]"
                >
                  {isSubmittingOffer ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-6xl w-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={mainImage}
              alt={listing.title}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {showPaymentModal && (
        <PaymentModal
          listingId={listing.id}
          listingTitle={listing.title}
          amount={listing.price}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          listingWeight={listing.hair_weight || undefined}
          listingCountry={listing.country || undefined}
        />
      )}

      {showReportModal && (
        <ReportModal
          listingId={listing.id}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
