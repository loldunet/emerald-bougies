# Script de déploiement Netlify pour Emerald' Bougies
# Usage: Ouvrir PowerShell et exécuter: .\DEPLOY.ps1

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  DEPLOIEMENT EMERALD' BOUGIES - NETLIFY" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si on est dans le bon dossier
if (-not (Test-Path "dist")) {
    Write-Host "❌ Le dossier 'dist' n'existe pas. Lancement du build..." -ForegroundColor Red
    npm run build
}

Write-Host "✅ Dossier dist trouvé" -ForegroundColor Green

# Demander le token Netlify
Write-Host ""
Write-Host "🔑 Pour obtenir un token Netlify:" -ForegroundColor Yellow
Write-Host "   1. Allez sur https://app.netlify.com/user/applications" -ForegroundColor Gray
Write-Host "   2. Cliquez 'New access token'" -ForegroundColor Gray
Write-Host "   3. Copiez le token (commence par nfp_...)" -ForegroundColor Gray
Write-Host ""

$token = Read-Host "Entrez votre token Netlify"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "❌ Token requis. Annulation." -ForegroundColor Red
    exit 1
}

# Configurer le token
$env:NETLIFY_AUTH_TOKEN = $token

Write-Host ""
Write-Host "🚀 Lancement du déploiement..." -ForegroundColor Green

# Déployer
try {
    npx netlify deploy --prod --dir=dist --name=emerald-bougies-reunion 2>&1 | ForEach-Object {
        if ($_ -match "URL:|Site:|Deploy") {
            Write-Host $_ -ForegroundColor Green
        } else {
            Write-Host $_
        }
    }
    
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "  ✅ DEPLOIEMENT TERMINE!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔧 N'oubliez pas de configurer les variables" -ForegroundColor Yellow
    Write-Host "   d'environnement sur Netlify:" -ForegroundColor Yellow
    Write-Host "   Site Settings → Environment Variables" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "❌ Erreur lors du déploiement: $_" -ForegroundColor Red
}

Write-Host ""
Read-Host "Appuyez sur Entrée pour fermer"
