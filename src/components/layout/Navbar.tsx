import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Heart, User, Plus, ShoppingBag, LogOut, Settings, Package } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export function Navbar() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/')
    setUserMenuOpen(false)
  }

  const isAdmin = profile?.email === 'admin@naturalhairmarket.fr' || profile?.email?.includes('+admin')

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e7e5e4',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, #e6621f, #8b5a37)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', fontFamily: 'Playfair Display, serif' }}>N</span>
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: '1.125rem', color: '#1c1917', letterSpacing: '-0.01em' }}>
            NaturalHair<span style={{ color: '#e6621f' }}>Market</span>
          </span>
        </Link>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: '400px', margin: '0 24px', display: 'flex' }} className="search-bar">
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#a8a29e' }} />
            <input
              type="text"
              placeholder="Rechercher des cheveux..."
              onKeyDown={e => { if (e.key === 'Enter') navigate(`/annonces?q=${(e.target as HTMLInputElement).value}`) }}
              style={{
                width: '100%', padding: '8px 12px 8px 36px',
                borderRadius: '10px', border: '1px solid #e7e5e4',
                fontSize: '0.875rem', background: '#fafaf9',
                outline: 'none', transition: 'all 0.15s',
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <>
              <Link to="/favoris" style={{ padding: '8px', borderRadius: '8px', color: '#78716c', display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}>
                <Heart size={20} />
              </Link>
              <Link
                to="/vendre"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '8px',
                  background: '#e6621f', color: '#fff',
                  fontSize: '0.875rem', fontWeight: 500,
                  transition: 'background 0.15s',
                }}
              >
                <Plus size={16} />
                <span>Vendre</span>
              </Link>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '6px 10px', borderRadius: '10px',
                    border: '1px solid #e7e5e4', background: '#fff',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#fbe5d5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e6621f' }}>
                        {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </button>
                {userMenuOpen && (
                  <div
                    className="fade-in"
                    style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                      background: '#fff', border: '1px solid #e7e5e4', borderRadius: '12px',
                      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
                      minWidth: '200px', overflow: 'hidden', zIndex: 50,
                    }}
                  >
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f5f5f4' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1c1917' }}>{profile?.full_name || 'Mon compte'}</p>
                      <p style={{ fontSize: '0.75rem', color: '#78716c' }}>{user.email}</p>
                    </div>
                    {[
                      { to: '/profil', icon: <User size={16} />, label: 'Mon profil' },
                      { to: '/mes-annonces', icon: <Package size={16} />, label: 'Mes annonces' },
                      { to: '/commandes', icon: <ShoppingBag size={16} />, label: 'Mes commandes' },
                      { to: '/parametres', icon: <Settings size={16} />, label: 'Paramètres' },
                      ...(isAdmin ? [{ to: '/admin', icon: <Settings size={16} />, label: 'Administration' }] : []),
                    ].map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setUserMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: '#44403c', fontSize: '0.875rem', transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#fafaf9')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span style={{ color: '#78716c' }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid #f5f5f4' }}>
                      <button
                        onClick={handleSignOut}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: '#ef4444', fontSize: '0.875rem', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#fee2e2')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <LogOut size={16} />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/connexion" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#44403c', transition: 'background 0.15s' }}>
                Connexion
              </Link>
              <Link
                to="/inscription"
                style={{
                  padding: '8px 16px', borderRadius: '8px',
                  background: '#e6621f', color: '#fff',
                  fontSize: '0.875rem', fontWeight: 500,
                  transition: 'background 0.15s',
                }}
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
