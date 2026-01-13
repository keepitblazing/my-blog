export default function TagSkeleton() {
  return <div className="h-10 bg-blog-grey  rounded-lg animate-pulse"></div>;
}

export function TagGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <TagSkeleton key={index} />
      ))}
    </div>
  );
}

export function TagInputSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <div className="h-8 bg-blog-grey  rounded-full animate-pulse w-20"></div>
        <div className="h-8 bg-blog-grey  rounded-full animate-pulse w-24"></div>
      </div>
      <div className="h-10 bg-blog-grey  rounded animate-pulse w-full"></div>
    </div>
  );
}
