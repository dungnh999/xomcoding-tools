import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

interface ToolRecord {
  id: string
  name: string
  slug: string
  tags: string[]
  xomcodingUrl: string | null
}

interface Report {
  generatedAt: string
  sitemapUrl: string
  sitemapFetched: boolean
  matched: { toolId: string; articleUrl: string; reason: string }[]
  candidatesNeedingReview: { toolId: string; articleUrl: string; reason: string }[]
  manualLinksPreserved: { toolId: string; url: string }[]
}

const SITEMAP_URL = 'https://xomcoding.me/sitemap.xml'
const ROOT = process.cwd()

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function extractUrls(sitemapXml: string): string[] {
  const urls: string[] = []
  const pattern = /<loc>\s*([^<]+?)\s*<\/loc>/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(sitemapXml)) !== null) {
    urls.push(match[1])
  }
  return urls
}

function slugOf(url: string): string {
  const path = new URL(url).pathname
  const parts = path.split('/').filter(Boolean)
  return parts[parts.length - 1] ?? ''
}

/**
 * Đối chiếu bài viết xomcoding.me với công cụ.
 * CHỈ đề xuất khi slug bài viết trùng chính xác slug/id của tool
 * hoặc trùng một tag đã được xác nhận. KHÔNG ghi đè JSON thủ công —
 * kết quả chỉ ghi vào report để maintainer duyệt.
 */
export async function sync(root = process.cwd()): Promise<Report> {
  const tools = readdirSync(join(root, 'data/tools'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(root, 'data/tools', f), 'utf8')) as ToolRecord)

  const report: Report = {
    generatedAt: new Date().toISOString(),
    sitemapUrl: SITEMAP_URL,
    sitemapFetched: false,
    matched: [],
    candidatesNeedingReview: [],
    manualLinksPreserved: tools
      .filter((t) => t.xomcodingUrl)
      .map((t) => ({ toolId: t.id, url: t.xomcodingUrl as string })),
  }

  let xml = ''
  try {
    const response = await fetch(SITEMAP_URL, {
      signal: AbortSignal.timeout(15_000),
      headers: { 'user-agent': 'XomCodingDevTools-Bot/1.0' },
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    xml = await response.text()
    report.sitemapFetched = true
  } catch (error) {
    console.error(`Không lấy được sitemap (${(error as Error).message}). Website vẫn chạy bình thường.`)
    return report
  }

  const articleSlugs = extractUrls(xml).map((url) => ({ url, slug: normalize(slugOf(url)) }))

  for (const tool of tools) {
    if (tool.xomcodingUrl) continue
    const toolSlug = normalize(tool.slug || tool.id)
    const exact = articleSlugs.filter((a) => a.slug === toolSlug)
    for (const article of exact) {
      report.matched.push({ toolId: tool.id, articleUrl: article.url, reason: 'slug trùng chính xác' })
    }

    if (exact.length === 0) {
      const tagHits = articleSlugs.filter((a) =>
        tool.tags.some((tag) => normalize(tag).length >= 4 && a.slug.includes(normalize(tag))),
      )
      for (const article of tagHits.slice(0, 3)) {
        report.candidatesNeedingReview.push({
          toolId: tool.id,
          articleUrl: article.url,
          reason: 'khớp theo tag — cần người duyệt xác nhận',
        })
      }
    }
  }

  return report
}

const isDirectRun = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  const root = ROOT
  sync(root)
    .then((report) => {
      const out = join(root, 'data/generated/xomcoding-report.json')
      writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`)
      console.log(`✓ Sitemap fetched: ${report.sitemapFetched}`)
      console.log(`  Khớp chắc chắn: ${report.matched.length}`)
      console.log(`  Cần duyệt: ${report.candidatesNeedingReview.length}`)
      console.log(`  Liên kết thủ công được giữ nguyên: ${report.manualLinksPreserved.length}`)
      console.log(`  Báo cáo: data/generated/xomcoding-report.json`)
      if (report.matched.length > 0) {
        console.log('  (Report không tự ghi đè data/tools — maintainer tự cập nhật JSON thủ công.)')
      }
    })
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
