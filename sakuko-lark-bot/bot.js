// Bot Lark tra tồn kho — nhận tin qua long-connection (WebSocket), không cần webhook public.
const lark = require('@larksuiteoapi/node-sdk');
const cfg = require('./config');
const inv = require('./inventory');
const groq = require('./groq');
const { sendText, getToken, getUserName } = require('./lark');

const wsClient = new lark.WSClient({
  appId: cfg.LARK_APP_ID,
  appSecret: cfg.LARK_APP_SECRET,
  domain: lark.Domain.Lark,
});

const stripMentions = (s) => s.replace(/@_user_\d+/g, '').replace(/@\S+/g, '').trim();
const fmtVND = (n) => (Number(n) || 0).toLocaleString('vi-VN');

// --- WATCHDOG ---
let lastAlive = Date.now();
const WATCHDOG_CHECK_MS = 3 * 60 * 1000;
const WATCHDOG_TIMEOUT_MS = 10 * 60 * 1000;
function touchAlive() { lastAlive = Date.now(); }
setInterval(() => {
  const silentMin = Math.round((Date.now() - lastAlive) / 60000);
  if (Date.now() - lastAlive > WATCHDOG_TIMEOUT_MS) {
    console.error(`[WATCHDOG] ${silentMin} phút không có tín hiệu — thoát để restart...`);
    process.exit(1);
  }
  console.log(`[WATCHDOG] OK — tín hiệu cuối ${silentMin} phút trước`);
}, WATCHDOG_CHECK_MS);
setInterval(async () => {
  try { await getToken(cfg); touchAlive(); console.log('[PING] token refresh OK'); }
  catch (e) { console.error('[PING] lỗi:', e.message); }
}, 5 * 60 * 1000);

// --- THỐNG KÊ LƯỢT TRA (persist file) ---
const fs = require('fs');
const path = require('path');
const USAGE_FILE = path.join(__dirname, 'usage.json');

function todayStr() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
}

function loadUsage() {
  try {
    const raw = fs.readFileSync(USAGE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch { return {}; }
}

function saveUsage(data) {
  try { fs.writeFileSync(USAGE_FILE, JSON.stringify(data), 'utf8'); } catch (e) { console.error('[USAGE] lưu lỗi:', e.message); }
}

function trackUsage(userId, userName, productCode) {
  const today = todayStr();
  const data = loadUsage();
  if (!data[today]) data[today] = {};
  if (!data[today][userId]) data[today][userId] = { name: userName || 'Ẩn danh', count: 0, products: [] };
  const u = data[today][userId];
  u.count++;
  if (userName) u.name = userName;
  if (productCode && !u.products.includes(productCode)) u.products.push(productCode);
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 31);
  const cutStr = cutoff.toISOString().slice(0, 10);
  for (const d of Object.keys(data)) { if (d < cutStr) delete data[d]; }
  saveUsage(data);
  console.log(`[USAGE] ${userName || userId}: +1 lượt, total=${u.count}, SP=${productCode || '-'}`);
}

function getTopToday() {
  const today = todayStr();
  const data = loadUsage();
  const dayMap = data[today];
  if (!dayMap || !Object.keys(dayMap).length) return null;
  const arr = Object.values(dayMap).sort((a, b) => b.count - a.count);
  const totalQueries = arr.reduce((s, u) => s + u.count, 0);
  const allProducts = new Set();
  arr.forEach((u) => (u.products || []).forEach((p) => allProducts.add(p)));
  return { arr, totalQueries, totalUsers: arr.length, totalProducts: allProducts.size, date: today };
}

function getTopMonth(monthNum) {
  const today = todayStr();
  let monthPrefix;
  if (monthNum) {
    const year = today.slice(0, 4);
    monthPrefix = `${year}-${String(monthNum).padStart(2, '0')}`;
  } else {
    monthPrefix = today.slice(0, 7);
  }
  const data = loadUsage();
  const merged = {};
  let totalDays = 0;
  for (const [date, dayMap] of Object.entries(data)) {
    if (!date.startsWith(monthPrefix)) continue;
    totalDays++;
    for (const [userId, u] of Object.entries(dayMap)) {
      if (!merged[userId]) merged[userId] = { name: u.name, count: 0, products: new Set() };
      merged[userId].count += u.count;
      if (u.name) merged[userId].name = u.name;
      (u.products || []).forEach((p) => merged[userId].products.add(p));
    }
  }
  if (!Object.keys(merged).length) return null;
  const arr = Object.values(merged).map((u) => ({ ...u, products: [...u.products] })).sort((a, b) => b.count - a.count);
  const totalQueries = arr.reduce((s, u) => s + u.count, 0);
  const allProducts = new Set();
  arr.forEach((u) => u.products.forEach((p) => allProducts.add(p)));
  return { arr, totalQueries, totalUsers: arr.length, totalProducts: allProducts.size, month: monthPrefix, totalDays };
}

// --- LỆNH SLASH ---
const HELP_TEXT = `📋 CÁC LỆNH CỦA BÉ THÙY TỒN KHO:

/help — Xem danh sách lệnh này
/top — Xem ai tra tồn nhiều nhất hôm nay 🏆
/topthang — Tổng kết tra tồn tháng này 📅
/topthang 8 — Xem tháng 8 (hoặc số tháng khác)
/tonkho — Tóm tắt data tồn kho đang dùng

💡 Hoặc gõ trực tiếp Mã SP2 / SKU / barcode / tên hàng để tra tồn.
VD: 4901326030848`;

async function handleCommand(cmd, senderId) {
  const c = cmd.toLowerCase().replace(/^\//, '').trim();

  if (c === 'help') return HELP_TEXT;

  if (c === 'top') {
    const stats = getTopToday();
    if (!stats) return '📊 Hôm nay chưa ai tra tồn cả — bot đang rảnh 😴';
    let out = `🏆 TOP TRA TỒN HÔM NAY (${stats.date}):\n\n`;
    const medals = ['🥇', '🥈', '🥉'];
    stats.arr.slice(0, 10).forEach((u, i) => {
      const medal = medals[i] || `${i + 1}.`;
      const shortName = u.name.split(/\s*-\s*/)[0].trim() || u.name;
      out += `${medal} ${shortName} — ${u.count} lượt (${(u.products || []).length} mã SP)\n`;
    });
    out += `\n📈 Tổng: ${stats.totalQueries} lượt tra · ${stats.totalUsers} người · ${stats.totalProducts} mã SP`;
    return out;
  }

  if (c.startsWith('topthang')) {
    const mMatch = c.match(/topthang\s+(\d{1,2})/);
    const monthNum = mMatch ? parseInt(mMatch[1]) : null;
    if (monthNum && (monthNum < 1 || monthNum > 12)) return '❌ Tháng phải từ 1-12. VD: /topthang 8';
    const stats = getTopMonth(monthNum);
    if (!stats) return monthNum ? `📊 Tháng ${monthNum} chưa có dữ liệu tra tồn.` : '📊 Tháng này chưa có dữ liệu tra tồn.';
    let out = `📅 TOP TRA TỒN THÁNG ${stats.month} (${stats.totalDays} ngày có data):\n\n`;
    const medals = ['🥇', '🥈', '🥉'];
    stats.arr.slice(0, 15).forEach((u, i) => {
      const medal = medals[i] || `${i + 1}.`;
      const shortName = u.name.split(/\s*-\s*/)[0].trim() || u.name;
      out += `${medal} ${shortName} — ${u.count} lượt (${(u.products || []).length} mã SP)\n`;
    });
    out += `\n📈 Tổng tháng: ${stats.totalQueries} lượt tra · ${stats.totalUsers} người · ${stats.totalProducts} mã SP`;
    return out;
  }

  if (c === 'tonkho') {
    await inv.ensureLoaded(cfg);
    const d = inv.date();
    const cnt = inv.count();
    return `📦 DATA TỒN KHO ĐANG DÙNG:\n• Ngày: ${d}\n• Tổng mã hàng: ${cnt.toLocaleString('vi-VN')}\n• Nguồn: Lark Wiki → tab "TỒN THỰC TẾ"`;
  }

  return null;
}

// --- POOL CÂU ĐÙA KHI BỊ TRÊU ---
const FUN_POOL = [
  '[TÊN] ơi, bot đang cắm mặt tra tồn kho cho cả nhà, chị trêu bot là bot tủi thân đấy 🥲',
  'Ơ [TÊN] lại ghé chơi với bot à, bot có mỗi 1 việc là tra tồn thôi, thương bot nha 😅',
  '[TÊN] chọc bot hoài, bot không biết đùa, chỉ biết tra SKU thôi huhu 🥹',
  'Dạ [TÊN] ơi, bot tìm mỏi mắt mà không ra mã này luôn á, hay là mã ở... trong tim chị 😂',
  '[TÊN] cho bot xin 1 mã SP thật đi mà, bot buồn muốn khóc rồi nè 😭',
  'Bot xin phép nghỉ giải lao 5s vì [TÊN] trêu dữ quá 🤖💦, mã SP2/SKU đâu ạ?',
  '[TÊN] ơi bot không phải đối thủ đàm thoại của chị đâu, bot chỉ giỏi tra tồn kho thôi 🙏',
  'Nghe [TÊN] hỏi mà bot lú luôn, cho bot xin lại mã SP2 hoặc SKU chuẩn với ạ 🌀',
];

const missTracker = new Map();

function getMissState(userId) {
  const today = todayStr();
  let st = missTracker.get(userId);
  if (!st || st.date !== today) {
    st = { count: 0, usedIdxs: new Set(), date: today };
    missTracker.set(userId, st);
  }
  return st;
}

function pickFunResponse(userId, displayName) {
  const st = getMissState(userId);
  const name = displayName.split(/\s*-\s*/)[0].trim() || displayName || 'bạn';
  let available = [];
  for (let i = 0; i < FUN_POOL.length; i++) {
    if (!st.usedIdxs.has(i)) available.push(i);
  }
  if (!available.length) { st.usedIdxs.clear(); available = FUN_POOL.map((_, i) => i); }
  const idx = available[Math.floor(Math.random() * available.length)];
  st.usedIdxs.add(idx);
  return FUN_POOL[idx].replace(/\[TÊN\]/g, name);
}

const SERIOUS_KW = /khiếu nại|sự cố|hỏng|lỗi hệ thống|gấp|khẩn|bức xúc|phàn nàn|than phiền|quy trình|chính sách|ca làm|lương|thưởng|kỷ luật|hợp đồng|nghỉ việc/i;
const NEGATIVE_KW = /tức|bực|chán|ghét|ngu|dở|tệ|đm|vcl|vl|wtf|fuck/i;
function isSerious(text) { return SERIOUS_KW.test(text) || NEGATIVE_KW.test(text); }

const MGR_KW = /\bASM\b|\bGĐ\b|\bGĐVH\b|\bBGĐ\b|Giám đốc|Phó Giám đốc|Trưởng phòng/i;
function isManagement(displayName) { return MGR_KW.test(displayName); }

// --- XỬ LÝ TRA TỒN ---
async function handle(rawText) {
  const clean = stripMentions(rawText || '');
  if (!clean) return { found: true, text: 'Chào 👋 Gõ /help để xem lệnh, hoặc gõ Mã SP2 / SKU / barcode để tra tồn. VD: 4901326030848' };

  await inv.ensureLoaded(cfg);

  let query = clean, store = '';
  // Tách nhanh: "barcode tên_kho" — chỉ khi phần đầu là số (barcode) hoặc code ngắn toàn số+chữ ≤8 ký tự
  const directMatch = clean.match(/^(\d{6,18})\s+(.+)$/);
  if (directMatch) {
    query = directMatch[1];
    store = directMatch[2].trim();
  } else if (!/^[\w.\-]{3,24}$/.test(clean)) {
    try { const p = await groq.parse(cfg, clean); query = p.product; store = p.store; }
    catch (e) { console.error('Groq lỗi, tra thẳng:', e.message); }
  }

  const r = inv.lookup(query);
  if (!r) return { found: false, text: `❓ Không thấy "${query}" trong tồn ngày ${inv.date()}. Thử Mã SP2 / SKU / barcode chính xác.`, cleanText: clean };

  const e = r.entry;
  let out = `📦 ${e.tenSP}\n`;
  out += `Mã SP2: ${e.maSP2}  |  SKU: ${e.sku}\n`;
  out += `Ngành: ${e.nganh}  |  Giá: ${fmtVND(e.gia)}đ\n`;
  if (e.ttkd) out += `Trạng thái KD: ${e.ttkd}\n`;
  out += `🔢 TỒN HỆ THỐNG (Total ngày ${inv.date()}): ${e.total}`;

  if (store) {
    const s = e.stores.find((x) => x.name.toLowerCase().includes(store.toLowerCase()) || x.code.toLowerCase().includes(store.toLowerCase()));
    out += s ? `\n➡️ ${s.code} - ${s.name}: ${s.qty}` : `\n➡️ ${store}: 0`;
  } else if (e.stores.length) {
    const all = e.stores.slice().sort((a, b) => b.qty - a.qty);
    out += `\n\nCòn hàng tại (${all.length} kho):\n` + all.map((s) => `• ${s.code} - ${s.name}: ${s.qty}`).join('\n');
  } else {
    out += '\n(Tất cả kho = 0)';
  }
  if (r.more && r.more.length) out += `\n\nCòn khớp khác: ${r.more.join(' | ')} → gõ Mã SP2 cho chính xác.`;
  return { found: true, text: out, productCode: e.maSP2 };
}

const BOT_OPEN_ID = 'ou_2e50481222d7dd6c6a37a9946451d8b6';

const seen = new Set();
const SEEN_TTL = 5 * 60 * 1000;
function isDuplicate(id) {
  if (seen.has(id)) return true;
  seen.add(id);
  setTimeout(() => seen.delete(id), SEEN_TTL);
  return false;
}

const dispatcher = new lark.EventDispatcher({}).register({
  'im.message.receive_v1': async (data) => {
    try {
      touchAlive();
      const msg = data.message;
      if (isDuplicate(msg.message_id)) return;
      if (msg.message_type !== 'text') return;
      const isDM = msg.chat_type === 'p2p';
      const tagged = (msg.mentions || []).some((m) => (m.id && m.id.open_id === BOT_OPEN_ID) || m.name === 'Bé Thùy' || m.name === 'Bé Thùy tồn kho');
      if (!isDM && !tagged) return;

      const text = JSON.parse(msg.content).text || '';
      const clean = stripMentions(text);
      const senderId = (data.sender && data.sender.sender_id && data.sender.sender_id.open_id) || null;
      const senderName = senderId ? await getUserName(cfg, senderId) : '';

      // Xử lý lệnh slash
      if (/^\/\w+/.test(clean)) {
        const cmdReply = await handleCommand(clean, senderId);
        if (cmdReply) {
          await sendText(cfg, msg.chat_id, cmdReply);
          console.log(`[LỆNH] ${clean} từ ${senderName || senderId}`);
          return;
        }
      }

      const result = await handle(text);

      // Track MỌI lượt hỏi bot (tìm thấy hay không)
      if (senderId) trackUsage(senderId, senderName, result.productCode || null);

      if (result.found) {
        if (senderId) getMissState(senderId).count = 0;
        await sendText(cfg, msg.chat_id, result.text);
      } else {
        const st = senderId ? getMissState(senderId) : { count: 0 };
        st.count++;

        if (st.count >= 2 && !isSerious(result.cleanText || '')) {
          if (!isManagement(senderName)) {
            const funReply = pickFunResponse(senderId, senderName);
            await sendText(cfg, msg.chat_id, funReply);
            console.log(`[ĐÙA] miss #${st.count} cho ${senderName || senderId}`);
          } else {
            await sendText(cfg, msg.chat_id, result.text);
          }
        } else {
          await sendText(cfg, msg.chat_id, result.text);
        }
      }
      console.log(`[TRẢ LỜI] chat_type=${msg.chat_type}, tagged=${tagged}`);
    } catch (e) {
      console.error('Lỗi xử lý tin:', e);
    }
  },
});

wsClient.start({ eventDispatcher: dispatcher });
touchAlive();
console.log('🤖 Bot Bé Thùy tồn kho đang chạy (long-connection).');
