"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDateMobile, formatDateDesktop } from "@/lib/utils";
import { getPostById, deletePost, Post } from "@/lib/api";
import TagBadge from "@/components/tags/TagBadge";
import MobileBackButton from "@/components/MobileBackButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import PostDetailSkeleton from "@/components/skeleton/PostDetailSkeleton";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { Viewer } from "@toast-ui/react-editor";

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
    return <PostDetailSkeleton />;
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
      <div className="max-w-7xl mx-auto w-full p-[7px]">
        <MobileBackButton href={`/${category}`} label="목록으로" />
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
          <div className="prose prose-invert max-w-none text-gray-200">
            <Viewer initialValue={post.content} />
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#222225]">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <TagBadge key={tag.id} tag={tag} size="md" />
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
