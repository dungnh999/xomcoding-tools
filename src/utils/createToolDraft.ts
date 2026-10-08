import {
  canonicalUrl,
  validateToolRecord,
  type CategoryRecord,
} from '../validation/toolRecord'
import type { Pricing, Tool } from '../types/tool'

export interface ToolDraft {
  id: string
  name: string
  category: string
  shortDescription: string
  description: string
  website: string
  github: string
  pricing: Pricing
  openSource: boolean
  tags: string
  xomcodingUrl: string
  icon: string
}

export function emptyDraft(): ToolDraft {
  return {
    id: '',
    name: '',
    category: '',
    shortDescription: '',
    description: '',
    website: '',
    github: '',
    pricing: 'free',
    openSource: false,
    tags: '',
    xomcodingUrl: '',
    icon: '',
  }
}

/** "GitHub Actions" → "github-actions" (bỏ dấu tiếng Việt). */
export function slugifyId(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

function parseTags(tags: string): string[] {
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function toRecord(draft: ToolDraft) {
  return {
    id: draft.id.trim(),
    name: draft.name.trim(),
    slug: draft.id.trim(),
    category: draft.category,
    shortDescription: draft.shortDescription.trim(),
    description: draft.description.trim(),
    icon: draft.icon.trim() || `/icons/${draft.id.trim()}.svg`,
    website: draft.website.trim(),
    github: draft.github.trim() || null,
    pricing: draft.pricing,
    openSource: draft.openSource,
    status: 'unknown',
    lastChecked: null,
    xomcodingUrl: draft.xomcodingUrl.trim() || null,
    tags: parseTags(draft.tags),
  }
}

/** Nội dung JSON sẽ đẩy lên GitHub — status luôn là unknown (không tự khai active). */
export function buildToolJson(draft: ToolDraft): string {
  return `${JSON.stringify(toRecord(draft), null, 2)}\n`
}

/**
 * Validate draft trên web: dùng chung quy tắc CI + kiểm tra trùng lặp
 * với dữ liệu hiện có (id, website, github).
 */
export function validateDraft(
  draft: ToolDraft,
  categories: CategoryRecord[],
  existingTools: Tool[],
): string[] {
  const id = draft.id.trim()
  if (id === '' || draft.name.trim() === '' || draft.category === '') {
    return ['Chưa điền đủ thông tin bắt buộc (tên, id, danh mục)']
  }

  const record = toRecord(draft)
  const errors = validateToolRecord(record, new Set(categories.map((c) => c.id)), `${id}.json`)

  const dupId = existingTools.find((t) => t.id === id)
  if (dupId) errors.push(`Đã tồn tại tool với id "${id}" (${dupId.name})`)

  if (draft.website.trim()) {
    try {
      const canonical = canonicalUrl(draft.website.trim())
      const dup = existingTools.find((t) => {
        try {
          return canonicalUrl(t.website) === canonical
        } catch {
          return false
        }
      })
      if (dup) errors.push(`Website đã có trong tool "${dup.name}"`)
    } catch {
      /* lỗi URL đã báo ở validateToolRecord */
    }
  }

  if (draft.github.trim()) {
    const normalized = draft.github.trim().replace(/\/$/, '').toLowerCase()
    const dup = existingTools.find((t) => t.github?.replace(/\/$/, '').toLowerCase() === normalized)
    if (dup) errors.push(`GitHub repo đã có trong tool "${dup.name}"`)
  }

  return errors
}

/** URL trang "tạo file mới" của GitHub với nội dung đã điền sẵn. */
export function githubNewFileUrl(repo: string, filePath: string, content: string): string {
  const base = repo.replace(/\/$/, '')
  const params = new URLSearchParams({ filename: filePath, value: content })
  return `${base}/new/main?${params.toString()}`
}

/** SVG icon chữ cái tạm thời — commit cùng PR thay vì để thiếu file icon. */
export function placeholderIconSvg(name: string): string {
  const letter = name.trim().charAt(0).toUpperCase() || 'T'
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="' + name + '">',
    '  <rect width="64" height="64" rx="14" fill="#a52a26"/>',
    `  <text x="32" y="43" font-family="Inter, Arial, sans-serif" font-size="32" font-weight="700" fill="#ffffff" text-anchor="middle">${letter}</text>`,
    '</svg>',
    '',
  ].join('\n')
}
