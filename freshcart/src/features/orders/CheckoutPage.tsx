import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetCartQuery } from '../cart/cartApi'
import { usePlaceOrderMutation } from './ordersApi'
import { useAppDispatch } from '../../app/hooks'
import { showToast } from '../ui/uiSlice'
import { validateCheckout } from '../../utils/validators'
import type { CheckoutFields, CheckoutErrors } from '../../utils/validators'
import type { PaymentMethod } from '../../types/models'
import { formatPrice } from '../../utils/formatPrice'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import Spinner from '../../components/Spinner/Spinner'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import EmptyState from '../../components/EmptyState/EmptyState'
import styles from './CheckoutPage.module.css'

const SHIPPING_THRESHOLD = 500
const SHIPPING_COST = 50
const TAX_RATE = 0.07

const EMPTY_FIELDS: CheckoutFields = {
  customerName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  paymentMethod: 'cash',
  cardLast4: '',
  deliveryNotes: '',
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { data: cartItems, isLoading: cartLoading, isError: cartError, refetch } = useGetCartQuery()
  const [placeOrder, { isLoading: isPlacing }] = usePlaceOrderMutation()

  const [fields, setFields] = useState<CheckoutFields>(EMPTY_FIELDS)
  const [errors, setErrors] = useState<CheckoutErrors>({})

  useEffect(() => {
    if (!cartLoading && cartItems && cartItems.length === 0) {
      navigate('/cart')
    }
  }, [cartItems, cartLoading, navigate])

  const set = (key: keyof CheckoutFields, value: string) =>
    setFields(f => ({ ...f, [key]: value }))

  const subtotal = cartItems
    ? cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    : 0
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const tax = subtotal * TAX_RATE
  const total = subtotal + shipping + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateCheckout(fields)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    if (!cartItems || cartItems.length === 0) return

    try {
      const order = await placeOrder({
        customerName: fields.customerName,
        email: fields.email,
        phone: fields.phone,
        address: fields.address,
        city: fields.city,
        postalCode: fields.postalCode,
        paymentMethod: fields.paymentMethod as PaymentMethod,
        cardLast4: fields.paymentMethod === 'card' ? fields.cardLast4 : null,
        deliveryNotes: fields.deliveryNotes || null,
        items: cartItems,
        subtotal,
        shipping,
        tax,
        total,
      }).unwrap()
      dispatch(showToast({ message: 'Order placed successfully!', type: 'success' }))
      navigate(`/orders/${order.id}`)
    } catch {
      dispatch(showToast({ message: 'Failed to place order. Please try again.', type: 'error' }))
    }
  }

  if (cartLoading) return <Spinner />
  if (cartError) return <ErrorMessage message="Could not load your cart." onRetry={refetch} />
  if (!cartItems || cartItems.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Your cart is empty"
        description="Add items to your cart before checking out."
        action={<Button onClick={() => navigate('/products')}>Browse products</Button>}
      />
    )
  }

  return (
    <div>
      <h1 className={styles.title}>Checkout</h1>

      <div className={styles.page}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Contact info */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Contact information</p>
            <Input
              id="customerName"
              label="Full name"
              value={fields.customerName}
              onChange={e => set('customerName', e.target.value)}
              error={errors.customerName}
              autoComplete="name"
            />
            <div className={styles.row2}>
              <Input
                id="email"
                label="Email"
                type="email"
                value={fields.email}
                onChange={e => set('email', e.target.value)}
                error={errors.email}
                autoComplete="email"
              />
              <Input
                id="phone"
                label="Phone number"
                type="tel"
                value={fields.phone}
                onChange={e => set('phone', e.target.value)}
                error={errors.phone}
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Delivery */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Delivery address</p>
            <Input
              id="address"
              label="Address"
              value={fields.address}
              onChange={e => set('address', e.target.value)}
              error={errors.address}
              autoComplete="street-address"
            />
            <div className={styles.row2}>
              <Input
                id="city"
                label="City"
                value={fields.city}
                onChange={e => set('city', e.target.value)}
                error={errors.city}
                autoComplete="address-level2"
              />
              <Input
                id="postalCode"
                label="Postal code"
                value={fields.postalCode}
                onChange={e => set('postalCode', e.target.value)}
                error={errors.postalCode}
                autoComplete="postal-code"
                maxLength={5}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                Delivery notes (optional)
              </label>
              <textarea
                className={styles.textarea}
                placeholder="E.g. Leave at the door, call on arrival…"
                value={fields.deliveryNotes}
                onChange={e => set('deliveryNotes', e.target.value)}
              />
            </div>
          </div>

          {/* Payment */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Payment method</p>
            <div className={styles.paymentOptions}>
              <button
                type="button"
                className={[
                  styles.paymentBtn,
                  fields.paymentMethod === 'cash' ? styles.selected : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => set('paymentMethod', 'cash')}
              >
                💵 Cash on delivery
              </button>
              <button
                type="button"
                className={[
                  styles.paymentBtn,
                  fields.paymentMethod === 'card' ? styles.selected : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => set('paymentMethod', 'card')}
              >
                💳 Card (mock)
              </button>
            </div>
            {errors.paymentMethod && (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-error)' }}>
                {errors.paymentMethod}
              </span>
            )}

            {fields.paymentMethod === 'card' && (
              <Input
                id="cardLast4"
                label="Last 4 digits of card"
                value={fields.cardLast4}
                onChange={e => set('cardLast4', e.target.value)}
                error={errors.cardLast4}
                maxLength={4}
                placeholder="e.g. 4242"
              />
            )}
          </div>

          <Button type="submit" size="lg" fullWidth disabled={isPlacing}>
            {isPlacing ? 'Placing order…' : `Place order — ${formatPrice(total)}`}
          </Button>
        </form>

        {/* Order summary sidebar */}
        <div className={styles.summary}>
          <p className={styles.summaryTitle}>Order summary</p>

          <div className={styles.summaryItems}>
            {cartItems.map(item => (
              <div key={item.id} className={styles.summaryItem}>
                <span className={styles.summaryItemName}>
                  {item.name} × {item.quantity}
                </span>
                <span className={styles.summaryItemPrice}>
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <hr className={styles.divider} />

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
          <div className={styles.summaryRow}>
            <span>VAT (7%)</span>
            <span>{formatPrice(tax)}</span>
          </div>

          <hr className={styles.divider} />

          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
