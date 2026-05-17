import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowRight, Package, Clock, CheckCircle } from 'lucide-react'
import { useGetOrdersQuery } from './ordersApi'
import { formatPrice } from '../../utils/formatPrice'
import type { OrderStatus } from '../../types/models'
import Spinner from '../../components/Spinner/Spinner'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import EmptyState from '../../components/EmptyState/EmptyState'
import Button from '../../components/Button/Button'
import styles from './OrderHistoryPage.module.css'

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: typeof Clock; className: string }> = {
  pending:   { label: 'Pending',   icon: Clock,        className: 'pending' },
  confirmed: { label: 'Confirmed', icon: CheckCircle,  className: 'confirmed' },
  delivered: { label: 'Delivered', icon: Package,      className: 'delivered' },
}

export default function OrderHistoryPage() {
  const { data: orders, isLoading, isError, refetch } = useGetOrdersQuery()

  if (isLoading) return <Spinner />

  if (isError) {
    return <ErrorMessage message="Could not load your orders." onRetry={refetch} />
  }

  if (!orders || orders.length === 0) {
    return (
      <div>
        <h1 className={styles.title}>Order History</h1>
        <EmptyState
          icon="📋"
          title="You haven't placed any orders yet"
          description="Browse our fresh produce and place your first order."
          action={
            <Link to="/products">
              <Button>Start Shopping</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)
  const deliveredCount = orders.filter(o => o.status === 'delivered').length

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Your purchases</p>
        <h1 className={styles.title}>Order History</h1>
        <p className={styles.subtitle}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

        <div className={styles.statsStrip}>
          <div className={styles.statChip}>
            <Package size={13} strokeWidth={2.5} />
            <span><strong>{orders.length}</strong> orders</span>
          </div>
          <div className={styles.statChip}>
            <span>Total spent: <strong>{formatPrice(totalSpent)}</strong></span>
          </div>
          {deliveredCount > 0 && (
            <div className={[styles.statChip, styles.statChipGreen].join(' ')}>
              <CheckCircle size={13} strokeWidth={2.5} />
              <span><strong>{deliveredCount}</strong> delivered</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.list}>
        {sorted.map((order, i) => {
          const cfg = STATUS_CONFIG[order.status]
          const Icon = cfg.icon
          return (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className={styles.card}
              data-status={order.status}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={styles.cardIcon} data-status={order.status}>
                <Icon size={18} strokeWidth={2} />
              </div>
              <div className={styles.cardLeft}>
                <span className={styles.orderId}>#{order.id.slice(0, 8)}…</span>
                <span className={styles.orderDate}>
                  {format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm')}
                </span>
                <span className={styles.itemCount}>
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <div className={styles.cardRight}>
                <span className={styles.total}>{formatPrice(order.total)}</span>
                <span className={[styles.status, styles[cfg.className]].join(' ')}>
                  <Icon size={12} strokeWidth={2.5} />
                  {cfg.label}
                </span>
              </div>
              <div className={styles.cardArrow}>
                <ArrowRight size={16} />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
