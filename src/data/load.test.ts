import { describe, expect, it } from 'vitest'
import { categories, categoryMap, stats, tools } from './load'

const VALID_STATUS = ['active', 'inactive', 'unknown']
const VALID_PRICING = ['free', 'freemium', 'paid']

describe('load dữ liệu từ data/', () => {
  it('nạp danh mục và sắp xếp theo order', () => {
    expect(categories.length).toBeGreaterThan(0)
    const orders = categories.map((c) => c.order)
    expect(orders).toEqual([...orders].sort((a, b) => a - b))
    expect(categoryMap.size).toBe(categories.length)
  })

  it('nạp tool với trạng thái hợp lệ (fallback unknown khi chưa kiểm tra)', () => {
    expect(tools.length).toBeGreaterThan(0)
    for (const tool of tools) {
      expect(VALID_STATUS).toContain(tool.status)
      expect(VALID_PRICING).toContain(tool.pricing)
      expect(categoryMap.has(tool.category)).toBe(true)
      expect(tool.icon.startsWith('/icons/')).toBe(true)
      expect(tool.lastChecked === null || typeof tool.lastChecked === 'string').toBe(true)
    }
  })

  it('stats khớp với dữ liệu thực tế, không hardcode', () => {
    expect(stats.total).toBe(tools.length)
    expect(stats.categories).toBe(categories.length)
    expect(stats.active).toBe(tools.filter((t) => t.status === 'active').length)
    expect(stats.unknown).toBe(tools.filter((t) => t.status === 'unknown').length)
    expect(stats.active + stats.inactive + stats.unknown).toBe(stats.total)
  })

  it('không có id trùng', () => {
    const ids = tools.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
