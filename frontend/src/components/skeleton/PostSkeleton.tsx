// About Me 스켈레톤
export function AboutMeSkeleton() {
  return (
    <div className="mb-8 p-6 bg-blog-black border border-blog-grey rounded-lg">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-20 h-20 rounded-full skeleton-shimmer" />
        <div className="flex-1 text-center sm:text-left w-full">
          <div className="h-6 w-24 rounded skeleton-shimmer mb-2 mx-auto sm:mx-0" />
          <div className="space-y-2 mb-3">
            <div className="h-4 rounded skeleton-shimmer w-full" />
            <div className="h-4 rounded skeleton-shimmer w-3/4 mx-auto sm:mx-0" />
          </div>
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            <div className="h-8 w-24 rounded-md skeleton-shimmer" />
            <div className="h-8 w-20 rounded-md skeleton-shimmer" />
            <div className="h-8 w-16 rounded-md skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 큰 카드 스켈레톤
function LargePostSkeleton({ position }: { position: "left" | "right" }) {
  return (
    <article
      className={`md:col-span-2 lg:col-span-2 row-span-2 relative h-full min-h-[300px] p-8 rounded-2xl border border-blog-grey overflow-hidden ${
        position === "right" ? "lg:col-start-2" : ""
      }`}
    >
      <div className="h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-12 rounded-full skeleton-shimmer" />
          </div>
          <div className="h-8 md:h-10 rounded skeleton-shimmer w-3/4 mb-4" />
          <div className="space-y-2">
            <div className="h-4 rounded skeleton-shimmer w-full" />
            <div className="h-4 rounded skeleton-shimmer w-5/6" />
            <div className="h-4 rounded skeleton-shimmer w-4/6" />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="h-6 w-16 rounded-md skeleton-shimmer" />
            <div className="h-6 w-20 rounded-md skeleton-shimmer" />
            <div className="h-6 w-14 rounded-md skeleton-shimmer" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded skeleton-shimmer" />
            <div className="h-4 w-12 rounded skeleton-shimmer" />
          </div>
        </div>
      </div>
    </article>
  );
}

// 작은 카드 스켈레톤
export default function PostSkeleton() {
  return (
    <article className="relative h-full min-h-[180px] p-6 rounded-2xl border border-blog-grey bg-blog-black overflow-hidden">
      <div className="h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-10 rounded skeleton-shimmer" />
          </div>
          <div className="h-6 rounded skeleton-shimmer w-4/5 mb-2" />
          <div className="space-y-2">
            <div className="h-4 rounded skeleton-shimmer w-full" />
            <div className="h-4 rounded skeleton-shimmer w-3/4" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="h-3 w-20 rounded skeleton-shimmer" />
          <div className="h-3 w-3 rounded skeleton-shimmer" />
        </div>
      </div>
    </article>
  );
}

// 벤토 그리드 스켈레톤 (지그재그 패턴)
export function PostListSkeleton({ count = 8 }: { count?: number }) {
  // 큰 카드 인덱스 계산 (0, 5, 10...)
  const getLargeCardIndices = (total: number) => {
    const indices: number[] = [0];
    for (let i = 5; i < total; i += 5) {
      indices.push(i);
    }
    return indices;
  };

  const largeCardIndices = getLargeCardIndices(count);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="h-8 rounded skeleton-shimmer w-32" />
        <div className="h-4 rounded skeleton-shimmer w-16" />
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, index) => {
          const isLargeCard = largeCardIndices.includes(index);
          const largeCardOrder = largeCardIndices.indexOf(index);
          const position = largeCardOrder % 2 === 0 ? "left" : "right";

          if (isLargeCard) {
            return <LargePostSkeleton key={index} position={position} />;
          }

          return <PostSkeleton key={index} />;
        })}
      </div>
    </div>
  );
}
