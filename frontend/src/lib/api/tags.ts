import { api } from './client';
import { Tag, TagWithCount } from '@/types/tag';

export async function getTags(): Promise<Tag[]> {
  return api.get<Tag[]>('/tags');
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  try {
    return await api.get<Tag>(`/tags/slug/${slug}`);
  } catch {
    return null;
  }
}

export async function searchTags(query: string): Promise<Tag[]> {
  if (!query.trim()) return [];
  return api.get<Tag[]>(`/tags/search?q=${encodeURIComponent(query)}`);
}

export async function getTagsWithCount(): Promise<TagWithCount[]> {
  return api.get<TagWithCount[]>('/tags/with-count');
}

// slug 자동 생성 헬퍼
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function createTag(name: string): Promise<Tag | null> {
  try {
    const slug = generateSlug(name);
    return await api.post<Tag>('/tags', { name, slug });
  } catch (error) {
    console.error('Error creating tag:', error);
    return null;
  }
}

export async function deleteTag(id: string): Promise<void> {
  await api.delete(`/tags/${id}`);
}
