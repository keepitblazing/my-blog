"use client";

import Link from "next/link";
import { Post } from "@/types/post";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import supabase from "@/app/lib/supabaseClient";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("post")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        return;
      }
      setPosts(data || []);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  console.log(posts);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">최신 글</h1>
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
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                </div>
                <div className="text-sm mb-4">
                  {formatDate(post.createdAt)} • {post.author}
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
