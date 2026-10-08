## Mô tả thay đổi

<!-- Giải thích ngắn gọn: công cụ gì, thêm hay sửa, vì sao. -->

## Loại thay đổi

- [ ] Thêm công cụ mới
- [ ] Sửa thông tin công cụ
- [ ] Thêm/sửa icon
- [ ] Sửa code / tài liệu

## Checklist

- [ ] Công cụ chưa trùng với công cụ đã có (kiểm tra theo `id`, `slug` và `website`)
- [ ] Website hợp lệ, truy cập được (https)
- [ ] Mô tả tiếng Việt rõ ràng, không có HTML/script
- [ ] Category hợp lệ (bắt buộc nằm trong `data/categories.json`)
- [ ] Pricing đúng một trong: `free` / `freemium` / `paid`
- [ ] Icon hiển thị đúng, file nằm trong `public/icons/`
- [ ] JSON đúng schema (chạy `npm run validate` không lỗi)
- [ ] Link Xóm Coding (`xomcodingUrl`) đúng bài viết thật (để `null` nếu chưa có)
- [ ] Không tự khai trạng thái `active` khi chưa được workflow kiểm tra
