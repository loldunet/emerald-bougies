# Configuration Formulaire Contact - Formspree

## 🎯 Objectif
Envoyer les emails de contact **sans backend Node.js** directement via un service externe.

---

## 📋 Étapes de configuration

### 1. Créer un compte Formspree

1. Allez sur **https://formspree.io**
2. Cliquez sur **"Sign Up"** (gratuit)
3. Utilisez votre email : `contact@emerald-bougies.re`
4. Validez votre compte via l'email reçu

---

### 2. Créer un nouveau formulaire

1. Connectez-vous à Formspree
2. Cliquez sur **"+ New Form"**
3. Donnez un nom : `Emerald Bougies - Contact`
4. Cliquez sur **"Create Form"**

---

### 3. Récupérer l'ID du formulaire

Formspree vous donne une URL comme :
```
https://formspree.io/f/xnqkvnzp
```

**L'ID est** : `xnqkvnzp` (exemple)

---

### 4. Configurer le fichier ContactPage.tsx

Ouvrez `src/pages/ContactPage.tsx` et remplacez :

```typescript
const FORMSPREE_ID = 'votre-id-formspree'
```

Par votre vrai ID :

```typescript
const FORMSPREE_ID = 'xnqkvnzp'  // Votre ID Formspree
```

---

### 5. Configurer l'email de destination

Dans le dashboard Formspree :
1. Cliquez sur votre formulaire
2. Allez dans **"Settings"** ou **"Integrations"**
3. Ajoutez votre email : `contact@emerald-bougies.re`
4. Activez les notifications par email

---

### 6. Rebuild et déployer

```bash
npm run build
```

Uploadez le dossier `dist/` sur OVH.

---

## ✅ Fonctionnement

| Étape | Description |
|-------|-------------|
| 1 | Client remplit le formulaire |
| 2 | Formulaire envoie à **Formspree.io** |
| 3 | Formspree reçoit les données |
| 4 | Formspree envoie l'email à **contact@emerald-bougies.re** |
| 5 | Vous recevez l'email avec toutes les infos |

---

## 📧 Exemple d'email reçu

```
From: client@email.com
Subject: [Emerald Bougies] Question produit

Nom: Marie Dupont
Email: marie@email.com
Sujet: Question produit
Message: Bonjour, j'aimerais savoir si...
```

---

## 🆘 Problèmes courants

### "Erreur lors de l'envoi"
- Vérifiez que l'ID Formspree est correct
- Vérifiez votre connexion internet

### Email non reçu
- Vérifiez les spams
- Vérifiez dans le dashboard Formspree que le formulaire est actif
- Vérifiez que l'email de notification est bien configuré

### ID incorrect
- L'ID doit être sans espaces
- Format : `https://formspree.io/f/VOTRE-ID`

---

## 💡 Avantages

| Avantage | Description |
|----------|-------------|
| ✅ Gratuit | 50 soumissions/mois gratuit |
| ✅ Simple | Pas de backend Node.js nécessaire |
| ✅ Fiable | Service professionnel dédié |
| ✅ Rapide | Emails reçus instantanément |
| ✅ Compatible OVH | Fonctionne sur tout hébergement |

---

## 🔗 Liens utiles

- **Formspree** : https://formspree.io
- **Dashboard** : https://formspree.io/forms
- **Documentation** : https://help.formspree.io

---

**Le formulaire de contact fonctionnera sur OVH sans serveur Node.js !** 🎉
