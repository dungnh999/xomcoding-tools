import { describe, expect, it } from 'vitest'
import type { Category, Tool } from '../types/tool'
import { getCategoryName, getToolDescription, getToolShortDescription } from './localize'

describe('localize', () => {
  const tool = {
    name: 'Docker',
    shortDescription: 'Container Platform',
    shortDescriptionEn: 'Container Platform',
    shortDescriptionVi: 'Nền tảng container',
    description: 'Đóng gói và triển khai ứng dụng bằng container.',
    descriptionEn: 'Package and deploy applications with containers.',
    descriptionVi: 'Đóng gói và triển khai ứng dụng bằng container.',
  } as Tool

  it('ưu tiên bản dịch đúng ngôn ngữ', () => {
    expect(getToolShortDescription(tool, 'vi')).toBe('Nền tảng container')
    expect(getToolDescription(tool, 'en')).toBe('Package and deploy applications with containers.')
  })

  it('fallback về field cũ khi thiếu bản dịch', () => {
    const category = { name: 'Developer Tools' } as Category
    expect(getCategoryName(category, 'vi')).toBe('Developer Tools')
  })
})
