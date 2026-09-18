# Bot Lark tra tồn kho Sakuko

Nhân viên nhắn **Mã SP2 / SKU / barcode / tên hàng** cho bot trong Lark → bot trả về
**Total (tồn hệ thống)** + phân bổ theo kho, lấy từ file tồn kho ngày.
Groq chỉ để *hiểu câu hỏi*; **con số luôn lấy thẳng từ sheet** (không bịa).

## Nguyên tắc thiết kế
```
NV nhắn bot → Groq bóc "hỏi mã nào / kho nào" → CODE tra sheet ra số thật → trả lời
```

---

## Cài đặt

**1. Cài thư viện**
```powershell
cd "C:\Users\thuylt\Desktop\sakuko-lark-bot"
npm install
```

**2. Điền cấu hình**
- Copy `.env.example` → `.env`
- Điền `LARK_APP_SECRET` (App Secret của app)
- Điền `GROQ_API_KEY` — **key MỚI** (revoke key cũ đã lộ, tạo lại ở console.groq.com)

**3. Test tầng dữ liệu trước (chưa cần quyền nhắn tin)**
```powershell
node test-inventory.js 4901326030848
```
→ Phải in ra `KASUGAI- Kẹo dẻo vị nho tím 107g … TOTAL = 64`. Nếu đúng = tầng data OK.

**4. Chạy bot** (sau khi IT bật Bot + quyền nhắn tin — xem `docs/IT-cap-quyen-bot.md`)
```powershell
npm start
```
Rồi nhắn cho bot trong Lark để thử.

---

## Trạng thái & việc còn lại
| Việc | Ai | Xong? |
|---|---|---|
| Đọc tồn kho Lark | (đã có quyền) | ✅ |
| Groq hiểu câu hỏi | (đã test) | ✅ |
| Code bot | Claude | ✅ |
| **Bật Bot + quyền nhắn tin** | **IT** (`docs/IT-cap-quyen-bot.md`) | ⏳ |
| Dán App Secret + Groq key mới vào `.env` | Thùy | ⏳ |
| Chạy pilot trên máy Thùy | Thùy | ⏳ |
| Chuyển lên server 24/7 (sau khi pilot ổn) | IT | ⏳ |

## Ghi chú
- **Pilot chạy trên máy Thùy được** (long-connection gọi ra, không cần server). Nhưng máy tắt là bot nghỉ → muốn 24/7 cho cả team thì đưa lên 1 VM/container nhỏ (giai đoạn sau).
- Bot tự nạp lại data khi sang ngày mới. Hiện chỉ đọc **tồn kho** (không đụng P&L) nên mở cho cả team hỏi là an toàn dữ liệu.
- Barcode: nhiều mã trùng luôn với Mã SP2 nên tra được; mã nào barcode ≠ Mã SP2 sẽ bổ sung ánh xạ ở bản sau.
