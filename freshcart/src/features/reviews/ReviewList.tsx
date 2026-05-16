import { useState } from 'react'
import { format } from 'date-fns'
import type { Review } from '../../types/models'
import { useGetReviewsByProductQuery } from './reviewsApi'
import { useAppDispatch } from '../../app/hooks'
import { openConfirmDialog } from '../ui/uiSlice'
import RatingStars from '../../components/RatingStars/RatingStars'
import Spinner from '../../components/Spinner/Spinner'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import EmptyState from '../../components/EmptyState/EmptyState'
import ReviewForm from './ReviewForm'
import styles from './ReviewList.module.css'

interface Props {
  productId: string
}

function ReviewCard({
  review,
  onEdit,
  productId,
}: {
  review: Review
  onEdit: (r: Review) => void
  productId: string
}) {
  const dispatch = useAppDispatch()

  const handleDelete = () => {
    dispatch(
      openConfirmDialog({
        message: `Delete your review "${review.title}"? This cannot be undone.`,
        onConfirmActionId: `deleteReview:${review.id}:${productId}`,
      })
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.author}>{review.author}</p>
          <RatingStars rating={review.rating} size="sm" />
        </div>
        <span className={styles.date}>
          {format(new Date(review.createdAt), 'dd MMM yyyy')}
        </span>
      </div>
      <p className={styles.reviewTitle}>{review.title}</p>
      <p className={styles.body}>{review.body}</p>
      <div className={styles.actions}>
        <button type="button" className={[styles.actionBtn, styles.editBtn].join(' ')} onClick={() => onEdit(review)}>
          Edit
        </button>
        <button type="button" className={[styles.actionBtn, styles.deleteBtn].join(' ')} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default function ReviewList({ productId }: Props) {
  const { data: reviews, isLoading, isError, refetch } = useGetReviewsByProductQuery(productId)
  const [editingReview, setEditingReview] = useState<Review | undefined>(undefined)

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>
        Customer reviews {reviews && reviews.length > 0 ? `(${reviews.length})` : ''}
      </h2>

      {isLoading && <Spinner />}

      {isError && (
        <ErrorMessage message="Could not load reviews." onRetry={refetch} />
      )}

      {!isLoading && !isError && reviews && reviews.length === 0 && (
        <EmptyState
          icon="⭐"
          title="Be the first to review this product"
          description="Share your experience to help other shoppers."
        />
      )}

      {!isLoading && !isError && reviews && reviews.length > 0 && (
        <div className={styles.list}>
          {reviews.map(review =>
            editingReview?.id === review.id ? (
              <div key={review.id}>
                <p className={styles.formTitle}>Edit your review</p>
                <ReviewForm
                  productId={productId}
                  editing={editingReview}
                  onDone={() => setEditingReview(undefined)}
                />
              </div>
            ) : (
              <ReviewCard
                key={review.id}
                review={review}
                onEdit={setEditingReview}
                productId={productId}
              />
            )
          )}
        </div>
      )}

      {!editingReview && (
        <>
          <p className={styles.formTitle}>Write a review</p>
          <ReviewForm productId={productId} />
        </>
      )}
    </div>
  )
}
