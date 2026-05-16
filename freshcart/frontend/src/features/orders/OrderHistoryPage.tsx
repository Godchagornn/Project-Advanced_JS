import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { useGetOrdersQuery } from './ordersApi'
import { formatPrice } from '../../utils/formatPrice'
import type { OrderStatus } from '../../types/models'
import Spinner from '../../components/Spinner/Spinner'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import EmptyState from '../../components/EmptyState/EmptyState'
import Button from '../../components/Button/Button'
import styles from './OrderHistoryPage.module.css'

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: '🕐 Pending',
  confirmed: '✅ Confirmed',
  delivered: '📦 Delivered',
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
        <h1 className={styles.title}>Order history</h1>
        <EmptyState
          icon="📋"
          title="You haven't placed any orders yet"
          description="Browse our fresh produce and place your first order."
          action={
            <Link to="/products">
              <Button>Start shopping</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div>
      <h1 className={styles.title}>Order history</h1>

      <div className={styles.list}>
        {sorted.map(order => (
          <Link key={order.id} to={`/orders/${order.id}`} className={styles.card}>
            <div className={styles.cardLeft}>
              <span className={styles.orderId}>#{order.id}</span>
              <span className={styles.orderDate}>
                {format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm')}
              </span>
              <span className={styles.itemCount}>
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className={styles.cardRight}>
              <span className={styles.total}>{formatPrice(order.total)}</span>
              <span className={[styles.status, styles[order.status]].join(' ')}>
                {STATUS_LABELS[order.status]}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
