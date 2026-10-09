import { ExternalLink, Github, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { site } from '../../config/site'
import type { Language } from '../../i18n'

interface HeaderCopy {
  navTools: string
  navContribute: string
  languageLabel: string
}

export function Header({
  lang,
  onLanguageChange,
  labels,
}: {
  lang: Language
  onLanguageChange: (lang: Language) => void
  labels: HeaderCopy
}) {
  const [open, setOpen] = useState(false)
  const repo = site.repository?.replace(/\/$/, '') ?? null
  const homeHref = import.meta.env.BASE_URL || '/'
  const navItems = [
    { label: labels.navTools, hash: '#tools' },
    { label: labels.navContribute, hash: '#contribute' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-background/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-[1320px] items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6">
        <a href={homeHref} className="flex min-w-0 items-center gap-3" aria-label="Xóm Coding Dev Tools home">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-lg object-contain"
          />
          <span className="min-w-0 leading-tight">
            <strong className="block truncate text-[15px] font-bold text-text">
              {site.name}
            </strong>
            <span className="mt-0.5 inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary-text">
              {site.tagline}
            </span>
          </span>
        </a>

        <nav className="ml-auto hidden items-center gap-6 text-[13px] text-slate-300 md:flex">
          {navItems.map((item) => (
            <a key={item.hash} href={`${homeHref}${item.hash}`} className="transition-colors hover:text-primary-hover">
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

        <div className="ml-auto hidden rounded-lg border border-border bg-surface p-1 md:flex" aria-label={labels.languageLabel}>
          {(['en', 'vi'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onLanguageChange(option)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-bold transition-colors ${
                lang === option ? 'bg-primary text-white' : 'text-muted hover:bg-surface-hover hover:text-text'
              }`}
            >
              {option.toUpperCase()}
            </button>
          ))}
        </div>

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
                key={item.hash}
                href={`${homeHref}${item.hash}`}
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
            <div className="mt-2 grid grid-cols-2 gap-2" aria-label={labels.languageLabel}>
              {(['en', 'vi'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onLanguageChange(option)
                    setOpen(false)
                  }}
                  className={`rounded-lg px-3 py-2.5 text-sm font-bold ${
                    lang === option ? 'bg-primary text-white' : 'border border-border text-muted'
                  }`}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
