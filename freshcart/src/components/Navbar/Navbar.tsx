import { NavLink, Link } from 'react-router-dom'
import CartBadge from '../../features/cart/CartBadge'
import styles from './Navbar.module.css'

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [styles.link, isActive ? styles.active : ''].filter(Boolean).join(' ')

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🥦</span>
          FreshCart
        </Link>

        <div className={styles.links}>
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/orders" className={linkClass}>
            Orders
          </NavLink>
        </div>

        <div className={styles.right}>
          <CartBadge />
        </div>
      </div>
    </nav>
  )
}
