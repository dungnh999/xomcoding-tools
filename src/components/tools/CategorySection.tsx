import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { Language } from '../../i18n'
import type { Category, Tool } from '../../types/tool'
import { getCategoryName } from '../../utils/localize'
import { CategoryIcon } from '../layout/Sidebar'
import { ToolRow } from './ToolRow'

interface CategorySectionLabels {
  tableTool: string
  tableUseCase: string
  tablePricing: string
  tableStatus: string
  tableLinks: string
  collapse: string
  expand: string
}

export function CategorySection({
  category,
  tools,
  labels,
  lang,
}: {
  category: Category
  tools: Tool[]
  labels: CategorySectionLabels
  lang: Language
}) {
  const [expanded, setExpanded] = useState(true)
  const categoryName = getCategoryName(category, lang)
  const tableHead = [labels.tableTool, labels.tableUseCase, labels.tablePricing, labels.tableStatus, labels.tableLinks]

  if (tools.length === 0) return null

  return (
    <section className="mb-8" aria-labelledby={`category-${category.id}`}>
      <div className="mb-2 flex items-center gap-3 px-3">
        <span className="grid size-8 place-items-center rounded-lg border border-border bg-surface text-primary-hover">
          <CategoryIcon name={category.icon} className="size-4" />
        </span>
        <h2 id={`category-${category.id}`} className="text-[15px] font-bold text-text">
          {categoryName}
        </h2>
        <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-muted">
          {tools.length}
        </span>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="ml-auto inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-muted transition-colors hover:bg-surface-hover hover:text-text"
        >
          {expanded ? (
            <>
              <ChevronUp className="size-3.5" /> {labels.collapse}
            </>
          ) : (
            <>
              <ChevronDown className="size-3.5" /> {labels.expand}
            </>
          )}
        </button>
      </div>

      {expanded && (
        <div className="overflow-hidden rounded-xl border border-border bg-surface/70">
          <div className="hidden border-b border-border bg-surface px-3 py-2.5 text-[11px] font-semibold tracking-wide text-muted uppercase lg:grid lg:grid-cols-[minmax(190px,1.1fr)_minmax(0,1.5fr)_110px_56px_140px] lg:gap-4">
            {tableHead.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          {tools.map((tool) => (
            <ToolRow key={tool.id} tool={tool} lang={lang} />
          ))}
        </div>
      )}
    </section>
  )
}
