/* ============================================================
   CẤU HÌNH GỐC — sửa ở đây khi đổi: tài khoản, danh sách CH,
   tuyến điều chuyển, danh sách module. Thuộc "gốc", không đụng nhánh.
   ============================================================ */
window.CONFIG = {

  /* ---- KẾT NỐI SUPABASE (bật để dùng chung dữ liệu realtime mọi máy) ----
     Dán Project URL + anon public key vào 2 ô dưới để BẬT.
     Để trống "" = chạy demo, lưu trên máy này. Hướng dẫn: SETUP-SUPABASE.md */
  SUPABASE: { url:"https://zekgipgumutlrvsmlmzk.supabase.co", anonKey:"sb_publishable_Z3zhjaDxtl0fuThb2Rtrhg_9gqoJ5YN" },

  /* ---- Tài khoản đăng nhập ---- */
  ACCOUNTS: [
    { user:"admin",       pass:"sakuko",        name:"Lường Thị Thùy", store:"BAN GIÁM ĐỐC / GĐVH", role:"admin" },
    { user:"nganhhang",   pass:"nganhhang26",   name:"Chuyên viên Ngành hàng", store:"NGÀNH HÀNG (chỉ xem)", role:"viewer" },
    { user:"asm",         pass:"asm26",         name:"ASM Quản lý chuỗi", store:"ASM (giám sát & duyệt)", role:"asm" },
    // --- 3 CH tiên phong (Giai đoạn 1) ---
    { user:"hangbong",    pass:"hangbong26",    name:"QL Hàng Bông",        store:"Hàng Bông (GĐ1)",     role:"cht" },
    { user:"mandarin",    pass:"mandarin26",    name:"QL Mandarin",         store:"Mandarin (GĐ1)",      role:"cht" },
    { user:"t6times",     pass:"t6times26",     name:"QL T6 Times City",    store:"T6 Times City (GĐ1)", role:"cht" },
    // --- 5 CH mới (nhân bản) ---
    { user:"thaiha",      pass:"thaiha26",      name:"QL Thái Hà",          store:"Thái Hà",             role:"cht" },
    { user:"trandangninh",pass:"trandangninh26",name:"QL Trần Đăng Ninh",   store:"Trần Đăng Ninh",      role:"cht" },
    { user:"hamnghi",     pass:"hamnghi26",     name:"QL Hàm Nghi",         store:"Hàm Nghi",            role:"cht" },
    { user:"nguyendu",    pass:"nguyendu26",    name:"QL Nguyễn Du",        store:"Nguyễn Du",           role:"cht" },
    { user:"nguyentuan",  pass:"nguyentuan26",  name:"QL Nguyễn Tuân",      store:"Nguyễn Tuân",         role:"cht" }
  ],

  /* Danh sách 8 CH ở bảng tiến độ (khớp CHÍNH XÁC field store ở trên) */
  STORES: ["Hàng Bông (GĐ1)","Mandarin (GĐ1)","T6 Times City (GĐ1)","Thái Hà","Trần Đăng Ninh","Hàm Nghi","Nguyễn Du","Nguyễn Tuân"],

  /* Tuyến điều chuyển hàng ế: CH nguồn -> điểm nhận. Tên PHẢI khớp tên trong data-hangmoi.js */
  TRANSFER_ROUTES: {
    "Mandarin C1":"Hàm Nghi", "Nguyễn Tuân":"Hàm Nghi", "T6 Time City":"Hàm Nghi",
    "Thái Hà":"Trần Đăng Ninh", "Nguyễn Du":"Trần Đăng Ninh", "Hàng Bông":"Trần Đăng Ninh"
  },

  /* ---- CÁC MODULE THỰC THI — thêm field vào 'form' là có ngay ô nhập ---- */
  MODULES: [
    { id:"m1", code:"M1", title:"Xác định Store Persona", phase:"GĐ 1", deadline:"Tuần 1",
      intro:"Nhận diện chân dung cửa hàng của bạn để làm nền chọn hàng.",
      todo:["Quan sát khách thực tế 3–5 ngày.","Chọn 1 Persona chính (hoặc mô tả hybrid).","Nêu 3 đặc điểm khách + việc-cần-làm (JTBD) nổi bật."],
      form:[
        {name:"persona", label:"Persona chính của CH", type:"select", options:["Gia đình Nhật (Family Daily)","Dân cư + Văn phòng (Hybrid)","Traffic tốt / Khách du lịch","Khác — mô tả bên dưới"]},
        {name:"khach", label:"Mô tả khách chủ đạo (tuổi, nhu cầu, khung giờ)", type:"textarea"},
        {name:"jtbd", label:"3 việc khách đến CH để giải quyết (JTBD)", type:"textarea"}
      ]},
    { id:"m2", code:"M2", title:"Đề xuất SKU trong khung 5–10%", phase:"GĐ 1", deadline:"Tuần 2",
      intro:"Đề xuất SP bổ sung/thay thế — BẮT BUỘC nằm trong 5–10% ngoài Core, không phá nhận diện thương hiệu.",
      todo:["Liệt kê SKU đề xuất + lý do gắn với Persona.","Ghi rõ bổ sung mới hay thay thế mã đang yếu.","Ước lượng nhóm hàng & mức giá kỳ vọng."],
      form:[
        {name:"sku_list", label:"Danh sách SKU đề xuất (mỗi dòng 1 SP: tên – nhóm hàng – lý do)", type:"textarea"},
        {name:"thay_the", label:"Mã đang yếu đề xuất thay thế/loại bỏ", type:"textarea"},
        {name:"ngan_sach", label:"Ước tính số mã & % so với tổng SKU của CH", type:"text"}
      ]},
    { id:"m3", code:"M3", title:"Khảo sát đối thủ", phase:"GĐ 1–2", deadline:"Định kỳ",
      intro:"Đi khảo sát đối thủ quanh CH, ghi lại điểm học được để áp dụng ngay.",
      todo:["Chọn 1 đối thủ gần CH.","Chụp ảnh trưng bày, tem giá, POSM.","Rút ra 1 hành động áp dụng được ngay."],
      form:[
        {name:"doi_thu", label:"Tên đối thủ khảo sát", type:"text"},
        {name:"manh", label:"Nhóm/mã hàng đối thủ bán mạnh mà Sakuko chưa có / bán chưa tốt", type:"textarea"},
        {name:"trung_bay", label:"Cách trưng bày & làm nổi bật SP", type:"textarea"},
        {name:"gia_ctkm", label:"Giá bán & chương trình thúc đẩy mua nổi bật", type:"textarea"},
        {name:"nhan_vien", label:"Cách NV đối thủ tư vấn/bán", type:"textarea"},
        {name:"de_xuat", label:"Đề xuất Sakuko áp dụng ngay", type:"textarea"},
        {name:"anh", label:"Link ảnh khảo sát (dán link Drive/Zalo)", type:"textarea"}
      ]},
    { id:"m4", code:"M4", title:"Triển khai & Phản hồi khách hàng", phase:"GĐ 2", deadline:"Hàng tuần",
      intro:"Sau khi lên hàng & chỉnh trưng bày, ghi nhận phản hồi KH và kết quả bán.",
      todo:["Báo đã lên kệ / đổi khu trưng bày nào.","Ghi phản hồi KH (khen/chê/hỏi gì).","Ghi nhận SP bán tốt / bán chậm."],
      form:[
        {name:"trien_khai", label:"Đã triển khai gì tuần này (SKU/khu trưng bày)", type:"textarea"},
        {name:"phan_hoi", label:"Phản hồi khách hàng ghi nhận được", type:"textarea"},
        {name:"ket_qua", label:"SP bán tốt / bán chậm + con số nếu có", type:"textarea"}
      ]},
    { id:"m5", code:"M5", title:"Tổng kết & Đề xuất nhân rộng", phase:"GĐ 3", deadline:"Cuối vòng",
      intro:"Tổng kết cả vòng thử nghiệm và đề xuất chuẩn hóa cho CH mình + hệ thống.",
      todo:["Tổng kết SKU nào giữ / bỏ.","Bài học về quy trình & quan sát khách.","Đề xuất tiếp theo cho CH và cho chuỗi."],
      form:[
        {name:"giu_bo", label:"SKU giữ lại (chính thức hóa) / SKU loại bỏ", type:"textarea"},
        {name:"bai_hoc", label:"Bài học quy trình + quan sát khách hàng", type:"textarea"},
        {name:"de_xuat_ht", label:"Đề xuất cho CH mình & cho hệ thống", type:"textarea"}
      ]}
  ]
};
