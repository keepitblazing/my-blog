"use client";

import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { Viewer } from "@toast-ui/react-editor";

export default function PostContentViewer({ content }: { content: string }) {
  return (
    <div className="line-clamp-2 overflow-hidden text-gray-300">
      <Viewer initialValue={content} />
    </div>
  );
}
