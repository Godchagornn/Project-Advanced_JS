import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Review, NewReview } from '../../types/models'

export const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ['Review'],
  endpoints: builder => ({
    getReviewsByProduct: builder.query<Review[], string>({
      query: productId => `/reviews?productId=${productId}`,
      providesTags: (result, _error, productId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Review' as const, id })),
              { type: 'Review', id: `LIST-${productId}` },
            ]
          : [{ type: 'Review', id: `LIST-${productId}` }],
    }),

    getReviewById: builder.query<Review, string>({
      query: id => `/reviews/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Review', id }],
    }),

    addReview: builder.mutation<Review, NewReview>({
      query: review => ({
        url: '/reviews',
        method: 'POST',
        body: { ...review, createdAt: new Date().toISOString() },
      }),
      invalidatesTags: (_result, _error, review) => [
        { type: 'Review', id: `LIST-${review.productId}` },
      ],
    }),

    updateReview: builder.mutation<Review, Review>({
      query: review => ({
        url: `/reviews/${review.id}`,
        method: 'PUT',
        body: review,
      }),
      invalidatesTags: (_result, _error, review) => [
        { type: 'Review', id: review.id },
        { type: 'Review', id: `LIST-${review.productId}` },
      ],
    }),

    deleteReview: builder.mutation<void, { id: string; productId: string }>({
      query: ({ id }) => ({
        url: `/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id, productId }) => [
        { type: 'Review', id },
        { type: 'Review', id: `LIST-${productId}` },
      ],
    }),
  }),
})

export const {
  useGetReviewsByProductQuery,
  useGetReviewByIdQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi
