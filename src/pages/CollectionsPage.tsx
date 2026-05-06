import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { COLLECTIONS } from '../data/products'

export default function CollectionsPage() {
  return (
    <div className="collections-page">
      <div className="page-hero">
        <h1>Nos Collections</h1>
        <p>Chaque univers porte une intention, une énergie unique</p>
      </div>

      <div className="collections-full">
        {COLLECTIONS.map((col, i) => (
          <div className={`collection-row${i % 2 === 1 ? ' collection-row--reverse' : ''}`} key={col.id}>
            <div className="collection-row__img">
              <img src={col.img} alt={col.name} />
            </div>
            <div className="collection-row__content">
              <span className="collection-row__tag">Collection</span>
              <h2>{col.name}</h2>
              <p className="collection-row__sub">{col.sub}</p>
              <p className="collection-row__desc">{col.description}</p>
              <div className="collection-row__count">{col.count} bougies dans cette collection</div>
              <Link to={`/boutique?cat=${col.id}`} className="btn-primary">
                Explorer la collection <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
