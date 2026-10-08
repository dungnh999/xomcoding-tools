import {
  Boxes,
  BrainCircuit,
  Bot,
  Cloud,
  CreditCard,
  Database,
  HardDrive,
  Infinity as InfinityIcon,
  Mail,
  Monitor,
  Palette,
  Package,
  Server,
  Shield,
  Terminal,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Category } from '../../types/tool'

const ICONS: Record<string, LucideIcon> = {
  database: Database,
  cloud: Cloud,
  bot: Bot,
  'brain-circuit': BrainCircuit,
  infinity: InfinityIcon,
  terminal: Terminal,
  monitor: Monitor,
  palette: Palette,
  shield: Shield,
  zap: Zap,
  'hard-drive': HardDrive,
  mail: Mail,
  'credit-card': CreditCard,
  server: Server,
  package: Package,
}

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Boxes
  return <Icon className={className} aria-hidden="true" />
}

interface SidebarProps {
  categories: Category[]
  counts: Map<string, number>
  total: number
  selected: string
  onSelect: (id: string) => void
}

export function Sidebar({ categories, counts, total, selected, onSelect }: SidebarProps) {
  return (
    <aside className="hidden w-56 shrink-0 lg:block" aria-label="Danh mục công cụ">
      <nav className="sticky top-20 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => onSelect('all')}
          className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-[13px] transition-colors ${
            selected === 'all'
              ? 'border-primary/50 bg-primary/15 font-semibold text-text'
              : 'border-transparent text-muted hover:bg-surface-hover hover:text-text'
          }`}
        >
          <Boxes className="size-4 shrink-0" aria-hidden="true" />
          <span className="flex-1">Tất cả công cụ</span>
          <span className="text-xs text-muted">{total}</span>
        </button>

        {categories.map((category) => {
          const active = selected === category.id
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-[13px] transition-colors ${
                active
                  ? 'border-primary/50 bg-primary/15 font-semibold text-text'
                  : 'border-transparent text-muted hover:bg-surface-hover hover:text-text'
              }`}
              aria-current={active ? 'true' : undefined}
            >
              <CategoryIcon name={category.icon} className="size-4 shrink-0" />
              <span className="flex-1 truncate">{category.name}</span>
              <span className="text-xs text-muted">{counts.get(category.id) ?? 0}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

interface MobileCategoriesProps extends Omit<SidebarProps, 'total'> {
  total: number
}

export function MobileCategories({ categories, counts, total, selected, onSelect }: MobileCategoriesProps) {
  const items = [{ id: 'all', name: 'Tất cả', count: total }, ...categories.map((c) => ({
    id: c.id,
    name: c.name,
    count: counts.get(c.id) ?? 0,
  }))]

  return (
    <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden" role="tablist" aria-label="Danh mục công cụ">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={selected === item.id}
          onClick={() => onSelect(item.id)}
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap transition-colors ${
            selected === item.id
              ? 'border-primary/60 bg-primary/20 font-semibold text-text'
              : 'border-border bg-surface text-muted'
          }`}
        >
          {item.name}
          <span className="text-[11px] text-muted">{item.count}</span>
        </button>
      ))}
    </div>
  )
}
