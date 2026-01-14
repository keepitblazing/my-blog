"use client";

import Link from "next/link";
import { PostWithTags } from "@/types/post";
import { formatDateMobile, formatDateDesktop } from "@/lib/utils";
import { Lock, ArrowRight } from "lucide-react";

interface PostListProps {
  posts: PostWithTags[];
  title: string;
  emptyMessage: {
    title: string;
    description: string;
  };
}

// 본문에서 텍스트만 추출 (HTML 태그 제거)
function extractText(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
}

// 큰 카드 컴포넌트
function LargePostCard({
  post,
  position,
  animationDelay,
}: {
  post: PostWithTags;
  position: "left" | "right";
  animationDelay: number;
}) {
  return (
    <Link
      href={`/${post.category}/${post.id}`}
      className={`bento-item md:col-span-2 lg:col-span-2 row-span-2 ${
        position === "right" ? "lg:col-start-2" : ""
      }`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <article className="bento-card featured-card relative h-full min-h-[300px] p-8 rounded-2xl border border-blog-grey overflow-hidden group">
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs font-medium bg-blog-grey rounded-full text-blog-text">
                {post.category === "dev" ? "개발" : "일상"}
              </span>
              {post.is_private && (
                <Lock className="w-4 h-4 text-blog-text-muted" />
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-blog-white mb-4 group-hover:text-white transition-colors line-clamp-2">
              {post.title}
            </h2>
            <p className="text-blog-text-muted line-clamp-3 text-base leading-relaxed">
              {extractText(post.content)}
            </p>
          </div>

          <div className="mt-6">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 text-xs bg-blog-grey/50 rounded-md text-blog-text-muted"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-blog-text-muted">
                <span className="hidden sm:inline">
                  {formatDateDesktop(post.created_at)}
                </span>
                <span className="sm:hidden">
                  {formatDateMobile(post.created_at)}
                </span>
              </span>
              <span className="flex items-center gap-2 text-sm text-blog-text group-hover:text-white transition-colors">
                읽기{" "}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>

        {/* 배경 그라데이션 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blog-grey/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </article>
    </Link>
  );
}

// 작은 카드 컴포넌트
function SmallPostCard({
  post,
  animationDelay,
}: {
  post: PostWithTags;
  animationDelay: number;
}) {
  return (
    <Link
      href={`/${post.category}/${post.id}`}
      className="bento-item"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <article className="bento-card relative h-full min-h-[180px] p-6 rounded-2xl border border-blog-grey bg-blog-black overflow-hidden group">
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 text-xs font-medium bg-blog-grey/50 rounded text-blog-text-muted">
                {post.category === "dev" ? "개발" : "일상"}
              </span>
              {post.is_private && (
                <Lock className="w-3 h-3 text-blog-text-muted" />
              )}
            </div>
            <h2 className="text-lg font-semibold text-blog-text mb-2 group-hover:text-white transition-colors line-clamp-2">
              {post.title}
            </h2>
            <p className="text-sm text-blog-text-muted line-clamp-2">
              {extractText(post.content)}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-blog-text-faint">
              {formatDateMobile(post.created_at)}
            </span>
            <ArrowRight className="w-3 h-3 text-blog-text-muted group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function PostList({
  posts,
  title,
  emptyMessage,
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-blog-text">{title}</h1>
        <div className="flex flex-col items-center justify-center py-16 border border-blog-grey rounded-2xl bg-blog-grey/20">
          <p className="text-xl text-blog-text mb-2">{emptyMessage.title}</p>
          <p className="text-sm text-blog-text-muted">
            {emptyMessage.description}
          </p>
        </div>
      </div>
    );
  }

  // 큰 카드 인덱스 계산 (0, 5, 10, 15...)
  // 0: 왼쪽, 5: 오른쪽, 10: 왼쪽, 15: 오른쪽...
  const getLargeCardIndices = (totalPosts: number) => {
    const indices: number[] = [0]; // 첫 번째는 항상 큰 카드
    // 6개 이상일 때부터 추가 큰 카드
    for (let i = 5; i < totalPosts; i += 5) {
      indices.push(i);
    }
    return indices;
  };

  const largeCardIndices = getLargeCardIndices(posts.length);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blog-text">{title}</h1>
        <span className="text-sm text-blog-text-muted">
          {posts.length}개의 글
        </span>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post, index) => {
          const isLargeCard = largeCardIndices.includes(index);
          const largeCardOrder = largeCardIndices.indexOf(index);
          // 짝수 번째 큰 카드는 왼쪽, 홀수 번째는 오른쪽
          const position = largeCardOrder % 2 === 0 ? "left" : "right";

          if (isLargeCard) {
            return (
              <LargePostCard
                key={post.id}
                post={post}
                position={position}
                animationDelay={index * 50}
              />
            );
          }

          return (
            <SmallPostCard
              key={post.id}
              post={post}
              animationDelay={index * 50}
            />
          );
        })}
      </div>
    </div>
  );
}
