import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { Shield, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface SalonVerification {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  salon_name: string;
  siret: string;
  address: string;
  phone?: string;
  created_at: string;
}

export default function SalonCertificationForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [existingRequest, setExistingRequest] = useState<SalonVerification | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    salon_name: '',
    siret: '',
    address: '',
    phone: '',
    agree_terms: false
  });

  useEffect(() => {
    if (user) {
      checkExistingRequest();
    }
  }, [user]);

  const checkExistingRequest = async () => {
    try {
      const { data, error } = await supabase
        .from('salon_verifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setExistingRequest(data);
      }
    } catch (error) {
      console.error('Error checking existing request:', error);
    }
  };

  const validateSiret = (siret: string): boolean => {
    const cleaned = siret.replace(/\s/g, '');
    return /^\d{14}$/.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    console.log('Form submitted', formData);

    if (!user?.id) {
      setMessage({ type: 'error', text: 'Vous devez être connecté pour envoyer une demande.' });
      return;
    }

    if (!validateSiret(formData.siret)) {
      setMessage({ type: 'error', text: 'Le SIRET doit contenir exactement 14 chiffres.' });
      return;
    }

    if (!formData.agree_terms) {
      setMessage({ type: 'error', text: 'Vous devez certifier que les informations sont exactes.' });
      return;
    }

    if (existingRequest?.status === 'pending') {
      setMessage({ type: 'info', text: 'Votre demande de certification est déjà en cours de traitement.' });
      return;
    }

    setLoading(true);

    try {
      console.log('Inserting salon verification...');
      const { data, error } = await supabase
        .from('salon_verifications')
        .insert({
          user_id: user.id,
          salon_name: formData.salon_name,
          siret: formData.siret.replace(/\s/g, ''),
          address: formData.address,
          phone: formData.phone || null,
          status: 'pending'
        })
        .select();

      console.log('Insert result:', { data, error });

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      setMessage({ type: 'success', text: 'Votre demande a été envoyée avec succès ! Nous la traiterons dans les plus brefs délais.' });
      setFormData({
        salon_name: '',
        siret: '',
        address: '',
        phone: '',
        agree_terms: false
      });

      await checkExistingRequest();
    } catch (error: any) {
      console.error('Error submitting request:', error);
      setMessage({ type: 'error', text: `Une erreur est survenue : ${error.message || 'Erreur inconnue'}` });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-4 h-4 mr-1" />
          En attente
        </span>;
      case 'approved':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Approuvée
        </span>;
      case 'rejected':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <AlertCircle className="w-4 h-4 mr-1" />
          Refusée
        </span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <Shield className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Demander le badge Salon certifié</h1>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <Info className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-2">À propos du badge Salon certifié</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Le badge est réservé aux salons de coiffure professionnels.</li>
                <li>Nous vérifions le SIRET manuellement via annuaire-entreprises.data.gouv.fr.</li>
                <li>Votre SIRET n'est pas affiché publiquement, seul le badge apparaît sur votre profil.</li>
                <li>Le badge renforce la confiance des acheteurs et valorise votre professionnalisme.</li>
              </ul>
            </div>
          </div>
        </div>

        {existingRequest && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Votre demande existante</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Salon :</span> {existingRequest.salon_name}</p>
              <p><span className="font-medium">SIRET :</span> {existingRequest.siret}</p>
              <p><span className="font-medium">Statut :</span> {getStatusBadge(existingRequest.status)}</p>
              <p><span className="font-medium">Date de demande :</span> {new Date(existingRequest.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
            {existingRequest.status === 'rejected' && (
              <p className="mt-3 text-sm text-gray-600">
                Vous pouvez soumettre une nouvelle demande ci-dessous.
              </p>
            )}
          </div>
        )}

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {message.text}
          </div>
        )}

        {(!existingRequest || existingRequest.status !== 'pending') && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="salon_name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom du salon <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="salon_name"
                required
                value={formData.salon_name}
                onChange={(e) => setFormData({ ...formData, salon_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nom officiel de votre salon"
              />
            </div>

            <div>
              <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-1">
                SIRET (14 chiffres) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="siret"
                required
                value={formData.siret}
                onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12345678901234"
                maxLength={14}
              />
              <p className="mt-1 text-xs text-gray-500">
                Vous pouvez trouver votre SIRET sur vos documents officiels ou sur annuaire-entreprises.data.gouv.fr
              </p>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse complète du salon <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Numéro, rue, code postal, ville"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone du salon
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="06 12 34 56 78"
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="agree_terms"
                required
                checked={formData.agree_terms}
                onChange={(e) => setFormData({ ...formData, agree_terms: e.target.checked })}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="agree_terms" className="ml-3 text-sm text-gray-700">
                <span className="text-red-500">*</span> Je certifie que les informations fournies sont exactes et que je suis autorisé(e) à représenter ce salon.
              </label>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-600">
              <p className="font-medium mb-1">Protection de vos données (RGPD)</p>
              <p>
                Les informations de votre salon, y compris votre SIRET, sont utilisées uniquement pour vérifier votre statut professionnel et lutter contre la fraude.
                Elles ne sont pas affichées publiquement. Pour en savoir plus, consultez notre Politique de confidentialité.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
