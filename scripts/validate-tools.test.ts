import { describe, expect, it } from 'vitest'
import type { CategoryRecord, ToolRecord } from './validate-tools.ts'
import { validateToolRecord, validateTools } from './validate-tools.ts'

const categories: CategoryRecord[] = [
  { id: 'devops', name: 'DevOps', icon: 'infinity', order: 1 },
  { id: 'frontend', name: 'Frontend', icon: 'monitor', order: 2 },
]
const categoryIds = new Set(categories.map((c) => c.id))

function makeTool(overrides: Partial<ToolRecord> = {}): ToolRecord {
  return {
    id: 'docker',
    name: 'Docker',
    slug: 'docker',
    category: 'devops',
    shortDescription: 'Container Platform',
    description: 'Đóng gói và triển khai ứng dụng bằng container.',
    icon: '/icons/docker.svg',
    website: 'https://www.docker.com/',
    github: null,
    pricing: 'freemium',
    openSource: true,
    status: 'unknown',
    lastChecked: null,
    xomcodingUrl: null,
    tags: ['container', 'devops'],
    ...overrides,
  }
}

describe('validateToolRecord', () => {
  it('chấp nhận bản ghi hợp lệ', () => {
    expect(validateToolRecord(makeTool(), categoryIds)).toEqual([])
  })

  it('báo thiếu trường bắt buộc', () => {
    const tool = makeTool()
    delete (tool as Partial<ToolRecord>).website
    const errors = validateToolRecord(tool, categoryIds)
    expect(errors.some((e) => e.includes('thiếu trường bắt buộc "website"'))).toBe(true)
  })

  it('chặn URL nguy hiểm', () => {
    for (const url of ['javascript:alert(1)', 'data:text/html,<script>', 'file:///etc/passwd']) {
      const errors = validateToolRecord(makeTool({ website: url }), categoryIds)
      expect(errors.some((e) => e.includes('giao thức không được phép') || e.includes('không phải URL'))).toBe(true)
    }
  })

  it('chặn path traversal trong icon', () => {
    const errors = validateToolRecord(makeTool({ icon: '/icons/../../secret.svg' }), categoryIds)
    expect(errors.some((e) => e.includes('phải nằm trong /icons/'))).toBe(true)
  })

  it('chặn HTML/script trong trường text', () => {
    const errors = validateToolRecord(
      makeTool({ description: '<script>alert(1)</script> mô tả' }),
      categoryIds,
    )
    expect(errors.some((e) => e.includes('không được chứa HTML/script'))).toBe(true)
  })

  it('chặn category không tồn tại', () => {
    const errors = validateToolRecord(makeTool({ category: 'security' }), categoryIds)
    expect(errors.some((e) => e.includes('không tồn tại trong categories.json'))).toBe(true)
  })

  it('chặn pricing/status sai', () => {
    expect(
      validateToolRecord(makeTool({ pricing: 'cheap' as ToolRecord['pricing'] }), categoryIds).some((e) =>
        e.includes('pricing'),
      ),
    ).toBe(true)
    expect(
      validateToolRecord(makeTool({ status: 'dead' as ToolRecord['status'] }), categoryIds).some((e) =>
        e.includes('status'),
      ),
    ).toBe(true)
  })

  it('chặn slug khác id và tên file khác id', () => {
    const errors = validateToolRecord(makeTool({ slug: 'docker-2' }), categoryIds, 'docker.json')
    expect(errors.some((e) => e.includes('"slug" phải trùng với "id"'))).toBe(true)
    expect(validateToolRecord(makeTool(), categoryIds, 'other.json').some((e) => e.includes('tên file'))).toBe(
      true,
    )
  })

  it('chặn text vượt quá độ dài', () => {
    const errors = validateToolRecord(makeTool({ name: 'x'.repeat(61) }), categoryIds)
    expect(errors.some((e) => e.includes('vượt quá 60 ký tự'))).toBe(true)
  })
})

describe('validateTools', () => {
  it('phát hiện id trùng', () => {
    const errors = validateTools([makeTool(), makeTool({ name: 'Docker 2' })], categories)
    expect(errors.some((e) => e.includes('trùng id'))).toBe(true)
  })

  it('phát hiện slug trùng giữa hai tool', () => {
    const errors = validateTools(
      [makeTool(), makeTool({ id: 'docker-alt', slug: 'docker', website: 'https://example.com/' })],
      categories,
    )
    expect(errors.some((e) => e.includes('trùng slug'))).toBe(true)
  })

  it('phát hiện website trùng (bỏ www và dấu / cuối)', () => {
    const errors = validateTools(
      [
        makeTool(),
        makeTool({ id: 'docker-alt', slug: 'docker-alt', website: 'https://www.docker.com' }),
      ],
      categories,
    )
    expect(errors.some((e) => e.includes('trùng website'))).toBe(true)
  })

  it('chấp nhận danh sách không trùng lặp', () => {
    const errors = validateTools(
      [makeTool(), makeTool({ id: 'react', slug: 'react', category: 'frontend', website: 'https://react.dev/' })],
      categories,
    )
    expect(errors).toEqual([])
  })
})
