/* NHÁNH: Tiến độ cửa hàng (bảng % + lớp ASM duyệt + bài nộp gần đây) */
function labelOf(m,key){ if(!m)return key; const f=m.form.find(f=>f.name===key); return f?f.label:key; }
function isApproved(storeName, moduleId){ return SUBS.some(s=>s.storeName===storeName && s.moduleId==="duyet_"+moduleId); }
async function approveModule(storeName, moduleId){
  const me=store.me;
  await DB.add({ storeName:storeName, user:me.user, moduleId:"duyet_"+moduleId, data:{by:me.name}, at:Date.now() });
  render();
}
function viewProgress(){
  const stores=CONFIG.STORES, mods=CONFIG.MODULES, me=store.me;
  const isAsm = me.role==="asm";
  const head=`<tr><th>Cửa hàng</th>${mods.map(m=>`<th>${m.code}</th>`).join("")}<th>%</th></tr>`;
  const rows=stores.map(st=>{
    let done=0;
    const cells=mods.map(m=>{
      const nop=statusOf(st,m.id), duyet=isApproved(st,m.id);
      if(nop) done++;
      let inner;
      if(!nop) inner=`<span style="color:#9aa3af">⬜</span>`;
      else if(duyet) inner=`✅<br><span style="font-size:10px;color:#166534;font-weight:700">✔ duyệt</span>`;
      else if(isAsm) inner=`✅<br><button onclick="approveModule('${st}','${m.id}')" style="margin-top:3px;border:1px solid var(--red);color:var(--red);background:#fff;border-radius:6px;padding:2px 7px;font-size:10px;font-weight:700;cursor:pointer">Duyệt</button>`;
      else inner=`✅<br><span style="font-size:10px;color:#b45309">chờ duyệt</span>`;
      return `<td class="st">${inner}</td>`;
    }).join("");
    return `<tr><td><b>${st}</b></td>${cells}<td><b>${Math.round(done/mods.length*100)}%</b></td></tr>`;
  }).join("");
  const subs=store.subs.filter(s=>!String(s.moduleId).startsWith("duyet_")).slice().reverse().slice(0,20);
  const list = subs.length? subs.map(s=>{
    const m=mods.find(x=>x.id===s.moduleId);
    const body=Object.entries(s.data).map(([k,val])=>`<div><span style="color:var(--muted)">${labelOf(m,k)}:</span> ${escapeHtml(val)||"—"}</div>`).join("");
    return `<div class="s-item"><b>${s.storeName}</b> · ${m?m.code:""} ${m?m.title:""} <span style="color:var(--muted);font-size:12px">· ${new Date(s.at).toLocaleString("vi-VN")}</span>${body}</div>`;
  }).join("") : `<p class="lead">Chưa có bài nộp nào trên thiết bị này.</p>`;
  return `
  <div class="card"><h2>📊 Tiến độ ${stores.length} cửa hàng</h2>
    <div class="tbl-wrap"><table>${head}${rows}</table></div>
    <div class="lead" style="margin-top:8px">Chú thích: ⬜ chưa nộp · ✅ QL đã nộp · <span style="color:#166534;font-weight:700">✔ duyệt</span> = ASM đã kiểm tra tại điểm bán.
    ${isAsm?" <b>Bạn là ASM:</b> bấm nút <b>Duyệt</b> ở ô đã nộp để xác nhận.":""}</div>
    <div class="note"><b>Lưu ý bản prototype:</b> bảng đọc dữ liệu trên <b>chính thiết bị này</b>. Để mọi máy thấy chung theo thời gian thực → bật <b>Supabase</b> (xem SETUP-SUPABASE.md).</div>
  </div>
  <div class="card"><h2>🗂️ Bài nộp gần đây</h2><div class="sub-list">${list}</div></div>`;
}
registerTab({ id:"progress", label:"Tiến độ cửa hàng", render:viewProgress });
