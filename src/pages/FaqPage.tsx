import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQ_SECTIONS = [
  {
    section: 'Commande & Livraison',
    items: [
      {
        q: 'Quels sont les délais de livraison ?',
        a: 'Les commandes sont préparées sous 2 à 3 jours ouvrés. La livraison en France métropolitaine prend ensuite 3 à 5 jours ouvrés. Pour La Réunion, comptez 1 à 2 jours ouvrés. Vous recevrez un email de confirmation avec votre numéro de suivi dès l\'expédition.',
      },
      {
        q: 'La livraison est-elle offerte ?',
        a: 'Oui ! La livraison est offerte dès 60€ d\'achat pour la France métropolitaine et La Réunion. En dessous de ce montant, les frais de port sont de 4,90€ pour la France métropolitaine et 3,50€ pour La Réunion.',
      },
      {
        q: 'Livrez-vous à l\'international ?',
        a: 'Nous livrons actuellement en France métropolitaine, dans les DOM-TOM et dans les pays de l\'Union Européenne. Les délais et frais de port varient selon la destination. Contactez-nous pour toute demande spécifique.',
      },
      {
        q: 'Comment suivre ma commande ?',
        a: 'Dès l\'expédition de votre colis, vous recevrez un email contenant votre numéro de suivi Colissimo. Vous pouvez suivre votre commande directement sur le site de La Poste ou via votre espace client.',
      },
      {
        q: 'Puis-je modifier ou annuler ma commande ?',
        a: 'Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa validation. Passé ce délai, la commande est en cours de préparation. Contactez-nous au plus vite par email ou téléphone.',
      },
    ],
  },
  {
    section: 'Produits & Qualité',
    items: [
      {
        q: 'Quels ingrédients utilisez-vous dans vos bougies ?',
        a: 'Nos bougies sont fabriquées à partir de cire de soja 100% végétale, de mèches en coton naturel non traité, et de fragrances de haute qualité. Chaque bougie est enrichie de véritables pierres semi-précieuses et de fleurs séchées naturelles. Aucune paraffine, aucun produit chimique nocif.',
      },
      {
        q: 'Combien de temps dure une bougie Emerald Bougies ?',
        a: 'Nos bougies ont une durée de combustion d\'environ 40 à 50 heures selon le modèle. Pour maximiser la durée de vie, taillez la mèche à 5mm avant chaque allumage et laissez la cire fondre sur toute la surface lors des premières utilisations.',
      },
      {
        q: 'Les pierres dans les bougies sont-elles naturelles ?',
        a: 'Oui, toutes nos pierres sont naturelles et authentiques. Elles sont soigneusement sélectionnées pour leurs propriétés énergétiques. Attention : retirez les pierres avant que la flamme ne les atteigne pour pouvoir les conserver.',
      },
      {
        q: 'Les parfums sont-ils allergènes ?',
        a: 'Nos fragrances respectent les normes IFRA (International Fragrance Association). La liste complète des ingrédients et allergènes potentiels est disponible sur demande. En cas de sensibilité connue, contactez-nous avant l\'achat.',
      },
      {
        q: 'Comment prendre soin de ma bougie ?',
        a: 'Taillez la mèche à 5mm avant chaque utilisation. Ne brûlez pas plus de 4 heures d\'affilée. Placez la bougie sur une surface stable à l\'abri des courants d\'air. Ne laissez jamais une bougie allumée sans surveillance. Conservez-la à l\'abri de la lumière directe du soleil.',
      },
    ],
  },
  {
    section: 'Paiement & Sécurité',
    items: [
      {
        q: 'Quels moyens de paiement acceptez-vous ?',
        a: 'Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), les virements bancaires et PayPal. Toutes les transactions sont cryptées via le protocole SSL.',
      },
      {
        q: 'Le paiement en ligne est-il sécurisé ?',
        a: 'Absolument. Toutes les transactions sont sécurisées et cryptées. Vos données bancaires ne transitent jamais par nos serveurs et sont intégralement protégées.',
      },
      {
        q: 'Puis-je payer en plusieurs fois ?',
        a: 'Nous étudions l\'intégration du paiement en 3 ou 4 fois sans frais prochainement. Contactez-nous pour en savoir plus sur les options disponibles.',
      },
    ],
  },
  {
    section: 'Retours & Remboursements',
    items: [
      {
        q: 'Quelle est votre politique de retour ?',
        a: 'Vous disposez de 14 jours à compter de la réception pour retourner un article non utilisé dans son emballage d\'origine. Les produits personnalisés et les bougies déjà allumées ne sont pas éligibles au retour pour des raisons d\'hygiène.',
      },
      {
        q: 'Mon colis est arrivé endommagé, que faire ?',
        a: 'Prenez des photos du colis et du produit endommagé dès réception, puis contactez-nous dans les 48h à l\'adresse contact@emerald-bougies.re. Nous vous enverrons un remplacement ou procéderons au remboursement dans les plus brefs délais.',
      },
      {
        q: 'Dans quel délai suis-je remboursé(e) ?',
        a: 'Une fois le retour reçu et vérifié, le remboursement est effectué sous 5 à 10 jours ouvrés sur le moyen de paiement utilisé lors de la commande.',
      },
    ],
  },
  {
    section: 'Coffrets & Personnalisation',
    items: [
      {
        q: 'Puis-je personnaliser un coffret cadeau ?',
        a: 'Oui ! Nos coffrets sont entièrement personnalisables. Vous pouvez choisir les bougies, ajouter une carte message personnalisée et opter pour un emballage cadeau luxe. Contactez-nous pour les commandes personnalisées ou en quantité.',
      },
      {
        q: 'Proposez-vous des offres pour les entreprises (B2B) ?',
        a: 'Absolument. Nous proposons des tarifs préférentiels pour les commandes professionnelles et les cadeaux d\'entreprise (CE, événements, séminaires…). Contactez-nous à contact@emerald-bougies.re pour un devis personnalisé.',
      },
      {
        q: 'Les coffrets sont-ils disponibles en boutique ?',
        a: 'Nos produits sont disponibles exclusivement en ligne sur notre site. Nous participons également à des marchés et événements locaux à La Réunion. Suivez-nous sur les réseaux sociaux pour être informé(e) de nos prochaines présences.',
      },
    ],
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item${open ? ' faq-item--open' : ''}`}>
      <button className="faq-item__question" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <ChevronDown size={18} className="faq-item__icon" />
      </button>
      {open && <div className="faq-item__answer">{a}</div>}
    </div>
  )
}

export default function FaqPage() {
  return (
    <div className="faq-page">
      <div className="page-hero">
        <h1>Questions Fréquentes</h1>
        <p>Toutes les réponses à vos questions sur nos produits, livraisons et services</p>
      </div>

      <div className="faq-content">
        {FAQ_SECTIONS.map(section => (
          <div key={section.section} className="faq-section">
            <h2 className="faq-section__title">{section.section}</h2>
            <div className="faq-list">
              {section.items.map(item => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}

        <div className="faq-contact">
          <p>Vous n'avez pas trouvé la réponse à votre question ?</p>
          <a href="/contact" className="btn-primary">Contactez-nous</a>
        </div>
      </div>
    </div>
  )
}
