import supabase from "@/app/lib/supabaseClient";
import { Post } from "@/types/post";

export async function getPosts() {
  const { data, error } = await supabase
    .from("post")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }

  return data as Post[];
}

export async function getPostById(id: string) {
  const { data, error } = await supabase
    .from("post")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching post:", error);
    throw error;
  }

  return data as Post;
}

export async function createPost(post: Omit<Post, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("post")
    .insert([post])
    .select()
    .single();

  if (error) {
    console.error("Error creating post:", error);
    throw error;
  }

  return data as Post;
}

export async function updatePost(id: string, post: Partial<Post>) {
  const { data, error } = await supabase
    .from("post")
    .update(post)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating post:", error);
    throw error;
  }

  return data as Post;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("post").delete().eq("id", id);

  if (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}
