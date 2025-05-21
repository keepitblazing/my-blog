"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Post } from "@/types/post";
import { formatDateMobile, formatDateDesktop } from "@/lib/utils";
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

interface PostDetailClientProps {
  id: string;
  category: "dev" | "diary";
}

export default function PostDetailClient({
  id,
  category,
}: PostDetailClientProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
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

    if (id) {
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [id]);

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
          뒤로가기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto w-full px-4 py-4 sm:py-8">
        <div className="mb-4">
          <Link
            href={`/${category}`}
            className="inline-flex items-center justify-start gap-2 px-2 sm:px-4 py-2 text-white rounded-lg hover:bg-[#2a2a2f] transition-colors"
            title="뒤로가기"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
            <span className="hidden sm:inline">뒤로가기</span>
          </Link>
        </div>

        <article className="border-2 border-[#222225] p-4 sm:p-6 md:p-8 rounded-lg h-full">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100 line-clamp-1">
              {post.title}
            </h1>
            {isAdmin && (
              <div className="flex gap-2">
                <Link
                  href={`/post/${post.id}/edit`}
                  className="inline-flex items-center justify-center sm:justify-start gap-2 px-2 sm:px-4 py-1 text-sm sm:text-base text-white bg-[#222225] rounded-lg hover:bg-[#2a2a2f] transition-colors min-w-[2.5rem] sm:min-w-0"
                  title="수정"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  <span className="hidden sm:inline">수정</span>
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`inline-flex items-center justify-center sm:justify-start gap-2 px-2 sm:px-4 text-sm sm:text-base text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors min-w-[2.5rem] sm:min-w-0 ${
                    isDeleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  title="삭제"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span className="hidden sm:inline">
                    {isDeleting ? "삭제 중..." : "삭제"}
                  </span>
                </button>
              </div>
            )}
          </div>
          <div className="text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8 border-b border-[#222225] pb-3 sm:pb-4 text-right">
            <span className="hidden sm:inline">
              {formatDateDesktop(post.created_at)}
            </span>
            <span className="sm:hidden">
              {formatDateMobile(post.created_at)}
            </span>
          </div>
          <div className="markdown-body prose prose-invert max-w-none text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed prose-headings:text-xl sm:prose-headings:text-2xl md:prose-headings:text-3xl prose-p:text-sm sm:prose-p:text-base md:prose-p:text-lg prose-li:text-sm sm:prose-li:text-base md:prose-li:text-lg prose-code:text-xs sm:prose-code:text-sm md:prose-code:text-base">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={components}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}
