import { ExternalLink } from 'lucide-react'
import { site } from '../../config/site'

interface SocialLink {
  label: string
  href: string
}

export function Footer() {
  const repo = site.repository?.replace(/\/$/, '') ?? null

  const links: SocialLink[] = [
    { label: 'xomcoding.me', href: site.mainSite },
    ...(repo ? [{ label: 'GitHub Repository', href: repo }] : []),
    ...(site.links.githubPersonal ? [{ label: 'GitHub cá nhân', href: site.links.githubPersonal }] : []),
    ...(site.links.koFi ? [{ label: 'Ko-fi', href: site.links.koFi }] : []),
    ...(site.links.facebook ? [{ label: 'Facebook', href: site.links.facebook }] : []),
    ...(site.links.youtube ? [{ label: 'YouTube', href: site.links.youtube }] : []),
    ...(site.links.tiktok ? [{ label: 'TikTok', href: site.links.tiktok }] : []),
  ]

  return (
    <footer className="mt-16 border-t border-border-soft bg-surface/60">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <p className="text-sm font-bold text-white">
            {site.name} — {site.tagline}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            Khám phá · Học hỏi · Chia sẻ · Phát triển cùng cộng đồng lập trình Việt Nam.
          </p>
          <p className="mt-3 text-xs text-muted/80">{site.slogan}</p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted" aria-label="Liên kết ngoài">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 transition-colors hover:text-primary-hover"
            >
              {link.label} <ExternalLink className="size-3" />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
