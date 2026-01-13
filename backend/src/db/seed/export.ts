import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const postgres = require('postgres');

// Supabase 연결 (환경변수 SUPABASE_URL 사용)
const supabaseUrl = process.env.SUPABASE_URL;
if (!supabaseUrl) {
  console.error('❌ SUPABASE_URL 환경변수를 설정해주세요');
  process.exit(1);
}

const client = postgres(supabaseUrl);

const OUTPUT_DIR = path.join(__dirname, 'data');

function toCSV(data: Record<string, any>[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        // Date 객체 처리
        if (val instanceof Date) {
          return val.toISOString();
        }
        if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return String(val);
      })
      .join(','),
  );

  return [headers.join(','), ...rows].join('\n');
}

async function exportTable(name: string, query: string) {
  console.log(`📦 Exporting ${name}...`);

  const result = await client.unsafe(query);
  const csv = toCSV(result as Record<string, any>[]);

  fs.writeFileSync(path.join(OUTPUT_DIR, `${name}.csv`), csv);
  console.log(`   ✅ ${result.length} rows exported`);
}

async function main() {
  console.log('🔄 Exporting data from Supabase...\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    await exportTable('tags', 'SELECT * FROM public.tags ORDER BY created_at');
    await exportTable('post', 'SELECT * FROM public.post ORDER BY created_at');
    await exportTable('post_tags', 'SELECT * FROM public.post_tags ORDER BY created_at');
    await exportTable('daily_visitors', 'SELECT * FROM public.daily_visitors ORDER BY id');
    await exportTable('visitor_logs', 'SELECT * FROM public.visitor_logs ORDER BY id');

    console.log('\n🎉 Export completed!');
    console.log(`📁 Files saved to: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
