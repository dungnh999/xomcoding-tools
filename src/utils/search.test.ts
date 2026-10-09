import { describe, expect, it } from 'vitest'
import { buildSearchText, matchesQuery, normalize } from './search'
import type { Category, Tool } from '../types/tool'

describe('normalize', () => {
  it('bỏ dấu tiếng Việt và chuyển về chữ thường', () => {
    expect(normalize('Trình kiểm thử API')).toBe('trinh kiem thu api')
  })

  it('xử lý chữ đ', () => {
    expect(normalize('Đóng gói container')).toBe('dong goi container')
  })

  it('gộp khoảng trắng thừa', () => {
    expect(normalize('  Docker   image  ')).toBe('docker image')
  })
})

describe('matchesQuery', () => {
  it('không phân biệt hoa thường và dấu', () => {
    expect(matchesQuery(normalize('Cơ sở dữ liệu PostgreSQL'), 'co so du lieu')).toBe(true)
  })

  it('tất cả từ đều phải khớp (AND)', () => {
    const haystack = normalize('Docker container hóa ứng dụng')
    expect(matchesQuery(haystack, 'docker container')).toBe(true)
    expect(matchesQuery(haystack, 'docker kubernetes')).toBe(false)
  })

  it('truy vấn rỗng luôn khớp', () => {
    expect(matchesQuery('docker', '')).toBe(true)
    expect(matchesQuery('docker', '   ')).toBe(true)
  })

  it('tìm theo tag và tên', () => {
    expect(matchesQuery(normalize('GitHub Actions CI/CD automation'), 'github')).toBe(true)
    expect(matchesQuery(normalize('GitHub Actions CI/CD automation'), 'ci/cd')).toBe(true)
  })
})

describe('buildSearchText', () => {
  const category: Category = { id: 'devops', name: 'DevOps', icon: 'infinity', order: 1 }
  const tool: Tool = {
    id: 'docker',
    name: 'Docker',
    slug: 'docker',
    category: 'devops',
    shortDescription: 'Container Platform',
    shortDescriptionEn: 'Container Platform',
    shortDescriptionVi: 'Nền tảng container',
    description: 'Đóng gói và triển khai ứng dụng bằng container.',
    descriptionEn: 'Package and deploy applications with containers.',
    descriptionVi: 'Đóng gói và triển khai ứng dụng bằng container.',
    icon: '/icons/docker.svg',
    website: 'https://www.docker.com/',
    github: null,
    pricing: 'freemium',
    openSource: true,
    status: 'unknown',
    lastChecked: null,
    xomcodingUrl: null,
    tags: ['container', 'devops'],
  }

  it('ghép tên, mô tả, category và tags', () => {
    const text = buildSearchText(tool, category)
    expect(text).toContain('docker')
    expect(text).toContain('devops')
    expect(text).toContain('container')
    expect(text).toContain('dong goi')
    expect(text).toContain('package and deploy')
  })

  it('chạy ổn khi category không tồn tại', () => {
    expect(buildSearchText(tool, undefined)).toContain('docker')
  })
})
