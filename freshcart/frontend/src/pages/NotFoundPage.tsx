import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'
import Button from '../components/Button/Button'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <div className={styles.wrapper}>
      {/* Decorative blob */}
      <div className={styles.blob} aria-hidden="true" />

      <div className={styles.code}>404</div>
      <div className={styles.emojiRow}>
        <span className={styles.emoji}>🥦</span>
        <span className={styles.emoji}>🍎</span>
        <span className={styles.emoji}>🌿</span>
      </div>
      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.description}>
        Looks like this page has gone off the shelf. Let&apos;s get you back to the fresh picks.
      </p>
      <div className={styles.actions}>
        <Link to="/">
          <Button size="lg">
            <Home size={18} strokeWidth={2.5} /> Back to Home
          </Button>
        </Link>
        <Link to="/products">
          <Button size="lg" variant="secondary">
            <ArrowLeft size={18} strokeWidth={2.5} /> Browse Products
          </Button>
        </Link>
      </div>
    </div>
  )
}
