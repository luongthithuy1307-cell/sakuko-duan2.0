# YÊU CẦU IT: Bật Bot + quyền nhắn tin cho app Lark

> App: **Lường Thị Thùy's Lark CLI** (`cli_aaa0cdab09b99eef`) — đã có sẵn quyền đọc Wiki/Drive.
> Lần này chỉ cần thêm phần **nhắn tin** để app trở thành bot chat được.

## Việc cần làm — 3 phần

### 1. Bật tính năng Bot
- Console app → **Features → Bot** → **Enable bot**.

### 2. Thêm quyền nhắn tin (Permissions & Scopes)
| Scope | Dùng để |
|---|---|
| `im:message` | Gửi tin nhắn trả lời |
| `im:message:send_as_bot` | Bot chủ động gửi tin |
| `im:message.receive_v1` *(event)* | Nhận tin người dùng gửi cho bot |
| `im:chat:readonly` | Đọc thông tin chat (nếu cần) |

### 3. Đăng ký sự kiện nhận tin (Events & Callbacks)
- Console app → **Events & Callbacks** → chọn chế độ **Long Connection / Kết nối dài** (KHÔNG cần webhook URL public).
- Thêm event: **`im.message.receive_v1`** (Nhận tin nhắn).

### 4. Phát hành
- **Create Version → Submit → admin duyệt** (giống lần thêm quyền Wiki).

---

## Sau khi duyệt xong
- Nhắn được cho bot trong Lark (DM hoặc @bot trong nhóm).
- Không cần server public — bot chạy kiểu "gọi ra" (long connection), pilot chạy ngay trên máy chị Thùy được.

## Định danh
- App ID: `cli_aaa0cdab09b99eef`
- Domain: `https://open.larksuite.com`
