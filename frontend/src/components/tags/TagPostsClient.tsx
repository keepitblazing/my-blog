"use client";

import { useState, useEffect } from "react";
import { Post } from "@/lib/api";
import { Tag } from "@/types/tag";
import { getPostsByTag, getTagBySlug } from "@/lib/api";
import PostList from "@/components/post/PostList";
import { PostListSkeleton } from "@/components/skeleton/PostSkeleton";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import MobileBackButton from "@/components/MobileBackButton";

interface TagPostsClientProps {
  tagSlug: string;
}

export default function TagPostsClient({ tagSlug }: TagPostsClientProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);
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
    const fetchData = async () => {
      try {
        const [tagData, postsData] = await Promise.all([
          getTagBySlug(tagSlug),
          getPostsByTag(tagSlug),
        ]);

        setTag(tagData);

        // 관리자가 아닌 경우 비밀글 제외
        const filteredPosts = isAdmin
          ? postsData
          : postsData.filter((post) => !post.is_private);

        setPosts(filteredPosts);
      } catch (error) {
        console.error("Error fetching tag posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tagSlug, isAdmin]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-6">
          <div className="h-10 bg-blog-grey  rounded animate-pulse w-32"></div>
        </div>
        <PostListSkeleton />
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-6 text-gray-200">
          태그를 찾을 수 없습니다
        </h1>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-white bg-[#222225] rounded-lg hover:bg-[#2a2a2f] transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <MobileBackButton href="/tags" label="태그 목록" />

      <PostList
        posts={posts}
        title={`'${tag.name}' 태그가 포함된 글`}
        emptyMessage={{
          title: "아직 글이 없습니다",
          description: `'${tag.name}' 태그가 포함된 글이 없습니다.`,
        }}
      />
    </div>
  );
}
