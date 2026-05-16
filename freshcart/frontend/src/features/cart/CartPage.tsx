import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { useGetCartQuery, useUpdateCartItemMutation } from './cartApi'
import { useAppDispatch } from '../../app/hooks'
import { openConfirmDialog } from '../ui/uiSlice'
import { formatPrice } from '../../utils/formatPrice'
import QuantityStepper from '../../components/QuantityStepper/QuantityStepper'
import Button from '../../components/Button/Button'
import Spinner from '../../components/Spinner/Spinner'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import EmptyState from '../../components/EmptyState/EmptyState'
import styles from './CartPage.module.css'

const SHIPPING_THRESHOLD = 500
const SHIPPING_COST = 50
const TAX_RATE = 0.07

export default function CartPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: cartItems, isLoading, isError, refetch } = useGetCartQuery()
  const [updateCartItem] = useUpdateCartItemMutation()

  const handleQtyChange = (id: string, newQty: number) => {
    const item = cartItems?.find(i => i.id === id)
    if (!item) return
    updateCartItem({ ...item, quantity: newQty })
  }

  const handleRemove = (id: string, name: string) => {
    dispatch(
      openConfirmDialog({
        message: `Remove "${name}" from your cart?`,
        onConfirmActionId: `removeCart:${id}`,
      })
    )
  }

  if (isLoading) return <Spinner />

  if (isError) {
    return <ErrorMessage message="Could not load your cart." onRetry={refetch} />
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Your cart is empty"
        description="Browse fresh picks and add items to your cart."
        action={<Button onClick={() => navigate('/products')}>Browse products</Button>}
      />
    )
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const tax = subtotal * TAX_RATE
  const total = subtotal + shipping + tax
  const shippingProgress = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100)

  return (
    <div className={styles.pageWrap}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>
          Your Cart <span className={styles.countBadge}>{cartItems.length}</span>
        </h1>
      </div>

      <div className={styles.page}>
        {/* Items */}
        <div className={styles.itemList}>
          {cartItems.map(item => (
            <div key={item.id} className={styles.item}>
              <div className={styles.imageWrap}>
                <img src={item.imageUrl} alt={item.name} className={styles.image} />
              </div>

              <div className={styles.itemInfo}>
                <Link to={`/products/${item.productId}`} className={styles.itemName}>
                  {item.name}
                </Link>
                <span className={styles.itemUnit}>
                  {formatPrice(item.unitPrice)} / {item.unit}
                </span>
              </div>

              <div className={styles.itemActions}>
                <span className={styles.itemTotal}>
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
                <QuantityStepper
                  value={item.quantity}
                  onChange={qty => handleQtyChange(item.id, qty)}
                />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemove(item.id, item.name)}
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={15} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}

          {/* Free shipping progress */}
          {shipping > 0 && (
            <div className={styles.shippingProgress}>
              <p className={styles.shippingMsg}>
                🎉 Add <strong>{formatPrice(SHIPPING_THRESHOLD - subtotal)}</strong> more for free delivery!
              </p>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${shippingProgress}%` }} />
              </div>
              <div className={styles.progressLabels}>
                <span>฿0</span>
                <span>฿{SHIPPING_THRESHOLD}</span>
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className={styles.summary}>
          <p className={styles.summaryTitle}>
            <ShoppingBag size={18} /> Order Summary
          </p>

          <div className={styles.summaryRow}>
            <span>Subtotal ({cartItems.length} items)</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Shipping</span>
            {shipping === 0 ? (
              <span className={styles.freeShipping}>FREE</span>
            ) : (
              <span>{formatPrice(shipping)}</span>
            )}
          </div>

          <div className={styles.summaryRow}>
            <span>VAT (7%)</span>
            <span>{formatPrice(tax)}</span>
          </div>

          <hr className={styles.summaryDivider} />

          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <Button fullWidth size="lg" onClick={() => navigate('/checkout')}>
            Proceed to Checkout <ArrowRight size={16} strokeWidth={2.5} />
          </Button>

          <Link to="/products">
            <Button fullWidth variant="ghost" size="sm">
              Continue Shopping
            </Button>
          </Link>

          {/* Trust */}
          <div className={styles.trustMini}>
            <span>🔒 Secure payment</span>
            <span>🌿 Fresh guarantee</span>
          </div>
        </div>
      </div>
    </div>
  )
}
