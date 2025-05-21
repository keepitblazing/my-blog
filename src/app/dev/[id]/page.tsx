import PostDetailClient from "@/components/post/PostDetailClient";

type Params = Promise<{ id: string }>;

export default async function DevPostPage({ params }: { params: Params }) {
  const { id } = await params;
  return <PostDetailClient id={id} category="dev" />;
}
