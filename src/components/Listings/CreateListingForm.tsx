import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { X, Upload, Image, ShieldCheck } from 'lucide-react';

interface CreateListingFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateListingForm({ onClose, onSuccess }: CreateListingFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    price: '',
    hair_length: '',
    hair_type: 'straight',
    hair_color: '',
    hair_texture: '',
    hair_weight: '',
    is_dyed: false,
    is_treated: false,
    is_natural_color: false,
    condition: 'excellent',
    country: 'France',
    certification_accepted: false,
  });

  const generateTitle = () => {
    const parts = [];

    if (formData.hair_length) {
      parts.push(formData.hair_length);
    }

    const hairTypeLabels: Record<string, string> = {
      straight: 'raides',
      wavy: 'ondulés',
      curly: 'bouclés',
      coily: 'frisés',
    };
    parts.push(hairTypeLabels[formData.hair_type]);

    if (formData.hair_color) {
      parts.push(formData.hair_color.toLowerCase());
    }

    if (formData.is_natural_color) {
      parts.push('naturels');
    }

    return `Cheveux ${parts.join(' ')}`;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user!.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('hair-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('hair-images')
          .getPublicUrl(fileName);

        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...urls]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const title = generateTitle();
      const description = `Cheveux ${formData.hair_type} de ${formData.hair_length}, couleur ${formData.hair_color}${formData.is_natural_color ? ' (naturelle)' : ''}${formData.is_dyed ? ', colorés' : ''}${formData.is_treated ? ', traités' : ''}. État: ${formData.condition}.`;

      if (!formData.certification_accepted) {
        throw new Error('Vous devez certifier l\'authenticité des cheveux pour publier cette annonce.');
      }

      const { error: insertError } = await supabase
        .from('listings')
        .insert({
          seller_id: user!.id,
          title: title,
          description: description,
          price: parseFloat(formData.price),
          hair_length: formData.hair_length,
          hair_type: formData.hair_type,
          hair_color: formData.hair_color,
          hair_texture: formData.hair_texture || null,
          hair_weight: formData.hair_weight || null,
          is_dyed: formData.is_dyed,
          is_treated: formData.is_treated,
          condition: formData.condition,
          images: uploadedImages,
          country: formData.country,
          certification_accepted: formData.certification_accepted,
        });

      if (insertError) throw insertError;

      onSuccess();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Créer une annonce</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-lg">
            <p className="text-sm text-emerald-800 font-medium">
              Aperçu du titre: <span className="font-bold">{generateTitle()}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (€) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
                placeholder="150.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longueur *
              </label>
              <select
                value={formData.hair_length}
                onChange={(e) => setFormData({ ...formData, hair_length: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionnez</option>
                <option value="10cm">10cm</option>
                <option value="15cm">15cm</option>
                <option value="20cm">20cm</option>
                <option value="25cm">25cm</option>
                <option value="30cm">30cm</option>
                <option value="35cm">35cm</option>
                <option value="40cm">40cm</option>
                <option value="45cm">45cm</option>
                <option value="50cm">50cm</option>
                <option value="55cm">55cm</option>
                <option value="60cm">60cm</option>
                <option value="65cm">65cm</option>
                <option value="70cm">70cm</option>
                <option value="75cm">75cm</option>
                <option value="80cm">80cm</option>
                <option value="85cm">85cm</option>
                <option value="90cm">90cm</option>
                <option value="95cm">95cm</option>
                <option value="100cm">100cm</option>
                <option value="105cm">105cm</option>
                <option value="110cm">110cm</option>
                <option value="115cm">115cm</option>
                <option value="120cm">120cm</option>
                <option value="125cm">125cm</option>
                <option value="130cm">130cm</option>
                <option value="135cm">135cm</option>
                <option value="140cm">140cm</option>
                <option value="145cm">145cm</option>
                <option value="150cm">150cm</option>
                <option value="155cm">155cm</option>
                <option value="160cm">160cm</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de cheveux *
              </label>
              <select
                value={formData.hair_type}
                onChange={(e) => setFormData({ ...formData, hair_type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="straight">Raides</option>
                <option value="wavy">Ondulés</option>
                <option value="curly">Bouclés</option>
                <option value="coily">Frisés</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Couleur *
              </label>
              <select
                value={formData.hair_color}
                onChange={(e) => setFormData({ ...formData, hair_color: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionnez</option>
                <option value="noir">Noir</option>
                <option value="brun foncé">Brun foncé</option>
                <option value="brun">Brun</option>
                <option value="châtain foncé">Châtain foncé</option>
                <option value="châtain">Châtain</option>
                <option value="châtain clair">Châtain clair</option>
                <option value="blond foncé">Blond foncé</option>
                <option value="blond">Blond</option>
                <option value="blond clair">Blond clair</option>
                <option value="blond platine">Blond platine</option>
                <option value="roux foncé">Roux foncé</option>
                <option value="roux">Roux</option>
                <option value="roux clair">Roux clair</option>
                <option value="gris">Gris</option>
                <option value="blanc">Blanc</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texture
              </label>
              <select
                value={formData.hair_texture}
                onChange={(e) => setFormData({ ...formData, hair_texture: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Sélectionnez (optionnel)</option>
                <option value="très fin">Très fin</option>
                <option value="fin">Fin</option>
                <option value="moyen">Moyen</option>
                <option value="épais">Épais</option>
                <option value="très épais">Très épais</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Poids
              </label>
              <select
                value={formData.hair_weight}
                onChange={(e) => setFormData({ ...formData, hair_weight: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Sélectionnez (optionnel)</option>
                <option value="25g">25g</option>
                <option value="50g">50g</option>
                <option value="75g">75g</option>
                <option value="100g">100g</option>
                <option value="125g">125g</option>
                <option value="150g">150g</option>
                <option value="175g">175g</option>
                <option value="200g">200g</option>
                <option value="225g">225g</option>
                <option value="250g">250g</option>
                <option value="275g">275g</option>
                <option value="300g">300g</option>
                <option value="325g">325g</option>
                <option value="350g">350g</option>
                <option value="375g">375g</option>
                <option value="400g">400g</option>
                <option value="425g">425g</option>
                <option value="450g">450g</option>
                <option value="475g">475g</option>
                <option value="500g">500g</option>
                <option value="525g">525g</option>
                <option value="550g">550g</option>
                <option value="575g">575g</option>
                <option value="600g">600g</option>
                <option value="625g">625g</option>
                <option value="650g">650g</option>
                <option value="675g">675g</option>
                <option value="700g">700g</option>
                <option value="725g">725g</option>
                <option value="750g">750g</option>
                <option value="775g">775g</option>
                <option value="800g">800g</option>
                <option value="825g">825g</option>
                <option value="850g">850g</option>
                <option value="875g">875g</option>
                <option value="900g">900g</option>
                <option value="925g">925g</option>
                <option value="950g">950g</option>
                <option value="975g">975g</option>
                <option value="1000g">1000g</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                État *
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="excellent">Excellent</option>
                <option value="good">Bon</option>
                <option value="fair">Moyen</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays de provenance *
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Allemagne">Allemagne</option>
                <option value="Italie">Italie</option>
                <option value="Espagne">Espagne</option>
                <option value="Portugal">Portugal</option>
                <option value="Pays-Bas">Pays-Bas</option>
                <option value="Royaume-Uni">Royaume-Uni</option>
                <option value="Irlande">Irlande</option>
                <option value="Autriche">Autriche</option>
                <option value="Pologne">Pologne</option>
                <option value="Suède">Suède</option>
                <option value="Norvège">Norvège</option>
                <option value="Danemark">Danemark</option>
                <option value="Finlande">Finlande</option>
                <option value="Grèce">Grèce</option>
                <option value="Russie">Russie</option>
                <option value="Ukraine">Ukraine</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.is_natural_color}
                onChange={(e) => setFormData({ ...formData, is_natural_color: e.target.checked })}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-gray-700">Couleur naturelle</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.is_dyed}
                onChange={(e) => setFormData({ ...formData, is_dyed: e.target.checked })}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-gray-700">Cheveux colorés</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.is_treated}
                onChange={(e) => setFormData({ ...formData, is_treated: e.target.checked })}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-gray-700">Cheveux traités chimiquement</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Image className="w-4 h-4 inline mr-1" />
              Photos des cheveux
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 font-medium">
                  {uploading ? 'Téléchargement...' : 'Cliquez pour télécharger des photos'}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG, JPEG jusqu'à 10MB
                </span>
              </label>
            </div>

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-2">Certification obligatoire</h3>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.certification_accepted}
                    onChange={(e) => setFormData({ ...formData, certification_accepted: e.target.checked })}
                    className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-1 flex-shrink-0"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    <strong className="text-red-600">Je certifie</strong> que les cheveux déposés sur cette annonce sont
                    <strong> 100% humains, naturels et non synthétiques</strong>. Je comprends qu'en cas de fausse déclaration,
                    l'acheteur peut demander un remboursement total et mon compte peut être suspendu.
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer l\'annonce'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
