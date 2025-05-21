"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Post } from "@/types/post";
import { formatDate } from "@/lib/utils";
import { getPostById, deletePost } from "@/lib/supabase/post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";
import Spinner from "@/components/Spinner";

const components: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";

    if (language) {
      return (
        <div className="relative">
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: "0.5rem",
              padding: "1rem",
            }}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    }

    return (
      <code className="bg-[#1a1a1d] px-1.5 py-0.5 rounded text-sm" {...props}>
        {children}
      </code>
    );
  },
  // 링크 스타일
  a: ({ ...props }) => (
    <a className="text-blue-400 hover:underline" {...props} />
  ),
  // 인용구 스타일
  blockquote: ({ ...props }) => (
    <blockquote className="border-l-4 border-gray-600 pl-4 italic" {...props} />
  ),
  // 테이블 스타일
  table: ({ ...props }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700" {...props} />
    </div>
  ),
  th: ({ ...props }) => (
    <th className="px-4 py-2 bg-[#1a1a1d] text-left" {...props} />
  ),
  td: ({ ...props }) => (
    <td className="px-4 py-2 border-t border-gray-700" {...props} />
  ),
};

export default function PostDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

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

    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    if (!window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePost(id);
      router.push("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("글 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-6 text-gray-200">
          게시글을 찾을 수 없습니다
        </h1>
        <Link
          href="/"
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
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-[#2a2a2f] transition-colors w-fit"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        목록으로 돌아가기
      </Link>

      <article className="border-2 border-[#222225] p-8 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-100">{post.title}</h1>
          {isAdmin && (
            <div className="flex gap-2">
              <Link
                href={`/post/${post.id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-1 text-white bg-[#222225] rounded-lg hover:bg-[#2a2a2f] transition-colors"
              >
                <FontAwesomeIcon icon={faEdit} />
                수정
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`inline-flex items-center gap-2 px-4 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FontAwesomeIcon icon={faTrash} />
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-400 mb-8 border-b border-[#222225] pb-4 text-right">
          {formatDate(post.created_at)}
        </div>
        <div className="markdown-body prose prose-invert max-w-none text-gray-200 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={components}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
