import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { basename, join, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'

export interface ToolRecord {
  id: string
  name: string
  slug: string
  category: string
  shortDescription: string
  description: string
  icon: string
  website: string
  github: string | null
  pricing: string
  openSource: boolean
  status: string
  lastChecked: string | null
  xomcodingUrl: string | null
  tags: string[]
}

export interface CategoryRecord {
  id: string
  name: string
  icon: string
  order: number
}

export const PRICING_VALUES = ['free', 'freemium', 'paid']
export const STATUS_VALUES = ['active', 'inactive', 'unknown']
export const ALLOWED_URL_PROTOCOLS = ['https:', 'http:']
const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
const MAX_TEXT = {
  name: 60,
  shortDescription: 140,
  description: 300,
} as const

const REQUIRED_FIELDS = [
  'id',
  'name',
  'slug',
  'category',
  'shortDescription',
  'description',
  'icon',
  'website',
  'pricing',
  'openSource',
  'status',
  'tags',
] as const

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function containsMarkup(value: string): boolean {
  return /<\s*\/?\s*(script|iframe|object|embed|img|svg|style|a|div|span|link)\b/i.test(value) || /javascript:/i.test(value)
}

function checkUrl(url: unknown, field: string, id: string, errors: string[]): void {
  if (url === null) return
  if (typeof url !== 'string') {
    errors.push(`${id}: trường "${field}" phải là chuỗi URL hoặc null`)
    return
  }
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    errors.push(`${id}: trường "${field}" không phải URL hợp lệ: ${url}`)
    return
  }
  if (!ALLOWED_URL_PROTOCOLS.includes(parsed.protocol)) {
    errors.push(`${id}: trường "${field}" dùng giao thức không được phép: ${parsed.protocol}`)
  }
}

function canonicalUrl(url: string): string {
  const parsed = new URL(url)
  const host = parsed.hostname.toLowerCase().replace(/^www\./, '')
  const path = parsed.pathname.replace(/\/+$/, '')
  return `${host}${path}${parsed.search}`
}

/** Validate một bản ghi tool đơn lẻ. */
export function validateToolRecord(
  record: unknown,
  categoryIds: Set<string>,
  fileName?: string,
): string[] {
  const errors: string[] = []

  if (!isPlainObject(record)) {
    errors.push(`${fileName ?? '?'}: nội dung JSON phải là object`)
    return errors
  }

  const id = typeof record.id === 'string' ? record.id : fileName ?? '?'

  for (const field of REQUIRED_FIELDS) {
    if (!(field in record)) errors.push(`${id}: thiếu trường bắt buộc "${field}"`)
  }

  for (const field of ['name', 'shortDescription', 'description'] as const) {
    const value = record[field]
    if (typeof value !== 'string' || value.trim() === '') {
      errors.push(`${id}: trường "${field}" phải là chuỗi không rỗng`)
      continue
    }
    if (value.length > MAX_TEXT[field]) {
      errors.push(`${id}: trường "${field}" vượt quá ${MAX_TEXT[field]} ký tự`)
    }
    if (containsMarkup(value)) {
      errors.push(`${id}: trường "${field}" không được chứa HTML/script`)
    }
  }

  if (typeof record.id !== 'string' || !ID_PATTERN.test(record.id)) {
    errors.push(`${id}: "id" phải là chuỗi lowercase với dấu gạch nối (vd: github-actions)`)
  }
  if (record.slug !== record.id) {
    errors.push(`${id}: "slug" phải trùng với "id"`)
  }
  if (fileName !== undefined && basename(fileName, '.json') !== record.id) {
    errors.push(`${fileName}: tên file phải trùng với trường "id"`)
  }

  if (typeof record.category !== 'string' || !categoryIds.has(record.category)) {
    errors.push(`${id}: category "${String(record.category)}" không tồn tại trong categories.json`)
  }

  if (typeof record.pricing !== 'string' || !PRICING_VALUES.includes(record.pricing)) {
    errors.push(`${id}: pricing phải là một trong ${PRICING_VALUES.join(', ')}`)
  }
  if (typeof record.status !== 'string' || !STATUS_VALUES.includes(record.status)) {
    errors.push(`${id}: status phải là một trong ${STATUS_VALUES.join(', ')}`)
  }
  if (typeof record.openSource !== 'boolean') {
    errors.push(`${id}: "openSource" phải là boolean`)
  }
  if (record.lastChecked !== null && typeof record.lastChecked !== 'string') {
    errors.push(`${id}: "lastChecked" phải là chuỗi ISO hoặc null`)
  }

  checkUrl(record.website, 'website', id, errors)
  checkUrl(record.github, 'github', id, errors)
  checkUrl(record.xomcodingUrl, 'xomcodingUrl', id, errors)

  if (typeof record.icon !== 'string') {
    errors.push(`${id}: "icon" phải là chuỗi`)
  } else {
    const iconsRoot = resolve(process.cwd(), 'public/icons')
    const iconPath = resolve(process.cwd(), 'public', record.icon.replace(/^\//, ''))
    const insideIcons = iconPath.startsWith(iconsRoot + sep)
    if (!record.icon.startsWith('/icons/') || !insideIcons) {
      errors.push(`${id}: "icon" phải nằm trong /icons/ (không được chứa path traversal)`)
    }
  }

  if (!Array.isArray(record.tags) || record.tags.some((t) => typeof t !== 'string')) {
    errors.push(`${id}: "tags" phải là mảng chuỗi`)
  }

  return errors
}

/** Validate toàn bộ danh sách tool: trùng lặp, category, file icon. */
export function validateTools(tools: ToolRecord[], categories: CategoryRecord[]): string[] {
  const errors: string[] = []
  const categoryIds = new Set(categories.map((c) => c.id))

  if (categoryIds.size !== categories.length) {
    errors.push('categories.json: có id trùng lặp')
  }
  for (const category of categories) {
    if (!ID_PATTERN.test(category.id)) {
      errors.push(`categories.json: id "${category.id}" không hợp lệ`)
    }
    if (typeof category.order !== 'number') {
      errors.push(`categories.json: "${category.id}" phải có "order" là số`)
    }
  }

  const seenId = new Map<string, string>()
  const seenSlug = new Map<string, string>()
  const seenWebsite = new Map<string, string>()
  const seenGithub = new Map<string, string>()

  for (const tool of tools) {
    errors.push(...validateToolRecord(tool, categoryIds))

    const prevId = seenId.get(tool.id)
    if (prevId) errors.push(`trùng id "${tool.id}" giữa "${prevId}" và "${tool.name}"`)
    else seenId.set(tool.id, tool.name)

    const prevSlug = seenSlug.get(tool.slug)
    if (prevSlug) errors.push(`trùng slug "${tool.slug}" giữa "${prevSlug}" và "${tool.name}"`)
    else seenSlug.set(tool.slug, tool.name)

    if (typeof tool.website === 'string' && tool.website.length > 0) {
      try {
        const canonical = canonicalUrl(tool.website)
        const prev = seenWebsite.get(canonical)
        if (prev) errors.push(`trùng website "${tool.website}" giữa "${prev}" và "${tool.name}"`)
        else seenWebsite.set(canonical, tool.name)
      } catch {
        /* lỗi URL đã được báo ở checkUrl */
      }
    }

    if (tool.github) {
      const prev = seenGithub.get(tool.github.replace(/\/$/, '').toLowerCase())
      if (prev) errors.push(`trùng github "${tool.github}" giữa "${prev}" và "${tool.name}"`)
      else seenGithub.set(tool.github.replace(/\/$/, '').toLowerCase(), tool.name)
    }
  }

  return errors
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8'))
}

/** Chạy validation trực tiếp trên data/. */
export function validateData(root = process.cwd()): { errors: string[]; toolCount: number; categoryCount: number } {
  const errors: string[] = []

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
        errors.push(`${record.id}: file icon không tồn tại tại public${record.icon}`)
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

  return { errors, toolCount: tools.length, categoryCount: categories.length }
}

const isDirectRun =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  const result = validateData()
  if (result.errors.length > 0) {
    console.error(`✗ Validate thất bại (${result.errors.length} lỗi):`)
    for (const error of result.errors) console.error(`  - ${error}`)
    process.exit(1)
  }
  console.log(
    `✓ Validate OK: ${result.toolCount} công cụ, ${result.categoryCount} danh mục, 0 lỗi.`,
  )
}
