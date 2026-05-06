import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Leaf, Flame } from 'lucide-react'

const VALUES = [
  { icon: <Heart size={24} color="var(--gold)" />, title: 'Amour & Intention', desc: 'Chaque bougie est coulée avec amour et une intention positive, pour que vous ressentiez cette énergie dès l\'allumage.' },
  { icon: <Leaf size={24} color="var(--gold)" />, title: 'Naturel & Éco-responsable', desc: 'Nous utilisons uniquement des matières premières naturelles : cire de soja, parfums d\'origine naturelle, mèches en coton biologique.' },
  { icon: <Flame size={24} color="var(--gold)" />, title: 'Énergie & Spiritualité', desc: 'Passionnées de lithothérapie et de spiritualité, nous sélectionnons chaque pierre pour ses vertus énergétiques spécifiques.' },
]

const TIMELINE = [
  { year: '2026', title: 'Création du projet', desc: 'Emerald Bougies voit le jour en 2026, né de la passion pour les pierres, la spiritualité et l\'artisanat. Le projet est imaginé comme une invitation à ralentir et à créer des moments de sérénité.' },
  { year: '2026', title: 'Développement', desc: 'Développement des premières collections : Dragons, Animaux Totems et Esprits Astrologiques. Chaque bougie est pensée comme une expérience sensorielle unique, associant cire naturelle et pierres lithothérapie.' },
  { year: '2026', title: 'Lancement officiel', desc: 'Première boutique en ligne et ouverture de l\'atelier au Tampon, Île de la Réunion. Les premières clientes découvrent les créations et l\'aventure commence !' },
]

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="page-hero page-hero--about">
        <h1>Notre Histoire</h1>
        <p>De la passion à l'artisanat — l'histoire d'Emerald Bougies</p>
      </div>

      {/* STORY */}
      <section className="about-story">
        <div className="about-story__img">
          <img src="https://images.unsplash.com/photo-1602928321679-560bb453f190?w=700&q=80" alt="Atelier" />
          <div className="about-story__img-badge">🕯️ Fait à La Réunion</div>
        </div>
        <div className="about-story__content">
          <h2>Notre histoire</h2>
          <p>
            Emerald' Bougie est née d'une idée simple : transformer chaque instant en une expérience sensorielle unique.
          </p>
          <p>
            La marque a été imaginée comme une invitation à ralentir, à se recentrer et à savourer les petits moments du quotidien.
          </p>
          <p>
            Chaque bougie est pensée comme une parenthèse : une lumière douce qui apaise, un parfum qui évoque un souvenir, une atmosphère qui transforme un espace en refuge.
          </p>
          <p>
            Emerald' Bougie, c'est plus qu'une marque. C'est une expérience, une ambiance, une signature.
          </p>
          <p>
            Allumez une bougie… et laissez la magie opérer.
          </p>
          <Link to="/boutique" className="btn-primary">
            Découvrir nos créations <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values">
        <h2 className="section-title-text">✦ Nos Valeurs ✦</h2>
        <div className="values-grid">
          {VALUES.map(v => (
            <div className="value-card" key={v.title}>
              <div className="value-card__icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="about-timeline">
        <h2 className="section-title-text">✦ Notre Parcours ✦</h2>
        <div className="timeline">
          {TIMELINE.map((t, i) => (
            <div className={`timeline-item${i % 2 === 1 ? ' timeline-item--right' : ''}`} key={t.year}>
              <div className="timeline-item__dot" />
              <div className="timeline-item__content">
                <span className="timeline-item__year">{t.year}</span>
                <h4>{t.title}</h4>
                <p>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="about-stats">
        {[
          { value: '150+', label: 'clients satisfaits' },
          { value: '40+', label: 'créations uniques' },
          { value: '100%', label: 'naturel' },
          { value: 'Depuis 2026', label: 'd\'artisanat' },
        ].map(s => (
          <div className="stat-item" key={s.label}>
            <span className="stat-item__value">{s.value}</span>
            <span className="stat-item__label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h3>Prête à découvrir votre bougie signature ?</h3>
        <p>Explorez notre boutique et trouvez la bougie qui résonne avec votre énergie.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/boutique" className="btn-primary">Voir la boutique <ArrowRight size={15} /></Link>
          <Link to="/contact" className="btn-secondary">Nous contacter</Link>
        </div>
      </section>
    </div>
  )
}
