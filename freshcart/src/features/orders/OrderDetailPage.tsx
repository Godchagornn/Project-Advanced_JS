import { Link, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { useGetOrderByIdQuery } from './ordersApi'
import { formatPrice } from '../../utils/formatPrice'
import type { OrderStatus } from '../../types/models'
import Spinner from '../../components/Spinner/Spinner'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import styles from './OrderDetailPage.module.css'

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: '🕐 Pending',
  confirmed: '✅ Confirmed',
  delivered: '📦 Delivered',
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading, isError, refetch } = useGetOrderByIdQuery(id!)

  if (isLoading) return <Spinner />

  if (isError || !order) {
    return <ErrorMessage message="Could not load this order." onRetry={refetch} />
  }

  return (
    <div>
      <Link to="/orders" className={styles.back}>
        ← Back to orders
      </Link>

      <div className={styles.header}>
        <div>
          <p className={styles.orderId}>Order #{order.id}</p>
          <h1 className={styles.title}>
            Placed on {format(new Date(order.createdAt), 'dd MMMM yyyy')}
          </h1>
        </div>
        <span className={[styles.status, styles[order.status]].join(' ')}>
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className={styles.grid}>
        <div>
          {/* Items */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Items ordered</p>
            {order.items.map(item => (
              <div key={item.id} className={styles.itemRow}>
                <img src={item.imageUrl} alt={item.name} className={styles.itemImg} />
                <div>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemMeta}>
                    {formatPrice(item.unitPrice)} / {item.unit} × {item.quantity}
                  </p>
                </div>
                <p className={styles.itemPrice}>{formatPrice(item.unitPrice * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Customer info */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Delivery details</p>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Name</span>
                <span className={styles.infoValue}>{order.customerName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{order.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phone</span>
                <span className={styles.infoValue}>{order.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Payment</span>
                <span className={styles.infoValue}>
                  {order.paymentMethod === 'card'
                    ? `Card ending ···· ${order.cardLast4}`
                    : 'Cash on delivery'}
                </span>
              </div>
              <div className={styles.infoItem} style={{ gridColumn: '1 / -1' }}>
                <span className={styles.infoLabel}>Address</span>
                <span className={styles.infoValue}>
                  {order.address}, {order.city} {order.postalCode}
                </span>
              </div>
              {order.deliveryNotes && (
                <div className={styles.infoItem} style={{ gridColumn: '1 / -1' }}>
                  <span className={styles.infoLabel}>Delivery notes</span>
                  <span className={styles.infoValue}>{order.deliveryNotes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Price summary */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Payment summary</p>

          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            {order.shipping === 0 ? (
              <span className={styles.freeShipping}>FREE</span>
            ) : (
              <span>{formatPrice(order.shipping)}</span>
            )}
          </div>
          <div className={styles.summaryRow}>
            <span>VAT (7%)</span>
            <span>{formatPrice(order.tax)}</span>
          </div>

          <hr className={styles.divider} />

          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
