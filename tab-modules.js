/* NHÁNH: Các Module thực thi (QL nộp bài). Danh sách module ở CONFIG.MODULES */
function viewModules(){
  const me=store.me;
  return `<div class="card"><h2>✅ Các Module thực thi</h2><p class="lead">Làm lần lượt. Bấm <b>Nộp / Cập nhật</b> ở mỗi module. Có thể nộp lại nhiều lần (bản mới nhất được tính).</p></div>` +
  CONFIG.MODULES.map(m=>{
    const isCht = me.role==="cht";
    const done = isCht && statusOf(me.storeName,m.id);
    return `<div class="mod">
      <div class="m-top"><span class="code">${m.code}</span><span class="m-title">${m.title}</span>
        <span class="m-meta">${m.phase} · Hạn: ${m.deadline}</span></div>
      <p class="lead" style="margin:8px 0 4px">${m.intro}</p>
      <ul class="clean" style="font-size:13px">${m.todo.map(t=>`<li>${t}</li>`).join("")}</ul>
      <div class="row-actions">
        ${isCht
          ? `<span class="badge ${done?"done":"todo"}">${done?"Đã nộp":"Chưa nộp"}</span>
             <button class="btn sm" onclick="openModule('${m.id}')">${done?"Cập nhật":"Nộp"}</button>`
          : `<span class="badge todo">${me.role==="viewer"?"Chế độ xem Ngành hàng":me.role==="asm"?"Chế độ ASM — duyệt ở tab Tiến độ":"Chế độ xem BGĐ"}</span>`}
      </div>
    </div>`;
  }).join("");
}
function openModule(id){
  curModule=CONFIG.MODULES.find(m=>m.id===id);
  const me=store.me;
  const prev=store.subs.filter(s=>s.storeName===me.storeName && s.moduleId===id).slice(-1)[0];
  $("#dlgTitle").textContent=`${curModule.code} · ${curModule.title}`;
  $("#dlgBody").innerHTML=curModule.form.map(f=>{
    const val=prev?escapeHtml(prev.data[f.name]||""):"";
    if(f.type==="textarea") return `<label>${f.label}</label><textarea rows="3" data-n="${f.name}">${val}</textarea>`;
    if(f.type==="select") return `<label>${f.label}</label><select data-n="${f.name}">${f.options.map(o=>`<option ${o===(prev?prev.data[f.name]:"")?"selected":""}>${o}</option>`).join("")}</select>`;
    return `<label>${f.label}</label><input type="${f.type==='number'?'number':f.type==='date'?'date':'text'}" data-n="${f.name}" value="${val}">`;
  }).join("");
  dlg.showModal();
}
async function submitModule(){
  const me=store.me, data={};
  $("#dlgBody").querySelectorAll("[data-n]").forEach(el=>data[el.dataset.n]=el.value.trim());
  const ok=await DB.add({storeName:me.storeName, user:me.user, moduleId:curModule.id, data, at:Date.now()});
  if(ok){ dlg.close(); render(); }
}
registerTab({ id:"modules", label:"Các Module thực thi", render:viewModules });
