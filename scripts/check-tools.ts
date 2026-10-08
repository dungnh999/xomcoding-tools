import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

interface ToolFile {
  id: string
  website: string
  status?: string
  lastChecked?: string | null
}

interface StatusEntry {
  status: 'active' | 'inactive' | 'unknown'
  lastChecked: string | null
  httpStatus: number | null
}

const ROOT = process.cwd()
const TOOLS_DIR = join(ROOT, 'data/tools')
const STATUS_FILE = join(ROOT, 'data/generated/tool-status.json')
const CONCURRENCY = 4
const TIMEOUT_MS = 10_000
const MAX_ATTEMPTS = 2

function loadTools(): ToolFile[] {
  return readdirSync(TOOLS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(TOOLS_DIR, f), 'utf8')) as ToolFile)
}

function loadPrevious(): Record<string, StatusEntry> {
  try {
    return JSON.parse(readFileSync(STATUS_FILE, 'utf8')) as Record<string, StatusEntry>
  } catch {
    return {}
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function probe(url: string): Promise<{ ok: boolean; httpStatus: number | null }> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'user-agent':
            'XomCodingDevTools-Bot/1.0 (+https://github.com/xomcoding/xomcoding-devtools)',
          accept: 'text/html,application/xhtml+xml',
        },
      })
      clearTimeout(timer)
      const httpStatus = response.status
      await response.body?.cancel().catch(() => undefined)
      // Chỉ xác nhận truy cập thành công với 2xx/3xx.
      // 403/429/5xx không phải bằng chứng dịch vụ ngừng hoạt động —
      // giữ nguyên trạng thái trước đó (không kết luận).
      if (response.ok) {
        return { ok: true, httpStatus }
      }
      if (attempt < MAX_ATTEMPTS) {
        await sleep(2000)
        continue
      }
      return { ok: false, httpStatus }
    } catch {
      clearTimeout(timer)
      if (attempt < MAX_ATTEMPTS) {
        await sleep(2000)
        continue
      }
      return { ok: false, httpStatus: null }
    }
  }
  return { ok: false, httpStatus: null }
}

async function run(): Promise<void> {
  const tools = loadTools()
  const previous = loadPrevious()
  const now = new Date().toISOString()
  const next: Record<string, StatusEntry> = {}

  let index = 0
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (index < tools.length) {
      const tool = tools[index++]
      const previousEntry = previous[tool.id]
      const priorStatus: StatusEntry['status'] =
        previousEntry?.status ?? (tool.status === 'active' || tool.status === 'inactive' ? tool.status : 'unknown')

      const { ok, httpStatus } = await probe(tool.website)

      // Chỉ xác nhận `active` khi truy cập thành công.
      // Thất bại một lần không đổi trạng thái — giữ nguyên trạng thái đã xác minh.
      next[tool.id] = {
        status: ok ? 'active' : priorStatus,
        lastChecked: now,
        httpStatus,
      }

      const mark = ok ? '✓' : '·'
      console.log(`${mark} ${tool.id.padEnd(20)} ${httpStatus ?? 'ERR'} ${tool.website}`)
    }
  })

  await Promise.all(workers)

  const sorted: Record<string, StatusEntry> = {}
  for (const tool of [...tools].sort((a, b) => a.id.localeCompare(b.id))) {
    if (next[tool.id]) sorted[tool.id] = next[tool.id]
  }

  writeFileSync(STATUS_FILE, `${JSON.stringify(sorted, null, 2)}\n`)

  const active = Object.values(sorted).filter((s) => s.status === 'active').length
  console.log(
    `\n✓ Đã kiểm tra ${Object.keys(sorted).length} công cụ — ${active} active, ${
      Object.keys(sorted).length - active
    } giữ nguyên trạng thái. Ghi vào data/generated/tool-status.json`,
  )
}

const isDirectRun = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  run().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
