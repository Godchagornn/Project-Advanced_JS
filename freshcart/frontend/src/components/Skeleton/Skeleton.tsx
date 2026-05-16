import styles from './Skeleton.module.css'

type SkeletonVariant = 'card' | 'text' | 'title' | 'image'

interface Props {
  variant?: SkeletonVariant
  width?: string
  height?: string
  className?: string
}

export default function Skeleton({ variant = 'text', width, height, className = '' }: Props) {
  const style = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  }

  return (
    <div
      className={[styles.skeleton, styles[variant], className].filter(Boolean).join(' ')}
      style={style}
      aria-hidden="true"
    />
  )
}
