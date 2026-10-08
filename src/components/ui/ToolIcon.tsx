import { useState } from 'react'

const BASE = import.meta.env.BASE_URL

function toUrl(iconPath: string): string {
  const clean = iconPath.replace(/^\//, '')
  return `${BASE}${clean}`
}

/**
 * Icon công cụ: ưu tiên SVG trong /public/icons, nếu lỗi tải
 * thì fallback sang chữ cái đầu — không làm vỡ giao diện.
 */
export function ToolIcon({ icon, name, size = 36 }: { icon: string; name: string; size?: number }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        aria-hidden="true"
        className="grid shrink-0 place-items-center rounded-lg border border-border bg-surface-2 font-semibold text-muted"
        style={{ width: size, height: size, fontSize: size * 0.45 }}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    )
  }

  return (
    <img
      src={toUrl(icon)}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="shrink-0 rounded-lg object-contain"
      style={{ width: size, height: size }}
    />
  )
}
