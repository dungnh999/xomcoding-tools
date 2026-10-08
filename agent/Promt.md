# PROMPT: XÓM CODING DEV TOOLS — OPEN SOURCE DEVELOPER DIRECTORY

Bạn là Senior Full-stack Developer, UI/UX Designer và DevOps Engineer.

Hãy xây dựng hoàn chỉnh website **XÓM CODING DEV TOOLS**, một thư viện tổng hợp các công cụ hữu ích dành cho Developer Việt Nam.

Website được triển khai trên **GitHub Pages**, không cần backend, không cần database. Toàn bộ dữ liệu được quản lý thông qua các file JSON trong GitHub Repository và cộng đồng có thể đóng góp bằng Pull Request.

## 1. Thông tin dự án

- Tên: Xóm Coding Dev Tools
- Website chính: https://xomcoding.me
- Tên miền dự kiến: https://tools.xomcoding.me
- Slogan: Code local, Connect global.
- Màu thương hiệu: `#a52a26`
- Chủ đề: Dark Mode mặc định
- Ngôn ngữ: Tiếng Việt
- Đối tượng: Developer, DevOps, Frontend, Backend, AI Engineer, sinh viên CNTT.
- Tham khảo bố cục: https://pnnnhan99.github.io/awesome-free-dev-tools/

Mục tiêu:

1. Xây dựng thư viện công cụ có ích cho Developer.
2. Người dùng có thể tìm kiếm công cụ theo tên, mục đích và danh mục.
3. Cung cấp đường dẫn trực tiếp đến website công cụ.
4. Nếu Xóm Coding có bài viết về công cụ, hiển thị liên kết đến bài viết đó.
5. Cho phép cộng đồng cập nhật công cụ thông qua file JSON và Pull Request.
6. Hiển thị trạng thái hoạt động của công cụ.
7. Thu hút người dùng khám phá thêm nội dung trên xomcoding.me.
8. Tối ưu SEO, hiệu suất và khả năng mở rộng.

---

## 2. Công nghệ sử dụng

Bắt buộc sử dụng:

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- GitHub Actions
- GitHub Pages
- JSON làm nguồn dữ liệu chính

Có thể sử dụng thêm thư viện nhẹ nếu thực sự cần thiết.

Yêu cầu:

- Không sử dụng backend.
- Không cần đăng nhập.
- Không sử dụng database.
- Không sử dụng dịch vụ trả phí.
- Không phụ thuộc API key.
- Không yêu cầu server Node.js chạy liên tục.
- Website sau khi build phải chạy hoàn toàn dưới dạng static site.
- Cấu hình deployment cho GitHub Pages.
- Hỗ trợ custom domain.
- Tránh dependency dư thừa.

## 3. Thiết kế UI/UX

### 3.1. Phong cách thiết kế

Xây dựng giao diện theo phong cách:

- Dark Dashboard + Minimal Developer Directory.
- Đơn giản, hiện đại, chuyên nghiệp.
- Tập trung vào danh sách công cụ thay vì những hiệu ứng phức tạp.
- Không sử dụng hình minh họa lớn.
- Không sử dụng hero chiếm toàn màn hình.
- Không sử dụng gradient quá nhiều.
- Không sử dụng animation gây mất tập trung.
- Không sử dụng các card lớn cho từng tool.
- Ưu tiên hiển thị nhiều công cụ trên cùng một màn hình.
- Bố cục rõ ràng, khoảng cách hợp lý.
- Hỗ trợ Desktop, Tablet, Mobile.

Bảng màu đề xuất:

```css
:root {
  --background: #0b0f14;
  --surface: #111820;
  --surface-hover: #19222c;
  --border: #26313d;

  --primary: #a52a26;
  --primary-hover: #c03932;

  --text-primary: #f5f7fa;
  --text-secondary: #9caab9;

  --status-active: #22c55e;
  --status-inactive: #ef4444;
  --status-unknown: #f59e0b;
}
```

Dùng font Inter hoặc font sans-serif dễ đọc.

### 3.2. Header

Header sticky, chiều cao vừa phải.

Bên trái:

- Logo Xóm Coding.
- Chữ `XÓM CODING`.
- Subtitle `Dev Tools`.

Bên phải:

- Công cụ
- Đóng góp
- GitHub
- xomcoding.me
- Nút `+ Tạo Pull Request`

Nút Pull Request dẫn tới trang hướng dẫn đóng góp hoặc GitHub Repository.

Trên mobile sử dụng responsive navigation.

### 3.3. Hero

Hero ngắn gọn, không chiếm quá nhiều diện tích.

Tiêu đề:

**Dev Tools dành cho Developer**

Mô tả:

"Khám phá những công cụ hữu ích cho lập trình viên. Miễn phí, mã nguồn mở và được cộng đồng Xóm Coding cùng nhau đóng góp."

Phía dưới hiển thị thanh tìm kiếm lớn.

Placeholder:

`Tìm kiếm công cụ, danh mục, mục đích sử dụng...`

Có thể tìm theo:

- Tên công cụ
- Mô tả
- Category
- Tag
- Nhà cung cấp

Hỗ trợ phím tắt `/` hoặc `Ctrl + K` để focus vào thanh tìm kiếm.

### 3.4. Bộ lọc

Hiển thị các bộ lọc dạng compact chips:

Theo trạng thái:

- Tất cả
- Hoạt động
- Không hoạt động
- Chưa xác định

Theo giá:

- Free
- Freemium / Free Tier
- Paid
- Open Source

Có thêm bộ lọc:

- Có bài viết Xóm Coding

Các bộ lọc có thể kết hợp với nhau.

Hiển thị tổng số kết quả sau lọc.

### 3.5. Layout chính

Desktop:

- Sidebar bên trái: 220–250px.
- Nội dung bên phải: danh sách công cụ.
- Sidebar sticky khi cuộn, nếu phù hợp.
- Nội dung có max-width hợp lý và căn giữa.

Sidebar Category:

- Tất cả
- Database & Backend
- Cloud & Hosting
- AI Coding & Agents
- AI & Machine Learning
- DevOps
- Developer Tools
- Frontend
- UI & Design
- Security
- Productivity
- Storage & Media
- Email & Communication
- Payment
- Self-hosted
- Others

Mỗi category có icon Lucide và tổng số công cụ.

Category đang chọn có nền đỏ tối, viền hoặc thanh chỉ báo màu đỏ.

Trên mobile, chuyển sidebar thành danh sách danh mục có thể mở/đóng hoặc bộ lọc dạng drawer.

## 4. Danh sách công cụ

Đây là phần quan trọng nhất của website.

Hiển thị danh sách theo category, dạng **table/list**, không dùng grid card lớn.

Mỗi nhóm category có:

- Icon
- Tên category
- Số lượng công cụ
- Nút "Xem tất cả" hoặc thu gọn/mở rộng

Các cột:

| Công cụ | Mục đích sử dụng | Chi phí | Trạng thái | Liên kết |
|---|---|---|---|---|
| Docker | Container hóa ứng dụng | Free | Hoạt động | Website / Xóm Coding |
| Supabase | Backend as a Service | Free Tier | Hoạt động | Website / Xóm Coding |

Mỗi hàng gồm:

**Cột công cụ**

- Logo/icon chính thức 32–40px.
- Tên công cụ.
- Subtitle hoặc mô tả ngắn.

**Cột mục đích**

- Mô tả chức năng chính.
- Tối đa 2 dòng.

**Cột chi phí**

Badge:

- Free: xanh lá.
- Free Tier / Freemium: xám hoặc xanh dương.
- Paid: cam.
- Open Source: xanh lá hoặc tím nhẹ.

Không đồng nhất `Open Source` với `Free` vì đây là hai thuộc tính khác nhau.

**Cột trạng thái**

Ba trạng thái chính:

- `active` — Hoạt động — xanh lá.
- `inactive` — Không hoạt động — đỏ.
- `unknown` — Chưa xác định — vàng.

Hiển thị thêm ngày kiểm tra gần nhất trong tooltip hoặc chi tiết.

Không tự nhận định một công cụ đã ngừng hoạt động chỉ vì request HTTP bị lỗi.

**Cột liên kết**

- Website: mở website chính thức.
- GitHub: nếu công cụ có GitHub Repository.
- Xóm Coding: nếu có bài viết tương ứng.

Quan trọng:

Nếu công cụ chưa có bài viết trên xomcoding.me thì không hiển thị nút bài viết hoặc hiển thị trạng thái không khả dụng.

Không tự tạo URL giả.

### Responsive

Trên mobile:

- Chuyển mỗi hàng thành compact list item.
- Logo bên trái.
- Tên + mô tả.
- Badge chi phí và trạng thái.
- Link bên phải hoặc bên dưới.
- Không làm bảng tràn màn hình.

### Tương tác

- Hover highlight hàng.
- Click tên công cụ mở website.
- Link ngoài dùng `target="_blank"` và `rel="noopener noreferrer"`.
- Có nút sao chép URL khi phù hợp.
- Hỗ trợ trạng thái empty khi không có kết quả tìm kiếm.
- Không cần pagination nếu tổng dữ liệu nhỏ; khi số lượng lớn có thể sử dụng load more hoặc virtualized list.

---

## 5. Icon công cụ

Bắt buộc hiển thị icon thực tế của từng công cụ.

Nguồn ưu tiên:

1. Devicon.
2. Simple Icons.
3. Logo chính thức từ website công cụ.
4. Icon tự lưu trong `/public/icons/`.

Ưu tiên SVG.

Cấu trúc:

```text
public/
  icons/
    docker.svg
    supabase.svg
    postman.svg
    vscode.svg
    redis.svg
    github.svg
```

Không hotlink favicon tùy tiện từ bên thứ ba.

Icon được commit cùng repository để tránh lỗi tải ảnh hoặc phụ thuộc dịch vụ ngoài.

Nếu icon bị thiếu, sử dụng fallback icon từ Lucide.

Không để icon lỗi làm vỡ giao diện.

Kiểm tra quyền sử dụng logo và không làm người dùng hiểu nhầm website được các nhà cung cấp tài trợ.

---

## 6. Dữ liệu JSON

Toàn bộ công cụ được lưu trong:

```text
data/tools/
```

Mỗi công cụ là một file JSON riêng, giúp cộng đồng dễ tạo Pull Request và giảm xung đột khi cùng chỉnh sửa.

Ví dụ:

```json
{
  "id": "docker",
  "name": "Docker",
  "slug": "docker",
  "category": "devops",
  "shortDescription": "Nền tảng container hóa ứng dụng.",
  "description": "Đóng gói và triển khai ứng dụng bằng container.",
  "icon": "/icons/docker.svg",
  "website": "https://www.docker.com/",
  "github": "https://github.com/docker",
  "pricing": "free",
  "openSource": true,
  "status": "unknown",
  "lastChecked": null,
  "xomcodingUrl": null,
  "tags": [
    "docker",
    "container",
    "deployment",
    "devops"
  ]
}
```

Các field quan trọng:

- id
- name
- slug
- category
- shortDescription
- description
- icon
- website
- github
- pricing
- openSource
- status
- lastChecked
- xomcodingUrl
- tags

Định nghĩa TypeScript interface tương ứng.

Có JSON Schema hoặc Zod để validate dữ liệu.

Không dùng dữ liệu giả về trạng thái hoạt động hoặc ngày kiểm tra.

Không tự thêm thông tin thương mại chưa xác minh.

Dữ liệu chính xác quan trọng hơn số lượng.

---

## 7. Quản lý Category

Tạo file:

```text
data/categories.json
```

Ví dụ:

```json
[
  {
    "id": "devops",
    "name": "DevOps",
    "icon": "infinity",
    "order": 1
  },
  {
    "id": "database",
    "name": "Database & Backend",
    "icon": "database",
    "order": 2
  }
]
```

Yêu cầu:

- Dễ thêm category.
- Có thể chỉnh thứ tự.
- Hiển thị số lượng công cụ tự động.
- Không hardcode danh mục trong component.
- Validate `category` của tool phải tồn tại trong `categories.json`.

---

## 8. Kiểm tra trạng thái hoạt động của tool

Xây dựng workflow:

```text
.github/workflows/check-tools.yml
```

Mục tiêu: kiểm tra khả năng truy cập website của các công cụ theo lịch.

Workflow chạy:

- Mỗi ngày một lần.
- Cho phép chạy thủ công bằng `workflow_dispatch`.

Quy trình:

1. Đọc danh sách URL từ JSON.
2. Kiểm tra HTTP(S) bằng script Node.js chạy trong GitHub Actions.
3. Có timeout hợp lý.
4. Giới hạn concurrency.
5. Retry khi lỗi mạng tạm thời.
6. Hỗ trợ redirect.
7. Ghi nhận status code, URL cuối, thời điểm kiểm tra.
8. Không xem mọi HTTP 403, 429 hoặc lỗi timeout là ngừng hoạt động.
9. Không gửi quá nhiều request gây tải cho website đích.
10. Phân biệt website truy cập được với dịch vụ thực sự hoạt động.

Đề xuất mô hình:

- `active`: website đã được xác minh truy cập thành công.
- `inactive`: đã có bằng chứng đáng tin cậy công cụ ngừng cung cấp dịch vụ hoặc được maintainer xác nhận.
- `unknown`: chưa kiểm tra được hoặc kết quả không đủ kết luận.

Nếu request thất bại một lần, giữ trạng thái `unknown` hoặc trạng thái đã xác minh trước đó kèm thông tin kiểm tra mới.

Không thay đổi `inactive` chỉ dựa trên một HTTP error.

Nên tách kết quả kiểm tra tự động ra file:

```text
data/generated/tool-status.json
```

Ví dụ:

```json
{
  "docker": {
    "status": "active",
    "lastChecked": "2026-10-08T00:00:00Z",
    "httpStatus": 200
  }
}
```

GitHub Actions có thể tạo Pull Request cập nhật trạng thái, hoặc ghi trực tiếp file generated thông qua quyền GitHub Actions được cấu hình riêng.

Ưu tiên mô hình tạo PR để dễ review khi trạng thái thay đổi bất thường.

Không để workflow tạo vòng lặp commit liên tục.

GitHub Pages build phải sử dụng dữ liệu trạng thái đã xác nhận hoặc fallback về `unknown`.

---

## 9. Tích hợp xomcoding.me

Đây là chức năng quan trọng để thu hút traffic về hệ sinh thái Xóm Coding.

Trong JSON mỗi tool có field:

```json
{
  "xomcodingUrl": "https://xomcoding.me/duong-dan-bai-viet"
}
```

Nếu `xomcodingUrl` có giá trị hợp lệ, hiển thị liên kết:

**Đọc trên Xóm Coding**

Nếu null, không hiển thị.

Ngoài cấu hình thủ công, hãy chuẩn bị khả năng đồng bộ sau này.

Thiết kế script:

```text
scripts/sync-xomcoding-articles.ts
```

Script sử dụng sitemap hoặc public API của xomcoding.me nếu thực sự có sẵn và được phép truy cập.

Quy trình:

1. Lấy danh sách URL bài viết.
2. Đối chiếu tên công cụ, slug và tag.
3. Chỉ tự động liên kết khi có quy tắc mapping chính xác.
4. Không gắn bài viết chỉ vì tên gần giống nhau.
5. Các trường hợp chưa chắc chắn xuất báo cáo để maintainer duyệt.
6. Giữ nguyên liên kết được cấu hình thủ công.
7. Không ghi đè JSON nếu chưa xác minh.

Website vẫn chạy bình thường khi xomcoding.me không truy cập được.

Trong footer và header luôn có link về:

https://xomcoding.me

Có section nhỏ giới thiệu Xóm Coding và lời mời tham gia cộng đồng.

Không tạo popup quảng cáo gây khó chịu.

---

## 10. Cộng đồng đóng góp qua GitHub Pull Request

Không xây dựng trang admin.

Không xây dựng chức năng chỉnh sửa JSON trực tiếp từ website.

Người dùng muốn thêm, sửa hoặc cập nhật công cụ thì thực hiện thông qua GitHub.

Quy trình:

1. Fork repository.
2. Thêm file trong `data/tools/` hoặc sửa file JSON hiện có.
3. Commit.
4. Tạo Pull Request.
5. GitHub Actions kiểm tra dữ liệu.
6. Maintainer review.
7. Merge vào main.
8. GitHub Pages tự động build và cập nhật.

Trên website có nút:

**+ Đóng góp công cụ**

Nút dẫn tới GitHub Repository hoặc trang CONTRIBUTING.

Tạo file:

```text
CONTRIBUTING.md
```

Nội dung bằng tiếng Việt:

- Giới thiệu quy trình đóng góp.
- Hướng dẫn Fork.
- Cách tạo file JSON.
- Cách sửa thông tin một tool.
- Các field bắt buộc.
- Cách bổ sung icon.
- Cách tạo Pull Request.
- Nguyên tắc tránh trùng lặp.
- Quy tắc không spam, không chèn liên kết quảng cáo hoặc mã độc.

Tạo file Pull Request template:

```text
.github/PULL_REQUEST_TEMPLATE.md
```

Checklist:

- [ ] Công cụ chưa trùng.
- [ ] Website hợp lệ.
- [ ] Mô tả tiếng Việt rõ ràng.
- [ ] Category hợp lệ.
- [ ] Icon hiển thị đúng.
- [ ] JSON đúng schema.
- [ ] Link Xóm Coding đúng bài viết, nếu có.
- [ ] Không tự khai trạng thái active nếu chưa được kiểm tra.

Workflow validation phải kiểm tra:

- JSON parse.
- Required fields.
- Duplicate ID.
- Duplicate slug.
- Duplicate website canonical URL.
- Category hợp lệ.
- Pricing hợp lệ.
- Status hợp lệ.
- URL đúng định dạng.
- Chặn URL nguy hiểm như `javascript:`, `data:`, `file:`.
- Giới hạn độ dài text.
- Ngăn path traversal trong trường icon.
- Icon phải nằm trong đường dẫn được phép.
- Không cho JSON đóng góp tự ý chứa HTML hoặc script được render thành nội dung thực thi.

---

## 11. Tìm kiếm và lọc

Triển khai client-side search.

Yêu cầu:

- Không phân biệt chữ hoa/thường.
- Hỗ trợ tìm kiếm tiếng Việt không dấu.
- Tìm theo tên, tag, description, category.
- Debounce để hạn chế render không cần thiết.
- Khi tìm kiếm, có thể hiển thị kết quả theo nhóm category.
- Không có kết quả thì hiện empty state.
- Nút xóa tìm kiếm.

Filter state được đồng bộ vào URL query parameters.

Ví dụ:

```text
?category=devops
?search=docker
?pricing=free
?status=active
```

Cho phép chia sẻ URL đã lọc.

Khi người dùng refresh trang, các filter vẫn được khôi phục.

---

## 12. Các mục thống kê

Hiển thị số liệu nhỏ bên dưới ô tìm kiếm hoặc cạnh bộ lọc:

- Tổng công cụ.
- Tổng category.
- Số công cụ hoạt động.
- Số công cụ chưa xác định.

Các con số phải tính từ JSON thực tế.

Không hardcode số lượng.

Không sử dụng số lượng giả như "10.000+ công cụ".

---

## 13. Footer

Thiết kế footer đơn giản.

Bên trái:

**XÓM CODING — Dev Tools**

"Khám phá · Học hỏi · Chia sẻ · Phát triển cùng cộng đồng lập trình Việt Nam."

Bên phải là các liên kết:

- xomcoding.me
- GitHub cá nhân
- GitHub Repository
- Facebook
- YouTube
- TikTok

Tất cả social links cần đưa vào một file cấu hình riêng:

```text
src/config/site.ts
```

Không hardcode URL xã hội trong nhiều component.

Nếu chưa được cung cấp URL chính xác thì để null và ẩn liên kết, không tự đoán.

---

## 14. SEO

Website cần tối ưu cho Google Search.

Yêu cầu:

- Semantic HTML.
- Page title.
- Meta description.
- Canonical URL.
- Open Graph.
- Twitter Card.
- Sitemap.xml.
- robots.txt.
- Schema.org phù hợp với website directory.
- Tối ưu thẻ heading.
- Tối ưu Lighthouse.
- Không có broken internal links.
- Trang 404 phù hợp với GitHub Pages.

Lưu ý: Vite SPA thuần không tự động prerender HTML cho từng công cụ. Nếu triển khai trang chi tiết từng tool cần cân nhắc prerender hoặc static generation để nội dung SEO được xuất thành HTML thực.

Ưu tiên cấu trúc đơn giản và có thể mở rộng sau này.

---

## 15. Hiệu suất

Yêu cầu:

- Mobile-first.
- Lazy loading khi phù hợp.
- Không tải thư viện icon quá lớn.
- Icon tối ưu kích thước.
- Tránh layout shift.
- Có cache cho static assets.
- Không gọi API ngoài mỗi lần người dùng tải trang nếu không cần.
- Render danh sách mượt khi có hàng trăm công cụ.
- Tối ưu bundle Vite.

Mục tiêu Lighthouse trên production:

- Performance ≥ 90.
- Accessibility ≥ 90.
- Best Practices ≥ 90.
- SEO ≥ 90.

Đây là mục tiêu kiểm thử, không được tuyên bố đạt nếu chưa đo thực tế.

---

## 16. Cấu trúc dự án

```text
xomcoding-devtools/
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml
│   │   ├── validate.yml
│   │   └── check-tools.yml
│   └── PULL_REQUEST_TEMPLATE.md
│
├── public/
│   ├── icons/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
│
├── data/
│   ├── categories.json
│   ├── tools/
│   │   ├── docker.json
│   │   ├── supabase.json
│   │   ├── postman.json
│   │   └── ...
│   └── generated/
│       └── tool-status.json
│
├── scripts/
│   ├── validate-tools.ts
│   ├── check-tools.ts
│   ├── sync-xomcoding-articles.ts
│   └── generate-data.ts
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── tools/
│   │   │   ├── ToolList.tsx
│   │   │   ├── ToolRow.tsx
│   │   │   ├── ToolStatus.tsx
│   │   │   ├── ToolFilters.tsx
│   │   │   └── CategorySection.tsx
│   │   └── ui/
│   │       ├── SearchInput.tsx
│   │       └── Badge.tsx
│   │
│   ├── config/
│   │   └── site.ts
│   ├── hooks/
│   │   └── useToolFilters.ts
│   ├── types/
│   │   └── tool.ts
│   ├── utils/
│   │   ├── search.ts
│   │   └── filters.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── CONTRIBUTING.md
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

Có thể điều chỉnh cấu trúc khi cần, nhưng phải giữ nguyên nguyên tắc dễ mở rộng, dữ liệu tách biệt khỏi UI.

## 17. GitHub Pages Deployment

Tạo workflow triển khai tự động:

```text
.github/workflows/deploy.yml
```

Yêu cầu:

- Chạy khi push lên main.
- Build bằng Node.js LTS tương thích.
- Validate JSON trước khi build.
- Deploy lên GitHub Pages.
- Hỗ trợ custom domain tools.xomcoding.me.
- Có file CNAME hoặc cấu hình tương đương.
- Cấu hình đường dẫn asset đúng khi sử dụng custom domain.
- Nếu chạy dưới subpath GitHub Pages thì hỗ trợ cấu hình Vite base tương ứng.
- Không cần secret cho frontend.
- Thiết lập workflow permissions theo nguyên tắc tối thiểu.

Tạo README có hướng dẫn:

```bash
npm install
npm run dev
npm run build
npm run validate
```

---

## 18. Dữ liệu ban đầu

Bổ sung các tool thông dụng, phân loại chính xác.

Ví dụ:

Database & Backend:
- Supabase
- Firebase
- Neon
- Prisma
- Redis
- PostgreSQL
- MongoDB

Cloud & Hosting:
- Vercel
- Netlify
- Cloudflare
- Render
- DigitalOcean

AI Coding:
- Cursor
- GitHub Copilot
- Claude Code
- Continue
- Windsurf

DevOps:
- Docker
- Kubernetes
- GitHub Actions
- GitLab CI
- Jenkins
- Argo CD

Developer Tools:
- VS Code
- Postman
- Insomnia
- Bruno
- HTTPie

Frontend:
- React
- Vue
- Next.js
- Vite
- Tailwind CSS

Security:
- OWASP ZAP
- Trivy
- Snyk

Đây là danh sách gợi ý, cần xác minh URL, loại giấy phép, gói giá và tình trạng hiện tại trước khi nhập dữ liệu.

Không tự đánh dấu mọi công cụ là `active`.

Nếu chưa có kết quả kiểm tra, mặc định `unknown`.

Không bịa bài viết trên xomcoding.me.

---

## 19. Yêu cầu chất lượng code

- TypeScript strict mode.
- Component nhỏ, dễ bảo trì.
- Không sử dụng `any` tùy tiện.
- Không duplicate logic.
- Có error handling.
- Có accessible keyboard navigation.
- Dữ liệu render phải được xử lý an toàn.
- Không dùng `dangerouslySetInnerHTML` với dữ liệu từ JSON.
- Không sử dụng placeholder link `#` cho các nút cần hoạt động.
- Những tính năng chưa cấu hình phải ẩn hoặc thể hiện rõ chưa khả dụng.
- Build không có TypeScript error.
- Có unit test cho search, filter và validation.
- Có test cho cơ chế fallback icon và status.
- Có kiểm tra responsive.
- Có hướng dẫn cấu hình URL GitHub Repository và social links.

## 20. Quy trình thực hiện

Hãy trực tiếp xây dựng source code hoàn chỉnh theo thứ tự:

1. Khởi tạo Vite + React + TypeScript.
2. Cấu hình Tailwind CSS và Dark Theme.
3. Tạo các TypeScript interface.
4. Tạo JSON schema và file category.
5. Tạo dữ liệu mẫu đã xác minh.
6. Xây dựng Header, Footer, Sidebar.
7. Xây dựng Hero và thanh tìm kiếm.
8. Xây dựng danh sách công cụ dạng list/table.
9. Tạo hệ thống lọc và status badge.
10. Tích hợp icon tool.
11. Tích hợp xomcodingUrl.
12. Tạo CONTRIBUTING và Pull Request template.
13. Tạo workflow validation.
14. Tạo workflow kiểm tra trạng thái.
15. Tạo workflow deploy GitHub Pages.
16. Hoàn thiện responsive.
17. Tối ưu SEO.
18. Chạy lint, TypeScript check, tests và production build.
19. Fix các lỗi phát hiện.
20. Cung cấp hướng dẫn deploy lên GitHub Pages và cấu hình tools.xomcoding.me.

**QUAN TRỌNG:**

- Không chỉ phân tích hoặc đề xuất.
- Không chỉ tạo mockup.
- Không chỉ tạo README.
- Phải viết source code thực tế.
- Không dùng ảnh AI để thay thế giao diện website.
- UI phải được xây dựng bằng React/Tailwind.
- Giữ thiết kế tối giản, ưu tiên tốc độ và trải nghiệm đọc danh sách.
- Khi thêm hay sửa code, cung cấp file đầy đủ, không chỉ snippet.
- Không làm thay đổi dữ liệu JSON hợp lệ khi thực hiện refactor.
- Không thay đổi hoặc commit trực tiếp vào repository production khi chưa được phép.
- Sau khi hoàn thành phải nêu rõ các file đã tạo, chức năng đã triển khai, kết quả kiểm tra và các cấu hình cần điền.

**KẾT QUẢ CUỐI CÙNG:** Một website Xóm Coding Dev Tools hoạt động thực tế trên GitHub Pages, giao diện Dark Mode chuyên nghiệp, có danh mục công cụ, tìm kiếm, lọc, trạng thái hoạt động, icon chính thức, liên kết bài viết xomcoding.me và cơ chế đóng góp bằng GitHub Pull Request.
