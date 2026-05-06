# 🚀 Déploiement Emerald' Bougies

## Problème Netlify
Le site a été suspendu pour dépassement de quota. Passons à **Vercel**.

## Option 1: Vercel CLI (Rapide)

### Étape 1: Créer un compte
1. Allez sur https://vercel.com/signup
2. Inscrivez-vous avec GitHub (plus simple)

### Étape 2: Installer Vercel CLI
```bash
npm i -g vercel
```

### Étape 3: Déployer
```bash
npx vercel --prod
```

Ou double-cliquez sur `DEPLOY_VERCEL.ps1`

---

## Option 2: GitHub + Vercel (Recommandé)

### Avantage
- Déploiement automatique à chaque commit
- Rollback facile
- Gratuit illimité pour sites statiques

### Étapes

1. **Créer un repo GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USER/emerald-bougies.git
   git push -u origin main
   ```

2. **Importer dans Vercel**
   - Allez sur https://vercel.com/new
   - Importez depuis GitHub
   - Framework: `Other` (ou laissez détecter)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Cliquez **Deploy**

3. **Configuration automatique**
   Vercel détectera `vercel.json` pour les redirections SPA.

---

## Configuration des variables (Important!)

Dans Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_STRIPE_PUBLIC_KEY = pk_test_51TP2pO2eMmqDtA7MJKuG0AwCX2HOXmwL5NM1YIesKVJVqZYwUrbXvnxkZ9hL6SCYAL6QrrIZ22PG1MR8yRJuIvmK00QFK0X5Yh
```

---

## Alternative: Surge.sh (Ultra simple)

Si Vercel ne fonctionne pas:

```bash
npm install -g surge
surge dist/ emerald-bougies.surge.sh
```

---

## 🔥 Solution immédiate

**Utilisez Surge.sh** (le plus simple):
```bash
npx surge dist/ emerald-bougies.surge.sh
```

Site sera live en 10 secondes sur: `https://emerald-bougies.surge.sh`
