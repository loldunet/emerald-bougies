import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Check, ArrowLeft, ShieldCheck, Loader } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAdmin } from '../context/AdminContext'
import { API_URL } from '../config/api'

function PaymentForm({ 
  orderTotal, 
  onSuccess: _onSuccess, 
  onBack, 
  formData, 
  items,
  orderId,
  shippingCost
}: { 
  orderTotal: number; 
  onSuccess: () => void; 
  onBack: () => void;
  formData: any;
  items: any[];
  orderId: string;
  shippingCost: number;
}) {
  const [loading, setLoading] = useState(false)
  const [payboxData, setPayboxData] = useState<any>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Soumission auto vers Paybox dès qu'on a les données
  useEffect(() => {
    if (payboxData && formRef.current) {
      formRef.current.submit()
    }
  }, [payboxData])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Initialiser le paiement Paybox
      const response = await fetch(`${API_URL}/paybox/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: orderTotal,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
          shippingCost,
          returnUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout/cancel`,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'initialisation du paiement')
      }

      const data = await response.json()
      setPayboxData(data)
    } catch (err) {
      console.error('Erreur Paybox:', err)
      alert('Erreur lors de l\'initialisation du paiement. Veuillez réessayer.')
      setLoading(false)
    }
  }

  // Si on a les données Paybox, afficher le formulaire auto-submit
  if (payboxData) {
    return (
      <div className="checkout-section" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <Loader size={40} className="spin" style={{ color: '#c9a84c', margin: '0 auto 20px' }} />
        <h3 style={{ color: '#c9a84c', marginBottom: '12px' }}>
          Redirection vers la banque...
        </h3>
        <p style={{ color: '#999', marginBottom: '20px' }}>
          Veuillez patienter, nous vous redirigeons vers le serveur de paiement sécurisé.
        </p>
        <form 
          ref={formRef}
          method="POST" 
          action={payboxData.url}
          style={{ display: 'none' }}
        >
          {Object.entries(payboxData.formData).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={String(value)} />
          ))}
        </form>
        <p style={{ color: '#666', fontSize: '12px' }}>
          Si vous n'êtes pas redirigé automatiquement, 
          <button 
            onClick={() => formRef.current?.submit()}
            style={{ background: 'none', border: 'none', color: '#c9a84c', cursor: 'pointer', textDecoration: 'underline' }}
          >
            cliquez ici
          </button>
        </p>
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
          <ShieldCheck size={20} /> Paiement sécurisé Paybox
        </h3>
        <p style={{ color: '#999', fontSize: '14px', margin: 0 }}>
          {formData.firstName} {formData.lastName} — {orderTotal.toFixed(2)} €
        </p>
      </div>

      <div className="payment-logos" style={{ 
        display: 'flex', 
        gap: '12px', 
        justifyContent: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <span style={{ 
          background: 'rgba(255,255,255,0.05)', 
          padding: '8px 16px', 
          borderRadius: '6px',
          border: '1px solid var(--border-gold)',
          fontSize: '13px'
        }}>💳 Carte bancaire</span>
        <span style={{ 
          background: 'rgba(255,255,255,0.05)', 
          padding: '8px 16px', 
          borderRadius: '6px',
          border: '1px solid var(--border-gold)',
          fontSize: '13px'
        }}>VISA</span>
        <span style={{ 
          background: 'rgba(255,255,255,0.05)', 
          padding: '8px 16px', 
          borderRadius: '6px',
          border: '1px solid var(--border-gold)',
          fontSize: '13px'
        }}>Mastercard</span>
        <span style={{ 
          background: 'rgba(255,255,255,0.05)', 
          padding: '8px 16px', 
          borderRadius: '6px',
          border: '1px solid var(--border-gold)',
          fontSize: '13px'
        }}>CB</span>
      </div>

      <div style={{ 
        background: 'rgba(16,185,129,0.08)', 
        border: '1px solid rgba(16,185,129,0.3)', 
        borderRadius: '8px', 
        padding: '16px',
        marginBottom: '24px'
      }}>
        <p style={{ color: '#10b981', fontSize: '13px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} />
          Vous allez être redirigé vers le serveur de paiement sécurisé Paybox (Verifone).
          Vos données bancaires sont protégées par un chiffrement SSL 256-bit.
        </p>
      </div>

      <div className="checkout-nav" style={{ marginTop: '20px' }}>
        <button type="button" className="btn-secondary" onClick={onBack}>← Retour</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          <Lock size={14} /> {loading ? 'Redirection...' : `Payer ${orderTotal.toFixed(2)} €`}
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
              items={items.map(i => ({ name: i.product.name, qty: i.qty, price: i.product.price }))}
              orderId={orderId}
              shippingCost={shippingCost}
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
