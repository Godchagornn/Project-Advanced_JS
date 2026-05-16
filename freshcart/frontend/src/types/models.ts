export type ProductCategory = 'fruits' | 'vegetables' | 'herbs'
export type ProductUnit = 'kg' | 'g' | 'piece' | 'bunch'
export type PaymentMethod = 'cash' | 'card'
export type OrderStatus = 'pending' | 'confirmed' | 'delivered'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  pricePerUnit: number
  unit: ProductUnit
  imageUrl: string
  description: string
  inStock: boolean
  stockQuantity: number
  rating: number
  origin: string
}

export interface CartItem {
  id: string
  productId: string
  name: string
  imageUrl: string
  unitPrice: number
  quantity: number
  unit: string
}

export interface Order {
  id: string
  createdAt: string
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  paymentMethod: PaymentMethod
  cardLast4: string | null
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  deliveryNotes: string | null
}

export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  title: string
  body: string
  createdAt: string
}

// Input types for mutations

export type NewCartItem = Omit<CartItem, 'id'>

export type NewOrder = Omit<Order, 'id' | 'createdAt' | 'status'>

export type NewReview = Omit<Review, 'id' | 'createdAt'>
