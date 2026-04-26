import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) { setError('Email ou mot de passe incorrect'); setLoading(false) }
    else navigate('/')
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'linear-gradient(135deg, #e6621f, #8b5a37)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem', fontFamily: 'Playfair Display, serif' }}>N</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1c1917', marginBottom: '8px' }}>Connexion</h1>
          <p style={{ color: '#78716c', fontSize: '0.9375rem' }}>Bon retour sur NaturalHairMarket</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e7e5e4', padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && <div style={{ padding: '12px', background: '#fee2e2', borderRadius: '8px', fontSize: '0.875rem', color: '#991b1b' }}>{error}</div>}
            <Input label="Email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.fr" />
            <Input label="Mot de passe" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            <Button type="submit" loading={loading} size="lg" style={{ width: '100%', marginTop: '4px' }}>Se connecter</Button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#78716c', marginTop: '20px' }}>
            Pas encore de compte ?{' '}
            <Link to="/inscription" style={{ color: '#e6621f', fontWeight: 500 }}>S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
