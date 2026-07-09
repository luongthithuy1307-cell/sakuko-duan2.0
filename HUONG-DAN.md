# Cổng Dự Án 2.0 — Hướng dẫn vận hành

Web app 1 file (`index.html`) cho QL đăng nhập, hiểu dự án và thực thi 5 module.
Thiết kế để **chị tự sửa nội dung mà không cần gọi Claude** → gần như không tốn token về sau.

---

## 1. Chạy thử trên máy
Nhấp đúp `index.html` là mở được ngay bằng trình duyệt. Không cần cài gì.

- Tài khoản demo Ban giám đốc: **admin / sakuko**
- Tài khoản QL mẫu: **ch1 / 123456** … đến **ch5 / 123456**

## 2. Cấu trúc GỐC – NHÁNH (sửa nhánh không đụng gốc)

Phần mềm tách thành nhiều file. **Sửa file nào chỉ file đó đổi, gốc y nguyên.**

**GỐC (ít khi đụng):**
- `index.html` — khung giao diện + CSS
- `config.js` — tài khoản, danh sách CH, tuyến điều chuyển, danh sách module
- `core.js` — đăng nhập, phân quyền, menu, lớp dữ liệu (bộ máy)

**NHÁNH (mỗi tab 1 file — sửa nội dung tại đây):**

| Muốn đổi gì | Mở file |
|---|---|
| Tài khoản, mật khẩu, tên CH, tuyến điều chuyển, module | `config.js` |
| Nội dung "Hiểu dự án" (mục tiêu, vai trò, lộ trình) | `tab-home.js` (khối `HOME`) |
| Bài học 3 CH tiên phong | `tab-lessons.js` (khối `LESSONS`) |
| Phiếu khảo sát thực địa | `tab-survey.js` (khối `SURVEY`) |
| Cách tính/hiển thị báo cáo hàng mới | `tab-report.js` |
| Cách tính/hiển thị điều chuyển hàng | `tab-transfer.js` |
| Cách hiển thị bảng tiến độ | `tab-progress.js` |
| Số liệu bán/tồn hàng mới | `data-hangmoi.js` (chạy `cap-nhat-data.ps1` để cập nhật) |

Nguyên tắc: mỗi dòng đặt trong dấu `"..."`, phân cách bằng dấu phẩy. Sửa xong lưu lại, mở lại app là thấy.

**Thêm 1 tab mới hoàn toàn:** copy 1 file `tab-*.js`, sửa nội dung + đổi `id/label`, rồi thêm 1 dòng `<script src="tab-cua-ban.js"></script>` vào `index.html`. Không cần đụng gốc.

⚠️ Khi đưa lên mạng phải **kéo cả thư mục** (đủ mọi file .js) chứ không chỉ index.html.

## 3. Đưa lên mạng cho QL truy cập bằng link (miễn phí)
`index.html` là file tĩnh, kéo–thả lên bất kỳ host tĩnh nào:
- **Netlify Drop**: vào app.netlify.com/drop → kéo cả thư mục vào → có link ngay.
- Hoặc Vercel / Cloudflare Pages / GitHub Pages.

QL mở link, đăng nhập bằng tài khoản chị cấp là dùng được trên điện thoại tại quầy.

## 4. Giới hạn của bản hiện tại (prototype) — đọc kỹ
Bản này lưu bài nộp bằng bộ nhớ **trình duyệt của từng máy** (localStorage). Nghĩa là:
- ✅ Đủ để mỗi QL nhập và tự xem lại trên máy mình; demo cho BGĐ; đóng gói nội dung.
- ❌ Bài nộp của QL **không tự gom về một chỗ** cho chị/ASM xem tập trung trên máy khác.

→ Khi cần **dashboard chung 5 CH theo thời gian thực + login bảo mật thật**, nâng lên **Supabase**.

## 5. Nâng cấp Supabase (khi cần dữ liệu chung) — bước gọi Claude 1 lần
Chị đã có kinh nghiệm Supabase từ app học sản phẩm. Khi sẵn sàng, nói Claude:
1. Tạo 1 project Supabase mới, 2 bảng: `accounts` và `submissions`.
2. Thay phần `store.subs` (đang dùng localStorage) bằng gọi Supabase.
3. Thay `doLogin` bằng Supabase Auth.

App đã tách sẵn 2 chỗ này thành hàm riêng nên chỉ sửa gọn — tốn ít token, không phải viết lại từ đầu.

---

## Tóm tắt chi phí token
- Sửa **nội dung, tài khoản, module** → chị tự làm, **0 token**.
- Đưa lên mạng → tự kéo–thả, **0 token**.
- Chỉ tốn token khi: nâng Supabase, đổi giao diện lớn, hoặc thêm tính năng mới.
