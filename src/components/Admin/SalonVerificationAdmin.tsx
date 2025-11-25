import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { Shield, CheckCircle, XCircle, AlertCircle, ExternalLink, Mail } from 'lucide-react';

interface SalonVerification {
  id: string;
  user_id: string;
  salon_name: string;
  siret: string;
  address: string;
  phone?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profiles?: {
    email: string;
    full_name?: string;
  };
}

export default function SalonVerificationAdmin() {
  const { user, profile } = useAuth();
  const [verifications, setVerifications] = useState<SalonVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isAdmin = profile?.email === 'stephaniebuisson1115@gmail.com';

  useEffect(() => {
    if (isAdmin) {
      loadVerifications();
    }
  }, [isAdmin, filter]);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Non authentifié');
      }

      const statusFilter = filter !== 'all' ? filter : null;

      // Use direct fetch to PostgREST API to bypass client cache
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_salon_verifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${session.access_token}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ status_filter: statusFilter })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Loaded verifications:', data);
      setVerifications(data || []);
    } catch (error: any) {
      console.error('Error loading verifications:', error);
      setMessage({ type: 'error', text: `Erreur lors du chargement des demandes: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (verificationId: string, userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir approuver ce salon ?')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Non authentifié');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/approve_salon_verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ verification_id: verificationId, user_id: userId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! ${errorText}`);
      }

      setMessage({ type: 'success', text: 'Salon approuvé avec succès !' });
      await loadVerifications();
    } catch (error: any) {
      console.error('Error approving salon:', error);
      setMessage({ type: 'error', text: `Erreur lors de l'approbation du salon: ${error.message}` });
    }
  };

  const handleReject = async (verificationId: string, userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir refuser cette demande ?')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Non authentifié');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/reject_salon_verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ verification_id: verificationId, user_id: userId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! ${errorText}`);
      }

      setMessage({ type: 'success', text: 'Demande refusée.' });
      await loadVerifications();
    } catch (error: any) {
      console.error('Error rejecting salon:', error);
      setMessage({ type: 'error', text: `Erreur lors du refus de la demande: ${error.message}` });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          En attente
        </span>;
      case 'approved':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approuvé
        </span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Refusé
        </span>;
      default:
        return null;
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Gestion des certifications salons</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approuvés
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Refusés
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : verifications.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Aucune demande trouvée.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salon
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SIRET
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {verifications.map((verification) => (
                  <tr key={verification.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{verification.salon_name}</p>
                        <p className="text-sm text-gray-600">{verification.address}</p>
                        {verification.phone && (
                          <p className="text-sm text-gray-500">{verification.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{verification.siret}</span>
                        <a
                          href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${verification.siret}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                          title="Vérifier sur annuaire-entreprises.data.gouv.fr"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{verification.profiles?.full_name || 'N/A'}</p>
                        <a
                          href={`mailto:${verification.profiles?.email}`}
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          {verification.profiles?.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(verification.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(verification.status)}
                    </td>
                    <td className="px-4 py-4">
                      {verification.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(verification.id, verification.user_id)}
                            className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approuver
                          </button>
                          <button
                            onClick={() => handleReject(verification.id, verification.user_id)}
                            className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Refuser
                          </button>
                        </div>
                      )}
                      {verification.status !== 'pending' && (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
