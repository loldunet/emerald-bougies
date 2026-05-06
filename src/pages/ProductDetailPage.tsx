import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, Heart, Star, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useProductStock, useProductPrice } from '../context/AdminContext'
import ProductCard from '../components/ProductCard'
import { PRODUCTS } from '../data/products'

export default function ProductDetailPage() {
  const { id } = useParams()
  const product = PRODUCTS.find(p => p.id === Number(id))
  const { addToCart, wishlist, toggleWishlist } = useCart()
  const inStock = useProductStock(product?.id ?? -1, product?.inStock ?? true)
  const price = useProductPrice(product?.id ?? -1, product?.price ?? 0)

  const [activeImg, setActiveImg] = useState(0)
  const [scent, setScent] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  if (!product) {
    return (
      <div className="not-found">
        <h2>Produit introuvable</h2>
        <Link to="/boutique" className="btn-primary">Retour à la boutique</Link>
      </div>
    )
  }

  const selectedScent = scent || product.scents[0]
  const inWishlist = wishlist.includes(product.id)
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    addToCart(product, selectedScent, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const faqs = [
    { q: 'Combien de temps dure la bougie ?', a: 'Nos bougies ont une durée de combustion de 40 à 50 heures selon leur taille et l\'utilisation.' },
    { q: 'La pierre est-elle incluse ?', a: 'Oui ! Chaque bougie contient une ou plusieurs pierres naturelles qui seront libérées au fur et à mesure de la combustion.' },
    { q: 'Quelle cire utilisez-vous ?', a: 'Nous utilisons exclusivement de la cire de soja naturelle, sans paraffine, pour une combustion propre et durable.' },
    { q: 'Livraison à La Réunion ?', a: 'Oui, nous livrons sur toute l\'île de La Réunion. Livraison offerte dès 60€ d\'achat.' },
  ]

  return (
    <div className="product-detail">
      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <Link to="/">Accueil</Link>
        <span>/</span>
        <Link to="/boutique">Boutique</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="product-detail__main">
        {/* GALLERY */}
        <div className="product-gallery">
          <div className="product-gallery__main">
            <img src={product.imgs[activeImg]} alt={product.name} />
            {product.badge && <span className="product-card__badge">{product.badge}</span>}
          </div>
          {product.imgs.length > 1 && (
            <div className="product-gallery__thumbs">
              {product.imgs.map((img, i) => (
                <button
                  key={i}
                  className={`gallery-thumb${activeImg === i ? ' active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="product-info">
          <div className="product-info__collection">{product.collection}</div>
          <h1 className="product-info__name">{product.name}</h1>
          <div className="product-info__subtitle">{product.subtitle}</div>

          <div className="product-info__rating">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={16} fill={i < product.rating ? 'var(--gold)' : 'none'} color="var(--gold)" />
            ))}
            <span className="rating-count">({product.reviews} avis)</span>
          </div>

          <div className="product-info__price">
            {product.oldPrice && price === product.price && <span className="price-old">{product.oldPrice.toFixed(2)} €</span>}
            {price !== product.price && <span className="price-old">{product.price.toFixed(2)} €</span>}
            <span className="price-big">{price.toFixed(2)} €</span>
            {inStock
              ? <span className="product-stock-badge in-stock">✅ En stock</span>
              : <span className="product-stock-badge out-stock">❌ Rupture de stock</span>}
          </div>

          <p className="product-info__desc">{product.description}</p>

          {/* Benefits */}
          <div className="product-info__benefits">
            {product.benefits.map(b => (
              <span key={b} className="benefit-tag"><Check size={12} /> {b}</span>
            ))}
          </div>

          {/* Stone */}
          <div className="product-info__field">
            <label>Pierre principale</label>
            <div className="stone-badge">
              <span className="stone-dot lg" style={{ background: product.stoneColor }} />
              {product.stone}
            </div>
          </div>

          {/* Scent */}
          <div className="product-info__field">
            <label>Parfum</label>
            <div className="scent-options">
              {product.scents.map(s => (
                <button
                  key={s}
                  className={`scent-btn${selectedScent === s ? ' active' : ''}`}
                  onClick={() => setScent(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="product-info__field">
            <label>Quantité</label>
            <div className="qty-control">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="product-info__actions">
            <button
              className={`btn-cart btn-cart--lg${added ? ' added' : ''}${!inStock ? ' disabled' : ''}`}
              onClick={inStock ? handleAddToCart : undefined}
              disabled={!inStock}
              title={!inStock ? 'Produit en rupture de stock' : undefined}
            >
              {!inStock ? <>⏳ Rupture de stock</> : added ? <><Check size={16} /> Ajouté !</> : <><ShoppingBag size={16} /> Ajouter au panier</>}
            </button>
            <button
              className={`btn-wish-lg${inWishlist ? ' active' : ''}`}
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Reassurance */}
          <div className="product-info__reassurance">
            <span>🚚 Livraison 48/72h</span>
            <span>🔒 Paiement sécurisé</span>
            <span>🎁 Emballage soigné</span>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="product-faq">
        <h3>Questions fréquentes</h3>
        {faqs.map((f, i) => (
          <div className="faq-item" key={i}>
            <button className="faq-item__q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              {f.q}
              {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openFaq === i && <div className="faq-item__a">{f.a}</div>}
          </div>
        ))}
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="related-section">
          <h3 className="section-title-text">✦ Vous aimerez aussi ✦</h3>
          <div className="products-grid">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
