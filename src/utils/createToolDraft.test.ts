import { describe, expect, it } from 'vitest'
import type { CategoryRecord } from '../validation/toolRecord'
import type { Tool } from '../types/tool'
import {
  buildToolJson,
  emptyDraft,
  githubNewFileUrl,
  placeholderIconSvg,
  slugifyId,
  validateDraft,
  type ToolDraft,
} from './createToolDraft'

const categories: CategoryRecord[] = [
  { id: 'devops', name: 'DevOps', icon: 'infinity', order: 1 },
]

const existing: Tool[] = [
  {
    id: 'docker',
    name: 'Docker',
    slug: 'docker',
    category: 'devops',
    shortDescription: 'Container Platform',
    description: 'Đóng gói ứng dụng bằng container.',
    icon: '/icons/docker.svg',
    website: 'https://www.docker.com/',
    github: 'https://github.com/docker',
    pricing: 'freemium',
    openSource: true,
    status: 'active',
    lastChecked: '2026-10-08T00:00:00Z',
    xomcodingUrl: null,
    tags: ['container'],
  },
]

function validDraft(overrides: Partial<ToolDraft> = {}): ToolDraft {
  return {
    id: 'my-tool',
    name: 'My Tool',
    category: 'devops',
    shortDescription: 'Công cụ thử nghiệm',
    description: 'Mô tả chi tiết về công cụ thử nghiệm.',
    website: 'https://mytool.dev/',
    github: '',
    pricing: 'free',
    openSource: false,
    tags: 'test,工具', // sẽ không dùng ký tự này trong JSON — parseTags giữ nguyên
    xomcodingUrl: '',
    icon: '/icons/my-tool.svg',
    ...overrides,
  }
}

describe('slugifyId', () => {
  it('chuyển tên thường thành id lowercase', () => {
    expect(slugifyId('GitHub Actions')).toBe('github-actions')
    expect(slugifyId('  Tailwind CSS  ')).toBe('tailwind-css')
  })

  it('bỏ dấu tiếng Việt và chữ đặc biệt', () => {
    expect(slugifyId('Dữ liệu không dấu')).toBe('du-lieu-khong-dau')
    expect(slugifyId('ĐẶC BIỆT')).toBe('dac-biet')
    expect(slugifyId('C++ & Rust!')).toBe('c-rust')
  })

  it('trả về chuỗi rỗng cho tên toàn ký tự đặc biệt', () => {
    expect(slugifyId('!!!')).toBe('')
  })
})

describe('buildToolJson', () => {
  it('sinh JSON đúng schema, status unknown, slug trùng id', () => {
    const json = buildToolJson(validDraft())
    const parsed = JSON.parse(json)

    expect(parsed.slug).toBe('my-tool')
    expect(parsed.status).toBe('unknown')
    expect(parsed.lastChecked).toBeNull()
    expect(parsed.tags).toEqual(['test', '工具'])
    expect(parsed.github).toBeNull()
    expect(parsed.icon).toBe('/icons/my-tool.svg')
    expect(json.endsWith('\n')).toBe(true)
  })
})

describe('githubNewFileUrl', () => {
  it('tạo URL trang tạo file mới với filename và value', () => {
    const url = githubNewFileUrl(
      'https://github.com/dungnh999/xomcoding-tools/',
      'data/tools/my-tool.json',
      '{\n  "id": "my-tool"\n}\n',
    )
    const parsed = new URL(url)
    expect(parsed.origin + parsed.pathname).toBe(
      'https://github.com/dungnh999/xomcoding-tools/new/main',
    )
    expect(parsed.searchParams.get('filename')).toBe('data/tools/my-tool.json')
    expect(parsed.searchParams.get('value')).toBe('{\n  "id": "my-tool"\n}\n')
  })
})

describe('placeholderIconSvg', () => {
  it('sinh SVG chữ cái đầu của tên tool', () => {
    const svg = placeholderIconSvg('Docker')
    expect(svg).toContain('<svg')
    expect(svg).toContain('>D</text>')
    expect(svg).toContain('#a52a26')
  })
})

describe('validateDraft', () => {
  it('chấp nhận draft hợp lệ', () => {
    expect(validateDraft(validDraft(), categories, existing)).toEqual([])
  })

  it('báo thiếu tên/id/danh mục', () => {
    const errors = validateDraft(emptyDraft(), categories, existing)
    expect(errors[0]).toContain('Chưa điền đủ')
  })

  it('phát hiện id trùng với tool hiện có', () => {
    const errors = validateDraft(validDraft({ id: 'docker' }), categories, existing)
    expect(errors.some((e) => e.includes('Đã tồn tại tool với id "docker"'))).toBe(true)
  })

  it('phát hiện website trùng bất kể www và dấu / cuối', () => {
    const errors = validateDraft(
      validDraft({ website: 'https://www.docker.com' }),
      categories,
      existing,
    )
    expect(errors.some((e) => e.includes('Website đã có trong tool'))).toBe(true)
  })

  it('phát hiện github trùng', () => {
    const errors = validateDraft(
      validDraft({ github: 'https://github.com/docker/' }),
      categories,
      existing,
    )
    expect(errors.some((e) => e.includes('GitHub repo đã có'))).toBe(true)
  })

  it('chặn HTML trong mô tả', () => {
    const errors = validateDraft(
      validDraft({ description: '<script>alert(1)</script>' }),
      categories,
      existing,
    )
    expect(errors.some((e) => e.includes('HTML/script'))).toBe(true)
  })

  it('chặn URL javascript', () => {
    const errors = validateDraft(validDraft({ website: 'javascript:alert(1)' }), categories, existing)
    expect(errors.some((e) => e.includes('giao thức không được phép') || e.includes('không phải URL'))).toBe(
      true,
    )
  })
})
