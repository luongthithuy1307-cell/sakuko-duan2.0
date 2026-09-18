const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ Chưa có file .env. Copy .env.example thành .env rồi điền.');
  process.exit(1);
}

const cfg = {};
for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) cfg[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
}

cfg.LARK_DOMAIN = cfg.LARK_DOMAIN || 'https://open.larksuite.com';
cfg.GROQ_MODEL = cfg.GROQ_MODEL || 'llama-3.3-70b-versatile';

for (const k of ['LARK_APP_ID', 'LARK_APP_SECRET', 'GOOGLE_SHEET_ID']) {
  if (!cfg[k]) { console.error(`❌ Thiếu ${k} trong .env`); process.exit(1); }
}

module.exports = cfg;
