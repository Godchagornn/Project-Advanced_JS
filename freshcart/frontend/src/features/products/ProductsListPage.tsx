import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react'
import { useGetProductsQuery } from './productsApi'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  setSearch,
  setCategory,
  setSortBy,
  setInStockOnly,
  setViewMode,
  setPriceRange,
  setMinRating,
  PRICE_MIN,
  PRICE_MAX,
} from '../filters/filtersSlice'
import type { CategoryFilter, SortBy } from '../filters/filtersSlice'
import { selectSortedProducts } from '../../selectors/productSelectors'
import { useDebounce } from '../../hooks/useDebounce'
import ProductCard from './ProductCard'
import Input from '../../components/Input/Input'
import Select from '../../components/Select/Select'
import Skeleton from '../../components/Skeleton/Skeleton'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import EmptyState from '../../components/EmptyState/EmptyState'
import styles from './ProductsListPage.module.css'

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All', emoji: '🛒' },
  { value: 'fruits', label: 'Fruits', emoji: '🍎' },
  { value: 'vegetables', label: 'Vegetables', emoji: '🥦' },
  { value: 'herbs', label: 'Herbs', emoji: '🌿' },
]

const SORT_OPTIONS = [
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'priceAsc', label: 'Price: low → high' },
  { value: 'priceDesc', label: 'Price: high → low' },
  { value: 'ratingDesc', label: '⭐ Top rated' },
]

const RATING_OPTIONS = [
  { value: 0, label: 'All ratings' },
  { value: 4.5, label: '4.5 & up' },
  { value: 4.7, label: '4.7 & up' },
  { value: 4.9, label: '4.9 & up' },
]

function StarRow({ rating }: { rating: number }) {
  return (
    <span className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => {
        const full = i < Math.floor(rating)
        const half = !full && i < rating && rating % 1 >= 0.3
        return (
          <span
            key={i}
            className={full ? styles.starFull : half ? styles.starHalf : styles.starEmpty}
          >
            ★
          </span>
        )
      })}
    </span>
  )
}

export default function ProductsListPage() {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const { search, category, sortBy, inStockOnly, viewMode, minPrice, maxPrice, minRating } =
    useAppSelector(s => s.filters)

  const [localSearch, setLocalSearch] = useState(search)
  const debouncedSearch = useDebounce(localSearch, 300)

  /* local price state — sync to redux on mouseup so selector isn't thrashed while dragging */
  const [localMin, setLocalMin] = useState(minPrice)
  const [localMax, setLocalMax] = useState(maxPrice)
  const rangeRef = useRef<HTMLDivElement>(null)

  const { isLoading, isError, refetch } = useGetProductsQuery()
  const filtered = useAppSelector(selectSortedProducts)

  useEffect(() => {
    dispatch(setSearch(debouncedSearch))
  }, [debouncedSearch, dispatch])

  useEffect(() => {
    const cat = searchParams.get('category') as CategoryFilter | null
    if (cat && ['fruits', 'vegetables', 'herbs'].includes(cat)) {
      dispatch(setCategory(cat))
    }
  }, [searchParams, dispatch])

  const fillLeft = ((localMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  const fillRight = 100 - ((localMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.min(Number(e.target.value), localMax - 5)
    setLocalMin(v)
  }
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(Number(e.target.value), localMin + 5)
    setLocalMax(v)
  }
  const commitPrice = () => dispatch(setPriceRange([localMin, localMax]))

  return (
    <div className={styles.page}>
      {/* ── Page header ── */}
      <div className={styles.header}>
        <p className={styles.eyebrow}>Our Collection</p>
        <h1 className={styles.title}>Fresh Produce</h1>
        <p className={styles.subtitle}>
          Sourced daily from local farms — always fresh, always seasonal.
        </p>
      </div>

      {/* ── Body: sidebar + main ── */}
      <div className={styles.layout}>
        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>
          {/* Categories */}
          <div className={styles.sidebarSection}>
            <p className={styles.sidebarLabel}>Categories</p>
            <div className={styles.filterList}>
              {CATEGORY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={[
                    styles.filterBtn,
                    category === opt.value ? styles.filterBtnActive : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => dispatch(setCategory(opt.value as CategoryFilter))}
                >
                  <span className={styles.filterEmoji}>{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sidebarDivider} />

          {/* Price range */}
          <div className={styles.sidebarSection}>
            <p className={styles.sidebarLabel}>Price range</p>

            <div className={styles.priceValues}>
              <span className={styles.priceChip}>฿{localMin}</span>
              <span className={styles.priceSep}>–</span>
              <span className={styles.priceChip}>฿{localMax}</span>
            </div>

            <div className={styles.sliderWrap} ref={rangeRef}>
              <div className={styles.sliderTrack}>
                <div
                  className={styles.sliderFill}
                  style={{ left: `${fillLeft}%`, right: `${fillRight}%` }}
                />
              </div>
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={5}
                value={localMin}
                onChange={handleMinChange}
                onMouseUp={commitPrice}
                onTouchEnd={commitPrice}
                className={styles.rangeInput}
                aria-label="Minimum price"
              />
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={5}
                value={localMax}
                onChange={handleMaxChange}
                onMouseUp={commitPrice}
                onTouchEnd={commitPrice}
                className={styles.rangeInput}
                aria-label="Maximum price"
              />
            </div>

            <div className={styles.priceAxisRow}>
              <span>฿{PRICE_MIN}</span>
              <span>฿{PRICE_MAX}</span>
            </div>
          </div>

          <div className={styles.sidebarDivider} />

          {/* Rating filter */}
          <div className={styles.sidebarSection}>
            <p className={styles.sidebarLabel}>Min rating</p>
            <div className={styles.ratingList}>
              {RATING_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={[
                    styles.ratingBtn,
                    minRating === opt.value ? styles.ratingBtnActive : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => dispatch(setMinRating(opt.value))}
                >
                  {opt.value === 0 ? (
                    <span className={styles.stars}>{'★★★★★'}</span>
                  ) : (
                    <StarRow rating={opt.value} />
                  )}
                  <span className={styles.ratingLabel}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sidebarDivider} />

          {/* Availability */}
          <div className={styles.sidebarSection}>
            <p className={styles.sidebarLabel}>Availability</p>
            <label className={styles.stockToggle}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => dispatch(setInStockOnly(e.target.checked))}
              />
              In stock only
            </label>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className={styles.main}>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <Input
                placeholder="Search fruits, vegetables, herbs…"
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                aria-label="Search products"
                icon={<Search size={16} />}
              />
            </div>
            <div className={styles.toolbarRight}>
              <Select
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={e => dispatch(setSortBy(e.target.value as SortBy))}
                aria-label="Sort products"
              />
              <div className={styles.viewToggle}>
                <button
                  type="button"
                  className={[styles.viewBtn, viewMode === 'grid' ? styles.active : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => dispatch(setViewMode('grid'))}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  type="button"
                  className={[styles.viewBtn, viewMode === 'list' ? styles.active : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => dispatch(setViewMode('list'))}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Results count */}
          {!isLoading && !isError && (
            <div className={styles.resultsBar}>
              <span className={styles.resultCount}>
                <SlidersHorizontal size={13} />
                {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
              </span>
            </div>
          )}

          {isLoading && (
            <div className={styles.skeletonGrid}>
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} variant="card" />
              ))}
            </div>
          )}

          {isError && (
            <ErrorMessage
              message="Could not load products. Please check your connection and try again."
              onRetry={refetch}
            />
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <EmptyState
              icon="🔍"
              title="No produce matches your filters"
              description="Try adjusting your search or category filter to find what you're looking for."
            />
          )}

          {!isLoading && !isError && filtered.length > 0 && (
            <div className={viewMode === 'grid' ? styles.grid : styles.list}>
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
