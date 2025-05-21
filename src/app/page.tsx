"use client";

import Link from "next/link";
import { Post } from "@/types/post";
import { formatDateMobile, formatDateDesktop } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getPosts } from "@/lib/supabase/post";
import Spinner from "@/components/Spinner";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold">최신 글</h1>
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-[#222225] rounded-lg">
          <p className="text-xl text-gray-400 mb-4">
            아직 작성된 글이 없습니다
          </p>
          <p className="text-sm text-gray-500">첫 번째 글을 작성해보세요!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="border-2 border-[#222225] p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href={`/post/${post.id}`}>
                <div className="flex items-center justify-between pt-2 pb-5">
                  <h2 className="text-xl font-semibold mb-2 line-clamp-1">
                    {post.title}
                  </h2>
                  <div className="text-sm mb-4">
                    <span className="hidden sm:inline">
                      {formatDateDesktop(post.created_at)}
                    </span>
                    <span className="sm:hidden">
                      {formatDateMobile(post.created_at)}
                    </span>
                  </div>
                </div>
                <p className="line-clamp-2">{post.content}</p>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
