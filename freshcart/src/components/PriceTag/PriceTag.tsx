import { formatPrice } from '../../utils/formatPrice'
import styles from './PriceTag.module.css'

type PriceSize = 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  amount: number
  unit?: string
  size?: PriceSize
  className?: string
}

export default function PriceTag({ amount, unit, size = 'md', className = '' }: Props) {
  return (
    <span className={[styles.price, styles[size], className].filter(Boolean).join(' ')}>
      {formatPrice(amount)}
      {unit && <span className={styles.unit}>/{unit}</span>}
    </span>
  )
}
