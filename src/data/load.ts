import type { Category, GeneratedStatusMap, Tool } from '../types/tool'

const toolModules = import.meta.glob('../../data/tools/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, Tool>

const categoryModules = import.meta.glob('../../data/categories.json', {
  eager: true,
  import: 'default',
}) as Record<string, Category[]>

const statusModules = import.meta.glob('../../data/generated/tool-status.json', {
  eager: true,
  import: 'default',
}) as Record<string, GeneratedStatusMap>

function loadCategories(): Category[] {
  const entry = Object.values(categoryModules)[0]
  if (!entry) throw new Error('Không tìm thấy data/categories.json')
  return [...entry].sort((a, b) => a.order - b.order)
}

function loadGeneratedStatus(): GeneratedStatusMap {
  return Object.values(statusModules)[0] ?? {}
}

/**
 * Đọc dữ liệu từ data/tools/*.json và ghép trạng thái kiểm tra
 * tự động từ data/generated/tool-status.json.
 * Trạng thái từ file generated có quyền cao hơn; thiếu thì giữ `unknown`.
 */
function loadTools(categories: Category[]): Tool[] {
  const generated = loadGeneratedStatus()
  const validCategoryIds = new Set(categories.map((c) => c.id))

  return Object.values(toolModules)
    .map((tool) => {
      const check = generated[tool.id]
      return {
        ...tool,
        status: check?.status ?? tool.status ?? 'unknown',
        lastChecked: check?.lastChecked ?? tool.lastChecked ?? null,
      }
    })
    .filter((tool) => validCategoryIds.has(tool.category))
}

export const categories: Category[] = loadCategories()
export const categoryMap = new Map(categories.map((c) => [c.id, c]))
export const tools: Tool[] = loadTools(categories)

export const stats = {
  total: tools.length,
  categories: categories.length,
  active: tools.filter((t) => t.status === 'active').length,
  inactive: tools.filter((t) => t.status === 'inactive').length,
  unknown: tools.filter((t) => t.status === 'unknown').length,
}
