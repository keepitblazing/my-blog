export default function PostSkeleton() {
  return (
    <article className="border-2 border-[#222225] p-6 rounded-lg shadow-sm max-h-[150px] overflow-hidden">
      <div className="flex items-center justify-between pt-2 pb-5">
        <div className="flex items-center gap-2 flex-1">
          <div className="h-6 bg-blog-grey rounded animate-pulse w-3/4"></div>
        </div>
        <div className="h-4 bg-blog-grey  rounded animate-pulse w-24"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-blog-grey  rounded animate-pulse w-full"></div>
      </div>
      <div className="flex gap-2 mt-3">
        <div className="h-6 bg-blog-grey  rounded-full animate-pulse w-16"></div>
        <div className="h-6 bg-blog-grey  rounded-full animate-pulse w-20"></div>
        <div className="h-6 bg-blog-grey  rounded-full animate-pulse w-14"></div>
      </div>
    </article>
  );
}

export function PostListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-8">
      <div className="h-8 bg-blog-grey  rounded animate-pulse w-48"></div>
      <div className="grid gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
