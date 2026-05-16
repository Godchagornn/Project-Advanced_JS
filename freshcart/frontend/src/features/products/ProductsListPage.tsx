import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useGetProductsQuery } from './productsApi'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  setSearch,
  setCategory,
  setSortBy,
  setInStockOnly,
  setViewMode,
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
  { value: 'all', label: 'All categories' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'herbs', label: 'Herbs' },
]

const SORT_OPTIONS = [
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'priceAsc', label: 'Price: low to high' },
  { value: 'priceDesc', label: 'Price: high to low' },
  { value: 'ratingDesc', label: 'Top rated' },
]

export default function ProductsListPage() {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const { search, category, sortBy, inStockOnly, viewMode } = useAppSelector(s => s.filters)

  // Local input value debounced before hitting Redux so the selector stays efficient
  const [localSearch, setLocalSearch] = useState(search)
  const debouncedSearch = useDebounce(localSearch, 300)

  const { isLoading, isError, refetch } = useGetProductsQuery()
  const filtered = useAppSelector(selectSortedProducts)

  useEffect(() => {
    dispatch(setSearch(debouncedSearch))
  }, [debouncedSearch, dispatch])

  // Sync ?category= query param from HomePage links
  useEffect(() => {
    const cat = searchParams.get('category') as CategoryFilter | null
    if (cat && ['fruits', 'vegetables', 'herbs'].includes(cat)) {
      dispatch(setCategory(cat))
    }
  }, [searchParams, dispatch])

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Fresh Produce</h1>
        <p className={styles.subtitle}>Sourced daily from local farms</p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Input
            placeholder="Search fruits, vegetables…"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            aria-label="Search products"
          />
        </div>

        <div className={styles.filters}>
          <Select
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={e => dispatch(setCategory(e.target.value as CategoryFilter))}
            aria-label="Filter by category"
          />

          <Select
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={e => dispatch(setSortBy(e.target.value as SortBy))}
            aria-label="Sort products"
          />

          <label className={styles.stockToggle}>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={e => dispatch(setInStockOnly(e.target.checked))}
            />
            In stock only
          </label>

          <div className={styles.viewToggle}>
            <button
              type="button"
              className={[styles.viewBtn, viewMode === 'grid' ? styles.active : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => dispatch(setViewMode('grid'))}
              aria-label="Grid view"
            >
              ⊞
            </button>
            <button
              type="button"
              className={[styles.viewBtn, viewMode === 'list' ? styles.active : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => dispatch(setViewMode('list'))}
              aria-label="List view"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {!isLoading && !isError && (
        <div className={styles.resultsBar}>
          <span>
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
          </span>
        </div>
      )}

      {isLoading && (
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
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
  )
}
