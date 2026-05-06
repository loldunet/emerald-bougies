import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AdminProvider } from './context/AdminContext'
import SplashScreen from './components/SplashScreen'
import AdminPage from './pages/AdminPage'
import GlitterCanvas from './components/GlitterCanvas'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CollectionsPage from './pages/CollectionsPage'
import CoffretsPage from './pages/CoffretsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import CheckoutPage from './pages/CheckoutPage'
import AvisPage from './pages/AvisPage'
import FaqPage from './pages/FaqPage'
import MentionsLegalesPage from './pages/MentionsLegalesPage'
import LivraisonPage from './pages/LivraisonPage'

export default function App() {
  const [splash, setSplash] = useState(true)

  if (splash) return <SplashScreen onDone={() => setSplash(false)} />

  return (
    <AdminProvider>
    <CartProvider>
      <GlitterCanvas />
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/boutique" element={<ShopPage />} />
                <Route path="/produit/:id" element={<ProductDetailPage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/coffrets" element={<CoffretsPage />} />
                <Route path="/a-propos" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/avis" element={<AvisPage />} />
                <Route path="/livraison" element={<LivraisonPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </CartProvider>
    </AdminProvider>
  )
}
