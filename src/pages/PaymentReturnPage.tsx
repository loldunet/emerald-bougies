import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Check, X, AlertCircle, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config/api';

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order') || '';
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Vider le panier après paiement réussi
    clearCart();
    
    // Rediriger vers la confirmation après 3 secondes
    const timer = setTimeout(() => {
      navigate('/checkout/confirmation?order=' + orderId);
    }, 3000);
    return () => clearTimeout(timer);
  }, [clearCart, navigate, orderId]);

  return (
    <div className="payment-return-page">
      <div className="payment-return-card">
        <div className="payment-icon success">
          <Check size={40} />
        </div>
        <h1>Paiement confirmé !</h1>
        <p>Votre commande <strong>{orderId}</strong> a été payée avec succès.</p>
        <p className="redirect-msg">Redirection vers la confirmation...</p>
        <Link to="/" className="btn-primary">Retour à l'accueil</Link>
      </div>
    </div>
  );
}

export function PaymentErrorPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order') || '';
  const [errorInfo, setErrorInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier le statut du paiement
    fetch(`${API_URL}/paybox/status/${orderId}`)
      .then(r => r.json())
      .then(data => {
        setErrorInfo(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="payment-return-page">
      <div className="payment-return-card">
        <div className="payment-icon error">
          <X size={40} />
        </div>
        <h1>Paiement refusé</h1>
        {loading ? (
          <p><Loader size={16} className="spin" /> Vérification du paiement...</p>
        ) : errorInfo?.error ? (
          <p>{errorInfo.message || 'Votre paiement n\'a pas pu être traité.'}</p>
        ) : (
          <p>Une erreur est survenue lors du paiement.</p>
        )}
        <p className="help-text">Vous pouvez réessayer ou choisir un autre moyen de paiement.</p>
        <div className="payment-actions">
          <Link to="/checkout" className="btn-primary">Réessayer le paiement</Link>
          <Link to="/contact" className="btn-secondary">Contacter le service client</Link>
        </div>
      </div>
    </div>
  );
}

export function PaymentCancelPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order') || '';

  return (
    <div className="payment-return-page">
      <div className="payment-return-card">
        <div className="payment-icon warning">
          <AlertCircle size={40} />
        </div>
        <h1>Paiement annulé</h1>
        <p>Vous avez annulé le paiement de la commande <strong>{orderId}</strong>.</p>
        <p className="help-text">Votre panier est toujours disponible si vous souhaitez finaliser votre achat.</p>
        <div className="payment-actions">
          <Link to="/checkout" className="btn-primary">Retour au paiement</Link>
          <Link to="/boutique" className="btn-secondary">Continuer mes achats</Link>
        </div>
      </div>
    </div>
  );
}

export function PaymentConfirmationPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order') || '';
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="checkout-page">
      <div className="checkout-confirmation" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ 
          width: 80, 
          height: 80, 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #10b981, #c9a84c)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 30px'
        }}>
          <Check size={40} color="#0d0d0d" />
        </div>
        <h1 style={{ color: '#c9a84c', marginBottom: '16px' }}>Commande confirmée !</h1>
        <p style={{ color: '#999', fontSize: '18px', marginBottom: '8px' }}>
          Merci pour votre confiance.
        </p>
        <p style={{ color: '#c9a84c', fontSize: '16px', marginBottom: '30px' }}>
          Numéro de commande : <strong>{orderId}</strong>
        </p>
        <div style={{ maxWidth: '500px', margin: '0 auto 30px', padding: '20px', background: 'rgba(201,168,76,0.08)', border: '1px solid var(--border-gold)', borderRadius: '12px' }}>
          <p style={{ color: '#999', margin: 0, fontSize: '14px' }}>
            Un email de confirmation vous a été envoyé.<br />
            Nous préparons votre colis avec soin.
          </p>
        </div>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex' }}>
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
