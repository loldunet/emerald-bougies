import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { PRODUCTS, COLLECTIONS, TESTIMONIALS } from '../data/products'

const ICON_DIAMOND = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 9l10 13L22 9Z"/>
    <path d="M2 9h20"/>
    <path d="M7 2l-5 7"/>
    <path d="M17 2l5 7"/>
    <path d="M7 2h10"/>
    <path d="M12 2L8 9l4 13 4-13Z"/>
  </svg>
)

const ICON_LEAF = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-10a9 9 0 0 1 7 7c0 5-4 8-9 10Z"/>
    <path d="M4 13c4 0 7-1 9-3"/>
    <path d="M4.5 18.5 11 20"/>
  </svg>
)

const ICON_SPARKLE = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v2"/>
    <path d="M12 19v2"/>
    <path d="M3 12h2"/>
    <path d="M19 12h2"/>
    <path d="M5.6 5.6l1.4 1.4"/>
    <path d="M17 17l1.4 1.4"/>
    <path d="M5.6 18.4l1.4-1.4"/>
    <path d="M17 7l1.4-1.4"/>
    <circle cx="12" cy="12" r="4"/>
  </svg>
)

const ICON_HANDS = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/>
    <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2"/>
    <path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"/>
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34L4 19"/>
    <path d="M14 14h1"/>
    <path d="M10.5 11.5 12 13l1.5-1.5"/>
  </svg>
)

const FEATURES = [
  { icon: ICON_DIAMOND, title: 'Pierres naturelles', desc: 'Chaque bougie contient une pierre semi-précieuse sélectionnée pour ses propriétés énergétiques.' },
  { icon: ICON_LEAF,    title: 'Cire végétale', desc: 'Fabriquées à base de cire de soja 100% naturelle, sans paraffine ni additifs chimiques.' },
  { icon: ICON_SPARKLE, title: 'Énergie & bien-être', desc: 'Infusées d\'intentions et de vibrations positives pour élever l\'énergie de votre espace.' },
  { icon: ICON_HANDS,   title: 'Fait main à La Réunion', desc: 'Chaque bougie est coulée, assemblée et contrôlée à la main dans notre atelier réunionnais.' },
]

export default function HomePage() {
  const { addToCart } = useCart()
  const [testIdx, setTestIdx] = useState(0)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  return (
    <>
      {/* ===== HERO LA RÉUNION ===== */}
      <section className="hero hero--reunion">
        <div className="hero__reunion-bg">
          <div className="hero__reunion-overlay" />
        </div>
        
        <div className="hero__reunion-content">
          <div className="hero__reunion-text">
            <span className="hero__reunion-label">NOUVELLE COLLECTION</span>
            <h1 className="hero__reunion-title">LA RÉUNION</h1>
            <p className="hero__reunion-subtitle">Île Intense, Âme Sauvage</p>
            <p className="hero__reunion-desc">
              Un voyage sensoriel au cœur de La Réunion.<br />
              Des senteurs boisées, épicées & exotiques<br />
              pour une évasion unique.
            </p>
            
            <div className="hero__reunion-price">
              <span className="hero__reunion-amount">40,00 €</span>
              <span className="hero__reunion-label-small">BOUGIE PARFUMÉE ARTISANALE</span>
            </div>
            
            <Link to="/boutique" className="hero__reunion-btn">
              DÉCOUVRIR <ArrowRight size={18} />
            </Link>
            
            <div className="hero__reunion-features">
              <div className="hero__reunion-feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-10a9 9 0 0 1 7 7c0 5-4 8-9 10Z"/>
                </svg>
                <span>Cire Végétale Naturelle</span>
              </div>
              <div className="hero__reunion-feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                  <path d="M2 12h20"/>
                </svg>
                <span>Parfums Exotiques</span>
              </div>
              <div className="hero__reunion-feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
                  <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
                  <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
                </svg>
                <span>Fait Main avec Amour</span>
              </div>
              <div className="hero__reunion-feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 9l10 13L22 9Z"/>
                </svg>
                <span>Inspirée de La Réunion</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Barre d'infos en bas */}
        <div className="hero__reunion-bar">
          <div className="hero__reunion-bar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-10a9 9 0 0 1 7 7c0 5-4 8-9 10Z"/>
            </svg>
            <div>
              <strong>CIRE 100% VÉGÉTALE</strong>
              <span>RESPECTUEUSE DE L'ENVIRONNEMENT</span>
            </div>
          </div>
          <div className="hero__reunion-bar-divider" />
          <div className="hero__reunion-bar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <div>
              <strong>FAIT MAIN À LA RÉUNION</strong>
              <span>AVEC INTENTION</span>
            </div>
          </div>
          <div className="hero__reunion-bar-divider" />
          <div className="hero__reunion-bar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="8" width="18" height="4" rx="2"/>
              <path d="M12 8v13"/>
              <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
            </svg>
            <div>
              <strong>EMBALLAGE ÉLÉGANT</strong>
              <span>IDÉE CADEAU PARFAITE</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES (trust reassurance) ===== */}
      <section className="features-trust">
        <div className="features-trust__item">
          <span className="features-trust__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </span>
          <div>
            <h3>Livraison locale</h3>
            <p>À La Réunion</p>
          </div>
        </div>
        <div className="features-trust__divider" />
        <div className="features-trust__item">
          <span className="features-trust__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="1"/>
              <path d="M16 8h4l3 5v4h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </span>
          <div>
            <h3>Expédition 48/72h</h3>
            <p>Soignée et rapide</p>
          </div>
        </div>
        <div className="features-trust__divider" />
        <div className="features-trust__item">
          <span className="features-trust__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
          </span>
          <div>
            <h3>Paiement sécurisé</h3>
            <p>CB, PayPal, 3x sans frais</p>
          </div>
        </div>
        <div className="features-trust__divider" />
        <div className="features-trust__item">
          <span className="features-trust__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <path d="M12 22V12"/>
              <path d="m3.27 6.96 8.73 5.04 8.73-5.04"/>
            </svg>
          </span>
          <div>
            <h3>Emballage soigné</h3>
            <p>Éco-responsable</p>
          </div>
        </div>
      </section>

      {/* ===== COLLECTIONS ===== */}
      <section className="collections-section">
        <div className="section-header section-header--centered">
          <h2 className="section-title-text">✦ Nos Univers ✦</h2>
          <p className="section-sub section-sub--centered">Plongez dans nos univers et laissez les pierres vous guider</p>
        </div>
        <div className="collections-grid">
          {COLLECTIONS.map(col => (
            <Link to={`/boutique?cat=${col.id}`} className="col-card" key={col.id}>
              <img
                src={col.img}
                alt={col.name}
                className="col-card__img"
                style={{ objectPosition: (col as { imgPos?: string }).imgPos ?? 'center' }}
              />
              <div className="col-card__overlay">
                <div className="col-card__name">{col.name}</div>
                <div className="col-card__sub">{col.sub}</div>
                <span className="btn-discover">Découvrir →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mid-banner">
        <img src="/banniere-mid.jpg" alt="Chaque bougie est unique" className="mid-banner__img" />
      </section>


      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title-text">✦ Ils nous font confiance ✦</h2>
        </div>
        <div className="testimonials-carousel">
          <button className="carousel-btn prev" onClick={() => setTestIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}>
            <ChevronLeft size={20} />
          </button>
          <div className="testimonials-track" style={{ transform: `translateX(-${testIdx * 100}%)` }}>
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-card__stars">
                  {Array.from({ length: t.rating }, (_, j) => <Star key={j} size={14} fill="var(--gold)" color="var(--gold)" />)}
                </div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <div className="testimonial-card__author">
                  <span className="testimonial-card__name">{t.name}</span>
                  <span className="testimonial-card__loc">{t.location}</span>
                  <span className="testimonial-card__product">Bougie: {t.product}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-btn next" onClick={() => setTestIdx(i => (i + 1) % TESTIMONIALS.length)}>
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="carousel-dots">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} className={`dot${i === testIdx ? ' active' : ''}`} onClick={() => setTestIdx(i)} />
          ))}
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="newsletter-section">
        <div className="newsletter__inner">
          <span className="newsletter__icon">✉️</span>
          <h3>Rejoignez notre communauté</h3>
          <p>Recevez nos nouveautés, conseils énergétiques et offres exclusives en avant-première.</p>
          {subscribed ? (
            <div className="newsletter__success">
              <Check size={20} /> Merci ! Vous êtes inscrit(e). 🕯️
            </div>
          ) : (
            <form className="newsletter__form" onSubmit={e => { e.preventDefault(); setSubscribed(true) }}>
              <input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary">S'inscrire</button>
            </form>
          )}
          <small>Pas de spam. Désinscription en 1 clic.</small>
        </div>
      </section>
    </>
  )
}
