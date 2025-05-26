"use client";

import { usePosts } from "@/hooks/usePosts";
import PostList from "@/components/post/PostList";
import ErrorDisplay from "@/components/ErrorDisplay";
import Spinner from "@/components/Spinner";

export default function Home() {
  const { posts, loading, error } = usePosts("all");

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <PostList
      posts={posts}
      title="전체 글"
      emptyMessage={{
        title: "아직 작성된 글이 없습니다",
        description: "첫 번째 글을 작성해보세요!",
      }}
    />
  );
}
