import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import type { Product } from '../../types/models'
import { useAddToCartMutation } from '../cart/cartApi'
import { useAppDispatch } from '../../app/hooks'
import { showToast } from '../ui/uiSlice'
import PriceTag from '../../components/PriceTag/PriceTag'
import styles from './ProductCard.module.css'

interface Props {
  product: Product
  viewMode?: 'grid' | 'list'
}

const CATEGORY_COLORS: Record<string, string> = {
  fruits: '#fef3c7',
  vegetables: '#dcfce7',
  herbs: '#d1fae5',
}

export default function ProductCard({ product, viewMode = 'grid' }: Props) {
  const dispatch = useAppDispatch()
  const [addToCart, { isLoading }] = useAddToCartMutation()

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        unitPrice: product.pricePerUnit,
        quantity: 1,
        unit: product.unit,
      }).unwrap()
      dispatch(showToast({ message: `${product.name} added to cart`, type: 'success' }))
    } catch {
      dispatch(showToast({ message: 'Failed to add item to cart', type: 'error' }))
    }
  }

  const cardClass = [styles.card, viewMode === 'list' ? styles.listCard : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cardClass}>
      <Link to={`/products/${product.id}`} className={styles.imageLink}>
        <img src={product.imageUrl} alt={product.name} className={styles.image} loading="lazy" />
        {!product.inStock && <div className={styles.outOfStockOverlay}>Out of stock</div>}
        {product.inStock && product.rating >= 4.5 && (
          <div className={styles.badgeBestSeller}>⭐ Best Seller</div>
        )}
      </Link>

      <div className={styles.body}>
        <span
          className={styles.category}
          style={{ background: CATEGORY_COLORS[product.category] ?? '#f0fdf4' }}
        >
          {product.category}
        </span>

        <Link to={`/products/${product.id}`} className={styles.name}>
          {product.name}
        </Link>

        <div className={styles.ratingRow}>
          <Star size={13} fill="#f59e0b" stroke="none" />
          <span className={styles.ratingNum}>{product.rating.toFixed(1)}</span>
        </div>

        <div className={styles.footer}>
          <PriceTag amount={product.pricePerUnit} unit={product.unit} size="md" />
          <button
            className={styles.cartBtn}
            onClick={handleAddToCart}
            disabled={!product.inStock || isLoading}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
