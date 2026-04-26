import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '24px', textAlign: 'center' }}>
      <p style={{ fontSize: '6rem', fontWeight: 700, color: '#e7e5e4', lineHeight: 1, marginBottom: '16px' }}>404</p>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1c1917', marginBottom: '8px' }}>Page introuvable</h1>
      <p style={{ color: '#78716c', marginBottom: '32px', maxWidth: '360px' }}>La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button variant="outline" onClick={() => navigate(-1)}>Retour</Button>
        <Button onClick={() => navigate('/')}>Accueil</Button>
      </div>
    </div>
  )
}
