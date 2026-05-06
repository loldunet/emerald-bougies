# 🚀 Déploiement OVH - Version Simple (Sans Backend)

Cette version fonctionne **uniquement avec OVH mutualisé** (pas de Node.js requis).

## Ce qui fonctionne
✅ Site vitrine complet  
✅ Navigation React Router  
✅ Panier (localStorage)  
⚠️ Paiement : Redirection Stripe Checkout (au lieu de Stripe Elements)  
⚠️ Formulaire contact : Formspree.io (au lieu de backend Node.js)  
⚠️ Pas d'emails automatiques de commande  

## 📁 Fichiers prêts pour OVH

Le dossier `dist/` contient tout ce qu'il faut :
```
dist/
├── .htaccess          ← Routes React Router
├── index.html         ← Application React
├── assets/            ← CSS & JS
└── [images...]       ← Toutes les images
```

## 🔧 Configuration avant upload

### 1. Modifiez le mode paiement (si vous voulez Stripe Checkout)

Dans `src/pages/CheckoutPage.tsx`, remplacez l'intégration Stripe Elements par une redirection vers Stripe Checkout.

**Ou laissez comme ça** - le paiement affichera "Mode démo" si le backend n'est pas disponible.

### 2. Formulaire de contact

Dans `src/pages/ContactPage.tsx`, modifiez le `handleSubmit`:

```typescript
// Au lieu de fetch('/api/send-contact'...)
// Utilisez Formspree (gratuit) :
const res = await fetch('https://formspree.io/f/VOTRE_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
})
```

Créez un compte gratuit sur https://formspree.io pour obtenir votre ID.

## 📤 Upload sur OVH

### Via FileZilla

1. **Téléchargez FileZilla** : https://filezilla-project.org

2. **Connexion** (infos dans OVH Manager) :
```
Hôte : ftp.votredomaine.re
Identifiant : votre-login-ftp
Mot de passe : votre-mdp-ftp
Port : 21
```

3. **Upload** :
- Connectez-vous à FileZilla
- Allez dans le dossier `www/` (ou `public_html/`)
- Supprimez les anciens fichiers (sauf .htaccess s'il existe)
- Glissez-déposez le contenu du dossier `dist/` ici

### Via OVH Manager (Web FTP)

1. Connectez-vous à https://www.ovh.com/manager
2. `Hébergement` → Votre hébergement → `FTP - SSH`
3. Cliquez sur `Web FTP` (Net2FTP)
4. Upload les fichiers

## ✅ Vérification

1. Allez sur `https://votredomaine.re`
2. Testez : Accueil → Boutique → Panier
3. Testez `/about` et `/admin` (mot de passe: `emerald2024`)

## 🆘 Problèmes fréquents

### Page blanche
- Vérifiez que `assets/` est bien uploadé
- Vérifiez les permissions (644 pour fichiers)

### Erreur 404 sur /boutique ou /admin
- Vérifiez que `.htaccess` est présent
- Rebuild et réupload

### Formulaire ne fonctionne pas
- Créez un compte Formspree (gratuit)
- Mettez à jour l'URL dans ContactPage.tsx
- Rebuild et réupload

---

## 🎯 Solution complète avec backend

Si vous voulez **toutes les fonctionnalités** (paiement Stripe, emails automatiques) :

1. **Déployez le frontend** sur OVH (ce guide)
2. **Déployez le backend** sur Render.com (gratuit)
3. **Connectez les deux** en modifiant `src/config/api.ts`

Voir `DEPLOY_OVH.md` pour la configuration complète avec backend.

---

## 📞 Aide OVH

- Documentation : https://docs.ovh.com/fr/hosting/
- Support : Espace client → Ticket
