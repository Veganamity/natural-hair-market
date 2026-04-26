import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Shield, Truck, Star, Scissors } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Listing, Profile } from '../types/database'
import { ListingCard } from '../components/listings/ListingCard'
import { Button } from '../components/ui/Button'

const CATEGORIES = [
  { label: 'Afro / Kinky', value: 'afro', emoji: '✨' },
  { label: 'Bouclé', value: 'curly', emoji: '💫' },
  { label: 'Ondulé', value: 'wavy', emoji: '🌊' },
  { label: 'Lisse', value: 'straight', emoji: '✦' },
]

const FEATURES = [
  { icon: <Shield size={24} />, title: 'Paiement sécurisé', desc: 'Transactions protégées par Stripe avec paiement différé' },
  { icon: <Truck size={24} />, title: 'Livraison assurée', desc: 'Expédition via Colissimo, Mondial Relay ou point relais' },
  { icon: <Star size={24} />, title: 'Vendeurs vérifiés', desc: 'Salons certifiés et vendeurs particuliers de confiance' },
  { icon: <Scissors size={24} />, title: 'Cheveux naturels', desc: 'Uniquement des cheveux 100% naturels, sans artifices' },
]

export function HomePage() {
  const [recentListings, setRecentListings] = useState<(Listing & { profiles: Profile | null })[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    supabase
      .from('listings')
      .select('*, profiles(*)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => { if (data) setRecentListings(data as unknown as (Listing & { profiles: Profile | null })[]) })
  }, [])

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #fdf4ef 0%, #f5f0eb 50%, #fbe5d5 100%)',
        padding: '80px 0 64px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'rgba(230,98,31,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(139,90,55,0.05)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#fbe5d5', borderRadius: '9999px', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#c94e14' }}>La marketplace des cheveux naturels</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 600, color: '#1c1917', marginBottom: '20px', lineHeight: 1.15 }}>
              Achetez et vendez vos{' '}
              <span style={{ color: '#e6621f' }}>cheveux naturels</span>{' '}
              en toute sérénité
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#57534e', marginBottom: '36px', lineHeight: 1.6 }}>
              NaturalHairMarket connecte acheteurs et vendeurs de cheveux naturels en France.
              Paiement sécurisé, livraison assurée, vendeurs vérifiés.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flex: 1, minWidth: '260px', maxWidth: '420px', background: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', boxShadow: '0 4px 16px -4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px', gap: '10px' }}>
                  <Search size={18} color="#a8a29e" />
                  <input
                    type="text"
                    placeholder="Longueur, couleur, type..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') navigate(`/annonces?q=${searchQuery}`) }}
                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.9375rem', color: '#1c1917', padding: '14px 0' }}
                  />
                </div>
                <button
                  onClick={() => navigate(`/annonces?q=${searchQuery}`)}
                  style={{ padding: '14px 20px', background: '#e6621f', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.9375rem', transition: 'background 0.15s' }}
                >
                  Chercher
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.value}
                  to={`/annonces?type=${cat.value}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#fff', borderRadius: '9999px', border: '1px solid #e7e5e4', fontSize: '0.875rem', color: '#44403c', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fbe5d5'; (e.currentTarget as HTMLElement).style.borderColor = '#f2a87a' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#e7e5e4' }}
                >
                  {cat.emoji} {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '64px 0', background: '#fff', borderBottom: '1px solid #e7e5e4' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#fdf4ef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e6621f' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#1c1917' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#78716c', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent listings */}
      {recentListings.length > 0 && (
        <section style={{ padding: '64px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#1c1917', marginBottom: '6px' }}>Dernières annonces</h2>
                <p style={{ color: '#78716c', fontSize: '0.9375rem' }}>Découvrez les mèches disponibles près de chez vous</p>
              </div>
              <Link to="/annonces" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e6621f', fontWeight: 500, fontSize: '0.9375rem', transition: 'gap 0.15s' }}>
                Voir tout <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {recentListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #1c1917, #292524)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 600, color: '#fafaf9', marginBottom: '16px' }}>
            Prête à vendre vos cheveux ?
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#a8a29e', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
            Créez votre annonce en quelques minutes et rejoignez des milliers de vendeuses.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button size="lg" onClick={() => navigate('/vendre')}>
              Déposer une annonce
            </Button>
            <Button size="lg" variant="outline" style={{ borderColor: '#a8a29e', color: '#fafaf9' }} onClick={() => navigate('/annonces')}>
              Explorer les annonces
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
