import { Check, Copy, ExternalLink, GitPullRequestArrow, Plus, X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { categories, tools } from '../../data/load'
import { site } from '../../config/site'
import type { Pricing } from '../../types/tool'
import {
  buildToolJson,
  emptyDraft,
  githubNewFileUrl,
  placeholderIconSvg,
  slugifyId,
  validateDraft,
  type ToolDraft,
} from '../../utils/createToolDraft'
import { OpenSourceBadge, PricingBadge } from '../ui/Badge'
import { ToolIcon } from '../ui/ToolIcon'

const inputCls =
  'w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-muted/60 focus:border-primary-hover focus:outline-none focus:ring-2 focus:ring-primary-hover/30'

const PRICING_OPTIONS: { value: Pricing; label: string }[] = [
  { value: 'free', label: 'Free — miễn phí hoàn toàn' },
  { value: 'freemium', label: 'Freemium / Free Tier' },
  { value: 'paid', label: 'Paid — trả phí' },
]

const MAX_COUNTER = { shortDescription: 140, description: 300 } as const

function Field({
  label,
  required,
  hint,
  htmlFor,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  htmlFor: string
  children: ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-text">
        {label} {required && <span className="text-primary-hover">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  )
}

function Counter({ value, max }: { value: number; max: number }) {
  const over = value > max
  return (
    <span className={`float-right text-xs ${over ? 'text-inactive' : 'text-muted'}`}>
      {value}/{max}
    </span>
  )
}

export function ToolCreatorModal({ onClose }: { onClose: () => void }) {
  const [draft, setDraft] = useState<ToolDraft>(emptyDraft)
  const [idTouched, setIdTouched] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [copied, setCopied] = useState(false)

  const repo = site.repository?.replace(/\/$/, '') ?? null
  const id = idTouched ? draft.id : slugifyId(draft.name)
  const iconPath = id ? `/icons/${id}.svg` : '/icons/<id>.svg'

  const effectiveDraft: ToolDraft = { ...draft, id, icon: iconPath }
  const json = buildToolJson(effectiveDraft)
  const errors = validateDraft(effectiveDraft, categories, tools)
  const ready = errors.length === 0 && repo !== null

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const set = <K extends keyof ToolDraft>(key: K, value: ToolDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const openTab = (url: string) => window.open(url, '_blank', 'noopener,noreferrer')

  const handleCreate = () => {
    setShowErrors(true)
    if (!ready || !repo) return
    openTab(githubNewFileUrl(repo, `data/tools/${id}.json`, json))
    setStep(2)
  }

  const handleCreateIcon = () => {
    if (!repo || !id || draft.name.trim() === '') return
    openTab(githubNewFileUrl(repo, `public/icons/${id}.svg`, placeholderIconSvg(draft.name)))
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tool-creator-title"
        className="mx-auto my-6 w-full max-w-3xl rounded-xl border border-border bg-background shadow-2xl"
      >
        {/* Header kiểu GitHub */}
        <div className="flex items-start gap-3 border-b border-border bg-surface px-5 py-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-white">
            <Plus className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="tool-creator-title" className="text-base font-bold text-text">
              Tạo công cụ mới
            </h2>
            <p className="truncate font-mono text-xs text-muted">
              data/tools/{id || '<id>'}.json
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-text"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-5 py-5">
          {showErrors && errors.length > 0 && (
            <div role="alert" className="rounded-md border border-inactive/40 bg-inactive/10 px-4 py-3">
              <p className="text-[13px] font-bold text-inactive">
                Form còn {errors.length} lỗi cần sửa:
              </p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[13px] text-muted">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tên công cụ" required htmlFor="tc-name">
              <input
                id="tc-name"
                className={inputCls}
                value={draft.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Docker"
                maxLength={60}
              />
              <Counter value={draft.name.length} max={MAX_COUNTER.shortDescription} />
            </Field>

            <Field
              label="ID (không dấu, viết thường)"
              required
              htmlFor="tc-id"
              hint="Dùng cho tên file và slug — tự động tạo từ tên, có thể sửa."
            >
              <input
                id="tc-id"
                className={`${inputCls} font-mono`}
                value={id}
                onChange={(e) => {
                  setIdTouched(true)
                  set('id', e.target.value)
                }}
                placeholder="docker"
              />
            </Field>

            <Field label="Danh mục" required htmlFor="tc-category">
              <select
                id="tc-category"
                className={inputCls}
                value={draft.category}
                onChange={(e) => set('category', e.target.value)}
              >
                <option value="">— Chọn danh mục —</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Chi phí" required htmlFor="tc-pricing">
              <select
                id="tc-pricing"
                className={inputCls}
                value={draft.pricing}
                onChange={(e) => set('pricing', e.target.value as Pricing)}
              >
                {PRICING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <div className="sm:col-span-2">
              <Field label="Mô tả ngắn" required htmlFor="tc-short">
                <input
                  id="tc-short"
                  className={inputCls}
                  value={draft.shortDescription}
                  onChange={(e) => set('shortDescription', e.target.value)}
                  placeholder="Nền tảng container hóa ứng dụng."
                  maxLength={140}
                />
                <Counter value={draft.shortDescription.length} max={MAX_COUNTER.shortDescription} />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field
                label="Mô tả chi tiết"
                required
                htmlFor="tc-desc"
                hint="Chỉ text — không dùng HTML."
              >
                <textarea
                  id="tc-desc"
                  rows={2}
                  className={`${inputCls} resize-y`}
                  value={draft.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Đóng gói và triển khai ứng dụng bằng container."
                  maxLength={300}
                />
                <Counter value={draft.description.length} max={MAX_COUNTER.description} />
              </Field>
            </div>

            <Field label="Website" required htmlFor="tc-website">
              <input
                id="tc-website"
                type="url"
                className={`${inputCls} font-mono`}
                value={draft.website}
                onChange={(e) => set('website', e.target.value)}
                placeholder="https://www.docker.com/"
              />
            </Field>

            <Field label="GitHub repository" htmlFor="tc-github" hint="Nếu có — dự án open source.">
              <input
                id="tc-github"
                type="url"
                className={`${inputCls} font-mono`}
                value={draft.github}
                onChange={(e) => set('github', e.target.value)}
                placeholder="https://github.com/docker"
              />
            </Field>

            <Field
              label="Tags"
              htmlFor="tc-tags"
              hint="Phân cách bằng dấu phẩy — giúp tìm kiếm tốt hơn."
            >
              <input
                id="tc-tags"
                className={inputCls}
                value={draft.tags}
                onChange={(e) => set('tags', e.target.value)}
                placeholder="docker, container, devops"
              />
            </Field>

            <Field
              label="Bài viết trên Xóm Coding"
              htmlFor="tc-xom"
              hint="Để trống nếu chưa có bài — sẽ không hiển thị liên kết."
            >
              <input
                id="tc-xom"
                type="url"
                className={`${inputCls} font-mono`}
                value={draft.xomcodingUrl}
                onChange={(e) => set('xomcodingUrl', e.target.value)}
                placeholder="https://xomcoding.me/..."
              />
            </Field>
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-border bg-surface px-3.5 py-3">
            <input
              type="checkbox"
              checked={draft.openSource}
              onChange={(e) => set('openSource', e.target.checked)}
              className="mt-0.5 size-4 accent-[#a52a26]"
            />
            <span className="text-[13px]">
              <span className="font-semibold text-text">Open source</span>
              <span className="block text-muted">
                Dự án có mã nguồn mở công khai (khác với “miễn phí”).
              </span>
            </span>
          </label>

          {/* Trạng thái cố định */}
          <div className="rounded-md border border-dashed border-border bg-surface/60 px-3.5 py-3 text-[13px] text-muted">
            <span className="font-semibold text-text">Trạng thái: </span>
            unknown — bạn không tự khai “Hoạt động”. Workflow kiểm tra hằng ngày sẽ tự cập nhật sau
            khi PR được merge.
            <span className="mt-1 block font-mono text-xs">
              icon: {iconPath}{' '}
              <span className="font-sans text-muted">(file chưa có cũng được — site hiển thị icon chữ)</span>
            </span>
          </div>

          {/* Xem trước hàng */}
          {draft.name.trim() !== '' && (
            <div className="rounded-md border border-border bg-surface px-4 py-3">
              <p className="mb-2 text-[11px] font-bold tracking-wide text-muted uppercase">
                Xem trước trong danh sách
              </p>
              <div className="flex items-center gap-3">
                <ToolIcon icon={iconPath} name={draft.name} size={34} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text">{draft.name}</p>
                  <p className="truncate text-xs text-muted">
                    {draft.shortDescription || draft.description || 'Mô tả công cụ'}
                  </p>
                </div>
                <PricingBadge pricing={draft.pricing} />
                {draft.openSource && <OpenSourceBadge />}
                <span className="inline-flex items-center" title="Chưa xác định">
                  <span className="size-2.5 rounded-full bg-unknown" aria-hidden="true" />
                </span>
              </div>
            </div>
          )}

          {/* JSON preview kiểu GitHub */}
          <div className="overflow-hidden rounded-md border border-border">
            <div className="flex items-center justify-between border-b border-border bg-surface px-3 py-2">
              <span className="truncate font-mono text-xs text-muted">
                data/tools/{id || '<id>'}.json
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-muted transition-colors hover:bg-surface-hover hover:text-text"
              >
                {copied ? <Check className="size-3.5 text-active" /> : <Copy className="size-3.5" />}
                {copied ? 'Đã sao chép' : 'Sao chép'}
              </button>
            </div>
            <pre className="max-h-64 overflow-auto bg-[#0d1117] px-4 py-3 font-mono text-xs leading-relaxed text-[#e6edf3]">
              {json}
            </pre>
          </div>

          {/* Hướng dẫn sau khi mở GitHub */}
          {step === 2 && (
            <div className="rounded-md border border-active/40 bg-active/10 px-4 py-3">
              <p className="text-[13px] font-bold text-active">
                Tab GitHub đã mở với nội dung điền sẵn — làm nốt 3 bước:
              </p>
              <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[13px] text-muted">
                <li>
                  Kiểm tra nội dung file → bấm nút xanh <strong className="text-text">Commit changes...</strong>
                </li>
                <li>
                  Chọn <strong className="text-text">Create a new branch</strong> (vd:{' '}
                  <code className="rounded bg-surface px-1 font-mono">them-{id}</code>) →{' '}
                  <strong className="text-text">Commit changes</strong>
                </li>
                <li>
                  Bấm nút xanh <strong className="text-text">Compare &amp; pull request</strong> →{' '}
                  <strong className="text-text">Create pull request</strong>
                </li>
              </ol>
              <p className="mt-2 text-xs text-muted">
                Muốn kèm file icon: bấm “Thêm file icon” trước, rồi trong form commit GitHub chọn
                dropdown sang <strong className="text-text">branch bạn vừa tạo</strong> thay vì tạo
                branch mới. Bỏ qua cũng được — site tự hiển thị icon chữ.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-border bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-2 text-[13px] text-muted transition-colors hover:bg-surface-hover hover:text-text"
          >
            Hủy
          </button>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleCreateIcon}
              disabled={!repo || !id || draft.name.trim() === ''}
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3.5 py-2 text-[13px] font-semibold text-text transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="size-3.5" /> Thêm file icon
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={!repo}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1f883d] px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-[#1a7f37] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <GitPullRequestArrow className="size-4" />
              {repo ? 'Mở GitHub tạo Pull Request' : 'Chưa cấu hình repository'}
            </button>
          </div>
        </div>

        {repo && (
          <div className="border-t border-border bg-background px-5 py-2.5 text-center">
            <a
              href={`${repo}/compare`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-primary-hover"
            >
              Bỏ qua form — tạo PR thủ công trên GitHub <ExternalLink className="size-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
