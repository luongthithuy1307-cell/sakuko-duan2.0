# Nghiên cứu 4 plugin AI — trước khi áp dụng cho Dự Án 2.0
> Đọc trực tiếp mã nguồn + README 4 repo ngày 30/09/2026. Mục đích: hiểu từng cái làm gì, có hợp dự án Sakuko không, rủi ro gì — TRƯỚC khi cài.

---

## Tóm tắt 1 dòng mỗi plugin

| Plugin | Là gì | Chạy ở đâu | Hợp Dự Án 2.0? |
|---|---|---|---|
| **Ponytail** | Bộ luật "dev lười thông minh" ép AI viết ÍT code nhất đủ dùng | Plugin Claude Code (skill + hook) | ✅ Rất hợp — đúng tinh thần "ít tốn token", 1 file HTML |
| **Agent Skills** (Addy Osmani) | 25 quy trình kỹ sư chuẩn: spec → plan → build → test → review → ship | Plugin Claude Code (skill + lệnh `/spec`, `/plan`…) | ✅ Hợp — chọn lọc vài skill, không cài hết |
| **Graphify** | Vẽ toàn bộ dự án (code + tài liệu + PDF + ảnh) thành "bản đồ tri thức" để AI tra cứu thay vì đọc lại từng file | CLI Python + skill `/graphify` | 🟡 Chưa cần ngay — dự án còn nhỏ (~20 file) |
| **OmniRoute** | Cổng trung gian AI: 1 địa chỉ → 350+ nhà cung cấp model, tự chuyển model khi hết hạn mức, nén token | Server Node.js chạy trên máy/VPS (`localhost:20128`) | 🟡 Cân nhắc cho 2 bot Lark — có rủi ro, xem mục 4 |

---

## 1. Ponytail — "Ông dev tóc đuôi ngựa"
**Repo:** github.com/DietrichGebert/ponytail · MIT

**Làm gì:** Trước khi viết code, AI phải đi qua "thang 7 bậc", dừng ở bậc đầu tiên giải quyết được:
1. Có cần làm không? → không thì bỏ (YAGNI)
2. Trong dự án đã có chưa? → dùng lại
3. Thư viện chuẩn có sẵn? → dùng
4. Trình duyệt/nền tảng có sẵn? (vd `<input type="date">` thay cả thư viện lịch)
5. Thư viện đã cài? → dùng
6. Viết 1 dòng được? → 1 dòng
7. Cuối cùng mới viết tối thiểu

**Không bao giờ cắt:** kiểm tra dữ liệu đầu vào, xử lý lỗi, bảo mật, khả năng truy cập.

**Số đo (tác giả tự đo, Claude Haiku 4.5, 12 task):** −54% dòng code, −20% chi phí, −27% thời gian, an toàn 100%.

**Lệnh có sẵn:** `/ponytail` (bật/tắt, mức lite/full/ultra), `/ponytail-review` (soát 1 thay đổi), `/ponytail-audit` (soát cả repo tìm code thừa), `/ponytail-debt`, `/ponytail-gain`.

**Cài (Claude Code, gửi 2 lệnh riêng):**
```
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```
Cần `node` trên máy.

**Áp dụng Dự Án 2.0:** Chạy `/ponytail-audit` 1 lần trên repo này để tìm phần thừa trong `tab-*.js`, `core.js`, 2 bot. Bật mặc định khi sửa code về sau.

---

## 2. Agent Skills — Quy trình kỹ sư cấp cao
**Repo:** github.com/addyosmani/agent-skills · MIT · tác giả Addy Osmani (Google Chrome)

**Làm gì:** 25 skill + 9 lệnh theo vòng đời phát triển:

```
/spec → /plan → /build → /test → /review → /ship
```
Mỗi skill có các bước, "cổng kiểm tra" bắt buộc, bảng chặn AI tự bào chữa khi làm tắt.

**Skill đáng chú ý cho mình:**
| Skill | Dùng khi |
|---|---|
| `interview-me` | AI hỏi từng câu để làm rõ yêu cầu trước khi làm (hợp khi giao việc mơ hồ) |
| `spec-driven-development` | Viết đặc tả trước (mình đã có `DAC-TA-duan2.md` — cùng tinh thần) |
| `planning-and-task-breakdown` | Chia việc nhỏ, làm từng lát |
| `security-and-hardening` | Soát bảo mật — **cần cho phần đăng nhập + Supabase + key Groq/Lark** |
| `code-review-and-quality` | Review 5 trục trước khi đẩy lên |

**Cài:**
```
/plugin marketplace add addyosmani/agent-skills
/plugin install agent-skills@addy-agent-skills
```
Hoặc từng skill: `npx skills add addyosmani/agent-skills --skill security-and-hardening`

**Lưu ý:** Bộ này thiên về dự án phần mềm lớn (CI/CD, TDD, observability…). Dự án 2.0 là web 1 file + 2 bot → **chỉ lấy 3–5 skill ở trên**, cài cả 25 dễ làm AI "quy trình hóa" quá mức, ngược với Ponytail.

---

## 3. Graphify — Bản đồ tri thức dự án
**Repo:** github.com/Graphify-Labs/graphify · Apache-2.0 · YC S26

**Làm gì:** Gõ `/graphify .` → quét cả thư mục → ra 3 file:
- `graph.html` — bản đồ bấm được trên trình duyệt
- `GRAPH_REPORT.md` — khái niệm chính, liên kết bất ngờ, câu hỏi gợi ý
- `graph.json` — để AI tra cứu về sau không cần đọc lại file

Đọc được: code (~40 ngôn ngữ, **có `.ps1`, `.js`, `.html`**), Markdown, **`.xlsx/.docx`** (cài thêm `graphifyy[office]`), PDF, ảnh, video.

**Riêng tư:**
- Code: phân tích ngay trên máy, không gửi đi đâu.
- Tài liệu/PDF/ảnh/Excel: **gửi qua model AI** để hiểu nội dung. ⚠️ Cẩn thận file Excel bán/tồn, P&L — không nên cho vào nếu chưa chắc. Có cờ `--code-only`.
- Có ghi log câu hỏi vào `~/.cache/graphify-queries.log` (tắt bằng `GRAPHIFY_QUERY_LOG_DISABLE=1`).

**Cài:** `uv tool install graphifyy` → `graphify install`

**Áp dụng:** Dự án hiện ~20 file, AI đọc hết trong 1 lượt → **chưa cần**. Đáng dùng khi: nhân bản ra 12 CH nhượng quyền, thêm nhiều bot/tab/tài liệu SOP, hoặc muốn gom kho tài liệu (SOP, playbook, bài học CH) thành 1 bản đồ tra cứu.

---

## 4. OmniRoute — Cổng AI miễn phí
**Repo:** github.com/diegosouzapw/OmniRoute · MIT · v3.8.52

**Làm gì:** Chạy 1 server trên máy (`npm i -g omniroute` → `localhost:20128`). Mọi công cụ/bot gọi vào 1 địa chỉ `/v1` chuẩn OpenAI; OmniRoute tự chọn trong 350+ nhà cung cấp (150+ có gói miễn phí):
- Model `auto`, `auto/cheap`, `auto/fast`… tự chọn và **tự chuyển sang model khác khi hết hạn mức/lỗi** (4 tầng: gói trả phí → API key → rẻ → miễn phí).
- Nén token 15–95% (RTK + Caveman), giữ nguyên code/JSON.
- Dashboard xem chi phí, hạn mức, độ trễ. Key mã hóa AES-256, không telemetry.

**Liên quan trực tiếp dự án:** 2 bot Lark (`sakuko-lark-bot`, `sakuko-bot-cskh`) đang gọi thẳng Groq (`llama-3.3-70b-versatile`) qua `groq.js`. Nếu Groq sập/hết hạn mức → bot chết. Với OmniRoute chỉ cần đổi URL trong `groq.js` từ `api.groq.com/openai/v1` sang `localhost:20128/v1` → có dự phòng tự động.

**⚠️ Rủi ro — phải cân nhắc trước khi dùng cho vận hành thật:**
1. **Dữ liệu khách hàng đi qua nhà cung cấp lạ.** Bot CSKH nhận tin nhắn khách → `auto` có thể route sang nhà cung cấp miễn phí không rõ chính sách dữ liệu. Chính repo đánh dấu **13 nhà cung cấp "avoid"** về điều khoản.
2. **Nhiều tính năng "lách"** (TLS stealth, proxy vượt chặn, gom gói đăng ký của nhiều người) — có thể vi phạm điều khoản nhà cung cấp → khóa tài khoản.
3. **Thêm 1 server phải nuôi** (máy chạy bot phải chạy thêm OmniRoute 24/7) — trái với tinh thần "ít đồ nghề".
4. Dự án rất lớn, cập nhật liên tục (tuần nào cũng có bản mới) → dễ vỡ.

**Khuyến nghị:** Nếu dùng, **khóa cứng danh sách nhà cung cấp tin cậy** (Groq + 1 dự phòng như Gemini/Claude có key chính chủ), KHÔNG để `auto` chọn nhà cung cấp miễn phí cho bot CSKH. Phương án đơn giản hơn (đúng tinh thần Ponytail): thêm 1 model dự phòng ngay trong `groq.js` (~10 dòng) — không cần server mới.

---

## 5. Đề xuất thứ tự triển khai

| Bước | Việc | Lý do |
|---|---|---|
| 1 | Cài **Ponytail**, chạy `/ponytail-audit` trên repo | Rẻ, an toàn, lợi ngay |
| 2 | Cài 3 skill **Agent Skills**: `security-and-hardening`, `code-review-and-quality`, `interview-me` | Soát bảo mật đăng nhập + key API trước khi mở cho 8 CH |
| 3 | **Chưa cài OmniRoute** — trước mắt thêm model dự phòng trong `groq.js`. Xem lại khi bot mở rộng ra 12 CH nhượng quyền | Rủi ro dữ liệu KH > lợi ích |
| 4 | **Graphify** để sau — khi repo có nhiều SOP/tài liệu hoặc nhân bản sang chuỗi nhượng quyền | Dự án còn nhỏ, chưa đáng |

**Câu hỏi cần chốt trước khi làm:**
1. "Làm" cụ thể là gì — cài plugin vào Claude Code của ai (máy chị Thùy / anh Minh Đăng), hay tích hợp vào chính dự án?
2. Bot CSKH có được phép gửi tin nhắn khách hàng qua nhà cung cấp AI ngoài Groq không?
