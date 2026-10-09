/**
 * Quy tắc validation thuần (không phụ thuộc Node) cho bản ghi tool.
 * Dùng chung bởi: scripts/validate-tools.ts (CI) và form tạo tool trên web.
 */

export interface ToolRecord {
  id: string
  name: string
  nameEn?: string
  nameVi?: string
  slug: string
  category: string
  shortDescription: string
  shortDescriptionEn?: string
  shortDescriptionVi?: string
  description: string
  descriptionEn?: string
  descriptionVi?: string
  icon: string
  website: string
  affiliateUrl?: string | null
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
  nameEn?: string
  nameVi?: string
  icon: string
  order: number
}

export const PRICING_VALUES = ['free', 'freemium', 'paid']
export const STATUS_VALUES = ['active', 'inactive', 'unknown']
export const ALLOWED_URL_PROTOCOLS = ['https:', 'http:']
export const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
export const MAX_TEXT = {
  name: 60,
  shortDescription: 140,
  description: 300,
} as const

const LOCALIZED_TEXT_FIELDS = [
  ['nameEn', 'name'],
  ['nameVi', 'name'],
  ['shortDescriptionEn', 'shortDescription'],
  ['shortDescriptionVi', 'shortDescription'],
  ['descriptionEn', 'description'],
  ['descriptionVi', 'description'],
] as const

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

export function containsMarkup(value: string): boolean {
  return /<\s*\/?\s*(script|iframe|object|embed|img|svg|style|a|div|span|link)\b/i.test(value) || /javascript:/i.test(value)
}

function checkUrl(url: unknown, field: string, id: string, errors: string[]): void {
  if (url === undefined) return
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

export function canonicalUrl(url: string): string {
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

  for (const [field, limitKey] of LOCALIZED_TEXT_FIELDS) {
    const value = record[field]
    if (value === undefined) continue
    if (typeof value !== 'string' || value.trim() === '') {
      errors.push(`${id}: trường "${field}" phải là chuỗi không rỗng nếu được khai báo`)
      continue
    }
    if (value.length > MAX_TEXT[limitKey]) {
      errors.push(`${id}: trường "${field}" vượt quá ${MAX_TEXT[limitKey]} ký tự`)
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
  if (fileName !== undefined) {
    const base = fileName.split(/[\\/]/).pop() ?? fileName
    if (base.replace(/\.json$/, '') !== record.id) {
      errors.push(`${fileName}: tên file phải trùng với trường "id"`)
    }
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
  checkUrl(record.affiliateUrl, 'affiliateUrl', id, errors)
  checkUrl(record.github, 'github', id, errors)
  checkUrl(record.xomcodingUrl, 'xomcodingUrl', id, errors)

  if (typeof record.icon !== 'string') {
    errors.push(`${id}: "icon" phải là chuỗi`)
  } else if (!record.icon.startsWith('/icons/') || record.icon.includes('..') || record.icon.includes('\\')) {
    errors.push(`${id}: "icon" phải nằm trong /icons/ (không được chứa path traversal)`)
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
    for (const field of ['name', 'nameEn', 'nameVi'] as const) {
      const value = category[field]
      if (value === undefined) continue
      if (typeof value !== 'string' || value.trim() === '') {
        errors.push(`categories.json: "${category.id}" có "${field}" không hợp lệ`)
      } else if (value.length > MAX_TEXT.name || containsMarkup(value)) {
        errors.push(`categories.json: "${category.id}" có "${field}" không hợp lệ`)
      }
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
