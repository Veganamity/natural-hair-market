import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

const HAIR_TYPES = [
  { value: 'afro', label: 'Afro' }, { value: 'kinky', label: 'Kinky' },
  { value: 'coily', label: 'Coily' }, { value: 'curly', label: 'Bouclé' },
  { value: 'wavy', label: 'Ondulé' }, { value: 'straight', label: 'Lisse' },
]
const HAIR_COLORS = ['Noir naturel', 'Brun foncé', 'Brun moyen', 'Brun clair', 'Châtain', 'Blond foncé', 'Blond', 'Roux', 'Gris/Blanc', 'Autre']
const CONDITIONS = [{ value: 'excellent', label: 'Excellent — Comme neuf' }, { value: 'good', label: 'Bon — Légèrement utilisé' }, { value: 'fair', label: 'Correct — Signes d\'usure visibles' }]
const LENGTHS = ['Court (< 20cm)', 'Mi-long (20-40cm)', 'Long (40-60cm)', 'Très long (> 60cm)']

export function CreateListingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)

  const [form, setForm] = useState({
    title: '', description: '', price: '', hair_type: '',
    hair_length: '', hair_color: '', hair_texture: '', weight_grams: '',
    is_dyed: false, is_treated: false, condition: 'excellent',
    accept_offers: true, instant_buy_enabled: true,
    certification_accepted: false,
  })

  function setField(key: string, value: string | boolean) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || !user) return
    setUploadingImage(true)
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/${Date.now()}.${ext}`
      const { data, error } = await supabase.storage.from('hair-images').upload(path, file, { upsert: true })
      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from('hair-images').getPublicUrl(data.path)
        setImages(prev => [...prev, publicUrl])
      }
    }
    setUploadingImage(false)
    e.target.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    if (!form.certification_accepted) { setError('Vous devez certifier que vos cheveux sont naturels'); return }
    setLoading(true)
    setError('')

    const { error } = await supabase.from('listings').insert({
      seller_id: user.id,
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      hair_type: form.hair_type,
      hair_length: form.hair_length,
      hair_color: form.hair_color,
      hair_texture: form.hair_texture || null,
      weight_grams: form.weight_grams ? parseInt(form.weight_grams) : 100,
      is_dyed: form.is_dyed,
      is_treated: form.is_treated,
      condition: form.condition,
      images: images,
      accept_offers: form.accept_offers,
      instant_buy_enabled: form.instant_buy_enabled,
      certification_accepted: form.certification_accepted,
      country: 'France',
      status: 'active',
    })

    if (error) { setError(error.message); setLoading(false); return }
    navigate('/mes-annonces')
  }

  const sectionStyle = {
    background: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', padding: '24px', marginBottom: '20px',
  }

  return (
    <div className="container" style={{ padding: '32px 24px', maxWidth: '720px' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#1c1917', marginBottom: '8px' }}>Déposer une annonce</h1>
      <p style={{ color: '#78716c', marginBottom: '32px' }}>Vendez vos cheveux naturels en quelques étapes</p>

      <form onSubmit={handleSubmit}>
        {error && <div style={{ padding: '12px', background: '#fee2e2', borderRadius: '8px', color: '#991b1b', marginBottom: '20px', fontSize: '0.875rem' }}>{error}</div>}

        {/* Photos */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#1c1917', marginBottom: '16px' }}>Photos</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {images.map((img, i) => (
              <div key={i} style={{ position: 'relative', width: 100, height: 100, borderRadius: '10px', overflow: 'hidden', border: '1px solid #e7e5e4' }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button type="button" onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))}
                  style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={12} />
                </button>
              </div>
            ))}
            {images.length < 6 && (
              <label style={{ width: 100, height: 100, borderRadius: '10px', border: '2px dashed #d6d3d1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#a8a29e', gap: '6px', fontSize: '0.75rem', transition: 'all 0.15s' }}>
                {uploadingImage ? <div style={{ width: 20, height: 20, border: '2px solid #e7e5e4', borderTopColor: '#e6621f', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : <><Upload size={20} /><span>Ajouter</span></>}
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImage} />
              </label>
            )}
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#a8a29e', marginTop: '10px' }}>Maximum 6 photos · JPG, PNG, WebP</p>
        </div>

        {/* Infos */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#1c1917', marginBottom: '16px' }}>Informations</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Titre de l'annonce *" required value={form.title} onChange={e => setField('title', e.target.value)} placeholder="Ex: Mèche afro naturelle noire 40cm" />
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#44403c', marginBottom: '6px' }}>Description *</label>
              <textarea required rows={4} value={form.description} onChange={e => setField('description', e.target.value)}
                placeholder="Décrivez vos cheveux : entretien, histoire, qualité..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.875rem', resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            <Input label="Prix (€) *" type="number" min={1} step={0.01} required value={form.price} onChange={e => setField('price', e.target.value)} placeholder="Ex: 95.00" />
            <Input label="Poids approximatif (grammes) *" type="number" min={10} required value={form.weight_grams} onChange={e => setField('weight_grams', e.target.value)} placeholder="Ex: 150" hint="Nécessaire pour calculer les frais de livraison" />
          </div>
        </div>

        {/* Characteristics */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#1c1917', marginBottom: '16px' }}>Caractéristiques</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#44403c', marginBottom: '6px' }}>Type de cheveux *</label>
              <select required value={form.hair_type} onChange={e => setField('hair_type', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.875rem', background: '#fff' }}>
                <option value="">Sélectionner...</option>
                {HAIR_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#44403c', marginBottom: '6px' }}>Longueur *</label>
              <select required value={form.hair_length} onChange={e => setField('hair_length', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.875rem', background: '#fff' }}>
                <option value="">Sélectionner...</option>
                {LENGTHS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#44403c', marginBottom: '6px' }}>Couleur *</label>
              <select required value={form.hair_color} onChange={e => setField('hair_color', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.875rem', background: '#fff' }}>
                <option value="">Sélectionner...</option>
                {HAIR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#44403c', marginBottom: '6px' }}>État *</label>
              <select required value={form.condition} onChange={e => setField('condition', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.875rem', background: '#fff' }}>
                {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[{ key: 'is_dyed', label: 'Cheveux teints' }, { key: 'is_treated', label: 'Cheveux traités chimiquement' }].map(({ key, label }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9375rem', color: '#44403c' }}>
                <input type="checkbox" checked={form[key as keyof typeof form] as boolean} onChange={e => setField(key, e.target.checked)} style={{ accentColor: '#e6621f', width: 16, height: 16 }} />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Options */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#1c1917', marginBottom: '16px' }}>Options de vente</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { key: 'instant_buy_enabled', label: 'Achat immédiat', desc: 'Les acheteurs peuvent acheter directement au prix indiqué' },
              { key: 'accept_offers', label: 'Accepter les offres', desc: 'Les acheteurs peuvent vous proposer un autre prix' },
            ].map(({ key, label, desc }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '12px', borderRadius: '8px', border: `1px solid ${form[key as keyof typeof form] ? '#e6621f' : '#e7e5e4'}`, background: form[key as keyof typeof form] ? '#fdf4ef' : '#fff' }}>
                <input type="checkbox" checked={form[key as keyof typeof form] as boolean} onChange={e => setField(key, e.target.checked)} style={{ accentColor: '#e6621f', width: 16, height: 16, marginTop: 2 }} />
                <div>
                  <p style={{ fontWeight: 500, color: '#1c1917', fontSize: '0.9375rem' }}>{label}</p>
                  <p style={{ fontSize: '0.8125rem', color: '#78716c' }}>{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Certification */}
        <div style={{ ...sectionStyle, border: '1px solid #fca97b', background: '#fdf4ef' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
            <input type="checkbox" required checked={form.certification_accepted} onChange={e => setField('certification_accepted', e.target.checked)} style={{ accentColor: '#e6621f', width: 18, height: 18, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 600, color: '#1c1917', marginBottom: '4px' }}>Certification *</p>
              <p style={{ fontSize: '0.875rem', color: '#57534e', lineHeight: 1.6 }}>
                Je certifie que les cheveux proposés sont 100% naturels, sans extensions synthétiques, et correspondent exactement à la description et aux photos fournies.
              </p>
            </div>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)} style={{ flex: 1 }}>Annuler</Button>
          <Button type="submit" size="lg" loading={loading} style={{ flex: 2 }}>Publier l'annonce</Button>
        </div>
      </form>
    </div>
  )
}
