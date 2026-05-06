@echo off
echo ==========================================
echo  DEPLOIEMENT OVH - EMERALD' BOUGIES
echo ==========================================
echo.
echo Ce script prepare les fichiers pour OVH
echo.
echo AVANT DE COMMENCER:
echo 1. Verifiez que vous avez un hebergement OVH
echo 2. Notez vos identifiants FTP (OVH Manager)
echo 3. Assurez-vous que votre domaine pointe vers OVH
echo.
pause

cd /d C:\Users\matthieu\Desktop\emerald-bougies

echo.
echo [1/4] Build du frontend...
npm run build
if %ERRORLEVEL% neq 0 (
    echo ERREUR: Le build a echoue
    pause
    exit /b 1
)

echo.
echo [2/4] Verification des fichiers...
if not exist "dist\index.html" (
    echo ERREUR: index.html manquant
    pause
    exit /b 1
)
if not exist "dist\.htaccess" (
    echo AVERTISSEMENT: .htaccess manquant - copie depuis public\
    copy "public\.htaccess" "dist\.htaccess"
)

echo.
echo [3/4] Preparation du package pour upload...
echo.
echo Fichiers prepares dans le dossier: dist\
echo.
echo Contenu:
dir dist\ /b | findstr /v "^	wc"
echo.

echo [4/4] Instructions pour l'upload:
echo ==========================================
echo.
echo 1. OUVREZ FileZilla ou un client FTP
echo.
echo 2. CONNECTEZ-VOUS a votre hebergement OVH:
echo    Hote: ftp.votredomaine.re (ou IP serveur)
echo    Identifiant: votre-login-ftp
echo    Mot de passe: votre-mdp-ftp
echo    Port: 21
echo.
echo 3. NAVIGUEZ dans le dossier: www/ ou public_html/
echo.
echo 4. SUPPRIMEZ les anciens fichiers (sauf .htaccess si present)
echo.
echo 5. Uploadez TOUS les fichiers du dossier dist\ actuel
echo.
echo ==========================================
echo.
echo IMPORTANT - Backend Node.js:
echo.
echo OVH mutualise NE SUPPORTE PAS Node.js
echo Pour les emails et paiement, utilisez:
echo.
echo Option A: Service externe (Formspree + Stripe Checkout)
echo Option B: Deployer le backend sur Render.com (gratuit)
echo.
echo Voir DEPLOY_OVH_BACKEND.md pour Option B
echo.
echo ==========================================
echo.

set /p upload="Avez-vous deja configure le backend? (o/n): "

if "%upload%"=="o" (
    echo.
    echo Parfait! Ouvrez FileZilla et uploadez le dossier dist\
    echo.
    echo URL finale: https://votredomaine.re
    echo.
    echo Pour le backend:
    echo Modifiez src/config/api.ts avec l'URL de votre backend
    echo puis rebuild et reupload.
) else (
    echo.
    echo Consultez DEPLOY_OVH_BACKEND.md pour configurer le backend
    echo ou utilisez DEPLOY_OVH_SIMPLE.md pour un site sans backend.
)

pause
