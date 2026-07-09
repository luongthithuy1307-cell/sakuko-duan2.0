/* NHÁNH: Đề xuất điều chuyển hàng. Tuyến ở CONFIG.TRANSFER_ROUTES, data ở data-hangmoi.js */
let TR = { recv:"__all", q:"" };
function transferList(){
  const H=window.HANGMOI; if(!H) return [];
  const routes=CONFIG.TRANSFER_ROUTES; let out=[];
  H.items.forEach(it=>{
    Object.keys(routes).forEach(donor=>{
      const recv=routes[donor];
      const dInv=it.byStoreInv[donor]||0, dSold=it.byStoreSold[donor]||0;
      if(dInv<=0) return;
      const dST=(dSold+dInv)>0?dSold/(dSold+dInv):0;
      if(!(dSold===0 || dST<0.35)) return;            // CH nguồn phải đang ế
      const rInv=it.byStoreInv[recv]||0, rSold=it.byStoreSold[recv]||0;
      const high = rSold>0 || rInv===0;
      out.push({ code:it.code, name:it.name, nganh:it.nganh, price:it.price, donor, recv,
        dInv, dSold, rInv, rSold, qty:dInv, val:dInv*it.price,
        pr: high?"Cao":"Cân nhắc",
        prTxt: rSold>0?"Cao — đích đang bán được":(rInv===0?"Cao — đích đang hết hàng":"Cân nhắc") });
    });
  });
  return out.filter(r=> (TR.recv==="__all"||r.recv===TR.recv) &&
      (!TR.q || (r.name+" "+r.nganh+" "+r.donor).toLowerCase().includes(TR.q.toLowerCase())))
    .sort((a,b)=> a.pr===b.pr ? b.val-a.val : (a.pr==="Cao"?-1:1));
}
function trRender(){
  const rows=transferList();
  const tot=rows.reduce((s,r)=>s+r.val,0), high=rows.filter(r=>r.pr==="Cao").length;
  const k=$("#trKpi"); if(k) k.innerHTML=`
    <div class="stat"><div class="s-n">${rows.length}</div><div class="s-l">đề xuất chuyển</div></div>
    <div class="stat"><div class="s-n" style="color:#16a34a">${high}</div><div class="s-l">ưu tiên cao</div></div>
    <div class="stat"><div class="s-n">${vnd(tot)}</div><div class="s-l">GT hàng luân chuyển (đ)</div></div>`;
  const b=$("#trBody"); if(b) b.innerHTML=`<table><tr>
      <th>Sản phẩm</th><th>Ngành</th><th>Từ CH (tồn·bán)</th><th>→ Đến CH (tồn·bán)</th><th>SL chuyển</th><th>GT (đ)</th><th>Ưu tiên</th></tr>`+
    rows.map(r=>`<tr>
      <td>${escapeHtml(r.name)}</td><td style="font-size:11px">${escapeHtml(r.nganh)}</td>
      <td>${r.donor}<br><span style="color:var(--muted);font-size:11px">tồn ${r.dInv} · bán ${r.dSold}</span></td>
      <td><b>${r.recv}</b><br><span style="color:var(--muted);font-size:11px">tồn ${r.rInv} · bán ${r.rSold}</span></td>
      <td style="text-align:center;font-weight:800">${r.qty}</td>
      <td style="text-align:right">${vnd(r.val)}</td>
      <td><span class="badge ${r.pr==="Cao"?"done":"todo"}">${r.prTxt}</span></td>
    </tr>`).join("")+`</table>`;
  const c=$("#trCount"); if(c) c.textContent=rows.length;
}
function viewTransfer(){
  const H=window.HANGMOI;
  if(!H) return `<div class="card"><h2>Điều chuyển hàng</h2><p class="lead">Chưa nạp được dữ liệu (data-hangmoi.js).</p></div>`;
  const recvs=[...new Set(Object.values(CONFIG.TRANSFER_ROUTES))];
  const recvOpts=`<option value="__all">Tất cả điểm nhận</option>`+recvs.map(r=>`<option value="${r}">→ ${r}</option>`).join("");
  const routeText=Object.entries(CONFIG.TRANSFER_ROUTES).map(([d,r])=>`${d} → <b>${r}</b>`).join(" · ");
  setTimeout(()=>{
    const rc=$("#trRecv"), q=$("#trQ");
    if(rc) rc.onchange=()=>{TR.recv=rc.value;trRender();};
    if(q)  q.oninput =()=>{TR.q=q.value;trRender();};
    trRender();
  },0);
  return `
  <div class="card"><h2>🔄 Đề xuất điều chuyển hàng giữa 8 CH</h2>
    <p class="lead">Chuyển mã đang ế (còn tồn, bán chậm/chưa bán) từ CH nguồn về điểm nhận theo tuyến đã định — giải phóng vốn kẹt, đưa hàng về nơi cần. Cập nhật ${H.updated}.</p>
    <div class="note">Tuyến điều chuyển: ${routeText}</div>
    <div class="rp-kpi" id="trKpi"></div>
    <div class="rp-ctrls">
      <select id="trRecv">${recvOpts}</select>
      <input id="trQ" placeholder="🔎 Tìm sản phẩm / CH nguồn...">
    </div>
    <div class="lead" style="margin-top:6px">Hiển thị <b id="trCount">0</b> đề xuất. Ưu tiên cao = điểm nhận đang bán được hoặc đang hết hàng.</div>
  </div>
  <div class="card"><div class="tbl-wrap" id="trBody"></div></div>`;
}
registerTab({ id:"transfer", label:"Điều chuyển hàng", render:viewTransfer });
