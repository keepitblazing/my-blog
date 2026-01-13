"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { Editor as ToastEditorType } from "@toast-ui/react-editor";
import { getPostById, updatePost, Post } from "@/lib/api";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { Tag } from "@/types/tag";
import TagInput from "@/components/tags/TagInput";
import MobileBackButton from "@/components/MobileBackButton";
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

export default function EditPostClient({ id }: { id: string }) {
  const router = useRouter();
  const editorRef = useRef<ToastEditorType>(null);
  const [post, setPost] = useState<Post>({
    id: "",
    title: "",
    content: "",
    category: "dev",
    created_at: "",
    updated_at: "",
    is_private: false,
    tags: [],
  });
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
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
        const fetchedPost = await getPostById(id);
        if (fetchedPost) {
          setPost(fetchedPost);
          setSelectedTags(fetchedPost.tags || []);

          if (editorRef.current) {
            editorRef.current.getInstance().setMarkdown(fetchedPost.content);
          }
        } else {
          setError("글을 찾을 수 없습니다.");
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
    if (!post?.title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!post.content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await updatePost(
        id,
        {
          title: post.title.trim(),
          content: post.content.trim(),
          category: post.category,
          isPrivate: post.is_private,
        },
        selectedTags.map((tag) => tag.id)
      );
      router.push(`/${post.category}/${id}`);
    } catch (err) {
      console.error("Error updating post:", err);
      setError("글 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-blog-grey  rounded w-3/4 mb-4"></div>
          <div className="h-96 bg-blog-grey  rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-xl font-bold">글 수정</h1>
      <MobileBackButton href={`/${post?.category}/${id}`} label="글 보기로" />

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
                value={post.category}
                onValueChange={(value: "dev" | "diary") =>
                  setPost((prev) => ({
                    ...prev,
                    category: value,
                  }))
                }
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
                value={post?.title}
                onChange={(e) =>
                  setPost((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="제목을 입력하세요"
                className="flex-1 h-12 text-xl font-bold text-white bg-transparent focus:ring-0 focus:outline-none rounded-lg px-3 border border-[#222225]"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex items-center gap-4">
              <RadioGroup
                value={post.is_private ? "private" : "public"}
                onValueChange={(value) =>
                  setPost((prev) => ({
                    ...prev,
                    is_private: value === "private",
                  }))
                }
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
            <div>
              <TagInput
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                placeholder="태그를 입력하세요 (Enter로 추가)"
              />
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden h-full">
            {isEditorReady && (
              <ToastEditor
                ref={editorRef}
                height="100%"
                initialEditType="markdown"
                useCommandShortcut={true}
                initialValue={post.content}
                theme="dark"
                previewStyle="vertical"
                hideModeSwitch={true}
                onChange={() => {
                  if (editorRef.current) {
                    const newPost = editorRef.current
                      .getInstance()
                      .getMarkdown();
                    setPost((prev) => ({ ...prev, content: newPost }));
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
