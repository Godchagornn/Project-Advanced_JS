import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type SortBy = 'name' | 'priceAsc' | 'priceDesc' | 'ratingDesc'
export type ViewMode = 'grid' | 'list'
export type CategoryFilter = 'all' | 'fruits' | 'vegetables' | 'herbs'

export const PRICE_MIN = 0
export const PRICE_MAX = 200

export interface FiltersState {
  search: string
  category: CategoryFilter
  sortBy: SortBy
  inStockOnly: boolean
  viewMode: ViewMode
  minPrice: number
  maxPrice: number
  minRating: number
}

const initialState: FiltersState = {
  search: '',
  category: 'all',
  sortBy: 'name',
  inStockOnly: false,
  viewMode: 'grid',
  minPrice: PRICE_MIN,
  maxPrice: PRICE_MAX,
  minRating: 0,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    setCategory(state, action: PayloadAction<CategoryFilter>) {
      state.category = action.payload
    },
    setSortBy(state, action: PayloadAction<SortBy>) {
      state.sortBy = action.payload
    },
    setInStockOnly(state, action: PayloadAction<boolean>) {
      state.inStockOnly = action.payload
    },
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload
    },
    setPriceRange(state, action: PayloadAction<[number, number]>) {
      state.minPrice = action.payload[0]
      state.maxPrice = action.payload[1]
    },
    setMinRating(state, action: PayloadAction<number>) {
      state.minRating = action.payload
    },
    resetFilters() {
      return initialState
    },
  },
})

export const {
  setSearch,
  setCategory,
  setSortBy,
  setInStockOnly,
  setViewMode,
  setPriceRange,
  setMinRating,
  resetFilters,
} = filtersSlice.actions

export default filtersSlice.reducer
