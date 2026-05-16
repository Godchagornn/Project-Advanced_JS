import { createSelector } from '@reduxjs/toolkit'
import { cartApi } from '../features/cart/cartApi'
import type { CartItem } from '../types/models'

const SHIPPING_THRESHOLD = 500
const SHIPPING_COST = 50
const TAX_RATE = 0.07

const selectCartResult = cartApi.endpoints.getCart.select()

export const selectCartItems = createSelector(
  selectCartResult,
  result => result.data ?? []
)

export const selectCartItemCount = createSelector(selectCartItems, items =>
  items.reduce((sum, item) => sum + item.quantity, 0)
)

export const selectCartSubtotal = createSelector(selectCartItems, items =>
  items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
)

export const selectCartShipping = createSelector(selectCartSubtotal, subtotal =>
  subtotal >= SHIPPING_THRESHOLD ? 0 : subtotal === 0 ? 0 : SHIPPING_COST
)

export const selectCartTax = createSelector(
  selectCartSubtotal,
  subtotal => subtotal * TAX_RATE
)

export const selectCartTotal = createSelector(
  selectCartSubtotal,
  selectCartShipping,
  selectCartTax,
  (subtotal, shipping, tax) => subtotal + shipping + tax
)

export const selectCartByCategory = createSelector(selectCartItems, items =>
  items.reduce<Record<string, CartItem[]>>((groups, item) => {
    const key = item.unit
    return { ...groups, [key]: [...(groups[key] ?? []), item] }
  }, {})
)
