import { useState, useEffect } from 'react'
import { Camera, Save, Building2, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'

export function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const [form, setForm] = useState({ full_name: '', phone: '', bio: '', city: '', address_line1: '', postal_code: '' })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [salonModal, setSalonModal] = useState(false)
  const [salonForm, setSalonForm] = useState({ salon_name: '', siret: '', address: '', phone: '' })
  const [salonLoading, setSalonLoading] = useState(false)
  const [salonSuccess, setSalonSuccess] = useState(false)
  const [existingVerification, setExistingVerification] = useState<{ status: string } | null>(null)

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        city: profile.city || '',
        address_line1: profile.address_line1 || '',
        postal_code: profile.postal_code || '',
      })
    }
    if (user) {
      supabase.from('salon_verifications').select('status').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle()
        .then(({ data }) => setExistingVerification(data ? { status: data.status ?? 'pending' } : null))
    }
  }, [profile, user])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    await supabase.from('profiles').update({ ...form, updated_at: new Date().toISOString() }).eq('id', user.id)
    await refreshProfile()
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setAvatarUploading(true)
    const path = `avatars/${user.id}.${file.name.split('.').pop()}`
    const { data, error } = await supabase.storage.from('hair-images').upload(path, file, { upsert: true })
    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage.from('hair-images').getPublicUrl(data.path)
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
      await refreshProfile()
    }
    setAvatarUploading(false)
  }

  async function submitSalonVerification(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSalonLoading(true)
    await supabase.from('salon_verifications').insert({ user_id: user.id, ...salonForm })
    setSalonLoading(false)
    setSalonSuccess(true)
    setExistingVerification({ status: 'pending' })
    setTimeout(() => { setSalonModal(false); setSalonSuccess(false) }, 2500)
  }

  const sectionStyle = { background: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', padding: '24px', marginBottom: '20px' }

  return (
    <div className="container" style={{ padding: '32px 24px', maxWidth: '680px' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#1c1917', marginBottom: '32px' }}>Mon profil</h1>

      {/* Avatar */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#fbe5d5', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '1.75rem', fontWeight: 600, color: '#e6621f' }}>{profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}</span>
              )}
            </div>
            <label style={{
              position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%',
              background: '#e6621f', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: '2px solid #fff',
            }}>
              {avatarUploading ? <div style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : <Camera size={14} color="#fff" />}
              <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} disabled={avatarUploading} />
            </label>
          </div>
          <div>
            <p style={{ fontWeight: 600, color: '#1c1917', fontSize: '1.0625rem' }}>{profile?.full_name || 'Utilisateur'}</p>
            <p style={{ color: '#78716c', fontSize: '0.875rem' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
              {profile?.is_verified_salon && <Badge variant="info">Salon vérifié</Badge>}
              {profile?.is_certified_salon && <Badge variant="success">Salon certifié</Badge>}
            </div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave}>
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#1c1917', marginBottom: '20px' }}>Informations personnelles</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Nom complet" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Marie Dupont" />
            <Input label="Téléphone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+33 6 12 34 56 78" />
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#44403c', marginBottom: '6px' }}>Bio</label>
              <textarea rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Présentez-vous en quelques mots..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.875rem', resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#1c1917', marginBottom: '20px' }}>Adresse</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Adresse" value={form.address_line1} onChange={e => setForm(f => ({ ...f, address_line1: e.target.value }))} placeholder="10 rue de la Paix" />
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px' }}>
              <Input label="Code postal" value={form.postal_code} onChange={e => setForm(f => ({ ...f, postal_code: e.target.value }))} placeholder="75001" />
              <Input label="Ville" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Paris" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button type="submit" loading={loading} size="lg" style={{ flex: 1 }}>
            <Save size={16} /> Enregistrer
          </Button>
          {saved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22c55e', fontSize: '0.875rem' }}>
              <CheckCircle size={16} /> Sauvegardé !
            </div>
          )}
        </div>
      </form>

      {/* Salon verification */}
      <div style={{ ...sectionStyle, marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#1c1917', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} color="#e6621f" /> Vérification salon
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#78716c' }}>Obtenez le badge "Salon vérifié" en fournissant votre SIRET</p>
          </div>
          {existingVerification ? (
            <Badge variant={existingVerification.status === 'approved' ? 'success' : existingVerification.status === 'rejected' ? 'error' : 'warning'}>
              {existingVerification.status === 'approved' ? 'Approuvé' : existingVerification.status === 'rejected' ? 'Refusé' : 'En attente'}
            </Badge>
          ) : (
            <Button variant="outline" onClick={() => setSalonModal(true)}>Demander la vérification</Button>
          )}
        </div>
      </div>

      {/* Salon Modal */}
      <Modal open={salonModal} onClose={() => setSalonModal(false)} title="Vérification salon">
        {salonSuccess ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle size={48} color="#22c55e" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1c1917', marginBottom: '8px' }}>Demande envoyée !</p>
            <p style={{ color: '#78716c' }}>Notre équipe examine votre dossier sous 48h.</p>
          </div>
        ) : (
          <form onSubmit={submitSalonVerification} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Nom du salon *" required value={salonForm.salon_name} onChange={e => setSalonForm(f => ({ ...f, salon_name: e.target.value }))} placeholder="Salon de beauté Marie" />
            <Input label="Numéro SIRET *" required value={salonForm.siret} onChange={e => setSalonForm(f => ({ ...f, siret: e.target.value }))} placeholder="12345678901234" />
            <Input label="Adresse du salon *" required value={salonForm.address} onChange={e => setSalonForm(f => ({ ...f, address: e.target.value }))} placeholder="10 rue de la Paix, 75001 Paris" />
            <Input label="Téléphone" type="tel" value={salonForm.phone} onChange={e => setSalonForm(f => ({ ...f, phone: e.target.value }))} placeholder="+33 1 23 45 67 89" />
            <Button type="submit" loading={salonLoading} style={{ width: '100%' }}>Envoyer la demande</Button>
          </form>
        )}
      </Modal>
    </div>
  )
}
