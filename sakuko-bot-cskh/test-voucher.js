const cfg = require('./config');
const voucher = require('./voucher');

async function test() {
  console.log('Đang tải data từ Google Sheet...');
  const data = await voucher.loadAll(cfg);
  console.log(`\nTổng: ${data.length} voucher\n`);

  if (data.length > 0) {
    const sample = data[0];
    console.log('Mẫu đầu tiên:', JSON.stringify(sample, null, 2));
    console.log(`\nThử tra SĐT "${sample.phone}":`);
    const result = await voucher.lookup(cfg, sample.phone);
    console.log(result);
  }
}

test().catch(e => console.error(e));
