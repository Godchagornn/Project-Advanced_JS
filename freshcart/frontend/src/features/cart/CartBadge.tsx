import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useGetCartQuery } from './cartApi'
import styles from './CartBadge.module.css'

export default function CartBadge() {
  const { data: cartItems } = useGetCartQuery()
  const count = cartItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <Link to="/cart" className={styles.link} aria-label={`Cart, ${count} items`}>
      <ShoppingCart size={22} strokeWidth={2} />
      {count > 0 && <span className={styles.badge}>{count > 99 ? '99+' : count}</span>}
    </Link>
  )
}
