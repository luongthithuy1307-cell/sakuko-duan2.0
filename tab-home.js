/* NHÁNH: Hiểu dự án — sửa nội dung ở HOME, không đụng gốc */
const HOME = {
  goals: [
    "Thử nghiệm cơ chế: Trao quyền chọn 5–10% SKU ngoài Core và 1–2 khu vực trưng bày cho Cửa hàng trưởng (CHT).",
    "Tối ưu hóa: Tăng mức độ phù hợp giữa Store Persona (chân dung cửa hàng) và danh mục hàng hóa để thúc đẩy vòng quay.",
    "Phát triển con người: Nâng cao tư duy ownership (làm chủ) và năng lực ra quyết định của CHT.",
    "Nhân rộng: Thu thập bài học thực tế để chuẩn bị áp dụng đại trà toàn hệ thống."
  ],
  roles: [
    { r:"CHT (Model Store)", d:"Chủ thể thực thi — trực tiếp đưa ra các Local Experiment (thử nghiệm địa phương) và báo cáo insight khách hàng." },
    { r:"Quản lý chuỗi (ASM)", d:"Điều phối vận hành, đảm bảo kỷ luật triển khai tại CH, hỗ trợ CHT tháo gỡ khó khăn tại điểm bán." },
    { r:"Ngành hàng", d:"Thiết lập SKU pool (danh mục có thể cung cấp), cung cấp dữ liệu bán hàng và hỗ trợ phân tích." },
    { r:"Cố vấn (C.Hường – BGĐ)", d:"Giám sát tiến trình, đánh giá mức độ trưởng thành của CHT, đảm bảo mô hình đóng gói được để nhân rộng." }
  ],
  frame: [
    "Đề xuất của CHT phải nằm trong khung <b>5–10% SKU ngoài Core</b> và <b>không phá vỡ chuẩn nhận diện thương hiệu</b>.",
    "Áp dụng cơ chế <b>Local Experiment</b> (thử nhanh – sai nhanh) trong 30–60 ngày để đo hiệu quả trước khi chính thức hóa danh mục."
  ],
  phases: [
    { h:"GĐ 1 · Thiết lập", date:"tuần 1–2 khi bắt đầu", items:["Xác định Store Persona cho CH.","Thống nhất khung SKU pool và ngân sách thử nghiệm.","CHT nhận diện Persona, đề xuất SP bổ sung/thay thế riêng cho CH.","Ngành hàng cấp danh mục SKU dự phòng, sẵn sàng cung ứng.","Cố vấn thống nhất khung kiểm soát."] },
    { h:"GĐ 2 · Thực thi", date:"~8 tuần", items:["Triển khai điều chỉnh SKU và trưng bày.","Ghi nhận phản hồi từ khách hàng.","Theo dõi kết quả bán hàng.","CHT ra quyết định và báo cáo; ASM giám sát check-in + đặt rule báo cáo vào nhóm."] },
    { h:"GĐ 3 · Tổng kết & Đánh giá", date:"~1 tuần", items:["Phân tích hiệu quả kinh doanh + bài học từng Model Store.","Chuẩn hóa lại danh mục HH thử nghiệm tại mỗi CH.","CHT tổng kết quá trình → đề xuất tiếp theo cho CH và hệ thống.","Cố vấn & ASM đánh giá năng lực CHT, đóng gói quy trình."] },
    { h:"GĐ 4 · Nhân rộng (ĐANG Ở ĐÂY)", date:"nhóm CH tiếp theo", items:["Đào tạo nhóm CHT tiếp theo.","Lặp lại quy trình đã đóng gói nhưng đẩy nhanh tốc độ.","Ngành hàng cung ứng hàng hóa cho nhóm thử nghiệm mới."] }
  ]
};
function viewHome(){
  const P=HOME;
  return `
  <div class="card">
    <span class="pill">Giai đoạn 4 · Nhân rộng</span>
    <h2>Dự Án 2.0 — Trao quyền phát triển hàng hóa mới dưới cửa hàng</h2>
    <p class="lead">Trao quyền cho Cửa hàng trưởng chủ động chọn 5–10% SKU ngoài Core + 1–2 khu trưng bày, để danh mục khớp hơn với khách của từng cửa hàng. Đọc kỹ phần này trước khi vào các Module.</p>
    <div class="note">Nhịp làm việc: đọc dự án → làm lần lượt Module 1 → 5. ASM và chị Thùy theo dõi ở tab <b>Tiến độ cửa hàng</b>.</div>
  </div>
  <div class="grid2">
    <div class="card"><h2>🎯 Mục tiêu</h2><ul class="clean">${P.goals.map(g=>`<li>${g}</li>`).join("")}</ul></div>
    <div class="card"><h2>👥 Vai trò</h2><ul class="clean">${P.roles.map(r=>`<li><b>${r.r}:</b> ${r.d}</li>`).join("")}</ul></div>
  </div>
  <div class="card"><h2>🧭 Khung trao quyền (đọc kỹ)</h2><ul class="clean">${P.frame.map(f=>`<li>${f}</li>`).join("")}</ul></div>
  <div class="card"><h2>🗓️ Lộ trình 90 ngày</h2>
    ${P.phases.map(ph=>`<div class="phase"><div class="p-h">${ph.h} <span class="p-date">· ${ph.date}</span></div><ul class="clean">${ph.items.map(i=>`<li>${i}</li>`).join("")}</ul></div>`).join("")}
  </div>`;
}
registerTab({ id:"home", label:"Hiểu dự án", render:viewHome });
