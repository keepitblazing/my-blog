import { useState, useEffect } from "react";
import { PostWithTags } from "@/types/post";
import { getPosts } from "@/lib/supabase/post";

type Category = "all" | "dev" | "diary";

export function usePosts(category: Category = "all", tagSlugs?: string[]) {
  const [posts, setPosts] = useState<PostWithTags[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/check-admin");
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("Admin check error:", error);
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        let filteredPosts = data;

        // 관리자가 아닌 경우 비밀글 제외
        if (!isAdmin) {
          filteredPosts = data.filter((post) => !post.is_private);
        }

        // 카테고리 필터링
        if (category !== "all") {
          filteredPosts = filteredPosts.filter(
            (post) => post.category === category
          );
        }

        setPosts(filteredPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch posts")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category, isAdmin, tagSlugs?.join(",")]); // tagSlugs as comma-separated string for dependency

  return { posts, loading, error };
}
