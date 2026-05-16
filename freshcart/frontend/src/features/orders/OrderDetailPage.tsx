import { Link, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowLeft, Package, Clock, CheckCircle, CreditCard, Banknote } from 'lucide-react'
import { useGetOrderByIdQuery } from './ordersApi'
import { formatPrice } from '../../utils/formatPrice'
import type { OrderStatus } from '../../types/models'
import Spinner from '../../components/Spinner/Spinner'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import styles from './OrderDetailPage.module.css'

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: typeof Clock; className: string }> = {
  pending:   { label: 'Pending',   icon: Clock,       className: 'pending' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, className: 'confirmed' },
  delivered: { label: 'Delivered', icon: Package,     className: 'delivered' },
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading, isError, refetch } = useGetOrderByIdQuery(id!)

  if (isLoading) return <Spinner />

  if (isError || !order) {
    return <ErrorMessage message="Could not load this order." onRetry={refetch} />
  }

  const cfg = STATUS_CONFIG[order.status]
  const Icon = cfg.icon

  return (
    <div className={styles.page}>
      <Link to="/orders" className={styles.back}>
        <ArrowLeft size={16} strokeWidth={2.5} /> Back to orders
      </Link>

      <div className={styles.header}>
        <div>
          <p className={styles.orderId}>Order #{order.id}</p>
          <h1 className={styles.title}>
            Placed on {format(new Date(order.createdAt), 'dd MMMM yyyy')}
          </h1>
        </div>
        <span className={[styles.status, styles[cfg.className]].join(' ')}>
          <Icon size={14} strokeWidth={2.5} />
          {cfg.label}
        </span>
      </div>

      <div className={styles.grid}>
        <div>
          {/* Items */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>🛒 Items Ordered</p>
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
            <p className={styles.sectionTitle}>📍 Delivery Details</p>
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
                  <span className={styles.paymentChip}>
                    {order.paymentMethod === 'card'
                      ? <><CreditCard size={13} /> Card ···· {order.cardLast4}</>
                      : <><Banknote size={13} /> Cash on delivery</>}
                  </span>
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
                  <span className={styles.infoLabel}>Delivery Notes</span>
                  <span className={styles.infoValue}>{order.deliveryNotes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Price summary */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>💰 Payment Summary</p>

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
