"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error?: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-6xl mb-4">🔥</div>
      <h1 className="text-2xl font-bold mb-2">일시적인 서버 오류입니다.</h1>
      <p className="text-gray-400 mb-8">잠시 후 다시 시도해주세요.</p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-[#222225] text-white rounded-lg hover:bg-[#2a2a2f] transition-colors"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-[#222225] text-white rounded-lg hover:bg-[#2a2a2f] transition-colors"
        >
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}
