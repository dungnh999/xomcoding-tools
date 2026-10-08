import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { validateData } from './validate-tools.ts'

/**
 * Gộp data/tools/*.json + trạng thái kiểm tra tự động
 * thành data/generated/tools.json (artifact cho công cụ ngoài /
 * bước prerender sau này). Luôn validate trước khi ghi.
 */
function generate(root = process.cwd()): void {
  const result = validateData(root)
  if (result.errors.length > 0) {
    console.error(`✗ Dữ liệu lỗi, không thể generate (${result.errors.length}):`)
    for (const error of result.errors) console.error(`  - ${error}`)
    process.exit(1)
  }

  const status = JSON.parse(
    readFileSync(join(root, 'data/generated/tool-status.json'), 'utf8'),
  ) as Record<string, { status?: string; lastChecked?: string | null; httpStatus?: number | null }>

  const tools = readdirSync(join(root, 'data/tools'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(root, 'data/tools', f), 'utf8')) as Record<string, unknown>)
    .sort((a, b) => String(a.id).localeCompare(String(b.id)))
    .map((tool) => {
      const check = status[String(tool.id)]
      return {
        ...tool,
        status: check?.status ?? tool.status ?? 'unknown',
        lastChecked: check?.lastChecked ?? tool.lastChecked ?? null,
      }
    })

  const output = {
    generatedAt: new Date().toISOString(),
    count: tools.length,
    tools,
  }

  writeFileSync(join(root, 'data/generated/tools.json'), `${JSON.stringify(output, null, 2)}\n`)
  console.log(`✓ Đã ghi data/generated/tools.json (${tools.length} công cụ).`)
}

const isDirectRun = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) generate()
