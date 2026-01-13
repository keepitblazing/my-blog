export default function PostDetailSkeleton() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto w-full p-[7px]">
        <div className="mb-4">
          <div className="h-10 bg-blog-grey  rounded animate-pulse w-32"></div>
        </div>

        <article className="border-2 border-[#222225] p-4 sm:p-6 md:p-8 rounded-lg h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="h-8 bg-blog-grey  rounded animate-pulse w-3/4"></div>
            <div className="flex gap-2">
              <div className="h-9 bg-blog-grey  rounded animate-pulse w-20"></div>
              <div className="h-9 bg-blog-grey  rounded animate-pulse w-20"></div>
            </div>
          </div>

          <div className="border-b border-[#222225] pb-3 sm:pb-4 mb-6 sm:mb-8">
            <div className="h-4 bg-blog-grey  rounded animate-pulse w-32 ml-auto"></div>
          </div>

          <div className="space-y-4">
            <div className="h-4 bg-blog-grey  rounded animate-pulse w-full"></div>
            <div className="h-4 bg-blog-grey  rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-blog-grey  rounded animate-pulse w-4/6"></div>
            <div className="h-32 bg-blog-grey  rounded animate-pulse w-full mt-6"></div>
            <div className="h-4 bg-blog-grey  rounded animate-pulse w-full"></div>
            <div className="h-4 bg-blog-grey  rounded animate-pulse w-3/4"></div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#222225]">
            <div className="flex flex-wrap gap-2">
              <div className="h-8 bg-blog-grey  rounded-full animate-pulse w-20"></div>
              <div className="h-8 bg-blog-grey  rounded-full animate-pulse w-24"></div>
              <div className="h-8 bg-blog-grey  rounded-full animate-pulse w-16"></div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
