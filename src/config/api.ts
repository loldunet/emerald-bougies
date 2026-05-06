// Configuration API pour Emerald' Bougies
//
// === OPTION 1: OVH + Render (RECOMMANDE) ===
// Frontend sur OVH, Backend sur Render.com
// Decommentez la ligne ci-dessous et mettez votre URL Render:
// export const API_URL = 'https://emerald-bougies-api.onrender.com/api'
//
// === OPTION 2: Local / Netlify / Vercel (Backend + Frontend ensemble) ===
// export const API_URL = '/api'
//
// === OPTION 3: OVH uniquement (Sans backend Node.js) ===
// Emails via EmailJS (contact + factures). Voir CONFIG_EMAILJS.md

// Configuration actuelle - MODIFIEZ ICI selon votre deploiement:
export const API_URL = '/api'

// Helper pour construire les URLs d'API
export const apiUrl = (endpoint: string) => `${API_URL}${endpoint}`

// Note: Pour OVH + Render, suivez le guide DEPLOY_OVH_BACKEND.md
