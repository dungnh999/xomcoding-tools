import type { Pricing } from '../../types/tool'

const PRICING_LABELS: Record<Pricing, string> = {
  free: 'Free',
  freemium: 'Free Tier',
  paid: 'Paid',
}

const PRICING_STYLES: Record<Pricing, string> = {
  free: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  freemium: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  paid: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
}

export function PricingBadge({ pricing }: { pricing: Pricing }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${PRICING_STYLES[pricing]}`}
    >
      {PRICING_LABELS[pricing]}
    </span>
  )
}

export function OpenSourceBadge() {
  return (
    <span className="inline-flex items-center rounded-md border border-violet-500/30 bg-violet-500/15 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-violet-400">
      Open Source
    </span>
  )
}

export function AffiliateBadge() {
  return (
    <span
      title="This link may support Xóm Coding at no extra cost to you."
      className="inline-flex items-center rounded-md border border-rose-500/30 bg-rose-500/15 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-rose-300"
    >
      Affiliate
    </span>
  )
}
