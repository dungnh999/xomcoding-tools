import { Check, Copy, ExternalLink, Github, NotebookPen } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Language } from '../../i18n'
import type { Tool } from '../../types/tool'
import { getToolDescription, getToolName, getToolShortDescription } from '../../utils/localize'
import { AffiliateBadge, OpenSourceBadge, PricingBadge } from '../ui/Badge'
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

export function ToolRow({ tool, lang }: { tool: Tool; lang: Language }) {
  const { copied, copy } = useCopyUrl(tool.website)
  const name = getToolName(tool, lang)
  const shortDescription = getToolShortDescription(tool, lang)
  const description = getToolDescription(tool, lang)
  const outboundUrl = tool.affiliateUrl || tool.website
  const outboundRel = tool.affiliateUrl ? 'sponsored nofollow noopener noreferrer' : 'noopener noreferrer'

  return (
    <article className="group flex flex-col gap-2 border-b border-border-soft px-3 py-3.5 transition-colors hover:bg-surface-hover lg:grid lg:grid-cols-[minmax(190px,1.1fr)_minmax(0,1.5fr)_110px_56px_140px] lg:items-center lg:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <ToolIcon icon={tool.icon} name={name} size={34} />
        <div className="min-w-0">
          <a
            href={outboundUrl}
            target="_blank"
            rel={outboundRel}
            className="block truncate text-sm font-semibold text-text transition-colors group-hover:text-primary-hover"
          >
            {name}
          </a>
          <p className="truncate text-xs text-muted">{shortDescription}</p>
        </div>
      </div>

      <p className="line-clamp-2 text-[13px] leading-relaxed text-muted" title={description}>
        {description}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <PricingBadge pricing={tool.pricing} />
        {tool.affiliateUrl && <AffiliateBadge />}
        {tool.openSource && <OpenSourceBadge />}
      </div>

      <div>
        <ToolStatus status={tool.status} lastChecked={tool.lastChecked} />
      </div>

      <div className="flex items-center gap-1">
        <a
          href={outboundUrl}
          target="_blank"
          rel={outboundRel}
          title={tool.affiliateUrl ? 'Affiliate website' : 'Website'}
          aria-label={`${tool.affiliateUrl ? 'Affiliate website' : 'Website'} ${name}`}
          className="rounded-md p-1.5 transition-colors hover:bg-surface-hover hover:text-primary-hover"
        >
          <ExternalLink className="size-4" />
        </a>
        {tool.github && (
          <a
            href={tool.github}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            aria-label={`GitHub ${name}`}
            className="rounded-md p-1.5 transition-colors hover:bg-surface-hover hover:text-primary-hover"
          >
            <Github className="size-4" />
          </a>
        )}
        {tool.xomcodingUrl && (
          <a
            href={tool.xomcodingUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Đọc trên Xóm Coding"
            aria-label={`Đọc trên Xóm Coding: ${name}`}
            className="rounded-md p-1.5 text-primary-hover transition-colors hover:bg-surface-hover hover:text-primary"
          >
            <NotebookPen className="size-4" />
          </a>
        )}
        <button
          type="button"
          onClick={copy}
          title={copied ? 'Đã sao chép' : 'Sao chép URL'}
          aria-label={copied ? 'Đã sao chép URL' : `Sao chép URL ${name}`}
          className="rounded-md p-1.5 transition-colors hover:bg-surface-hover hover:text-primary-hover"
        >
          {copied ? <Check className="size-4 text-active" /> : <Copy className="size-4" />}
        </button>
      </div>
    </article>
  )
}
