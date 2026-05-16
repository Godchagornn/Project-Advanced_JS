import { Link } from 'react-router-dom'
import Button from '../components/Button/Button'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.code}>404</div>
      <span className={styles.emoji}>🥦</span>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.description}>
        Looks like this page has gone off the shelf. Let&apos;s get you back to the fresh picks.
      </p>
      <Link to="/">
        <Button size="lg">Back to home</Button>
      </Link>
    </div>
  )
}
