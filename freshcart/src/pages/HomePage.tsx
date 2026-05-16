import { Link } from 'react-router-dom'
import { useGetProductsQuery } from '../features/products/productsApi'
import { useAppSelector } from '../app/hooks'
import { selectFeaturedProducts, selectAllProducts } from '../selectors/productSelectors'
import ProductCard from '../features/products/ProductCard'
import ErrorMessage from '../components/ErrorMessage/ErrorMessage'
import Skeleton from '../components/Skeleton/Skeleton'
import styles from './HomePage.module.css'

const CATEGORIES = [
  { key: 'fruits', label: 'Fruits', emoji: '🍎' },
  { key: 'vegetables', label: 'Vegetables', emoji: '🥦' },
  { key: 'herbs', label: 'Herbs', emoji: '🌿' },
] as const

export default function HomePage() {
  const { isLoading, isError, refetch } = useGetProductsQuery()
  const products = useAppSelector(selectAllProducts)
  const featured = useAppSelector(selectFeaturedProducts)

  const categoryCount = (cat: string) => products.filter(p => p.category === cat).length

  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.heroEyebrow}>Fresh &amp; Local</p>
          <h1 className={styles.heroTitle}>Farm-fresh produce delivered to your door</h1>
          <p className={styles.heroSubtitle}>
            Browse seasonal fruits, crisp vegetables, and aromatic herbs — sourced fresh from local
            farms every morning.
          </p>
          <Link to="/products">
            <button
              type="button"
              style={{
                padding: '12px 28px',
                background: '#fff',
                color: 'var(--color-primary-dark)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              Shop now →
            </button>
          </Link>
        </div>
        <span className={styles.heroEmoji}>🥬</span>
      </section>

      {/* Categories */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Browse by category</h2>
        </div>
        <div className={styles.categoriesGrid}>
          {CATEGORIES.map(cat => (
            <Link
              key={cat.key}
              to={`/products?category=${cat.key}`}
              className={styles.categoryCard}
            >
              <span className={styles.categoryEmoji}>{cat.emoji}</span>
              <span className={styles.categoryName}>{cat.label}</span>
              {!isLoading && (
                <span className={styles.categoryCount}>{categoryCount(cat.key)} items</span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Top-rated picks</h2>
          <Link to="/products" className={styles.viewAll}>
            View all →
          </Link>
        </div>

        {isLoading && (
          <div className={styles.skeletonGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="card" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorMessage
            message="Could not load products. Please check your connection."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && (
          <div className={styles.featuredGrid}>
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
