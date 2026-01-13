import EditPostClient from "@/components/post/EditPostClient";

type Params = Promise<{ id: string }>;

export default async function EditPost({ params }: { params: Params }) {
  const { id } = await params;
  return <EditPostClient id={id} />;
}
