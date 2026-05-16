import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Order, NewOrder } from '../../types/models'

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ['Order', 'Cart'],
  endpoints: builder => ({
    placeOrder: builder.mutation<Order, NewOrder>({
      query: order => ({
        url: '/orders',
        method: 'POST',
        body: { ...order, createdAt: new Date().toISOString(), status: 'pending' },
      }),
      invalidatesTags: [
        { type: 'Order', id: 'LIST' },
        { type: 'Cart', id: 'LIST' },
      ],
    }),

    getOrders: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    getOrderById: builder.query<Order, string>({
      query: id => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),
  }),
})

export const { usePlaceOrderMutation, useGetOrdersQuery, useGetOrderByIdQuery } = ordersApi
