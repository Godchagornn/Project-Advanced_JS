import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type SortBy = 'name' | 'priceAsc' | 'priceDesc' | 'ratingDesc'
export type ViewMode = 'grid' | 'list'
export type CategoryFilter = 'all' | 'fruits' | 'vegetables' | 'herbs'

export interface FiltersState {
  search: string
  category: CategoryFilter
  sortBy: SortBy
  inStockOnly: boolean
  viewMode: ViewMode
}

const initialState: FiltersState = {
  search: '',
  category: 'all',
  sortBy: 'name',
  inStockOnly: false,
  viewMode: 'grid',
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
    resetFilters() {
      return initialState
    },
  },
})

export const { setSearch, setCategory, setSortBy, setInStockOnly, setViewMode, resetFilters } =
  filtersSlice.actions

export default filtersSlice.reducer
