import TagPostsClient from "@/components/tags/TagPostsClient";

type Params = Promise<{ slug: string }>;

export default async function TagPostsPage({ params }: { params: Params }) {
  const { slug } = await params;
  return <TagPostsClient tagSlug={slug} />;
}