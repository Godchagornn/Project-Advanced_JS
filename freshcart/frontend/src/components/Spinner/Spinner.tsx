import styles from './Spinner.module.css'

interface Props {
  size?: 'sm' | 'md' | 'lg'
}

export default function Spinner({ size = 'md' }: Props) {
  return (
    <div className={[styles.wrapper, size !== 'md' ? styles[size] : ''].filter(Boolean).join(' ')}>
      <div className={styles.spinner} role="status" aria-label="Loading" />
    </div>
  )
}
