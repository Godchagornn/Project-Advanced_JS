import { configureStore } from '@reduxjs/toolkit'
import filtersReducer from '../features/filters/filtersSlice'
import uiReducer from '../features/ui/uiSlice'

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
