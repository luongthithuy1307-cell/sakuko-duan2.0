/* ============================================================
   GỐC (CORE) — bộ máy chung: đăng nhập, phân quyền, khung/menu,
   lớp dữ liệu (Supabase/localStorage), bộ định tuyến tab.
   ÍT KHI CẦN SỬA. Mỗi tab là 1 file tab-*.js tự cắm vào đây qua registerTab().
   ============================================================ */
const $ = s => document.querySelector(s);
function vnd(n){ return (Math.round(n)||0).toLocaleString("vi-VN"); }
function escapeHtml(s){ return (s==null?"":String(s)).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c])); }

/* ---- Lớp dữ liệu: dùng Supabase nếu có key, không thì lưu localStorage ---- */
let SUBS = [];
let sb = null, rtSet = false;
function initSb(){
  if(sb) return sb;
  if(CONFIG.SUPABASE && CONFIG.SUPABASE.url && window.supabase){
    sb = window.supabase.createClient(CONFIG.SUPABASE.url, CONFIG.SUPABASE.anonKey);
  }
  return sb;
}
const DB = {
  cloud(){ return !!initSb(); },
  async load(){
    if(this.cloud()){
      const {data,error}=await sb.from("submissions").select("*").order("at",{ascending:true});
      if(error){ console.warn("Supabase load error:",error.message); return; }
      SUBS=(data||[]).map(r=>({storeName:r.store_name,user:r.username,moduleId:r.module_id,data:r.data,at:Number(r.at)}));
    } else {
      SUBS=JSON.parse(localStorage.getItem("d2_subs")||"[]");
    }
  },
  async add(rec){
    if(this.cloud()){
      const {error}=await sb.from("submissions").insert({store_name:rec.storeName,username:rec.user,module_id:rec.moduleId,data:rec.data,at:rec.at});
      if(error){ alert("Lỗi lưu lên máy chủ: "+error.message); return false; }
      await this.load();
    } else {
      SUBS.push(rec); localStorage.setItem("d2_subs",JSON.stringify(SUBS));
    }
    return true;
  },
  realtime(cb){
    if(this.cloud() && !rtSet){
      rtSet=true;
      sb.channel("subs-rt").on("postgres_changes",{event:"*",schema:"public",table:"submissions"},async()=>{ await DB.load(); cb(); }).subscribe();
    }
  }
};
const store = {
  get subs(){ return SUBS; },
  get me(){ return JSON.parse(sessionStorage.getItem("d2_me")||"null"); },
  set me(v){ sessionStorage.setItem("d2_me", JSON.stringify(v)); }
};
function statusOf(storeName, moduleId){ return SUBS.some(s=>s.storeName===storeName && s.moduleId===moduleId); }

/* ---- Số liệu hàng mới: ưu tiên đọc LIVE từ Supabase (bảng hangmoi),
   không có thì dùng file tĩnh data-hangmoi.js làm dự phòng ---- */
let hmRt=false;
async function loadHangmoi(){
  if(!DB.cloud()) return;                         // chưa bật Supabase → giữ window.HANGMOI từ data-hangmoi.js
  try{
    const {data,error}=await sb.from("hangmoi").select("payload").eq("id",1).maybeSingle();
    if(!error && data && data.payload){ window.HANGMOI = data.payload; }
  }catch(e){ console.warn("loadHangmoi:",e); }
}
function hangmoiRealtime(){
  if(DB.cloud() && !hmRt){
    hmRt=true;
    sb.channel("hm-rt").on("postgres_changes",{event:"*",schema:"public",table:"hangmoi"},async()=>{ await loadHangmoi(); if(TAB==="report"||TAB==="transfer") render(); }).subscribe();
  }
}

/* ---- Đăng ký tab (mỗi nhánh gọi hàm này để tự cắm vào menu) ---- */
window.TABS = [];
function registerTab(def){ window.TABS.push(def); }   // def = {id, label, render}

/* ---- Trạng thái + bộ định tuyến ---- */
let TAB = null, curModule = null;
function render(){
  const def=window.TABS.find(t=>t.id===TAB);
  $("#view").innerHTML = def ? def.render() : "";
  window.scrollTo(0,0);
}
function go(t){ TAB=t; document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("active",b.dataset.t===t)); render(); }

/* ---- Đăng nhập / phân quyền ---- */
function doLogin(){
  const u=$("#u").value.trim().toLowerCase(), p=$("#p").value.trim().toLowerCase();
  const acc=CONFIG.ACCOUNTS.find(a=>a.user.toLowerCase()===u && a.pass.toLowerCase()===p);
  if(!acc){ $("#loginErr").textContent="Sai tài khoản hoặc mật khẩu. Hãy xóa ô mật khẩu và gõ lại 'sakuko'."; return; }
  store.me={user:acc.user,name:acc.name,storeName:acc.store,role:acc.role};
  bootApp();
}
function logout(){ sessionStorage.removeItem("d2_me"); location.reload(); }

async function bootApp(){
  const me=store.me;
  $("#login").classList.add("hide");
  $("#app").classList.remove("hide");
  $("#whoName").textContent=me.name;
  $("#nav").innerHTML=window.TABS.map(t=>`<button data-t="${t.id}" onclick="go('${t.id}')">${t.label}</button>`).join("");
  await DB.load();
  await loadHangmoi();
  DB.realtime(()=>{ if(TAB==="progress"||TAB==="modules") render(); });
  hangmoiRealtime();
  go(window.TABS[0].id);
}
