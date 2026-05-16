import { configureStore } from '@reduxjs/toolkit'
import filtersReducer from '../features/filters/filtersSlice'
import uiReducer from '../features/ui/uiSlice'
import { productsApi } from '../features/products/productsApi'
import { cartApi } from '../features/cart/cartApi'
import { ordersApi } from '../features/orders/ordersApi'
import { reviewsApi } from '../features/reviews/reviewsApi'

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    ui: uiReducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      productsApi.middleware,
      cartApi.middleware,
      ordersApi.middleware,
      reviewsApi.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
