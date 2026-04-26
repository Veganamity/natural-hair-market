import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, Ruler, Palette } from 'lucide-react'
import { Listing, Profile } from '../../types/database'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Badge } from '../ui/Badge'

interface ListingCardProps {
  listing: Listing & { profiles?: Profile | null }
  isFavorited?: boolean
  onFavoriteToggle?: (listingId: string, isFav: boolean) => void
}

const HAIR_TYPE_LABELS: Record<string, string> = {
  afro: 'Afro', kinky: 'Kinky', coily: 'Coily', curly: 'Bouclé',
  wavy: 'Ondulé', straight: 'Lisse',
}
const CONDITION_LABELS: Record<string, string> = {
  excellent: 'Excellent', good: 'Bon', fair: 'Correct',
}

export function ListingCard({ listing, isFavorited = false, onFavoriteToggle }: ListingCardProps) {
  const { user } = useAuth()
  const [faved, setFaved] = useState(isFavorited)
  const [favLoading, setFavLoading] = useState(false)

  const images = Array.isArray(listing.images) ? listing.images as string[] : []
  const coverImage = images[0]

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!user || favLoading) return
    setFavLoading(true)
    if (faved) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('listing_id', listing.id)
      setFaved(false)
      onFavoriteToggle?.(listing.id, false)
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, listing_id: listing.id })
      setFaved(true)
      onFavoriteToggle?.(listing.id, true)
    }
    setFavLoading(false)
  }

  return (
    <Link
      to={`/annonces/${listing.id}`}
      style={{
        display: 'block', borderRadius: '12px', overflow: 'hidden',
        background: '#fff', border: '1px solid #e7e5e4',
        transition: 'all 0.2s', textDecoration: 'none',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px -8px rgba(0,0,0,0.15)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', background: '#f5f5f4', overflow: 'hidden' }}>
        {coverImage ? (
          <img src={coverImage} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a8a29e' }}>
            <Palette size={32} />
          </div>
        )}
        {/* Favorite */}
        {user && (
          <button
            onClick={toggleFavorite}
            style={{
              position: 'absolute', top: 10, right: 10,
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Heart
              size={16}
              fill={faved ? '#ef4444' : 'none'}
              stroke={faved ? '#ef4444' : '#78716c'}
            />
          </button>
        )}
        {/* Status */}
        {listing.status === 'sold' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Badge variant="error">Vendu</Badge>
          </div>
        )}
        {listing.status === 'reserved' && (
          <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
            <Badge variant="warning">Réservé</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '14px' }}>
        <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: '#1c1917', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {listing.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', color: '#78716c' }}>
            <Ruler size={13} />
            {listing.hair_length}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', color: '#78716c' }}>
            <Palette size={13} />
            {HAIR_TYPE_LABELS[listing.hair_type] || listing.hair_type}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#e6621f' }}>{listing.price.toFixed(2)} €</span>
          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', background: '#f5f5f4', color: '#57534e' }}>
            {CONDITION_LABELS[listing.condition] || listing.condition}
          </span>
        </div>
        {listing.profiles?.full_name && (
          <p style={{ marginTop: '8px', fontSize: '0.75rem', color: '#a8a29e', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={11} />
            {listing.profiles.city || listing.country}
          </p>
        )}
      </div>
    </Link>
  )
}
