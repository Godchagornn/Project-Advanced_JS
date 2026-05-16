import { useState, useEffect } from 'react'
import type { Review } from '../../types/models'
import { useAddReviewMutation, useUpdateReviewMutation } from './reviewsApi'
import { useAppDispatch } from '../../app/hooks'
import { showToast } from '../ui/uiSlice'
import { validateReview } from '../../utils/validators'
import type { ReviewErrors } from '../../utils/validators'
import RatingStars from '../../components/RatingStars/RatingStars'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import styles from './ReviewForm.module.css'

interface Props {
  productId: string
  editing?: Review
  onDone?: () => void
}

const EMPTY = { author: '', rating: 0, title: '', body: '' }

export default function ReviewForm({ productId, editing, onDone }: Props) {
  const dispatch = useAppDispatch()
  const [addReview, { isLoading: isAdding }] = useAddReviewMutation()
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation()
  const isLoading = isAdding || isUpdating

  const [fields, setFields] = useState(EMPTY)
  const [errors, setErrors] = useState<ReviewErrors>({})

  useEffect(() => {
    if (editing) {
      setFields({
        author: editing.author,
        rating: editing.rating,
        title: editing.title,
        body: editing.body,
      })
    } else {
      setFields(EMPTY)
    }
    setErrors({})
  }, [editing])

  const set = (key: keyof typeof EMPTY, value: string | number) =>
    setFields(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateReview({ ...fields, rating: fields.rating })
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    try {
      if (editing) {
        await updateReview({ ...editing, ...fields }).unwrap()
        dispatch(showToast({ message: 'Review updated!', type: 'success' }))
      } else {
        await addReview({ productId, ...fields }).unwrap()
        dispatch(showToast({ message: 'Review submitted — thank you!', type: 'success' }))
        setFields(EMPTY)
      }
      onDone?.()
    } catch {
      dispatch(showToast({ message: 'Failed to save review. Please try again.', type: 'error' }))
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        id="review-author"
        label="Your name"
        placeholder="e.g. Somchai K."
        value={fields.author}
        onChange={e => set('author', e.target.value)}
        error={errors.author}
      />

      <div className={styles.ratingField}>
        <span className={styles.ratingLabel}>Rating</span>
        <RatingStars
          rating={fields.rating}
          interactive
          size="lg"
          onChange={v => set('rating', v)}
        />
        {errors.rating && <span className={styles.ratingError}>{errors.rating}</span>}
      </div>

      <Input
        id="review-title"
        label="Title"
        placeholder="Summarise your experience"
        value={fields.title}
        onChange={e => set('title', e.target.value)}
        error={errors.title}
      />

      <div className={styles.fieldWrap}>
        <label className={styles.fieldLabel} htmlFor="review-body">
          Review
        </label>
        <textarea
          id="review-body"
          className={[styles.textarea, errors.body ? styles.hasError : ''].filter(Boolean).join(' ')}
          placeholder="Tell others what you liked or didn't like…"
          value={fields.body}
          onChange={e => set('body', e.target.value)}
          maxLength={500}
        />
        <span className={styles.charCount}>{fields.body.length}/500</span>
        {errors.body && <span className={styles.fieldError}>{errors.body}</span>}
      </div>

      <div className={styles.actions}>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving…' : editing ? 'Update review' : 'Submit review'}
        </Button>
        {editing && (
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
