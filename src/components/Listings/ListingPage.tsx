import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/database.types';
import { ArrowLeft, Globe, Calendar, BadgeCheck, ChevronLeft, ChevronRight, ShoppingBag, Tag, Shield, Package } from 'lucide-react';

type Listing = Database['public']['Tables']['listings']['Row'];

const HAIR_TYPE_LABELS: Record<string, string> = {
  straight: 'Raides',
  wavy: 'Ondulés',
  curly: 'Bouclés',
  coily: 'Frisés',
};

const CONDITION_LABELS: Record<string, string> = {
  excellent: 'Excellent',
  good: 'Bon état',
  fair: 'Correct',
};

interface ListingPageProps {
  listingId: string;
  onBack: () => void;
  onLoginClick: () => void;
  onBuyClick: (listingId: string) => void;
}

export function ListingPage({ listingId, onBack, onLoginClick, onBuyClick }: ListingPageProps) {
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);

  useEffect(() => {
    fetchListing();
  }, [listingId]);

  const fetchListing = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        profiles:seller_id (
          id,
          full_name,
          avatar_url,
          location,
          bio,
          business_name,
          is_certified_salon,
          is_verified_salon
        )
      `)
      .eq('id', listingId)
      .maybeSingle();

    if (error || !data) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setListing(data);
    setSeller((data as any).profiles);

    const cm = parseInt(data.hair_length);
    const inches = Math.round(cm / 2.54);
    const typeLabel = (HAIR_TYPE_LABELS[data.hair_type] || data.hair_type).toLowerCase();
    const pageTitle = `${data.title} – ${data.price}€ | Natural Hair Market`;
    const pageDesc = `Cheveux naturels ${cm}cm (${inches}") ${typeLabel}, couleur ${data.hair_color}. ${data.description.slice(0, 120)}`;

    document.title = pageTitle;
    const metaDesc = document.getElementById('meta-description') as HTMLMetaElement | null;
    if (metaDesc) metaDesc.content = pageDesc;

    // JSON-LD structured data
    const images = Array.isArray(data.images) ? (data.images as string[]) : [];
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.title,
      description: data.description,
      image: images.length ? images : ['https://www.naturalhairmarket.com/398249a7-e404-4b31-8512-bf2eac66a382.png'],
      offers: {
        '@type': 'Offer',
        price: data.price.toString(),
        priceCurrency: 'EUR',
        availability: data.status === 'active'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
        url: `https://www.naturalhairmarket.com/annonce/cheveux-${cm}cm-${data.hair_type}-${data.hair_color}-${data.id}`,
      },
    };
    let ldScript = document.getElementById('listing-ld-json');
    if (!ldScript) {
      ldScript = document.createElement('script');
      ldScript.id = 'listing-ld-json';
      ldScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify(jsonLd);

    setLoading(false);
  };

  // cleanup JSON-LD when unmounting
  useEffect(() => {
    return () => {
      const ldScript = document.getElementById('listing-ld-json');
      if (ldScript) ldScript.remove();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500 text-lg">Chargement de l'annonce...</div>
      </div>
    );
  }

  if (notFound || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 text-lg">Annonce introuvable ou supprimée.</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
        >
          Retour à la marketplace
        </button>
      </div>
    );
  }

  const images = Array.isArray(listing.images) ? (listing.images as string[]) : [];
  const mainImage = images[selectedImg] || 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg';
  const cm = parseInt(listing.hair_length);
  const inches = Math.round(cm / 2.54);
  const isSold = listing.status === 'sold';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 pt-4 pb-2">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={onBack} className="hover:text-emerald-700 transition-colors">Marketplace</button>
          <span>/</span>
          <span className="text-gray-800 font-medium line-clamp-1">{listing.title}</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Image gallery */}
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-md aspect-square">
              <img
                src={mainImage}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              {isSold && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-red-600 text-white text-xl font-bold px-6 py-2 rounded-full rotate-[-8deg] shadow-lg">
                    VENDU
                  </span>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImg((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedImg((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      i === selectedImg ? 'border-emerald-500 shadow-md' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div>
              <div className="flex items-start justify-between gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{listing.title}</h1>
                <span className={`flex-shrink-0 text-xl font-bold px-4 py-1.5 rounded-full ${
                  isSold ? 'bg-gray-200 text-gray-500' : 'bg-emerald-600 text-white'
                }`}>
                  {listing.price}€
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {!isSold ? (
                  <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Disponible
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    Vendu
                  </span>
                )}
                {listing.accept_offers && !isSold && (
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                    Offres acceptées
                  </span>
                )}
              </div>
            </div>

            {/* Hair specs */}
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-2.5">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Caractéristiques</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Longueur</span>
                  <p className="font-semibold text-gray-900">{cm}cm ({inches}")</p>
                </div>
                <div>
                  <span className="text-gray-500">Type</span>
                  <p className="font-semibold text-gray-900">{HAIR_TYPE_LABELS[listing.hair_type] || listing.hair_type}</p>
                </div>
                <div>
                  <span className="text-gray-500">Couleur</span>
                  <p className="font-semibold text-gray-900 capitalize">{listing.hair_color}</p>
                </div>
                {listing.hair_texture && (
                  <div>
                    <span className="text-gray-500">Texture</span>
                    <p className="font-semibold text-gray-900">{listing.hair_texture}</p>
                  </div>
                )}
                {listing.hair_weight && (
                  <div>
                    <span className="text-gray-500">Poids</span>
                    <p className="font-semibold text-gray-900">{listing.hair_weight}</p>
                  </div>
                )}
                {listing.condition && (
                  <div>
                    <span className="text-gray-500">État</span>
                    <p className="font-semibold text-gray-900">{CONDITION_LABELS[listing.condition] || listing.condition}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Coloré</span>
                  <p className="font-semibold text-gray-900">{listing.is_dyed ? 'Oui' : 'Non'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Traité</span>
                  <p className="font-semibold text-gray-900">{listing.is_treated ? 'Oui' : 'Non (naturel)'}</p>
                </div>
                {listing.country && (
                  <div className="col-span-2 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span className="text-gray-500">Pays :</span>
                    <span className="font-semibold text-gray-900">{listing.country}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h2>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{listing.description}</p>
              <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Publié le {new Date(listing.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Seller */}
            {seller && (
              <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {seller.avatar_url ? (
                    <img src={seller.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-emerald-700 font-bold text-lg">
                      {(seller.full_name || seller.business_name || 'V')[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-gray-800 text-sm">
                      {seller.business_name || seller.full_name || 'Vendeur'}
                    </span>
                    {seller.is_certified_salon && (
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        <BadgeCheck className="w-3 h-3" />
                        Salon Certifié
                      </span>
                    )}
                  </div>
                  {seller.location && (
                    <p className="text-xs text-gray-500 mt-0.5">{seller.location}</p>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            {!isSold && (
              <div className="space-y-3">
                {user ? (
                  <button
                    onClick={() => onBuyClick(listing.id)}
                    className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-base hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Voir les options d'achat
                  </button>
                ) : (
                  <>
                    <button
                      onClick={onLoginClick}
                      className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-base hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Se connecter pour acheter
                    </button>
                    <p className="text-center text-xs text-gray-500">
                      Inscription gratuite — Achat 100% sécurisé via Stripe
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { icon: Shield, label: 'Paiement sécurisé' },
                { icon: Package, label: 'Livraison partout en Europe' },
                { icon: Tag, label: 'Cheveux 100% naturels' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-[11px] text-gray-600 leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
