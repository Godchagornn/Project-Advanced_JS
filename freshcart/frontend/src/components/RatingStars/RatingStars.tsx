import styles from './RatingStars.module.css'

type StarSize = 'sm' | 'md' | 'lg'

interface ReadonlyProps {
  rating: number
  maxStars?: number
  showCount?: boolean
  reviewCount?: number
  size?: StarSize
  interactive?: false
}

interface InteractiveProps {
  rating: number
  maxStars?: number
  size?: StarSize
  interactive: true
  onChange: (rating: number) => void
}

type Props = ReadonlyProps | InteractiveProps

export default function RatingStars(props: Props) {
  const { rating, maxStars = 5, size = 'md' } = props

  const stars = Array.from({ length: maxStars }, (_, i) => i + 1)

  const wrapperClass = [styles.wrapper, size !== 'md' ? styles[size] : ''].filter(Boolean).join(' ')

  if (props.interactive) {
    return (
      <div className={wrapperClass}>
        <div className={styles.stars}>
          {stars.map(n => (
            <button
              key={n}
              type="button"
              className={styles.starBtn}
              onClick={() => props.onChange(n)}
              aria-label={`Rate ${n} out of ${maxStars}`}
            >
              <span className={n <= rating ? styles.filled : styles.empty}>★</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={wrapperClass}>
      <div className={styles.stars}>
        {stars.map(n => (
          <span
            key={n}
            className={[styles.star, n <= Math.round(rating) ? styles.filled : styles.empty].join(
              ' '
            )}
          >
            ★
          </span>
        ))}
      </div>
      {'showCount' in props && props.showCount && props.reviewCount !== undefined && (
        <span className={styles.count}>({props.reviewCount})</span>
      )}
    </div>
  )
}
