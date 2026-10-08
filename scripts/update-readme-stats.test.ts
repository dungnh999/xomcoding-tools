import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { updateReadmeStats } from './update-readme-stats.ts'

function fixture(activeCount: number) {
  const root = mkdtempSync(join(tmpdir(), 'readme-stats-'))
  mkdirSync(join(root, 'data/tools'), { recursive: true })
  mkdirSync(join(root, 'data/generated'), { recursive: true })

  for (const id of ['docker', 'react', 'vim']) {
    writeFileSync(join(root, 'data/tools', `${id}.json`), JSON.stringify({ id }))
  }
  writeFileSync(join(root, 'data/categories.json'), JSON.stringify([{ id: 'devops' }, { id: 'frontend' }]))

  const status: Record<string, { status: string }> = {}
  for (const id of ['docker', 'react'].slice(0, activeCount)) status[id] = { status: 'active' }
  writeFileSync(join(root, 'data/generated/tool-status.json'), JSON.stringify(status))

  writeFileSync(
    join(root, 'README.md'),
    [
      '[![Tools](https://img.shields.io/badge/tools-999-blue.svg)](https://example.com)',
      '',
      '## Live stats',
      '',
      '<!-- STATS:START -->',
      'nội dung cũ',
      '<!-- STATS:END -->',
    ].join('\n'),
  )
  return root
}

describe('updateReadmeStats', () => {
  it('ghi số liệu thật vào README giữa hai marker', () => {
    const root = fixture(2)
    const line = updateReadmeStats(root)
    const readme = readFileSync(join(root, 'README.md'), 'utf8')

    expect(line).toContain('**3 tools** in **2 categories**')
    expect(line).toContain('**2 tools verified active**')
    expect(line).toContain('1 awaiting first check')
    expect(readme).toContain('<!-- STATS:START -->\n- **3 tools**')
    expect(readme.includes('nội dung cũ')).toBe(false)
  })

  it('cập nhật badge tools-999 → số tool thực tế', () => {
    const root = fixture(0)
    updateReadmeStats(root)
    const readme = readFileSync(join(root, 'README.md'), 'utf8')
    expect(readme).toContain('tools-3-blue')
    expect(readme).not.toContain('tools-999')
  })

  it('báo lỗi khi README thiếu marker', () => {
    const root = fixture(1)
    writeFileSync(join(root, 'README.md'), '# README không có marker')
    expect(() => updateReadmeStats(root)).toThrow(/thiếu marker/)
  })
})
