const lark = require('@larksuiteoapi/node-sdk');
const fs = require('fs');
const path = require('path');
const cfg = require('./config');
const voucher = require('./voucher');
const groq = require('./groq');
const { sendText, sendCard, getToken, getUserName } = require('./lark');

const wsClient = new lark.WSClient({
  appId: cfg.LARK_APP_ID,
  appSecret: cfg.LARK_APP_SECRET,
  domain: lark.Domain.Lark,
});

const stripMentions = (s) => s.replace(/@_user_\d+/g, '').replace(/@\S+/g, '').trim();

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
const USAGE_FILE = path.join(__dirname, 'usage.json');

function todayStr() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
}

function loadUsage() {
  try { return JSON.parse(fs.readFileSync(USAGE_FILE, 'utf8')); }
  catch { return {}; }
}

function saveUsage(data) {
  try { fs.writeFileSync(USAGE_FILE, JSON.stringify(data), 'utf8'); }
  catch (e) { console.error('[USAGE] lưu lỗi:', e.message); }
}

function trackUsage(userId, userName, phone) {
  const today = todayStr();
  const data = loadUsage();
  if (!data[today]) data[today] = {};
  if (!data[today][userId]) data[today][userId] = { name: userName || 'Ẩn danh', count: 0, phones: [] };
  const u = data[today][userId];
  u.count++;
  if (userName) u.name = userName;
  if (phone && !u.phones.includes(phone)) u.phones.push(phone);
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 31);
  const cutStr = cutoff.toISOString().slice(0, 10);
  for (const d of Object.keys(data)) { if (d < cutStr) delete data[d]; }
  saveUsage(data);
  console.log(`[USAGE] ${userName || userId}: +1 lượt, total=${u.count}, SĐT=${phone || '-'}`);
}

function getTopToday() {
  const today = todayStr();
  const data = loadUsage();
  const dayMap = data[today];
  if (!dayMap || !Object.keys(dayMap).length) return null;
  const arr = Object.values(dayMap).sort((a, b) => b.count - a.count);
  const totalQueries = arr.reduce((s, u) => s + u.count, 0);
  const allPhones = new Set();
  arr.forEach((u) => (u.phones || []).forEach((p) => allPhones.add(p)));
  return { arr, totalQueries, totalUsers: arr.length, totalPhones: allPhones.size, date: today };
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
      if (!merged[userId]) merged[userId] = { name: u.name, count: 0, phones: new Set() };
      merged[userId].count += u.count;
      if (u.name) merged[userId].name = u.name;
      (u.phones || []).forEach((p) => merged[userId].phones.add(p));
    }
  }
  if (!Object.keys(merged).length) return null;
  const arr = Object.values(merged).map((u) => ({ ...u, phones: [...u.phones] })).sort((a, b) => b.count - a.count);
  const totalQueries = arr.reduce((s, u) => s + u.count, 0);
  const allPhones = new Set();
  arr.forEach((u) => u.phones.forEach((p) => allPhones.add(p)));
  return { arr, totalQueries, totalUsers: arr.length, totalPhones: allPhones.size, month: monthPrefix, totalDays };
}

// --- LỆNH SLASH ---
const HELP_TEXT = `📋 MENU LỆNH BÉ DUYÊN CSKH:

/help — Xem menu lệnh
/top — Ai tra voucher nhiều nhất hôm nay 🏆
/topthang — Tổng kết tra voucher tháng này 📅
/topthang 8 — Xem tháng 8 (hoặc số tháng khác)
/down rank + SĐT — Down rank
/up rank + SĐT — Up rank
/nuôi dưỡng + SĐT — Nuôi dưỡng
/bam + SĐT — Bám đuổi đơn thứ 1
/sn + SĐT — Sinh nhật
/vqsp + SĐT — Vòng quay sử dụng SP
/all + SĐT — Tìm tất cả chiến dịch

VD: /sn 0988888098 → chỉ tìm trong Sinh nhật
VD: 0988888098 → tìm tất cả (mặc định)`;

function handleSlash(cmd) {
  const c = cmd.toLowerCase().replace(/^\//, '').trim();

  if (c === 'help' || c === 'menu') return HELP_TEXT;

  if (c === 'top') {
    const stats = getTopToday();
    if (!stats) return '📊 Hôm nay chưa ai tra voucher cả — bot đang rảnh 😴';
    let out = `🏆 TOP TRA VOUCHER HÔM NAY (${stats.date}):\n\n`;
    const medals = ['🥇', '🥈', '🥉'];
    stats.arr.slice(0, 10).forEach((u, i) => {
      const medal = medals[i] || `${i + 1}.`;
      const shortName = u.name.split(/\s*-\s*/)[0].trim() || u.name;
      out += `${medal} ${shortName} — ${u.count} lượt (${(u.phones || []).length} KH)\n`;
    });
    out += `\n📈 Tổng: ${stats.totalQueries} lượt tra · ${stats.totalUsers} người · ${stats.totalPhones} KH`;
    return out;
  }

  if (c.startsWith('topthang')) {
    const mMatch = c.match(/topthang\s+(\d{1,2})/);
    const monthNum = mMatch ? parseInt(mMatch[1]) : null;
    if (monthNum && (monthNum < 1 || monthNum > 12)) return '❌ Tháng phải từ 1-12. VD: /topthang 8';
    const stats = getTopMonth(monthNum);
    if (!stats) return monthNum ? `📊 Tháng ${monthNum} chưa có dữ liệu tra voucher.` : '📊 Tháng này chưa có dữ liệu tra voucher.';
    let out = `📅 TOP TRA VOUCHER THÁNG ${stats.month} (${stats.totalDays} ngày có data):\n\n`;
    const medals = ['🥇', '🥈', '🥉'];
    stats.arr.slice(0, 15).forEach((u, i) => {
      const medal = medals[i] || `${i + 1}.`;
      const shortName = u.name.split(/\s*-\s*/)[0].trim() || u.name;
      out += `${medal} ${shortName} — ${u.count} lượt (${(u.phones || []).length} KH)\n`;
    });
    out += `\n📈 Tổng tháng: ${stats.totalQueries} lượt tra · ${stats.totalUsers} người · ${stats.totalPhones} KH`;
    return out;
  }

  return null;
}

// --- POOL CÂU ĐÙA KHI BỊ TRÊU ---
const FUN_POOL = [
  '[TÊN] ơi, Duyên đang bận tìm voucher cho khách nè, đừng trêu Duyên mà 🥲',
  'Ơ [TÊN] lại ghé chơi à, Duyên chỉ biết tra voucher thôi, cho Duyên xin SĐT khách đi 😅',
  '[TÊN] chọc Duyên hoài, Duyên buồn muốn khóc luôn á, SĐT đâu ạ? 🥹',
  'Dạ [TÊN] ơi, Duyên tìm mỏi mắt mà không ra SĐT nào luôn á, hay là SĐT... trong tim chị 😂',
  '[TÊN] cho Duyên xin 1 SĐT thật đi mà, Duyên buồn rồi nè 😭',
  'Duyên xin phép nghỉ giải lao 5s vì [TÊN] trêu dữ quá 💜💦 SĐT khách đâu ạ?',
  '[TÊN] ơi Duyên không phải đối thủ đàm thoại của chị đâu, Duyên chỉ giỏi tra voucher thôi 🙏',
  'Nghe [TÊN] hỏi mà Duyên lú luôn, cho Duyên xin lại SĐT khách 10 số với ạ 🌀',
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
  for (let i = 0; i < FUN_POOL.length; i++) { if (!st.usedIdxs.has(i)) available.push(i); }
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

// --- CHỐNG TIN TRÙNG ---
let BOT_OPEN_ID = '';

const seen = new Set();
const SEEN_TTL = 5 * 60 * 1000;
function isDuplicate(id) {
  if (seen.has(id)) return true;
  seen.add(id);
  setTimeout(() => seen.delete(id), SEEN_TTL);
  return false;
}

function extractPhone(text) {
  const m = text.match(/0\d{9}/);
  return m ? m[0] : null;
}

// --- DISPATCHER ---
const dispatcher = new lark.EventDispatcher({}).register({
  'im.message.receive_v1': async (data) => {
    try {
      touchAlive();
      const msg = data.message;
      console.log(`[EVENT] message_id=${msg.message_id}, type=${msg.message_type}, chat_type=${msg.chat_type}`);
      if (isDuplicate(msg.message_id)) return;
      if (msg.message_type !== 'text') return;

      const isDM = msg.chat_type === 'p2p';
      const tagged = (msg.mentions || []).some((m) =>
        (m.id && m.id.open_id === BOT_OPEN_ID) || (m.name || '').includes('Bé Duyên'));
      if (!isDM && !tagged) return;

      const rawText = JSON.parse(msg.content).text || '';
      const clean = stripMentions(rawText);
      const senderId = (data.sender && data.sender.sender_id && data.sender.sender_id.open_id) || null;
      const senderName = senderId ? await getUserName(cfg, senderId) : '';

      // Xử lý lệnh slash đơn (không kèm SĐT)
      if (/^\/(help|menu|top|topthang(\s+\d{1,2})?)$/i.test(clean.trim())) {
        const reply = handleSlash(clean.trim());
        if (reply) {
          await sendText(cfg, msg.chat_id, reply);
          console.log(`[LỆNH] ${clean.trim()} từ ${senderName || senderId}`);
          return;
        }
      }

      // Help khi tag bot mà không gõ gì
      if (!clean) {
        await sendText(cfg, msg.chat_id, HELP_TEXT);
        return;
      }

      // Track mọi lượt hỏi
      if (senderId) trackUsage(senderId, senderName, null);

      // Parse câu lệnh chiến dịch
      const parsed = voucher.parseCommand(clean);
      const sheetFilter = parsed.sheet;
      const textForPhone = parsed.text;

      // Trích SĐT
      let phone = extractPhone(textForPhone);
      if (!phone) {
        const digits = textForPhone.replace(/\s/g, '');
        if (/^0\d{9}$/.test(digits)) phone = digits;
      }
      if (!phone) {
        try {
          const p = await groq.parse(cfg, textForPhone);
          if (p.phone) phone = extractPhone(p.phone) || p.phone;
        } catch (e) { console.error('Groq lỗi:', e.message); }
      }
      if (!phone) {
        // Không tìm thấy SĐT — xử lý miss/fun
        const st = senderId ? getMissState(senderId) : { count: 0 };
        st.count++;
        if (st.count >= 2 && !isSerious(clean) && !isManagement(senderName)) {
          const funReply = pickFunResponse(senderId, senderName);
          await sendText(cfg, msg.chat_id, funReply);
          console.log(`[ĐÙA] miss #${st.count} cho ${senderName || senderId}`);
        } else {
          await sendText(cfg, msg.chat_id, '❓ Không nhận được SĐT. Vui lòng gửi SĐT 10 số (VD: 0988888098).');
        }
        return;
      }

      // Cập nhật usage với SĐT cụ thể
      if (senderId) {
        const today = todayStr();
        const data = loadUsage();
        if (data[today] && data[today][senderId]) {
          const u = data[today][senderId];
          if (phone && !u.phones.includes(phone)) u.phones.push(phone);
          saveUsage(data);
        }
      }

      const match = await voucher.lookup(cfg, phone, sheetFilter);
      if (!match || !match.voucherId) {
        const scope = sheetFilter ? `chiến dịch ${sheetFilter}` : 'các chiến dịch hiện tại';
        await sendText(cfg, msg.chat_id, `❌ SĐT ${phone} không có voucher ưu đãi trong ${scope}.`);
        if (senderId) getMissState(senderId).count = 0;
      } else {
        const card = voucher.buildCard(match, senderName);
        await sendCard(cfg, msg.chat_id, card);
        if (senderId) getMissState(senderId).count = 0;
      }
      console.log(`[TRẢ LỜI] chat_type=${msg.chat_type}, tagged=${tagged}, sender=${senderName}`);
    } catch (e) {
      console.error('Lỗi xử lý tin:', e);
    }
  },
});

voucher.loadAll(cfg).then(() => {
  wsClient.start({ eventDispatcher: dispatcher });
  touchAlive();
  console.log('🎁 Bot Bé Duyên CSKH đang chạy (long-connection).');
}).catch(e => {
  console.error('Lỗi khởi động:', e);
  process.exit(1);
});
