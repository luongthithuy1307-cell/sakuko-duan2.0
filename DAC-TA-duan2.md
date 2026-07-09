# BẢN ĐẶC TẢ — Dự Án 2.0: Trao quyền phát triển hàng hóa
> Đóng gói để giao cho AI Agent / bàn giao dự án. Cập nhật: 09/07/2026

---

## 1. Tên dự án
Dự Án 2.0 — Trao quyền phát triển hàng hóa mới dưới cửa hàng.

## 2. Bài toán cần giải quyết
Đóng gói dự án trao quyền phát triển hàng hóa (đã chạy giai đoạn 1 tại 3 CH: Hàng Bông, Mandarin, T6 Times City) để **nhân bản sang 5 CH mới** (Thái Hà, Trần Đăng Ninh, Hàm Nghi, Nguyễn Du, Nguyễn Tuân).

Đang khổ ở đâu:
- QL mỗi CH hiểu dự án và thực thi rời rạc trên giấy/chat, không có chỗ chung để **hiểu → làm → theo dõi tiến độ**.
- Số bán và tồn kho hàng mới nằm rải rác trong Excel, khó phân tích, khó phát hiện hàng ế/chôn vốn.

Kết quả mong muốn: **1 cổng web đăng nhập** để QL hiểu dự án + thực thi 5 module; ngành hàng xem báo cáo tốc độ bán/tồn + cảnh báo ứ đọng + đề xuất điều chuyển; BGĐ/ASM theo dõi tiến độ 8 CH — tất cả một chỗ, cập nhật kịp thời.

## 3. Người dùng
| Nhóm | Vai trò |
|---|---|
| GĐVH / BGĐ (Thùy) | Theo dõi toàn bộ, đọc báo cáo, xem tiến độ |
| ASM (quản lý chuỗi) | Giám sát thực thi; (tương lai) duyệt |
| Cửa hàng trưởng / QLST (8 CH) | Thực thi & nộp 5 module của CH mình |
| Chuyên viên ngành hàng | Chỉ xem báo cáo bán/tồn, khảo sát, điều chuyển |

## 4. 3 câu lọc quy mô
1. Nhiều người cùng dùng? → **CÓ** (8 CH + ngành hàng + BGĐ + ASM).
2. Cần lưu dữ liệu riêng từng người/CH? → **CÓ** (bài nộp module + tiến độ theo từng CH).
3. Cần AI xử lý ngay lúc dùng? → **KHÔNG** (phân tích bằng code/script, không cần AI real-time).

→ Kết luận: web app nhiều người dùng, có cơ sở dữ liệu chung, không cần LLM runtime.

## 5. Loại bài toán
**Loại 1 — Giao diện cho con người**: portal/dashboard/web đăng nhập, kèm bảng phân tích số liệu (báo cáo bán/tồn, điều chuyển). Không phải AI xử lý dữ liệu (Loại 2), automation nền (Loại 3) hay hệ thống tích hợp POS↔Kho↔CRM (Loại 4).

## 6. Dữ liệu cần lưu (các bảng)
**Bảng động (cần Database — Supabase):**
- `accounts`: user, mật khẩu, tên, cửa hàng, vai trò (admin/viewer/cht/asm).
- `submissions`: cửa hàng, mã module (m1–m5), nội dung form (jsonb), thời gian nộp.

**Dữ liệu tham chiếu (nạp sẵn trong file, không phải bảng động):**
- Nội dung dự án (mục tiêu, vai trò, lộ trình 4 giai đoạn), bài học 3 CH tiên phong.
- 22 phiếu khảo sát thực địa đối thủ.
- 51 mã hàng mới + tốc độ bán 4 tháng + tồn kho 8 CH (`data-hangmoi.js`, cập nhật bằng script).

## 7. Phân quyền
- **admin (BGĐ/GĐVH):** xem tất cả tab, không nộp module.
- **viewer (ngành hàng):** xem tất cả (báo cáo, khảo sát, điều chuyển), KHÔNG nộp module.
- **cht (QL cửa hàng):** xem dự án + nộp/cập nhật module của CHÍNH CH mình; thấy tiến độ.
- **asm (tương lai):** như admin + nút "ASM đã kiểm tra/duyệt".

## 8. Chỗ nào cần AI, chỗ nào chỉ cần code (Semi AI)
**Code lo (chính xác/ổn định):**
- Đăng nhập & phân quyền theo vai trò.
- Lưu bài nộp module; tính % tiến độ (mỗi module = 20%).
- Tổng hợp bán/tồn từ Excel (script PowerShell → `data-hangmoi.js`).
- Tính tỷ lệ bán ra, cảnh báo tồn ứ đọng (còn tồn & tỷ lệ bán ra < 35%), đề xuất điều chuyển theo tuyến cố định — toàn logic số học/quy tắc.

**AI lo (hiểu/viết — tùy chọn, làm NGOÀI app):**
- Soạn nội dung playbook/bài học từ file Excel.
- Viết nhận định + gợi ý hành động cho ngành hàng; tóm tắt phản hồi khách.

→ App runtime gần như KHÔNG dùng AI — đúng tinh thần "ít tốn token": nội dung sửa trong khối CONFIG, dữ liệu cập nhật bằng script, không gọi LLM khi vận hành.

---

## Phụ lục — Kiến trúc thực tế đã build
- 1 file `index.html` (HTML+CSS+JS nhúng), nội dung/tài khoản/module trong khối `CONFIG` tự sửa.
- Dữ liệu bán/tồn: `data-hangmoi.js` (gom bằng `cap-nhat-data.ps1`).
- Lưu bài nộp: localStorage (demo) ↔ Supabase (dùng chung realtime — xem `SETUP-SUPABASE.md`).
- Tabs: Hiểu dự án · Bài học 3 CH · Khảo sát thực địa · Báo cáo hàng mới · Điều chuyển hàng · Các Module thực thi · Tiến độ cửa hàng.
- Deploy: kéo–thả cả thư mục lên Netlify Drop.
