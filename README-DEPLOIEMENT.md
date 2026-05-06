# 🚀 Guide de Déploiement - Emerald' Bougies

## 📋 Récapitulatif des solutions

| Solution | Frontend | Backend | Emails | Difficulté | Coût |
|----------|----------|---------|--------|------------|------|
| **OVH + Render** ⭐ | OVH | Render.com | OVH SMTP | ⭐⭐ Moyen | Gratuit |
| **Netlify** | Netlify | Netlify Functions | OVH SMTP | ⭐ Facile | Gratuit* |
| **Vercel** | Vercel | Vercel Functions | OVH SMTP | ⭐ Facile | Gratuit |
| **OVH Simple** | OVH | ❌ Non | Formspree | ⭐ Facile | Gratuit |
| **Surge.sh** | Surge | ❌ Non | Formspree | ⭐ Facile | Gratuit |

*Netlify limité sans compte vérifié

---

## 🎯 Solution Recommandée : OVH + Render

### Pourquoi cette solution ?
✅ Votre domaine sur OVH (emerald-bougies.re)  
✅ Backend Node.js fonctionnel (paiement, emails)  
✅ Emails via OVH SMTP (déjà configuré)  
✅ Gratuit pour démarrer  
✅ Performances optimales (OVH Europe + Render EU)

### Les 3 étapes

```
Étape 1: Déployer backend sur Render.com (15 min)
         ↓
Étape 2: Configurer API_URL dans src/config/api.ts
         ↓
Étape 3: Build + Upload frontend sur OVH (10 min)
```

### Fichiers de déploiement

| Fichier | Description |
|---------|-------------|
| `DEPLOY_OVH_BACKEND.md` | Guide complet OVH + Render |
| `DEPLOY_OVH_COMPLETE.bat` | Script de préparation |
| `src/config/api.ts` | Configuration API (à modifier) |
| `SMTP_OVH_CONFIG.md` | Config SMTP (déjà fait) |

---

## 🚀 Lancer le déploiement

### Option A: OVH + Render (Complet)

1. **Double-cliquez sur** `DEPLOY_OVH_COMPLETE.bat`
2. Suivez les instructions pour Render
3. Modifiez `src/config/api.ts` avec votre URL Render
4. Rebuild et upload sur OVH

### Option B: Déploiement Rapide (Sans backend)

Si vous voulez juste le site vitrine rapidement :

1. **Surge.sh** : Double-cliquez `DEPLOY_SURGE.bat`
2. **OVH Simple** : Suivez `DEPLOY_OVH_SIMPLE.md`

---

## ⚙️ Configuration SMTP (Déjà Fait ✓)

La configuration OVH SMTP est en place :
- Hôte: `smtp.mail.ovh.net:587`
- Login: `contact@emerald-bougies.re`

**Pour Render** : Ajoutez ces variables dans le dashboard Render.

---

## 🆘 Aide par étape

### Je n'ai pas encore de backend
→ Suivez `DEPLOY_OVH_BACKEND.md` Étape 1

### Je ne sais pas quel API_URL mettre
→ Déployez d'abord le backend sur Render, copiez l'URL, puis modifiez `src/config/api.ts`

### Je ne sais pas utiliser FileZilla
→ Utilisez le Web FTP dans OVH Manager (moins rapide mais plus simple)

### Je veux juste tester rapidement
→ Utilisez `DEPLOY_SURGE.bat` (site en ligne en 2 minutes)

---

## 📞 Besoin d'aide ?

Les guides détaillés sont dans :
- `DEPLOY_OVH_BACKEND.md` - Solution complète
- `DEPLOY_OVH_SIMPLE.md` - Site statique uniquement
- `SMTP_OVH_CONFIG.md` - Configuration email

---

## 🎉 C'est parti !

Quelle solution voulez-vous utiliser ?

**A.** OVH + Render (Complet avec emails et paiement)  
**B.** OVH Simple (Site vitrine uniquement)  
**C.** Surge.sh (Test rapide)  

Double-cliquez sur le fichier correspondant !
