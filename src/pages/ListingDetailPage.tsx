import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, ChevronLeft, ChevronRight, MapPin, User, Shield, Truck, MessageSquare, ShoppingCart, Flag } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Listing, Profile } from '../types/database'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'

const HAIR_TYPE_LABELS: Record<string, string> = {
  afro: 'Afro', kinky: 'Kinky', coily: 'Coily', curly: 'Bouclé', wavy: 'Ondulé', straight: 'Lisse',
}

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState<(Listing & { profiles: Profile | null }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [offerModal, setOfferModal] = useState(false)
  const [offerAmount, setOfferAmount] = useState('')
  const [offerMessage, setOfferMessage] = useState('')
  const [offerLoading, setOfferLoading] = useState(false)
  const [offerSuccess, setOfferSuccess] = useState(false)
  const [reportModal, setReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDesc, setReportDesc] = useState('')

  useEffect(() => {
    if (!id) return
    Promise.all([
      supabase.from('listings').select('*, profiles(*)').eq('id', id).maybeSingle(),
      user ? supabase.from('favorites').select('id').eq('user_id', user.id).eq('listing_id', id).maybeSingle() : Promise.resolve({ data: null }),
    ]).then(([{ data: l }, { data: fav }]) => {
      if (l) { setListing(l as unknown as Listing & { profiles: Profile | null }); supabase.from('listings').update({ views_count: ((l as unknown as Listing).views_count || 0) + 1 }).eq('id', id) }
      setIsFavorited(!!fav)
      setLoading(false)
    })
  }, [id, user])

  async function toggleFavorite() {
    if (!user || !listing) return
    if (isFavorited) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('listing_id', listing.id)
      setIsFavorited(false)
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, listing_id: listing.id })
      setIsFavorited(true)
    }
  }

  async function submitOffer() {
    if (!user || !listing) return
    setOfferLoading(true)
    await supabase.from('offers').insert({
      listing_id: listing.id, buyer_id: user.id,
      amount: parseFloat(offerAmount), message: offerMessage, status: 'pending',
    })
    setOfferLoading(false)
    setOfferSuccess(true)
    setTimeout(() => { setOfferModal(false); setOfferSuccess(false) }, 2000)
  }

  async function submitReport() {
    if (!user || !listing) return
    await supabase.from('listing_reports').insert({
      listing_id: listing.id, reporter_id: user.id, reason: reportReason, description: reportDesc,
    })
    setReportModal(false)
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #e7e5e4', borderTopColor: '#e6621f', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  if (!listing) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <p style={{ color: '#78716c', fontSize: '1.125rem' }}>Annonce introuvable</p>
      <Button onClick={() => navigate('/annonces')} style={{ marginTop: '16px' }}>Retour aux annonces</Button>
    </div>
  )

  const images = Array.isArray(listing.images) ? listing.images as string[] : []
  const isOwner = user?.id === listing.seller_id

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#78716c', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '24px' }}>
        <ChevronLeft size={16} /> Retour
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px' }}>
        {/* Images */}
        <div>
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#f5f5f4', aspectRatio: '4/3', marginBottom: '12px' }}>
            {images[currentImage] ? (
              <img src={images[currentImage]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a8a29e', fontSize: '0.9375rem' }}>Pas de photo</div>
            )}
            {images.length > 1 && (
              <>
                <button onClick={() => setCurrentImage(i => (i - 1 + images.length) % images.length)}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => setCurrentImage(i => (i + 1) % images.length)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <button key={i} onClick={() => setCurrentImage(i)} style={{ width: 72, height: 72, borderRadius: '8px', overflow: 'hidden', border: `2px solid ${i === currentImage ? '#e6621f' : '#e7e5e4'}`, cursor: 'pointer', padding: 0 }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <div style={{ marginTop: '32px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1c1917', marginBottom: '12px' }}>Description</h2>
            <p style={{ color: '#44403c', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{listing.description}</p>
          </div>

          {/* Details */}
          <div style={{ marginTop: '32px', background: '#fafaf9', borderRadius: '12px', padding: '20px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1c1917', marginBottom: '16px' }}>Caractéristiques</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Type', value: HAIR_TYPE_LABELS[listing.hair_type] || listing.hair_type },
                { label: 'Longueur', value: listing.hair_length },
                { label: 'Couleur', value: listing.hair_color },
                { label: 'Texture', value: listing.hair_texture || '—' },
                { label: 'Poids', value: listing.weight_grams ? `${listing.weight_grams}g` : '—' },
                { label: 'État', value: listing.condition },
                { label: 'Teint', value: listing.is_dyed ? 'Oui' : 'Non' },
                { label: 'Traité', value: listing.is_treated ? 'Oui' : 'Non' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: '0.75rem', color: '#78716c', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
                  <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#1c1917' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div style={{ position: 'sticky', top: '88px' }}>
            {/* Price */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e7e5e4', padding: '24px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#1c1917', lineHeight: 1.3 }}>{listing.title}</h1>
                <button onClick={toggleFavorite} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e7e5e4', background: '#fff', cursor: 'pointer' }}>
                  <Heart size={18} fill={isFavorited ? '#ef4444' : 'none'} stroke={isFavorited ? '#ef4444' : '#78716c'} />
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <Badge variant={listing.status === 'active' ? 'success' : listing.status === 'sold' ? 'error' : 'warning'}>
                  {listing.status === 'active' ? 'Disponible' : listing.status === 'sold' ? 'Vendu' : 'Réservé'}
                </Badge>
                {listing.is_dyed === false && listing.is_treated === false && <Badge variant="secondary">100% naturel</Badge>}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: '#e6621f' }}>{listing.price.toFixed(2)} €</span>
                </div>

              {!isOwner && listing.status === 'active' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {listing.instant_buy_enabled && (
                    <Button size="lg" style={{ width: '100%' }} onClick={() => navigate(`/acheter/${listing.id}`)}>
                      <ShoppingCart size={18} /> Acheter maintenant
                    </Button>
                  )}
                  {listing.accept_offers && (
                    <Button size="lg" variant="outline" style={{ width: '100%' }} onClick={() => user ? setOfferModal(true) : navigate('/connexion')}>
                      <MessageSquare size={18} /> Faire une offre
                    </Button>
                  )}
                </div>
              )}
              {isOwner && (
                <Button size="lg" variant="secondary" style={{ width: '100%' }} onClick={() => navigate(`/mes-annonces/${listing.id}/modifier`)}>
                  Modifier l'annonce
                </Button>
              )}
            </div>

            {/* Seller */}
            {listing.profiles && (
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e7e5e4', padding: '20px', marginBottom: '16px' }}>
                <h3 style={{ fontWeight: 600, color: '#1c1917', marginBottom: '14px', fontSize: '0.9375rem' }}>Vendeur</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fbe5d5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    {listing.profiles.avatar_url ? (
                      <img src={listing.profiles.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontWeight: 600, color: '#e6621f' }}>{listing.profiles.full_name?.[0]?.toUpperCase() || <User size={20} />}</span>
                    )}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: '#1c1917', fontSize: '0.9375rem' }}>{listing.profiles.full_name || 'Vendeur'}</p>
                    {listing.profiles.city && (
                      <p style={{ fontSize: '0.8125rem', color: '#78716c', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {listing.profiles.city}
                      </p>
                    )}
                    {listing.profiles.is_verified_salon && <Badge variant="info" className="mt-1">Salon vérifié</Badge>}
                  </div>
                </div>
              </div>
            )}

            {/* Trust */}
            <div style={{ background: '#fafaf9', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { icon: <Shield size={15} color="#22c55e" />, text: 'Paiement 100% sécurisé' },
                  { icon: <Truck size={15} color="#3b82f6" />, text: 'Livraison assurée et suivie' },
                ].map(item => (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#57534e' }}>
                    {item.icon} {item.text}
                  </div>
                ))}
              </div>
            </div>

            {user && !isOwner && (
              <button onClick={() => setReportModal(true)} style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#a8a29e', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8125rem' }}>
                <Flag size={13} /> Signaler cette annonce
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      <Modal open={offerModal} onClose={() => setOfferModal(false)} title="Faire une offre">
        {offerSuccess ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Offre envoyée !</p>
            <p style={{ color: '#78716c' }}>Le vendeur va recevoir votre offre.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: '#78716c', fontSize: '0.9375rem' }}>Prix demandé : <strong style={{ color: '#1c1917' }}>{listing.price.toFixed(2)} €</strong></p>
            <Input label="Votre offre (€)" type="number" min={1} step={0.01} required value={offerAmount} onChange={e => setOfferAmount(e.target.value)} placeholder="Ex: 85.00" />
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#44403c', marginBottom: '6px' }}>Message (optionnel)</label>
              <textarea value={offerMessage} onChange={e => setOfferMessage(e.target.value)} placeholder="Bonjour, je suis intéressée par votre annonce..."
                rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e7e5e4', fontSize: '0.875rem', resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            <Button onClick={submitOffer} loading={offerLoading} disabled={!offerAmount} style={{ width: '100%' }}>Envoyer l'offre</Button>
          </div>
        )}
      </Modal>

      {/* Report Modal */}
      <Modal open={reportModal} onClose={() => setReportModal(false)} title="Signaler l'annonce">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#44403c', marginBottom: '6px' }}>Raison</label>
            <select value={reportReason} onChange={e => setReportReason(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e7e5e4', fontSize: '0.875rem' }}>
              <option value="">Sélectionner...</option>
              <option value="fake">Annonce frauduleuse</option>
              <option value="inappropriate">Contenu inapproprié</option>
              <option value="wrong_category">Mauvaise catégorie</option>
              <option value="duplicate">Doublon</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#44403c', marginBottom: '6px' }}>Détails (optionnel)</label>
            <textarea value={reportDesc} onChange={e => setReportDesc(e.target.value)} rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e7e5e4', fontSize: '0.875rem', resize: 'vertical', fontFamily: 'inherit' }} />
          </div>
          <Button onClick={submitReport} disabled={!reportReason} style={{ width: '100%' }}>Envoyer le signalement</Button>
        </div>
      </Modal>
    </div>
  )
}
