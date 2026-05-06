import { Link } from 'react-router-dom'
import { ShoppingBag, Gift, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { PRODUCTS } from '../data/products'

export default function CoffretsPage() {
  const { addToCart } = useCart()
  const coffrets = PRODUCTS.filter(p => p.category === 'coffrets')

  return (
    <div className="coffrets-page">
      <div className="page-hero page-hero--coffrets">
        <span className="page-hero__icon">🎁</span>
        <h1>Coffrets & Box</h1>
        <p>Des cadeaux luxueux pour offrir ou se faire plaisir</p>
      </div>

      {/* WHY COFFRETS */}
      <section className="coffrets-why">
        <h2 className="section-title-text">✦ Pourquoi offrir un Coffret ? ✦</h2>
        <div className="coffrets-why__grid">
          {[
            { icon: '🎁', title: 'Emballage luxe', desc: 'Chaque coffret est présenté dans un écrin noir et or, prêt à être offert.' },
            { icon: '💎', title: 'Pierres incluses', desc: 'Nos coffrets contiennent des pierres brutes soigneusement sélectionnées.' },
            { icon: '✉️', title: 'Carte message', desc: 'Ajoutez un message personnalisé à votre commande, sans frais supplémentaires.' },
            { icon: '🌿', title: '100% naturel', desc: 'Cire végétale, parfums naturels et pierres semi-précieuses authentiques.' },
          ].map(w => (
            <div className="why-card" key={w.title}>
              <span className="why-card__icon">{w.icon}</span>
              <h4>{w.title}</h4>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COFFRETS GRID */}
      <section className="coffrets-grid-section">
        <div className="products-grid products-grid--coffrets">
          {coffrets.map(p => (
            <div className="coffret-card" key={p.id}>
              <div className="coffret-card__img-wrap">
                <img src={p.img} alt={p.name} />
                {p.badge && <span className="product-card__badge">{p.badge}</span>}
              </div>
              <div className="coffret-card__body">
                <div className="coffret-card__name">{p.name}</div>
                <div className="coffret-card__sub">{p.subtitle}</div>
                <div className="coffret-card__rating">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={13} fill={i < p.rating ? 'var(--gold)' : 'none'} color="var(--gold)" />
                  ))}
                  <span>({p.reviews})</span>
                </div>
                <p className="coffret-card__desc">{p.description}</p>
                <ul className="coffret-card__benefits">
                  {p.benefits.map(b => <li key={b}>✓ {b}</li>)}
                </ul>
                <div className="coffret-card__footer">
                  <div className="coffret-card__price">
                    {p.oldPrice && <span className="price-old">{p.oldPrice.toFixed(2)} €</span>}
                    <span className="price-current">{p.price.toFixed(2)} €</span>
                  </div>
                  <div className="coffret-card__actions">
                    <Link to={`/produit/${p.id}`} className="btn-secondary btn-sm">Détails</Link>
                    <button className="btn-primary btn-sm" onClick={() => addToCart(p, p.scents[0])}>
                      <ShoppingBag size={13} /> Ajouter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CUSTOM COFFRET CTA */}
      <section className="custom-coffret">
        <Gift size={40} color="var(--gold)" />
        <h3>Coffret sur mesure</h3>
        <p>Vous souhaitez créer un coffret entièrement personnalisé ? Contactez-nous et nous créerons ensemble le cadeau parfait.</p>
        <Link to="/contact" className="btn-primary">Nous contacter</Link>
      </section>
    </div>
  )
}
