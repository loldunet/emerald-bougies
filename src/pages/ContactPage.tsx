import { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Clock, Send, Check, Loader } from 'lucide-react'
import { API_URL } from '../config/api'
import { useAdmin } from '../context/AdminContext'

export default function ContactPage() {
  const { saveMessage } = useAdmin()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [slowWarning, setSlowWarning] = useState(false)

  useEffect(() => {
    fetch(`${API_URL.replace('/api', '')}/health`).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSlowWarning(false)
    const slowTimer = setTimeout(() => setSlowWarning(true), 8000)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 70000)
      const res = await fetch(`${API_URL}/send-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (res.ok) {
        saveMessage({ name: form.name, email: form.email, subject: form.subject, message: form.message })
        setSent(true)
      } else {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Erreur lors de l\'envoi')
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Délai dépassé. Le serveur est peut-être en démarrage, réessayez dans 30 secondes.')
      } else {
        setError(err.message || 'Une erreur est survenue. Réessayez.')
      }
    } finally {
      clearTimeout(slowTimer)
      setSlowWarning(false)
      setLoading(false)
    }
  }

  return (
    <div className="contact-page">
      <div className="page-hero">
        <h1>Contactez-nous</h1>
        <p>Nous vous répondons sous 24h (jours ouvrés)</p>
      </div>

      <div className="contact-layout">
        {/* INFO */}
        <div className="contact-info">
          <h2>Nos informations</h2>
          <div className="contact-info__items">
            <div className="contact-info__item">
              <MapPin size={20} color="var(--gold)" />
              <div>
                <strong>Adresse</strong>
                <span>28 Rue du Tampon<br />97430 La Réunion</span>
              </div>
            </div>
            <div className="contact-info__item">
              <Phone size={20} color="var(--gold)" />
              <div>
                <strong>Téléphone</strong>
                <span>+262 693 53 29 40</span>
              </div>
            </div>
            <div className="contact-info__item">
              <Mail size={20} color="var(--gold)" />
              <div>
                <strong>Email</strong>
                <span>contact@emerald-bougies.re</span>
              </div>
            </div>
            <div className="contact-info__item">
              <Clock size={20} color="var(--gold)" />
              <div>
                <strong>Horaires</strong>
                <span>Lun–Ven: 9h–18h<br />Samedi: 9h–12h</span>
              </div>
            </div>
          </div>

          <div className="contact-info__faq">
            <h4>Questions fréquentes</h4>
            <a href="#">Délais de livraison</a>
            <a href="#">Politique de retour</a>
            <a href="#">Personnalisation de coffret</a>
            <a href="#">Vente en gros / B2B</a>
          </div>
        </div>

        {/* FORM */}
        <div className="contact-form-wrap">
          {sent ? (
            <div className="contact-success">
              <Check size={48} color="var(--gold)" />
              <h3>Message envoyé !</h3>
              <p>Merci {form.name}, nous vous répondrons dans les plus brefs délais. 🕯️</p>
              <button className="btn-primary" onClick={() => setSent(false)}>Envoyer un autre message</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>Envoyez-nous un message</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Nom complet *</label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Sujet *</label>
                <select
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  required
                >
                  <option value="">Choisir un sujet</option>
                  <option>Commande en cours</option>
                  <option>Question produit</option>
                  <option>Coffret personnalisé</option>
                  <option>Vente en gros</option>
                  <option>Autre</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea
                  rows={6}
                  placeholder="Votre message…"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>
              {error && (
                <div className="contact-error">⚠️ {error}</div>
              )}
              {slowWarning && (
                <div className="contact-error" style={{background:'#1a1200',borderColor:'#c9a84c',color:'#c9a84c'}}>⏳ Démarrage du serveur en cours, patientez 30 secondes…</div>
              )}
              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? <><Loader size={16} className="spin" /> {slowWarning ? 'Démarrage serveur…' : 'Envoi en cours…'}</> : <><Send size={16} /> Envoyer le message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
