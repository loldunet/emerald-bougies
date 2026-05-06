import { useState } from 'react'
import { Star, Quote, ThumbsUp } from 'lucide-react'

const ALL_REVIEWS = [
  { name: 'Sophie M.', location: 'Saint-Denis, La Réunion', rating: 5, date: 'Juin 2026', product: 'Dragon Noir', verified: true, text: 'Ces bougies sont absolument magiques. Le parfum est subtil et envoûtant, et la qualité de fabrication est irréprochable. Je recommande à 100% !', likes: 24 },
  { name: 'Camille R.', location: 'Paris, France', rating: 5, date: 'Mai 2026', product: 'Coffret Ritual', verified: true, text: 'J\'ai offert le Coffret Ritual à ma meilleure amie et elle était sous le charme. L\'emballage est somptueux, les bougies sont magnifiques. Un cadeau d\'exception.', likes: 32 },
  { name: 'Jade L.', location: 'Lyon, France', rating: 5, date: 'Avril 2026', product: 'Loup des Neiges', verified: true, text: 'La bougie Loup des Neiges m\'accompagne dans ma méditation quotidienne. Je sens vraiment une différence dans mon niveau d\'intuition depuis que je l\'utilise.', likes: 28 },
  { name: 'Marie T.', location: 'Bordeaux, France', rating: 5, date: 'Mars 2026', product: 'Dragon Bleu', verified: true, text: 'Livraison rapide et emballage soigné. La bougie est superbe, le parfum bergamote est exactement ce que je cherchais. Je reviendrai !', likes: 19 },
  { name: 'Léa B.', location: 'Marseille, France', rating: 5, date: 'Février 2026', product: 'Scorpion', verified: true, text: 'La bougie Scorpion correspond parfaitement à mon signe ! Le patchouli et la rose sont un mélange envoûtant. Je l\'adore au quotidien.', likes: 21 },
  { name: 'Nathalie V.', location: 'Toulouse, France', rating: 5, date: 'Janvier 2026', product: 'Balance', verified: true, text: 'Un vrai coup de cœur pour la Balance. La pivoine est mon parfum préféré et la qualité de fabrication est premium. Merci Emerald Bougies !', likes: 26 },
]

const STATS = [
  { label: 'Avis vérifiés', value: '6' },
  { label: 'Note moyenne', value: '5.0/5' },
  { label: 'Clients satisfaits', value: '100%' },
  { label: 'Commandes livrées', value: '150+' },
]

const PRODUCTS_NAMES = ['Tous', ...Array.from(new Set(ALL_REVIEWS.map(r => r.product)))]
const RATINGS = ['Tous', '5 ★', '4 ★', '3 ★']

function Stars({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} fill={i <= rating ? '#c9a84c' : 'none'} color={i <= rating ? '#c9a84c' : '#555'} />
      ))}
    </div>
  )
}

export default function AvisPage() {
  const [filterProduct, setFilterProduct] = useState('Tous')
  const [filterRating, setFilterRating] = useState('Tous')
  const [sortBy, setSortBy] = useState('recent')

  const filtered = ALL_REVIEWS
    .filter(r => filterProduct === 'Tous' || r.product === filterProduct)
    .filter(r => filterRating === 'Tous' || r.rating === parseInt(filterRating))
    .sort((a, b) => sortBy === 'likes' ? b.likes - a.likes : 0)

  const avgRating = (ALL_REVIEWS.reduce((s, r) => s + r.rating, 0) / ALL_REVIEWS.length).toFixed(1)
  const ratingCounts = [5, 4, 3, 2, 1].map(n => ({
    star: n,
    count: ALL_REVIEWS.filter(r => r.rating === n).length,
    pct: Math.round(ALL_REVIEWS.filter(r => r.rating === n).length / ALL_REVIEWS.length * 100),
  }))

  return (
    <div className="avis-page">
      {/* HERO */}
      <section className="avis-hero">
        <div className="avis-hero__inner">
          <p className="avis-hero__overline">✦ Ils nous font confiance ✦</p>
          <h1 className="avis-hero__title">Nos Avis Clients</h1>
          <p className="avis-hero__sub">Des milliers de clients partagent leur expérience avec Emerald Bougies</p>
        </div>
      </section>

      {/* STATS */}
      <section className="avis-stats">
        {STATS.map(s => (
          <div key={s.label} className="avis-stat">
            <span className="avis-stat__value">{s.value}</span>
            <span className="avis-stat__label">{s.label}</span>
          </div>
        ))}
      </section>

      <div className="avis-main">
        {/* RATING SUMMARY */}
        <aside className="avis-summary">
          <div className="avis-summary__score">
            <span className="avis-summary__big">{avgRating}</span>
            <Stars rating={5} size={22} />
            <span className="avis-summary__total">sur {ALL_REVIEWS.length} avis</span>
          </div>
          <div className="avis-summary__bars">
            {ratingCounts.map(({ star, count, pct }) => (
              <div key={star} className="avis-bar">
                <span className="avis-bar__label">{star} ★</span>
                <div className="avis-bar__track">
                  <div className="avis-bar__fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="avis-bar__count">{count}</span>
              </div>
            ))}
          </div>

          <div className="avis-summary__products">
            <p className="avis-summary__section-title">Par produit</p>
            {PRODUCTS_NAMES.map(p => (
              <button
                key={p}
                className={`avis-product-btn${filterProduct === p ? ' active' : ''}`}
                onClick={() => setFilterProduct(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </aside>

        {/* REVIEWS LIST */}
        <div className="avis-list-wrap">
          {/* FILTERS */}
          <div className="avis-filters">
            <div className="avis-filters__group">
              <label>Note</label>
              <div className="avis-filters__btns">
                {RATINGS.map(r => (
                  <button key={r} className={`avis-filter-btn${filterRating === r ? ' active' : ''}`} onClick={() => setFilterRating(r)}>{r}</button>
                ))}
              </div>
            </div>
            <div className="avis-filters__group">
              <label>Trier par</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="avis-select">
                <option value="recent">Plus récents</option>
                <option value="likes">Plus utiles</option>
              </select>
            </div>
          </div>

          {/* CARDS */}
          <div className="avis-list">
            {filtered.map((r, i) => (
              <div key={i} className="avis-card">
                <div className="avis-card__header">
                  <div className="avis-card__avatar">{r.name[0]}</div>
                  <div className="avis-card__meta">
                    <span className="avis-card__name">{r.name}</span>
                    <span className="avis-card__location">{r.location}</span>
                  </div>
                  <div className="avis-card__right">
                    <Stars rating={r.rating} />
                    <span className="avis-card__date">{r.date}</span>
                  </div>
                </div>
                {r.verified && <span className="avis-card__verified">✔ Achat vérifié</span>}
                <div className="avis-card__product">Produit : <strong>{r.product}</strong></div>
                <Quote size={16} className="avis-card__quote-icon" />
                <p className="avis-card__text">{r.text}</p>
                <div className="avis-card__footer">
                  <button className="avis-card__like"><ThumbsUp size={13} /> Utile ({r.likes})</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
