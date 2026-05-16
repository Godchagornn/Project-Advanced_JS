import type { ReactNode } from 'react'
import styles from './EmptyState.module.css'

interface Props {
  icon?: string
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon = '📭', title, description, action }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.iconWrap}>{icon}</div>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action}
    </div>
  )
}
