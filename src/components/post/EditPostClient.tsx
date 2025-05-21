"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import type { Editor as ToastEditorType } from "@toast-ui/react-editor";
import { getPostById, updatePost } from "@/lib/supabase/post";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";

const ToastEditor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#000] text-gray-400">
        에디터 로딩중...
      </div>
    ),
  }
);

export default function EditPostClient({ id }: { id: string }) {
  const router = useRouter();
  const editorRef = useRef<ToastEditorType>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/check-admin");
        if (!response.ok) {
          throw new Error("관리자 권한 확인에 실패했습니다.");
        }
        const data = await response.json();
        if (!data.isAdmin) {
          router.push("/");
        }
      } catch (error) {
        console.error("Admin check error:", error);
        router.push("/");
      }
    };

    const fetchPost = async () => {
      try {
        const post = await getPostById(id);
        setTitle(post.title);
        setContent(post.content);
        if (editorRef.current) {
          editorRef.current.getInstance().setMarkdown(post.content);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("글을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
    fetchPost();
  }, [id, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEditorReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await updatePost(id, {
        title: title.trim(),
        content,
      });
      router.push(`/post/${id}`);
    } catch (err) {
      console.error("Error updating post:", err);
      setError("글 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-3/4 mb-4"></div>
          <div className="h-96 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-6">
      <Link
        href={`/post/${id}`}
        className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-[#2a2a2f] transition-colors w-fit"
      >
        <FontAwesomeIcon icon={faArrowLeft} />글 보기로 돌아가기
      </Link>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-6 h-[80vh]">
        {/* 에디터 */}
        <div className="w-full flex flex-col border border-[#222225] rounded-lg p-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="mb-4 text-xl font-bold text-white bg-transparent focus:ring-0 focus:outline-none rounded-lg p-2 border border-[#222225]"
            disabled={isSubmitting}
          />
          <div className="flex-1 min-h-0 overflow-hidden h-full">
            {isEditorReady && (
              <ToastEditor
                ref={editorRef}
                height="100%"
                initialEditType="markdown"
                useCommandShortcut={true}
                initialValue={content}
                theme="dark"
                previewStyle="vertical"
                hideModeSwitch={true}
                onChange={() => {
                  if (editorRef.current) {
                    const newContent = editorRef.current
                      .getInstance()
                      .getMarkdown();
                    setContent(newContent);
                  }
                }}
                toolbarItems={[
                  ["heading", "bold", "italic", "strike"],
                  ["hr", "quote"],
                  ["ul", "ol", "task", "indent", "outdent"],
                  ["table", "image", "link"],
                  ["code", "codeblock"],
                  ["scrollSync"],
                ]}
                disabled={isSubmitting}
              />
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 px-6 py-3 text-white rounded-lg transition-colors ${
              isSubmitting
                ? "bg-[#222225] cursor-not-allowed opacity-50"
                : "bg-[#222225] hover:bg-[#2a2a2f]"
            }`}
          >
            {isSubmitting ? "저장 중..." : "수정하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
