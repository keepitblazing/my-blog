import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { posts, tags, postTags, dailyVisitors, visitorLogs } from '../schema';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const postgres = require('postgres');

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

const SEED_DIR = path.join(__dirname, 'data');

function readCSV<T>(filename: string): T[] {
  const filepath = path.join(SEED_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`⚠️  ${filename} not found, skipping...`);
    return [];
  }
  const content = fs.readFileSync(filepath, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    cast: (value, context) => {
      // boolean 변환
      if (value === 'true') return true;
      if (value === 'false') return false;
      // null 변환
      if (value === '' || value === 'null' || value === 'NULL') return null;
      // 숫자 변환 (count만 - id는 uuid일 수 있음)
      if (context.column === 'count') {
        return value ? parseInt(value, 10) : null;
      }
      return value;
    },
  });
}

async function seedTags() {
  const data = readCSV<{
    id: string;
    name: string;
    slug: string;
    created_at: string;
  }>('tags.csv');

  if (data.length === 0) return;

  console.log(`📌 Seeding ${data.length} tags...`);

  for (const row of data) {
    await db
      .insert(tags)
      .values({
        id: row.id,
        name: row.name,
        slug: row.slug,
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      })
      .onConflictDoNothing();
  }

  console.log('✅ Tags seeded');
}

async function seedPosts() {
  const data = readCSV<{
    id: string;
    title: string;
    content: string;
    category: string;
    is_private: boolean;
    created_at: string;
    updated_at: string | null;
  }>('post.csv');

  if (data.length === 0) return;

  console.log(`📝 Seeding ${data.length} posts...`);

  for (const row of data) {
    await db
      .insert(posts)
      .values({
        id: row.id,
        title: row.title,
        content: row.content,
        category: row.category as 'dev' | 'diary',
        isPrivate: row.is_private,
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
        updatedAt: row.updated_at ? new Date(row.updated_at) : null,
      })
      .onConflictDoNothing();
  }

  console.log('✅ Posts seeded');
}

async function seedPostTags() {
  const data = readCSV<{
    post_id: string;
    tag_id: string;
    created_at: string;
  }>('post_tags.csv');

  if (data.length === 0) return;

  console.log(`🔗 Seeding ${data.length} post_tags...`);

  for (const row of data) {
    await db
      .insert(postTags)
      .values({
        postId: row.post_id,
        tagId: row.tag_id,
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      })
      .onConflictDoNothing();
  }

  console.log('✅ Post tags seeded');
}

async function seedDailyVisitors() {
  const data = readCSV<{
    id: number;
    date: string;
    count: number;
    created_at: string;
    updated_at: string;
  }>('daily_visitors.csv');

  if (data.length === 0) return;

  console.log(`📊 Seeding ${data.length} daily_visitors...`);

  for (const row of data) {
    await db
      .insert(dailyVisitors)
      .values({
        date: row.date,
        count: row.count,
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
        updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
      })
      .onConflictDoNothing();
  }

  console.log('✅ Daily visitors seeded');
}

async function seedVisitorLogs() {
  const data = readCSV<{
    id: number;
    visitor_hash: string;
    session_id: string;
    cookie_id: string;
    ip_address: string;
    user_agent: string;
    visited_at: string;
    page_path: string;
    is_new_visitor: boolean;
  }>('visitor_logs.csv');

  if (data.length === 0) return;

  console.log(`👥 Seeding ${data.length} visitor_logs...`);

  // 대량 데이터는 배치로 처리
  const batchSize = 100;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    await db.insert(visitorLogs).values(
      batch.map((row) => ({
        visitorHash: row.visitor_hash,
        sessionId: row.session_id,
        cookieId: row.cookie_id,
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        visitedAt: row.visited_at ? new Date(row.visited_at) : new Date(),
        pagePath: row.page_path,
        isNewVisitor: row.is_new_visitor,
      })),
    );
  }

  console.log('✅ Visitor logs seeded');
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    // 순서 중요: tags → posts → post_tags (FK 의존성)
    await seedTags();
    await seedPosts();
    await seedPostTags();
    await seedDailyVisitors();
    await seedVisitorLogs();

    console.log('\n🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
