"use client";

import { useState, useEffect } from "react";
import { TagWithCount } from "@/types/tag";
import { getTagsWithCount } from "@/lib/api";
import Link from "next/link";
import { TagGridSkeleton } from "@/components/skeleton/TagSkeleton";
import { Tag } from "lucide-react";

export default function AllTagsClient() {
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await getTagsWithCount();
        // 포스트가 있는 태그만 필터링하고 개수 순으로 정렬
        const tagsWithPosts = data.filter(tag => tag.count > 0);
        setTags(tagsWithPosts.sort((a, b) => b.count - a.count));
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="h-8 bg-blog-grey  rounded animate-pulse w-24 mb-8"></div>
        <TagGridSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-xl font-bold mb-8">모든 태그</h1>

      {tags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-[#222225] rounded-lg">
          <Tag className="w-10 h-10 text-gray-400 mb-4" />
          <p className="text-xl text-gray-400">아직 태그가 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="flex items-center justify-between p-4 border-2 border-[#222225] rounded-lg hover:bg-[#222225] transition-colors"
            >
              <span className="font-medium">{tag.name}</span>
              <span className="text-sm text-gray-400">({tag.count})</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
