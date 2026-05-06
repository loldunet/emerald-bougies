# Déploiement sur Netlify

## Option 1: Déploiement via CLI (Recommandé)

### Prérequis
1. Créez un compte sur [netlify.com](https://www.netlify.com)
2. Installez Node.js (v20+)

### Étapes

1. **Build du projet**
   ```bash
   npm run build
   ```

2. **Authentification Netlify** (première fois uniquement)
   ```bash
   npx netlify login
   ```

3. **Déploiement**
   ```bash
   npx netlify deploy --prod --dir=dist
   ```

   Ou double-cliquez sur `deploy-to-netlify.bat`

## Option 2: Drag & Drop (Plus simple)

1. Build le projet:
   ```bash
   npm run build
   ```

2. Allez sur [app.netlify.com/drop](https://app.netlify.com/drop)

3. Glissez-déposez le dossier `dist/` sur la page

## Configuration des variables d'environnement

Sur Netlify, ajoutez ces variables dans Site settings > Environment variables:

| Variable | Valeur |
|----------|--------|
| `STRIPE_SECRET_KEY` | sk_test_... |
| `SMTP_HOST` | smtp-relay.brevo.com |
| `SMTP_PORT` | 587 |
| `SMTP_USER` | a8f5fe001@smtp-brevo.com |
| `SMTP_PASS` | 3hUWqzSFJ8dnAmkv |
| `CONTACT_TO` | contact@emerald-bougies.re |
| `SMTP_FROM` | contact@emerald-bougies.re |

## Fonctions serverless

Les API backend sont dans `netlify/functions/api.js`:
- `/api/create-payment-intent` - Paiement Stripe
- `/api/send-contact` - Formulaire de contact
- `/api/send-order-confirmation` - Confirmation commande
- `/api/send-reply` - Réponse aux messages
- `/api/send-status-update` - Mise à jour statut commande

## URL du site

Après déploiement, le site sera accessible sur:
`https://emerald-bougies-XXXX.netlify.app`

Vous pouvez configurer un domaine personnalisé dans les paramètres Netlify.
