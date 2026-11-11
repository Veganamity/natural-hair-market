import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { compressImage } from '../../lib/imageUtils';
import { X, Upload, Image, ShieldCheck, FileText, AlertCircle } from 'lucide-react';

interface CreateListingFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateListingForm({ onClose, onSuccess }: CreateListingFormProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [lengthUnit, setLengthUnit] = useState<'cm' | 'inches'>('cm');

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
    country: '',
    certification_accepted: false,
  });

  const cmToInches = (cm: number) => Math.round(cm / 2.54);
  const inchesToCm = (inches: number) => Math.round(inches * 2.54);

  const hairTypeLabels: Record<string, string> = {
    straight: t('hairTypes.straight'),
    wavy: t('hairTypes.wavy'),
    curly: t('hairTypes.curly'),
    coily: t('hairTypes.coily'),
  };

  const conditionLabels: Record<string, string> = {
    excellent: t('condition.excellent'),
    good: t('condition.good'),
    fair: t('condition.fair'),
  };

  const generateDescription = (): string => {
    const lengthCm = formData.hair_length ? parseInt(formData.hair_length.replace('cm', '')) : null;
    const lengthInches = lengthCm ? cmToInches(lengthCm) : null;
    const weightNum = formData.hair_weight ? formData.hair_weight.replace('g', '') : null;
    const type = hairTypeLabels[formData.hair_type] || formData.hair_type;
    const condition = conditionLabels[formData.condition] || formData.condition;

    const parts: string[] = [];

    parts.push(
      `Cette annonce propose des cheveux ${type}${formData.hair_color ? ` de couleur ${formData.hair_color}` : ''}.`
    );

    if (lengthCm && lengthInches && weightNum) {
      parts.push(`D'une longueur de ${lengthCm} cm (${lengthInches} pouces), cette pièce pèse environ ${weightNum} g.`);
    } else if (lengthCm && lengthInches) {
      parts.push(`D'une longueur de ${lengthCm} cm (${lengthInches} pouces).`);
    }

    const textureStr = formData.hair_texture ? `La texture est ${formData.hair_texture} et l'` : "L'";
    parts.push(`${textureStr}article est dans un état ${condition}.`);

    if (formData.country) {
      parts.push(`Provenance : ${formData.country}.`);
    }

    if (formData.is_natural_color) {
      parts.push('Ces cheveux sont naturels.');
    }

    if (formData.is_dyed || formData.is_treated) {
      parts.push('Note : Cheveux colorés ou traités.');
    }

    return parts.join(' ');
  };

  const generateTitle = () => {
    const parts = [];

    if (formData.hair_length) {
      parts.push(formData.hair_length);
    }

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
        const compressed = await compressImage(file);
        const fileName = `${user!.id}/${Math.random().toString(36).substring(2)}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from('hair-images')
          .upload(fileName, compressed, {
            cacheControl: '31536000',
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
      const description = generateDescription();

      if (uploadedImages.length === 0) {
        throw new Error(t('createListing.addPhotoError'));
      }

      if (!formData.hair_texture) {
        throw new Error(t('createListing.textureError'));
      }

      if (!formData.hair_weight) {
        throw new Error(t('createListing.weightError'));
      }

      if (!formData.certification_accepted) {
        throw new Error(t('createListing.certifyError'));
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
          weight_grams: formData.hair_weight ? parseInt(formData.hair_weight.replace('g', ''), 10) || 100 : 100,
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
          <h2 className="text-2xl font-bold text-gray-800">{t('createListing.title')}</h2>
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
              {t('createListing.titlePreview')} <span className="font-bold">{generateTitle()}</span>
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                {t('createListing.bankWarning')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('createListing.priceLabel')}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
                placeholder={t('createListing.pricePlaceholder')}
              />
              <p className="text-xs text-gray-500 mt-1">{t('createListing.commissionHelper')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  {t('createListing.lengthLabel')}
                </label>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setLengthUnit('cm')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      lengthUnit === 'cm'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {t('createListing.cm')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLengthUnit('inches')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      lengthUnit === 'inches'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {t('createListing.inches')}
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={lengthUnit === 'cm' ? '200' : '80'}
                  step="1"
                  value={
                    formData.hair_length
                      ? lengthUnit === 'cm'
                        ? formData.hair_length.replace('cm', '')
                        : cmToInches(parseInt(formData.hair_length.replace('cm', '')))
                      : ''
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      const numValue = lengthUnit === 'cm' ? parseInt(value) : inchesToCm(parseInt(value));
                      setFormData({ ...formData, hair_length: `${numValue}cm` });
                    } else {
                      setFormData({ ...formData, hair_length: '' });
                    }
                  }}
                  className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                  placeholder={lengthUnit === 'cm' ? '50' : '20'}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                  {lengthUnit === 'cm' ? t('createListing.cm') : t('createListing.inches')}
                  {formData.hair_length && (
                    <span className="ml-1 text-xs text-gray-400">
                      ({lengthUnit === 'cm' ? cmToInches(parseInt(formData.hair_length)) + ' ' + t('createListing.inches') : formData.hair_length})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('createListing.typeLabel')}
              </label>
              <select
                value={formData.hair_type}
                onChange={(e) => setFormData({ ...formData, hair_type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="straight">{t('hairTypes.straight')}</option>
                <option value="wavy">{t('hairTypes.wavy')}</option>
                <option value="curly">{t('hairTypes.curly')}</option>
                <option value="coily">{t('hairTypes.coily')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('createListing.colorLabel')}
              </label>
              <select
                value={formData.hair_color}
                onChange={(e) => setFormData({ ...formData, hair_color: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">{t('hairColors.select')}</option>
                <option value="noir">{t('hairColors.black')}</option>
                <option value="brun foncé">{t('hairColors.dark_brown')}</option>
                <option value="brun">{t('hairColors.brown')}</option>
                <option value="châtain foncé">{t('hairColors.dark_chestnut')}</option>
                <option value="châtain">{t('hairColors.chestnut')}</option>
                <option value="châtain clair">{t('hairColors.light_chestnut')}</option>
                <option value="blond foncé">{t('hairColors.dark_blond')}</option>
                <option value="blond">{t('hairColors.blond')}</option>
                <option value="blond clair">{t('hairColors.light_blond')}</option>
                <option value="blond platine">{t('hairColors.platinum_blond')}</option>
                <option value="roux foncé">{t('hairColors.dark_red')}</option>
                <option value="roux">{t('hairColors.red')}</option>
                <option value="roux clair">{t('hairColors.light_red')}</option>
                <option value="gris">{t('hairColors.gray')}</option>
                <option value="blanc">{t('hairColors.white')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('createListing.textureLabel')}
              </label>
              <select
                value={formData.hair_texture}
                onChange={(e) => setFormData({ ...formData, hair_texture: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">{t('hairTextures.select')}</option>
                <option value="très fin">{t('hairTextures.very_fine')}</option>
                <option value="fin">{t('hairTextures.fine')}</option>
                <option value="moyen">{t('hairTextures.medium')}</option>
                <option value="épais">{t('hairTextures.thick')}</option>
                <option value="très épais">{t('hairTextures.very_thick')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('createListing.weightLabel')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="5000"
                  step="1"
                  value={formData.hair_weight.replace('g', '')}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      setFormData({ ...formData, hair_weight: `${value}g` });
                    } else {
                      setFormData({ ...formData, hair_weight: '' });
                    }
                  }}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={t('createListing.weightPlaceholder')}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                  g
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('createListing.conditionLabel')}
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="excellent">{t('condition.excellent')}</option>
                <option value="good">{t('condition.good')}</option>
                <option value="fair">{t('condition.fair')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('createListing.countryLabel')}
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">{t('countries.select')}</option>
                <optgroup label={t('countries.europe')}>
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
                </optgroup>
                <optgroup label={t('countries.asia')}>
                  <option value="Inde">Inde</option>
                  <option value="Chine">Chine</option>
                </optgroup>
                <optgroup label={t('countries.latam')}>
                  <option value="Brésil">Brésil</option>
                </optgroup>
                <optgroup label={t('countries.other')}>
                  <option value="Autre">Autre</option>
                </optgroup>
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
              <span className="text-sm font-medium text-gray-700">{t('createListing.naturalColor')}</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.is_dyed}
                onChange={(e) => setFormData({ ...formData, is_dyed: e.target.checked })}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-gray-700">{t('createListing.dyedHair')}</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.is_treated}
                onChange={(e) => setFormData({ ...formData, is_treated: e.target.checked })}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-gray-700">{t('createListing.treatedHair')}</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Image className="w-4 h-4 inline mr-1" />
              {t('createListing.photosLabel')}
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
                  {uploading ? t('createListing.uploading') : t('createListing.clickToUpload')}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {t('createListing.photoFormats')}
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
                <h3 className="font-bold text-gray-800 mb-2">{t('createListing.certificationRequired')}</h3>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.certification_accepted}
                    onChange={(e) => setFormData({ ...formData, certification_accepted: e.target.checked })}
                    className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-1 flex-shrink-0"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    {t('createListing.certifyText')}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-gray-700">{t('createListing.seoPreview')}</span>
              <span className="text-xs text-gray-400 ml-auto">{t('createListing.seoAutoGenerated')}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed bg-white border border-gray-100 rounded-lg px-4 py-3 select-none">
              {generateDescription() || <span className="text-gray-400 italic">{t('createListing.seoFillFields')}</span>}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('createListing.creating') : t('createListing.createBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
