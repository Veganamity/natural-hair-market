import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Listing, Profile } from '../types/database'
import { ListingCard } from '../components/listings/ListingCard'
import { Button } from '../components/ui/Button'

export function FavoritesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState<(Listing & { profiles: Profile | null })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('favorites').select('listing_id, listings(*, profiles(*))').eq('user_id', user.id)
      .then(({ data }) => {
        if (data) {
          const ls = data.map((f: { listing_id: string; listings: unknown }) => f.listings).filter(Boolean) as (Listing & { profiles: Profile | null })[]
          setListings(ls)
        }
        setLoading(false)
      })
  }, [user])

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#1c1917', marginBottom: '8px' }}>Mes favoris</h1>
      <p style={{ color: '#78716c', marginBottom: '32px' }}>{listings.length} annonce{listings.length > 1 ? 's' : ''} sauvegardée{listings.length > 1 ? 's' : ''}</p>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #e7e5e4', borderTopColor: '#e6621f', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', border: '2px dashed #e7e5e4', borderRadius: '16px' }}>
          <Heart size={48} color="#a8a29e" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontSize: '1.125rem', color: '#78716c', marginBottom: '8px' }}>Aucun favori</p>
          <p style={{ color: '#a8a29e', marginBottom: '24px' }}>Sauvegardez les annonces qui vous intéressent</p>
          <Button onClick={() => navigate('/annonces')}>Parcourir les annonces</Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {listings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isFavorited={true}
              onFavoriteToggle={(id, isFav) => { if (!isFav) setListings(ls => ls.filter(l => l.id !== id)) }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
