import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères'); return }
    setLoading(true)
    setError('')
    const { error } = await signUp(email, password, fullName)
    if (error) { setError(error.message); setLoading(false) }
    else navigate('/')
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'linear-gradient(135deg, #e6621f, #8b5a37)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem', fontFamily: 'Playfair Display, serif' }}>N</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1c1917', marginBottom: '8px' }}>Créer un compte</h1>
          <p style={{ color: '#78716c', fontSize: '0.9375rem' }}>Rejoignez NaturalHairMarket gratuitement</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e7e5e4', padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && <div style={{ padding: '12px', background: '#fee2e2', borderRadius: '8px', fontSize: '0.875rem', color: '#991b1b' }}>{error}</div>}
            <Input label="Nom complet" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Marie Dupont" />
            <Input label="Email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.fr" />
            <Input label="Mot de passe" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 caractères" hint="Au moins 6 caractères" />
            <Button type="submit" loading={loading} size="lg" style={{ width: '100%', marginTop: '4px' }}>Créer mon compte</Button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#78716c', marginTop: '20px' }}>
            Déjà un compte ?{' '}
            <Link to="/connexion" style={{ color: '#e6621f', fontWeight: 500 }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
