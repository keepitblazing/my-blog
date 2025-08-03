import supabase from "@/lib/supabase/supabaseClient";
import { Tag, TagWithCount } from "@/types/tag";

// 모든 태그 가져오기
export async function getAllTags(): Promise<Tag[]> {
  const { data, error } = await supabase.from("tags").select("*").order("name");

  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }

  return data || [];
}

// 태그별 포스트 개수와 함께 가져오기
export async function getTagsWithCount(): Promise<TagWithCount[]> {
  const { data, error } = await supabase
    .from("tags")
    .select(
      `
      *,
      post_tags(count)
    `
    )
    .order("name");

  if (error) {
    console.error("Error fetching tags with count:", error);
    return [];
  }

  return (data || []).map((tag) => ({
    ...tag,
    count: tag.post_tags?.[0]?.count || 0,
  }));
}

// slug로 태그 가져오기
export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching tag by slug:", error);
    return null;
  }

  return data;
}

// 태그 생성
export async function createTag(name: string): Promise<Tag | null> {
  // slug 생성 (한글 지원)
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();

  const { data, error } = await supabase
    .from("tags")
    .insert({ name, slug })
    .select()
    .single();

  if (error) {
    console.error("Error creating tag:", error);
    return null;
  }

  return data;
}

// 태그 삭제 (관리자용)
export async function deleteTag(id: string): Promise<boolean> {
  const { error } = await supabase.from("tags").delete().eq("id", id);

  if (error) {
    console.error("Error deleting tag:", error);
    return false;
  }

  return true;
}

// 포스트의 태그 가져오기
export async function getTagsByPost(postId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from("post_tags")
    .select(
      `
      tags (*)
    `
    )
    .eq("post_id", postId);

  if (error) {
    console.error("Error fetching tags by post:", error);
    return [];
  }

  // Supabase의 관계형 쿼리는 tags를 단일 객체로 반환
  // unknown을 거쳐서 타입 캐스팅
  const typedData = data as unknown as Array<{ tags: Tag | null }>;
  return (typedData || []).map((item) => item.tags).filter((tag): tag is Tag => tag !== null);
}

// 포스트에 태그 추가
export async function addTagsToPost(
  postId: string,
  tagIds: string[]
): Promise<boolean> {
  if (tagIds.length === 0) return true;

  const postTags = tagIds.map((tagId) => ({
    post_id: postId,
    tag_id: tagId,
  }));

  const { error } = await supabase.from("post_tags").insert(postTags);

  if (error) {
    console.error("Error adding tags to post:", error);
    return false;
  }

  return true;
}

// 포스트의 태그 전체 업데이트
export async function updatePostTags(
  postId: string,
  tagIds: string[]
): Promise<boolean> {
  // 먼저 기존 태그 모두 삭제
  const { error: deleteError } = await supabase
    .from("post_tags")
    .delete()
    .eq("post_id", postId);

  if (deleteError) {
    console.error("Error removing old tags:", deleteError);
    return false;
  }

  // 새 태그 추가
  if (tagIds.length > 0) {
    return await addTagsToPost(postId, tagIds);
  }

  return true;
}

// 태그명으로 태그 검색 (자동완성용)
export async function searchTags(query: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .ilike("name", `%${query}%`)
    .limit(10);

  if (error) {
    console.error("Error searching tags:", error);
    return [];
  }

  return data || [];
}
