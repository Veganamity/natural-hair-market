import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Listing, Profile } from '../types/database'
import { ListingCard } from '../components/listings/ListingCard'

const HAIR_TYPES = [
  { value: 'afro', label: 'Afro' }, { value: 'kinky', label: 'Kinky' },
  { value: 'coily', label: 'Coily' }, { value: 'curly', label: 'Bouclé' },
  { value: 'wavy', label: 'Ondulé' }, { value: 'straight', label: 'Lisse' },
]
const CONDITIONS = [{ value: 'excellent', label: 'Excellent' }, { value: 'good', label: 'Bon' }, { value: 'fair', label: 'Correct' }]
const SORT_OPTIONS = [
  { value: 'created_at:desc', label: 'Plus récents' },
  { value: 'price:asc', label: 'Prix croissant' },
  { value: 'price:desc', label: 'Prix décroissant' },
]

export function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [listings, setListings] = useState<(Listing & { profiles: Profile | null })[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const filters = {
    q: searchParams.get('q') || '',
    type: searchParams.get('type') || '',
    condition: searchParams.get('condition') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'created_at:desc',
  }

  useEffect(() => {
    loadListings()
  }, [searchParams])

  async function loadListings() {
    setLoading(true)
    const [sortCol, sortDir] = filters.sort.split(':')
    let query = supabase
      .from('listings')
      .select('*, profiles(*)')
      .eq('status', 'active')
      .order(sortCol, { ascending: sortDir === 'asc' })

    if (filters.q) query = query.ilike('title', `%${filters.q}%`)
    if (filters.type) query = query.eq('hair_type', filters.type)
    if (filters.condition) query = query.eq('condition', filters.condition)
    if (filters.minPrice) query = query.gte('price', parseFloat(filters.minPrice))
    if (filters.maxPrice) query = query.lte('price', parseFloat(filters.maxPrice))

    const { data } = await query.limit(48)
    if (data) setListings(data as unknown as (Listing & { profiles: Profile | null })[])
    setLoading(false)
  }

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  function clearFilters() {
    setSearchParams({})
  }

  const hasFilters = filters.q || filters.type || filters.condition || filters.minPrice || filters.maxPrice

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
        {/* Sidebar */}
        <aside style={{
          width: '240px', flexShrink: 0,
        }}>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: 600, color: '#1c1917' }}>Filtres</h3>
              {hasFilters && <button onClick={clearFilters} style={{ fontSize: '0.8125rem', color: '#e6621f', background: 'none', border: 'none', cursor: 'pointer' }}>Effacer</button>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Type */}
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#44403c', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Type</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {HAIR_TYPES.map(t => (
                    <label key={t.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', color: '#44403c' }}>
                      <input type="radio" name="hair_type" value={t.value} checked={filters.type === t.value}
                        onChange={() => updateFilter('type', t.value)} style={{ accentColor: '#e6621f' }} />
                      {t.label}
                    </label>
                  ))}
                  {filters.type && <button onClick={() => updateFilter('type', '')} style={{ fontSize: '0.75rem', color: '#e6621f', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>Effacer</button>}
                </div>
              </div>

              {/* Condition */}
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#44403c', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>État</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {CONDITIONS.map(c => (
                    <label key={c.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', color: '#44403c' }}>
                      <input type="radio" name="condition" value={c.value} checked={filters.condition === c.value}
                        onChange={() => updateFilter('condition', c.value)} style={{ accentColor: '#e6621f' }} />
                      {c.label}
                    </label>
                  ))}
                  {filters.condition && <button onClick={() => updateFilter('condition', '')} style={{ fontSize: '0.75rem', color: '#e6621f', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>Effacer</button>}
                </div>
              </div>

              {/* Price */}
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#44403c', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Prix (€)</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" placeholder="Min" value={filters.minPrice}
                    onChange={e => updateFilter('minPrice', e.target.value)}
                    style={{ width: '50%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e7e5e4', fontSize: '0.875rem' }} />
                  <input type="number" placeholder="Max" value={filters.maxPrice}
                    onChange={e => updateFilter('maxPrice', e.target.value)}
                    style={{ width: '50%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e7e5e4', fontSize: '0.875rem' }} />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1c1917', marginBottom: '4px' }}>
                {filters.q ? `Résultats pour "${filters.q}"` : 'Toutes les annonces'}
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#78716c' }}>{listings.length} annonce{listings.length > 1 ? 's' : ''}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select
                value={filters.sort}
                onChange={e => updateFilter('sort', e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e7e5e4', fontSize: '0.875rem', background: '#fff', cursor: 'pointer' }}
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ borderRadius: '12px', background: '#f5f5f4', aspectRatio: '4/5', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: '#a8a29e' }}>
              <p style={{ fontSize: '1.125rem', marginBottom: '8px', color: '#78716c' }}>Aucune annonce trouvée</p>
              <p style={{ fontSize: '0.9375rem' }}>Essayez de modifier vos filtres</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {listings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isFavorited={favorites.has(listing.id)}
                  onFavoriteToggle={(id, isFav) => {
                    setFavorites(prev => { const next = new Set(prev); isFav ? next.add(id) : next.delete(id); return next })
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
