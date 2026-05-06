# Déploiement sur OVH

## Prérequis

- Hébergement OVH mutualisé (Perso, Pro, ou Business)
- Accès FTP ou FileZilla
- Nom de domaine configuré chez OVH

## Étape 1: Préparer les fichiers

Le build est déjà prêt dans le dossier `dist/` avec :
- `index.html` (point d'entrée)
- `assets/` (CSS, JS)
- `logo.png`, `hero-bg.png`, etc. (images)
- `.htaccess` (configuration Apache pour React Router)

## Étape 2: Upload via FTP

### Méthode 1: FileZilla (Recommandé)

1. **Télécharger FileZilla** : https://filezilla-project.org

2. **Connexion FTP** (informations dans votre espace client OVH) :
   - Hôte : `ftp.votredomaine.re` (ou IP du serveur)
   - Identifiant : votre login FTP OVH
   - Mot de passe : votre mot de passe FTP
   - Port : 21

3. **Upload** :
   - Connectez-vous
   - Allez dans le dossier `www/` ou `public_html/`
   - **Supprimez tout le contenu existant** (sauf vous voulez garder des fichiers)
   - Glissez-déposez le contenu du dossier `dist/` ici

### Méthode 2: OVH Manager

1. Connectez-vous à https://www.ovh.com/manager
2. Allez dans : `Hébergement` → Votre hébergement → `FTP - SSH`
3. Utilisez le **Web FTP** (Net2FTP)
4. Upload les fichiers

## Étape 3: Vérifier l'installation

1. Accédez à votre domaine : `https://votredomaine.re`
2. Testez les routes :
   - `/boutique`
   - `/about`
   - `/admin` (mot de passe : `emerald2024`)

## Étape 4: Configuration du domaine

### Si vous utilisez un sous-domaine
Créez un dossier `emerald/` dans `www/` et upload le contenu de `dist/` dedans.

Accès : `https://votredomaine.re/emerald/`

### Pour le domaine principal
Upload directement dans `www/` ou `public_html/`

## ⚠️ Important : Pas de backend sur OVH mutualisé

Sur un hébergement OVH mutualisé, vous ne pouvez PAS exécuter Node.js.

### Solutions pour les fonctionnalités backend :

#### 1. Utiliser des services externes (Recommandé)

| Fonctionnalité | Service alternatif |
|----------------|-------------------|
| Paiement | Stripe Checkout (redirection) |
| Emails | Formspree.io ou EmailJS |
| Base de données | Firebase, Supabase |

#### 2. Hébergement Node.js séparé

Gardez le frontend sur OVH, mais le backend sur :
- **Render.com** (gratuit)
- **Railway.app** (gratuit)
- **Heroku** (payant)

Dans ce cas, modifiez les URLs API dans le frontend :
```javascript
// Au lieu de '/api/...'
const API_URL = 'https://votre-backend.onrender.com';
```

## 🔧 Configuration spéciale OVH

### SSL (HTTPS)
Dans OVH Manager : `Hébergement` → Votre hébergement → `SSL` → Activez le certificat gratuit Let's Encrypt

### PHP (si besoin d'un formulaire de contact simple)
OVH supporte PHP. Vous pouvez créer un simple `contact.php` pour recevoir les messages par email.

### Redirections
Le fichier `.htaccess` dans `dist/` gère déjà les redirections React Router.

## 📝 Récapitulatif

```
Fichiers à uploader sur OVH (dossier www/):
├── .htaccess          ← Configuration Apache
├── index.html         ← Page principale
├── assets/            ← CSS et JS compilés
│   ├── index-xxx.css
│   └── index-xxx.js
├── logo.png           ← Images
├── hero-bg.png
└── [autres images...]
```

## 🆘 Dépannage

### Erreur 500
- Vérifiez que `.htaccess` est bien uploadé
- ModRewrite doit être activé chez OVH (activé par défaut)

### Erreur 404 sur les sous-pages
- Le fichier `.htaccess` est obligatoire pour React Router
- Rebuild et réupload si problème persiste

### Site blanc / vide
- Vérifiez que tous les fichiers dans `dist/` sont uploadés
- Vérifiez les permissions des fichiers (644 pour fichiers, 755 pour dossiers)

---

## ✅ Checklist avant mise en ligne

- [ ] Build réussi (`npm run build`)
- [ ] Fichier `.htaccess` présent dans `dist/`
- [ ] Tous les fichiers uploadés sur OVH via FTP
- [ ] HTTPS activé (SSL Let's Encrypt)
- [ ] Test des routes principales
- [ ] Test du panier et paiement (mode test Stripe)

---

## 📞 Support OVH

- Documentation : https://docs.ovh.com/fr/hosting/
- Assistance : Espace client OVH → Créer un ticket
- Communauté : https://community.ovh.com
