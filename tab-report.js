/* NHÁNH: Báo cáo hàng mới (tốc độ bán & tồn kho). Data ở data-hangmoi.js */
let RP = { store:"__all", nganh:"__all", q:"", sort:"sold" };
function rpRows(){
  const H=window.HANGMOI; if(!H) return [];
  return H.items.map(it=>{
    const sold = RP.store==="__all" ? it.sold : (it.byStoreSold[RP.store]||0);
    const inv  = RP.store==="__all" ? it.inv  : (it.byStoreInv[RP.store]||0);
    const mo = Math.max(it.monthsActive,1);
    const avg = sold/mo;
    const st = (sold+inv)>0 ? sold/(sold+inv) : 0;   // tỷ lệ bán ra
    let cls="todo", stt="Bình thường", act="Theo dõi";
    if(sold===0){ cls="dead"; stt="Chưa bán"; act= inv>0?"Rà tem/vị trí — cân nhắc cắt":"Chưa lên kệ"; }
    else if(inv===0){ cls="doing"; stt="Hết hàng"; act="Bổ sung gấp"; }
    else if(st>=0.6){ cls="done"; stt="Bán tốt"; act="Đẩy tiếp / bổ sung"; }
    else if(st<0.3){ cls="doing"; stt="Bán chậm"; act="Kích cầu / giảm giá / combo"; }
    return {...it, soldV:sold, invV:inv, invVal:inv*it.price, avg, st, cls, stt, act};
  }).filter(r=>{
    if(RP.nganh!=="__all" && r.nganh!==RP.nganh) return false;
    if(RP.q){ const k=RP.q.toLowerCase(); if(!((r.name+" "+r.nganh+" "+r.nhom+" "+r.code).toLowerCase().includes(k))) return false; }
    return true;
  }).sort((a,b)=>{
    if(RP.sort==="st") return b.st-a.st;
    if(RP.sort==="inv") return b.invV-a.invV;
    if(RP.sort==="nganh") return (a.nganh||"").localeCompare(b.nganh||"");
    return b.soldV-a.soldV;
  });
}
function rpRender(){
  const rows=rpRows();
  const nSold=rows.filter(r=>r.soldV>0).length, nDead=rows.filter(r=>r.soldV===0).length;
  const totSold=rows.reduce((s,r)=>s+r.soldV,0);
  const totRev = RP.store==="__all" ? rows.reduce((s,r)=>s+r.rev,0) : null;
  const kpi=$("#rpKpi");
  if(kpi) kpi.innerHTML=`
    <div class="stat"><div class="s-n">${rows.length}</div><div class="s-l">mã hàng mới</div></div>
    <div class="stat"><div class="s-n" style="color:#16a34a">${nSold}</div><div class="s-l">mã đã có bán</div></div>
    <div class="stat"><div class="s-n" style="color:#c8102e">${nDead}</div><div class="s-l">mã chưa bán</div></div>
    <div class="stat"><div class="s-n">${vnd(totSold)}</div><div class="s-l">SP bán ra${RP.store==="__all"?" (4 tháng)":""}</div></div>
    ${totRev!==null?`<div class="stat"><div class="s-n">${vnd(totRev)}</div><div class="s-l">thực thu (đ)</div></div>`:``}`;
  // Cảnh báo tồn ứ đọng — nguy cơ chôn vốn
  const risk=rows.filter(r=>r.invV>0 && r.st<0.35).sort((a,b)=>b.invVal-a.invVal);
  const riskVal=risk.reduce((s,r)=>s+r.invVal,0);
  const warn=$("#rpWarn");
  if(warn){
    warn.innerHTML = risk.length ? `<div class="card warn-card">
      <h2>⚠️ Cảnh báo tồn ứ đọng — nguy cơ chôn vốn</h2>
      <p class="lead"><b>${risk.length}</b> mã còn tồn nhưng bán chậm/chưa bán · tổng giá trị tồn đang kẹt ≈ <b class="risk-v">${vnd(riskVal)} đ</b>${RP.store==="__all"?" (toàn 8 CH)":" (tại "+RP.store+")"}. Ưu tiên xử lý các mã dưới đây kẻo lỗ.</p>
      <div class="tbl-wrap"><table>
        <tr><th>Tên sản phẩm</th><th>Ngành</th><th>Tồn</th><th>GT tồn (đ)</th><th>Tỷ lệ bán ra</th><th>SL bán</th><th>Gợi ý xử lý</th></tr>
        ${risk.slice(0,15).map(r=>`<tr>
          <td>${escapeHtml(r.name)}</td><td style="font-size:11px">${escapeHtml(r.nganh)}</td>
          <td style="text-align:center;font-weight:800">${vnd(r.invV)}</td>
          <td style="text-align:right;font-weight:800;color:#b91c1c">${vnd(r.invVal)}</td>
          <td style="text-align:center">${Math.round(r.st*100)}%</td>
          <td style="text-align:center">${vnd(r.soldV)}</td>
          <td style="font-size:11.5px">${r.soldV===0?"Rà lên kệ/tem giá — cân nhắc trả NCC":"Giảm giá / combo / dồn về CH bán tốt"}</td>
        </tr>`).join("")}
      </table></div>
      <div class="note" style="background:#fff1f1;border-color:#f3c0c0;color:#7a1223;margin-top:12px">Ngưỡng cảnh báo: còn tồn &amp; tỷ lệ bán ra &lt; 35%. Đổi CH ở trên để soi từng điểm bán.</div>
    </div>` : `<div class="card"><p class="lead" style="margin:0">✅ Không có mã tồn ứ đọng đáng lo ${RP.store==="__all"?"toàn chuỗi":"tại "+RP.store} (tỷ lệ bán ra đều ổn).</p></div>`;
  }
  const body=$("#rpBody");
  if(body) body.innerHTML=`<table><tr>
      <th>Mã</th><th>Tên sản phẩm</th><th>Ngành</th><th>Giá</th>
      <th>SL bán</th><th>BQ/th</th><th>Tồn</th><th>Tỷ lệ bán ra</th><th>Trạng thái → Hành động</th></tr>`+
    rows.map(r=>`<tr>
      <td>${r.code}</td><td>${escapeHtml(r.name)}</td><td style="font-size:11px">${escapeHtml(r.nganh)}</td>
      <td style="text-align:right">${vnd(r.price)}</td>
      <td style="text-align:center;font-weight:800">${vnd(r.soldV)}</td>
      <td style="text-align:center">${r.avg.toFixed(1)}</td>
      <td style="text-align:center">${vnd(r.invV)}</td>
      <td style="text-align:center">${Math.round(r.st*100)}%</td>
      <td><span class="badge ${r.cls}">${r.stt}</span> <span style="font-size:11.5px;color:var(--muted)">${r.act}</span></td>
    </tr>`).join("")+`</table>`;
  const cnt=$("#rpCount"); if(cnt) cnt.textContent=rows.length;
}
function viewReport(){
  const H=window.HANGMOI;
  if(!H) return `<div class="card"><h2>Báo cáo hàng mới</h2><p class="lead">Chưa nạp được dữ liệu (file <code>data-hangmoi.js</code>). Kiểm tra file có nằm cùng thư mục với index.html không.</p></div>`;
  const nganhs=[...new Set(H.items.map(i=>i.nganh).filter(Boolean))].sort();
  const storeOpts=`<option value="__all">Tất cả 8 CH</option>`+H.stores.map(s=>`<option value="${s}">${s}</option>`).join("");
  const nganhOpts=`<option value="__all">Tất cả ngành</option>`+nganhs.map(n=>`<option value="${n}">${n}</option>`).join("");
  setTimeout(()=>{
    const st=$("#rpStore"), ng=$("#rpNganh"), q=$("#rpQ"), so=$("#rpSort");
    if(st) st.onchange=()=>{RP.store=st.value;rpRender();};
    if(ng) ng.onchange=()=>{RP.nganh=ng.value;rpRender();};
    if(q)  q.oninput =()=>{RP.q=q.value;rpRender();};
    if(so) so.onchange=()=>{RP.sort=so.value;rpRender();};
    rpRender();
  },0);
  return `
  <div class="card"><h2>📈 Báo cáo hàng mới — tốc độ bán & tồn kho</h2>
    <p class="lead">${H.items.length} mã mở mới tháng 4–7/2026 tại 8 CH dự án. Cập nhật ${H.updated}. Dành cho ngành hàng: soi mã nào bán nhanh cần bổ sung, mã nào chết cần cắt/kích cầu.</p>
    <div class="rp-kpi" id="rpKpi"></div>
    <div class="rp-ctrls">
      <select id="rpStore">${storeOpts}</select>
      <select id="rpNganh">${nganhOpts}</select>
      <select id="rpSort">
        <option value="sold">Sắp xếp: SL bán ↓</option>
        <option value="st">Tỷ lệ bán ra ↓</option>
        <option value="inv">Tồn kho ↓</option>
        <option value="nganh">Theo ngành</option>
      </select>
      <input id="rpQ" placeholder="🔎 Tìm tên/mã hàng...">
    </div>
    <div class="lead" style="margin-top:6px">Hiển thị <b id="rpCount">0</b> mã. <span style="color:var(--muted)">Tỷ lệ bán ra = SL bán ÷ (bán+tồn): cao = quay vòng tốt.</span></div>
  </div>
  <div id="rpWarn"></div>
  <div class="card"><h2 style="font-size:15px;margin-bottom:10px">📋 Chi tiết tất cả mã hàng mới</h2><div class="tbl-wrap" id="rpBody"></div></div>`;
}
registerTab({ id:"report", label:"Báo cáo hàng mới", render:viewReport });
