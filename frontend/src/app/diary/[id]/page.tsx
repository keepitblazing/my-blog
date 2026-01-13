import { Metadata } from "next";
import PostDetailClient from "@/components/post/PostDetailClient";

type Params = Promise<{ id: string }>;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${API_URL}/api/posts/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Post not found");

    const post = await res.json();
    const description = post.content?.replace(/<[^>]*>/g, "").slice(0, 160) || "";

    return {
      title: post.title,
      description,
      openGraph: {
        title: `${post.title} | Keep it blazing`,
        description,
        url: `https://keepitblazing.kr/diary/${id}`,
        type: "article",
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        authors: ["Keep it blazing"],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
      },
      alternates: {
        canonical: `https://keepitblazing.kr/diary/${id}`,
      },
    };
  } catch {
    return {
      title: "포스트를 찾을 수 없습니다",
      description: "요청한 포스트가 존재하지 않습니다.",
    };
  }
}

export default async function DiaryPostPage({ params }: { params: Params }) {
  const { id } = await params;
  return <PostDetailClient id={id} category="diary" />;
}
