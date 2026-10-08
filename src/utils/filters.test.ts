import { describe, expect, it } from 'vitest'
import type { Category, Tool } from '../types/tool'
import { DEFAULT_FILTERS, countByCategory, filterTools, matchesFilters, type FilterState } from './filters'

const categories: Category[] = [
  { id: 'devops', name: 'DevOps', icon: 'infinity', order: 1 },
  { id: 'frontend', name: 'Frontend', icon: 'monitor', order: 2 },
]
const categoryMap = new Map(categories.map((c) => [c.id, c]))

function makeTool(overrides: Partial<Tool>): Tool {
  return {
    id: 'docker',
    name: 'Docker',
    slug: 'docker',
    category: 'devops',
    shortDescription: 'Container Platform',
    description: 'Đóng gói container.',
    icon: '/icons/docker.svg',
    website: 'https://www.docker.com/',
    github: null,
    pricing: 'freemium',
    openSource: true,
    status: 'unknown',
    lastChecked: null,
    xomcodingUrl: null,
    tags: ['container'],
    ...overrides,
  }
}

const docker = makeTool({})
const react = makeTool({
  id: 'react',
  name: 'React',
  slug: 'react',
  category: 'frontend',
  pricing: 'free',
  openSource: true,
  status: 'active',
  xomcodingUrl: 'https://xomcoding.me/react-la-gi',
  description: 'Thư viện giao diện.',
  tags: ['ui'],
})
const paid = makeTool({
  id: 'claude-code',
  name: 'Claude Code',
  slug: 'claude-code',
  pricing: 'paid',
  openSource: false,
  status: 'inactive',
  website: 'https://www.anthropic.com/claude-code',
  description: 'Coding agent.',
})

const all = [docker, react, paid]

describe('matchesFilters', () => {
  it('mặc định cho qua tất cả', () => {
    expect(matchesFilters(docker, DEFAULT_FILTERS, categoryMap)).toBe(true)
  })

  it('lọc theo category', () => {
    expect(matchesFilters(docker, { ...DEFAULT_FILTERS, category: 'frontend' }, categoryMap)).toBe(false)
    expect(matchesFilters(react, { ...DEFAULT_FILTERS, category: 'frontend' }, categoryMap)).toBe(true)
  })

  it('lọc theo status', () => {
    expect(matchesFilters(react, { ...DEFAULT_FILTERS, status: 'active' }, categoryMap)).toBe(true)
    expect(matchesFilters(docker, { ...DEFAULT_FILTERS, status: 'active' }, categoryMap)).toBe(false)
  })

  it('lọc theo pricing', () => {
    expect(matchesFilters(paid, { ...DEFAULT_FILTERS, pricing: 'paid' }, categoryMap)).toBe(true)
    expect(matchesFilters(docker, { ...DEFAULT_FILTERS, pricing: 'paid' }, categoryMap)).toBe(false)
  })

  it('lọc open source và bài viết Xóm Coding', () => {
    expect(matchesFilters(docker, { ...DEFAULT_FILTERS, openSource: false }, categoryMap)).toBe(true)
    expect(matchesFilters(paid, { ...DEFAULT_FILTERS, openSource: true }, categoryMap)).toBe(false)
    expect(matchesFilters(react, { ...DEFAULT_FILTERS, xomOnly: true }, categoryMap)).toBe(true)
    expect(matchesFilters(docker, { ...DEFAULT_FILTERS, xomOnly: true }, categoryMap)).toBe(false)
  })

  it('tìm kiếm tiếng Việt không dấu trong name và description', () => {
    expect(matchesFilters(docker, { ...DEFAULT_FILTERS, search: 'dong goi' }, categoryMap)).toBe(true)
    expect(matchesFilters(docker, { ...DEFAULT_FILTERS, search: 'doker' }, categoryMap)).toBe(false)
  })

  it('kết hợp nhiều bộ lọc', () => {
    const filters: FilterState = { ...DEFAULT_FILTERS, category: 'frontend', status: 'active', pricing: 'free' }
    expect(matchesFilters(react, filters, categoryMap)).toBe(true)
    expect(matchesFilters(docker, filters, categoryMap)).toBe(false)
  })
})

describe('filterTools + countByCategory', () => {
  it('lọc danh sách và đếm theo category', () => {
    expect(filterTools(all, { ...DEFAULT_FILTERS, status: 'unknown' }, categoryMap)).toHaveLength(1)
    expect(filterTools(all, DEFAULT_FILTERS, categoryMap)).toHaveLength(3)

    const counts = countByCategory(all)
    expect(counts.get('devops')).toBe(2)
    expect(counts.get('frontend')).toBe(1)
    expect(counts.get('security')).toBeUndefined()
  })
})
