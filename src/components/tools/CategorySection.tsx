import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { Category, Tool } from '../../types/tool'
import { CategoryIcon } from '../layout/Sidebar'
import { ToolRow } from './ToolRow'

const TABLE_HEAD = ['Công cụ', 'Mục đích sử dụng', 'Chi phí', 'Trạng thái', 'Liên kết']

export function CategorySection({ category, tools }: { category: Category; tools: Tool[] }) {
  const [expanded, setExpanded] = useState(true)

  if (tools.length === 0) return null

  return (
    <section className="mb-8" aria-labelledby={`category-${category.id}`}>
      <div className="mb-2 flex items-center gap-3 px-3">
        <span className="grid size-8 place-items-center rounded-lg border border-border bg-surface text-primary-hover">
          <CategoryIcon name={category.icon} className="size-4" />
        </span>
        <h2 id={`category-${category.id}`} className="text-[15px] font-bold text-text">
          {category.name}
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
              <ChevronUp className="size-3.5" /> Thu gọn
            </>
          ) : (
            <>
              <ChevronDown className="size-3.5" /> Xem tất cả
            </>
          )}
        </button>
      </div>

      {expanded && (
        <div className="overflow-hidden rounded-xl border border-border bg-surface/70">
          <div className="hidden border-b border-border bg-surface px-3 py-2.5 text-[11px] font-semibold tracking-wide text-muted uppercase lg:grid lg:grid-cols-[minmax(190px,1.1fr)_minmax(0,1.5fr)_110px_56px_140px] lg:gap-4">
            {TABLE_HEAD.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          {tools.map((tool) => (
            <ToolRow key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </section>
  )
}
