# Hướng dẫn đóng góp — Xóm Coding Dev Tools

Cảm ơn bạn muốn chia sẻ công cụ với cộng đồng! Mọi thay đổi đều diễn ra qua **GitHub Pull
Request** — website không có trang admin, không có form nhập liệu trên giao diện.

## Quy trình tổng quan

1. Fork repository.
2. Thêm hoặc sửa file JSON trong `data/tools/`.
3. Commit và tạo Pull Request.
4. GitHub Actions tự chạy `npm run validate` + test.
5. Maintainer review.
6. Merge vào `main` → GitHub Pages tự động build và cập nhật.

## Thêm công cụ mới

### 1. Tạo file JSON

Tạo file `data/tools/<id>.json` — **tên file phải trùng với trường `id`**:

```json
{
  "id": "docker",
  "name": "Docker",
  "slug": "docker",
  "category": "devops",
  "shortDescription": "Container Platform",
  "description": "Đóng gói và triển khai ứng dụng bằng container.",
  "icon": "/icons/docker.svg",
  "website": "https://www.docker.com/",
  "github": "https://github.com/moby/moby",
  "pricing": "freemium",
  "openSource": true,
  "status": "unknown",
  "lastChecked": null,
  "xomcodingUrl": null,
  "tags": ["docker", "container", "devops"]
}
```

### 2. Các field

| Field | Bắt buộc | Ghi chú |
|---|---|---|
| `id` | Có | Chữ thường, gạch nối (`github-actions`). Trùng tên file. |
| `name` | Có | Tên công cụ, tối đa 60 ký tự. |
| `slug` | Có | Bắt buộc trùng `id`. |
| `category` | Có | Phải tồn tại trong `data/categories.json`. |
| `shortDescription` | Có | Tối đa 140 ký tự, tiếng Việt. |
| `description` | Có | Tối đa 300 ký tự, tiếng Việt, không HTML. |
| `icon` | Có | Đường dẫn `/icons/<tên>.svg`, không chứa `..`. |
| `website` | Có | URL `https://` chính thức. |
| `github` | Không | `null` nếu không có repository chính thức. |
| `pricing` | Có | `free` \| `freemium` \| `paid` — **khác** `openSource`. |
| `openSource` | Có | `true`/`false` — công cụ có mã nguồn mở không. |
| `status` | Có | Luôn để `unknown` khi mới thêm. Workflow sẽ kiểm tra sau. |
| `lastChecked` | Có | Luôn `null` khi mới thêm. |
| `xomcodingUrl` | Không | Chỉ điền khi có **bài viết thật** trên xomcoding.me, không bịa. |
| `tags` | Có | Mảng từ khóa tiếng Anh/thường, hỗ trợ tìm kiếm. |

### 3. Thêm icon

- Ưu tiên SVG: Devicon → Simple Icons → logo chính thức.
- Lưu vào `public/icons/<tên>.svg`, khai báo `"icon": "/icons/<tên>.svg"`.
- Không hotlink favicon từ bên thứ ba.
- Nếu chưa có icon, dùng tên file bất kỳ — giao diện tự fallback sang chữ cái đầu khi ảnh lỗi.

### 4. Sửa thông tin công cụ

Sửa trực tiếp file JSON hiện có. **Không** đổi `id`/`slug` của tool đã tồn tại (sẽ gãy link và
gây trùng lặp).

### 5. Tạo Pull Request

Chạy kiểm tra trước khi gửi PR:

```bash
npm install
npm run validate
npm test
```

## Nguyên tắc

- **Không trùng lặp**: kiểm tra `id`, `slug`, `website` trước khi thêm.
- **Không spam**: mỗi PR nên tập trung một nhóm công cụ liên quan.
- **Không chèn link quảng cáo, mã độc, URL `javascript:`/`data:`/`file:`.**
- **Không tự nhận công cụ ngừng hoạt động** — để `status: unknown`, workflow tự kiểm tra.
- **Không bịa bài viết Xóm Coding** — để `xomcodingUrl: null` nếu chưa có bài.
- **Không hardcode số liệu** hoặc status `active` chỉ để PR đẹp hơn.

## Thêm category mới

Sửa `data/categories.json`, thêm object có `id`, `name`, `icon` (tên Lucide), `order`. Không
hardcode danh mục trong component.

## Kiểm tra trạng thái

Workflow `.github/workflows/check-tools.yml` chạy mỗi ngày:

- `active`: website truy cập được.
- `inactive`: chỉ khi có bằng chứng dịch vụ ngừng hoạt động (không đổi chỉ vì một HTTP error).
- `unknown`: chưa kiểm tra được.

Kết quả ghi vào `data/generated/tool-status.json` và tạo PR để maintainer review.

## Câu hỏi

Mở issue nếu bạn cần trao đổi trước khi gửi PR. Cảm ơn bạn đã đóng góp cùng Xóm Coding!
