import { Search, X } from 'lucide-react'
import { forwardRef, useEffect, useRef } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { value, onChange },
  ref,
) {
  const innerRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing = target && ['INPUT', 'TEXTAREA'].includes(target.tagName)
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        innerRef.current?.focus()
        innerRef.current?.select()
      } else if (event.key === '/' && !typing) {
        event.preventDefault()
        innerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const setRefs = (node: HTMLInputElement | null) => {
    innerRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  return (
    <label className="mx-auto flex h-12 max-w-2xl items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 transition-colors focus-within:border-primary/70">
      <Search className="size-4.5 shrink-0 text-muted" aria-hidden="true" />
      <input
        ref={setRefs}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Tìm kiếm công cụ, danh mục, mục đích sử dụng..."
        aria-label="Tìm kiếm công cụ"
        autoComplete="off"
        className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-text outline-none placeholder:text-muted"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Xóa tìm kiếm"
          className="grid size-6 place-items-center rounded-md text-muted hover:bg-surface-hover hover:text-text"
        >
          <X className="size-4" />
        </button>
      ) : (
        <kbd className="hidden rounded-md border border-border bg-surface px-1.5 py-0.5 text-[11px] text-muted sm:block">
          /
        </kbd>
      )}
    </label>
  )
})
