// Helper gọi Lark Open API (token tự refresh) + gửi tin nhắn
let tokenCache = { token: null, exp: 0 };

async function getToken(cfg) {
  if (tokenCache.token && Date.now() < tokenCache.exp) return tokenCache.token;
  const res = await fetch(cfg.LARK_DOMAIN + '/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ app_id: cfg.LARK_APP_ID, app_secret: cfg.LARK_APP_SECRET }),
  });
  const j = await res.json();
  if (j.code !== 0) throw new Error(`Lấy token Lark lỗi: ${j.code} ${j.msg}`);
  tokenCache = { token: j.tenant_access_token, exp: Date.now() + (j.expire - 120) * 1000 };
  return tokenCache.token;
}

async function api(cfg, method, path, { params, body } = {}) {
  const token = await getToken(cfg);
  let url = cfg.LARK_DOMAIN + path;
  if (params) url += '?' + new URLSearchParams(params).toString();
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json; charset=utf-8', Authorization: 'Bearer ' + token },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await res.json();
  if (j.code !== 0) throw new Error(`Lark ${path} lỗi: code=${j.code} ${j.msg}`);
  return j.data;
}

// Đọc 1 vùng ô của sheet. render: ToString | UnformattedValue | FormattedValue | Formula
async function readRange(cfg, spreadsheetToken, range, render = 'ToString') {
  const data = await api(cfg, 'GET',
    `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values/${encodeURIComponent(range)}`,
    { params: { valueRenderOption: render } });
  return (data.valueRange && data.valueRange.values) || [];
}

// Gửi tin nhắn text vào 1 chat
async function sendText(cfg, chatId, text) {
  return api(cfg, 'POST', '/open-apis/im/v1/messages', {
    params: { receive_id_type: 'chat_id' },
    body: { receive_id: chatId, msg_type: 'text', content: JSON.stringify({ text }) },
  });
}

const nameCache = {};
async function getUserName(cfg, openId) {
  if (nameCache[openId]) return nameCache[openId];
  try {
    const d = await api(cfg, 'GET', `/open-apis/contact/v3/users/${openId}`, { params: { user_id_type: 'open_id' } });
    const name = (d.user && d.user.name) || '';
    if (name) nameCache[openId] = name;
    return name;
  } catch { return ''; }
}

module.exports = { getToken, api, readRange, sendText, getUserName };
