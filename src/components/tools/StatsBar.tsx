interface StatsBarProps {
  total: number
  categories: number
  active: number
  unknown: number
  results: number
}

export function StatsBar({ total, categories, active, unknown, results }: StatsBarProps) {
  const items = [
    { value: total, label: 'công cụ' },
    { value: categories, label: 'danh mục' },
    { value: active, label: 'đã xác nhận hoạt động' },
    { value: unknown, label: 'chưa xác định' },
    { value: results, label: 'kết quả' },
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
