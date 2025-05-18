"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("/api/check-admin");
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("관리자 상태 확인 중 오류 발생:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <nav className="bg-black border-b border-[#222225]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-white">
                Keep it blazing🔥
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/"
                    ? "border-[#222225] text-white"
                    : "border-transparent text-gray-400 hover:border-[#222225] hover:text-white"
                }`}
              >
                홈
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === "/admin"
                      ? "border-[#222225] text-white"
                      : "border-transparent text-gray-400 hover:border-[#222225] hover:text-white"
                  }`}
                >
                  관리자
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
