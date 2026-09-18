// Test tầng dữ liệu (KHÔNG cần quyền nhắn tin / không cần Groq).
// Chạy: node test-inventory.js  4901326030848  154292  "kẹo dẻo"
const cfg = require('./config');
const inv = require('./inventory');

(async () => {
  console.log('Đang nạp tồn kho hôm nay từ Lark...');
  await inv.ensureLoaded(cfg);
  console.log(`✅ Ngày ${inv.date()} — ${inv.count()} mã hàng.\n`);

  const queries = process.argv.slice(2).length ? process.argv.slice(2) : ['4901326030848'];
  for (const q of queries) {
    const r = inv.lookup(q);
    if (!r) { console.log(`>> "${q}" → không thấy\n`); continue; }
    const e = r.entry;
    console.log(`>> "${q}" (khớp ${r.matched})`);
    console.log(`   ${e.tenSP} | SP2 ${e.maSP2} | SKU ${e.sku}`);
    console.log(`   TOTAL = ${e.total} | Còn hàng ${e.stores.length} kho`);
    console.log(`   ${e.stores.slice(0, 5).map((s) => `${s.name}:${s.qty}`).join(', ')}\n`);
  }
})().catch((e) => { console.error('❌', e.message); process.exit(1); });
