@echo off
echo ==========================================
echo  DEPLOIEMENT EMERALD' BOUGIES - NETLIFY
echo ==========================================
echo.

cd /d C:\Users\matthieu\Desktop\emerald-bougies

echo [1/3] Build du projet...
npm run build
if %ERRORLEVEL% neq 0 (
    echo ERREUR: Le build a echoue
    pause
    exit /b 1
)

echo.
echo [2/3] Installation du CLI Netlify...
npm install -g netlify-cli

echo.
echo [3/3] Deploiement...
echo.
echo Si c'est la premiere fois, vous devez vous authentifier:
echo 1. Executez: npx netlify login
echo 2. Puis executez: npx netlify deploy --prod --dir=dist
echo.
echo Ou pour un deploiement anonyme temporaire:
echo npx netlify deploy --allow-anonymous --dir=dist --prod
echo.

npx netlify deploy --prod --dir=dist

pause
