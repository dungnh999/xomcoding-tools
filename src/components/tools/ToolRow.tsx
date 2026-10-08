import { Check, Copy, ExternalLink, Github, NotebookPen } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Tool } from '../../types/tool'
import { OpenSourceBadge, PricingBadge } from '../ui/Badge'
import { ToolIcon } from '../ui/ToolIcon'
import { ToolStatus } from './ToolStatus'

function useCopyUrl(url: string) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return { copied, copy }
}

export function ToolRow({ tool }: { tool: Tool }) {
  const { copied, copy } = useCopyUrl(tool.website)

  return (
    <article className="group flex flex-col gap-2 border-b border-border-soft px-3 py-3.5 transition-colors hover:bg-surface-hover lg:grid lg:grid-cols-[minmax(190px,1.1fr)_minmax(0,1.5fr)_110px_135px_170px] lg:items-center lg:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <ToolIcon icon={tool.icon} name={tool.name} size={34} />
        <div className="min-w-0">
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-sm font-semibold text-text transition-colors group-hover:text-primary-hover"
          >
            {tool.name}
          </a>
          <p className="truncate text-xs text-muted">{tool.shortDescription}</p>
        </div>
      </div>

      <p className="line-clamp-2 text-[13px] leading-relaxed text-muted" title={tool.description}>
        {tool.description}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <PricingBadge pricing={tool.pricing} />
        {tool.openSource && <OpenSourceBadge />}
      </div>

      <div>
        <ToolStatus status={tool.status} lastChecked={tool.lastChecked} />
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        <a
          href={tool.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 transition-colors hover:text-primary-hover"
        >
          <ExternalLink className="size-3.5" /> Trang chủ
        </a>
        {tool.github && (
          <a
            href={tool.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-primary-hover"
          >
            <Github className="size-3.5" /> GitHub
          </a>
        )}
        {tool.xomcodingUrl && (
          <a
            href={tool.xomcodingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-primary-hover transition-colors hover:text-primary"
          >
            <NotebookPen className="size-3.5" /> Đọc trên Xóm Coding
          </a>
        )}
        <button
          type="button"
          onClick={copy}
          aria-label={`Sao chép URL ${tool.name}`}
          className="inline-flex items-center gap-1 transition-colors hover:text-primary-hover"
        >
          {copied ? <Check className="size-3.5 text-active" /> : <Copy className="size-3.5" />}
          {copied ? 'Đã sao chép' : 'Sao chép'}
        </button>
      </div>
    </article>
  )
}
