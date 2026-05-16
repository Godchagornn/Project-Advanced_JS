import { Link, useNavigate } from 'react-router-dom'
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
        action={
          <Button onClick={() => navigate('/products')}>Browse products</Button>
        }
      />
    )
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const tax = subtotal * TAX_RATE
  const total = subtotal + shipping + tax

  return (
    <div>
      <h1 className={styles.title}>Your cart</h1>

      <div className={styles.page}>
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
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <p className={styles.summaryTitle}>Order summary</p>

          <div className={styles.summaryRow}>
            <span>Subtotal</span>
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

          {shipping > 0 && (
            <div className={styles.summaryRow}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Add {formatPrice(SHIPPING_THRESHOLD - subtotal)} more for free shipping
              </span>
            </div>
          )}

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
            Proceed to checkout
          </Button>

          <Link to="/products">
            <Button fullWidth variant="ghost" size="sm">
              Continue shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
