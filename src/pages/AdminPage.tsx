import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Eye, Building2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { useNavigate } from 'react-router-dom'

interface VerificationWithProfile {
  id: string
  user_id: string
  salon_name: string
  siret: string
  address: string
  phone: string | null
  status: string | null
  created_at: string | null
  profiles: { full_name: string | null; email: string } | null
}

export function AdminPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [verifications, setVerifications] = useState<VerificationWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<VerificationWithProfile | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const isAdmin = profile?.email === 'admin@naturalhairmarket.fr' || profile?.email?.includes('+admin')

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return }
    supabase.rpc('get_salon_verifications_rpc')
      .then(({ data }) => {
        if (data) setVerifications(data as unknown as VerificationWithProfile[])
        setLoading(false)
      })
  }, [isAdmin])

  async function approve(id: string) {
    setActionLoading(true)
    await supabase.rpc('approve_salon_verification_rpc', { p_verification_id: id } as never)
    setVerifications(vs => vs.map(v => v.id === id ? { ...v, status: 'approved' } : v))
    setSelected(null)
    setActionLoading(false)
  }

  async function reject(id: string) {
    setActionLoading(true)
    await supabase.rpc('reject_salon_verification_rpc', { p_verification_id: id } as never)
    setVerifications(vs => vs.map(v => v.id === id ? { ...v, status: 'rejected' } : v))
    setSelected(null)
    setActionLoading(false)
  }

  const statusBadge = (status: string | null) => {
    if (status === 'approved') return <Badge variant="success">Approuvé</Badge>
    if (status === 'rejected') return <Badge variant="error">Refusé</Badge>
    if (status === 'revoked') return <Badge variant="error">Révoqué</Badge>
    return <Badge variant="warning">En attente</Badge>
  }

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <Building2 size={28} color="#e6621f" />
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#1c1917', marginBottom: '4px' }}>Administration</h1>
          <p style={{ color: '#78716c' }}>Gestion des vérifications de salons</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total', count: verifications.length, color: '#57534e' },
          { label: 'En attente', count: verifications.filter(v => v.status === 'pending').length, color: '#f59e0b' },
          { label: 'Approuvés', count: verifications.filter(v => v.status === 'approved').length, color: '#22c55e' },
          { label: 'Refusés', count: verifications.filter(v => v.status === 'rejected').length, color: '#ef4444' },
        ].map(({ label, count, color }) => (
          <div key={label} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', fontWeight: 700, color }}>{count}</p>
            <p style={{ fontSize: '0.875rem', color: '#78716c' }}>{label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #e7e5e4', borderTopColor: '#e6621f', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafaf9', borderBottom: '1px solid #e7e5e4' }}>
                {['Salon', 'Demandeur', 'SIRET', 'Date', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 600, color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {verifications.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 500, color: '#1c1917', fontSize: '0.9375rem' }}>{v.salon_name}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: '#57534e' }}>
                    <p>{v.profiles?.full_name || '—'}</p>
                    <p style={{ fontSize: '0.8125rem', color: '#a8a29e' }}>{v.profiles?.email}</p>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: '#57534e', fontFamily: 'monospace' }}>{v.siret}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.8125rem', color: '#a8a29e' }}>{v.created_at ? new Date(v.created_at).toLocaleDateString('fr-FR') : '—'}</td>
                  <td style={{ padding: '14px 16px' }}>{statusBadge(v.status)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => setSelected(v)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #e7e5e4', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Eye size={14} color="#78716c" />
                      </button>
                      {v.status === 'pending' && (
                        <>
                          <button onClick={() => approve(v.id)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #dcfce7', background: '#f0fdf4', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <CheckCircle size={14} color="#22c55e" />
                          </button>
                          <button onClick={() => reject(v.id)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fef2f2', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <XCircle size={14} color="#ef4444" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {verifications.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: '#a8a29e' }}>Aucune demande de vérification</div>
          )}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Détails de la demande">
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Nom du salon', value: selected.salon_name },
                { label: 'SIRET', value: selected.siret },
                { label: 'Adresse', value: selected.address },
                { label: 'Téléphone', value: selected.phone || '—' },
                { label: 'Demandeur', value: selected.profiles?.full_name || '—' },
                { label: 'Email', value: selected.profiles?.email || '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: '0.75rem', color: '#78716c', marginBottom: '2px', textTransform: 'uppercase' }}>{label}</p>
                  <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#1c1917' }}>{value}</p>
                </div>
              ))}
            </div>
            {selected.status === 'pending' && (
              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <Button variant="outline" onClick={() => reject(selected.id)} loading={actionLoading} style={{ flex: 1 }}>
                  <XCircle size={16} /> Refuser
                </Button>
                <Button onClick={() => approve(selected.id)} loading={actionLoading} style={{ flex: 1 }}>
                  <CheckCircle size={16} /> Approuver
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
