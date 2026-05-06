import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Package, BarChart2, LogOut,
  Search, Eye, Truck, CheckCircle, Clock, XCircle, AlertCircle,
  TrendingUp, Users, Euro, ChevronRight, X, Save, Tag, MessageSquare, Trash2, Mail, MailOpen,
  Send, Loader, CheckCircle2, Reply, Lock, EyeOff, FileText, Printer
} from 'lucide-react'
import { useAdmin, type Order, type OrderStatus, type ContactMessage } from '../context/AdminContext'
import { PRODUCTS } from '../data/products'
import { API_URL } from '../config/api'

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending:    { label: 'En attente',    color: '#f59e0b', icon: Clock },
  processing: { label: 'En préparation', color: '#3b82f6', icon: Package },
  shipped:    { label: 'Expédié',        color: '#8b5cf6', icon: Truck },
  delivered:  { label: 'Livré',          color: '#10b981', icon: CheckCircle },
  cancelled:  { label: 'Annulé',         color: '#ef4444', icon: XCircle },
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, color, icon: Icon } = STATUS_CONFIG[status]
  return (
    <span className="admin-status-badge" style={{ '--status-color': color } as React.CSSProperties}>
      <Icon size={12} /> {label}
    </span>
  )
}

function Dashboard({ orders }: { orders: Order[] }) {
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const shippedCount = orders.filter(o => o.status === 'shipped').length
  const deliveredCount = orders.filter(o => o.status === 'delivered').length

  // Meilleurs ventes
  const salesMap: Record<string, { name: string; qty: number; revenue: number; img: string }> = {}
  orders.filter(o => o.status !== 'cancelled').forEach(o => {
    o.items.forEach(item => {
      if (!salesMap[item.name]) salesMap[item.name] = { name: item.name, qty: 0, revenue: 0, img: item.img }
      salesMap[item.name].qty += item.qty
      salesMap[item.name].revenue += item.qty * item.price
    })
  })
  const topSales = Object.values(salesMap).sort((a, b) => b.qty - a.qty).slice(0, 5)

  // Enrichi avec les produits
  const enrichedTop = topSales.map(s => {
    const p = PRODUCTS.find(p => p.name === s.name)
    return { ...s, img: p?.img || s.img, rating: p?.rating || 5, reviews: p?.reviews || 0 }
  })

  const recentOrders = [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  return (
    <div className="admin-dashboard">
      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__icon" style={{ background: 'rgba(201,168,76,.15)', color: '#c9a84c' }}>
            <Euro size={22} />
          </div>
          <div>
            <div className="admin-kpi-card__value">{totalRevenue.toFixed(2)} €</div>
            <div className="admin-kpi-card__label">Chiffre d'affaires</div>
          </div>
        </div>
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__icon" style={{ background: 'rgba(59,130,246,.15)', color: '#3b82f6' }}>
            <ShoppingBag size={22} />
          </div>
          <div>
            <div className="admin-kpi-card__value">{orders.length}</div>
            <div className="admin-kpi-card__label">Commandes totales</div>
          </div>
        </div>
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__icon" style={{ background: 'rgba(245,158,11,.15)', color: '#f59e0b' }}>
            <AlertCircle size={22} />
          </div>
          <div>
            <div className="admin-kpi-card__value">{pendingCount}</div>
            <div className="admin-kpi-card__label">En attente</div>
          </div>
        </div>
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__icon" style={{ background: 'rgba(16,185,129,.15)', color: '#10b981' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="admin-kpi-card__value">{deliveredCount}</div>
            <div className="admin-kpi-card__label">Livrées</div>
          </div>
        </div>
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__icon" style={{ background: 'rgba(139,92,246,.15)', color: '#8b5cf6' }}>
            <Truck size={22} />
          </div>
          <div>
            <div className="admin-kpi-card__value">{shippedCount}</div>
            <div className="admin-kpi-card__label">En livraison</div>
          </div>
        </div>
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__icon" style={{ background: 'rgba(236,72,153,.15)', color: '#ec4899' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="admin-kpi-card__value">{orders.length}</div>
            <div className="admin-kpi-card__label">Clients</div>
          </div>
        </div>
      </div>

      <div className="admin-dashboard__cols">
        {/* Meilleures ventes */}
        <div className="admin-card">
          <div className="admin-card__header">
            <TrendingUp size={18} color="var(--gold)" />
            <h3>Meilleures ventes</h3>
          </div>
          <div className="admin-topsales">
            {enrichedTop.map((p, i) => (
              <div key={p.name} className="admin-topsale-item">
                <span className="admin-topsale-rank">#{i + 1}</span>
                <img src={p.img} alt={p.name} className="admin-topsale-img" />
                <div className="admin-topsale-info">
                  <strong>{p.name}</strong>
                  <span>{p.qty} vendu{p.qty > 1 ? 's' : ''}</span>
                </div>
                <div className="admin-topsale-revenue">{p.revenue.toFixed(0)} €</div>
              </div>
            ))}
          </div>
        </div>

        {/* Commandes récentes */}
        <div className="admin-card">
          <div className="admin-card__header">
            <Clock size={18} color="var(--gold)" />
            <h3>Commandes récentes</h3>
          </div>
          <div className="admin-recent-orders">
            {recentOrders.map(o => (
              <div key={o.id} className="admin-recent-order">
                <div>
                  <strong>{o.id}</strong>
                  <span>{o.customer}</span>
                </div>
                <div className="admin-recent-order__right">
                  <StatusBadge status={o.status} />
                  <span className="admin-recent-order__total">{o.total.toFixed(2)} €</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderDetail({ order, onClose }: { order: Order; onClose: () => void }) {
  const { updateOrderStatus, updateTracking, updateNotes } = useAdmin()
  const [tracking, setTracking] = useState(order.tracking || '')
  const [notes, setNotes] = useState(order.notes || '')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)

  const sendStatusEmail = async (newStatus: OrderStatus) => {
    setSendingEmail(true)
    setEmailError(null)
    try {
      const res = await fetch(`${API_URL}/send-status-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: order.email,
          name: order.customer,
          orderId: order.id,
          status: newStatus,
          tracking: order.tracking
        })
      })
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Erreur serveur')
      }
      setEmailSent(newStatus)
      setTimeout(() => setEmailSent(null), 3000)
    } catch (err: any) {
      console.error('Erreur envoi email statut:', err)
      setEmailError(err.message || 'Erreur envoi email')
      setTimeout(() => setEmailError(null), 5000)
    } finally {
      setSendingEmail(false)
    }
  }

  const handleStatusChange = async (newStatus: OrderStatus) => {
    updateOrderStatus(order.id, newStatus)
    // Envoyer email pour certains statuts
    if (['processing', 'shipped', 'delivered'].includes(newStatus)) {
      await sendStatusEmail(newStatus)
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2>Commande {order.id}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="admin-modal__body">
          {/* Statut */}
          <div className="admin-modal__section">
            <h3>Statut</h3>
            <div className="admin-status-select">
              {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map(s => (
                <button
                  key={s}
                  className={`admin-status-btn${order.status === s ? ' active' : ''}`}
                  style={{ '--status-color': STATUS_CONFIG[s].color } as React.CSSProperties}
                  onClick={() => handleStatusChange(s)}
                  disabled={sendingEmail}
                >
                  {STATUS_CONFIG[s].label}
                  {emailSent === s && <span style={{ marginLeft: 6 }}>✓</span>}
                </button>
              ))}
            </div>
            {sendingEmail && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>📧 Envoi de la notification en cours...</p>}
            {emailError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 8 }}>❌ Erreur: {emailError}</p>}
            {emailSent && <p style={{ fontSize: 12, color: '#10b981', marginTop: 8 }}>✅ Email envoyé au client !</p>}
          </div>

          {/* Client */}
          <div className="admin-modal__section">
            <h3>Client</h3>
            <div className="admin-detail-grid">
              <div><label>Nom</label><span>{order.customer}</span></div>
              <div><label>Email</label><span>{order.email}</span></div>
              <div><label>Téléphone</label><span>{order.phone}</span></div>
              <div><label>Adresse</label><span>{order.address}, {order.zip} {order.city}, {order.country}</span></div>
            </div>
          </div>

          {/* Articles */}
          <div className="admin-modal__section">
            <h3>Articles commandés</h3>
            <div className="admin-order-items">
              {order.items.map((item, i) => (
                <div key={i} className="admin-order-item">
                  <img src={item.img} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <span>Qté : {item.qty} × {item.price.toFixed(2)} €</span>
                  </div>
                  <span className="admin-order-item__total">{(item.qty * item.price).toFixed(2)} €</span>
                </div>
              ))}
              <div className="admin-order-total">
                <span>Total commande</span>
                <strong>{order.total.toFixed(2)} €</strong>
              </div>
            </div>
          </div>

          {/* Suivi */}
          <div className="admin-modal__section">
            <h3>Numéro de suivi</h3>
            <div className="admin-input-row">
              <input
                type="text" placeholder="Ex: FR123456789"
                value={tracking} onChange={e => setTracking(e.target.value)}
              />
              <button className="btn-primary admin-save-btn" onClick={() => updateTracking(order.id, tracking)}>
                <Save size={14} /> Enregistrer
              </button>
            </div>
            {order.tracking && (
              <a
                href={`https://www.laposte.fr/outils/track-a-parcel?code=${order.tracking}`}
                target="_blank" rel="noreferrer"
                className="admin-tracking-link"
              >
                Suivre le colis → {order.tracking}
              </a>
            )}
          </div>

          {/* Notes */}
          <div className="admin-modal__section">
            <h3>Notes internes</h3>
            <textarea
              placeholder="Notes sur cette commande..."
              value={notes} onChange={e => setNotes(e.target.value)}
              rows={3}
            />
            <button className="btn-primary admin-save-btn" style={{ marginTop: 8 }} onClick={() => updateNotes(order.id, notes)}>
              <Save size={14} /> Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrdersTab() {
  const { orders } = useAdmin()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all')
  const [selected, setSelected] = useState<Order | null>(null)

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div>
      <div className="admin-filters">
        <div className="admin-search">
          <Search size={16} />
          <input placeholder="Rechercher commande, client..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="admin-status-filters">
          <button className={`admin-filter-btn${filterStatus === 'all' ? ' active' : ''}`} onClick={() => setFilterStatus('all')}>Toutes ({orders.length})</button>
          {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map(s => (
            <button key={s} className={`admin-filter-btn${filterStatus === s ? ' active' : ''}`} onClick={() => setFilterStatus(s)}>
              {STATUS_CONFIG[s].label} ({orders.filter(o => o.status === s).length})
            </button>
          ))}
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Commande</th><th>Date</th><th>Client</th><th>Articles</th><th>Total</th><th>Statut</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td><strong>{o.id}</strong></td>
                <td>{new Date(o.date).toLocaleDateString('fr-FR')}</td>
                <td>
                  <div>{o.customer}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{o.email}</div>
                </td>
                <td>{o.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</td>
                <td><strong>{o.total.toFixed(2)} €</strong></td>
                <td><StatusBadge status={o.status} /></td>
                <td>
                  <button className="admin-action-btn" onClick={() => setSelected(o)}>
                    <Eye size={15} /> Voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="admin-empty">Aucune commande trouvée</div>}
      </div>

      {selected && <OrderDetail order={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function ProductsTab() {
  const { orders, stockOverrides, toggleStock } = useAdmin()

  const salesMap: Record<number, { qty: number; revenue: number }> = {}
  orders.filter(o => o.status !== 'cancelled').forEach(o => {
    o.items.forEach(item => {
      const p = PRODUCTS.find(p => p.name === item.name)
      if (p) {
        if (!salesMap[p.id]) salesMap[p.id] = { qty: 0, revenue: 0 }
        salesMap[p.id].qty += item.qty
        salesMap[p.id].revenue += item.qty * item.price
      }
    })
  })

  const maxQty = Math.max(1, ...Object.values(salesMap).map(s => s.qty))

  return (
    <div>
      <div className="admin-products-grid">
        {PRODUCTS.map(p => {
          const sales = salesMap[p.id] || { qty: 0, revenue: 0 }
          const pct = Math.round((sales.qty / maxQty) * 100)
          const currentStock = p.id in stockOverrides ? stockOverrides[p.id] : p.inStock
          return (
            <div key={p.id} className={`admin-product-card${sales.qty === maxQty && sales.qty > 0 ? ' admin-product-card--top' : ''}`}>
              {sales.qty === maxQty && sales.qty > 0 && <div className="admin-bestseller-badge">⭐ Meilleure vente</div>}
              <img src={p.img} alt={p.name} className="admin-product-img" />
              <div className="admin-product-info">
                <strong>{p.name}</strong>
                <span className="admin-product-price">{p.price.toFixed(2)} €</span>
                <div className="admin-product-stats">
                  <span>⭐ {p.rating} ({p.reviews} avis)</span>
                  <button
                    className={`admin-stock-toggle${currentStock ? ' in-stock' : ' out-stock'}`}
                    onClick={() => toggleStock(p.id, !currentStock)}
                  >
                    {currentStock ? '✅ En stock' : '❌ Rupture'}
                  </button>
                </div>
                <div className="admin-sales-bar-label">
                  <span>Ventes : {sales.qty} unité{sales.qty !== 1 ? 's' : ''}</span>
                  <span>{sales.revenue.toFixed(0)} €</span>
                </div>
                <div className="admin-sales-bar">
                  <div className="admin-sales-bar__fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PricesTab() {
  const { priceOverrides, updatePrice } = useAdmin()
  const [drafts, setDrafts] = useState<Record<number, string>>(() =>
    Object.fromEntries(PRODUCTS.map(p => [p.id, String(p.id in priceOverrides ? priceOverrides[p.id] : p.price)]))
  )
  const [saved, setSaved] = useState<Record<number, boolean>>({})

  const handleChange = (id: number, val: string) => {
    setDrafts(prev => ({ ...prev, [id]: val }))
    setSaved(prev => ({ ...prev, [id]: false }))
  }

  const handleSave = (id: number) => {
    const num = parseFloat(drafts[id])
    if (!isNaN(num) && num > 0) {
      updatePrice(id, Math.round(num * 100) / 100)
      setSaved(prev => ({ ...prev, [id]: true }))
    }
  }

  const handleReset = (id: number, basePrice: number) => {
    setDrafts(prev => ({ ...prev, [id]: String(basePrice) }))
    updatePrice(id, basePrice)
    setSaved(prev => ({ ...prev, [id]: false }))
  }

  return (
    <div>
      <div className="admin-prices-header">
        <p>Modifiez les prix en temps réel. Les changements sont appliqués immédiatement sur le site client.</p>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Collection</th>
              <th>Prix original</th>
              <th>Prix actuel</th>
              <th>Nouveau prix (€)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map(p => {
              const currentPrice = p.id in priceOverrides ? priceOverrides[p.id] : p.price
              const modified = currentPrice !== p.price
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={p.img} alt={p.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--cream)' }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{p.collection}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.price.toFixed(2)} €</td>
                  <td>
                    <span style={{ color: modified ? 'var(--gold)' : 'var(--cream)', fontWeight: modified ? 700 : 400 }}>
                      {currentPrice.toFixed(2)} €
                      {modified && <span className="admin-price-modified-tag">modifié</span>}
                    </span>
                  </td>
                  <td>
                    <div className="admin-price-input-wrap">
                      <input
                        type="number" min="0.01" step="0.01"
                        value={drafts[p.id] ?? ''}
                        onChange={e => handleChange(p.id, e.target.value)}
                        className="admin-price-input"
                      />
                      <span className="admin-price-currency">€</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className={`admin-action-btn${saved[p.id] ? ' saved' : ''}`}
                        onClick={() => handleSave(p.id)}
                      >
                        <Save size={14} /> {saved[p.id] ? 'Sauvegardé !' : 'Appliquer'}
                      </button>
                      {modified && (
                        <button className="admin-action-btn admin-action-btn--reset" onClick={() => handleReset(p.id, p.price)}>
                          Réinitialiser
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ReplyForm({ msg, onClose }: { msg: ContactMessage; onClose: () => void }) {
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    if (!reply.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/send-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: msg.email,
          name: msg.name,
          subject: `Re : ${msg.subject}`,
          originalMessage: msg.message,
          reply,
        }),
      })
      if (!res.ok) throw new Error('Erreur serveur')
      setSent(true)
    } catch {
      setError('Impossible d\'envoyer. Vérifiez que le serveur backend est lancé.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) return (
    <div className="admin-reply-sent">
      <CheckCircle2 size={22} color="#10b981" />
      <span>Réponse envoyée à <strong>{msg.email}</strong></span>
      <button className="admin-action-btn" onClick={onClose}><X size={14} /> Fermer</button>
    </div>
  )

  return (
    <div className="admin-reply-form">
      <div className="admin-reply-form__header">
        <span><Reply size={15} /> Répondre à <strong>{msg.name}</strong> — <em>{msg.email}</em></span>
        <button className="admin-reply-close" onClick={onClose}><X size={16} /></button>
      </div>
      <textarea
        className="admin-reply-textarea"
        rows={6}
        placeholder={`Bonjour ${msg.name},\n\n`}
        value={reply}
        onChange={e => setReply(e.target.value)}
        autoFocus
      />
      {error && <div className="admin-reply-error">⚠️ {error}</div>}
      <div className="admin-reply-form__footer">
        <button className="btn-primary" onClick={handleSend} disabled={loading || !reply.trim()}>
          {loading ? <><Loader size={15} className="spin" /> Envoi…</> : <><Send size={15} /> Envoyer la réponse</>}
        </button>
        <button className="admin-action-btn admin-action-btn--reset" onClick={onClose}>Annuler</button>
      </div>
    </div>
  )
}


function InvoicesTab() {
  const { orders } = useAdmin()
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')
  const [sendingInvoice, setSendingInvoice] = useState(false)
  const [invoiceSent, setInvoiceSent] = useState<string | null>(null)
  const [invoiceError, setInvoiceError] = useState<string | null>(null)

  const filteredOrders = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
    
    if (!matchSearch) return false
    
    const orderDate = new Date(o.date)
    const today = new Date()
    
    switch (dateFilter) {
      case 'today':
        return orderDate.toDateString() === today.toDateString()
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        return orderDate >= weekAgo
      case 'month':
        return orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear()
      default:
        return true
    }
  })

  const totalInvoiced = filteredOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0)
  const totalPaid = filteredOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0)
  const totalPending = filteredOrders.filter(o => o.status === 'pending' || o.status === 'processing').reduce((sum, o) => sum + o.total, 0)

  const sendInvoiceByEmail = async (order: Order) => {
    setSendingInvoice(true)
    setInvoiceError(null)
    setInvoiceSent(null)
    try {
      const res = await fetch(`${API_URL}/send-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: order.email,
          customer: order.customer,
          orderId: order.id,
          date: new Date(order.date).toLocaleDateString('fr-FR'),
          status: STATUS_CONFIG[order.status].label,
          items: order.items,
          total: order.total,
          address: `${order.address}, ${order.zip} ${order.city}, ${order.country}`,
          tracking: order.tracking || null,
        }),
      })
      if (res.ok) {
        setInvoiceSent(order.id)
        setTimeout(() => setInvoiceSent(null), 4000)
      } else {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Erreur lors de l\'envoi')
      }
    } catch (err: any) {
      setInvoiceError(err.message || 'Erreur lors de l\'envoi')
      setTimeout(() => setInvoiceError(null), 5000)
    } finally {
      setSendingInvoice(false)
    }
  }

  const printInvoice = (order: Order) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
<title>Facture ${order.id}</title>
<style>
body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #333; }
.header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #c9a84c; padding-bottom: 20px; margin-bottom: 30px; }
.header-left { display: flex; align-items: center; gap: 20px; }
.logo { width: 120px; height: auto; }
.company-info h1 { color: #c9a84c; margin: 0 0 8px 0; font-size: 24px; }
.company-info p { margin: 3px 0; color: #666; font-size: 13px; }
.header-right { text-align: right; }
.header-right h2 { color: #c9a84c; margin: 0; font-size: 28px; }
.header-right p { margin: 5px 0; color: #666; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
.info-section h3 { color: #c9a84c; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
.info-section p { margin: 5px 0; }
.items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
.items-table th { background: #f9f6f0; padding: 12px; text-align: left; border-bottom: 2px solid #c9a84c; }
.items-table td { padding: 12px; border-bottom: 1px solid #eee; }
.items-table .right { text-align: right; }
.total-section { text-align: right; margin-top: 20px; font-size: 18px; }
.total-section strong { color: #c9a84c; font-size: 24px; }
.footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
.status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
.status-paid { background: #d4edda; color: #155724; }
.status-pending { background: #fff3cd; color: #856404; }
.status-cancelled { background: #f8d7da; color: #721c24; }
</style>
</head>
<body>
<div class="header">
<div class="header-left">
<img src="/logo.png" alt="Emerald Bougies" class="logo" onerror="this.style.display='none'" />
<div class="company-info">
<h1>Emerald' Bougies</h1>
<p>28 rue du tampon</p>
<p>97430 Tampon, Réunion</p>
<p>Tél: 0693 53 29 40</p>
<p>SIREN: 000000000</p>
</div>
</div>
<div class="header-right">
<h2>FACTURE</h2>
<p><strong>${order.id}</strong></p>
<p>Date: ${new Date(order.date).toLocaleDateString('fr-FR')}</p>
</div>
</div>
<div class="info-grid">
<div class="info-section">
<h3>Facturer à</h3>
<p><strong>${order.customer}</strong></p>
<p>${order.address}</p>
<p>${order.zip} ${order.city}</p>
<p>${order.country}</p>
<p>${order.email}</p>
<p>${order.phone || '-'}</p>
</div>
<div class="info-section">
<h3>Informations</h3>
<p><strong>N° Commande:</strong> ${order.id}</p>
<p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString('fr-FR')}</p>
<p><strong>Statut:</strong> <span class="status ${order.status === 'delivered' ? 'status-paid' : order.status === 'cancelled' ? 'status-cancelled' : 'status-pending'}">${STATUS_CONFIG[order.status].label}</span></p>
${order.tracking ? `<p><strong>Suivi:</strong> ${order.tracking}</p>` : ''}
</div>
</div>
<table class="items-table">
<thead>
<tr><th>Produit</th><th class="right">Quantité</th><th class="right">Prix unitaire</th><th class="right">Total</th></tr>
</thead>
<tbody>
${order.items.map(item => `
<tr>
<td>${item.name}</td>
<td class="right">${item.qty}</td>
<td class="right">${item.price.toFixed(2)} €</td>
<td class="right">${(item.qty * item.price).toFixed(2)} €</td>
</tr>
`).join('')}
</tbody>
</table>
<div class="total-section">
<p><strong>Total: ${order.total.toFixed(2)} €</strong></p>
</div>
<div class="footer">
<p>Emerald' Bougies - Artisanat à La Réunion</p>
<p>Merci pour votre confiance !</p>
</div>
</body>
</html>
`
    printWindow.document.write(invoiceHTML)
    printWindow.document.close()
    printWindow.print()
  }

  if (selectedOrder) {
    return (
      <div>
        <div className="admin-filters" style={{ justifyContent: 'space-between' }}>
          <button className="admin-action-btn" onClick={() => setSelectedOrder(null)}>
            ← Retour à la liste
          </button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {invoiceSent === selectedOrder.id && (
              <span style={{ color: '#10b981', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={16} /> Facture envoyée à {selectedOrder.email}
              </span>
            )}
            {invoiceError && (
              <span style={{ color: '#ef4444', fontSize: 13 }}>⚠️ {invoiceError}</span>
            )}
            <button
              className="btn-secondary"
              onClick={() => sendInvoiceByEmail(selectedOrder)}
              disabled={sendingInvoice}
            >
              {sendingInvoice ? <Loader size={16} className="spin" /> : <Mail size={16} />}
              {sendingInvoice ? 'Envoi...' : 'Envoyer par email'}
            </button>
            <button className="btn-primary" onClick={() => printInvoice(selectedOrder)}>
              <Printer size={16} /> Imprimer
            </button>
          </div>
        </div>
        
        <div className="admin-card" style={{ marginTop: 20 }}>
          <div className="admin-card__header" style={{ borderBottom: '2px solid var(--gold)', marginBottom: 20 }}>
            <div>
              <h2>Facture {selectedOrder.id}</h2>
              <p style={{ color: 'var(--text-muted)', margin: '5px 0' }}>
                {new Date(selectedOrder.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <StatusBadge status={selectedOrder.status} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 30 }}>
            <div>
              <h4 style={{ color: 'var(--gold)', marginBottom: 12, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>Client</h4>
              <p style={{ margin: '4px 0' }}><strong>{selectedOrder.customer}</strong></p>
              <p style={{ margin: '4px 0', color: 'var(--text-muted)' }}>{selectedOrder.email}</p>
              <p style={{ margin: '4px 0', color: 'var(--text-muted)' }}>{selectedOrder.phone || '-'}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--gold)', marginBottom: 12, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>Adresse de livraison</h4>
              <p style={{ margin: '4px 0' }}>{selectedOrder.address}</p>
              <p style={{ margin: '4px 0' }}>{selectedOrder.zip} {selectedOrder.city}</p>
              <p style={{ margin: '4px 0' }}>{selectedOrder.country}</p>
            </div>
          </div>
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th style={{ textAlign: 'center' }}>Qté</th>
                <th style={{ textAlign: 'right' }}>Prix unit.</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items.map((item, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={item.img} alt={item.name} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />
                      {item.name}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>{item.qty}</td>
                  <td style={{ textAlign: 'right' }}>{item.price.toFixed(2)} €</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{(item.qty * item.price).toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ textAlign: 'right', marginTop: 20, paddingTop: 20, borderTop: '2px solid var(--gold)' }}>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Total facturé</p>
            <p style={{ fontSize: 28, color: 'var(--gold)', fontWeight: 'bold' }}>{selectedOrder.total.toFixed(2)} €</p>
          </div>
          
          {selectedOrder.tracking && (
            <div style={{ marginTop: 20, padding: 15, background: 'var(--surface)', borderRadius: 8 }}>
              <strong style={{ color: 'var(--gold)' }}>Numéro de suivi:</strong> {selectedOrder.tracking}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* KPI Facturation */}
      <div className="admin-kpi-grid" style={{ marginBottom: 24 }}>
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__icon" style={{ background: 'rgba(201,168,76,.15)', color: '#c9a84c' }}>
            <FileText size={22} />
          </div>
          <div>
            <div className="admin-kpi-card__value">{filteredOrders.length}</div>
            <div className="admin-kpi-card__label">Factures</div>
          </div>
        </div>
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__icon" style={{ background: 'rgba(16,185,129,.15)', color: '#10b981' }}>
            <Euro size={22} />
          </div>
          <div>
            <div className="admin-kpi-card__value">{totalPaid.toFixed(0)} €</div>
            <div className="admin-kpi-card__label">Encaissé</div>
          </div>
        </div>
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__icon" style={{ background: 'rgba(245,158,11,.15)', color: '#f59e0b' }}>
            <Clock size={22} />
          </div>
          <div>
            <div className="admin-kpi-card__value">{totalPending.toFixed(0)} €</div>
            <div className="admin-kpi-card__label">En attente</div>
          </div>
        </div>
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__icon" style={{ background: 'rgba(139,92,246,.15)', color: '#8b5cf6' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="admin-kpi-card__value">{totalInvoiced.toFixed(0)} €</div>
            <div className="admin-kpi-card__label">Total facturé</div>
          </div>
        </div>
      </div>

      <div className="admin-filters">
        <div className="admin-search">
          <Search size={16} />
          <input 
            placeholder="Rechercher facture, client..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <div className="admin-status-filters">
          <button className={`admin-filter-btn${dateFilter === 'all' ? ' active' : ''}`} onClick={() => setDateFilter('all')}>Toutes</button>
          <button className={`admin-filter-btn${dateFilter === 'today' ? ' active' : ''}`} onClick={() => setDateFilter('today')}>Aujourd'hui</button>
          <button className={`admin-filter-btn${dateFilter === 'week' ? ' active' : ''}`} onClick={() => setDateFilter('week')}>Cette semaine</button>
          <button className={`admin-filter-btn${dateFilter === 'month' ? ' active' : ''}`} onClick={() => setDateFilter('month')}>Ce mois</button>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>N° Facture</th><th>Date</th><th>Client</th><th>Articles</th><th>Total</th><th>Statut</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(o => (
              <tr key={o.id}>
                <td><strong>{o.id}</strong></td>
                <td>{new Date(o.date).toLocaleDateString('fr-FR')}</td>
                <td>
                  <div>{o.customer}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{o.email}</div>
                </td>
                <td>{o.items.reduce((sum, i) => sum + i.qty, 0)} article(s)</td>
                <td><strong>{o.total.toFixed(2)} €</strong></td>
                <td><StatusBadge status={o.status} /></td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="admin-action-btn" onClick={() => setSelectedOrder(o)}>
                      <Eye size={15} /> Voir
                    </button>
                    <button 
                      className="admin-action-btn" 
                      onClick={() => sendInvoiceByEmail(o)}
                      disabled={sendingInvoice}
                      title="Envoyer la facture par email"
                    >
                      {sendingInvoice ? <Loader size={14} /> : <Mail size={14} />}
                      {invoiceSent === o.id ? 'Envoyée !' : 'Email'}
                    </button>
                    <button className="admin-action-btn" onClick={() => printInvoice(o)}>
                      <Printer size={15} /> Imprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && <div className="admin-empty">Aucune facture trouvée</div>}
      </div>
    </div>
  )
}

function MessagesTab() {
  const { messages, markRead, deleteMessage } = useAdmin()
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [replying, setReplying] = useState(false)

  const handleOpen = (msg: ContactMessage) => {
    setSelected(msg)
    setReplying(false)
    if (!msg.read) markRead(msg.id)
  }

  const SUBJECT_COLOR: Record<string, string> = {
    'Commande en cours': '#3b82f6',
    'Question produit': '#8b5cf6',
    'Coffret personnalisé': '#f59e0b',
    'Vente en gros': '#10b981',
    'Autre': '#6b7280',
  }

  return (
    <div className="admin-messages-layout">
      {/* Liste */}
      <div className="admin-messages-list">
        <div className="admin-messages-list__header">
          <h3>Messages</h3>
          <span className="admin-nav-badge" style={{ position: 'static', marginLeft: 8 }}>
            {messages.filter(m => !m.read).length} non lus
          </span>
        </div>
        {messages.length === 0 && (
          <div className="admin-empty" style={{ padding: '40px 20px' }}>Aucun message reçu</div>
        )}
        {messages.map(msg => (
          <button
            key={msg.id}
            className={`admin-msg-row${selected?.id === msg.id ? ' active' : ''}${!msg.read ? ' unread' : ''}`}
            onClick={() => handleOpen(msg)}
          >
            <div className="admin-msg-row__icon">
              {msg.read ? <MailOpen size={16} /> : <Mail size={16} />}
            </div>
            <div className="admin-msg-row__body">
              <div className="admin-msg-row__top">
                <strong>{msg.name}</strong>
                <span className="admin-msg-row__date">
                  {new Date(msg.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="admin-msg-row__subject" style={{ color: SUBJECT_COLOR[msg.subject] ?? 'var(--text-muted)' }}>
                {msg.subject}
              </div>
              <div className="admin-msg-row__preview">{msg.message.slice(0, 70)}{msg.message.length > 70 ? '…' : ''}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Détail */}
      <div className="admin-msg-detail">
        {!selected ? (
          <div className="admin-msg-detail__empty">
            <MessageSquare size={40} style={{ color: 'var(--border-gold)', marginBottom: 12 }} />
            <p>Sélectionnez un message</p>
          </div>
        ) : (
          <div className="admin-msg-detail__content">
            <div className="admin-msg-detail__header">
              <div>
                <h2>{selected.subject}</h2>
                <div className="admin-msg-detail__meta">
                  <strong>{selected.name}</strong>
                  <span>·</span>
                  <span>{selected.email}</span>
                  <span>·</span>
                  <span>{new Date(selected.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="admin-action-btn" onClick={() => setReplying(r => !r)}>
                  <Reply size={14} /> Répondre
                </button>
                <button
                  className="admin-action-btn admin-action-btn--reset"
                  onClick={() => { deleteMessage(selected.id); setSelected(null); setReplying(false) }}
                >
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            </div>
            <div className="admin-msg-detail__body">
              {selected.message.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            {replying && (
              <ReplyForm msg={selected} onClose={() => setReplying(false)} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Commandes', icon: ShoppingBag },
  { id: 'invoices', label: 'Facturation', icon: FileText },
  { id: 'products', label: 'Produits & Ventes', icon: BarChart2 },
  { id: 'prices', label: 'Gestion des prix', icon: Tag },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
]

const ADMIN_PASSWORD = 'emerald2024'

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pwd === ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', '1')
      onLogin()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setPwd('')
    }
  }

  return (
    <div className="admin-login">
      <form className={`admin-login__card${shake ? ' shake' : ''}`} onSubmit={handleSubmit}>
        <img src="/logo.png" alt="Emerald Bougies" className="admin-login__logo" />
        <p className="admin-login__subtitle">Espace Administration</p>
        <div className="admin-login__field">
          <Lock size={16} className="admin-login__icon" />
          <input
            type={show ? 'text' : 'password'}
            placeholder="Mot de passe"
            value={pwd}
            onChange={e => { setPwd(e.target.value); setError(false) }}
            autoFocus
            className={error ? 'error' : ''}
          />
          <button type="button" className="admin-login__eye" onClick={() => setShow(s => !s)}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && <p className="admin-login__error">Mot de passe incorrect</p>}
        <button type="submit" className="admin-login__btn">
          Accéder à l'administration
        </button>
      </form>
    </div>
  )
}

export default function AdminPage() {
  const [logged, setLogged] = useState(() => localStorage.getItem('admin_auth') === '1')
  const [tab, setTab] = useState('dashboard')
  const { orders, messages } = useAdmin()
  const navigate = useNavigate()
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const unreadCount = messages.filter(m => !m.read).length

  if (!logged) return <LoginScreen onLogin={() => setLogged(true)} />

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    setLogged(false)
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <img src="/logo.png" alt="Emerald Bougies" className="admin-sidebar__logo" />
          <small>Administration</small>
        </div>
        <nav className="admin-sidebar__nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`admin-nav-item${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <t.icon size={18} />
              <span>{t.label}</span>
              {t.id === 'orders' && pendingCount > 0 && <span className="admin-nav-badge">{pendingCount}</span>}
              {t.id === 'messages' && unreadCount > 0 && <span className="admin-nav-badge">{unreadCount}</span>}
            </button>
          ))}
        </nav>
        <button className="admin-logout" onClick={() => { handleLogout(); navigate('/') }}>
          <LogOut size={16} /> Déconnexion
        </button>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>
            {tab === 'dashboard' && 'Dashboard'}
            {tab === 'orders' && 'Gestion des commandes'}
            {tab === 'invoices' && 'Facturation'}
            {tab === 'products' && 'Produits & Meilleures ventes'}
            {tab === 'prices' && 'Gestion des prix'}
            {tab === 'messages' && 'Messages clients'}
          </h1>
          <div className="admin-topbar__meta">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--gold)' }}>
              {tab === 'dashboard' ? 'Dashboard' : tab === 'orders' ? 'Commandes' : tab === 'invoices' ? 'Facturation' : tab === 'products' ? 'Produits' : tab === 'prices' ? 'Prix' : 'Messages'}
            </span>
          </div>
        </div>

        <div className="admin-content">
          {tab === 'dashboard' && <Dashboard orders={orders} />}
          {tab === 'orders' && <OrdersTab />}
          {tab === 'invoices' && <InvoicesTab />}
          {tab === 'products' && <ProductsTab />}
          {tab === 'prices' && <PricesTab />}
          {tab === 'messages' && <MessagesTab />}
        </div>
      </main>
    </div>
  )
}
