import Link from "next/link";
import { Post } from "@/types/post";

// 임시 데이터 (나중에 데이터베이스로 대체)
const posts: Post[] = [
  {
    id: "1",
    title: "첫 번째 블로그 포스트",
    content: "블로그의 첫 번째 포스트입니다.",
    createdAt: "2024-03-20T00:00:00Z",
    updatedAt: "2024-03-20T00:00:00Z",
    author: "관리자",
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">최신 글</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="border-2 border-[#222225] p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <Link href={`/posts/${post.id}`}>
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <div className="text-sm mb-4">
                {new Date(post.createdAt).toLocaleDateString("ko-KR")} •{" "}
                {post.author}
              </div>
              <p className="line-clamp-2">{post.content}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
