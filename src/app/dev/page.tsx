"use client";

import { usePosts } from "@/hooks/usePosts";
import PostList from "@/components/post/PostList";
import ErrorDisplay from "@/components/ErrorDisplay";
import Spinner from "@/components/Spinner";

export default function DevPage() {
  const { posts, loading, error } = usePosts("dev");

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <PostList
      posts={posts}
      title="개발"
      category="dev"
      emptyMessage={{
        title: "아직 작성된 글이 없습니다",
        description: "첫 번째 개발 글을 작성해보세요!",
      }}
    />
  );
}
