import type { ReactNode } from 'react'
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
      <footer className={styles.footer}>
        © {new Date().getFullYear()} FreshCart — Fresh fruits &amp; vegetables delivered
      </footer>
      <Toast />
      <ConfirmDialog onConfirm={handleConfirm} />
    </div>
  )
}
