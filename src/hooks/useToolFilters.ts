import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_FILTERS,
  PRICING_FILTERS,
  STATUS_FILTERS,
  type FilterState,
  type PricingFilter,
  type StatusFilter,
  isDefaultFilters,
} from '../utils/filters'

const VALID_STATUS: StatusFilter[] = STATUS_FILTERS
const VALID_PRICING: PricingFilter[] = PRICING_FILTERS

function readFiltersFromUrl(): FilterState {
  const params = new URLSearchParams(window.location.search)
  const status = params.get('status')
  const pricing = params.get('pricing')
  return {
    category: params.get('category') ?? DEFAULT_FILTERS.category,
    status: VALID_STATUS.includes(status as StatusFilter) ? (status as StatusFilter) : 'all',
    pricing: VALID_PRICING.includes(pricing as PricingFilter) ? (pricing as PricingFilter) : 'all',
    openSource: params.get('opensource') === '1',
    xomOnly: params.get('xom') === '1',
    search: params.get('search') ?? '',
  }
}

function writeFiltersToUrl(filters: FilterState): void {
  const params = new URLSearchParams()
  if (filters.category !== 'all') params.set('category', filters.category)
  if (filters.search.trim()) params.set('search', filters.search.trim())
  if (filters.status !== 'all') params.set('status', filters.status)
  if (filters.pricing !== 'all') params.set('pricing', filters.pricing)
  if (filters.openSource) params.set('opensource', '1')
  if (filters.xomOnly) params.set('xom', '1')

  const query = params.toString()
  const next = `${window.location.pathname}${query ? `?${query}` : ''}`
  window.history.replaceState(null, '', next)
}

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])
  return debounced
}

/**
 * Quản lý bộ lọc và đồng bộ state với URL query parameters
 * (?category=&search=&status=&pricing=&opensource=1&xom=1).
 */
export function useToolFilters() {
  const [filters, setFilters] = useState<FilterState>(() => readFiltersFromUrl())
  const [rawSearch, setRawSearch] = useState(() => readFiltersFromUrl().search)
  const search = useDebouncedValue(rawSearch, 200)

  const current = useMemo<FilterState>(() => ({ ...filters, search }), [filters, search])

  useEffect(() => {
    writeFiltersToUrl(current)
  }, [current])

  useEffect(() => {
    const onPopState = () => {
      const next = readFiltersFromUrl()
      setFilters(next)
      setRawSearch(next.search)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }))
  }, [])

  const setStatus = useCallback((status: StatusFilter) => {
    setFilters((prev) => ({ ...prev, status }))
  }, [])

  const setPricing = useCallback((pricing: PricingFilter) => {
    setFilters((prev) => ({ ...prev, pricing }))
  }, [])

  const toggleOpenSource = useCallback(() => {
    setFilters((prev) => ({ ...prev, openSource: !prev.openSource }))
  }, [])

  const toggleXomOnly = useCallback(() => {
    setFilters((prev) => ({ ...prev, xomOnly: !prev.xomOnly }))
  }, [])

  const setSearch = useCallback((value: string) => setRawSearch(value), [])

  const reset = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setRawSearch('')
  }, [])

  const isFiltering = !isDefaultFilters(current)

  return {
    filters: current,
    setSearch,
    setCategory,
    setStatus,
    setPricing,
    toggleOpenSource,
    toggleXomOnly,
    reset,
    isFiltering,
  }
}
