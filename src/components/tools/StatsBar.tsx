interface StatsBarProps {
  total: number
  categories: number
  active: number
  unknown: number
  results: number
  labels: {
    statsTools: string
    statsCategories: string
    statsActive: string
    statsUnknown: string
    statsResults: string
  }
}

export function StatsBar({ total, categories, active, unknown, results, labels }: StatsBarProps) {
  const items = [
    { value: total, label: labels.statsTools },
    { value: categories, label: labels.statsCategories },
    { value: active, label: labels.statsActive },
    { value: unknown, label: labels.statsUnknown },
    { value: results, label: labels.statsResults },
  ]

  return (
    <dl className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-muted">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-1.5">
          {index > 0 && <span className="mr-3.5 hidden border-l border-border sm:block" aria-hidden="true" />}
          <dt className="sr-only">{item.label}</dt>
          <dd>
            <strong className="text-sm text-text">{item.value}</strong> {item.label}
          </dd>
        </div>
      ))}
    </dl>
  )
}
