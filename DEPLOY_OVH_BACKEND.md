# Déploiement OVH + Backend Render (Solution Complète)

Cette solution permet d'avoir :
- ✅ Frontend sur OVH (votre domaine)
- ✅ Backend Node.js sur Render.com (gratuit)
- ✅ Emails via OVH SMTP (configuration déjà faite)
- ✅ Paiement Stripe fonctionnel

## Architecture

```
Utilisateur
    ↓
OVH (Frontend React) ←→ Render.com (Backend Node.js)
    ↓                        ↓
votredomaine.re     ←→   emerald-api.onrender.com
```

## Étape 1: Déployer le Backend sur Render.com

### 1.1 Créer un compte Render
1. Allez sur https://render.com
2. Inscrivez-vous avec GitHub (plus simple)
3. Vérifiez votre email

### 1.2 Créer un Web Service
1. Dans le dashboard Render, cliquez **New** → **Web Service**
2. Connectez votre compte GitHub
3. Créez un nouveau repository ou utilisez celui existant

### 1.3 Configuration du service
```
Name: emerald-bougies-api
Region: Frankfurt (EU) - plus proche de La Réunion
Branch: main
Runtime: Node
Build Command: cd server && npm install
Start Command: cd server && npm start
Plan: Free
```

### 1.4 Variables d'environnement (Important!)
Dans Render Dashboard → votre service → **Environment**:

```
# SMTP OVH
SMTP_HOST=smtp.mail.ovh.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@emerald-bougies.re
SMTP_PASS=VOTRE_MOT_DE_PASSE_OVH
CONTACT_TO=contact@emerald-bougies.re
SMTP_FROM=contact@emerald-bougies.re

PORT=10000
```

### 1.5 Déployer
Cliquez **Create Web Service**

Attendez la fin du déploiement (2-3 minutes).

**URL obtenue** : `https://emerald-bougies-api.onrender.com`

---

## Étape 2: Connecter Frontend et Backend

### 2.1 Mettre à jour la configuration API
Modifiez `src/config/api.ts` :

```typescript
// URL de votre backend Render
export const API_URL = 'https://emerald-bougies-api.onrender.com/api'

export const apiUrl = (endpoint: string) => `${API_URL}${endpoint}`
```

### 2.2 Rebuild le frontend
```bash
cd C:\Users\matthieu\Desktop\emerald-bougies
npm run build
```

---

## Étape 3: Déployer sur OVH

### 3.1 Upload via FTP
1. Ouvrez FileZilla
2. Connectez-vous à OVH (ftp.votredomaine.re)
3. Allez dans le dossier `www/`
4. Supprimez les anciens fichiers
5. Uploadez le contenu de `dist/`

### 3.2 Vérifier le site
- Accédez à `https://votredomaine.re`
- Testez le formulaire de contact
- Testez une commande (mode test Stripe)

---

## Étape 4: Configuration DNS (si nécessaire)

### Si vous utilisez un sous-domaine pour l'API
Exemple : `api.votredomaine.re` → Render

Dans OVH Manager (Domaines → votre domaine → DNS Zone) :
```
Type: CNAME
Nom: api
Cible: emerald-bougies-api.onrender.com
```

Attendez 24h pour la propagation DNS.

---

## ⚠️ Limitations Render (Plan Gratuit)

| Limitation | Solution |
|------------|----------|
| Spin down après 15 min d'inactivité | Premier accès lent (15 sec), puis rapide |
| 512 MB RAM | Suffisant pour ce projet |
| 100 GB bandwidth/mois | Suffisant pour démarrer |

Pour éviter le spin down, vous pouvez utiliser un service de ping gratuit :
- https://uptimerobot.com (ping toutes les 5 minutes)

---

## 🔧 Script Automatique

Créez `update-frontend.bat` pour mettre à jour rapidement :

```batch
@echo off
cd C:\Users\matthieu\Desktop\emerald-bougies

echo Build...
npm run build

echo.
echo Upload avec FileZilla manuellement:
echo Hote: ftp.votredomaine.re
echo Dossier: www/
echo.
pause
```

---

## ✅ Checklist Finale

- [ ] Backend déployé sur Render (URL obtenue)
- [ ] Variables d'environnement configurées sur Render
- [ ] `src/config/api.ts` mis à jour avec URL Render
- [ ] Frontend rebuild (`npm run build`)
- [ ] Frontend uploadé sur OVH via FTP
- [ ] Test formulaire contact → Email reçu sur contact@emerald-bougies.re
- [ ] Test paiement Stripe → Succès
- [ ] Test email statut commande → Fonctionnel

---

## 🆘 Dépannage

### Le backend ne répond pas
- Vérifiez les logs dans Render Dashboard
- Vérifiez que `PORT=10000` est défini
- Redéployez si nécessaire

### Emails ne partent pas
- Vérifiez les identifiants SMTP OVH
- Testez avec le backend local d'abord
- Vérifiez les logs Render

### CORS errors
- Le backend est déjà configuré avec CORS
- Vérifiez que l'URL du frontend est correcte

### Frontend ne trouve pas l'API
- Vérifiez `src/config/api.ts`
- Rebuild et reupload
- Vérifiez l'URL dans la console du navigateur

---

## 📞 Support

- **Render** : https://render.com/docs
- **OVH** : https://docs.ovh.com/fr/hosting/
- **OVH SMTP** : https://docs.ovh.com/fr/emails/
