# Bật Supabase — để 8 CH dùng chung, % cập nhật realtime

Làm 1 lần, ~5 phút. Sau đó QL nộp trên điện thoại → Thùy/ASM thấy % nhảy ngay trên mọi máy.

---

## Bước 1 — Tạo project Supabase (miễn phí)
1. Vào https://supabase.com → **Sign in** (dùng Google) → **New project**.
2. Đặt tên `sakuko-duan2`, chọn region **Southeast Asia (Singapore)**, đặt 1 mật khẩu database (lưu lại), bấm **Create**.
3. Đợi ~1 phút cho project khởi tạo xong.

## Bước 2 — Tạo bảng dữ liệu
1. Menu trái → **SQL Editor** → **New query**.
2. Dán nguyên khối dưới đây rồi bấm **Run**:

```sql
create table submissions (
  id bigint generated always as identity primary key,
  store_name text not null,
  username   text,
  module_id  text not null,
  data       jsonb,
  at         bigint
);

-- Cho phép app (khóa ẩn danh) đọc/ghi
alter table submissions enable row level security;
create policy "app_all" on submissions
  for all to anon using (true) with check (true);

-- Bật realtime để % tự cập nhật
alter publication supabase_realtime add table submissions;
```

## Bước 3 — Lấy 2 chìa khóa
1. Menu trái → **Project Settings** (bánh răng) → **API**.
2. Copy 2 giá trị:
   - **Project URL** (dạng `https://xxxx.supabase.co`)
   - **anon public** key (chuỗi dài bắt đầu `eyJ...`)

## Bước 4 — Dán vào app
Mở `index.html`, tìm dòng gần đầu:

```js
SUPABASE: { url:"", anonKey:"" },
```

Dán vào giữa 2 dấu ngoặc kép:

```js
SUPABASE: { url:"https://xxxx.supabase.co", anonKey:"eyJ...dán key ở đây..." },
```

Lưu file. Xong. Mở lại app — giờ dữ liệu chạy trên cloud, dùng chung mọi máy.

---

## Cách hoạt động sau khi bật
- QL login → tab **Các Module** → **Nộp** → ghi thẳng lên Supabase.
- Tab **Tiến độ** của Thùy/ASM: % cập nhật **realtime** (không cần F5).
- Để trống 2 ô key = quay lại chế độ demo (lưu trên máy). App không bao giờ hỏng dù chưa dán key.

## Lưu ý bảo mật
Đây là công cụ nội bộ, dữ liệu là báo cáo vận hành (không nhạy cảm tài chính) nên dùng anon key + quyền mở là chấp nhận được. Nếu sau này cần chặt hơn (mỗi QL chỉ sửa được CH mình), nói Claude nâng lên Supabase Auth + RLS theo user — 1 lần chỉnh.
