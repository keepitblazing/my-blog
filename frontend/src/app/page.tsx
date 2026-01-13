"use client";

import { usePosts } from "@/hooks/usePosts";
import PostList from "@/components/post/PostList";
import ErrorDisplay from "@/components/ErrorDisplay";
import { PostListSkeleton } from "@/components/skeleton/PostSkeleton";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const { posts, loading, error } = usePosts("all");

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
      {/* About Me Section */}
      <div className="mb-8 p-6 bg-blog-black border border-blog-grey rounded-lg">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-20 h-20 rounded-full border-2 border-blog-grey overflow-hidden">
            <Image
              src="https://avatars.githubusercontent.com/u/103014298?s=400&u=0381c49a20226f7f21aae12fe073a7faee078a46&v=4"
              alt="박지민"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-blog-text mb-2">About Me</h2>
            <p className="text-blog-text-muted mb-3">
              프론트엔드 개발자 박지민입니다. 사용자 경험을 중시하며 깔끔한 코드를 작성하기 위해 노력합니다.
            </p>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blog-grey text-blog-text text-sm rounded-md hover:bg-blog-grey-hover transition-colors"
              >
                <FontAwesomeIcon icon={faUser} />
                포트폴리오
              </Link>
              <Link
                href="https://github.com/keepitblazing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blog-grey text-blog-text text-sm rounded-md hover:bg-blog-grey-hover transition-colors"
              >
                <FontAwesomeIcon icon={faGithub} />
                GitHub
              </Link>
              <Link
                href="mailto:keepitblazing@keepitblazing.kr"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blog-grey text-blog-text text-sm rounded-md hover:bg-blog-grey-hover transition-colors"
              >
                <FontAwesomeIcon icon={faEnvelope} />
                Email
              </Link>
            </div>
          </div>
        </div>
      </div>

      <PostList
        posts={posts}
        title="전체 글"
        emptyMessage={{
          title: "아직 작성된 글이 없습니다",
          description: "첫 번째 글을 작성해보세요!",
        }}
      />
    </div>
  );
}
