"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Post } from "@/types/post";
import { formatDate } from "@/lib/utils";
import supabase from "@/app/lib/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function PostDetail() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("post")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setPost(data);
      setLoading(false);
    };

    fetchPost();
  }, [params.id]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-6 text-gray-200">
          게시글을 찾을 수 없습니다
        </h1>
        <Link
          href="/post"
          className="inline-flex items-center gap-2 px-4 py-2 text-white bg-[#222225] rounded-lg hover:bg-[#2a2a2f] transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <Link
        href="/post"
        className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-[#2a2a2f] transition-colors w-fit"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        목록으로 돌아가기
      </Link>

      <article className="border-2 border-[#222225] p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-4 text-gray-100">{post.title}</h1>
        <div className="text-sm text-gray-400 mb-8 border-b border-[#222225] pb-4 text-right">
          {formatDate(post.createdAt)}
        </div>
        <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed">
          {post.content}
        </div>
      </article>
    </div>
  );
}
