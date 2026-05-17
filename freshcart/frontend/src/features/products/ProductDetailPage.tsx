import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Truck, Leaf } from 'lucide-react'
import { useGetProductByIdQuery } from './productsApi'
import { useAddToCartMutation } from '../cart/cartApi'
import { useAppDispatch } from '../../app/hooks'
import { showToast } from '../ui/uiSlice'
import ReviewList from '../reviews/ReviewList'
import PriceTag from '../../components/PriceTag/PriceTag'
import RatingStars from '../../components/RatingStars/RatingStars'
import QuantityStepper from '../../components/QuantityStepper/QuantityStepper'
import Button from '../../components/Button/Button'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import Skeleton from '../../components/Skeleton/Skeleton'
import styles from './ProductDetailPage.module.css'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const [qty, setQty] = useState(1)
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation()

  const { data: product, isLoading, isError, refetch } = useGetProductByIdQuery(id!)

  const handleAddToCart = async () => {
    if (!product) return
    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        unitPrice: product.pricePerUnit,
        quantity: qty,
        unit: product.unit,
      }).unwrap()
      dispatch(showToast({ message: `${qty} × ${product.name} added to cart`, type: 'success' }))
      setQty(1)
    } catch {
      dispatch(showToast({ message: 'Failed to add to cart', type: 'error' }))
    }
  }

  if (isLoading) {
    return (
      <div>
        <Skeleton variant="text" width="120px" height="20px" />
        <div className={styles.layout} style={{ marginTop: 24 }}>
          <Skeleton variant="image" height="420px" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Skeleton variant="title" />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <ErrorMessage
        message="Could not load this product. It may have been removed."
        onRetry={refetch}
      />
    )
  }

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <Link to="/products" className={styles.back}>
        <ArrowLeft size={16} strokeWidth={2.5} /> Back to products
      </Link>

      <div className={styles.layout}>
        {/* Left: image */}
        <div className={styles.imageWrap}>
          <img src={product.imageUrl} alt={product.name} className={styles.image} />
          <div className={styles.imgOverlay} aria-hidden="true" />
        </div>

        {/* Right: info */}
        <div className={styles.info}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.name}>{product.name}</h1>

          <div className={styles.ratingRow}>
            <RatingStars rating={product.rating} showCount size="md" />
            <span className={styles.ratingValue}>{product.rating.toFixed(1)} / 5</span>
          </div>

          <div className={styles.priceRow}>
            <PriceTag amount={product.pricePerUnit} unit={product.unit} size="xl" />
          </div>

          <p className={styles.description}>{product.description}</p>

          {/* Meta grid */}
          <div className={styles.meta}>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>📍 Origin</span>
              <span className={styles.metaValue}>{product.origin}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>📦 Unit</span>
              <span className={styles.metaValue}>per {product.unit}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>🏷️ Stock</span>
              <span
                className={[
                  styles.stockBadge,
                  product.inStock ? styles.inStock : styles.outOfStock,
                ].join(' ')}
              >
                {product.inStock
                  ? `In stock (${product.stockQuantity} ${product.unit} left)`
                  : 'Out of stock'}
              </span>
            </div>
          </div>

          <hr className={styles.divider} />

          {product.inStock && (
            <div className={styles.addRow}>
              <QuantityStepper
                value={qty}
                onChange={setQty}
                max={product.stockQuantity}
                disabled={isAdding}
              />
              <Button onClick={handleAddToCart} disabled={isAdding} size="lg">
                {isAdding ? 'Adding…' : '🛒 Add to cart'}
              </Button>
            </div>
          )}

          {!product.inStock && (
            <p className={styles.outOfStockMsg}>This item is currently out of stock.</p>
          )}

          {/* Trust badges */}
          <div className={styles.trustRow}>
            <div className={styles.trustItem}>
              <Leaf size={16} className={styles.trustIcon} />
              <span>100% Fresh</span>
            </div>
            <div className={styles.trustItem}>
              <ShieldCheck size={16} className={styles.trustIcon} />
              <span>Secure Payment</span>
            </div>
            <div className={styles.trustItem}>
              <Truck size={16} className={styles.trustIcon} />
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />
      <ReviewList productId={product.id} />
    </div>
  )
}
