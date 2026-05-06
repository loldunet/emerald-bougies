import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Check, ArrowLeft, ShieldCheck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAdmin } from '../context/AdminContext'
import { API_URL } from '../config/api'

function PaymentForm({ orderTotal, onSuccess, onBack, formData }: { 
  orderTotal: number; 
  onSuccess: () => void; 
  onBack: () => void;
  formData: any;
}) {
  const [loading, setLoading] = useState(false)
  const [simulated, setSimulated] = useState(false)

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    setSimulated(true)
    setTimeout(() => onSuccess(), 1500)
  }

  if (simulated) {
    return (
      <div className="checkout-section" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ 
          width: 60, 
          height: 60, 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #c9a84c, #10b981)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 20px',
          animation: 'pulse 1s ease-in-out'
        }}>
          <Check size={30} color="#0d0d0d" />
        </div>
        <h3 style={{ color: '#c9a84c', marginBottom: '12px' }}>
          <ShieldCheck size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Commande confirmée !
        </h3>
        <p style={{ color: '#999' }}>Redirection vers la confirmation...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handlePayment} className="checkout-section">
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(16,185,129,0.08))', 
        border: '1px solid var(--border-gold)', 
        borderRadius: '12px', 
        padding: '24px',
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <h3 style={{ color: '#c9a84c', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <ShieldCheck size={20} /> Paiement sécurisé
        </h3>
        <p style={{ color: '#999', fontSize: '14px', margin: 0 }}>
          {formData.firstName} {formData.lastName} — {orderTotal.toFixed(2)} €
        </p>
      </div>

      <div className="payment-logos" style={{ marginBottom: '24px' }}>
        <span>💳 Carte bancaire</span>
        <span>🅿️ PayPal</span>
        <span>📱 Virement</span>
      </div>

      <div className="checkout-nav" style={{ marginTop: '20px' }}>
        <button type="button" className="btn-secondary" onClick={onBack}>← Retour</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          <Lock size={14} /> {loading ? 'Traitement...' : `Confirmer la commande — ${orderTotal.toFixed(2)} €`}
        </button>
      </div>
    </form>
  )
}

const STEPS = ['Coordonnées', 'Livraison', 'Paiement', 'Confirmation']

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { addOrder } = useAdmin()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', zip: '', country: 'France',
    shipping: 'standard',
  })
  const [ordered, setOrdered] = useState(false)
  const [orderId, setOrderId] = useState('')
  const shippingCost = total >= 60 ? 0 : form.shipping === 'express' ? 9.9 : 4.9
  const orderTotal = total + shippingCost

  if (items.length === 0 && !ordered) {
    return (
      <div className="checkout-empty">
        <span>🛒</span>
        <h2>Votre panier est vide</h2>
        <Link to="/boutique" className="btn-primary">Découvrir la boutique</Link>
      </div>
    )
  }

  const handleOrderSuccess = () => {
    const id = addOrder({
      customer: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      zip: form.zip,
      country: form.country,
      items: items.map(i => ({ name: i.product.name, qty: i.qty, price: i.product.price, img: i.product.img })),
      total: orderTotal,
    })
    setOrderId(id)
    setOrdered(true)
    clearCart()
    fetch(`${API_URL}/send-order-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: id,
        customer: { firstName: form.firstName, lastName: form.lastName, email: form.email },
        items: items.map(i => ({ name: i.product.name, qty: i.qty, price: i.product.price, img: i.product.img })),
        total: orderTotal,
        shipping: form.shipping,
        address: `${form.address}, ${form.zip} ${form.city}`,
      }),
    }).catch(() => {})
  }

  if (ordered) {
    return (
      <div className="order-success">
        <div className="order-success__icon"><Check size={48} /></div>
        <h2>Commande confirmée !</h2>
        <p>Merci {form.firstName}, un email de confirmation a été envoyé à <strong>{form.email}</strong>. 🕯️</p>
        <div className="order-success__number">N° de commande : <strong>{orderId}</strong></div>
        <Link to="/" className="btn-primary">Retour à l'accueil</Link>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <Link to="/boutique" className="checkout-back"><ArrowLeft size={16} /> Continuer mes achats</Link>
        <div className="checkout-logo"><img src="/logo.png" alt="Emerald Bougies" style={{ height: '52px', width: 'auto', objectFit: 'contain', mixBlendMode: 'screen', filter: 'drop-shadow(0 0 6px rgba(201,168,76,0.3))' }} /></div>
        <span className="checkout-secure"><Lock size={14} /> Paiement sécurisé</span>
      </div>

      {/* STEPS */}
      <div className="checkout-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`checkout-step${i <= step ? ' active' : ''}${i < step ? ' done' : ''}`}>
            <span className="step-num">{i < step ? <Check size={12} /> : i + 1}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        {/* FORM */}
        <div className="checkout-form">
          {step === 0 && (
            <div className="checkout-section">
              <h3>Vos coordonnées</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom *</label>
                  <input type="text" placeholder="Prénom" value={form.firstName}
                    onChange={e => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Nom *</label>
                  <input type="text" placeholder="Nom" value={form.lastName}
                    onChange={e => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" placeholder="email@exemple.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input type="tel" placeholder="+33 6 XX XX XX XX" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Adresse *</label>
                <input type="text" placeholder="123 Rue de la Paix" value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Code postal *</label>
                  <input type="text" placeholder="75001" value={form.zip}
                    onChange={e => setForm({ ...form, zip: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Ville *</label>
                  <input type="text" placeholder="Paris" value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })} />
                </div>
              </div>
              <button className="btn-primary btn-full" onClick={() => setStep(1)}>
                Continuer vers la livraison →
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="checkout-section">
              <h3>Mode de livraison</h3>
              {[
                { id: 'standard', label: 'Livraison standard', time: '5–7 jours ouvrés', price: total >= 60 ? 'Offerte' : '4,90 €' },
                { id: 'express', label: 'Livraison express', time: '2–3 jours ouvrés', price: '9,90 €' },
                { id: 'pickup', label: 'Retrait à l\'atelier', time: 'La Réunion uniquement', price: 'Gratuit' },
              ].map(s => (
                <label key={s.id} className={`shipping-option${form.shipping === s.id ? ' active' : ''}`}>
                  <input type="radio" name="shipping" value={s.id}
                    checked={form.shipping === s.id}
                    onChange={() => setForm({ ...form, shipping: s.id })} />
                  <div className="shipping-option__info">
                    <strong>{s.label}</strong>
                    <span>{s.time}</span>
                  </div>
                  <span className="shipping-option__price">{s.price}</span>
                </label>
              ))}
              <div className="checkout-nav">
                <button className="btn-secondary" onClick={() => setStep(0)}>← Retour</button>
                <button className="btn-primary" onClick={() => setStep(2)}>Continuer →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <PaymentForm
              orderTotal={orderTotal}
              onSuccess={handleOrderSuccess}
              onBack={() => setStep(1)}
              formData={form}
            />
          )}
        </div>

        {/* ORDER SUMMARY */}
        <div className="order-summary">
          <h3>Récapitulatif</h3>
          <div className="order-summary__items">
            {items.map(item => (
              <div className="summary-item" key={item.product.id}>
                <div className="summary-item__img-wrap">
                  <img src={item.product.img} alt={item.product.name} />
                  <span className="summary-item__qty">{item.qty}</span>
                </div>
                <div className="summary-item__info">
                  <span className="summary-item__name">{item.product.name}</span>
                  <span className="summary-item__scent">{item.scent}</span>
                </div>
                <span className="summary-item__price">{(item.product.price * item.qty).toFixed(2)} €</span>
              </div>
            ))}
          </div>
          <div className="order-summary__totals">
            <div><span>Sous-total</span><span>{total.toFixed(2)} €</span></div>
            <div><span>Livraison</span><span>{shippingCost === 0 ? 'Offerte 🎉' : `${shippingCost.toFixed(2)} €`}</span></div>
            <div className="order-total"><span>Total</span><span>{orderTotal.toFixed(2)} €</span></div>
          </div>
          <div className="order-summary__secure">
            <Lock size={13} /> Paiement 100% sécurisé
          </div>
        </div>
      </div>
    </div>
  )
}
