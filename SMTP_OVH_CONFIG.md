# Configuration SMTP OVH

## ✅ Mise à jour effectuée

La configuration SMTP a été mise à jour pour utiliser **OVH** :

```
Hôte:     smtp.mail.ovh.net
Port:     587
Sécurité: STARTTLS / TLS
Login:    contact@emerald-bougies.re
Password: VOTRE_MOT_DE_PASSE_OVH
```

## Fichiers modifiés

- `server/.env` - Configuration SMTP du serveur local

## Pour Netlify (déploiement)

Si vous déployez sur Netlify, ajoutez ces variables dans le dashboard :

| Variable | Valeur |
|----------|--------|
| `SMTP_HOST` | smtp.mail.ovh.net |
| `SMTP_PORT` | 587 |
| `SMTP_SECURE` | false |
| `SMTP_USER` | contact@emerald-bougies.re |
| `SMTP_PASS` | VOTRE_MOT_DE_PASSE_OVH |
| `CONTACT_TO` | contact@emerald-bougies.re |
| `SMTP_FROM` | contact@emerald-bougies.re |

## Pour OVH mutualisé (déploiement)

Sur un hébergement OVH mutualisé, vous ne pouvez pas exécuter Node.js.

**Solutions alternatives pour les emails :**

### Option 1: Formulaire de contact PHP
Créez un fichier `contact.php` sur OVH :
```php
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];
    
    $to = "contact@emerald-bougies.re";
    $headers = "From: $email";
    
    mail($to, $subject, $message, $headers);
    echo "OK";
}
?>
```

### Option 2: Service externe (Recommandé)
Utilisez **Formspree.io** (gratuit) ou **EmailJS** dans le frontend React.

### Option 3: Backend séparé
Déployez le backend Node.js sur **Render.com** (gratuit) et gardez le frontend sur OVH.

## 🔧 Test SMTP

Pour tester la configuration en local :

```bash
cd server
npm start
```

Puis envoyez un email via l'interface admin ou le formulaire de contact.

## ⚠️ Sécurité

Le mot de passe SMTP est stocké dans `.env` qui ne doit pas être commité dans Git.
(Le fichier est déjà dans `.gitignore`)

Pour le déploiement, utilisez les variables d'environnement du service d'hébergement.
