import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface ContactMessage {
  id: string
  date: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
}

export interface OrderItem {
  name: string
  qty: number
  price: number
  img: string
}

export interface Order {
  id: string
  date: string
  customer: string
  email: string
  phone: string
  address: string
  city: string
  zip: string
  country: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  tracking?: string
  notes?: string
}

const INITIAL_ORDERS: Order[] = []

interface AdminContextType {
  orders: Order[]
  stockOverrides: Record<number, boolean>
  priceOverrides: Record<number, number>
  messages: ContactMessage[]
  updateOrderStatus: (id: string, status: OrderStatus) => void
  updateTracking: (id: string, tracking: string) => void
  updateNotes: (id: string, notes: string) => void
  toggleStock: (id: number, inStock: boolean) => void
  updatePrice: (id: number, price: number) => void
  saveMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => void
  markRead: (id: string) => void
  deleteMessage: (id: string) => void
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => string
}

const AdminContext = createContext<AdminContextType | null>(null)

function loadLS<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(
    () => loadLS('admin_orders', INITIAL_ORDERS)
  )
  const [stockOverrides, setStockOverrides] = useState<Record<number, boolean>>(
    () => loadLS('admin_stock', {})
  )
  const [priceOverrides, setPriceOverrides] = useState<Record<number, number>>(
    () => loadLS('admin_prices', {})
  )
  const [messages, setMessages] = useState<ContactMessage[]>(
    () => loadLS('admin_messages', [])
  )

  const updateOrderStatus = (id: string, status: OrderStatus) =>
    setOrders(prev => {
      const next = prev.map(o => o.id === id ? { ...o, status } : o)
      localStorage.setItem('admin_orders', JSON.stringify(next))
      return next
    })

  const updateTracking = (id: string, tracking: string) =>
    setOrders(prev => {
      const next = prev.map(o => o.id === id ? { ...o, tracking } : o)
      localStorage.setItem('admin_orders', JSON.stringify(next))
      return next
    })

  const updateNotes = (id: string, notes: string) =>
    setOrders(prev => {
      const next = prev.map(o => o.id === id ? { ...o, notes } : o)
      localStorage.setItem('admin_orders', JSON.stringify(next))
      return next
    })

  const addOrder = (order: Omit<Order, 'id' | 'date' | 'status'>): string => {
    const newOrder: Order = {
      ...order,
      id: `EB-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      status: 'pending',
    }
    setOrders(prev => {
      const next = [newOrder, ...prev]
      localStorage.setItem('admin_orders', JSON.stringify(next))
      return next
    })
    return newOrder.id
  }

  const toggleStock = (id: number, inStock: boolean) => {
    const next = { ...stockOverrides, [id]: inStock }
    setStockOverrides(next)
    localStorage.setItem('admin_stock', JSON.stringify(next))
  }

  const updatePrice = (id: number, price: number) => {
    const next = { ...priceOverrides, [id]: price }
    setPriceOverrides(next)
    localStorage.setItem('admin_prices', JSON.stringify(next))
  }

  const saveMessage = (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `MSG-${Date.now()}`,
      date: new Date().toISOString(),
      read: false,
    }
    setMessages(prev => {
      const next = [newMsg, ...prev]
      localStorage.setItem('admin_messages', JSON.stringify(next))
      return next
    })
  }

  const markRead = (id: string) => {
    setMessages(prev => {
      const next = prev.map(m => m.id === id ? { ...m, read: true } : m)
      localStorage.setItem('admin_messages', JSON.stringify(next))
      return next
    })
  }

  const deleteMessage = (id: string) => {
    setMessages(prev => {
      const next = prev.filter(m => m.id !== id)
      localStorage.setItem('admin_messages', JSON.stringify(next))
      return next
    })
  }

  return (
    <AdminContext.Provider value={{ orders, stockOverrides, priceOverrides, messages, updateOrderStatus, updateTracking, updateNotes, toggleStock, updatePrice, saveMessage, markRead, deleteMessage, addOrder }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}

export function useProductStock(productId: number, baseInStock: boolean): boolean {
  const ctx = useContext(AdminContext)
  if (!ctx) return baseInStock
  return productId in ctx.stockOverrides ? ctx.stockOverrides[productId] : baseInStock
}

export function useProductPrice(productId: number, basePrice: number): number {
  const ctx = useContext(AdminContext)
  if (!ctx) return basePrice
  return productId in ctx.priceOverrides ? ctx.priceOverrides[productId] : basePrice
}
