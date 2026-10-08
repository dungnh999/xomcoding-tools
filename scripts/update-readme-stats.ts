import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const START = '<!-- STATS:START -->'
const END = '<!-- STATS:END -->'

/**
 * Cập nhật số liệu trong README.md từ dữ liệu thật
 * (data/tools + data/generated/tool-status.json).
 * Được chạy bởi workflow check-tools để README luôn khớp thực tế.
 */
export function updateReadmeStats(root = process.cwd()): string {
  const toolsDir = join(root, 'data/tools')
  const total = readdirSync(toolsDir).filter((f) => f.endsWith('.json')).length
  const categories = JSON.parse(readFileSync(join(root, 'data/categories.json'), 'utf8')) as unknown[]

  let statusMap: Record<string, { status?: string }> = {}
  try {
    statusMap = JSON.parse(readFileSync(join(root, 'data/generated/tool-status.json'), 'utf8'))
  } catch {
    statusMap = {}
  }

  let active = 0
  let inactive = 0
  for (const value of Object.values(statusMap)) {
    if (value.status === 'active') active++
    else if (value.status === 'inactive') inactive++
  }
  const unknown = Math.max(total - active - inactive, 0)

  const line = [
    `- **${total} tools** in **${categories.length} categories**`,
    `**${active} tools verified active**`,
    `${inactive} inactive`,
    `${unknown} awaiting first check`,
  ].join(' · ')

  const readmePath = join(root, 'README.md')
  const readme = readFileSync(readmePath, 'utf8')

  if (!readme.includes(START) || !readme.includes(END)) {
    throw new Error(`README.md thiếu marker ${START} / ${END}`)
  }

  const pattern = new RegExp(`${START}[\\s\\S]*?${END}`)
  const next = readme
    .replace(pattern, `${START}\n${line}\n${END}`)
    .replace(/tools-\d+/, `tools-${total}`)

  if (next !== readme) writeFileSync(readmePath, next)
  return line
}

const isDirectRun = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  const line = updateReadmeStats()
  console.log(`✓ README stats: ${line}`)
}
