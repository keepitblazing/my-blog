import { use } from "react";
import EditPostClient from "@/components/post/EditPostClient";

export default function EditPost({ params }: { params: { id: string } }) {
  const resolvedParams = use(Promise.resolve(params));
  return <EditPostClient id={resolvedParams.id} />;
}
