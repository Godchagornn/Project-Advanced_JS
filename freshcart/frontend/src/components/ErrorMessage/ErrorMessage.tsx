import Button from '../Button/Button'
import styles from './ErrorMessage.module.css'

interface Props {
  message?: string
  onRetry?: () => void
}

export default function ErrorMessage({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.iconWrap}>⚠️</div>
      <p className={styles.title}>Oops!</p>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
