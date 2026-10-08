---
name: agsmem
description: Ghi tri thức của cuộc trò chuyện vào bộ nhớ dự án AGSMem — cây 24 nhánh do người dùng tự định nghĩa, mỗi nhánh có luật ghi riêng. Dùng khi được nhắc "chạy skill agsmem", hoặc khi vừa chốt xong một quyết định, một bài học, một thay đổi đáng nhớ.
---

# AGSMem — ghi tri thức vào bộ nhớ dự án

Bộ nhớ của dự án này là một CÂY CHỦ ĐỀ do người dùng tự dựng. Trong phiên bạn gần như không phải
làm gì: chỉ ném một dòng vào bộ nhớ nóng khi có chuyện đáng nhớ ngay, và tra cây khi cần biết
chuyện cũ. Việc chắt lọc chia vào nhánh để CUỐI PHIÊN một agent phụ lo.

## Làm gì trong phiên: GHI NÓNG, và chỉ khi đáng

Đừng chắt lọc gì sau mỗi lượt nữa. Cuối phiên sẽ có một agent phụ đọc lại toàn bộ cuộc trò
chuyện rồi chia vào cây — bạn không phải chép lại chữ mình vừa nói.

Trong phiên bạn chỉ làm MỘT việc, và chỉ khi thật sự đáng: gặp chuyện cần nhớ NGAY thì ném một
dòng ngắn vào bộ nhớ nóng:

```
ags mem hot "Admin chốt X, lý do Y"
```

Khi nào đáng ghi nóng:
- người dùng CHỐT một điều (quyết định, luật, con số cuối cùng), nhất là khi nó lật cái đã chốt trước đó;
- gặp một lỗi đã trả giá: triệu chứng, nguyên nhân thật, cách chữa;
- một mốc thật: vừa ra bản, vừa đổi kiến trúc, vừa nhận một ràng buộc mới.

Khi nào ĐỪNG ghi: hỏi đáp thông thường, thao tác vụn, việc đang dở chưa ngã ngũ. Ghi mọi lượt là
làm phiền chính mình và làm loãng kho.

Mỗi dòng nóng viết như nói cho người khác nghe: một câu, có chủ ngữ, đủ để sau này hiểu mà không
cần đọc lại cả phiên. KHÔNG chép nguyên văn, KHÔNG kèm mã nguồn dài.

## Khi phiên sắp đầy

Thấy ngữ cảnh gần đầy (khoảng 85-90%) mà chưa bị nén, hãy gọi:

```
ags mem cuoi-phien
```

Lệnh trả về ngay; phần chắt lọc chạy nền, bạn cứ làm tiếp việc của mình. Với Claude thì host đã
cắm sẵn mốc tự động trước khi nén nên thường khỏi cần gọi tay.

## Tra bộ nhớ TRƯỚC khi trả lời

Khi câu hỏi dính tới thứ đã làm, đã chốt, đã hỏng trước đây — hoặc khi người dùng nhắc "tra
agsmem" — thì làm theo thứ tự này, dừng ngay khi đủ:

```
ags mem tim "<điều cần biết>"   # BƯỚC ĐẦU TIÊN — trả vài đoạn hợp nhất, rẻ nhất
ags mem snap                    # bản chắt lọc của MỌI nhánh
ags mem snap <mã nhánh>         # muốn kỹ một nhánh thì lấy riêng nhánh đó
ags mem snap "Doanh thu"        # KHÔNG nhớ mã thì gõ thẳng TÊN nhánh, hoặc cả đường "A -> B"
```

CÓ LỆNH TÌM, đừng bảo người dùng là không có. `ags mem tim` soi CẢ bản tóm LẪN bản ghi, chấm điểm
rồi trả vài đoạn hợp nhất kèm mã nhánh và mã bản ghi — thêm `--n 8` nếu muốn nhiều đoạn hơn.
ĐỪNG kéo `ags mem entries` cả trăm bản về rồi tự grep: vừa tốn hàng nghìn chữ vừa dễ sót, mà
grep chỉ khớp đúng mặt chữ còn lệnh tìm bắt được cả từ ghép tiếng Việt.

Gõ tên mà khớp nhiều nhánh thì host kể ra cho bạn chọn chứ không đoán bừa. ĐỪNG tra cả cây rồi
tự dò lấy một nhánh — vừa tốn vừa dễ hụt.

Cần biết cây có những nhánh nào, mã ra sao:

```
ags mem tree
```

CHỈ khi snap không trả lời được mới đụng tới bản ghi gốc, và phải lọc đúng nhánh, lấy ít thôi:

```
ags mem entries --all --topic <mã nhánh> --limit 20
```

Tra lại thứ đã đọc mà nội dung y nguyên thì bạn chỉ nhận một câu "KHÔNG ĐỔI" — đó là câu trả lời
ĐÚNG, đừng gọi lại cho tới khi thật sự cần bản nguyên văn. Cần thì thêm cờ `--fr`:

```
ags mem snap --fr
```

TUYỆT ĐỐI đừng gọi `ags mem entries --all` trần: nó kéo về hàng trăm bản ghi. Bản ghi chỉ THÊM
chứ không sửa, nên cùng một chuyện nằm rải trong hàng chục bản na ná nhau — đọc chúng vừa tốn
vừa dễ vớ phải điều đã bị quyết định sau lật. Snap là bản đã chắt và đã dọn trùng.

## Dọn bản ghi ghi hỏng

Nhặt nhầm, ghi trùng, ghi lạc nhánh thì xoá đi, mã lấy từ chính `ags mem entries`:

```
ags mem xoa 137                              # đúng một bản
ags mem xoa --ids 12,15,20                   # mấy bản
ags mem xoa --tu 100 --den 120               # cả dải mã
ags mem xoa --moi 5                          # 5 bản mới nhất
ags mem xoa --cu 5                           # 5 bản cũ nhất
ags mem xoa --ngay 2026-09-03                # trọn một ngày
ags mem xoa --tu-ngay 2026-09-01 --den-ngay 2026-09-03
```

Thêm `--topic <mã nhánh>` để chỉ xét trong một nhánh. Mọi lối chọn theo lô đều CHỈ LIỆT KÊ ra xem
trước, phải gọi lại kèm `--that` mới xoá thật — trừ khi gõ đích danh một mã thì làm luôn.

Xoá rồi vẫn lấy lại được: bản sao nằm trong thùng rác dưới máy.

```
ags mem thung-rac              # xem đã xoá những gì
ags mem khoi-phuc 137          # ghi lại lên kho
```

Khôi phục là ghi lại thành bản MỚI: nội dung y nguyên, mã là mã mới.

Chỉ xoá thứ CHÍNH BẠN vừa ghi hỏng trong phiên này, hoặc khi người dùng bảo xoá. Đừng tự dọn bản
ghi cũ của người khác — bản ghi vốn chỉ thêm, đây là cửa dọn rác chứ không phải lối sửa lịch sử.
Xoá bản ghi KHÔNG đụng tới snap; muốn snap thôi nhắc chuyện cũ thì viết lại snap.

Phần dưới đây là việc của agent phụ chạy cuối phiên; trong phiên bạn không phải làm.


## Đọc snap

KHI ĐỌC SNAP: gặp @ kèm SỐ (ví dụ @543, @867) thì đó là mã BẢN GHI đầy đủ. Cần biết kỹ
thì lần theo mã ấy mà đọc; snap chỉ là mục lục.

## Chắt tri thức vào nhánh

CÁCH CHỌN NHÁNH — làm đúng ba bước này, đừng đoán:

1. Đọc điều mình vừa nhặt, hỏi: nó NÓI VỀ chuyện gì?
2. Dò bảng nhánh tìm nhánh mà "topic" + "gom" + "ban_ghi_cach_viet" mô tả đúng loại chuyện đó —
   đọc cả cụm chứ đừng chỉ nhìn một trường. Chọn nhánh CỤ THỂ NHẤT.
3. Không nhánh nào mô tả đúng thì BỎ HẲN điều đó, đừng nhét vào nhánh gần gần.

MỘT điều chỉ vào MỘT nhánh. Chỉ tách làm hai khi nó thật sự có hai mặt khác nhau, và khi đó mỗi
nhánh viết một mặt — CẤM chép y nguyên sang hai chỗ.

Bản ghi phải gắn xuống nhánh NGỌN. Nhắm vào nhánh còn nhánh con là bị từ chối.

Sai thường gặp, đừng mắc: chuyện đời sống của người dùng (ăn uống, du lịch, bạn bè) mà ném vào
nhánh kỹ thuật; hoặc một câu nói bình thường mà xé thành nhiều bản ghi rải khắp cây.

GẶP TIN MỚI CHỌI TIN CŨ thì xử theo lối nhánh đã khai:

- Giữ mới:   giữ tin mới, bỏ tin cũ. Ví dụ: "thích bún" + "thích phở" → thích phở.
- Tổng hợp:  gom cả hai. Ví dụ: "thích bún" + "thích phở" → thích cả bún và phở.
- Hỏi lại:   ĐỪNG tự quyết. Ghi vào snap một dòng cần xác nhận — "Trước nói thích bún, giờ kêu
             thích phở, đề nghị xác nhận".

VIẾT LẠI SNAP của mỗi nhánh vừa ghi vào. Snap là đoạn gói lại những gì nhánh đó biết;
bản ghi thì chỉ thêm, còn snap là chỗ DUY NHẤT được viết đè.

Lấy bản đang có:

```
GET http://127.0.0.1:8765/api/agsmem/snap?topic=<mã nhánh>
```

Trả về `snap` (đoạn hiện có), `kind`, `max_len`, `rule_distill`, `rule_important`.

BẮT BUỘC đọc bản đang có trước khi viết lại, rồi GỘP điều vừa nhặt vào đó. Viết đè bằng bản ngắn
hơn hẳn là xoá mất tri thức cũ — host chặn và bỏ cả đợt.

1. So mẩu mới với snap hiện có. Trùng ý trên 40% thì THÔI, đừng ghi lại lần nữa.
2. ĐIỀU MỚI ĐẶT LÊN TRÊN, không nối vào cuối:
   - thêm cả một câu hoàn chỉnh  → đặt lên ĐẦU đoạn
   - thêm một ý ngắn vào danh sách → đặt lên ĐẦU danh sách ấy
   Mới nhất nằm trên cùng thì người đọc lướt vài dòng đầu là nắm được chuyện gần đây.
3. MỖI Ý MỘT GẠCH ĐẦU DÒNG NGẮN, kèm @ID của bản ghi đầy đủ:

       - GĐVH chốt push doanh số Q4 bằng thi đua @543
       - Tỷ lệ KH vãng lai CH Nguyễn Trãi tăng 12% @867

   Snap là mục lục, không phải chỗ chép lại cả bản ghi. Chi tiết nằm ở bản ghi, ai cần thì lần
   theo @ID.
4. Vượt mức dài tối đa thì NÉN, theo đúng ba trục:
   - mẩu có dấu (!) là người dùng đã ghim → GIỮ nguyên
   - mẩu mới hơn giữ, cũ hơn nhường chỗ
   - đoạn nào còn dài thì TÁCH RA THÀNH BẢN GHI MỚI (ghi như ghi bản ghi bình thường), rồi trong
     snap chỉ để lại một gạch đầu dòng tóm tắt kèm @ID của bản ghi vừa tạo.

Nén bằng con trỏ chứ ĐỪNG gộp nghĩa: gộp "phở, bún bò, miến" thành "thích món nước" là mất chỗ
"ghét miến" — tách ra thành bản ghi thì chữ vẫn còn nguyên, snap chỉ mỏng đi.

Viết xong nộp lại — nhớ kèm `conv_id` (lấy ở biến môi trường AGS_CONV_ID): host soi quyền ghi của nhánh theo số đó, thiếu là bị từ chối.

```
POST http://127.0.0.1:8765/api/agsmem/snap
{"topic_id": "<mã nhánh>", "conv_id": <AGS_CONV_ID>, "snap": "<đoạn snap mới>"}
```

Nếu host trả về câu bắt đầu bằng **CHẶN QUYỀN** thì nhánh đó cuộc chat này chỉ được đọc: DỪNG, đừng thử đường khác (bản ghi, bản tóm, bộ nhớ nóng đều bị chặn như nhau), chỉ cần báo lại cho người dùng.

## Ghi chú nhanh của người dùng

Người dùng tự gõ `/note ...` để ghi vội điều gì đó. Chỗ này KHÔNG có trong bảng nhánh dưới đây và bạn KHÔNG được ghi vào — nhưng khi họ hỏi "ghi chú của tôi có gì", "tôi đã note gì" thì đọc ở đây:

```
GET http://127.0.0.1:8765/api/quicknote/list?limit=50
```

## Cây chủ đề

### `VH01` — Vận hành chuỗi Sakuko -> Doanh thu & P&L
**Nhánh này gom:** Số liệu doanh thu từng CH và toàn chuỗi, P&L điểm bán hàng tháng (đọc trước mùng 10), phân tích biến động doanh thu, so sánh target vs actual, báo cáo BGĐ (ngày 11-15), các quyết định push doanh số, chi phí vận hành điểm bán.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 insight/quyết định/số liệu cụ thể từ P&L hoặc báo cáo doanh thu. Ghi: CH nào / toàn chuỗi → chỉ số gì → con số → nhận định → hành động.
**Snap — mâu thuẫn:** TỔNG HỢP — gom cả hai, đừng bỏ cái nào

### `VH02` — Vận hành chuỗi Sakuko -> Khách hàng
**Nhánh này gom:** Số khách theo CH, TBB (trung bình bill), SP/Bill, tần suất mua, tỷ lệ KH vãng lai vs KH mới vs KH trung thành, phân tích hành vi mua hàng, chương trình khách hàng thân thiết, insight từ SJS Daily tab Khách hàng theo CH.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 insight khách hàng cụ thể. Ghi: CH nào / toàn chuỗi → chỉ số KH gì → con số → xu hướng → hành động đề xuất.
**Snap — mâu thuẫn:** TỔNG HỢP — gom cả hai, đừng bỏ cái nào

### `VH03` — Vận hành chuỗi Sakuko -> Hàng hóa & Tồn kho
**Nhánh này gom:** Phân tích SKU 20/80, hiệu suất ngành hàng theo từng CH, tồn kho (thừa/thiếu), quyết định trưng bày, push bán hàng chậm, dữ liệu từ SJS Daily tab Ngành hàng theo CH và Hiệu quả SKU.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 quyết định hoặc phân tích hàng hóa cụ thể. Ghi: ngành hàng / SKU → CH nào → dữ liệu → quyết định (giữ/cắt/push/trưng bày lại).
**Snap — mâu thuẫn:** GIỮ MỚI — tin mới chọi tin cũ thì lấy tin mới

### `VH04` — Vận hành chuỗi Sakuko -> Quy trình & SOP
**Nhánh này gom:** Các SOP đang áp dụng tại CH, quy trình vận hành chuẩn, tiêu chuẩn CH có thể nhân rộng, quy trình mở CH mới, quy trình nhượng quyền, chuẩn hóa vận hành.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 SOP hoặc 1 thay đổi quy trình cụ thể. Ghi: tên quy trình → nội dung chính → áp dụng ở đâu → ngày hiệu lực.
**Snap — mâu thuẫn:** GIỮ MỚI — tin mới chọi tin cũ thì lấy tin mới

### `VH05` — Vận hành chuỗi Sakuko -> Con người & Năng lực
**Nhánh này gom:** Phân tích thiếu/thừa nhân sự theo CH, năng lực đội ngũ (SM, ASM, NV), đánh giá quản lý theo cấp bậc, KPI nhân sự, kế hoạch phát triển nhân sự, xây framework đánh giá năng lực.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 đánh giá/quyết định nhân sự cụ thể. Ghi: ai / CH nào → vấn đề gì → đánh giá → hành động (đào tạo/điều chuyển/tuyển bổ sung).
**Snap — mâu thuẫn:** TỔNG HỢP — gom cả hai, đừng bỏ cái nào

### `VH06` — Vận hành chuỗi Sakuko -> Hiệu suất bán hàng
**Nhánh này gom:** Xây đội ngũ tư vấn thực chiến, kỹ năng chốt sale (đặc thù hàng Nhật nhiều SKU, toàn tiếng Nhật), tỷ lệ chuyển đổi, doanh thu/NV, năng suất bán hàng theo ca/ngày, bài toán tư vấn sản phẩm.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 insight hoặc giải pháp hiệu suất bán hàng. Ghi: vấn đề → giải pháp đã áp dụng → kết quả (nếu có).
**Snap — mâu thuẫn:** TỔNG HỢP — gom cả hai, đừng bỏ cái nào

### `VH07` — Vận hành chuỗi Sakuko -> Trải nghiệm KH tại CH
**Nhánh này gom:** Tối ưu hành trình mua hàng tại CH, layout/trưng bày, chất lượng phục vụ, phản hồi KH, mystery shopper, cải tiến trải nghiệm mua sắm, chương trình KH đặc biệt.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 vấn đề/cải tiến trải nghiệm cụ thể. Ghi: CH nào / toàn chuỗi → vấn đề KH gặp → cải tiến đã làm → kết quả.
**Snap — mâu thuẫn:** TỔNG HỢP — gom cả hai, đừng bỏ cái nào

### `VH08` — Vận hành chuỗi Sakuko -> Thi đua & Động lực
**Nhánh này gom:** Thiết kế chương trình thi đua doanh thu giữa các CH, giữ tinh thần đội ngũ, cơ chế thưởng/phạt, kết quả thi đua, bài học từ các chương trình đã chạy.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 chương trình thi đua hoặc 1 bài học động lực. Ghi: tên chương trình → cơ chế → thời gian → kết quả → bài học.
**Snap — mâu thuẫn:** TỔNG HỢP — gom cả hai, đừng bỏ cái nào

### `CC01` — Công cụ & Hệ thống -> Haravan & NAV
**Nhánh này gom:** Cách dùng Haravan xem doanh thu (4-5 lần/ngày để push điểm bán chạy số), NAV cho thanh toán tại điểm bán, các thao tác/báo cáo hay dùng, lỗi hệ thống đã gặp và cách xử lý.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 thao tác/tip/lỗi cụ thể trên Haravan hoặc NAV. Ghi: hệ thống nào → thao tác/lỗi gì → cách làm/cách chữa.
**Snap — mâu thuẫn:** GIỮ MỚI — tin mới chọi tin cũ thì lấy tin mới

### `CC02` — Công cụ & Hệ thống -> Lark & Bot
**Nhánh này gom:** Dùng Lark để chat, tương tác công việc, chỉ thị phòng ban và vận hành, làm kế hoạch hàng ngày, các bot đã cài, workflow tự động trên Lark.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 cách dùng/workflow/bot cụ thể trên Lark. Ghi: tên bot/workflow → mục đích → cách vận hành.
**Snap — mâu thuẫn:** GIỮ MỚI — tin mới chọi tin cũ thì lấy tin mới

### `CC03` — Công cụ & Hệ thống -> SJS Daily & Dashboard
**Nhánh này gom:** Phần mềm SJS Daily (sjs-daily.pages.dev) với các tab: Tổng quan Tháng, Bám đuổi Target, Daily theo Kênh, Ngành hàng theo CH, Khách hàng theo CH, Hiệu quả SKU, Hiệu quả CTKM. Dashboard báo cáo khi họp hành, cách đọc và sử dụng từng tab.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 cách đọc/insight từ dashboard hoặc 1 thay đổi cấu hình. Ghi: tab nào → chỉ số gì → cách đọc/ứng dụng.
**Snap — mâu thuẫn:** GIỮ MỚI — tin mới chọi tin cũ thì lấy tin mới

### `CC04` — Công cụ & Hệ thống -> Tự động hóa
**Nhánh này gom:** Các quy trình đã tự động hóa hoặc đang muốn tự động hóa trong vận hành chuỗi, script/tool hỗ trợ, tích hợp giữa các hệ thống.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 quy trình tự động hóa cụ thể. Ghi: quy trình gì → công cụ/script → trước vs sau tự động hóa → kết quả.
**Snap — mâu thuẫn:** TỔNG HỢP — gom cả hai, đừng bỏ cái nào

### `TD01` — Tư duy & Phát triển -> Tư duy logic & ra quyết định
**Nhánh này gom:** Cách GĐVH tư duy: logic, có trước - trong - sau, integrity và cam kết các hành động triển khai. Framework KH-Mâm-Đĩa-Dòng chảy-5L-2N. Cách ra quyết định dựa trên dữ liệu P&L và chỉ số vận hành.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 tình huống ra quyết định cụ thể hoặc 1 nguyên tắc tư duy đã áp dụng. Ghi: tình huống → logic phân tích → quyết định → kết quả.
**Snap — mâu thuẫn:** TỔNG HỢP — gom cả hai, đừng bỏ cái nào

### `TD02` — Tư duy & Phát triển -> Framework vận hành
**Nhánh này gom:** Các framework/mô hình GĐVH đang dùng: BSC (Financial, Customer, Internal Process, Learning & Development), KH-Mâm-Đĩa-Dòng chảy-5L-2N, 20/80, và các mô hình quản lý bán lẻ khác. Cách áp dụng vào thực tế chuỗi Sakuko.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 framework hoặc 1 cách áp dụng framework vào tình huống thật. Ghi: tên framework → áp dụng vào đâu → kết quả/bài học.
**Snap — mâu thuẫn:** TỔNG HỢP — gom cả hai, đừng bỏ cái nào

### `TD03` — Tư duy & Phát triển -> Bài học quản lý thực chiến
**Nhánh này gom:** Bài học rút ra từ 15 năm quản lý thực chiến (lên từ quản lý siêu thị), các sai lầm đã mắc, cách xử lý tình huống khó, kinh nghiệm quản lý chuỗi bán lẻ hàng Nhật nội địa.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 bài học hoặc 1 tình huống quản lý cụ thể. Ghi: tình huống → cách xử lý → bài học rút ra.
**Snap — mâu thuẫn:** TỔNG HỢP — gom cả hai, đừng bỏ cái nào

### `AI01` — Cách làm việc cùng AI -> Phong cách giao tiếp
**Nhánh này gom:** Cách GĐVH muốn AI giao tiếp: không hiểu thì hỏi, giao tiếp rõ ràng, nhất quán thông tin, không được tự ý lấy thông tin sai. Phong cách: thực tế, nhanh, có cấu trúc, đi thẳng vấn đề, không lý thuyết sáo rỗng, ưu tiên ứng dụng thực chiến trong bán lẻ.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 quy tắc giao tiếp hoặc 1 sở thích trình bày đã xác nhận. Ghi ngắn gọn.
**Snap — mâu thuẫn:** GIỮ MỚI — tin mới chọi tin cũ thì lấy tin mới

### `AI02` — Cách làm việc cùng AI -> Quy tắc cứng
**Nhánh này gom:** Các luật cứng AI phải tuân thủ: không tự ý lấy thông tin sai, không suy diễn khi chưa có dữ liệu, phải hỏi khi không chắc, tham khảo cây tri thức của các phòng ban khác khi cần, cam kết integrity trong mọi output.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 quy tắc cứng + lý do/tình huống phát sinh. Ghi rõ: PHẢI làm gì / KHÔNG ĐƯỢC làm gì.
**Snap — mâu thuẫn:** TỔNG HỢP — gom cả hai, đừng bỏ cái nào

### `AI03` — Cách làm việc cùng AI -> Lỗi AI đã mắc & bài học
**Nhánh này gom:** Các lần AI mắc lỗi khi làm việc với GĐVH: thông tin sai, suy diễn quá đà, format không đúng ý, hành động không được phép. Ghi lại để tránh lặp lại.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 lỗi cụ thể. Ghi: AI làm gì sai → hậu quả → cách sửa → quy tắc rút ra.
**Snap — mâu thuẫn:** TỔNG HỢP — gom cả hai, đừng bỏ cái nào

### `CN01` — Con người & Tổ chức -> Danh tính & vai trò GĐVH
**Nhánh này gom:** Thông tin cá nhân trong công việc: Lường Thị Thùy, GĐVH chuỗi bán lẻ Sakuko, 15 năm kinh nghiệm, lên từ quản lý siêu thị thực chiến, báo cáo trực tiếp BGĐ, quản lý 23 CH trực tiếp (HN + Bắc Ninh) + 12 CH nhượng quyền tỉnh (tiếp nhận 6 tháng tới), nhịp làm việc (đọc P&L trước mùng 10, báo cáo BGĐ ngày 11-15), nguyên tắc làm việc đặc trưng.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 fact cụ thể về vai trò/trách nhiệm/thói quen làm việc đã xác nhận. Không suy diễn.
**Snap — mâu thuẫn:** GIỮ MỚI — vai trò/scope thay đổi thì cập nhật

### `CN02` — Con người & Tổ chức -> Bộ máy & đầu mối phòng ban Sakuko
**Nhánh này gom:** Cơ cấu tổ chức Sakuko Group, các phòng ban GĐVH tương tác (TCKT, HCNS, Ngành hàng, IT, Marketing, KSCL...), đầu mối liên hệ từng phòng, cách phối hợp liên phòng, ai quyết định gì.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 thông tin về phòng ban/đầu mối hoặc 1 cách phối hợp đã xác nhận. Ghi: phòng nào → người nào → chịu trách nhiệm gì → cách phối hợp với GĐVH.
**Snap — mâu thuẫn:** GIỮ MỚI — người thay đổi thì cập nhật

### `CN03` — Cá nhân & Cuộc sống -> Sở thích & phong cách sống
**Nhánh này gom:** Những điều GĐVH thích ngoài công việc: xem phim, đi bộ, yêu gia đình, có 1 bé trai. Phong cách sống, thói quen cá nhân.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 sở thích hoặc 1 thói quen cá nhân đã xác nhận. Ghi ngắn gọn, không suy diễn.
**Snap — mâu thuẫn:** TỔNG HỢP — sở thích chỉ thêm, ít khi bỏ

### `CN04` — Cá nhân & Cuộc sống -> Mục tiêu cá nhân
**Nhánh này gom:** Mục tiêu lớn trong cuộc sống: mua nhà Hà Nội, kế hoạch tài chính cá nhân, mục tiêu cho con, mục tiêu phát triển bản thân ngoài công việc.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 mục tiêu hoặc 1 tiến triển cụ thể. Ghi: mục tiêu gì → tiến độ → kế hoạch.
**Snap — mâu thuẫn:** GIỮ MỚI — mục tiêu thay đổi thì lấy cái mới

### `LT01` — Lưu trữ -> Tài liệu hết hiệu lực
**Nhánh này gom:** Các SOP cũ, quy trình đã thay thế, chính sách không còn áp dụng, phiên bản tài liệu đã lỗi thời. Lưu lại để tra cứu lịch sử khi cần.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 tài liệu/quy trình hết hiệu lực. Ghi: tên tài liệu cũ → tài liệu mới thay thế → ngày ngừng hiệu lực.
**Snap — mâu thuẫn:** GIỮ MỚI — danh mục cập nhật khi có tài liệu mới thay

### `LT02` — Lưu trữ -> Dự án đã hoàn thành
**Nhánh này gom:** Các dự án/chương trình đã kết thúc: mở CH mới, chương trình thi đua đã kết thúc, dự án cải tiến đã đóng gói. Lưu kết quả và bài học.
**Bản ghi — cách viết:** Mỗi bản ghi = 1 dự án đã đóng. Ghi: tên dự án → thời gian → kết quả → bài học rút ra.
**Snap — mâu thuẫn:** GIỮ MỚI — dự án đã xong là đóng băng, thêm dự án mới lên trên

## Chưng cất khi được nhắc

Người dùng bấm nút chắt thì host chèn vào khung chat một dòng ngắn kiểu _"chạy skill agsmem, mục Chưng cất, cho các lượt: #a #b #c"_. Gặp dòng ấy thì làm theo đúng mục này.

**Chắt từ đâu:** CHỈ từ ngữ cảnh sẵn có trong phiên. Đừng đi tìm ở nơi khác — không gọi hàm, không mở file, không truy vấn kho để lần lại mấy lượt được nêu.

**GHI BẰNG LỆNH, ĐỪNG GHI RA FILE RỒI ĐỢI AI ĐÓ ĐỌC:**

```
ags mem save --file <đường dẫn json>    # hoặc: ags mem save '<json>'
ags mem snap <mã nhánh>                 # đọc bản tóm đang có
ags mem snap <mã nhánh> --ghi --file <đường dẫn văn bản>
```

Không ai ngồi chờ đọc file của bạn cả — ghi ra file là rơi vào hư không: số lượt còn nợ không trừ, rồi lần sau lại bị nhắc y hệt. Đợt chắt do host TỰ chạy thì có bài riêng dặn ghi ra file — đó là chuyện khác, đừng lẫn.

**Ghi bản tóm là GHI ĐÈ:** đọc bản cũ ra rồi gộp phần mới vào, đừng thay bằng bản mình vừa nghĩ ra — thay là mất sạch những gì đã tích trong đó. Nhánh nào khai KHÔNG viết snap thì bỏ qua bước này, host cũng bỏ qua lệnh ghi.

**Khuôn gói nộp:**

```json
{"conv_id": "...",
 "ags_entries": [{"topic_id": "...", "new_entry": [
   {"prompt": "...", "answer": "...", "from_qa_ids": ["#ff7", "#ff9"]}]}],
 "da_chat": ["#ff7", "#ff9"]}
```

`from_qa_ids` là đường lần ngược về nguyên văn câu gốc — thiếu nó là mất đường về. Bản ghi chắt từ mấy lượt thì kể đủ mấy lượt; hai bản cùng chắt từ một lượt thì cả hai cùng kể lượt ấy.

`da_chat` là mọi mã bạn ĐÃ THẬT SỰ xem. Lượt nào xem mà thấy chẳng có gì đáng ghi thì VẪN kể vào — xem rồi là xong. Chỉ bỏ ra ngoài những lượt bạn không hề xem tới. Lượt được nêu bằng TRÍCH CÂU HỎI (không có mã) thì khỏi khai, host tự đánh dấu.
