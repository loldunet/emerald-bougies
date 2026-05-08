import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Search, User, ShoppingBag, Heart, Flame, Leaf,
  ChevronDown, Menu, X, MapPin,
  Mail, Phone
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import CartPanel from './CartPanel'

export default function Layout({ children }: { children: ReactNode }) {
  const { count, setCartOpen, cartOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  void searchQuery
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <>
      {/* TOP BANNER */}
      <div className="top-banner">
        <span className="top-banner__left">🚚 Livraison offerte dès 60€</span>
        <span className="top-banner__center">
          🕯️ Bougies artisanales avec pierres énergétiques &nbsp;·&nbsp; Fait à la main à La Réunion
        </span>
        <div className="top-banner__right">
          <span><Flame size={11} /> Pierres naturelles</span>
          <span><Leaf size={11} /> Cire végétale</span>
          <span><Heart size={11} /> Fait main</span>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <Link to="/" className="navbar__logo">
          <img src="/logo.png" alt="Emerald Bougies" className="navbar__logo-img" />
        </Link>

        <ul className={`navbar__nav${menuOpen ? ' navbar__nav--open' : ''}`}>
          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Accueil</Link></li>
          <li className="has-dropdown">
            <Link to="/boutique" className={location.pathname.startsWith('/boutique') ? 'active' : ''}>
              Nos Créations <ChevronDown size={13} />
            </Link>
            <div className="dropdown">
              <Link to="/boutique">Toutes les bougies</Link>
              <Link to="/boutique?cat=dragons">Collection Dragon</Link>
              <Link to="/boutique?cat=totems">Animaux Totems</Link>
              <Link to="/boutique?cat=astrologie">Esprits Astrologiques</Link>
              <Link to="/boutique?cat=coffrets">Coffrets & Box</Link>
            </div>
          </li>
          <li className="has-dropdown">
            <Link to="/collections" className={location.pathname === '/collections' ? 'active' : ''}>
              Nos Univers <ChevronDown size={13} />
            </Link>
            <div className="dropdown">
              <Link to="/collections">Voir toutes</Link>
              <Link to="/boutique?cat=dragons">Collection Dragon</Link>
              <Link to="/boutique?cat=totems">Animaux Totems</Link>
              <Link to="/boutique?cat=astrologie">Astrologie</Link>
            </div>
          </li>
          <li><Link to="/coffrets" className={location.pathname === '/coffrets' ? 'active' : ''}>Coffrets</Link></li>
          <li><Link to="/a-propos" className={location.pathname === '/a-propos' ? 'active' : ''}>Notre Histoire</Link></li>
          <li><Link to="/avis" className={location.pathname === '/avis' ? 'active' : ''}>Nos Avis</Link></li>
          <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
        </ul>

        <div className="navbar__actions">
          <button onClick={() => setSearchOpen(s => !s)} className="icon-btn" title="Recherche">
            <Search size={19} />
          </button>
          <Link to="/compte" className="icon-btn" title="Mon compte">
            <User size={19} />
          </Link>
          <Link to="/wishlist" className="icon-btn" title="Wishlist">
            <Heart size={19} />
          </Link>
          <button onClick={() => setCartOpen(true)} className="icon-btn cart-btn" title="Panier">
            <ShoppingBag size={19} />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
          <button className="icon-btn mobile-menu-btn" onClick={() => setMenuOpen(m => !m)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* SEARCH BAR */}
      {searchOpen && (
        <div className="search-bar">
          <div className="search-bar__inner">
            <Search size={18} className="search-bar__icon" />
            <input
              autoFocus
              type="text"
              placeholder="Rechercher une bougie, une collection…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-bar__input"
            />
            <button onClick={() => setSearchOpen(false)} className="search-bar__close">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* CART PANEL */}
      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* PAGE CONTENT */}
      <main>{children}</main>

      {/* TRUST BANNER */}
      <div className="trust-banner">
        <div className="trust-banner__item">
          <span className="trust-banner__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </span>
          <div>
            <strong>Livraison locale</strong>
            <span>À La Réunion</span>
          </div>
        </div>
        <div className="trust-banner__divider" />
        <div className="trust-banner__item">
          <span className="trust-banner__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="1"/>
              <path d="M16 8h4l3 5v4h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </span>
          <div>
            <strong>Expédition 48/72h</strong>
            <span>Soignée et rapide</span>
          </div>
        </div>
        <div className="trust-banner__divider" />
        <div className="trust-banner__item">
          <span className="trust-banner__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
          </span>
          <div>
            <strong>Paiement sécurisé</strong>
            <span>CB, PayPal, 3x sans frais</span>
          </div>
        </div>
        <div className="trust-banner__divider" />
        <div className="trust-banner__item">
          <span className="trust-banner__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <path d="M12 22V12"/>
              <path d="m3.27 6.96 8.73 5.04 8.73-5.04"/>
            </svg>
          </span>
          <div>
            <strong>Emballage soigné</strong>
            <span>Éco-responsable</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <img src="/logo.png" alt="Emerald Bougies" className="footer__logo-img" />
            </div>
            <p>Des bougies artisanales infusées de pierres naturelles, faites à la main à La Réunion avec amour et intention.</p>
            <div className="footer__socials">
              <a href="mailto:contact@emerald-bougies.re" title="Email"><Mail size={18} /></a>
            </div>
          </div>
          <div className="footer__col">
            <h4>Boutique</h4>
            <Link to="/boutique">Toutes les bougies</Link>
            <Link to="/boutique?cat=dragons">Collection Dragon</Link>
            <Link to="/boutique?cat=totems">Animaux Totems</Link>
            <Link to="/boutique?cat=astrologie">Esprits Astrologiques</Link>
            <Link to="/coffrets">Coffrets & Box</Link>
          </div>
          <div className="footer__col">
            <h4>Informations</h4>
            <Link to="/a-propos">Notre histoire</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/livraison">Livraison & retours</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/mentions-legales">Mentions légales</Link>
            <Link to="/cgv">Conditions générales de vente</Link>
            <Link to="/remboursement">Politique de remboursement</Link>
          </div>
          <div className="footer__col">
            <h4>Contact</h4>
            <span><Phone size={13} /> +262 693 53 29 40</span>
            <span><Mail size={13} /> contact@emerald-bougies.re</span>
            <span><MapPin size={13} /> 28 Rue du Tampon, 97430 La Réunion</span>
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
              Lun–Ven: 9h–18h<br />Sam: 9h–12h
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Emerald Bougies – Fait avec 💛 à La Réunion</span>
          <span>Tous droits réservés</span>
        </div>
      </footer>
    </>
  )
}
