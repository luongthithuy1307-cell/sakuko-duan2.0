/* NHÁNH: Bài học 3 CH tiên phong — sửa nội dung ở LESSONS */
const LESSONS = {
  personas: [
    { name:"Persona 1 — Gia đình Nhật (Family Daily)", ex:"vd: Times City, Mandarin",
      ideas:["Set làm sạch gia dụng chuyên sâu: tẩy lồng giặt, tẩy mốc silicon, viên thông cống Nhật.","Gia dụng thông minh: móc treo đa năng, kẹp miệng túi thực phẩm, màng bọc chịu nhiệt.","TPCN người già/nam: dầu cá Omega-3, hỗ trợ tiền liệt tuyến, trà giảm mỡ máu.","Tiêu dùng nam: bọt cạo râu, sữa tắm khử mùi (deodorant soap).","Trưng bày 'Góc giải pháp': Góc chăm sóc bếp, Góc tăng đề kháng cho bé."] },
    { name:"Persona 2 — Dân cư + Văn phòng (Hybrid)", ex:"",
      ideas:["Tiện ích văn phòng: xịt thơm quần áo khử mùi, kem dưỡng tay mini, xịt khoáng cấp ẩm.","F&B nhanh: ngũ cốc ăn liền, drip coffee, trà túi lọc cao cấp, snack hạt.","Quà tặng nhanh: set kem tay + trà đóng gói sẵn lịch sự."] },
    { name:"Persona 3 — Traffic tốt / Khách du lịch (High-traffic)", ex:"vd: Hàng Bông",
      ideas:["'Travel Rescue': áo mưa mỏng/ô siêu nhẹ 90g, miếng dán thư giãn bắp chân, lót giày, khăn ướt cồn, gel rửa tay khô.","'Japanese Soul Souvenir': túi vải Sakuko họa tiết Nhật, Kitkat vị lạ (matcha/sake), mochi hộp nhỏ, văn phòng phẩm Nhật (washi tape).","Beauty & Health: thuốc nhỏ mắt Rohto/Sante, steam eye mask, sunscreen stick, sữa rửa mặt tuýp nhỏ.","VM: 'Tourist Corner' bảng tên Anh/Nhật + kệ 'Best Sellers for Travelers' ngay lối vào."] }
  ],
  fromStores: [
    { ch:"Times City T6", note:"Bỉm Moony nội địa (organic), sữa hộp bé mang đi học, bột dashi/rong biển lá to, TPCN (gout, magie, canxi+D3K2), set tắm gội mini, băng vệ sinh quần, đồ mẹ bé (ti giả, khăn sữa, tăng đề kháng cho bé dạng lọ)." },
    { ch:"Mandarin", note:"Chăm sóc cá nhân mini (răng miệng, khăn ướt nhỏ, xịt khử mùi, bông tẩy trang), mẹ bé (sữa pha sẵn, xịt muỗi), TPCN (đột quỵ, xương khớp, gan, collagen), TP tiện lợi, hàng nam (vuốt tóc Gatsby, SRM nam), khẩu trang trẻ em." },
    { ch:"Hàng Bông", note:"Bỉm Moony nội địa cạnh tranh, TP người ăn kiêng/tiểu đường, cọ tắm cán gỗ, lọ chiết nhựa, túi vải Sakuko cho khách, kệ hàng du lịch size mini, đặc sản vùng miền, đồng giá 10K." }
  ],
  competitorTakeaways: [
    "Tem giá & POSM khuyến mãi rõ ràng, nổi bật (đỏ/vàng, ghi rõ % giảm) — đối thủ hầu như KHÔNG có NV tư vấn nhưng khách vẫn tự mua được → đây là lợi thế Sakuko cần giữ nhưng phải làm tem/POSM tốt hơn.",
    "Đối thủ giảm giá trực tiếp trên sản phẩm; Sakuko mạnh về combo → cân nhắc combo sữa/bỉm, giờ vàng 11–14h.",
    "Rà lại giá các dòng CSSĐ (dầu gội, sữa tắm, collagen, nhuộm tóc) — nhiều nơi đang rẻ hơn Sakuko.",
    "Mở thêm hàng mùa vụ & nhuộm thời trang/nhuộm gói, make-up (cushion, mút), kính bơi, giấy thấm mồ hôi."
  ]
};
function viewLessons(){
  const L=LESSONS;
  return `
  <div class="card"><h2>📦 Đóng gói từ 3 CH tiên phong (giai đoạn 1)</h2>
    <p class="lead">Dưới đây là kết tinh đề xuất & ý tưởng từ Times City, Mandarin, Hàng Bông. Dùng làm nguồn tham khảo — KHÔNG copy máy móc, phải soi lại Persona CH bạn.</p></div>
  <div class="card"><h2>🧩 Ngân hàng ý tưởng theo Persona</h2>
    ${L.personas.map(p=>`<h3>${p.name} <span class="p-date" style="font-weight:600">${p.ex}</span></h3><ul class="clean">${p.ideas.map(i=>`<li>${i}</li>`).join("")}</ul>`).join("")}
  </div>
  <div class="card"><h2>🏪 Đề xuất gốc từ từng CH</h2>
    ${L.fromStores.map(s=>`<h3>${s.ch}</h3><p class="lead">${s.note}</p>`).join("")}
  </div>
  <div class="card"><h2>🔍 Bài học từ khảo sát đối thủ</h2><ul class="clean">${L.competitorTakeaways.map(c=>`<li>${c}</li>`).join("")}</ul></div>`;
}
registerTab({ id:"lessons", label:"Bài học 3 CH tiên phong", render:viewLessons });
