# Emerald Bougies

Boutique en ligne de bougies artisanales avec pierres lithothérapie.

## 📁 Structure du projet

```
emerald-bougies/
├── src/              # Frontend React + TypeScript
├── server/           # Backend Express.js (Node.js)
├── dist/             # Build production (à uploader sur OVH)
├── public/           # Assets statiques
└── netlify/          # Fonctions serverless (Netlify)
```

## 🚀 Démarrage rapide

### Prérequis
- Node.js installé
- Clé API Stripe
- Compte SMTP OVH configuré

### Installation

```bash
# Installer les dépendances frontend
npm install

# Installer les dépendances backend
cd server && npm install
```

### Lancer en local

```bash
# Terminal 1 - Backend
npm run server
# ou
cd server && node index.js

# Terminal 2 - Frontend
npm run dev
```

Accès :
- Frontend : http://localhost:5173
- Backend : http://localhost:4242
- Admin : http://localhost:4242/admin (mdp: emerald2024)

## 📧 Configuration emails (OVH SMTP)

Les emails sont envoyés via OVH SMTP. Configuration dans `server/.env` :

```env
SMTP_HOST=smtp.mail.ovh.net
SMTP_PORT=587
SMTP_USER=contact@emerald-bougies.re
SMTP_PASS=VOTRE_MOT_DE_PASSE_OVH
```

## 🛒 Fonctionnalités

- ✅ Boutique avec panier
- ✅ Paiement Stripe
- ✅ Gestion des commandes (admin)
- ✅ Envoi d'emails automatiques (confirmation, statuts)
- ✅ Réponse aux messages clients (admin)
- ✅ Génération de factures PDF

## 📤 Déploiement

### Option 1 : OVH + Render (Recommandé)

1. **Backend** sur Render.com (gratuit)
2. **Frontend** sur OVH mutualisé

Voir : `DEPLOY_OVH_BACKEND.md`

### Option 2 : Netlify (Simple)

Tout sur Netlify avec fonctions serverless.

Voir : `DEPLOY_NETLIFY_CLI.md`

### Option 3 : OVH uniquement (Limité)

Site statique sans backend - utilise Formspree pour contact.

Voir : `DEPLOY_OVH_SIMPLE.md`

## 📄 Documentation détaillée

- `DEPLOY_OVH_BACKEND.md` - Déploiement OVH + Render
- `DEPLOY_NETLIFY_CLI.md` - Déploiement Netlify
- `DEPLOY_OVH_SIMPLE.md` - OVH sans backend
- `EMAILS_CONFIG.md` - Configuration des emails
- `RECAPITULATIF_EMAILS.md` - Récapitulatif des emails automatiques
- `SMTP_OVH_CONFIG.md` - Configuration SMTP OVH

## 🔧 Technologies utilisées

- **Frontend** : React, TypeScript, Vite
- **Backend** : Express.js, Node.js
- **Paiement** : Stripe
- **Emails** : Nodemailer (SMTP OVH)
- **Hébergement** : OVH / Render / Netlify

## 📝 Notes importantes

- **OVH mutualisé ne supporte pas Node.js** → utiliser Render pour le backend
- Les emails ne fonctionnent que si le backend est déployé et accessible
- Le dossier `dist/` doit être rebuild après chaque modification

## 🆘 Support

En cas de problème :
1. Vérifier que le backend est démarré
2. Vérifier les variables d'environnement
3. Consulter les fichiers de documentation ci-dessus

---

© 2026 Emerald Bougies - La Réunion
