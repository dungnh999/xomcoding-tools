import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  STATUS_VALUES,
  validateToolRecord as validateToolRecordPure,
  validateTools as validateToolsPure,
  type CategoryRecord as CategoryRecordPure,
  type ToolRecord as ToolRecordPure,
} from '../src/validation/toolRecord.ts'

export type ToolRecord = ToolRecordPure
export type CategoryRecord = CategoryRecordPure
export const validateToolRecord = validateToolRecordPure
export const validateTools = validateToolsPure
export * from '../src/validation/toolRecord.ts'

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8'))
}

/**
 * Chạy validation trực tiếp trên data/.
 * Thiếu file icon chỉ là warning — site fallback sang icon chữ (không chặn PR).
 */
export function validateData(root = process.cwd()): {
  errors: string[]
  warnings: string[]
  toolCount: number
  categoryCount: number
} {
  const errors: string[] = []
  const warnings: string[] = []

  const categoriesPath = join(root, 'data/categories.json')
  const categories = readJson(categoriesPath) as CategoryRecord[]

  const toolsDir = join(root, 'data/tools')
  const files = readdirSync(toolsDir).filter((f) => f.endsWith('.json'))
  const tools: ToolRecord[] = []

  for (const file of files) {
    try {
      const parsed = readJson(join(toolsDir, file))
      tools.push(parsed as ToolRecord)
      const record = parsed as ToolRecord
      const iconPath = join(root, 'public', String(record.icon ?? '').replace(/^\//, ''))
      if (typeof record.icon === 'string' && record.icon.startsWith('/icons/') && !existsSync(iconPath)) {
        warnings.push(`${record.id}: chưa có file icon public${record.icon} (site hiển thị icon chữ thay thế)`)
      }
    } catch (error) {
      errors.push(`${file}: JSON không hợp lệ (${(error as Error).message})`)
    }
  }

  const statusPath = join(root, 'data/generated/tool-status.json')
  try {
    const statusMap = readJson(statusPath) as Record<string, { status?: string }>
    const ids = new Set(tools.map((t) => t.id))
    for (const [key, value] of Object.entries(statusMap)) {
      if (!ids.has(key)) errors.push(`tool-status.json: "${key}" không khớp tool nào`)
      if (!STATUS_VALUES.includes(value.status ?? '')) {
        errors.push(`tool-status.json: "${key}" có status không hợp lệ`)
      }
    }
  } catch (error) {
    errors.push(`tool-status.json: JSON không hợp lệ (${(error as Error).message})`)
  }

  errors.push(...validateTools(tools, categories))

  return { errors, warnings, toolCount: tools.length, categoryCount: categories.length }
}

const isDirectRun =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  const result = validateData()
  for (const warning of result.warnings) console.warn(`  ⚠ ${warning}`)
  if (result.errors.length > 0) {
    console.error(`✗ Validate thất bại (${result.errors.length} lỗi):`)
    for (const error of result.errors) console.error(`  - ${error}`)
    process.exit(1)
  }
  console.log(
    `✓ Validate OK: ${result.toolCount} công cụ, ${result.categoryCount} danh mục, 0 lỗi${result.warnings.length ? `, ${result.warnings.length} warning` : ''}.`,
  )
}
