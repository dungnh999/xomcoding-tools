import { SearchX } from 'lucide-react'
import type { Category, Tool } from '../../types/tool'
import { CategorySection } from './CategorySection'

interface ToolListProps {
  categories: Category[]
  tools: Tool[]
  total: number
  isFiltering: boolean
  onReset: () => void
  labels: {
    showing: string
    statsTools: string
    noResultsTitle: string
    noResultsBody: string
    resetFilters: string
    tableTool: string
    tableUseCase: string
    tablePricing: string
    tableStatus: string
    tableLinks: string
    collapse: string
    expand: string
  }
}

export function ToolList({ categories, tools, total, isFiltering, onReset, labels }: ToolListProps) {
  if (tools.length === 0) {
    return (
      <div className="grid place-items-center rounded-xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
        <SearchX className="size-8 text-muted" aria-hidden="true" />
        <p className="mt-4 text-sm font-semibold text-text">{labels.noResultsTitle}</p>
        <p className="mt-1 text-[13px] text-muted">{labels.noResultsBody}</p>
        {isFiltering && (
          <button
            type="button"
            onClick={onReset}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            {labels.resetFilters}
          </button>
        )}
      </div>
    )
  }

  const grouped = categories
    .map((category) => ({
      category,
      tools: tools.filter((tool) => tool.category === category.id),
    }))
    .filter((group) => group.tools.length > 0)

  return (
    <div>
      <p className="mb-3 px-3 text-xs text-muted" role="status">
        {labels.showing} <strong className="text-text">{tools.length}</strong> / {total} {labels.statsTools}
      </p>
      {grouped.map((group) => (
        <CategorySection key={group.category.id} category={group.category} tools={group.tools} labels={labels} />
      ))}
    </div>
  )
}
