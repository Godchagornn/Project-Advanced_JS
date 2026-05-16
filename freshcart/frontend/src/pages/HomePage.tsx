import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Truck, Leaf, Lock } from 'lucide-react'
import { useGetProductsQuery } from '../features/products/productsApi'
import { useAppSelector } from '../app/hooks'
import { selectFeaturedProducts, selectAllProducts } from '../selectors/productSelectors'
import ProductCard from '../features/products/ProductCard'
import ErrorMessage from '../components/ErrorMessage/ErrorMessage'
import Skeleton from '../components/Skeleton/Skeleton'
import styles from './HomePage.module.css'

const CATEGORIES = [
  { key: 'fruits', label: 'Fruits', emoji: '🍎', color: '#fff7ed', accent: '#f97316' },
  { key: 'vegetables', label: 'Vegetables', emoji: '🥦', color: '#f0fdf4', accent: '#16a34a' },
  { key: 'herbs', label: 'Herbs', emoji: '🌿', color: '#ecfdf5', accent: '#059669' },
] as const

const TRUST_BADGES = [
  { icon: <Leaf size={18} strokeWidth={2} />, title: '100% Organic', desc: 'No chemicals', color: '#dcfce7', iconColor: '#16a34a' },
  { icon: <Truck size={18} strokeWidth={2} />, title: 'Free Delivery', desc: 'On orders over ฿381', color: '#dbeafe', iconColor: '#2563eb' },
  { icon: <ShieldCheck size={18} strokeWidth={2} />, title: 'Fresh Guarantee', desc: 'Or your money back', color: '#f3e8ff', iconColor: '#9333ea' },
  { icon: <Lock size={18} strokeWidth={2} />, title: 'Secure Payment', desc: '100% safe & secure', color: '#fef3c7', iconColor: '#d97706' },
]

export default function HomePage() {
  const { isLoading, isError, refetch } = useGetProductsQuery()
  const products = useAppSelector(selectAllProducts)
  const featured = useAppSelector(selectFeaturedProducts)

  const categoryCount = (cat: string) => products.filter(p => p.category === cat).length

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.blobTop} aria-hidden="true" />
        <div className={styles.blobBottom} aria-hidden="true" />

        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <span className={styles.heroBadge}>
              <Leaf size={12} strokeWidth={2.5} /> 100% Fresh &amp; Organic
            </span>

            <h1 className={styles.heroTitle}>
              Fresh from Farm<br />to Your Table&nbsp;🌿
            </h1>

            <p className={styles.heroSubtitle}>
              Premium quality fruits, vegetables and herbs delivered fresh to your door.
            </p>

            <div className={styles.heroCtas}>
              <Link to="/products" className={styles.ctaPrimary}>Shop Now</Link>
              <Link to="/products" className={styles.ctaSecondary}>Browse Categories</Link>
            </div>
          </div>

          <div className={styles.heroImageWrap}>
            <div className={styles.heroImgGlow} aria-hidden="true" />
            <img
              src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=700&q=80"
              alt="Fresh fruits and vegetables"
              className={styles.heroImage}
            />
            <div className={styles.floatTag}>
              <span>🌱</span> Sourced fresh daily
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className={styles.trustSection}>
        <div className={styles.trustBar}>
          {TRUST_BADGES.map((badge, i) => (
            <div key={badge.title} className={styles.trustItem}>
              <div className={styles.trustIcon} style={{ background: badge.color, color: badge.iconColor }}>
                {badge.icon}
              </div>
              <div>
                <p className={styles.trustTitle}>{badge.title}</p>
                <p className={styles.trustDesc}>{badge.desc}</p>
              </div>
              {i < TRUST_BADGES.length - 1 && <div className={styles.trustDivider} />}
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Browse by Category</h2>
          <Link to="/products" className={styles.viewAll}>
            View all <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        <div className={styles.categoriesGrid}>
          {CATEGORIES.map(cat => (
            <Link
              key={cat.key}
              to={`/products?category=${cat.key}`}
              className={styles.categoryCard}
              style={{ '--cat-color': cat.color, '--cat-accent': cat.accent } as React.CSSProperties}
            >
              <div className={styles.categoryIcon} style={{ background: cat.color }}>
                {cat.emoji}
              </div>
              <div className={styles.categoryInfo}>
                <p className={styles.categoryName}>{cat.label}</p>
                {!isLoading && (
                  <p className={styles.categoryCount}>{categoryCount(cat.key)} items</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Top-rated Picks</h2>
          <Link to="/products" className={styles.viewAll}>
            View all <ArrowRight size={14} strokeWidth={2.5} />
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

      {/* ── CTA Banner ── */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerBlob} aria-hidden="true" />
        <div className={styles.ctaBannerContent}>
          <h2 className={styles.ctaBannerTitle}>Ready to eat healthier?</h2>
          <p className={styles.ctaBannerSub}>
            Join thousands who trust FreshCart for their daily produce needs.
          </p>
          <Link to="/products" className={styles.ctaBannerBtn}>
            Start Shopping <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </div>
  )
}
