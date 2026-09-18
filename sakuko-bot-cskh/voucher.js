// Tra cứu voucher CSKH từ Google Sheet — số lấy thẳng từ sheet, không qua LLM.

const SHEETS = [
  'UC CSKH dự báo down rank',
  'UC CSKH dự báo up rank',
  'UC CSKH Nuoi Duong',
  'UC Bám đuổi đơn thứ 1',
  'UC SN HN',
  'UC Vòng quay sử dụng SP',
];

const CMD_MAP = {
  '/all': null,
  '/down rank': 'UC CSKH dự báo down rank',
  '/downrank': 'UC CSKH dự báo down rank',
  '/up rank': 'UC CSKH dự báo up rank',
  '/uprank': 'UC CSKH dự báo up rank',
  '/nuôi dưỡng': 'UC CSKH Nuoi Duong',
  '/nuoi': 'UC CSKH Nuoi Duong',
  '/bam': 'UC Bám đuổi đơn thứ 1',
  '/sn': 'UC SN HN',
  '/vqsp': 'UC Vòng quay sử dụng SP',
};

function parseCommand(text) {
  const lower = text.toLowerCase();
  const sorted = Object.entries(CMD_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [cmd, sheet] of sorted) {
    if (lower.includes(cmd)) {
      const cleaned = text.replace(new RegExp(cmd.replace(/[\/\s]/g, (m) => '\\' + m), 'gi'), '').trim();
      return { sheet, text: cleaned };
    }
  }
  return { sheet: null, text };
}

const PHONE_HEADERS = ['phoneno', 'phone', 'sdt', 'số điện thoại', 'sđt', 'phone_number', 'điện thoại', 'phone no'];
const VOUCHER_HEADERS = ['voucherid', 'voucher_id', 'mã voucher', 'ma voucher', 'voucher', 'voucher id'];
const VALUE_HEADERS = ['mệnh giá voucher', 'menh gia voucher', 'mệnh giá', 'menh gia'];
const CONDITION_HEADERS = ['điều kiện áp dụng voucher', 'dieu kien ap dung voucher', 'điều kiện áp dụng', 'dieu kien ap dung'];
const NAME_HEADERS = ['name', 'tên', 'ten', 'tên khách hàng', 'ten khach hang', 'họ tên', 'ho ten'];
const STORE_HEADERS = ['store name', 'storename', 'tên cửa hàng', 'cửa hàng', 'store', 'store_name'];
const STATUS_HEADERS = ['trạng thái', 'trang thai', 'status'];
const EXPIRY_HEADERS = ['hạn sử dụng', 'han su dung', 'hsd', 'expiry', 'ngày hết hạn'];

let cache = { data: null, ts: 0 };
const CACHE_MS = 10 * 60 * 1000;

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') { current += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { current += c; }
    } else {
      if (c === '"') { inQuotes = true; }
      else if (c === ',') { result.push(current.trim()); current = ''; }
      else { current += c; }
    }
  }
  result.push(current.trim());
  return result;
}

function findCol(headers, candidates) {
  const idx = headers.findIndex(h => candidates.includes(h.toLowerCase().trim()));
  return idx >= 0 ? idx : -1;
}

function normalizePhone(raw) {
  const digits = String(raw).replace(/[^0-9]/g, '');
  if (digits.length === 10 && digits.startsWith('0')) return digits;
  if (digits.length === 11 && digits.startsWith('84')) return '0' + digits.slice(2);
  if (digits.length === 12 && digits.startsWith('840')) return '0' + digits.slice(3);
  return digits;
}

function fmtDot(n) {
  const num = Number(n) || 0;
  return num.toLocaleString('de-DE');
}

function isPhoneLike(v) { return /^0\d{9}$/.test(String(v).replace(/[^0-9]/g, '')); }
function isVoucherLike(v) {
  const s = String(v).trim();
  return /^[A-Z0-9]{10,}$/i.test(s) && /[A-Z]/i.test(s);
}
function isValueLike(v) {
  const n = Number(String(v).replace(/[^0-9]/g, ''));
  return n >= 10000 && n <= 500000 && n % 1000 === 0;
}
function isConditionLike(v) {
  const n = Number(String(v).replace(/[^0-9]/g, ''));
  return n >= 100000 && n <= 5000000 && n % 10000 === 0;
}

function detectColFromData(rows, testFn, maxScan) {
  const n = Math.min(maxScan, rows.length);
  const colCount = rows[0] ? rows[0].length : 0;
  let bestCol = -1, bestScore = 0;
  for (let c = 0; c < colCount; c++) {
    let hits = 0;
    for (let r = 0; r < n; r++) {
      if (testFn(rows[r][c])) hits++;
    }
    if (hits > bestScore) { bestScore = hits; bestCol = c; }
  }
  return bestScore >= n * 0.5 ? bestCol : -1;
}

async function fetchSheet(sheetId, sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Lỗi tải sheet "${sheetName}": ${res.status}`);
  const text = await res.text();
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);
  const dataRows = [];
  for (let i = 1; i < lines.length; i++) dataRows.push(parseCsvLine(lines[i]));

  // Detect phone column thực tế từ data
  const realPhoneCol = detectColFromData(dataRows, isPhoneLike, 50);
  const headerPhoneCol = findCol(headers, PHONE_HEADERS);

  let iPhone = realPhoneCol >= 0 ? realPhoneCol : findCol(headers, PHONE_HEADERS);
  let iVoucher = detectColFromData(dataRows, isVoucherLike, 50);
  if (iVoucher < 0) {
    const hv = findCol(headers, VOUCHER_HEADERS);
    if (hv >= 0) iVoucher = hv;
  }

  // Detect value/condition từ data pattern
  let iValue = findCol(headers, VALUE_HEADERS);
  let iCondition = findCol(headers, CONDITION_HEADERS);
  if (iValue < 0) iValue = detectColFromData(dataRows, isValueLike, 50);
  if (iCondition < 0) {
    const cond = detectColFromData(dataRows, isConditionLike, 50);
    if (cond >= 0 && cond !== iValue) iCondition = cond;
  }

  let iName = findCol(headers, NAME_HEADERS);
  let iStore = findCol(headers, STORE_HEADERS);
  let iStatus = findCol(headers, STATUS_HEADERS);
  let iExpiry = findCol(headers, EXPIRY_HEADERS);

  // Nếu header có offset so với data → dùng data detection cho name/store
  if (realPhoneCol >= 0 && headerPhoneCol >= 0 && realPhoneCol !== headerPhoneCol) {
    const offset = realPhoneCol - headerPhoneCol;
    console.log(`[voucher] Sheet "${sheetName}": header lệch ${offset} cột`);
    if (iName >= 0) iName = iName + offset;
    if (iStore >= 0) iStore = iStore + offset;
    if (iStatus >= 0) iStatus = iStatus + offset;
    if (iExpiry >= 0) iExpiry = iExpiry + offset;
    if (iValue >= 0 && !isValueLike(dataRows[0]?.[iValue])) iValue = iValue + offset;
    if (iCondition >= 0 && !isConditionLike(dataRows[0]?.[iCondition])) iCondition = iCondition + offset;
  }

  // Fallback: name thường ở cột trước phone
  if (iName < 0 && iPhone > 0) {
    const guess = iPhone - 1;
    const sample = (dataRows[0]?.[guess] || '').trim();
    if (sample && !/^\d+$/.test(sample) && !isPhoneLike(sample)) iName = guess;
  }

  if (iPhone < 0 || iVoucher < 0) {
    console.log(`[voucher] Sheet "${sheetName}": không tìm thấy cột SĐT(${iPhone}) hoặc VoucherID(${iVoucher}) → bỏ qua`);
    return [];
  }
  if (iVoucher === iPhone) {
    iVoucher = detectColFromData(dataRows, isVoucherLike, 50);
  }

  console.log(`[voucher] Sheet "${sheetName}": phone=col${iPhone}, voucher=col${iVoucher}`);

  const rows = [];
  for (const cols of dataRows) {
    // Tìm phone trong cột cố định, nếu không có thì scan tất cả cột
    let phone = normalizePhone(cols[iPhone] || '');
    let rowOffset = 0;
    if (!phone) {
      for (let c = 0; c < cols.length; c++) {
        if (isPhoneLike(cols[c])) {
          phone = normalizePhone(cols[c]);
          rowOffset = c - iPhone;
          break;
        }
      }
    }
    if (!phone) continue;

    const getCol = (idx) => idx >= 0 ? (cols[idx + rowOffset] || '').trim() : '';
    const voucherId = getCol(iVoucher);
    if (!voucherId) continue;

    rows.push({
      phone,
      voucherId,
      name: getCol(iName),
      value: getCol(iValue),
      condition: getCol(iCondition),
      store: getCol(iStore),
      status: getCol(iStatus),
      expiry: getCol(iExpiry),
      campaign: sheetName,
    });
  }
  console.log(`[voucher] Sheet "${sheetName}": ${rows.length} voucher`);
  return rows;
}

async function loadAll(cfg) {
  if (cache.data && Date.now() - cache.ts < CACHE_MS) return cache.data;

  console.log('[voucher] Đang tải data từ Google Sheet...');
  const all = [];
  for (const name of SHEETS) {
    try {
      const rows = await fetchSheet(cfg.GOOGLE_SHEET_ID, name);
      all.push(...rows);
    } catch (e) {
      console.error(`[voucher] Lỗi tải "${name}":`, e.message);
    }
  }
  cache = { data: all, ts: Date.now() };
  console.log(`[voucher] Tổng: ${all.length} voucher từ ${SHEETS.length} chiến dịch`);
  return all;
}

function nowVN() {
  const d = new Date();
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const p = fmt.formatToParts(d);
  const g = (t) => p.find(x => x.type === t).value;
  return `${g('year')}/${g('month')}/${g('day')} ${g('hour')}:${g('minute')}`;
}

async function lookup(cfg, phoneInput, sheetFilter) {
  const data = await loadAll(cfg);
  const phone = normalizePhone(phoneInput);
  if (!phone) return null;

  const pool = sheetFilter ? data.filter(r => r.campaign === sheetFilter) : data;
  const match = pool.find(r => r.phone === phone);
  if (!match) return { phone, campaign: sheetFilter || null };
  return match;
}

function buildCard(match, senderName) {
  const now = nowVN();
  const who = senderName || 'Nhân viên';
  const name = match.name || '(không có tên)';

  const isSN = (match.campaign || '').includes('SN');
  const valueDisplay = match.value ? fmtDot(match.value) : (isSN ? '50.000' : '—');
  const details = [];
  let n = 1;
  details.push(`**${n++}. Mệnh giá:**  ${valueDisplay} VNĐ`);
  if (match.condition) {
    details.push(`**${n++}. Điều kiện áp dụng cho hóa đơn từ:**  ${fmtDot(match.condition)} VNĐ`);
  } else if (isSN) {
    details.push(`**${n++}. Điều kiện:**  Tặng miễn phí (không kèm điều kiện hóa đơn)`);
  } else {
    details.push(`**${n++}. Điều kiện áp dụng cho hóa đơn từ:**  —`);
  }
  if (match.expiry) details.push(`**${n++}. Hạn sử dụng:**  ${match.expiry}`);
  details.push(`**${n}. Mã voucher:**  ${match.voucherId}`);

  return {
    header: {
      template: 'purple',
      title: { content: `[${match.campaign}] MÃ VOUCHER CỦA KHÁCH: ${name} - ${match.phone}`, tag: 'plain_text' },
    },
    elements: [
      { tag: 'div', text: { content: `Xin chào Anh/Chị **${who}**,\n\nHôm nay (ngày ${now}), Anh/Chị đã yêu cầu lấy mã Voucher trong chiến dịch **${match.campaign}** của khách **${name}** - SĐT **${match.phone}** :`, tag: 'lark_md' } },
      { tag: 'hr' },
      { tag: 'div', text: { content: details.join('\n'), tag: 'lark_md' } },
      { tag: 'hr' },
      { tag: 'note', elements: [{ tag: 'plain_text', content: 'From BÉ DUYÊN CSKH 💜' }] },
    ],
  };
}

module.exports = { lookup, loadAll, buildCard, parseCommand, CMD_MAP, fmtDot, nowVN };
