# ✅ Configuration Emails - OVH SMTP Connecté

## 📧 SMTP OVH Connecté

**Configuration active :**
```
Hôte:     smtp.mail.ovh.net
Port:     587
Sécurité: STARTTLS
Login:    contact@emerald-bougies.re
```

**Fichier:** `server/.env` (déjà configuré)

---

## 📨 Types d'emails automatiques

### 1. Confirmation de commande
**Déclencheur:** Paiement réussi  
**Template:** HTML avec détails de la commande  
**Endpoint:** `POST /api/send-order-confirmation`

**Contenu:**
- Logo Emerald Bougies
- Numéro de commande
- Liste des produits (image, nom, quantité, prix)
- Total avec frais de livraison
- Adresse de livraison
- Message de remerciement

### 2. Email de statut "En préparation"
**Déclencheur:** Statut changé à "processing" dans l'admin  
**Template:** HTML premium  
**Endpoint:** `POST /api/send-status-update`

**Contenu:**
- 🕯️ Header Emerald Bougies
- Message personnalisé avec prénom
- Info: "Votre commande est en préparation dans notre atelier"
- Explication du processus artisanal
- Promesse d'email d'expédition

### 3. Email de statut "Expédiée"
**Déclencheur:** Statut changé à "shipped" dans l'admin  
**Template:** HTML avec numéro de suivi  
**Endpoint:** `POST /api/send-status-update`

**Contenu:**
- 🚚 Notification d'expédition
- Numéro de suivi Colissimo/La Poste
- Bouton "Suivre mon colis" (lien direct)
- Délai de livraison estimé

### 4. Email de statut "Livrée"
**Déclencheur:** Statut changé à "delivered" dans l'admin  
**Template:** HTML de remerciement  
**Endpoint:** `POST /api/send-status-update`

**Contenu:**
- ✅ Confirmation de livraison
- Message de satisfaction
- Demande d'avis/review
- Message "Allumez votre bougie..."

### 5. Réponse aux messages contact
**Déclencheur:** Réponse admin dans l'interface  
**Template:** HTML avec message original cité  
**Endpoint:** `POST /api/send-reply`

**Contenu:**
- Réponse personnalisée
- Citation du message original
- Signature Emerald Bougies

---

## 🎨 Design des emails

Tous les emails utilisent le **design premium Emerald Bougies** :

- 🎨 **Couleurs:**
  - Fond: `#0d0d0d` (noir profond)
  - Or/Accent: `#c9a84c` (doré)
  - Texte: `#f5e6c8` (crème)
- 🔤 **Police:** Georgia pour les titres, Arial pour le corps
- 📐 **Layout:** Max-width 600px, responsive
- ✨ **Style:** Élégant, luxe, bougies

---

## 🚀 Comment utiliser

### En local (test)
```bash
cd server
npm start
```

Puis:
1. Passez une commande test → Email de confirmation
2. Allez dans `/admin` (mot de passe: `emerald2024`)
3. Changez le statut d'une commande → Email automatique

### En production (OVH + Render)
1. Déployez le backend sur Render avec les variables OVH SMTP
2. Déployez le frontend sur OVH
3. Tous les emails partiront via OVH SMTP

---

## 📋 Récapitulatif des envois automatiques

| Action | Email envoyé | Template |
|--------|--------------|----------|
| Commande payée | ✅ Confirmation | HTML commande |
| Statut → Processing | ✅ Préparation | HTML statut bleu |
| Statut → Shipped | ✅ Expédition | HTML statut violet + suivi |
| Statut → Delivered | ✅ Livraison | HTML statut vert |
| Réponse admin | ✅ Réponse | HTML avec citation |

---

## ⚠️ Important

**Avant mise en production, vérifiez:**
- [ ] SMTP OVH fonctionne (testez avec un email)
- [ ] Les variables d'environnement sont sur Render
- [ ] L'email `contact@emerald-bougies.re` est actif chez OVH

**Test rapide:**
1. Remplissez le formulaire contact
2. Vérifiez que l'email arrive sur `contact@emerald-bougies.re`

---

## 🔧 Dépannage

### Emails ne partent pas
1. Vérifiez les logs du serveur
2. Vérifiez le mot de passe SMTP
3. Testez la connexion OVH SMTP

### Emails dans spam
- Le design HTML est optimisé
- L'expéditeur est `contact@emerald-bougies.re`
- Demandez aux clients d'ajouter à leurs contacts

---

**✅ Tout est configuré ! Les emails partiront automatiquement.**
