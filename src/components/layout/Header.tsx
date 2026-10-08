import { ExternalLink, Github, Menu, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { site } from '../../config/site'

const navItems = [
  { label: 'Công cụ', href: '#tools' },
  { label: 'Đóng góp', href: '#contribute' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const repo = site.repository?.replace(/\/$/, '') ?? null

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-6 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-3 whitespace-nowrap" aria-label="Xóm Coding Dev Tools — trang chủ">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-lg object-contain"
          />
          <span className="leading-tight">
            <strong className="block text-[15px] font-bold text-text">
              {site.name} <span className="text-primary-hover">•</span>{' '}
              <span className="font-medium text-muted">{site.tagline}</span>
            </strong>
          </span>
        </a>

        <nav className="ml-auto hidden items-center gap-6 text-[13px] text-slate-300 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-primary-hover">
              {item.label}
            </a>
          ))}
          {repo && (
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-primary-hover"
            >
              GitHub <ExternalLink className="size-3" />
            </a>
          )}
          <a
            href={site.mainSite}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-primary-hover"
          >
            xomcoding.me <ExternalLink className="size-3" />
          </a>
        </nav>

        {repo ? (
          <a
            href={`${repo}/compare`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-lg border border-primary-hover/70 bg-primary-soft px-3.5 py-2 text-[13px] font-bold whitespace-nowrap text-primary-text transition-colors hover:bg-primary/40 md:flex"
          >
            <Plus className="size-4" /> Tạo Pull Request
          </a>
        ) : (
          <a
            href="#contribute"
            className="hidden items-center gap-1.5 rounded-lg border border-primary-hover/70 bg-primary-soft px-3.5 py-2 text-[13px] font-bold whitespace-nowrap text-primary-text transition-colors hover:bg-primary/40 md:flex"
          >
            <Plus className="size-4" /> Đóng góp công cụ
          </a>
        )}

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={open}
          className="grid size-9 place-items-center rounded-lg border border-border text-muted md:hidden"
        >
          {open ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border-soft bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1 text-sm">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-slate-300 hover:bg-surface-hover"
              >
                {item.label}
              </a>
            ))}
            {repo && (
              <a
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-slate-300 hover:bg-surface-hover"
              >
                <Github className="size-4" /> GitHub Repository
              </a>
            )}
            <a
              href={site.mainSite}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-3 py-2.5 text-slate-300 hover:bg-surface-hover"
            >
              xomcoding.me
            </a>
            <a
              href={repo ? `${repo}/compare` : '#contribute'}
              {...(repo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 font-bold text-white"
            >
              <Plus className="size-4" /> {repo ? 'Tạo Pull Request' : 'Đóng góp công cụ'}
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
