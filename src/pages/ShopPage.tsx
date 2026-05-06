import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { PRODUCTS } from '../data/products'

const CATEGORIES = [
  { id: 'all', label: 'Toutes les bougies' },
  { id: 'dragons', label: 'Collection Dragon' },
  { id: 'totems', label: 'Animaux Totems' },
  { id: 'astrologie', label: 'Esprits Astrologiques' },
  { id: 'coffrets', label: 'Coffrets & Box' },
]

const SORT_OPTIONS = [
  { value: 'default', label: 'Pertinence' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Meilleures notes' },
  { value: 'reviews', label: 'Plus d\'avis' },
]

export default function ShopPage() {
  const [params, setParams] = useSearchParams()
  const [sort, setSort] = useState('default')
  const [priceMax, setPriceMax] = useState(100)
  const [filterOpen, setFilterOpen] = useState(false)
  const [openSections, setOpenSections] = useState({ cat: true, price: true, stone: false })

  const activeCat = params.get('cat') || 'all'
  const setCategory = (id: string) => {
    if (id === 'all') params.delete('cat')
    else params.set('cat', id)
    setParams(params)
  }

  const filtered = useMemo(() => {
    let list = [...PRODUCTS]
    if (activeCat !== 'all') list = list.filter(p => p.category === activeCat)
    list = list.filter(p => p.price <= priceMax)
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    else if (sort === 'reviews') list.sort((a, b) => b.reviews - a.reviews)
    return list
  }, [activeCat, priceMax, sort])

  const toggleSection = (key: keyof typeof openSections) =>
    setOpenSections(s => ({ ...s, [key]: !s[key] }))

  return (
    <div className="shop-page">
      {/* HERO BAND */}
      <div className="page-hero">
        <h1>Notre Boutique</h1>
        <p>Des bougies artisanales pour chaque énergie</p>
      </div>

      <div className="shop-layout">
        {/* SIDEBAR */}
        <aside className={`shop-sidebar${filterOpen ? ' shop-sidebar--open' : ''}`}>
          <div className="sidebar-header">
            <span><SlidersHorizontal size={16} /> Filtres</span>
            <button className="sidebar-close" onClick={() => setFilterOpen(false)}><X size={18} /></button>
          </div>

          {/* Category */}
          <div className="filter-section">
            <button className="filter-section__title" onClick={() => toggleSection('cat')}>
              Catégories {openSections.cat ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {openSections.cat && (
              <ul className="filter-list">
                {CATEGORIES.map(c => (
                  <li key={c.id}>
                    <button
                      className={`filter-btn${activeCat === c.id ? ' active' : ''}`}
                      onClick={() => setCategory(c.id)}
                    >
                      {c.label}
                      <span className="filter-count">
                        {c.id === 'all' ? PRODUCTS.length : PRODUCTS.filter(p => p.category === c.id).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Price */}
          <div className="filter-section">
            <button className="filter-section__title" onClick={() => toggleSection('price')}>
              Prix max {openSections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {openSections.price && (
              <div className="filter-price">
                <input
                  type="range" min={15} max={100} value={priceMax}
                  onChange={e => setPriceMax(Number(e.target.value))}
                  className="price-slider"
                />
                <div className="filter-price__labels">
                  <span>15 €</span>
                  <span className="price-current-val">{priceMax} €</span>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* MAIN */}
        <div className="shop-main">
          <div className="shop-toolbar">
            <button className="filter-toggle-btn" onClick={() => setFilterOpen(true)}>
              <SlidersHorizontal size={15} /> Filtres
            </button>
            <span className="shop-count">{filtered.length} produit{filtered.length > 1 ? 's' : ''}</span>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="shop-empty">
              <span>🕯️</span>
              <p>Aucun produit ne correspond à vos filtres.</p>
              <button className="btn-primary" onClick={() => { setCategory('all'); setPriceMax(100) }}>
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="products-grid products-grid--shop">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
