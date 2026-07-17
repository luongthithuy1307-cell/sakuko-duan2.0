# CÁCH CẬP NHẬT SỐ LIỆU CHO APP (bản tự động qua Supabase)

App live: https://luongthithuy1307-cell.github.io/sakuko-duan2.0/

## Quy trình MỚI — chỉ 2 việc, KHÔNG upload GitHub

### 1. Sửa file Excel gốc
Mở `BÁO CÁO BÁN HÀNG VÀ TỒN KHO DỰ ÁN 2.0.xlsx`
(ở `C:\Users\thuylt\Desktop\DỰ ÁN 2.0 TRAO QUYỀN CỬA HÀNG TRƯỞNG`)
→ dán data mới → **Lưu** (giữ nguyên tên file + tên 3 sheet + thứ tự cột).

### 2. Double-click chạy script
Chuột phải **`cap-nhat-data.ps1`** → **Run with PowerShell**
→ hiện "XONG. Da day len Supabase..." = xong.

→ App tự cập nhật **NGAY** (mở app bấm Ctrl+F5, hoặc ai đang mở sẵn thì số tự nhảy).

**Hết. Không upload GitHub, không chờ build.**

---

## Cách hoạt động
- Script đọc Excel → đẩy số liệu thẳng lên **Supabase** (bảng `hangmoi`).
- App đọc số **live từ Supabase** mỗi khi mở. File `data-hangmoi.js` chỉ là bản dự phòng (nếu Supabase lỗi).

## Lưu ý
- Nếu script báo **404 / lỗi Supabase**: kiểm tra mạng, hoặc bảng `hangmoi` bị xóa → chạy lại SQL tạo bảng.
- Nếu Excel **đổi cấu trúc** (đổi tên cột/sheet, thêm sheet) → script báo lỗi → gọi Claude chỉnh lại ánh xạ cột.
- **KHÔNG cần** và **KHÔNG nên** kéo file Excel hay data-hangmoi.js lên GitHub cho việc cập nhật số nữa.

## Muốn 0 thao tác (hẹn giờ tự chạy)
Có thể đặt Windows Task Scheduler chạy `cap-nhat-data.ps1` theo lịch (vd 8h sáng) — cần PC bật đúng giờ. Nói Claude nếu muốn cài.
