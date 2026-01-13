import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { posts, tags, postTags } from '../schema';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const postgres = require('postgres');

const VELOG_USERNAME = 'blaze096';
const VELOG_GRAPHQL_URL = 'https://v2.velog.io/graphql';
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'velog');

interface VelogPost {
  id: string;
  title: string;
  short_description: string;
  body: string;
  created_at: string;
  updated_at: string;
  url_slug: string;
  tags: string[];
}

// 이미지 URL 추출 (마크다운)
function extractImageUrls(markdown: string): string[] {
  const regex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g;
  const urls: string[] = [];
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    urls.push(match[1]);
  }
  // img 태그도 체크
  const imgRegex = /<img[^>]+src=['"]([^'"]+)['"]/g;
  while ((match = imgRegex.exec(markdown)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

// 이미지 다운로드
async function downloadImage(url: string, filename: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`  ❌ Failed to download: ${url}`);
      return null;
    }

    const buffer = await response.arrayBuffer();
    const filepath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filepath, Buffer.from(buffer));

    return `/uploads/velog/${filename}`;
  } catch (error) {
    console.error(`  ❌ Error downloading ${url}:`, error);
    return null;
  }
}

// 본문의 이미지 URL 교체
async function processImages(body: string, postId: string): Promise<string> {
  const imageUrls = extractImageUrls(body);
  let processedBody = body;

  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i];
    const ext = url.split('.').pop()?.split('?')[0] || 'png';
    const filename = `${postId}-${i + 1}.${ext}`;

    const newPath = await downloadImage(url, filename);
    if (newPath) {
      processedBody = processedBody.replace(url, newPath);
    }
  }

  return processedBody;
}

async function fetchVelogPosts(): Promise<VelogPost[]> {
  const allPosts: VelogPost[] = [];
  let cursor: string | null = null;

  while (true) {
    const query = `
      query Posts($username: String!, $cursor: ID) {
        posts(username: $username, cursor: $cursor) {
          id
          title
          short_description
          body
          created_at
          updated_at
          url_slug
          tags
        }
      }
    `;

    const response: Response = await fetch(VELOG_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { username: VELOG_USERNAME, cursor },
      }),
    });

    const data: { data?: { posts?: VelogPost[] } } = await response.json();
    const fetchedPosts: VelogPost[] = data.data?.posts || [];

    if (fetchedPosts.length === 0) break;

    allPosts.push(...fetchedPosts);
    cursor = fetchedPosts[fetchedPosts.length - 1].id;

    console.log(`📥 Fetched ${allPosts.length} posts...`);
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return allPosts;
}

async function main() {
  console.log('🚀 Starting Velog migration with images...\n');

  // uploads 디렉토리 생성
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client);

  try {
    // 1. Fetch all posts
    console.log('📡 Fetching posts from Velog...');
    const velogPosts = await fetchVelogPosts();
    console.log(`\n✅ Total posts: ${velogPosts.length}\n`);

    // 2. Create tags
    const allTags = new Set<string>();
    velogPosts.forEach(post => post.tags.forEach(tag => allTags.add(tag)));

    console.log(`📌 Creating ${allTags.size} tags...`);
    const tagMap = new Map<string, string>();

    for (const tagName of allTags) {
      const tagId = uuidv4();
      const slug = tagName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9가-힣-]/g, '');

      await db.insert(tags).values({
        id: tagId,
        name: tagName,
        slug: slug || tagId.slice(0, 8),
        createdAt: new Date(),
      }).onConflictDoNothing();

      tagMap.set(tagName, tagId);
    }
    console.log('✅ Tags created\n');

    // 3. Insert posts with images
    console.log(`📝 Processing ${velogPosts.length} posts with images...\n`);

    for (let i = 0; i < velogPosts.length; i++) {
      const velogPost = velogPosts[i];
      const postId = uuidv4();

      console.log(`[${i + 1}/${velogPosts.length}] ${velogPost.title}`);

      // 이미지 다운로드 및 URL 교체
      const processedBody = await processImages(velogPost.body || '', postId);

      // 카테고리 결정 (TIL, 회고, 일상 → diary, 나머지 → dev)
      const tagLower = velogPost.tags.map(t => t.toLowerCase());
      const isDiary = tagLower.some(t =>
        t.includes('til') ||
        t.includes('회고') ||
        t.includes('일상') ||
        t.includes('항해')
      );
      const category = isDiary ? 'diary' : 'dev';

      // Insert post
      await db.insert(posts).values({
        id: postId,
        title: velogPost.title,
        content: processedBody,
        category,
        isPrivate: false,
        createdAt: new Date(velogPost.created_at),
        updatedAt: velogPost.updated_at ? new Date(velogPost.updated_at) : null,
      }).onConflictDoNothing();

      // Insert post-tag relations
      for (const tagName of velogPost.tags) {
        const tagId = tagMap.get(tagName);
        if (tagId) {
          await db.insert(postTags).values({
            postId,
            tagId,
            createdAt: new Date(),
          }).onConflictDoNothing();
        }
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n🎉 Velog migration completed!');
    console.log(`📁 Images saved to: ${UPLOADS_DIR}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
