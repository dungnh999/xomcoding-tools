import type { PricingFilter, StatusFilter } from '../../utils/filters'

interface ChipProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  dot?: string
}

function Chip({ active, onClick, children, dot }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap transition-colors ${
        active
          ? 'border-primary/60 bg-primary/20 font-semibold text-text'
          : 'border-border bg-surface text-muted hover:bg-surface-hover hover:text-text'
      }`}
    >
      {dot && <span className={`size-1.5 rounded-full ${dot}`} aria-hidden="true" />}
      {children}
    </button>
  )
}

interface ToolFiltersProps {
  status: StatusFilter
  pricing: PricingFilter
  openSource: boolean
  xomOnly: boolean
  onStatus: (value: StatusFilter) => void
  onPricing: (value: PricingFilter) => void
  onToggleOpenSource: () => void
  onToggleXom: () => void
}

export function ToolFilters({
  status,
  pricing,
  openSource,
  xomOnly,
  onStatus,
  onPricing,
  onToggleOpenSource,
  onToggleXom,
}: ToolFiltersProps) {
  const allActive = status === 'all' && pricing === 'all' && !openSource && !xomOnly

  const resetScope = () => {
    onStatus('all')
    onPricing('all')
    if (openSource) onToggleOpenSource()
    if (xomOnly) onToggleXom()
  }

  return (
    <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Bộ lọc">
      <Chip active={allActive} onClick={resetScope}>
        Tất cả
      </Chip>

      <span className="mx-1 hidden self-center border-l border-border sm:block" aria-hidden="true" />

      <Chip active={status === 'active'} onClick={() => onStatus(status === 'active' ? 'all' : 'active')} dot="bg-active">
        Hoạt động
      </Chip>
      <Chip
        active={status === 'inactive'}
        onClick={() => onStatus(status === 'inactive' ? 'all' : 'inactive')}
        dot="bg-inactive"
      >
        Không hoạt động
      </Chip>
      <Chip
        active={status === 'unknown'}
        onClick={() => onStatus(status === 'unknown' ? 'all' : 'unknown')}
        dot="bg-unknown"
      >
        Chưa xác định
      </Chip>

      <span className="mx-1 hidden self-center border-l border-border sm:block" aria-hidden="true" />

      <Chip active={pricing === 'free'} onClick={() => onPricing(pricing === 'free' ? 'all' : 'free')}>
        Free
      </Chip>
      <Chip
        active={pricing === 'freemium'}
        onClick={() => onPricing(pricing === 'freemium' ? 'all' : 'freemium')}
      >
        Free Tier
      </Chip>
      <Chip active={pricing === 'paid'} onClick={() => onPricing(pricing === 'paid' ? 'all' : 'paid')}>
        Paid
      </Chip>
      <Chip active={openSource} onClick={onToggleOpenSource}>
        Open Source
      </Chip>

      <span className="mx-1 hidden self-center border-l border-border sm:block" aria-hidden="true" />

      <Chip active={xomOnly} onClick={onToggleXom}>
        Có bài viết Xóm Coding
      </Chip>
    </div>
  )
}
