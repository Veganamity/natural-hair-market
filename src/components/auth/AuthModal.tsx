import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useAuth } from '../../contexts/AuthContext'

interface AuthModalProps {
  open: boolean
  onClose: () => void
  defaultMode?: 'login' | 'register'
}

export function AuthModal({ open, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signIn, signUp } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
      else onClose()
    } else {
      const { error } = await signUp(email, password, fullName)
      if (error) setError(error.message)
      else {
        setSuccess('Compte créé ! Vous pouvez maintenant vous connecter.')
        setMode('login')
      }
    }
    setLoading(false)
  }

  return (
    <Modal open={open} onClose={onClose} title={mode === 'login' ? 'Connexion' : 'Créer un compte'} size="sm">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {success && (
          <div style={{ padding: '12px', background: '#dcfce7', borderRadius: '8px', fontSize: '0.875rem', color: '#166534' }}>{success}</div>
        )}
        {error && (
          <div style={{ padding: '12px', background: '#fee2e2', borderRadius: '8px', fontSize: '0.875rem', color: '#991b1b' }}>{error}</div>
        )}
        {mode === 'register' && (
          <Input label="Nom complet" type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Marie Dupont" />
        )}
        <Input label="Email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.fr" />
        <Input label="Mot de passe" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        <Button type="submit" loading={loading} size="lg" style={{ width: '100%' }}>
          {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
        </Button>
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#78716c' }}>
          {mode === 'login' ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }} style={{ color: '#e6621f', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
            {mode === 'login' ? "S'inscrire" : 'Se connecter'}
          </button>
        </p>
      </form>
    </Modal>
  )
}
