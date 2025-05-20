"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-6xl mb-4">🔥</div>
      <h1 className="text-2xl font-bold mb-2">페이지를 찾을 수 없습니다.</h1>
      <p className="text-gray-400 mb-8">요청하신 페이지가 존재하지 않습니다.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#222225] text-white rounded-lg hover:bg-[#2a2a2f] transition-colors"
      >
        홈으로 가기
      </Link>
    </div>
  );
}
