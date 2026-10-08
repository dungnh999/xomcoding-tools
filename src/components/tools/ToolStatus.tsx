import type { Status } from '../../types/tool'

const STATUS_META: Record<Status, { label: string; dot: string; text: string }> = {
  active: { label: 'Hoạt động', dot: 'bg-active', text: 'text-active' },
  inactive: { label: 'Không hoạt động', dot: 'bg-inactive', text: 'text-inactive' },
  unknown: { label: 'Chưa xác định', dot: 'bg-unknown', text: 'text-unknown' },
}

function formatDate(value: string | null): string {
  if (!value) return 'Chưa kiểm tra'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Chưa kiểm tra'
  return `Kiểm tra lần cuối: ${date.toLocaleDateString('vi-VN')}`
}

export function ToolStatus({ status, lastChecked }: { status: Status; lastChecked: string | null }) {
  const meta = STATUS_META[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs"
      title={formatDate(lastChecked)}
    >
      <span className={`size-2 rounded-full ${meta.dot}`} aria-hidden="true" />
      <span className={meta.text}>{meta.label}</span>
    </span>
  )
}
