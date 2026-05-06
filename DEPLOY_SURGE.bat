@echo off
echo ==========================================
echo  DEPLOIEMENT SURGE.SH - EMERALD BOUGIES
echo ==========================================
echo.
echo Surge.sh = Hebergement gratuit ultra simple
echo.
echo Instructions:
echo 1. Entrez votre email (ou un faux email)
echo 2. Creez un mot de passe
echo 3. Confirmez le domaine: emerald-bougies.surge.sh
echo.
echo Le site sera live en 10 secondes!
echo.
pause

cd /d C:\Users\matthieu\Desktop\emerald-bougies
npx surge dist/ --domain emerald-bougies.surge.sh

pause
