import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Truck, ShieldCheck, Lock } from 'lucide-react'
import { useGetProductsQuery } from '../features/products/productsApi'
import { useAppSelector } from '../app/hooks'
import { selectFeaturedProducts, selectAllProducts } from '../selectors/productSelectors'
import ProductCard from '../features/products/ProductCard'
import ErrorMessage from '../components/ErrorMessage/ErrorMessage'
import Skeleton from '../components/Skeleton/Skeleton'
import styles from './HomePage.module.css'

const CATEGORIES = [
  {
    key: 'fruits',
    label: 'Fruits',
    emoji: '🍎',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&q=90',
    overlayColor: 'rgba(127,29,29,0.9)',
  },
  {
    key: 'vegetables',
    label: 'Vegetables',
    emoji: '🥦',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=90',
    overlayColor: 'rgba(20,83,45,0.9)',
  },
  {
    key: 'herbs',
    label: 'Herbs',
    emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=90',
    overlayColor: 'rgba(6,78,59,0.9)',
  },
] as const

const TRUST_BADGES = [
  {
    icon: <Leaf size={22} strokeWidth={2} />,
    title: '100% Organic',
    desc: 'Certified chemical-free produce sourced from trusted farms.',
    iconColor: '#16a34a',
    iconBg: '#dcfce7',
    circleBg: '#dcfce7',
  },
  {
    icon: <Truck size={22} strokeWidth={2} />,
    title: 'Free Delivery',
    desc: 'Fast & free shipping on all orders over ฿381.',
    iconColor: '#f97316',
    iconBg: '#ffedd5',
    circleBg: '#ffedd5',
  },
  {
    icon: <ShieldCheck size={22} strokeWidth={2} />,
    title: 'Fresh Guarantee',
    desc: 'Not satisfied? We offer a full money-back guarantee.',
    iconColor: '#ec4899',
    iconBg: '#fce7f3',
    circleBg: '#fce7f3',
  },
  {
    icon: <Lock size={22} strokeWidth={2} />,
    title: 'Secure Payment',
    desc: 'Your payment info is always safe and encrypted.',
    iconColor: '#ca8a04',
    iconBg: '#fef9c3',
    circleBg: '#fef9c3',
  },
]

const MARQUEE_ITEMS = [
  { text: '🌱 100% ORGANIC', yellow: false },
  { text: '✨ FRESH DAILY', yellow: true },
  { text: '🚚 FREE DELIVERY', yellow: false },
  { text: '💚 FARM TO TABLE', yellow: true },
  { text: '🌿 ECO FRIENDLY', yellow: false },
  { text: '⭐ 4.9 RATED', yellow: true },
]

export default function HomePage() {
  const { isLoading, isError, refetch } = useGetProductsQuery()
  const products = useAppSelector(selectAllProducts)
  const featured = useAppSelector(selectFeaturedProducts)

  const categoryCount = (cat: string) => products.filter(p => p.category === cat).length

  return (
    <div className={styles.page}>

      {/* ── Section 1: Hero ── */}
      <section className={styles.hero}>
        {/* Left panel — clean white + text */}
        <div className={styles.heroLeft}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} aria-hidden="true" />
              100% FRESH &amp; ORGANIC
            </span>

            <h1 className={styles.heroTitle}>
              Fresh from <span className={styles.heroTitleGreen}>Farm</span>
              <br />
              to Your Table 🍃
            </h1>

            <p className={styles.heroSubtitle}>
              Premium quality fruits, vegetables &amp; herbs delivered fresh to your door.
            </p>

            <div className={styles.heroCtas}>
              <Link to="/products" className={styles.ctaPrimary}>
                <span className={styles.ctaShine} aria-hidden="true" />
                Shop Now
              </Link>
              <Link to="/products" className={styles.ctaGlass}>
                Browse Categories
              </Link>
            </div>
          </div>
        </div>

        {/* Right panel — user-supplied background image (public/hero-bg.jpg) */}
        <div className={styles.heroRight} role="img" aria-label="Fresh produce" />
      </section>

      {/* ── Section 2: Marquee Strip ── */}
      <section className={styles.marqueeSection} aria-label="Feature highlights">
        <div className={styles.marqueeTrack}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className={item.yellow ? styles.marqueeItemYellow : styles.marqueeItemWhite}
            >
              {item.text}
              <span className={styles.marqueeSep} aria-hidden="true">•</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── Section 3: Trust Badges ── */}
      <section className={styles.trustSection}>
        <div className={styles.trustGrid}>
          {TRUST_BADGES.map(badge => (
            <div key={badge.title} className={styles.trustCard}>
              <div
                className={styles.trustCircle}
                style={{ background: badge.circleBg }}
                aria-hidden="true"
              />
              <div
                className={styles.trustIcon}
                style={{ background: badge.iconBg, color: badge.iconColor }}
              >
                {badge.icon}
              </div>
              <h3 className={styles.trustTitle}>{badge.title}</h3>
              <p className={styles.trustDesc}>{badge.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 4: Browse by Category ── */}
      <section className={styles.categorySection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderLeft}>
            <span className={styles.pillGreen}>🎯 Shop by Category</span>
            <h2 className={styles.sectionTitle}>
              Browse our <span className={styles.titleGreen}>fresh</span> selection
            </h2>
          </div>
          <Link to="/products" className={styles.viewAll}>
            View all <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        <div className={styles.categoryGrid}>
          {CATEGORIES.map(cat => (
            <Link
              key={cat.key}
              to={`/products?category=${cat.key}`}
              className={styles.categoryCard}
            >
              <img
                src={cat.image}
                alt={cat.label}
                className={styles.categoryImage}
              />
              <div
                className={styles.categoryOverlay}
                style={{
                  background: `linear-gradient(to top, ${cat.overlayColor} 0%, transparent 60%)`,
                }}
              />
              <div className={styles.categoryContent}>
                <span className={styles.categoryEmoji}>{cat.emoji}</span>
                <p className={styles.categoryName}>{cat.label}</p>
                {!isLoading && (
                  <p className={styles.categoryCount}>{categoryCount(cat.key)} items</p>
                )}
                <span className={styles.categoryShopBtn}>
                  Shop {cat.label} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Section 5: Top-rated Picks ── */}
      <section className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderLeft}>
            <span className={styles.pillYellow}>⭐ Best Sellers</span>
            <h2 className={styles.sectionTitle}>Top-rated Picks</h2>
          </div>
          <Link to="/products" className={styles.viewAll}>
            View all <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        {isLoading && (
          <div className={styles.productGrid}>
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
          <div className={styles.productGrid}>
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>


    </div>
  )
}
