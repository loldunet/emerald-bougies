import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../data/products'

export interface CartItem {
  product: Product
  qty: number
  scent: string
}

interface CartContextType {
  items: CartItem[]
  wishlist: number[]
  cartOpen: boolean
  addToCart: (product: Product, scent: string, qty?: number) => void
  removeFromCart: (id: number) => void
  updateQty: (id: number, qty: number) => void
  toggleWishlist: (id: number) => void
  setCartOpen: (v: boolean) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  const addToCart = (product: Product, scent: string, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.scent === scent)
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.scent === scent
            ? { ...i, qty: i.qty + qty }
            : i
        )
      }
      return [...prev, { product, qty, scent }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (id: number) =>
    setItems(prev => prev.filter(i => i.product.id !== id))

  const updateQty = (id: number, qty: number) => {
    if (qty < 1) return removeFromCart(id)
    setItems(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i))
  }

  const toggleWishlist = (id: number) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const clearCart = () => setItems([])

  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, wishlist, cartOpen, addToCart, removeFromCart, updateQty, toggleWishlist, setCartOpen, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
