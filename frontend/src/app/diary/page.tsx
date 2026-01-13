"use client";

import { usePosts } from "@/hooks/usePosts";
import PostList from "@/components/post/PostList";
import ErrorDisplay from "@/components/ErrorDisplay";
import { PostListSkeleton } from "@/components/skeleton/PostSkeleton";

export default function DiaryPage() {
  const { posts, loading, error } = usePosts("diary");

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <PostListSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <PostList
        posts={posts}
        title="일기"
        emptyMessage={{
          title: "아직 작성된 글이 없습니다",
          description: "첫 번째 일기를 작성해보세요!",
        }}
      />
    </div>
  );
}
