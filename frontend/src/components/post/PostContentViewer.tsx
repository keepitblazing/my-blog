"use client";

import dynamic from "next/dynamic";
import DOMPurify from "isomorphic-dompurify";

const Viewer = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Viewer),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-800 h-12 rounded" />,
  }
);

export default function PostContentViewer({ content }: { content: string }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://uicdn.toast.com/editor/latest/toastui-editor-viewer.min.css"
      />
      <div className="line-clamp-2 overflow-hidden text-gray-300">
        <Viewer initialValue={DOMPurify.sanitize(content)} />
      </div>
    </>
  );
}
