import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeFromCart, updateQty, total } = useCart()

  return (
    <>
      <div className={`cart-overlay${open ? ' cart-overlay--open' : ''}`} onClick={onClose} />
      <aside className={`cart-panel${open ? ' cart-panel--open' : ''}`}>
        <div className="cart-panel__header">
          <span><ShoppingBag size={18} /> Mon Panier ({items.length})</span>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        {items.length === 0 ? (
          <div className="cart-panel__empty">
            <span className="cart-panel__empty-icon">🕯️</span>
            <p>Votre panier est vide</p>
            <Link to="/boutique" className="btn-primary" onClick={onClose}>Découvrir la boutique</Link>
          </div>
        ) : (
          <>
            <div className="cart-panel__items">
              {items.map(item => (
                <div className="cart-item" key={`${item.product.id}-${item.scent}`}>
                  <img src={item.product.img} alt={item.product.name} className="cart-item__img" />
                  <div className="cart-item__info">
                    <div className="cart-item__name">{item.product.name}</div>
                    <div className="cart-item__scent">{item.scent}</div>
                    <div className="cart-item__price">{item.product.price.toFixed(2)} €</div>
                    <div className="cart-item__qty">
                      <button onClick={() => updateQty(item.product.id, item.qty - 1)}><Minus size={12} /></button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.product.id, item.qty + 1)}><Plus size={12} /></button>
                    </div>
                  </div>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.product.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-panel__footer">
              <div className="cart-panel__total">
                <span>Total</span>
                <span className="cart-panel__total-price">{total.toFixed(2)} €</span>
              </div>
              <p className="cart-panel__shipping">
                {total >= 60 ? '✅ Livraison offerte !' : `🚚 Plus que ${(60 - total).toFixed(2)} € pour la livraison offerte`}
              </p>
              <Link to="/checkout" className="btn-primary btn-full" onClick={onClose}>
                Commander
              </Link>
              <Link to="/boutique" className="btn-secondary btn-full" onClick={onClose} style={{ marginTop: '10px' }}>
                Continuer mes achats
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
