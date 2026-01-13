const VELOG_USERNAME = 'blaze096';
const VELOG_GRAPHQL_URL = 'https://v2.velog.io/graphql';

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

    console.error(`📥 Fetched ${allPosts.length} posts...`);

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return allPosts;
}

async function main() {
  console.error('🚀 Fetching Velog posts...\n');

  const posts = await fetchVelogPosts();

  console.error(`\n✅ Total: ${posts.length} posts\n`);

  // 샘플 출력
  console.error('=== 샘플 포스트 (최신 3개) ===\n');
  posts.slice(0, 3).forEach((post, i) => {
    console.error(`[${i + 1}] ${post.title}`);
    console.error(`    날짜: ${post.created_at}`);
    console.error(`    태그: ${post.tags.join(', ')}`);
    console.error(`    본문 길이: ${post.body?.length || 0}자`);
    console.error(`    URL: https://velog.io/@blaze096/${post.url_slug}`);
    console.error('');
  });

  // JSON 파일로 저장
  const fs = await import('fs');
  fs.writeFileSync(
    'velog-posts.json',
    JSON.stringify(posts, null, 2),
    'utf-8'
  );
  console.error('📄 velog-posts.json 파일로 저장됨');
}

main();
