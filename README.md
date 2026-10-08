# Xóm Coding Dev Tools

Thư viện công cụ mã nguồn mở dành cho Developer Việt Nam — cộng đồng cùng nhau đóng góp qua
GitHub Pull Request.

- Website: https://tools.xomcoding.me
- Xóm Coding: https://xomcoding.me
- Slogan: Code local, Connect global.

## Dữ liệu hiện tại

- **125 công cụ** ở **15 danh mục**, mỗi tool một file JSON
- 125 icon SVG commit trực tiếp vào repo (không hotlink dịch vụ ngoài)
- Trạng thái kiểm tra thật từ `check-tools` — không có số liệu hay status giả

Danh mục: Database & Backend · Cloud & Hosting · AI Coding & Agents · AI & Machine Learning ·
DevOps · Developer Tools · Frontend · UI & Design · Security · Productivity · Storage & Media ·
Email & Communication · Payment · Self-hosted · Others

## Tính năng

- Dark mode, hiển thị danh sách công cụ dạng table (không dùng card lớn) — xem được nhiều tool một màn hình.
- Tìm kiếm client-side: không phân biệt hoa/thường, hỗ trợ tiếng Việt không dấu, phím tắt `/` và `Ctrl/Cmd + K`.
- Bộ lọc theo danh mục, trạng thái, chi phí (`free`/`freemium`/`paid`), Open Source và bài viết Xóm Coding — đồng bộ vào URL query để chia sẻ, giữ nguyên sau refresh.
- Trạng thái hoạt động (`active`/`inactive`/`unknown`) kiểm tra tự động bằng GitHub Actions, chạy mỗi ngày và tạo Pull Request để review.
- Icon có fallback an toàn: ảnh lỗi → chữ cái đầu, không làm vỡ giao diện.
- Validate JSON chặt chẽ: trùng `id`/`slug`/`website`, category hợp lệ, chặn URL nguy hiểm (`javascript:`, `data:`, `file:`), path traversal, HTML trong mô tả.
- Tích hợp `xomcodingUrl`: chỉ hiển thị "Đọc trên Xóm Coding" khi có bài viết thật.
- Không backend, không database, không API key — static site deploy bằng GitHub Pages.

## Chạy dự án

```bash
npm install
npm run dev        # dev server → http://localhost:5173
npm run build      # build production vào dist/
npm run preview    # xem build
npm run validate   # validate data/tools + categories
npm test           # unit test (search, filter, validate, fallback icon, load data)
npm run typecheck  # TypeScript strict
npm run lint       # oxlint
```

## Thêm công cụ

1. Tạo `data/tools/<id>.json` (xem mẫu trong [CONTRIBUTING.md](CONTRIBUTING.md)).
2. Thêm icon SVG vào `public/icons/` (không có cũng được — UI tự fallback).
3. Chạy `npm run validate` rồi tạo Pull Request.

Cấu trúc dữ liệu:

```text
data/
├── categories.json        # danh mục (id, tên, icon Lucide, thứ tự)
├── tools/*.json           # mỗi công cụ một file → dễ review, ít conflict
└── generated/
    ├── tool-status.json   # trạng thái do workflow check-tools ghi (commit)
    ├── tools.json         # artifact gộp (gitignore, npm run generate-data)
    └── xomcoding-report.json  # báo cáo đối chiếu bài viết (gitignore)
```

Cấu trúc code chính:

```text
src/
├── components/
│   ├── layout/     # Header, Sidebar, Footer
│   ├── tools/      # ToolList, ToolRow, ToolFilters, CategorySection, ToolStatus, StatsBar
│   └── ui/         # SearchInput, Badge, ToolIcon
├── config/site.ts  # URL repository + mạng xã hội (null = ẩn)
├── data/load.ts    # nạp JSON + ghép trạng thái generated
├── hooks/          # useToolFilters (đồng bộ filter ↔ URL)
├── types/          # TypeScript interface
└── utils/          # search (không dấu), filters
```

## Scripts hữu ích

```bash
npm run check-tools      # kiểm tra HTTP website công cụ → ghi tool-status.json
npm run sync-xomcoding   # đối chiếu sitemap xomcoding.me → báo cáo (không ghi đè JSON)
npm run generate-data    # gộp tools + status → data/generated/tools.json
```

## Cấu hình cần điền

| File | Trường | Việc cần làm |
|---|---|---|
| `src/config/site.ts` | `repository` | URL repository GitHub (để `null` thì nút GitHub/PR tự ẩn) |
| `src/config/site.ts` | `links.*` | URL mạng xã hội; `null` = ẩn link, không đoán URL |
| `public/CNAME` | — | `tools.xomcoding.me`; xóa file nếu chưa có tên miền |
| `.github/workflows/deploy.yml` | `vars.BASE_PATH` | Đặt `/<repo>/` nếu deploy ở subpath GitHub Pages chưa có custom domain |

## Triển khai GitHub Pages

1. Push lên nhánh `main` → workflow `deploy.yml` tự validate, test, build và deploy.
2. **Settings → Pages → Source: GitHub Actions**.
3. Có custom domain: trỏ DNS, giữ `public/CNAME`; chưa có thì đặt repo variable `BASE_PATH=/<tên-repo>/` và xóa `public/CNAME`.
4. Workflow `check-tools.yml` chạy 03:00 UTC mỗi ngày → tạo PR cập nhật trạng thái (không commit thẳng vào `main`, không vòng lặp).
5. Workflow `validate.yml` chạy trên mọi PR sửa `data/` — chặn dữ liệu sai trước khi merge.

## Công nghệ

React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · Lucide React · Vitest · GitHub Actions

## License

[MIT](LICENSE) — © 2026 Xóm Coding
