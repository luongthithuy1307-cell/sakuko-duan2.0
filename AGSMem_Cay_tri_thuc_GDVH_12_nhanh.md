# AGSMem — KHO TRI THỨC GĐ VẬN HÀNH CHUỖI SAKUKO

## Phiên bản: 12 nhánh | Cập nhật: 2026-09-21

---

# PHẦN A — TỔNG QUAN

## 1. Mục đích

AGSMem là **kho kinh nghiệm vận hành thực tế**, không phải kho tài liệu.

Nguyên tắc cốt lõi:

> **Tình huống thực tế → Dấu hiệu → Phân tích → Nguyên nhân gốc → Hành động → Kết quả → Bài học → Cách xử lý lần sau**

Khi một vấn đề xảy ra → tìm case cũ → xem cách đã xử lý → tái sử dụng kinh nghiệm.

---

## 2. Cây tri thức tổng quan

```text
🌱 KHO TRI THỨC GĐVH SAKUKO
│
├── 01. DOANH THU & HIỆU QUẢ KINH DOANH
├── 02. HÀNG HÓA & TỒN KHO
├── 03. VẬN HÀNH CỬA HÀNG
├── 04. KHÁCH HÀNG & CSKH
├── 05. CON NGƯỜI & NĂNG LỰC
├── 06. ASM & QUẢN TRỊ CỬA HÀNG
├── 07. CHƯƠNG TRÌNH & DỰ ÁN
├── 08. SỰ CỐ & RỦI RO
├── 09. NHÀ CUNG CẤP & ĐỐI TÁC
├── 10. BÀI HỌC & NGUYÊN TẮC ĐIỀU HÀNH
├── 11. NHƯỢNG QUYỀN & MỞ RỘNG
└── 12. CHIẾN LƯỢC & QUẢN LÝ THAY ĐỔI
```

---

## 3. Cấu trúc chuẩn cho mỗi case (8 phần)

Mỗi tình huống thực tế ghi theo cấu trúc này:

```text
[1. TÌNH HUỐNG]
Mô tả ngắn gọn chuyện gì đã xảy ra.
- Thời điểm:
- Cửa hàng / khu vực:
- Người liên quan:

[2. DẤU HIỆU PHÁT HIỆN]
Số liệu / biểu hiện cho thấy vấn đề đang xảy ra.
- Doanh thu:
- Kế hoạch:
- Bill / TBB / SP/Bill:
- Traffic:
- Tồn kho / KPI:

[3. PHÂN TÍCH]
Các bước kiểm tra để xác định vấn đề.
- Bước 1:
- Bước 2:
- Bước 3:

[4. NGUYÊN NHÂN GỐC]
Nguyên nhân thực sự sau khi kiểm tra.

[5. HÀNH ĐỘNG XỬ LÝ]
Mỗi hành động ghi rõ:
- Việc gì? — Ai làm? — Deadline? — Chỉ số cần đạt?

[6. KẾT QUẢ]
- Trước:
- Sau:
- Mức cải thiện:

[7. BÀI HỌC]
- Điều gì cần giữ lại?
- Điều gì không được lặp lại?

[8. LẦN SAU GẶP LẠI]
Nếu gặp tình huống tương tự, xử lý theo thứ tự nào?
```

---

## 4. Trạng thái case

```text
🔴 ĐANG XỬ LÝ
🟡 ĐANG THEO DÕI
🟢 ĐÃ XỬ LÝ
📚 ĐÃ CHUẨN HÓA THÀNH BÀI HỌC
```

---

## 5. Quy tắc nhập kho tri thức

| # | Quy tắc | Giải thích |
|---|---------|-----------|
| 1 | Ưu tiên case thật | Không tạo tình huống giả để làm đầy kho |
| 2 | Không chỉ ghi "đã xử lý" | Phải ghi **đã xử lý như thế nào** |
| 3 | Phải có nguyên nhân | Không dừng ở hiện tượng |
| 4 | Phải có kết quả | Chưa có → đánh dấu 🟡 ĐANG THEO DÕI |
| 5 | Phải có bài học | Case chỉ thành tri thức khi rút được điều dùng lại |
| 6 | Một case có thể liên quan nhiều nhánh | Dùng tag/liên kết, không cần copy nội dung |

---

## 6. Tư duy sử dụng kho

```text
VẤN ĐỀ XẢY RA
   ↓
ĐÃ TỪNG XẢY RA CHƯA? → Tìm trong kho
   ↓
CASE CŨ → Đã xử lý thế nào?
   ↓
KẾT QUẢ RA SAO?
   ↓
BÀI HỌC → Lần này áp dụng gì?
```

---

# PHẦN B — CHI TIẾT TỪNG NHÁNH

---

## 01. DOANH THU & HIỆU QUẢ KINH DOANH

### Tên nhánh
`01. Doanh thu & hiệu quả kinh doanh`

### Nhánh này gom loại tri thức gì
Các tình huống thực tế liên quan đến doanh thu, kế hoạch kinh doanh, TBB, SP/Bill, số bill, khách hàng, tỷ lệ chuyển đổi, EBIT và hiệu quả kinh doanh của cửa hàng hoặc toàn chuỗi.

### Cách viết
Mỗi bản ghi phải mô tả tình huống thực tế, dấu hiệu phát hiện, số liệu liên quan, nguyên nhân, các bước phân tích, hành động đã giao, người chịu trách nhiệm, kết quả và bài học. Ưu tiên số liệu thực tế và cách xử lý cụ thể.

### Dài tối đa
800

### Xử lý mâu thuẫn
Ghi thêm bản mới — cần giữ lịch sử qua từng tháng để so sánh xu hướng

### Nhánh con

```text
01. Doanh thu & hiệu quả kinh doanh
│
├── Doanh thu giảm
├── Không đạt kế hoạch
├── TBB giảm
├── SP/Bill giảm
├── Số bill giảm
├── Khách giảm
├── Khách ổn định nhưng doanh thu giảm
├── Cửa hàng tăng trưởng tốt
└── Cửa hàng hiệu quả thấp
```

### Ví dụ case

```text
[1. TÌNH HUỐNG]
Tháng 5/2026, CH Trần Duy Hưng có lượng khách ổn định nhưng doanh thu giảm 12% so với kế hoạch.

[2. DẤU HIỆU]
- Traffic: ổn định (~180 khách/ngày)
- Bill: giảm nhẹ (-5%)
- TBB: giảm từ 285k → 248k
- SP/Bill: giảm từ 3.2 → 2.6

[3. PHÂN TÍCH]
Bước 1: So sánh DT vs KH → gap 12%
Bước 2: Traffic ổn → không phải thiếu khách
Bước 3: TBB giảm + SP/Bill giảm → khách mua ít hơn mỗi lần
Bước 4: Kiểm tra top SKU → nhóm chăm sóc da cao cấp giảm mạnh
Bước 5: Kiểm tra OOS → 3 SKU top đang hết hàng 5 ngày
Bước 6: Kiểm tra tư vấn → NV mới chưa biết cross-sell nhóm này

[4. NGUYÊN NHÂN GỐC]
OOS 3 SKU chủ lực + NV mới chưa được training cross-sell nhóm chăm sóc da

[5. HÀNH ĐỘNG]
1. Nhập bổ sung 3 SKU — Phòng MH — trong 2 ngày
2. QLST coaching NV mới về cross-sell — ngay trong tuần
3. ASM check lại trưng bày nhóm skincare — trước thứ 6
4. Theo dõi TBB + SP/Bill hàng ngày trong 2 tuần

[6. KẾT QUẢ]
- TBB: 248k → 278k sau 10 ngày
- SP/Bill: 2.6 → 3.0
- DT gap thu hẹp từ -12% → -4%

[7. BÀI HỌC]
Khi khách không giảm nhưng DT giảm → kiểm tra TBB + SP/Bill trước, không tập trung tìm thêm khách. OOS hàng chủ lực + NV thiếu kỹ năng cross-sell là combo phổ biến.

[8. LẦN SAU]
Traffic → Bill → TBB → SP/Bill → Top SKU → OOS → Tư vấn bán hàng
```

---

## 02. HÀNG HÓA & TỒN KHO

### Tên nhánh
`02. Hàng hóa & tồn kho`

### Nhánh này gom loại tri thức gì
Các tình huống liên quan đến nhập hàng, tồn kho, thiếu hàng, hàng chậm bán, hàng cận date, hàng lỗi, thất thoát, chênh lệch tồn kho, điều chuyển, cơ cấu hàng hóa và sản phẩm mới.

### Cách viết
Ghi rõ vấn đề hàng hóa xảy ra ở đâu, số liệu hoặc dấu hiệu phát hiện, nguyên nhân, cách kiểm tra, phương án xử lý, người chịu trách nhiệm, thời hạn, kết quả và bài học để tránh lặp lại.

### Dài tối đa
700

### Xử lý mâu thuẫn
Ghi đè bản cũ — vì đây là trạng thái vận hành hiện tại

### Nhánh con

```text
02. Hàng hóa & tồn kho
│
├── Thiếu hàng / OOS
├── Tồn kho cao
├── Hàng chậm bán
├── Hàng cận date
├── Hàng hết date
├── Thất thoát
├── Chênh lệch tồn kho
├── Điều chuyển hàng
├── Hàng lỗi / chất lượng
└── Sản phẩm mới
```

### Ví dụ case

```text
[1. TÌNH HUỐNG]
Tháng 6/2026, 4 CH khu vực Cầu Giấy có tồn kho nhóm sữa tắm Nhật vượt 180 ngày bán, trong khi nhóm này chỉ chiếm 3% doanh thu.

[2. DẤU HIỆU]
- Tồn kho: 420 units, đủ bán 180 ngày
- Doanh thu nhóm: 3% tổng DT
- Hàng cận date 3 tháng: 85 units

[3. PHÂN TÍCH]
Bước 1: Check DOI (days of inventory) → 180 ngày, vượt chuẩn 45 ngày
Bước 2: Check lịch sử nhập → đợt nhập lớn tháng 1 chưa điều chỉnh
Bước 3: So sánh 4 CH → CH Trần Thái Tông chiếm 60% tồn
Bước 4: Kiểm tra trưng bày → hàng nằm kệ dưới, không POSM

[4. NGUYÊN NHÂN GỐC]
Nhập đợt lớn đầu năm không tính theo sell-through. Trưng bày kém, không có push bán.

[5. HÀNH ĐỘNG]
1. Điều chuyển 150 units từ CH Trần Thái Tông sang 3 CH khác — QLST — 3 ngày
2. Đẩy trưng bày lên kệ ngang tầm mắt + POSM — NV merchandising — 2 ngày
3. Gắn combo khuyến mãi mua 2 giảm 15% — Phòng MH — 1 tuần
4. Cận date 85 units → chương trình flash sale nội bộ — Phòng MH — trong tháng

[6. KẾT QUẢ]
- DOI giảm từ 180 → 75 ngày sau 6 tuần
- Hàng cận date bán hết 90%

[7. BÀI HỌC]
Nhập hàng đầu năm phải tính theo sell-through rate 3 tháng gần nhất, không theo budget. Tồn vượt 60 ngày → cảnh báo tự động, không đợi 180 ngày mới xử lý.

[8. LẦN SAU]
DOI vượt 60 ngày → kiểm tra sell-through → điều chuyển + đẩy trưng bày + combo → flash sale nếu cận date
```

---

## 03. VẬN HÀNH CỬA HÀNG

### Tên nhánh
`03. Vận hành cửa hàng`

### Nhánh này gom loại tri thức gì
Các tình huống phát sinh trong quá trình vận hành: mở/đóng cửa, trưng bày, vệ sinh, POSM, giá, quy trình, checklist, tiêu chuẩn vận hành, audit và chất lượng phục vụ.

### Cách viết
Ghi tình huống thực tế, tiêu chuẩn đáng lẽ phải đạt, thực tế phát hiện, nguyên nhân, cách xử lý tại cửa hàng, cách kiểm soát sau xử lý và bài học vận hành.

### Dài tối đa
700

### Xử lý mâu thuẫn
Ghi thêm bản mới — mỗi case vận hành là 1 bài học riêng

### Nhánh con

```text
03. Vận hành cửa hàng
│
├── Không đạt chuẩn vận hành
├── Trưng bày
├── POSM & giá
├── Vệ sinh
├── Checklist
├── Audit
├── Quy trình không được thực hiện
└── Chất lượng vận hành cửa hàng
```

### Ví dụ case

```text
[1. TÌNH HUỐNG]
Audit tháng 7/2026, 5/23 CH không đạt chuẩn vệ sinh khu vực kệ sữa bột — bụi trên sản phẩm, kệ bẩn, sản phẩm xếp không đúng facing.

[2. DẤU HIỆU]
- Điểm audit vệ sinh: 5 CH dưới 60/100
- Khách phản hồi qua Zalo OA: 3 tin nhắn về "hàng bám bụi"

[3. PHÂN TÍCH]
Bước 1: Kiểm tra checklist vệ sinh → NV tick đủ nhưng thực tế không làm
Bước 2: Kiểm tra lịch phân công → khu sữa bột không có NV cố định phụ trách
Bước 3: QLST xác nhận "không kiểm tra thực tế, chỉ duyệt checklist trên app"

[4. NGUYÊN NHÂN GỐC]
QLST duyệt checklist mà không kiểm tra thực tế. Khu sữa bột không giao NV cụ thể phụ trách.

[5. HÀNH ĐỘNG]
1. Giao NV cố định phụ trách khu sữa bột mỗi ca — QLST — ngay
2. QLST phải chụp ảnh kệ trước/sau vệ sinh gửi nhóm — ASM giám sát — hàng ngày
3. ASM spot-check 2 CH/tuần không báo trước — ASM — liên tục
4. CH nào dưới 70 điểm audit 2 tháng liên tiếp → QLST bị cảnh cáo

[6. KẾT QUẢ]
- Điểm audit vệ sinh tháng sau: 5 CH tăng từ 55-60 → 78-85
- Không còn phản hồi khách về bụi

[7. BÀI HỌC]
Checklist tick trên app mà không spot-check = vô nghĩa. Phải giao trách nhiệm cụ thể theo khu + kiểm tra bằng ảnh + ASM spot-check bất ngờ.

[8. LẦN SAU]
Audit thấp → kiểm tra thực tế tại CH → đối chiếu checklist vs thực tế → giao NV cụ thể theo khu → ảnh trước/sau → spot-check
```

---

## 04. KHÁCH HÀNG & CSKH

### Tên nhánh
`04. Khách hàng & CSKH`

### Nhánh này gom loại tri thức gì
Các tình huống liên quan đến khách hàng, khiếu nại, phản hồi, trải nghiệm mua hàng, sản phẩm có vấn đề, khách hàng không hài lòng, xử lý bồi hoàn và phục hồi niềm tin.

### Cách viết
Ghi nguyên văn vấn đề khách phản ánh khi cần, bối cảnh, mức độ ảnh hưởng, cách CSKH xử lý ban đầu, quyết định của quản lý, hành động với khách, hành động nội bộ, kết quả và bài học.

### Dài tối đa
700

### Xử lý mâu thuẫn
Ghi thêm bản mới

### Nhánh con

```text
04. Khách hàng & CSKH
│
├── Khiếu nại
├── Sản phẩm có vấn đề
├── Dịch vụ không đạt
├── Khách hàng không hài lòng
├── Khách hàng quan trọng
├── Phục hồi trải nghiệm
└── Bài học CSKH
```

### Ví dụ case

```text
[1. TÌNH HUỐNG]
Tháng 8/2026, khách VIP (mua >50tr/năm) phản ánh trên Zalo OA rằng mua kem chống nắng Anessa tại CH Bắc Ninh nhưng về nhà phát hiện hàng cận date còn 1 tháng, trong khi NV không thông báo.

[2. DẤU HIỆU]
- Khách VIP gửi tin nhắn bức xúc kèm ảnh date sản phẩm
- Khách nói "sẽ không quay lại"

[3. PHÂN TÍCH]
Bước 1: Xác minh sản phẩm → đúng, lô hàng cận date không gắn nhãn cảnh báo
Bước 2: Kiểm tra SOP → SOP yêu cầu dán sticker "cận date" khi còn dưới 3 tháng
Bước 3: Kiểm tra CH → QLST xác nhận "quên giao NV dán"

[4. NGUYÊN NHÂN GỐC]
QLST không thực hiện SOP dán sticker cận date. NV bán không kiểm tra date trước khi đưa khách.

[5. HÀNH ĐỘNG]
1. CSKH gọi xin lỗi khách + đổi sản phẩm mới + tặng voucher 200k — CSKH — trong ngày
2. QLST Bắc Ninh nhận cảnh cáo bằng văn bản — ASM — trong tuần
3. Rà soát toàn bộ hàng cận date 23 CH — tất cả QLST — trong 3 ngày
4. Bổ sung vào checklist mở cửa: kiểm tra date kệ front — áp dụng ngay

[6. KẾT QUẢ]
- Khách chấp nhận lời xin lỗi, quay lại mua tháng sau
- Rà soát phát hiện thêm 12 SKU cận date chưa gắn nhãn ở 4 CH khác

[7. BÀI HỌC]
Hàng cận date phải gắn sticker + NV phải thông báo khách trước khi thanh toán. Mất 1 khách VIP (50tr/năm) đắt hơn nhiều so với chi phí đổi hàng + voucher.

[8. LẦN SAU]
Khiếu nại khách VIP → xử lý trong 4h → xin lỗi + đổi/hoàn + voucher → xác minh nguyên nhân tại CH → rà soát toàn chuỗi nếu lỗi hệ thống
```

---

## 05. CON NGƯỜI & NĂNG LỰC

### Tên nhánh
`05. Con người & năng lực`

### Nhánh này gom loại tri thức gì
Các tình huống liên quan đến QLST, nhân viên, năng lực bán hàng, thái độ làm việc, KPI, đào tạo, coaching, đánh giá, sát hạch, tăng lương, thiếu người và các vấn đề nhân sự tại cửa hàng.

### Cách viết
Ghi rõ biểu hiện thực tế, ảnh hưởng đến kết quả, nguyên nhân, cách quản lý đã xử lý, cách coaching hoặc đào tạo, cam kết hành động, thời gian theo dõi, kết quả và bài học quản trị con người.

### Dài tối đa
800

### Xử lý mâu thuẫn
Ghi thêm bản mới — mỗi case con người là 1 bài học quản trị

### Nhánh con

```text
05. Con người & năng lực
│
├── QLST yếu
├── Nhân viên yếu
├── Kỹ năng bán hàng
├── Không đạt KPI
├── Coaching
├── Đào tạo
├── Sát hạch
├── Tăng lương
├── Thiếu nhân sự
└── Xung đột / phối hợp
```

### Ví dụ case

```text
[1. TÌNH HUỐNG]
Q2/2026, CH Nguyễn Trãi có 3 NV mới (dưới 2 tháng), tỷ lệ cross-sell chỉ đạt 15% (chuẩn 35%). NV không nhớ tên sản phẩm tiếng Nhật, không tự tin tư vấn.

[2. DẤU HIỆU]
- SP/Bill: 2.1 (chuẩn 3.0+)
- Cross-sell rate: 15%
- TBB: thấp nhất cụm

[3. PHÂN TÍCH]
Bước 1: Quan sát NV tư vấn → chỉ đưa đúng sản phẩm khách hỏi, không gợi ý thêm
Bước 2: Test kiến thức → NV không biết tên tiếng Việt của 60% SKU top
Bước 3: Check đào tạo → NV mới chỉ được training 1 buổi lý thuyết, chưa có thực hành

[4. NGUYÊN NHÂN GỐC]
Chương trình đào tạo NV mới thiếu phần thực hành tại quầy. Hàng Nhật nhiều SKU tiếng Nhật → NV không nhớ → không dám tư vấn.

[5. HÀNH ĐỘNG]
1. Tạo "bảng cheat sheet" 50 SKU top bằng tiếng Việt + công dụng — Training team — 3 ngày
2. QLST kèm NV mới 30 phút/ngày tại quầy, demo tư vấn thực tế — liên tục 2 tuần
3. Mỗi NV mới phải tư vấn thử 5 khách/ngày có QLST quan sát — 2 tuần
4. Sát hạch sau 2 tuần: nhận diện 30 SKU + tư vấn combo — Training team

[6. KẾT QUẢ]
- SP/Bill: 2.1 → 2.8 sau 3 tuần
- Cross-sell rate: 15% → 28%
- 2/3 NV qua sát hạch, 1 NV cần thêm 1 tuần

[7. BÀI HỌC]
Hàng Nhật nhiều SKU tiếng Nhật là rào cản lớn cho NV mới. Đào tạo phải có: cheat sheet tiếng Việt + thực hành tại quầy có kèm cặp + sát hạch. Training lý thuyết 1 buổi = vô dụng.

[8. LẦN SAU]
NV mới → cheat sheet 50 SKU ngay ngày đầu → kèm cặp 2 tuần → sát hạch → theo dõi SP/Bill 1 tháng
```

---

## 06. ASM & QUẢN TRỊ CỬA HÀNG

### Tên nhánh
`06. ASM & quản trị cửa hàng`

### Nhánh này gom loại tri thức gì
Các tình huống liên quan đến năng lực ASM, quản trị QLST, kiểm soát cửa hàng, giao việc, theo dõi hành động, coaching, báo cáo, kiểm tra thực tế và quản trị hiệu quả theo vùng.

### Cách viết
Ghi vấn đề quản trị, biểu hiện thực tế, khoảng cách giữa báo cáo và thực tế nếu có, nguyên nhân, cách ASM hoặc GĐVH can thiệp, nhiệm vụ được giao, cách kiểm soát và kết quả sau can thiệp.

### Dài tối đa
800

### Xử lý mâu thuẫn
Ghi thêm bản mới

### Nhánh con

```text
06. ASM & quản trị cửa hàng
│
├── ASM không kiểm soát được cửa hàng
├── Báo cáo không phản ánh thực tế
├── Giao việc không ra kết quả
├── Coaching ASM
├── Coaching QLST
├── Kiểm tra cửa hàng
└── Quản trị vùng
```

### Ví dụ case

```text
[1. TÌNH HUỐNG]
Tháng 7/2026, ASM vùng 2 báo cáo "tất cả CH đã triển khai trưng bày mới theo planogram". GĐVH đi thực tế 3 CH → chỉ 1 CH làm đúng, 2 CH chưa thay đổi gì.

[2. DẤU HIỆU]
- Báo cáo ASM: 100% hoàn thành
- Thực tế kiểm tra: 33% hoàn thành

[3. PHÂN TÍCH]
Bước 1: Kiểm tra tin nhắn ASM giao QLST → chỉ gửi file planogram, không giao deadline cụ thể
Bước 2: Kiểm tra QLST → "chưa nhận được hướng dẫn chi tiết, đang chờ"
Bước 3: ASM xác nhận "nghĩ là QLST tự hiểu, không follow-up"

[4. NGUYÊN NHÂN GỐC]
ASM giao việc kiểu "gửi file rồi coi như xong", không có deadline + không follow-up + không kiểm tra thực tế.

[5. HÀNH ĐỘNG]
1. GĐVH coaching ASM về cách giao việc: Việc gì → Ai → Deadline → Check — ngay
2. ASM phải gửi lại chỉ thị có deadline + QLST xác nhận hiểu — trong ngày
3. ASM kiểm tra thực tế 2 CH chưa làm trong 48h
4. Quy định: mọi chỉ thị phải có ảnh xác nhận hoàn thành từ QLST

[6. KẾT QUẢ]
- 3/3 CH hoàn thành planogram trong 3 ngày
- ASM bắt đầu dùng format giao việc chuẩn

[7. BÀI HỌC]
"Gửi file = giao việc" là lỗi quản trị phổ biến nhất của ASM. Giao việc phải có: nội dung rõ → deadline → xác nhận hiểu → kiểm tra thực tế → ảnh xác nhận.

[8. LẦN SAU]
Nhận báo cáo "đã hoàn thành" → spot-check ít nhất 30% → nếu sai lệch → coaching ASM về quy trình giao việc
```

---

## 07. CHƯƠNG TRÌNH & DỰ ÁN

### Tên nhánh
`07. Chương trình & dự án`

### Nhánh này gom loại tri thức gì
Các tình huống và bài học khi triển khai chương trình thi đua, chiến dịch bán hàng, khai trương, xả hàng, CSKH, chương trình đào tạo (PURO) và các dự án cải tiến vận hành.

### Cách viết
Ghi mục tiêu chương trình, kế hoạch ban đầu, vấn đề phát sinh, cách xử lý, người chịu trách nhiệm, kết quả so với mục tiêu và bài học để áp dụng cho chương trình sau.

### Dài tối đa
700

### Xử lý mâu thuẫn
Ghi thêm bản mới — giữ lịch sử các chương trình để so sánh hiệu quả

### Nhánh con

```text
07. Chương trình & dự án
│
├── Thi đua doanh thu
├── Chiến dịch bán hàng
├── Khai trương
├── Xả hàng / thanh lý
├── Chương trình CSKH / VIP
├── Đào tạo (PURO / nội bộ)
├── Dự án cải tiến vận hành
└── Chương trình truyền thông nội bộ
```

### Ví dụ case

```text
[1. TÌNH HUỐNG]
Q1/2026, triển khai thi đua "Rank S Champion" — xếp hạng CH theo DT + TBB + SP/Bill, thưởng theo rank S/A/B/C. Mục tiêu: tăng DT chuỗi 8% so cùng kỳ.

[2. DẤU HIỆU]
- Tuần 1-2: 15/23 CH tăng effort rõ rệt
- Tuần 3-4: 5 CH nhóm C bắt đầu buông, "không thể đuổi kịp"
- Cuối Q1: DT chuỗi +5.2% (mục tiêu 8%)

[3. PHÂN TÍCH]
Bước 1: CH rank S/A duy trì tốt
Bước 2: CH rank C bỏ cuộc sớm → mất 30% lực lượng
Bước 3: Cơ chế chấm điểm tuyệt đối → CH nhỏ không thể cạnh tranh CH lớn

[4. NGUYÊN NHÂN GỐC]
Cơ chế chấm điểm tuyệt đối khiến CH nhỏ/yếu không có cơ hội → buông sớm. Thiếu giải thưởng "tiến bộ nhất" để giữ động lực nhóm dưới.

[5. HÀNH ĐỘNG]
1. Q2 chuyển sang chấm theo % tăng trưởng so với chính mình — GĐVH — áp dụng ngay
2. Thêm giải "Tiến bộ nhất" cho CH tăng % cao nhất — GĐVH
3. Chia 3 league theo quy mô CH: Lớn / Trung / Nhỏ — công bằng hơn
4. Cập nhật bảng xếp hạng hàng tuần trên Lark — ASM

[6. KẾT QUẢ]
- Q2 với cơ chế mới: DT chuỗi +9.1%
- CH nhóm C tham gia tích cực hơn, 3 CH nhận giải "Tiến bộ nhất"

[7. BÀI HỌC]
Thi đua tuyệt đối → nhóm yếu buông. Thi đua theo % tăng trưởng + chia league + giải tiến bộ → giữ được toàn bộ đội ngũ. Thi đua phải thiết kế để 100% CH có cơ hội thắng.

[8. LẦN SAU]
Thiết kế thi đua → chấm theo % tăng trưởng → chia league → giải tiến bộ nhất → cập nhật hàng tuần → review giữa kỳ điều chỉnh nếu cần
```

---

## 08. SỰ CỐ & RỦI RO

### Tên nhánh
`08. Sự cố & rủi ro`

### Nhánh này gom loại tri thức gì
Các tình huống bất thường hoặc ảnh hưởng cao: sự cố sản phẩm, an toàn thực phẩm, mất điện, hệ thống lỗi, PCCC, an toàn cửa hàng, gian lận, thất thoát và các sự cố cần xử lý nhanh.

### Cách viết
Ghi thời điểm, địa điểm, tình huống, mức độ ảnh hưởng, hành động khẩn cấp, người được thông báo, nguyên nhân, phương án xử lý, kết quả, hành động phòng ngừa và bài học.

### Dài tối đa
700

### Xử lý mâu thuẫn
Ghi thêm bản mới — mỗi sự cố là 1 case học quan trọng

### Nhánh con

```text
08. Sự cố & rủi ro
│
├── Sự cố sản phẩm (recall, chất lượng)
├── An toàn thực phẩm
├── Mất điện / hệ thống
├── PCCC / an toàn CH
├── Gian lận nội bộ
├── Thất thoát bất thường
├── Khủng hoảng truyền thông
└── Sự cố pháp lý / thanh kiểm tra
```

### Ví dụ case

```text
[1. TÌNH HUỐNG]
Tháng 4/2026, đoàn kiểm tra QLTT đến CH Bắc Ninh kiểm tra nguồn gốc hàng hóa. Yêu cầu xuất trình hóa đơn, CO, giấy kiểm định cho 15 SKU ngẫu nhiên.

[2. DẤU HIỆU]
- Đoàn kiểm tra đến không báo trước
- QLST không tìm được hóa đơn 3/15 SKU tại CH

[3. PHÂN TÍCH]
Bước 1: 3 SKU thiếu hóa đơn → kiểm tra hệ thống HQ → có đủ nhưng chưa gửi CH
Bước 2: CH không có folder lưu trữ chứng từ theo quy định
Bước 3: Đoàn cho thời hạn 24h bổ sung

[4. NGUYÊN NHÂN GỐC]
HQ chưa có quy trình gửi bộ chứng từ xuống CH. CH không có folder chuẩn lưu chứng từ sẵn sàng cho kiểm tra.

[5. HÀNH ĐỘNG]
1. Bổ sung 3 hóa đơn trong 4h — Phòng MH — khẩn cấp
2. Tạo folder chuẩn "Chứng từ sẵn sàng kiểm tra" cho 23 CH — GĐVH — 1 tuần
3. HQ gửi bộ chứng từ mới nhất cho toàn bộ CH mỗi đầu tháng — Phòng MH — hàng tháng
4. Đưa vào checklist audit: kiểm tra folder chứng từ — ASM — liên tục

[6. KẾT QUẢ]
- Bổ sung kịp 24h, không bị phạt
- 23 CH có folder chứng từ chuẩn sau 1 tuần

[7. BÀI HỌC]
Kiểm tra QLTT đến bất ngờ là chuyện bình thường. CH phải luôn sẵn sàng: folder chứng từ đầy đủ + QLST biết chứng từ ở đâu. Không đợi kiểm tra mới tìm.

[8. LẦN SAU]
Nhận tin kiểm tra → bình tĩnh → mở folder chứng từ → xuất trình → thiếu gì gọi HQ bổ sung ngay → ghi nhận lại để cập nhật folder
```

---

## 09. NHÀ CUNG CẤP & ĐỐI TÁC

### Tên nhánh
`09. Nhà cung cấp & đối tác`

### Nhánh này gom loại tri thức gì
Các tình huống trong quá trình phối hợp với NCC và đối tác: giao hàng, chất lượng, thiếu hàng, sai cam kết, xử lý sự cố, phối hợp cải tiến và đánh giá thực hiện cam kết.

### Cách viết
Ghi vấn đề, cam kết ban đầu, thực tế phát sinh, ảnh hưởng đến CH hoặc khách hàng, cách làm việc với đối tác, phương án xử lý, kết quả và yêu cầu phòng ngừa tái diễn.

### Dài tối đa
600

### Xử lý mâu thuẫn
Ghi thêm bản mới

### Nhánh con

```text
09. Nhà cung cấp & đối tác
│
├── Giao hàng trễ / sai
├── Chất lượng không đạt
├── Thiếu hàng từ NCC
├── Sai cam kết thương mại
├── Phối hợp cải tiến
└── Đánh giá NCC
```

### Ví dụ case

```text
[1. TÌNH HUỐNG]
Tháng 3/2026, NCC X giao lô hàng mỹ phẩm chậm 8 ngày so với cam kết, đúng dịp 8/3. 6 CH thiếu hàng hot trong tuần cao điểm.

[2. DẤU HIỆU]
- OOS 12 SKU mỹ phẩm tại 6 CH trong 5 ngày
- Doanh thu nhóm mỹ phẩm tuần 8/3 giảm 25% so với kế hoạch

[3. PHÂN TÍCH]
Bước 1: Kiểm tra PO → đặt trước 3 tuần, đúng quy trình
Bước 2: NCC xác nhận "thiếu nguyên liệu đóng gói"
Bước 3: Không có NCC backup cho nhóm này

[4. NGUYÊN NHÂN GỐC]
Phụ thuộc 1 NCC duy nhất cho nhóm mỹ phẩm chủ lực. Không có kế hoạch dự phòng cho mùa cao điểm.

[5. HÀNH ĐỘNG]
1. Yêu cầu NCC X bồi thường chiết khấu thêm 3% lô tiếp — Phòng MH — trong tuần
2. Tìm thêm 1 NCC backup cho nhóm mỹ phẩm — Phòng MH — trong tháng
3. Mùa cao điểm (8/3, 20/10, Tết): đặt hàng trước 5 tuần thay vì 3 — áp dụng ngay
4. Bổ sung điều khoản phạt giao trễ vào HĐ — Phòng MH

[6. KẾT QUẢ]
- NCC X đồng ý chiết khấu thêm 2%
- Tìm được 1 NCC backup, đã ký HĐ framework

[7. BÀI HỌC]
Phụ thuộc 1 NCC cho hàng chủ lực = rủi ro lớn khi mùa cao điểm. Luôn có NCC backup + đặt sớm hơn cho peak season.

[8. LẦN SAU]
Trước mùa cao điểm 6 tuần → kiểm tra NCC chính xác nhận giao → đặt NCC backup dự phòng → tăng buffer tồn kho 20%
```

---

## 10. BÀI HỌC & NGUYÊN TẮC ĐIỀU HÀNH

### Tên nhánh
`10. Bài học & nguyên tắc điều hành`

### Nhánh này gom loại tri thức gì
Các bài học rút ra từ tình huống thực tế, quyết định quản trị, thành công, thất bại, sai lầm, nguyên nhân gốc và nguyên tắc điều hành áp dụng cho nhiều CH hoặc nhiều tình huống.

### Cách viết
Không ghi lý thuyết chung chung. Mỗi bài học phải bắt nguồn từ case thực tế, chỉ rõ điều gì đã xảy ra, quyết định nào, kết quả thế nào và nguyên tắc áp dụng từ nay.

### Dài tối đa
800

### Xử lý mâu thuẫn
Ghi thêm bản mới — mỗi bài học là tài sản tích lũy, không thay thế

### Nhánh con

```text
10. Bài học & nguyên tắc điều hành
│
├── Nguyên tắc quản trị
├── Nguyên tắc ra quyết định
├── Bài học từ thất bại
├── Bài học từ thành công
├── Nguyên tắc giao việc & kiểm soát
└── Nguyên tắc phát triển đội ngũ
```

### Ví dụ case

```text
[1. TÌNH HUỐNG]
Q1/2026, GĐVH nhận ra rằng 3 tháng liên tiếp giao mục tiêu DT cho ASM, ASM giao xuống QLST, nhưng kết quả không cải thiện. Vấn đề lặp lại mỗi tháng ở cùng nhóm CH.

[2. DẤU HIỆU]
- 5/23 CH liên tục không đạt KH 3 tháng liên tiếp
- ASM báo cáo "đã nhắc QLST" nhưng không thay đổi

[3. PHÂN TÍCH]
Bước 1: Kiểm tra nội dung ASM giao → chỉ forward target, không phân tích vấn đề
Bước 2: Kiểm tra QLST → "không biết cần làm gì khác ngoài bán nhiều hơn"
Bước 3: Không có buổi ngồi lại phân tích nguyên nhân CH yếu

[4. NGUYÊN NHÂN GỐC]
Giao target mà không giao cách làm = giao áp lực, không giao giải pháp. ASM chưa biết coaching QLST phân tích vấn đề.

[5. HÀNH ĐỘNG]
Chuyển từ "giao target" sang "giao target + phân tích vấn đề + hành động cụ thể":
1. Mỗi tháng ASM phải ngồi với QLST CH yếu phân tích P&L 30 phút
2. Xác định 1-2 nguyên nhân chính → ra 3-5 hành động cụ thể
3. Follow-up hàng tuần bằng số liệu

[6. KẾT QUẢ]
- 3/5 CH cải thiện sau 2 tháng
- 2 CH còn lại phát hiện vấn đề sâu hơn (vị trí / cạnh tranh) → cần chiến lược khác

[7. BÀI HỌC]
**Nguyên tắc: "Giao target không giao cách làm = giao áp lực."** Mỗi mục tiêu phải đi kèm: phân tích vấn đề → hành động cụ thể → follow-up bằng số.

[8. LẦN SAU]
CH không đạt KH 2 tháng liên tiếp → bắt buộc có buổi phân tích ASM + QLST → ra hành động → follow-up tuần → báo cáo GĐVH
```

---

## 11. NHƯỢNG QUYỀN & MỞ RỘNG

### Tên nhánh
`11. Nhượng quyền & mở rộng`

### Nhánh này gom loại tri thức gì
Toàn bộ kiến thức liên quan đến tiếp nhận, giám sát và phát triển hệ thống CH nhượng quyền tỉnh. Bao gồm: đánh giá đối tác, checklist bàn giao, SLA giám sát vận hành từ xa, xử lý vi phạm, mô hình hỗ trợ HQ cho CH tỉnh, chuẩn hóa để nhân rộng.

### Cách viết
Ghi: tiêu chuẩn/checklist đã chốt, case tiếp nhận/bàn giao cụ thể (CH nào, đối tác nào, vấn đề gì, xử lý ra sao), SLA đang áp dụng (tần suất kiểm tra, chỉ số đánh giá, ngưỡng cảnh báo), bài học từ quá trình mở rộng. Bỏ: thông tin hợp đồng pháp lý chi tiết, dữ liệu tài chính cá nhân đối tác.

### Dài tối đa
800

### Xử lý mâu thuẫn
Ghi đè bản cũ, giữ ghi chú "thay thế bản trước" — vì đây là tiêu chuẩn vận hành, chỉ cần bản mới nhất

### Nhánh con

```text
11. Nhượng quyền & mở rộng
│
├── Đánh giá đối tác nhượng quyền
├── Checklist bàn giao CH mới
├── SLA giám sát CH tỉnh
├── CH tỉnh không đạt chuẩn
├── Hỗ trợ từ HQ cho CH tỉnh
├── Mở rộng vùng mới
└── Chuẩn hóa mô hình nhân rộng
```

### Ví dụ case

```text
[1. TÌNH HUỐNG]
Tháng 8/2026, tiếp nhận CH nhượng quyền tại Hải Dương. Sau 2 tuần vận hành, phát hiện đối tác tự thay đổi planogram, bỏ 20% SKU Sakuko thay bằng hàng tự nhập không trong danh mục.

[2. DẤU HIỆU]
- Báo cáo bán hàng: 20% SKU không khớp danh mục Sakuko
- NV HQ thăm CH: thấy hàng lạ trên kệ
- Đối tác giải thích "hàng này bán chạy ở đây"

[3. PHÂN TÍCH]
Bước 1: Kiểm tra HĐ nhượng quyền → có điều khoản "chỉ bán hàng trong danh mục Sakuko"
Bước 2: Đối tác vi phạm rõ ràng nhưng chưa được cảnh báo chính thức
Bước 3: Không có quy trình kiểm tra định kỳ planogram CH tỉnh

[4. NGUYÊN NHÂN GỐC]
Thiếu SLA kiểm tra planogram định kỳ cho CH nhượng quyền. Đối tác chưa hiểu rõ ràng buộc về danh mục. HQ không có người phụ trách giám sát CH tỉnh thường xuyên.

[5. HÀNH ĐỘNG]
1. Gửi cảnh báo chính thức bằng văn bản — GĐVH — trong 24h
2. Deadline 5 ngày gỡ hàng ngoài danh mục, khôi phục planogram — Đối tác
3. Xây SLA: kiểm tra planogram CH tỉnh 2 lần/tháng qua ảnh + 1 lần/tháng thực tế — GĐVH — 2 tuần
4. Bổ sung vào HĐ nhượng quyền: vi phạm planogram 2 lần → cắt quyền ưu đãi — Phòng pháp chế

[6. KẾT QUẢ]
- Đối tác tuân thủ, gỡ hàng ngoài danh mục trong 3 ngày
- SLA áp dụng cho toàn bộ 12 CH nhượng quyền

[7. BÀI HỌC]
CH nhượng quyền tỉnh có xu hướng tự ý thay đổi nếu không giám sát. Phải có: SLA rõ ràng + kiểm tra định kỳ + chế tài cụ thể trong HĐ. Tin tưởng nhưng phải kiểm tra.

[8. LẦN SAU]
Bàn giao CH nhượng quyền → training đối tác về planogram + danh mục → SLA kiểm tra 2 lần/tháng → vi phạm lần 1 cảnh cáo → lần 2 cắt ưu đãi
```

---

## 12. CHIẾN LƯỢC & QUẢN LÝ THAY ĐỔI

### Tên nhánh
`12. Chiến lược & quản lý thay đổi`

### Nhánh này gom loại tri thức gì
Các quyết định chiến lược cấp BGĐ mà GĐVH tham gia hoặc triển khai: OKR/mục tiêu từng quý, định hướng phát triển chuỗi, quyết định lớn (mở/đóng CH, thay đổi mô hình, chuyển đổi hệ thống). Bao gồm bài học từ các đợt rollout thay đổi lớn.

### Cách viết
Ghi: quyết định chiến lược (nội dung, lý do, ai chốt, mốc thời gian), OKR từng quý (mục tiêu + kết quả thực tế), các đợt thay đổi lớn — ghi rõ: thay đổi gì → cách triển khai → phản ứng đội ngũ → kết quả → bài học. Bỏ: nội dung họp BGĐ không liên quan đến vận hành.

### Dài tối đa
800

### Xử lý mâu thuẫn
Ghi thêm bản mới — cần giữ lịch sử quyết định qua từng giai đoạn để thấy tiến trình chiến lược

### Nhánh con

```text
12. Chiến lược & quản lý thay đổi
│
├── OKR / mục tiêu quý
├── Quyết định mở / đóng CH
├── Thay đổi mô hình kinh doanh
├── Rollout hệ thống / công nghệ mới
├── Tái cấu trúc tổ chức
├── Chiến lược dài hạn chuỗi
└── Bài học quản lý thay đổi
```

### Ví dụ case

```text
[1. TÌNH HUỐNG]
Q3/2026, BGĐ quyết định chuyển toàn bộ 23 CH từ checklist giấy sang checklist trên Lark. Mục tiêu: 100% áp dụng trong 4 tuần.

[2. DẤU HIỆU]
- Tuần 1: 8/23 CH bắt đầu dùng, 15 CH chưa cài app
- Tuần 2: QLST phản ánh "phức tạp hơn giấy", "mất thời gian"
- Tuần 3: 5 CH quay lại dùng giấy song song

[3. PHÂN TÍCH]
Bước 1: Kiểm tra đào tạo → chỉ gửi video hướng dẫn, không training tay
Bước 2: QLST lớn tuổi (>40) gặp khó khăn với app
Bước 3: Checklist Lark có 45 mục — nhiều hơn checklist giấy cũ (30 mục)
Bước 4: Không có ASM hỗ trợ tại CH trong tuần đầu

[4. NGUYÊN NHÂN GỐC]
Rollout quá nhanh (4 tuần cho 23 CH), đào tạo chỉ bằng video, không tính đến năng lực tech của QLST, checklist mới phức tạp hơn cũ.

[5. HÀNH ĐỘNG]
1. Chia 3 đợt rollout: 8 CH pilot → 8 CH đợt 2 → 7 CH đợt 3 — GĐVH — ngay
2. ASM kèm tay QLST tại CH 2 ngày đầu mỗi đợt — ASM — theo lịch
3. Rút checklist Lark từ 45 → 32 mục (bỏ mục trùng lặp) — GĐVH — 3 ngày
4. QLST lớn tuổi: cho phép 2 tuần song song giấy + app trước khi bỏ giấy — ASM

[6. KẾT QUẢ]
- 23/23 CH dùng Lark sau 8 tuần (thay vì 4 tuần ban đầu)
- Tỷ lệ tuân thủ checklist tăng từ 65% → 88%
- Không có QLST nào nghỉ việc vì thay đổi

[7. BÀI HỌC]
Rollout hệ thống mới cho chuỗi: phải pilot trước → chia đợt → kèm tay (không chỉ video) → đơn giản hóa trước khi yêu cầu áp dụng → cho thời gian chuyển tiếp. 4 tuần cho 23 CH là ảo tưởng.

[8. LẦN SAU]
Thay đổi hệ thống → pilot 3-5 CH trước 2 tuần → thu feedback → điều chỉnh → rollout đợt 2,3 có ASM kèm → chuyển tiếp 2 tuần → bỏ cũ hoàn toàn
```

---

# PHẦN C — HƯỚNG DẪN SỬ DỤNG

## Cách nhập vào AGSMem

Mỗi nhánh nhập vào form "Thêm nhánh" trên AGS với 5 trường:

| Trường | Lấy từ đâu |
|--------|-----------|
| Tên nhánh | Mục "Tên nhánh" của mỗi nhánh |
| Nhánh này gom loại tri thức gì | Mục "Nhánh này gom loại tri thức gì" |
| Cách viết | Mục "Cách viết" |
| Dài tối đa | Mục "Dài tối đa" |
| Xử lý mâu thuẫn | Mục "Xử lý mâu thuẫn" |

## Thứ tự nhập

1. Tạo 12 nhánh chính trước
2. Nhánh con chỉ tạo khi có đủ case thực tế (>3 case cùng loại)
3. Bắt đầu ghi case từ các vấn đề đang xảy ra — không cần đợi đủ cấu trúc

## Tổng hợp nhanh

| # | Nhánh | Dài tối đa | Xử lý mâu thuẫn |
|---|-------|-----------|-----------------|
| 01 | Doanh thu & hiệu quả KD | 800 | Ghi thêm |
| 02 | Hàng hóa & tồn kho | 700 | Ghi đè |
| 03 | Vận hành cửa hàng | 700 | Ghi thêm |
| 04 | Khách hàng & CSKH | 700 | Ghi thêm |
| 05 | Con người & năng lực | 800 | Ghi thêm |
| 06 | ASM & quản trị CH | 800 | Ghi thêm |
| 07 | Chương trình & dự án | 700 | Ghi thêm |
| 08 | Sự cố & rủi ro | 700 | Ghi thêm |
| 09 | NCC & đối tác | 600 | Ghi thêm |
| 10 | Bài học & nguyên tắc | 800 | Ghi thêm |
| 11 | Nhượng quyền & mở rộng | 800 | Ghi đè |
| 12 | Chiến lược & QL thay đổi | 800 | Ghi thêm |
