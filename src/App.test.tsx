// @vitest-environment jsdom
import { StrictMode, act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import App from './App'

function renderApp(path: string, hash = ''): { host: HTMLElement; unmount: () => void } {
  window.history.replaceState(null, '', path)
  window.location.hash = hash
  const host = document.createElement('div')
  document.body.appendChild(host)
  const root = createRoot(host)
  act(() => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
  return { host, unmount: () => act(() => root.unmount()) }
}

describe('App routing', () => {
  it('render trang chủ mặc định', () => {
    const { host, unmount } = renderApp('/')
    expect(host.textContent).toContain('Developer tools for')
    expect(host.textContent).toContain('Suggest a tool through GitHub')
    expect(host.textContent).not.toContain('Edit new file')
    unmount()
  })

  it('đổi ngôn ngữ sang tiếng Việt', () => {
    const { host, unmount } = renderApp('/')
    const viButton = Array.from(host.querySelectorAll('button')).find((button) => button.textContent === 'VI')
    act(() => {
      viButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(host.textContent).toContain('Công cụ lập trình cho')
    unmount()
  })
})
