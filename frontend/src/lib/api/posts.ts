import { api } from './client';
import { Tag } from '@/types/tag';

// API 응답 타입 (camelCase)
export interface ApiPost {
  id: string;
  title: string;
  content: string;
  category: 'dev' | 'diary';
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string | null;
  tags: Tag[];
}

// 프론트엔드용 타입 (snake_case) - 기존 코드 호환
export interface Post {
  id: string;
  title: string;
  content: string;
  category: 'dev' | 'diary';
  is_private: boolean;
  created_at: string;
  updated_at?: string;
  tags: Tag[];
}

// API 응답을 프론트엔드 타입으로 변환
function toPost(apiPost: ApiPost): Post {
  return {
    id: apiPost.id,
    title: apiPost.title,
    content: apiPost.content,
    category: apiPost.category,
    is_private: apiPost.isPrivate,
    created_at: apiPost.createdAt,
    updated_at: apiPost.updatedAt || undefined,
    tags: apiPost.tags || [],
  };
}

export async function getPosts(): Promise<Post[]> {
  const posts = await api.get<ApiPost[]>('/posts');
  return posts.map(toPost);
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const post = await api.get<ApiPost>(`/posts/${id}`);
    return toPost(post);
  } catch {
    return null;
  }
}

export async function getPostsByCategory(category: 'dev' | 'diary'): Promise<Post[]> {
  const posts = await api.get<ApiPost[]>(`/posts?category=${category}`);
  return posts.map(toPost);
}

export async function getPostsByTag(tagSlug: string): Promise<Post[]> {
  const posts = await api.get<ApiPost[]>(`/posts/tag/${tagSlug}`);
  return posts.map(toPost);
}

export async function createPost(
  post: { title: string; content: string; category: 'dev' | 'diary'; isPrivate?: boolean },
  tagIds: string[] = []
): Promise<Post> {
  const created = await api.post<ApiPost>('/posts', { ...post, tagIds });
  return toPost(created);
}

export async function updatePost(
  id: string,
  post: Partial<{ title: string; content: string; category: 'dev' | 'diary'; isPrivate: boolean }>,
  tagIds?: string[]
): Promise<Post> {
  const updated = await api.put<ApiPost>(`/posts/${id}`, { ...post, tagIds });
  return toPost(updated);
}

export async function deletePost(id: string): Promise<void> {
  await api.delete(`/posts/${id}`);
}
