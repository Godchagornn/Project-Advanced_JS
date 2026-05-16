import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { CartItem, NewCartItem } from '../../types/models'

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ['Cart'],
  endpoints: builder => ({
    getCart: builder.query<CartItem[], void>({
      query: () => '/cartItems',
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Cart' as const, id })),
              { type: 'Cart', id: 'LIST' },
            ]
          : [{ type: 'Cart', id: 'LIST' }],
    }),

    addToCart: builder.mutation<CartItem, NewCartItem>({
      query: item => ({
        url: '/cartItems',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    updateCartItem: builder.mutation<CartItem, CartItem>({
      query: item => ({
        url: `/cartItems/${item.id}`,
        method: 'PUT',
        body: item,
      }),
      invalidatesTags: (_result, _error, item) => [{ type: 'Cart', id: item.id }],
    }),

    removeFromCart: builder.mutation<void, string>({
      query: id => ({
        url: `/cartItems/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Cart', id },
        { type: 'Cart', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} = cartApi
