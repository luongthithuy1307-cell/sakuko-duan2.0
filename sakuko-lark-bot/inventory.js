// Nạp & tra cứu tồn kho từ tab "TỒN THỰC TẾ" của file ngày trong Lark Wiki.
// Con số Total lấy THẲNG từ sheet — không qua LLM.
const { api, readRange } = require('./lark');

// Cấu trúc tab TỒN THỰC TẾ (đã xác minh trên data thật):
//  A Ngành | B Nhóm | C Loại | D Tình trạng | E Trạng thái KD |
//  F Mã SP2 | G Tên SP | H Mã SP(SKU) | I Giá bán lẻ | J..AR các kho | AS Total
const COL = { NGANH: 0, NHOM: 1, LOAI: 2, TT: 3, TTKD: 4, MASP2: 5, TEN: 6, SKU: 7, GIA: 8, STORE_FROM: 9, STORE_TO: 43, TOTAL: 44 };
const CHUNK = 500;

let cache = { date: null, byMaSP2: {}, bySKU: {}, list: [] };
let lastScan = 0;
const RESCAN_MS = 10 * 60 * 1000;
let fileCache = { token: null, date: null, ts: 0 };
const FILE_CACHE_MS = 10 * 60 * 1000;

function todayVN() {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const g = (t) => p.find((x) => x.type === t).value;
  return { y: g('year'), m: g('month'), d: g('day') };
}

async function listChildren(cfg, parent) {
  const items = []; let pageToken;
  do {
    const params = { parent_node_token: parent, page_size: 50 };
    if (pageToken) params.page_token = pageToken;
    const data = await api(cfg, 'GET', `/open-apis/wiki/v2/spaces/${cfg.WIKI_SPACE_ID}/nodes`, { params });
    items.push(...(data.items || []));
    pageToken = data.has_more ? data.page_token : null;
  } while (pageToken);
  return items;
}

// Tìm file NGÀY GẦN NHẤT có sẵn (<= hôm nay). Trước 10h chưa có file hôm nay → tự lấy hôm qua.
async function findLatestFile(cfg) {
  const { y, m, d } = todayVN();
  const todayNum = Number(`${y}${m}${d}`);
  const years = await listChildren(cfg, cfg.WIKI_ANCHOR_NODE);
  const yearNode = years.find((n) => (n.title || '').trim() === y);
  if (!yearNode) throw new Error(`Không thấy folder năm ${y}`);
  const months = await listChildren(cfg, yearNode.node_token);

  // Thử tháng hiện tại, nếu chưa có file nào thì lùi 1 tháng (đầu tháng)
  for (const mm of [parseInt(m, 10), parseInt(m, 10) - 1].filter((x) => x >= 1)) {
    const monthNode = months.find((n) => (n.title || '').trim() === `Tháng ${mm}`);
    if (!monthNode) continue;
    const days = await listChildren(cfg, monthNode.node_token);
    let best = null;
    for (const nd of days) {
      const mt = (nd.title || '').trim().match(/^(\d{4})\.(\d{2})\.(\d{2})/);
      if (!mt) continue;
      const num = Number(mt[1] + mt[2] + mt[3]);
      if (num <= todayNum && (!best || num > best.num)) {
        best = { num, token: nd.obj_token, date: `${mt[1]}.${mt[2]}.${mt[3]}` };
      }
    }
    if (best) return best;
  }
  throw new Error('Không tìm thấy file tồn kho nào trong Wiki');
}

// Đổi số cột (1-based) → chữ cột: 45 → "AS"
function colLetter(n) {
  let s = '';
  while (n > 0) { const r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

async function loadFromSheet(cfg, spreadsheetToken) {
  const meta = await api(cfg, 'GET', `/open-apis/sheets/v3/spreadsheets/${spreadsheetToken}/sheets/query`);
  const tab = meta.sheets.find((s) => (s.title || '').trim().toUpperCase() === 'TỒN THỰC TẾ');
  if (!tab) throw new Error('Không thấy tab "TỒN THỰC TẾ"');
  const sheetId = tab.sheet_id;
  const rowCount = (tab.grid_properties && tab.grid_properties.row_count) || 6000;

  // Nhận diện cột theo TÊN tiêu đề (dòng 2 = mã cột, dòng 3 = tên kho) → bền khi layout đổi
  const hdr = await readRange(cfg, spreadsheetToken, `${sheetId}!A2:BZ3`, 'ToString');
  const codes = hdr[0] || [];
  const names = hdr[1] || [];
  const norm = (s) => String(s ?? '').trim().toLowerCase();
  const findCol = (...labels) => codes.findIndex((c) => labels.includes(norm(c)));
  const iMaSP2 = findCol('mã sp2');
  const iTen = findCol('tên sp');
  const iSKU = findCol('mã sp');
  const iGia = findCol('giá bán lẻ');
  const iNganh = findCol('ngành');
  const iTTKD = findCol('trạng thái kd', 'trạng thái kinh doanh');
  const iTotal = findCol('total', 'tổng');
  if (iMaSP2 < 0 || iTotal < 0) throw new Error('Header lạ: không thấy cột "Mã SP2" hoặc "Total"');

  // Cột kho = mọi cột GIỮA "Giá bán lẻ" và "Total" — lưu cả mã kho (dòng 2) + tên kho (dòng 3)
  const storeCols = [];
  for (let i = iGia + 1; i < iTotal; i++) {
    const code = String(codes[i] ?? '').trim();
    const name = String(names[i] ?? '').trim();
    storeCols.push({ idx: i, code: code || `K${i}`, name: name || code || `Kho ${i}` });
  }
  const dataLastCol = colLetter(iTotal + 1);

  const byMaSP2 = {}, bySKU = {}, list = [];
  for (let start = 4; start <= rowCount; start += CHUNK) {
    const end = Math.min(start + CHUNK - 1, rowCount);
    const rows = await readRange(cfg, spreadsheetToken, `${sheetId}!A${start}:${dataLastCol}${end}`, 'UnformattedValue');
    for (const r of rows) {
      const maSP2 = String(r[iMaSP2] ?? '').trim();
      if (!maSP2) continue;
      const allStores = storeCols.map((c) => ({ code: c.code, name: c.name, qty: Number(r[c.idx]) || 0 }));
      const total = allStores.reduce((s, x) => s + x.qty, 0); // TỔNG = tự cộng các kho → luôn khớp breakdown
      const entry = {
        nganh: r[iNganh], ttkd: iTTKD >= 0 ? String(r[iTTKD] ?? '').trim() : '', maSP2, tenSP: String(r[iTen] ?? '').trim(), sku: String(r[iSKU] ?? '').trim(),
        gia: Number(r[iGia]) || 0, total,
        stores: allStores.filter((s) => s.qty > 0),
      };
      byMaSP2[maSP2] = entry;
      if (entry.sku) bySKU[entry.sku] = entry;
      list.push(entry);
    }
  }
  return { byMaSP2, bySKU, list };
}

// Đảm bảo đã nạp file ngày gần nhất. Tự chuyển sang file mới khi nó xuất hiện (sau 10h).
async function ensureLoaded(cfg) {
  const { y, m, d } = todayVN();
  const today = `${y}.${m}.${d}`;
  // Đã có đúng data hôm nay → khỏi rà lại
  if (cache.date === today && cache.list.length) return cache;
  // Đã có data (hôm qua) và vừa rà gần đây → dùng tạm, tránh gọi Wiki liên tục
  if (cache.list.length && Date.now() - lastScan < RESCAN_MS) return cache;

  lastScan = Date.now();
  let latest;
  if (fileCache.token && Date.now() - fileCache.ts < FILE_CACHE_MS && cache.date === fileCache.date && cache.list.length) {
    return cache;
  }
  latest = await findLatestFile(cfg);
  fileCache = { token: latest.token, date: latest.date, ts: Date.now() };
  if (cache.date === latest.date && cache.list.length) return cache;
  const loaded = await loadFromSheet(cfg, latest.token);
  cache = { date: latest.date, ...loaded };
  const tag = latest.date === today ? '(hôm nay)' : '(ngày gần nhất — file hôm nay chưa lên)';
  console.log(`[inventory] Đã nạp tồn ngày ${latest.date} ${tag}: ${cache.list.length} mã hàng`);
  return cache;
}

// Tra 1 mã/tên. Ưu tiên khớp Mã SP2 → SKU → chứa trong Tên SP
function lookup(query) {
  const q = String(query).trim();
  if (cache.byMaSP2[q]) return { entry: cache.byMaSP2[q], matched: 'Mã SP2' };
  if (cache.bySKU[q]) return { entry: cache.bySKU[q], matched: 'SKU' };
  const ql = q.toLowerCase();
  const hits = cache.list.filter((e) => e.tenSP.toLowerCase().includes(ql) || e.maSP2.toLowerCase().includes(ql));
  if (hits.length) return { entry: hits[0], matched: 'Tên/mã gần đúng', more: hits.slice(1, 4).map((e) => `${e.maSP2} - ${e.tenSP}`) };
  return null;
}

module.exports = { ensureLoaded, lookup, date: () => cache.date, count: () => cache.list.length };
