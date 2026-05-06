# Configuration EmailJS - Envoi de factures aux clients

## Pourquoi EmailJS ?
Formspree envoie toujours à VOTRE email (admin).
EmailJS permet d'envoyer à N'IMPORTE quelle adresse (le client).
**Gratuit : 200 emails/mois**

---

## Étape 1 : Créer un compte EmailJS

1. Allez sur **https://www.emailjs.com**
2. Cliquez **"Sign Up Free"**
3. Créez votre compte

---

## Étape 2 : Ajouter votre service OVH SMTP

1. Dans le dashboard → **"Email Services"**
2. Cliquez **"Add New Service"**
3. Choisissez **"Custom SMTP"** (pour OVH)
4. Configurez :
   - **Name** : `OVH Emerald Bougies`
   - **Host** : `smtp.mail.ovh.net`
   - **Port** : `587`
   - **Username** : `contact@emerald-bougies.re`
   - **Password** : `VOTRE_MOT_DE_PASSE_OVH`
5. Cliquez **"Add Service"**
6. Notez le **Service ID** (ex: `service_abc123`)

---

## Étape 3 : Créer le template de facture

1. Dans le dashboard → **"Email Templates"**
2. Cliquez **"Create New Template"**
3. Configurez :
   - **Template Name** : `Facture Client`
   - **Subject** : `[Emerald Bougies] Votre facture {{order_id}}`
   - **To Email** : `{{to_email}}`
   - **From Name** : `Emerald' Bougies`
   - **Reply To** : `{{reply_to}}`

4. **Contenu du template** (copier-coller) :

```
Bonjour {{to_name}},

Veuillez trouver ci-dessous le récapitulatif de votre commande.

═══════════════════════════════
           FACTURE
═══════════════════════════════

N° Commande : {{order_id}}
Date        : {{order_date}}
Statut      : {{order_status}}

ARTICLES COMMANDÉS :
{{order_items}}

───────────────────────────────
TOTAL : {{order_total}} €
───────────────────────────────

ADRESSE DE LIVRAISON :
{{order_address}}

Numéro de suivi : {{order_tracking}}

═══════════════════════════════

Merci pour votre confiance !

Emerald' Bougies
28 rue du Tampon, 97430 La Réunion
📞 0693 53 29 40
✉️ contact@emerald-bougies.re
```

5. Cliquez **"Save"**
6. Notez le **Template ID** (ex: `template_xyz456`)

---

## Étape 4 : Récupérer la clé publique

1. Dans le dashboard → **"Account"** → **"General"**
2. Copiez votre **Public Key** (ex: `AbCdEfGhIjKlMnOpQrSt`)

---

## Étape 5 : Configurer AdminPage.tsx

Ouvrez `src/pages/AdminPage.tsx` et remplacez lignes 607-609 :

```typescript
const EMAILJS_SERVICE_ID = 'service_abc123'     // Votre Service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz456'   // Votre Template ID
const EMAILJS_PUBLIC_KEY = 'AbCdEfGhIjKlMnOp'  // Votre Public Key
```

---

## Étape 6 : Rebuild et déployer

```bash
npm run build
```

Uploadez `dist/` sur OVH.

---

## ✅ Résultat

Quand vous cliquez **"Envoyer par email"** dans l'admin Facturation :
- ✅ L'email est envoyé **directement au client** (ex: `client@gmail.com`)
- ✅ Le client reçoit sa facture complète
- ✅ Fonctionne sur OVH sans backend Node.js

---

## Variables disponibles dans le template

| Variable | Valeur |
|----------|--------|
| `{{to_email}}` | Email du client |
| `{{to_name}}` | Nom du client |
| `{{order_id}}` | N° commande |
| `{{order_date}}` | Date de la commande |
| `{{order_status}}` | Statut (Livré, En cours...) |
| `{{order_items}}` | Liste des articles |
| `{{order_total}}` | Total en € |
| `{{order_address}}` | Adresse livraison |
| `{{order_tracking}}` | N° de suivi |
| `{{reply_to}}` | contact@emerald-bougies.re |
