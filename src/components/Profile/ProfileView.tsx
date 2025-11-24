import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/database.types';
import { Edit, Trash2, Package, CreditCard, CheckCircle, AlertCircle, MapPin, LogOut, BadgeCheck, Shield } from 'lucide-react';
import { EditListingForm } from '../Listings/EditListingForm';

type Listing = Database['public']['Tables']['listings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileViewProps {
  onNavigate?: (view: string) => void;
}

export function ProfileView({ onNavigate }: ProfileViewProps = {}) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: '',
    bio: '',
    address_line1: '',
    address_line2: '',
    postal_code: '',
    city: '',
    country: 'FR',
    siret: '',
  });
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  useEffect(() => {
    fetchProfile();
    fetchUserListings();
    checkStripeOnboarding();
  }, [user]);

  const checkStripeOnboarding = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('stripe_onboarding') === 'success') {
      updateStripeOnboardingStatus();
      window.history.replaceState({}, '', '/profile');
    }
  };

  const updateStripeOnboardingStatus = async () => {
    if (!user) return;

    await supabase
      .from('profiles')
      .update({
        stripe_onboarding_completed: true,
        stripe_account_status: 'active',
      })
      .eq('id', user.id);

    fetchProfile();
  };

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        setError(`Erreur lors du chargement du profil: ${fetchError.message}`);
        setLoading(false);
        return;
      }

      if (!data) {
        setError('Votre profil est en cours de création. Veuillez rafraîchir la page dans quelques instants.');
        setLoading(false);
        return;
      } else {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || '',
          address_line1: data.address_line1 || '',
          address_line2: data.address_line2 || '',
          postal_code: data.postal_code || '',
          city: data.city || '',
          country: data.country || 'FR',
          siret: data.siret || '',
        });
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError(`Erreur inattendue: ${err.message}`);
      setLoading(false);
    }
  };

  const fetchUserListings = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setListings(data);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', user!.id);

    if (!error) {
      setEditing(false);
      fetchProfile();
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', listingId);

    if (!error) {
      fetchUserListings();
    }
  };

  const handleUpdateListingStatus = async (listingId: string, status: string) => {
    const { error } = await supabase
      .from('listings')
      .update({ status })
      .eq('id', listingId);

    if (!error) {
      fetchUserListings();
    }
  };

  const handleStripeConnect = async () => {
    setLoadingStripe(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Non authentifié');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-stripe-connect-account`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Stripe Connect API error:', data);
        alert(`Erreur: ${data.error || 'Erreur lors de la création du compte Stripe'}`);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de redirection manquante');
      }
    } catch (error: any) {
      console.error('Stripe Connect error:', error);
      alert(`Erreur lors de la connexion à Stripe: ${error.message}`);
    } finally {
      setLoadingStripe(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) return;
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement du profil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-600 text-center">
          <p className="font-semibold">Erreur</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => fetchProfile()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Aucun profil trouvé</div>
      </div>
    );
  }

  return (
    <>
      {editingListing && (
        <EditListingForm
          listing={editingListing}
          onClose={() => setEditingListing(null)}
          onSuccess={() => {
            fetchUserListings();
            setEditingListing(null);
          }}
        />
      )}
      <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Mon Profil</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localisation
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={4}
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  Adresse postale
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      address_line1: '',
                      address_line2: '',
                      postal_code: '',
                      city: '',
                      country: 'FR',
                    });
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Effacer l'adresse
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse ligne 1
                  </label>
                  <input
                    type="text"
                    value={formData.address_line1}
                    onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse ligne 2 (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.address_line2}
                    onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code postal
                    </label>
                    <input
                      type="text"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Vérification Salon Professionnel</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Si vous êtes un salon de coiffure, renseignez votre SIRET ou SIREN pour obtenir le badge
                      <strong className="text-blue-600"> "Salon Vérifié"</strong> sur votre profil et vos annonces.
                    </p>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SIRET / SIREN (optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.siret}
                      onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                      placeholder="Ex: 123 456 789 00012"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      Le badge "Salon Vérifié" apparaîtra automatiquement dès que vous enregistrerez un numéro SIRET/SIREN valide.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Nom</label>
              <p className="font-semibold text-gray-800">{profile.full_name || 'Non renseigné'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <p className="font-semibold text-gray-800">{profile.email}</p>
            </div>
            {profile.phone && (
              <div>
                <label className="text-sm text-gray-600">Téléphone</label>
                <p className="font-semibold text-gray-800">{profile.phone}</p>
              </div>
            )}
            {profile.location && (
              <div>
                <label className="text-sm text-gray-600">Localisation</label>
                <p className="font-semibold text-gray-800">{profile.location}</p>
              </div>
            )}
            {profile.bio && (
              <div>
                <label className="text-sm text-gray-600">Bio</label>
                <p className="text-gray-800">{profile.bio}</p>
              </div>
            )}

            {(profile.address_line1 || profile.postal_code || profile.city) && (
              <div className="border-t pt-4">
                <label className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  Adresse postale
                </label>
                <div className="text-gray-800">
                  {profile.address_line1 && <p>{profile.address_line1}</p>}
                  {profile.address_line2 && <p>{profile.address_line2}</p>}
                  {(profile.postal_code || profile.city) && (
                    <p>{profile.postal_code} {profile.city}</p>
                  )}
                </div>
              </div>
            )}

            {profile.is_verified_salon && (
              <div className="border-t pt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <BadgeCheck className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-bold text-blue-800">Salon Vérifié</h3>
                      <p className="text-sm text-gray-700">
                        Ce compte est vérifié en tant que salon professionnel
                      </p>
                      {profile.siret && (
                        <p className="text-xs text-gray-600 mt-1">
                          SIRET: {profile.siret}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!profile.is_certified_salon && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Certification Salon Professionnel</h2>
                <p className="text-sm text-gray-600">Obtenez le badge "Salon certifié" sur vos annonces</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate?.('salon-certifie')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Demander le badge Salon certifié
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Renforcez la confiance des acheteurs en certifiant votre salon avec votre SIRET. Le badge apparaîtra sur votre profil et vos annonces.</p>
          </div>
        </div>
      )}

      {profile.is_certified_salon && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                Salon Certifié
                <Shield className="w-6 h-6 text-green-600" />
              </h2>
              <p className="text-sm text-gray-600">Votre salon est certifié. Le badge apparaît sur votre profil et vos annonces.</p>
            </div>
          </div>
        </div>
      )}

      {profile.email === 'stephaniebuisson1115@gmail.com' && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Administration</h2>
                <p className="text-sm text-gray-600">Gérer les certifications des salons</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate?.('admin-salons')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Page Admin Salons
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-800">Informations bancaires</h2>
          </div>
          {profile.stripe_onboarding_completed ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Compte vérifié</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Configuration requise</span>
            </div>
          )}
        </div>

        {profile.stripe_onboarding_completed ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Votre compte bancaire est configuré. Vous pouvez recevoir des paiements pour vos ventes.
            </p>
            <button
              onClick={handleStripeConnect}
              disabled={loadingStripe}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loadingStripe ? 'Chargement...' : 'Gérer mes informations bancaires'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              Pour recevoir des paiements de vos ventes, vous devez configurer votre compte bancaire via Stripe.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Informations requises:</strong>
              </p>
              <ul className="list-disc list-inside text-sm text-blue-800 mt-2 space-y-1">
                <li>Pièce d'identité (carte d'identité ou passeport)</li>
                <li>Coordonnées bancaires (RIB/IBAN)</li>
                <li>Informations personnelles</li>
              </ul>
            </div>
            <button
              onClick={handleStripeConnect}
              disabled={loadingStripe}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {loadingStripe ? 'Chargement...' : 'Configurer mon compte bancaire'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-800">Mes Annonces</h2>
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
            {listings.length}
          </span>
        </div>

        {listings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Vous n'avez pas encore d'annonces</p>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => {
              const images = Array.isArray(listing.images) ? listing.images : [];
              const mainImage = images[0] || 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg';

              return (
                <div
                  key={listing.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex gap-4">
                    <img
                      src={mainImage}
                      alt={listing.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">{listing.title}</h3>
                          <p className="text-emerald-600 font-bold text-xl">{listing.price}€</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingListing(listing)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteListing(listing.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            listing.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : listing.status === 'sold'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {listing.status === 'active'
                            ? 'Actif'
                            : listing.status === 'sold'
                            ? 'Vendu'
                            : 'Réservé'}
                        </span>
                        {listing.status === 'active' && (
                          <>
                            <button
                              onClick={() => handleUpdateListingStatus(listing.id, 'reserved')}
                              className="text-sm text-yellow-600 hover:underline"
                            >
                              Marquer réservé
                            </button>
                            <button
                              onClick={() => handleUpdateListingStatus(listing.id, 'sold')}
                              className="text-sm text-gray-600 hover:underline"
                            >
                              Marquer vendu
                            </button>
                          </>
                        )}
                        {listing.status !== 'active' && (
                          <button
                            onClick={() => handleUpdateListingStatus(listing.id, 'active')}
                            className="text-sm text-emerald-600 hover:underline"
                          >
                            Réactiver
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogOut className="w-6 h-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-800">Déconnexion</h2>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
