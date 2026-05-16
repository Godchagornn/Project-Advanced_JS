import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Leaf, X, Menu, Home, ShoppingBag, ClipboardList } from 'lucide-react'
import CartBadge from '../../features/cart/CartBadge'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [styles.link, isActive ? styles.active : ''].filter(Boolean).join(' ')

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIconWrap}>
              <Leaf size={20} strokeWidth={2.5} />
            </span>
            <span className={styles.logoText}>FreshCart</span>
          </Link>

          {/* Desktop nav links */}
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

          {/* Right: cart + mobile toggle */}
          <div className={styles.right}>
            <CartBadge />
            <button
              className={styles.mobileToggle}
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className={styles.drawer} onClick={() => setMobileOpen(false)}>
          <div className={styles.drawerInner} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerLogo}>
              <Leaf size={18} strokeWidth={2.5} />
              <span>FreshCart</span>
            </div>
            <nav className={styles.drawerNav}>
              <NavLink to="/" end className={linkClass} onClick={() => setMobileOpen(false)}>
                <Home size={16} /> Home
              </NavLink>
              <NavLink to="/products" className={linkClass} onClick={() => setMobileOpen(false)}>
                <ShoppingBag size={16} /> Products
              </NavLink>
              <NavLink to="/orders" className={linkClass} onClick={() => setMobileOpen(false)}>
                <ClipboardList size={16} /> Orders
              </NavLink>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
