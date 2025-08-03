import supabase from "@/lib/supabase/supabaseClient";
import { Post, PostWithTags } from "@/types/post";
import {
  PostWithTagsRelation,
  PostTagRelation,
  PostWithInnerTags,
} from "@/types/supabase";
import { updatePostTags } from "./tags";

export async function getPosts(): Promise<PostWithTags[]> {
  try {
    // 먼저 태그 테이블 존재 여부 확인
    const { data: tagsCheck } = await supabase
      .from("tags")
      .select("id")
      .limit(1);

    // 태그 테이블이 있으면 태그 포함해서 가져오기
    if (tagsCheck !== null) {
      const { data, error } = await supabase
        .from("post")
        .select(
          `
          *,
          post_tags (
            tags (*)
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts with tags:", error);
        // 에러 발생 시 태그 없이 가져오기
        return getPostsWithoutTags();
      }

      // Transform the data to include tags array
      const postsWithRelations = data as PostWithTagsRelation[];
      return (postsWithRelations || []).map((post) => ({
        ...post,
        tags:
          post.post_tags
            ?.map((pt: PostTagRelation) => pt.tags)
            .filter(Boolean) || [],
      })) as PostWithTags[];
    }
  } catch (error) {
    console.error(error);
    console.log("Tags table not found, fetching posts without tags");
  }

  // 태그 테이블이 없거나 에러 발생 시 태그 없이 가져오기
  return getPostsWithoutTags();
}

async function getPostsWithoutTags(): Promise<PostWithTags[]> {
  const { data, error } = await supabase
    .from("post")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }

  // 태그 없이 반환
  return (data || []).map((post) => ({
    ...post,
    tags: [],
  })) as PostWithTags[];
}

export async function getPostById(id: string): Promise<PostWithTags | null> {
  try {
    // 먼저 태그 테이블 존재 여부 확인
    const { data: tagsCheck } = await supabase
      .from("tags")
      .select("id")
      .limit(1);

    // 태그 테이블이 있으면 태그 포함해서 가져오기
    if (tagsCheck !== null) {
      const { data, error } = await supabase
        .from("post")
        .select(
          `
          *,
          post_tags (
            tags (*)
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching post with tags:", error);
        // 에러 발생 시 태그 없이 가져오기
        return getPostByIdWithoutTags(id);
      }

      // Transform the data to include tags array
      const postWithRelations = data as PostWithTagsRelation;
      return {
        ...postWithRelations,
        tags:
          postWithRelations.post_tags
            ?.map((pt: PostTagRelation) => pt.tags)
            .filter(Boolean) || [],
      } as PostWithTags;
    }
  } catch (error) {
    console.error(error);
    console.log("Tags table not found, fetching post without tags");
  }

  // 태그 테이블이 없거나 에러 발생 시 태그 없이 가져오기
  return getPostByIdWithoutTags(id);
}

async function getPostByIdWithoutTags(
  id: string
): Promise<PostWithTags | null> {
  const { data, error } = await supabase
    .from("post")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }

  return {
    ...data,
    tags: [],
  } as PostWithTags;
}

export async function createPost(
  post: Omit<Post, "id" | "created_at">,
  tagIds: string[] = []
): Promise<PostWithTags> {
  // Create the post first
  const { data, error } = await supabase
    .from("post")
    .insert([post])
    .select()
    .single();

  if (error) {
    console.error("Error creating post:", error);
    throw error;
  }

  // Add tags if provided
  if (tagIds.length > 0 && data) {
    await updatePostTags(data.id, tagIds);
  }

  // Fetch the complete post with tags
  const createdPost = await getPostById(data.id);
  if (!createdPost) {
    throw new Error("Failed to fetch created post");
  }

  return createdPost;
}

export async function updatePost(
  id: string,
  post: Partial<Post>,
  tagIds?: string[]
): Promise<PostWithTags> {
  // Update the post
  const { error } = await supabase
    .from("post")
    .update(post)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating post:", error);
    throw error;
  }

  // Update tags if provided
  if (tagIds !== undefined) {
    await updatePostTags(id, tagIds);
  }

  // Fetch the complete post with tags
  const updatedPost = await getPostById(id);
  if (!updatedPost) {
    throw new Error("Failed to fetch updated post");
  }

  return updatedPost;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("post").delete().eq("id", id);

  if (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

// 태그로 포스트 필터링
export async function getPostsByTag(tagSlug: string): Promise<PostWithTags[]> {
  const { data, error } = await supabase
    .from("post")
    .select(
      `
      *,
      post_tags!inner (
        tags!inner (*)
      )
    `
    )
    .eq("post_tags.tags.slug", tagSlug)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts by tag:", error);
    return [];
  }

  // Transform the data to include tags array
  const postsWithRelations = data as PostWithInnerTags[];
  return (postsWithRelations || []).map((post) => ({
    ...post,
    tags:
      post.post_tags?.map((pt: PostTagRelation) => pt.tags).filter(Boolean) ||
      [],
  })) as PostWithTags[];
}

// 카테고리와 태그로 포스트 필터링
export async function getPostsByCategoryAndTags(
  category?: "dev" | "diary",
  tagSlugs?: string[]
): Promise<PostWithTags[]> {
  let query = supabase.from("post").select(`
      *,
      post_tags (
        tags (*)
      )
    `);

  if (category) {
    query = query.eq("category", category);
  }

  if (tagSlugs && tagSlugs.length > 0) {
    // 모든 태그를 가진 포스트만 필터링
    query = query.contains("post_tags.tags.slug", tagSlugs);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  // Transform the data to include tags array
  const postsWithRelations = data as PostWithTagsRelation[];
  return (postsWithRelations || []).map((post) => ({
    ...post,
    tags:
      post.post_tags?.map((pt: PostTagRelation) => pt.tags).filter(Boolean) ||
      [],
  })) as PostWithTags[];
}
