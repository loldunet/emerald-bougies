import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import './app.css'
import App from './App'
import { API_URL } from './config/api'

// Ping le backend toutes les 10 min pour éviter le cold start Render
const keepAlive = () => fetch(`${API_URL.replace('/api', '')}/health`).catch(() => {})
keepAlive()
setInterval(keepAlive, 10 * 60 * 1000)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
