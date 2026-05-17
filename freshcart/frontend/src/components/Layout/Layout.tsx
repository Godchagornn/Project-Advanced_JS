import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Globe, Share2, Rss, MessageCircle, Mail, Phone, MapPin } from 'lucide-react'
import Navbar from '../Navbar/Navbar'
import Toast from './Toast'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import { useAppDispatch } from '../../app/hooks'
import { useRemoveFromCartMutation } from '../../features/cart/cartApi'
import { useDeleteReviewMutation } from '../../features/reviews/reviewsApi'
import { showToast } from '../../features/ui/uiSlice'
import styles from './Layout.module.css'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  const dispatch = useAppDispatch()
  const [removeFromCart] = useRemoveFromCartMutation()
  const [deleteReview] = useDeleteReviewMutation()

  const handleConfirm = async (actionId: string) => {
    const [type, ...parts] = actionId.split(':')

    if (type === 'removeCart') {
      try {
        await removeFromCart(parts[0]).unwrap()
        dispatch(showToast({ message: 'Item removed from cart', type: 'success' }))
      } catch {
        dispatch(showToast({ message: 'Failed to remove item', type: 'error' }))
      }
    }

    if (type === 'deleteReview') {
      try {
        await deleteReview({ id: parts[0], productId: parts[1] }).unwrap()
        dispatch(showToast({ message: 'Review deleted', type: 'success' }))
      } catch {
        dispatch(showToast({ message: 'Failed to delete review', type: 'error' }))
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.main}>{children}</main>

      {/* ── Premium Footer ── */}
      <footer className={styles.footer}>
        {/* Decorative top wave */}
        <div className={styles.footerWave} aria-hidden="true">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#14532d" />
          </svg>
        </div>

        <div className={styles.footerInner}>
          {/* Column 1 – Brand */}
          <div className={styles.footerBrand}>
            <Link to="/" className={styles.footerLogo}>
              <span className={styles.footerLogoIcon}>
                <Leaf size={18} strokeWidth={2.5} />
              </span>
              FreshCart
            </Link>
            <p className={styles.footerTagline}>
              Fresh fruits, vegetables &amp; herbs delivered straight from local farms to your door.
            </p>
            <div className={styles.socialRow}>
              <a href="#" className={styles.socialBtn} aria-label="Facebook">
                <Globe size={16} />
              </a>
              <a href="#" className={styles.socialBtn} aria-label="Instagram">
                <Share2 size={16} />
              </a>
              <a href="#" className={styles.socialBtn} aria-label="Twitter">
                <Rss size={16} />
              </a>
              <a href="#" className={styles.socialBtn} aria-label="Line">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Column 2 – Shop */}
          <div className={styles.footerCol}>
            <p className={styles.footerColTitle}>Shop</p>
            <Link to="/products" className={styles.footerLink}>
              All Products
            </Link>
            <Link to="/products?category=fruits" className={styles.footerLink}>
              Fruits
            </Link>
            <Link to="/products?category=vegetables" className={styles.footerLink}>
              Vegetables
            </Link>
            <Link to="/products?category=herbs" className={styles.footerLink}>
              Herbs
            </Link>
          </div>

          {/* Column 3 – Customer service */}
          <div className={styles.footerCol}>
            <p className={styles.footerColTitle}>Customer Service</p>
            <a href="#" className={styles.footerLink}>
              About Us
            </a>
            <a href="#" className={styles.footerLink}>
              Delivery Info
            </a>
            <a href="#" className={styles.footerLink}>
              Returns &amp; Refunds
            </a>
            <a href="#" className={styles.footerLink}>
              FAQs
            </a>
          </div>

          {/* Column 4 – Contact */}
          <div className={styles.footerCol}>
            <p className={styles.footerColTitle}>Contact</p>
            <div className={styles.contactItem}>
              <Mail size={14} className={styles.contactIcon} />
              <span>support@freshcart.com</span>
            </div>
            <div className={styles.contactItem}>
              <Phone size={14} className={styles.contactIcon} />
              <span>02-123-4567</span>
            </div>
            <div className={styles.contactItem}>
              <MapPin size={14} className={styles.contactIcon} />
              <span>Bangkok, Thailand</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.footerBottom}>
          <span>
            © {new Date().getFullYear()} FreshCart — Fresh fruits &amp; vegetables delivered
          </span>
          <div className={styles.paymentBadges}>
            <span className={styles.payBadge}>VISA</span>
            <span className={styles.payBadge}>MC</span>
            <span className={styles.payBadge}>PromptPay</span>
          </div>
        </div>
      </footer>

      <Toast />
      <ConfirmDialog onConfirm={handleConfirm} />
    </div>
  )
}
