# Déploiement Netlify via CLI (Authentifié)

## Étape 1: Créer un compte Netlify
1. Allez sur https://www.netlify.com
2. Inscrivez-vous avec GitHub, GitLab ou email
3. Confirmez votre email

## Étape 2: Obtenir un Personal Access Token
1. Connectez-vous à Netlify
2. Allez sur: https://app.netlify.com/user/applications
3. Cliquez sur "New access token"
4. Donnez un nom (ex: "Windsurf Deploy")
5. Copiez le token (commence par `nfp_...`)

## Étape 3: Déployer avec le token

Dans un terminal PowerShell, exécutez:

```powershell
# 1. Aller dans le projet
cd C:\Users\matthieu\Desktop\emerald-bougies

# 2. Installer netlify-cli
npm install -g netlify-cli

# 3. Se connecter avec le token
$env:NETLIFY_AUTH_TOKEN = "VOTRE_TOKEN_ICI"
npx netlify deploy --prod --dir=dist --site=emerald-bougies-reunion
```

Ou utilisez ce script automatique:

## Script PowerShell Automatique

```powershell
# DEPLOY.ps1
$token = Read-Host "Entrez votre token Netlify (nfp_xxxx)"
$env:NETLIFY_AUTH_TOKEN = $token

Write-Host "Build du projet..." -ForegroundColor Green
npm run build

Write-Host "Deploiement sur Netlify..." -ForegroundColor Green
npx netlify deploy --prod --dir=dist --name=emerald-bougies-shop

Write-Host "Termine!" -ForegroundColor Green
```

## Étape 4: Configurer les variables d'environnement

Dans Netlify (app.netlify.com → votre site → Site settings → Environment variables):

```
# Stripe supprimé - non utilisé
SMTP_HOST = smtp-relay.brevo.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = a8f5fe001@smtp-brevo.com
SMTP_PASS = 3hUWqzSFJ8dnAmkv
CONTACT_TO = contact@emerald-bougies.re
SMTP_FROM = contact@emerald-bougies.re
```

## Alternative: GitHub + Netlify (Recommandé)

1. Créez un repo sur GitHub
2. Poussez le code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USER/emerald-bougies.git
git push -u origin main
```

3. Dans Netlify: "Add new site" → "Import an existing project"
4. Connectez GitHub et sélectionnez le repo
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Ajoutez les variables d'environnement
8. Déploiement automatique à chaque push!
