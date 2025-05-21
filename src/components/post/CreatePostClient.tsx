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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

export default function CreatePostClient() {
  const router = useRouter();
  const editorRef = useRef<ToastEditorType>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"dev" | "diary">("dev");
  const [isPrivate, setIsPrivate] = useState(false);
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
        category,
        is_private: isPrivate,
      });

      router.push(`/${category}/${newPost.id}`);
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
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-[#2a2a2f] transition-colors w-fit"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        뒤로가기
      </Link>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-6 h-[80vh]">
        {/* 에디터 */}
        <div className="w-full flex flex-col border border-[#222225] rounded-lg p-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-4 h-12">
              <Select
                value={category}
                onValueChange={(value: "dev" | "diary") => setCategory(value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-[180px] h-12 bg-transparent border-[#222225] text-white hover:bg-[#000] hover:text-white rounded-lg px-3">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent className="bg-[#000] border-[#222225] text-white">
                  <SelectItem
                    value="dev"
                    className="hover:bg-[#222225] focus:bg-[#222225] text-white"
                  >
                    개발
                  </SelectItem>
                  <SelectItem
                    value="diary"
                    className="hover:bg-[#222225] focus:bg-[#222225] text-white"
                  >
                    일기
                  </SelectItem>
                </SelectContent>
              </Select>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="flex-1 h-12 text-xl font-bold text-white bg-transparent focus:ring-0 focus:outline-none rounded-lg px-3 border border-[#222225]"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex items-center gap-4">
              <RadioGroup
                value={isPrivate ? "private" : "public"}
                onValueChange={(value) => setIsPrivate(value === "private")}
                className="flex items-center gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="public"
                    id="public"
                    className="border-[#222225] text-white"
                  />
                  <label htmlFor="public" className="text-sm text-white">
                    공개글
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="private"
                    id="private"
                    className="border-[#222225] text-white"
                  />
                  <label htmlFor="private" className="text-sm text-white">
                    비밀글
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>
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
