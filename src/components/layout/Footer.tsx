import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer style={{ background: '#1c1917', color: '#d6d3d1', marginTop: 'auto' }}>
      <div className="container" style={{ padding: '48px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #e6621f, #8b5a37)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 700, fontFamily: 'Playfair Display, serif' }}>N</span>
              </div>
              <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#fafaf9' }}>NaturalHairMarket</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#a8a29e' }}>
              La première marketplace française dédiée à l'achat et la vente de cheveux naturels.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: '#fafaf9', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Marketplace</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[{ to: '/annonces', label: 'Parcourir les annonces' }, { to: '/vendre', label: 'Vendre mes cheveux' }, { to: '/comment-ca-marche', label: 'Comment ça marche' }].map(l => (
                <Link key={l.to} to={l.to} style={{ fontSize: '0.875rem', color: '#a8a29e', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fafaf9')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#a8a29e')}>{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: '#fafaf9', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aide</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[{ to: '/aide', label: 'Centre d\'aide' }, { to: '/contact', label: 'Nous contacter' }, { to: '/securite', label: 'Acheter en sécurité' }].map(l => (
                <Link key={l.to} to={l.to} style={{ fontSize: '0.875rem', color: '#a8a29e', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fafaf9')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#a8a29e')}>{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: '#fafaf9', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Légal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[{ to: '/cgv', label: 'CGV' }, { to: '/cgu', label: 'CGU' }, { to: '/confidentialite', label: 'Confidentialité' }, { to: '/mentions-legales', label: 'Mentions légales' }].map(l => (
                <Link key={l.to} to={l.to} style={{ fontSize: '0.875rem', color: '#a8a29e', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fafaf9')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#a8a29e')}>{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #292524', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '0.8125rem', color: '#57534e' }}>© {new Date().getFullYear()} NaturalHairMarket. Tous droits réservés.</p>
          <p style={{ fontSize: '0.8125rem', color: '#57534e' }}>Paiements sécurisés par Stripe · Livraison via Sendcloud</p>
        </div>
      </div>
    </footer>
  )
}
