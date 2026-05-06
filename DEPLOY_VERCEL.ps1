# Script de déploiement Vercel pour Emerald' Bougies
# Plus fiable que Netlify pour React

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  DEPLOIEMENT EMERALD' BOUGIES - VERCEL" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier dist
if (-not (Test-Path "dist\index.html")) {
    Write-Host "⚠️  Build requis..." -ForegroundColor Yellow
    npm run build
}

Write-Host "✅ Build prêt" -ForegroundColor Green

# Instructions
Write-Host ""
Write-Host "🔧 Deux options:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Option 1 - CLI Vercel (Automatique):" -ForegroundColor Green
Write-Host "      1. Allez sur https://vercel.com/signup" -ForegroundColor Gray
Write-Host "      2. Créez un compte avec GitHub" -ForegroundColor Gray
Write-Host "      3. Exécutez: npx vercel --prod" -ForegroundColor Gray
Write-Host ""
Write-Host "   Option 2 - GitHub + Vercel (Recommandé):" -ForegroundColor Green
Write-Host "      1. Créez un repo sur GitHub" -ForegroundColor Gray
Write-Host "      2. Poussez votre code" -ForegroundColor Gray
Write-Host "      3. Importez dans Vercel (déploiement auto)" -ForegroundColor Gray
Write-Host ""

# Proposer l'exécution automatique
$reponse = Read-Host "Voulez-vous lancer 'npx vercel --prod' maintenant? (o/n)"

if ($reponse -eq "o" -or $reponse -eq "O") {
    Write-Host ""
    Write-Host "🚀 Lancement du déploiement Vercel..." -ForegroundColor Green
    npx vercel --prod
} else {
    Write-Host ""
    Write-Host "Pour déployer plus tard:" -ForegroundColor Yellow
    Write-Host "   npx vercel --prod" -ForegroundColor Cyan
}

Read-Host "`nAppuyez sur Entrée pour fermer"
