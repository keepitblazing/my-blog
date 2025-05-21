import PostDetailClient from "@/components/post/PostDetailClient";

export default function PostDetail({ params }: { params: { id: string } }) {
  return <PostDetailClient id={params.id} />;
}
