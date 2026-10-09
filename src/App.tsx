import { CheckCircle2, Coffee, Github, GitPullRequestArrow, ShieldCheck } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { categories, categoryMap, stats, tools } from './data/load'
import { useToolFilters } from './hooks/useToolFilters'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { MobileCategories, Sidebar } from './components/layout/Sidebar'
import { ToolFilters } from './components/tools/ToolFilters'
import { ToolList } from './components/tools/ToolList'
import { StatsBar } from './components/tools/StatsBar'
import { SearchInput } from './components/ui/SearchInput'
import { site } from './config/site'
import { copy, type Language } from './i18n'
import { countByCategory, filterTools } from './utils/filters'

export default function App() {
  const searchRef = useRef<HTMLInputElement>(null)
  const [lang, setLang] = useState<Language>('en')
  const t = copy[lang]
  const {
    filters,
    appliedFilters,
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
    () => filterTools(tools, appliedFilters, categoryMap),
    [appliedFilters],
  )
  const counts = useMemo(() => countByCategory(tools), [])
  const repo = site.repository?.replace(/\/$/, '') ?? null
  const manualPrUrl = repo ? `${repo}/compare` : null

  return (
    <div id="top" className="min-h-screen">
      <Header lang={lang} onLanguageChange={setLang} labels={t} />

      <main>
            <section className="border-b border-border-soft bg-surface/40 px-4 pt-12 pb-8 sm:px-6">
              <div className="mx-auto max-w-[1320px] text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-primary-text">
                  {t.heroEyebrow}
                </span>
                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  {t.heroTitlePrefix} <span className="text-primary-hover">{t.heroTitleHighlight}</span>
                </h1>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  {t.heroDescription}
                </p>

                <div className="mt-7">
                  <SearchInput
                    ref={searchRef}
                    value={filters.search}
                    onChange={setSearch}
                    placeholder={t.searchPlaceholder}
                    ariaLabel={t.searchLabel}
                    clearLabel={t.clearSearch}
                  />
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
                    labels={t}
                  />
                </div>

                <div className="mt-5">
                  <StatsBar
                    total={stats.total}
                    categories={stats.categories}
                    active={stats.active}
                    unknown={stats.unknown}
                    results={filteredTools.length}
                    labels={t}
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
                lang={lang}
                labels={t}
              />

              <div className="min-w-0 flex-1">
                <div className="mb-4">
                  <MobileCategories
                    categories={categories}
                    counts={counts}
                    total={stats.total}
                    selected={filters.category}
                    onSelect={setCategory}
                    lang={lang}
                    labels={t}
                  />
                </div>

                <ToolList
                  categories={categories}
                  tools={filteredTools}
                  total={stats.total}
                  isFiltering={isFiltering}
                  onReset={reset}
                  lang={lang}
                  labels={t}
                />
              </div>
            </div>

            <section id="contribute" className="scroll-mt-20 border-t border-border-soft bg-surface/40 px-4 py-12 sm:px-6">
              <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
                <div className="max-w-2xl">
                  <span className="text-xs font-bold tracking-wide text-primary-hover">
                    {t.contributeEyebrow}
                  </span>
                  <h2 className="mt-2 text-2xl font-bold">{t.contributeTitle}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {t.contributeBody}
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {manualPrUrl && (
                      <a
                        href={manualPrUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1f883d] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1a7f37]"
                      >
                        <GitPullRequestArrow className="size-4" /> {t.manualPr}
                      </a>
                    )}
                    {repo && (
                      <a
                        href={repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-text"
                      >
                        <Github className="size-4" /> {t.repository}
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-border bg-surface px-4 py-4 text-sm">
                    <Github className="size-4 text-primary-hover" aria-hidden="true" />
                    <p className="mt-3 font-semibold">{t.stepOne}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {t.stepOneBody}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface px-4 py-4 text-sm">
                    <ShieldCheck className="size-4 text-primary-hover" aria-hidden="true" />
                    <p className="mt-3 font-semibold">{t.stepTwo}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {t.stepTwoBody}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface px-4 py-4 text-sm">
                    <CheckCircle2 className="size-4 text-primary-hover" aria-hidden="true" />
                    <p className="mt-3 font-semibold">{t.stepThree}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {t.stepThreeBody}
                    </p>
                  </div>
                </div>
              </div>
            </section>
      </main>

      {site.links.koFi && (
        <a
          href={site.links.koFi}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed right-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full bg-[#ff5f5f] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-black/30 transition-transform hover:-translate-y-0.5 hover:brightness-110 sm:right-6 sm:bottom-6"
        >
          <Coffee className="size-4" /> {t.koFi}
        </a>
      )}

      <Footer body={t.footerBody} externalLinksLabel={t.externalLinks} />
    </div>
  )
}
