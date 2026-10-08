import type { Status } from '../../types/tool'

const STATUS_META: Record<Status, { label: string; dot: string }> = {
  active: { label: 'Hoạt động', dot: 'bg-active' },
  inactive: { label: 'Không hoạt động', dot: 'bg-inactive' },
  unknown: { label: 'Chưa xác định', dot: 'bg-unknown' },
}

function formatDate(value: string | null): string {
  if (!value) return 'Chưa kiểm tra'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Chưa kiểm tra'
  return `Kiểm tra lần cuối: ${date.toLocaleDateString('vi-VN')}`
}

export function ToolStatus({ status, lastChecked }: { status: Status; lastChecked: string | null }) {
  const meta = STATUS_META[status]
  const detail = `${meta.label} · ${formatDate(lastChecked)}`
  return (
    <span
      className="inline-flex items-center"
      title={detail}
      aria-label={detail}
    >
      <span className={`size-2.5 rounded-full ${meta.dot}`} aria-hidden="true" />
      <span className="sr-only">{detail}</span>
    </span>
  )
}
