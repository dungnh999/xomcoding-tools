// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import { ToolIcon } from './ToolIcon'

let container: HTMLDivElement | null = null
let root: Root | null = null

function render(node: React.ReactNode) {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(node)
  })
}

afterEach(() => {
  act(() => root?.unmount())
  container?.remove()
  container = null
  root = null
})

describe('ToolIcon', () => {
  it('render ảnh icon khi load thành công', () => {
    render(<ToolIcon icon="/icons/docker.svg" name="Docker" />)
    const img = document.querySelector('img')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('src')).toContain('icons/docker.svg')
    expect(img?.getAttribute('loading')).toBe('lazy')
  })

  it('fallback sang chữ cái đầu khi icon lỗi, không vỡ giao diện', () => {
    render(<ToolIcon icon="/icons/thieu.svg" name="Supabase" />)
    const img = document.querySelector('img') as HTMLImageElement
    expect(img).not.toBeNull()

    act(() => {
      img.dispatchEvent(new Event('error'))
    })

    expect(document.querySelector('img')).toBeNull()
    const fallback = document.querySelector('span[aria-hidden="true"]')
    expect(fallback?.textContent).toBe('S')
  })
})
