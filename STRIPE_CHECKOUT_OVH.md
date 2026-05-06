# Stripe Checkout pour OVH (Sans Backend Node.js)

## ⚠️ Problème
Le checkout actuel utilise un **backend Node.js** (`/api/create-payment-intent`) qui ne fonctionne pas sur OVH mutualisé.

## ✅ Solution : Stripe Checkout (Redirection)

Stripe Checkout redirige le client vers une page de paiement Stripe, puis revient sur votre site.

**Avantages :**
- ✅ Fonctionne sur OVH mutualisé (pas de backend Node.js)
- ✅ Paiement sécurisé par Stripe
- ✅ Gère les cartes, PayPal, etc.

**Inconvénients :**
- ❌ Moins personnalisé (page externe Stripe)
- ❌ Pas d'emails automatiques (pas de backend)
- ❌ Pas de gestion des commandes en admin (pas de base de données)

---

## 🔧 Configuration Stripe Checkout

### 1. Créer un compte Stripe
https://dashboard.stripe.com

### 2. Activer Stripe Checkout
Dans le Dashboard Stripe :
1. Allez dans **"Checkout"** → **"Configuration"**
2. Activez **"Stripe Checkout"**
3. Configurez l'URL de retour : `https://votresite.ovh/checkout/success`

### 3. Récupérer les clés API
- Clé publique : `pk_test_...` (test) ou `pk_live_...` (prod)
- Clé secrète : `sk_test_...` (test) ou `sk_live_...` (prod)

### 4. Créer des produits dans Stripe
Dans le Dashboard Stripe :
1. Allez dans **"Produits"**
2. Créez vos bougies avec prix et images
3. Récupérez les **ID des produits** (ex: `prod_ABC123`)

---

## 💻 Code pour CheckoutPage.tsx

Remplacez le contenu de `src/pages/CheckoutPage.tsx` par :

```typescript
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY

// Configuration des IDs de produits Stripe
// Créez ces produits dans votre Dashboard Stripe
const STRIPE_PRODUCTS: Record<string, string> = {
  'dragon-noir': 'price_xxx',     // Remplacer par vos vrais IDs
  'dragon-rouge': 'price_xxx',
  'dragon-bleu': 'price_xxx',
  'dragon-vert': 'price_xxx',
  // ... ajoutez tous vos produits
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', zip: '', country: 'France',
  })
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (!form.email || !form.firstName || !form.lastName) {
      alert('Veuillez remplir vos coordonnées')
      return
    }
    
    setLoading(true)
    
    // Redirection vers Stripe Checkout
    // Note: Cette méthode nécessite un backend minimal ou utilisez l'API Checkout de Stripe
    
    // Solution alternative: Lien de paiement Stripe (plus simple)
    const lineItems = items.map(item => ({
      price: STRIPE_PRODUCTS[item.product.id],
      quantity: item.qty,
    }))
    
    // Créer une session Checkout via l'API Stripe (nécessite backend)
    // OU utiliser les "Payment Links" de Stripe (sans code)
    
    window.location.href = 'https://buy.stripe.com/test_votrelien' // Lien de paiement Stripe
  }

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <span>🛒</span>
        <h2>Votre panier est vide</h2>
        <Link to="/boutique" className="btn-primary">Découvrir la boutique</Link>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <h1><ShoppingBag size={20} /> Finaliser la commande</h1>
      
      <div className="checkout-layout">
        {/* Formulaire */}
        <div className="checkout-form">
          <h3>Coordonnées</h3>
          <div className="form-row">
            <input
              placeholder="Prénom *"
              value={form.firstName}
              onChange={e => setForm({...form, firstName: e.target.value})}
              required
            />
            <input
              placeholder="Nom *"
              value={form.lastName}
              onChange={e => setForm({...form, lastName: e.target.value})}
              required
            />
          </div>
          <input
            type="email"
            placeholder="Email *"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            required
          />
          <input
            placeholder="Téléphone"
            value={form.phone}
            onChange={e => setForm({...form, phone: e.target.value})}
          />
          
          <h3 style={{marginTop: '20px'}}>Adresse de livraison</h3>
          <input
            placeholder="Adresse *"
            value={form.address}
            onChange={e => setForm({...form, address: e.target.value})}
            required
          />
          <div className="form-row">
            <input
              placeholder="Code postal *"
              value={form.zip}
              onChange={e => setForm({...form, zip: e.target.value})}
              required
            />
            <input
              placeholder="Ville *"
              value={form.city}
              onChange={e => setForm({...form, city: e.target.value})}
              required
            />
          </div>
        </div>

        {/* Récapitulatif */}
        <div className="checkout-summary">
          <h3>Récapitulatif</h3>
          {items.map(item => (
            <div key={item.product.id} className="summary-item">
              <span>{item.product.name} × {item.qty}</span>
              <span>{(item.product.price * item.qty).toFixed(2)} €</span>
            </div>
          ))}
          <div className="summary-total">
            <strong>Total</strong>
            <strong>{total.toFixed(2)} €</strong>
          </div>
          
          <button 
            className="btn-primary btn-full" 
            onClick={handleCheckout}
            disabled={loading}
            style={{marginTop: '20px'}}
          >
            {loading ? 'Redirection...' : 'Payer avec Stripe'}
          </button>
          
          <Link to="/boutique" className="btn-secondary btn-full" style={{marginTop: '10px'}}>
            <ArrowLeft size={14} /> Continuer les achats
          </Link>
        </div>
      </div>
    </div>
  )
}
```

---

## 🎯 Solution Plus Simple : Payment Links Stripe

Au lieu de coder, utilisez les **"Payment Links"** de Stripe :

1. Dans Stripe Dashboard → **"Payment Links"**
2. Cliquez **"+ Create"**
3. Ajoutez vos produits
4. Stripe génère un lien : `https://buy.stripe.com/test_xxx`
5. Mettez ce lien dans un bouton "Acheter" sur votre site

**Avantage :** Aucun code nécessaire !

---

## 🔗 Pour chaque produit

Créez un lien de paiement individuel dans Stripe :
```
Bougie Dragon Noir → https://buy.stripe.com/test_abc123
Bougie Dragon Rouge → https://buy.stripe.com/test_def456
```

Ou créez un lien avec plusieurs produits (panier).

---

## ⚠️ Limites sans backend

| Fonctionnalité | Avec Backend | Sans Backend (Payment Links) |
|----------------|--------------|------------------------------|
| Panier complet | ✅ | ❌ (liens individuels) |
| Emails auto | ✅ | ❌ |
| Admin commandes | ✅ | ❌ (dans Stripe Dashboard) |
| Personnalisation | ✅ | ❌ |

---

## 💡 Recommandation

Pour un vrai site e-commerce complet sur OVH :

1. **Formspree** pour le contact ✅ (déjà fait)
2. **Stripe Payment Links** pour les paiements (simple)
3. **Pas de backend Node.js** nécessaire

**OU** utiliser **Render.com** pour le backend (gratuit) + OVH pour le frontend.

---

Voulez-vous que je configure les **Payment Links Stripe** ou préférez-vous garder le **backend sur Render** ?
