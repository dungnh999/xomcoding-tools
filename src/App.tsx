import { ArrowRight, Coffee, Github, GitPullRequestArrow, Plus } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { categories, categoryMap, stats, tools } from './data/load'
import { useToolFilters } from './hooks/useToolFilters'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { MobileCategories, Sidebar } from './components/layout/Sidebar'
import { ToolCreatorPage } from './components/contribute/ToolCreatorPage'
import { ToolFilters } from './components/tools/ToolFilters'
import { ToolList } from './components/tools/ToolList'
import { StatsBar } from './components/tools/StatsBar'
import { SearchInput } from './components/ui/SearchInput'
import { site } from './config/site'
import { CREATOR_PAGE_HASH } from './constants/routes'
import { countByCategory, filterTools } from './utils/filters'

function useCreatorPage() {
  const [isCreator, setIsCreator] = useState(() =>
    window.location.hash.startsWith(CREATOR_PAGE_HASH),
  )
  useEffect(() => {
    const onChange = () => {
      const hash = window.location.hash
      const next = hash.startsWith(CREATOR_PAGE_HASH)
      setIsCreator(next)
      if (!next && hash && hash !== '#') {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            document
              .getElementById(hash.slice(1))
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }),
        )
      }
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return isCreator
}

export default function App() {
  const searchRef = useRef<HTMLInputElement>(null)
  const isCreatorPage = useCreatorPage()
  const {
    filters,
    setSearch,
    setCategory,
    setStatus,
    setPricing,
    toggleOpenSource,
    toggleXomOnly,
    reset,
    isFiltering,
  } = useToolFilters()

  const filteredTools = useMemo(
    () => filterTools(tools, filters, categoryMap),
    [filters],
  )
  const counts = useMemo(() => countByCategory(tools), [])
  const repo = site.repository?.replace(/\/$/, '') ?? null

  return (
    <div id="top" className="min-h-screen">
      <Header />

      {isCreatorPage ? (
        <ToolCreatorPage />
      ) : (
        <main>
          <>
            <section className="border-b border-border-soft bg-surface/40 px-4 pt-12 pb-8 sm:px-6">
              <div className="mx-auto max-w-[1320px] text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-primary-text">
                  Open Source · Community Driven
                </span>
                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Dev Tools dành cho <span className="text-primary-hover">Developer</span>
                </h1>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  {site.description}
                </p>

                <div className="mt-7">
                  <SearchInput ref={searchRef} value={filters.search} onChange={setSearch} />
                </div>

                <div className="mt-5">
                  <ToolFilters
                    status={filters.status}
                    pricing={filters.pricing}
                    openSource={filters.openSource}
                    xomOnly={filters.xomOnly}
                    onStatus={setStatus}
                    onPricing={setPricing}
                    onToggleOpenSource={toggleOpenSource}
                    onToggleXom={toggleXomOnly}
                  />
                </div>

                <div className="mt-5">
                  <StatsBar
                    total={stats.total}
                    categories={stats.categories}
                    active={stats.active}
                    unknown={stats.unknown}
                    results={filteredTools.length}
                  />
                </div>
              </div>
            </section>

            <div
              id="tools"
              className="mx-auto flex max-w-[1320px] scroll-mt-20 gap-8 px-4 py-8 sm:px-6 lg:gap-10"
            >
              <Sidebar
                categories={categories}
                counts={counts}
                total={stats.total}
                selected={filters.category}
                onSelect={setCategory}
              />

              <div className="min-w-0 flex-1">
                <div className="mb-4">
                  <MobileCategories
                    categories={categories}
                    counts={counts}
                    total={stats.total}
                    selected={filters.category}
                    onSelect={setCategory}
                  />
                </div>

                <ToolList
                  categories={categories}
                  tools={filteredTools}
                  total={stats.total}
                  isFiltering={isFiltering}
                  onReset={reset}
                />
              </div>
            </div>

            <section id="contribute" className="scroll-mt-20 border-t border-border-soft bg-surface/40 px-4 py-12 sm:px-6">
              <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <span className="text-xs font-bold tracking-wide text-primary-hover">
                    ĐÓNG GÓP CÙNG XÓM CODING
                  </span>
                  <h2 className="mt-2 text-2xl font-bold">Đóng góp rất đơn giản</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Thêm hoặc sửa file JSON trong <code className="text-text">data/tools/</code>, tạo
                    Pull Request để chia sẻ công cụ hữu ích với cộng đồng. Không cần tài khoản trên
                    website — mọi thay đổi đều được review trên GitHub.
                  </p>
                </div>

                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="rounded-xl border border-border bg-surface px-5 py-4 text-sm">
                    <span className="text-xs font-bold text-primary-hover">01</span>
                    <p className="mt-1 font-medium">Fork repo</p>
                  </div>
                  <ArrowRight className="hidden size-4 shrink-0 text-muted sm:block" aria-hidden="true" />
                  <div className="rounded-xl border border-border bg-surface px-5 py-4 text-sm">
                    <span className="text-xs font-bold text-primary-hover">02</span>
                    <p className="mt-1 font-medium">Thêm file JSON</p>
                  </div>
                  <ArrowRight className="hidden size-4 shrink-0 text-muted sm:block" aria-hidden="true" />
                  <div className="rounded-xl border border-border bg-surface px-5 py-4 text-sm">
                    <span className="text-xs font-bold text-primary-hover">03</span>
                    <p className="mt-1 font-medium">Tạo Pull Request</p>
                  </div>
                </div>
              </div>

              <div className="mx-auto mt-8 flex max-w-[1320px] flex-wrap gap-3">
                <a
                  href={CREATOR_PAGE_HASH}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1f883d] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1a7f37]"
                >
                  <Plus className="size-4" /> Tạo nhanh trên web
                </a>
                {repo && (
                  <a
                    href={`${repo}/compare`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-text"
                  >
                    <GitPullRequestArrow className="size-4" /> Tạo Pull Request thủ công
                  </a>
                )}
                {!repo && (
                  <a
                    href={site.mainSite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-text"
                  >
                    <GitPullRequestArrow className="size-4" /> Hướng dẫn đóng góp
                  </a>
                )}
                {repo && (
                  <a
                    href={repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-text"
                  >
                    <Github className="size-4" /> GitHub Repository
                  </a>
                )}
                {site.links.koFi && (
                  <a
                    href={site.links.koFi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#ff5f5f] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:brightness-110"
                  >
                    <Coffee className="size-4" /> Ủng hộ trên Ko-fi
                  </a>
                )}
              </div>
            </section>
          </>
        </main>
      )}

      <Footer />
    </div>
  )
}