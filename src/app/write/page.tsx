"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";
import type { Editor as ToastEditorType } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { createPost } from "@/lib/supabase/post";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

// 커스텀 스타일 추가
const editorStyle = `
  .toastui-editor-defaultUI {
    background-color: #000 !important;
    border: 1px solid #222225 !important;
  }
  .toastui-editor-defaultUI-toolbar {
    background-color: #000 !important;
    border-bottom: 1px solid #222225 !important;
  }
  .toastui-editor-md-container {
    background-color: #000 !important;
    border-right: 1px solid #222225 !important;
  }
  .toastui-editor-md-container .ProseMirror {
    background-color: #000 !important;
    color: #fff !important;
  }
  .toastui-editor-md-container .ProseMirror p {
    color: #fff !important;
  }
  .toastui-editor-defaultUI button {
    border-color: #222225 !important;
  }
  .toastui-editor-defaultUI .toastui-editor-toolbar-icons {
    border-color: #222225 !important;
  }
  .toastui-editor-defaultUI .toastui-editor-toolbar-group {
    border-color: #222225 !important;
  }
  .toastui-editor-popup {
    border: 1px solid #222225 !important;
  }
  .toastui-editor-popup-body {
    border-top: 1px solid #222225 !important;
  }
  .toastui-editor-popup-body input {
    border: 1px solid #222225 !important;
  }
  .toastui-editor-popup-body button {
    border: 1px solid #222225 !important;
  }
`;

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

export default function Write() {
  const router = useRouter();
  const editorRef = useRef<ToastEditorType>(null);
  const [title, setTitle] = useState("");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
    checkAdmin();
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEditorReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const content = editorRef.current?.getInstance().getMarkdown() || "";

      if (!title.trim()) {
        throw new Error("제목을 입력해주세요.");
      }

      if (!content.trim()) {
        throw new Error("내용을 입력해주세요.");
      }

      const newPost = await createPost({
        title: title.trim(),
        content,
      });

      // 성공 시 새로 생성된 포스트의 상세 페이지로 이동
      router.push(`/post/${newPost.id}`);
    } catch (err) {
      console.error("Error creating post:", err);
      setError(
        err instanceof Error ? err.message : "글 저장 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-6">
      <style>{editorStyle}</style>
      <Link
        href="/post"
        className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-[#2a2a2f] transition-colors w-fit"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        목록으로 돌아가기
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
                initialValue=" "
                height="100%"
                initialEditType="markdown"
                useCommandShortcut={true}
                theme="dark"
                previewStyle="vertical"
                hideModeSwitch={true}
                toolbarItems={[
                  ["heading", "bold", "italic", "strike"],
                  ["hr", "quote"],
                  ["ul", "ol", "task", "indent", "outdent"],
                  ["table", "image", "link"],
                  ["code", "codeblock"],
                  ["scrollSync"],
                ]}
                onChange={() => {
                  editorRef.current?.getInstance().getMarkdown();
                }}
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
            {isSubmitting ? "저장 중..." : "글 작성하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
