import { Truck, Package, RotateCcw, Clock, MapPin, Shield, CheckCircle } from 'lucide-react'

const ZONES = [
  { zone: 'La Réunion', delai: '1–2 jours ouvrés', frais: 'Gratuit dès 60€ / sinon 3,50€', icon: '🏝️' },
  { zone: 'France métropolitaine', delai: '3–5 jours ouvrés', frais: 'Gratuit dès 60€ / sinon 4,90€', icon: '🇫🇷' },
  { zone: 'DOM-TOM', delai: '5–10 jours ouvrés', frais: 'À partir de 6,90€', icon: '🌍' },
  { zone: 'Union Européenne', delai: '7–14 jours ouvrés', frais: 'À partir de 9,90€', icon: '🇪🇺' },
]

const RETOUR_STEPS = [
  { num: '01', title: 'Contactez-nous', desc: 'Envoyez un email à contact@emerald-bougies.re avec votre numéro de commande et le motif du retour, sous 14 jours après réception.' },
  { num: '02', title: 'Validation', desc: 'Nous validons votre demande et vous envoyons les instructions de retour par email sous 24h ouvrées.' },
  { num: '03', title: 'Renvoi du colis', desc: 'Emballez soigneusement l\'article dans son emballage d\'origine et expédiez-le à notre adresse. Les frais de retour sont à votre charge sauf en cas de produit défectueux.' },
  { num: '04', title: 'Remboursement', desc: 'Dès réception et vérification du colis, nous procédons au remboursement sous 5 à 10 jours ouvrés sur votre moyen de paiement initial.' },
]

export default function LivraisonPage() {
  return (
    <div className="livraison-page">
      <div className="page-hero">
        <h1>Livraison & Retours</h1>
        <p>Tout savoir sur nos délais, frais de port et politique de retour</p>
      </div>

      <div className="livraison-content">

        {/* LIVRAISON */}
        <section className="livraison-section">
          <div className="livraison-section__header">
            <Truck size={28} color="var(--gold)" />
            <h2>Livraison</h2>
          </div>

          <div className="livraison-highlight">
            <CheckCircle size={20} color="var(--gold)" />
            <span>Livraison <strong>offerte dès 60€</strong> d'achat — France métropolitaine & La Réunion</span>
          </div>

          <div className="livraison-zones">
            {ZONES.map(z => (
              <div key={z.zone} className="livraison-zone">
                <div className="livraison-zone__flag">{z.icon}</div>
                <div className="livraison-zone__info">
                  <strong>{z.zone}</strong>
                  <div className="livraison-zone__details">
                    <span><Clock size={13} /> {z.delai}</span>
                    <span><Truck size={13} /> {z.frais}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="livraison-info-grid">
            <div className="livraison-info-card">
              <Package size={22} color="var(--gold)" />
              <h3>Préparation</h3>
              <p>Chaque commande est préparée et emballée avec soin sous <strong>2 à 3 jours ouvrés</strong> après validation du paiement.</p>
            </div>
            <div className="livraison-info-card">
              <MapPin size={22} color="var(--gold)" />
              <h3>Suivi Colissimo</h3>
              <p>Un email de confirmation avec votre <strong>numéro de suivi</strong> vous est envoyé dès l'expédition de votre colis.</p>
            </div>
            <div className="livraison-info-card">
              <Shield size={22} color="var(--gold)" />
              <h3>Emballage sécurisé</h3>
              <p>Vos bougies sont protégées dans un emballage <strong>anti-choc recyclable</strong>, avec calage personnalisé pour éviter tout dommage.</p>
            </div>
          </div>

          <div className="livraison-note">
            <strong>Important :</strong> Les délais de livraison sont indicatifs et peuvent varier en période de forte activité (fêtes, soldes). En cas de retard, contactez-nous à contact@emerald-bougies.re ou au +262 693 53 29 40.
          </div>
        </section>

        {/* RETOURS */}
        <section className="livraison-section">
          <div className="livraison-section__header">
            <RotateCcw size={28} color="var(--gold)" />
            <h2>Politique de Retour</h2>
          </div>

          <div className="livraison-highlight">
            <CheckCircle size={20} color="var(--gold)" />
            <span><strong>14 jours</strong> pour changer d'avis — conformément au droit de rétractation légal</span>
          </div>

          <div className="retour-steps">
            {RETOUR_STEPS.map(s => (
              <div key={s.num} className="retour-step">
                <div className="retour-step__num">{s.num}</div>
                <div className="retour-step__body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="retour-conditions">
            <h3>Conditions de retour</h3>
            <ul>
              <li>✅ Article non utilisé, dans son emballage d'origine</li>
              <li>✅ Demande effectuée dans les 14 jours suivant la réception</li>
              <li>❌ Bougies déjà allumées ou utilisées</li>
              <li>❌ Produits personnalisés ou coffrets sur mesure</li>
              <li>❌ Articles dont l'emballage a été détérioré</li>
            </ul>
          </div>

          <div className="retour-adresse">
            <MapPin size={16} color="var(--gold)" />
            <div>
              <strong>Adresse de retour :</strong><br />
              Emerald Bougies — Service Retours<br />
              28 Rue du Tampon, 97430 La Réunion
            </div>
          </div>
        </section>

        {/* PRODUIT DÉFECTUEUX */}
        <section className="livraison-section">
          <div className="livraison-section__header">
            <Shield size={28} color="var(--gold)" />
            <h2>Produit endommagé ou défectueux</h2>
          </div>
          <p className="livraison-text">
            Si votre colis est arrivé endommagé ou si votre produit est défectueux, contactez-nous dans les <strong>48h suivant la réception</strong> en joignant des photos du colis et du produit.
          </p>
          <p className="livraison-text">
            Dans ce cas, les frais de retour sont intégralement pris en charge par Emerald Bougies et nous vous envoyons un remplacement ou procédons au remboursement complet sous 5 à 10 jours.
          </p>
          <div className="livraison-contact-cta">
            <span>Une question sur votre commande ?</span>
            <a href="/contact" className="btn-primary">Nous contacter</a>
          </div>
        </section>

      </div>
    </div>
  )
}
