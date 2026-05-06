import { ShoppingBag, Heart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useProductStock, useProductPrice } from '../context/AdminContext'
import type { Product } from '../data/products'

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, wishlist, toggleWishlist } = useCart()
  const inStock = useProductStock(product.id, product.inStock)
  const price = useProductPrice(product.id, product.price)
  const inWishlist = wishlist.includes(product.id)

  return (
    <div className="product-card">
      <div className="product-card__img-wrap">
        <Link to={`/produit/${product.id}`}>
          <img src={product.img} alt={product.name} className="product-card__img" />
        </Link>
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
        {!inStock && <div className="product-card__rupture">Rupture de stock</div>}
        <button
          className={`product-card__wish${inWishlist ? ' active' : ''}`}
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
        <div className="product-card__hover-actions">
          <button
            className="btn-primary btn-sm"
            onClick={() => inStock && addToCart(product, product.scents[0])}
            disabled={!inStock}
            style={!inStock ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
          >
            <ShoppingBag size={14} /> {inStock ? 'Ajouter' : 'Rupture'}
          </button>
        </div>
      </div>
      <div className="product-card__body">
        <div className="product-card__meta">
          <span className="product-card__stone" style={{ background: product.stoneColor + '22', color: product.stoneColor === '#c9a84c' ? 'var(--gold)' : product.stoneColor }}>
            <span className="stone-dot" style={{ background: product.stoneColor }} />
            {product.stone}
          </span>
          <span className="product-card__collection">{product.collection}</span>
        </div>
        <Link to={`/produit/${product.id}`} className="product-card__name">{product.name}</Link>
        <div className="product-card__subtitle">{product.subtitle}</div>
        <div className="product-card__footer">
          <div className="product-card__rating">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={12} fill={i < product.rating ? 'var(--gold)' : 'none'} color="var(--gold)" />
            ))}
            <span>({product.reviews})</span>
          </div>
          <div className="product-card__price">
            {product.oldPrice && price === product.price && <span className="price-old">{product.oldPrice.toFixed(2)} €</span>}
            {price !== product.price && <span className="price-old">{product.price.toFixed(2)} €</span>}
            <span className="price-current">{price.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  )
}
