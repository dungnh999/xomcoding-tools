import type { Category, Tool } from '../types/tool'

/** Bỏ dấu tiếng Việt, chuyển về chữ thường, loại khoảng trắng thừa. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim()
}

export function buildSearchText(tool: Tool, category?: Category): string {
  return normalize(
    [tool.name, tool.shortDescription, tool.description, category?.name ?? '', ...tool.tags].join(' '),
  )
}

/**
 * Tìm kiếm không phân biệt hoa/thường, không dấu tiếng Việt.
 * Mọi từ trong truy vấn phải khớp (AND).
 */
export function matchesQuery(haystack: string, query: string): boolean {
  const tokens = normalize(query).split(' ').filter(Boolean)
  if (tokens.length === 0) return true
  const hay = normalize(haystack)
  return tokens.every((token) => hay.includes(token))
}
