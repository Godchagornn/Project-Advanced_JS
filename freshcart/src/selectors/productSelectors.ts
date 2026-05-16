import { createSelector } from '@reduxjs/toolkit'
import { productsApi } from '../features/products/productsApi'
import type { RootState } from '../app/store'

const selectProductsResult = productsApi.endpoints.getProducts.select()

export const selectAllProducts = createSelector(selectProductsResult, result => result.data ?? [])

const selectFilters = (state: RootState) => state.filters

export const selectFilteredProducts = createSelector(
  selectAllProducts,
  selectFilters,
  (products, filters) => {
    let result = [...products]

    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category)
    }

    if (filters.inStockOnly) {
      result = result.filter(p => p.inStock)
    }

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      )
    }

    return result
  }
)

export const selectSortedProducts = createSelector(
  selectFilteredProducts,
  selectFilters,
  (products, filters) => {
    const result = [...products]
    result.sort((a, b) => {
      if (filters.sortBy === 'priceAsc') return a.pricePerUnit - b.pricePerUnit
      if (filters.sortBy === 'priceDesc') return b.pricePerUnit - a.pricePerUnit
      if (filters.sortBy === 'ratingDesc') return b.rating - a.rating
      return a.name.localeCompare(b.name)
    })
    return result
  }
)

export const selectFeaturedProducts = createSelector(selectAllProducts, products =>
  [...products].sort((a, b) => b.rating - a.rating).slice(0, 4)
)
