import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Eye, CreditCard as Edit, Trash2, Package } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Listing } from '../types/database'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'

export function MyListingsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    supabase.from('listings').select('*').eq('seller_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setListings(data); setLoading(false) })
  }, [user])

  async function deleteListing(id: string) {
    await supabase.from('listings').update({ status: 'sold' }).eq('id', id)
    setListings(ls => ls.filter(l => l.id !== id))
    setDeleteModal(null)
  }

  const statusBadge = (status: string | null) => {
    const s = status || 'active'
    if (s === 'active') return <Badge variant="success">Active</Badge>
    if (s === 'sold') return <Badge variant="error">Vendue</Badge>
    return <Badge variant="warning">Réservée</Badge>
  }

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#1c1917', marginBottom: '4px' }}>Mes annonces</h1>
          <p style={{ color: '#78716c' }}>{listings.length} annonce{listings.length > 1 ? 's' : ''} au total</p>
        </div>
        <Button onClick={() => navigate('/vendre')} size="lg">
          <Plus size={18} /> Nouvelle annonce
        </Button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #e7e5e4', borderTopColor: '#e6621f', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', border: '2px dashed #e7e5e4', borderRadius: '16px' }}>
          <Package size={48} color="#a8a29e" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontSize: '1.125rem', fontWeight: 500, color: '#78716c', marginBottom: '8px' }}>Aucune annonce</p>
          <p style={{ color: '#a8a29e', marginBottom: '24px' }}>Commencez par déposer votre première annonce</p>
          <Button onClick={() => navigate('/vendre')}>Déposer une annonce</Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {listings.map(listing => {
            const images = Array.isArray(listing.images) ? listing.images as string[] : []
            return (
              <div key={listing.id} style={{ display: 'flex', gap: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', padding: '16px', alignItems: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '10px', overflow: 'hidden', background: '#f5f5f4', flexShrink: 0 }}>
                  {images[0] ? (
                    <img src={images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={24} color="#a8a29e" />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ fontWeight: 600, color: '#1c1917', fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing.title}</h3>
                    {statusBadge(listing.status)}
                  </div>
                  <p style={{ color: '#e6621f', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{listing.price.toFixed(2)} €</p>
                  <p style={{ fontSize: '0.8125rem', color: '#a8a29e' }}>
                    {listing.views_count || 0} vue{(listing.views_count || 0) > 1 ? 's' : ''} · Publié le {new Date(listing.created_at!).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <Link to={`/annonces/${listing.id}`} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e7e5e4', display: 'flex', alignItems: 'center', color: '#78716c' }}>
                    <Eye size={16} />
                  </Link>
                  <Link to={`/mes-annonces/${listing.id}/modifier`} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e7e5e4', display: 'flex', alignItems: 'center', color: '#78716c' }}>
                    <Edit size={16} />
                  </Link>
                  <button onClick={() => setDeleteModal(listing.id)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', color: '#ef4444', background: '#fff', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Supprimer l'annonce" size="sm">
        <p style={{ color: '#57534e', marginBottom: '24px' }}>Êtes-vous sûre de vouloir supprimer cette annonce ? Cette action est irréversible.</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" onClick={() => setDeleteModal(null)} style={{ flex: 1 }}>Annuler</Button>
          <Button variant="danger" onClick={() => deleteModal && deleteListing(deleteModal)} style={{ flex: 1 }}>Supprimer</Button>
        </div>
      </Modal>
    </div>
  )
}
