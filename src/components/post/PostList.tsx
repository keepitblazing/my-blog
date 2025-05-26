"use client";

import Link from "next/link";
import { Post } from "@/types/post";
import { formatDateMobile, formatDateDesktop } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";
const PostContentViewer = dynamic(() => import("./PostContentViewer"), {
  ssr: false,
});

interface PostListProps {
  posts: Post[];
  title: string;
  emptyMessage: {
    title: string;
    description: string;
  };
}

export default function PostList({
  posts,
  title,
  emptyMessage,
}: PostListProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold">{title}</h1>
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-[#222225] rounded-lg">
          <p className="text-xl text-gray-400 mb-4">{emptyMessage.title}</p>
          <p className="text-sm text-gray-500">{emptyMessage.description}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="border-2 border-[#222225] p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow
      max-h-[150px] overflow-hidden"
            >
              <Link href={`/${post.category}/${post.id}`}>
                <div className="flex items-center justify-between pt-2 pb-5">
                  <div className="flex items-center gap-2">
                    {post.is_private && (
                      <FontAwesomeIcon
                        icon={faLock}
                        className="text-gray-400 text-sm"
                        title="비밀글"
                      />
                    )}
                    <h2 className="text-xl font-semibold line-clamp-1">
                      {post.title}
                    </h2>
                  </div>
                  <div className="text-sm mb-4">
                    <span className="hidden sm:inline">
                      {formatDateDesktop(post.created_at)}
                    </span>
                    <span className="sm:hidden">
                      {formatDateMobile(post.created_at)}
                    </span>
                  </div>
                </div>
                <PostContentViewer content={post.content} />
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
