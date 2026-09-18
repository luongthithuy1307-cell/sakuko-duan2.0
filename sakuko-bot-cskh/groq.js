const SYS_PROMPT = 'Bóc tách yêu cầu tra voucher khách hàng. Trả JSON duy nhất: {"phone":"<số điện thoại 10 chữ số>"}. Nếu không tìm thấy SĐT trong câu, trả {"phone":""}';

const qCache = new Map();
const CACHE_TTL = 30 * 60 * 1000;
const CACHE_MAX = 200;

async function parse(cfg, text) {
  const key = text.trim().toLowerCase();
  const hit = qCache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.val;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + cfg.GROQ_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: cfg.GROQ_MODEL,
      temperature: 0,
      max_tokens: 80,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: SYS_PROMPT }, { role: 'user', content: text }],
    }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error('Groq lỗi: ' + JSON.stringify(j));
  let val;
  try {
    const o = JSON.parse(j.choices[0].message.content);
    val = { phone: (o.phone || '').trim() };
  } catch {
    val = { phone: '' };
  }
  if (qCache.size >= CACHE_MAX) qCache.delete(qCache.keys().next().value);
  qCache.set(key, { val, ts: Date.now() });
  return val;
}

module.exports = { parse };
