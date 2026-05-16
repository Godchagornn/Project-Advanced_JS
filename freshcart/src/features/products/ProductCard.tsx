import { Link } from 'react-router-dom'
import type { Product } from '../../types/models'
import { useAddToCartMutation } from '../cart/cartApi'
import { useAppDispatch } from '../../app/hooks'
import { showToast } from '../ui/uiSlice'
import Button from '../../components/Button/Button'
import PriceTag from '../../components/PriceTag/PriceTag'
import RatingStars from '../../components/RatingStars/RatingStars'
import styles from './ProductCard.module.css'

interface Props {
  product: Product
  viewMode?: 'grid' | 'list'
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
      </Link>

      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <Link to={`/products/${product.id}`} className={styles.name}>
          {product.name}
        </Link>
        <div className={styles.meta}>
          <RatingStars rating={product.rating} size="sm" />
          <PriceTag amount={product.pricePerUnit} unit={product.unit} size="sm" />
        </div>
        {!product.inStock && <span className={styles.outOfStock}>Out of stock</span>}
      </div>

      <div className={styles.footer}>
        <Button
          size="sm"
          fullWidth
          onClick={handleAddToCart}
          disabled={!product.inStock || isLoading}
        >
          {isLoading ? 'Adding…' : 'Add to cart'}
        </Button>
      </div>
    </div>
  )
}
