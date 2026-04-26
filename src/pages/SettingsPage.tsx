import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Shield, CreditCard, Bell, LogOut } from 'lucide-react'

export function SettingsPage() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [signOutModal, setSignOutModal] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }


  return (
    <div className="container" style={{ padding: '32px 24px', maxWidth: '640px' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#1c1917', marginBottom: '32px' }}>Paramètres</h1>

      {/* Stripe Connect */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#fdf4ef', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CreditCard size={20} color="#e6621f" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: 600, color: '#1c1917', marginBottom: '4px', fontSize: '1.0625rem' }}>Compte vendeur Stripe</h2>
            <p style={{ fontSize: '0.875rem', color: '#78716c', marginBottom: '16px', lineHeight: 1.5 }}>
              {profile?.stripe_onboarding_completed
                ? 'Votre compte vendeur est configuré. Vous pouvez recevoir des paiements.'
                : 'Configurez votre compte pour recevoir vos revenus de vente directement sur votre compte bancaire.'}
            </p>
            {profile?.stripe_onboarding_completed ? (
              <Button variant="outline" size="sm" onClick={() => window.open(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-stripe-login-link`, '_blank')}>
                Accéder au tableau de bord
              </Button>
            ) : (
              <Button size="sm" onClick={async () => {
                const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-stripe-connect-account`, {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
                })
                const { url } = await res.json()
                if (url) window.location.href = url
              }}>
                Configurer le compte vendeur
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Security */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={20} color="#22c55e" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: 600, color: '#1c1917', marginBottom: '4px', fontSize: '1.0625rem' }}>Sécurité</h2>
            <p style={{ fontSize: '0.875rem', color: '#78716c', marginBottom: '4px' }}>
              Email : <strong style={{ color: '#1c1917' }}>{user?.email}</strong>
            </p>
            <p style={{ fontSize: '0.8125rem', color: '#a8a29e' }}>Pour changer votre mot de passe, contactez le support.</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Bell size={20} color="#f59e0b" />
          </div>
          <div>
            <h2 style={{ fontWeight: 600, color: '#1c1917', marginBottom: '4px', fontSize: '1.0625rem' }}>Notifications</h2>
            <p style={{ fontSize: '0.875rem', color: '#78716c' }}>Les notifications par email sont activées pour les offres et commandes.</p>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={() => setSignOutModal(true)}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', background: 'none', border: '1px solid #fee2e2', borderRadius: '10px', padding: '12px 20px', cursor: 'pointer', fontSize: '0.9375rem', fontWeight: 500, width: '100%', justifyContent: 'center', transition: 'background 0.15s' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <LogOut size={18} /> Se déconnecter
      </button>

      <Modal open={signOutModal} onClose={() => setSignOutModal(false)} title="Se déconnecter" size="sm">
        <p style={{ color: '#57534e', marginBottom: '24px' }}>Êtes-vous sûre de vouloir vous déconnecter ?</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" onClick={() => setSignOutModal(false)} style={{ flex: 1 }}>Annuler</Button>
          <Button variant="danger" onClick={handleSignOut} style={{ flex: 1 }}>Déconnecter</Button>
        </div>
      </Modal>
    </div>
  )
}
