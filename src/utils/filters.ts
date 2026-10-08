import type { Category, Pricing, Status, Tool } from '../types/tool'
import { buildSearchText, matchesQuery } from './search'

export type StatusFilter = 'all' | Status
export type PricingFilter = 'all' | Pricing

export interface FilterState {
  category: string
  status: StatusFilter
  pricing: PricingFilter
  openSource: boolean
  xomOnly: boolean
  search: string
}

export const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  status: 'all',
  pricing: 'all',
  openSource: false,
  xomOnly: false,
  search: '',
}

export const STATUS_FILTERS: StatusFilter[] = ['all', 'active', 'inactive', 'unknown']
export const PRICING_FILTERS: PricingFilter[] = ['all', 'free', 'freemium', 'paid']

export function isDefaultFilters(filters: FilterState): boolean {
  return (
    filters.category === 'all' &&
    filters.status === 'all' &&
    filters.pricing === 'all' &&
    !filters.openSource &&
    !filters.xomOnly &&
    filters.search.trim() === ''
  )
}

export function matchesFilters(
  tool: Tool,
  filters: FilterState,
  categoryMap: Map<string, Category>,
): boolean {
  if (filters.category !== 'all' && tool.category !== filters.category) return false
  if (filters.status !== 'all' && tool.status !== filters.status) return false
  if (filters.pricing !== 'all' && tool.pricing !== filters.pricing) return false
  if (filters.openSource && !tool.openSource) return false
  if (filters.xomOnly && !tool.xomcodingUrl) return false
  if (filters.search.trim()) {
    const haystack = buildSearchText(tool, categoryMap.get(tool.category))
    if (!matchesQuery(haystack, filters.search)) return false
  }
  return true
}

export function filterTools(
  tools: Tool[],
  filters: FilterState,
  categoryMap: Map<string, Category>,
): Tool[] {
  return tools.filter((tool) => matchesFilters(tool, filters, categoryMap))
}

export function countByCategory(tools: Tool[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const tool of tools) {
    counts.set(tool.category, (counts.get(tool.category) ?? 0) + 1)
  }
  return counts
}
