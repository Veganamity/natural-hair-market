import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Transaction, Listing } from '../types/database'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type TransactionWithListing = Transaction & { listings: Listing | null }

const STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default'; icon: React.ReactNode }> = {
  pending: { label: 'En attente', variant: 'warning', icon: <Clock size={14} /> },
  processing: { label: 'En cours', variant: 'info', icon: <Clock size={14} /> },
  completed: { label: 'Terminé', variant: 'success', icon: <CheckCircle size={14} /> },
  failed: { label: 'Échoué', variant: 'error', icon: <XCircle size={14} /> },
  refunded: { label: 'Remboursé', variant: 'default', icon: <XCircle size={14} /> },
  cancelled: { label: 'Annulé', variant: 'error', icon: <XCircle size={14} /> },
}

const DELIVERY_STATUS: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  pending: { label: 'Préparation', variant: 'default' },
  shipped: { label: 'Expédié', variant: 'info' },
  delivered: { label: 'Livré', variant: 'success' },
  cancelled: { label: 'Annulé', variant: 'error' },
}

export function OrdersPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'purchases' | 'sales'>('purchases')
  const [transactions, setTransactions] = useState<TransactionWithListing[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!user) return
    setLoading(true)
    const col = tab === 'purchases' ? 'buyer_id' : 'seller_id'
    supabase.from('transactions').select('*, listings(*)').eq(col, user.id).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setTransactions(data as unknown as TransactionWithListing[]); setLoading(false) })
  }, [user, tab])

  function toggleExpand(id: string) {
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  async function confirmDelivery(txId: string) {
    await supabase.from('transactions').update({ delivery_status: 'delivered', delivery_confirmed_at: new Date().toISOString() }).eq('id', txId)
    setTransactions(ts => ts.map(t => t.id === txId ? { ...t, delivery_status: 'delivered' } : t))
  }

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#1c1917', marginBottom: '24px' }}>Mes commandes</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #e7e5e4', marginBottom: '32px' }}>
        {[{ id: 'purchases', label: 'Mes achats' }, { id: 'sales', label: 'Mes ventes' }].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as 'purchases' | 'sales')}
            style={{
              padding: '12px 24px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.9375rem', fontWeight: 500,
              color: tab === t.id ? '#e6621f' : '#78716c',
              borderBottom: `2px solid ${tab === t.id ? '#e6621f' : 'transparent'}`,
              marginBottom: '-2px', transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #e7e5e4', borderTopColor: '#e6621f', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <Package size={48} color="#a8a29e" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontSize: '1.125rem', color: '#78716c', marginBottom: '8px' }}>Aucune {tab === 'purchases' ? 'commande' : 'vente'}</p>
          {tab === 'purchases' && <Button onClick={() => navigate('/annonces')}>Parcourir les annonces</Button>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {transactions.map(tx => {
            const isExpanded = expanded.has(tx.id)
            const statusCfg = STATUS_CONFIG[tx.status] || STATUS_CONFIG.pending
            const deliveryCfg = DELIVERY_STATUS[tx.delivery_status || 'pending']
            const listing = tx.listings
            const images = listing && Array.isArray(listing.images) ? listing.images as string[] : []

            return (
              <div key={tx.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', overflow: 'hidden' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', cursor: 'pointer' }}
                  onClick={() => toggleExpand(tx.id)}
                >
                  <div style={{ width: 60, height: 60, borderRadius: '8px', background: '#f5f5f4', overflow: 'hidden', flexShrink: 0 }}>
                    {images[0] ? <img src={images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={24} color="#a8a29e" style={{ margin: 'auto', display: 'block', paddingTop: '18px' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, color: '#1c1917', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {listing?.title || 'Annonce supprimée'}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                      {tx.delivery_status && tx.delivery_status !== 'pending' && <Badge variant={deliveryCfg.variant}>{deliveryCfg.label}</Badge>}
                      <span style={{ fontSize: '0.8125rem', color: '#a8a29e' }}>{format(new Date(tx.created_at), 'dd MMM yyyy', { locale: fr })}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#e6621f' }}>{tx.amount.toFixed(2)} €</p>
                    {isExpanded ? <ChevronUp size={16} color="#a8a29e" /> : <ChevronDown size={16} color="#a8a29e" />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '0 16px 16px', borderTop: '1px solid #f5f5f4' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', paddingTop: '16px', marginBottom: '16px' }}>
                      {[
                        { label: 'Montant total', value: `${tx.amount.toFixed(2)} €` },
                        { label: tab === 'purchases' ? 'Frais de livraison' : 'Montant reçu', value: tab === 'purchases' ? `${(tx.shipping_price || 0).toFixed(2)} €` : `${tx.seller_amount.toFixed(2)} €` },
                        { label: 'Mode de livraison', value: tx.shipping_method || '—' },
                        { label: 'Numéro de suivi', value: tx.tracking_number || tx.shipping_label_tracking_number || '—' },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p style={{ fontSize: '0.75rem', color: '#78716c', marginBottom: '2px' }}>{label}</p>
                          <p style={{ fontWeight: 500, color: '#1c1917', fontSize: '0.875rem' }}>{value}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {tab === 'purchases' && tx.delivery_status === 'shipped' && (
                        <Button size="sm" variant="secondary" onClick={() => confirmDelivery(tx.id)}>
                          <CheckCircle size={14} /> Confirmer la réception
                        </Button>
                      )}
                      {tx.shipping_label_pdf_url && (
                        <a href={tx.shipping_label_pdf_url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <Truck size={14} /> Étiquette d'envoi <ExternalLink size={12} />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
