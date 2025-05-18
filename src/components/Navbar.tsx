"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  // 모바일 메뉴가 열릴 때 스크롤 방지
  useEffect(() => {
    if (!mounted) return;

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, mounted]);

  // 클라이언트 사이드 렌더링이 완료되기 전까지는 기본 UI만 표시
  if (!mounted) {
    return (
      <nav className="bg-black border-b border-[#222225] relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-white">
                  Keep it blazing🔥
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-black border-b border-[#222225] relative z-50">
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
                  className={`inline-flex items-center px-1 pt-1 border-b-3 text-sm font-medium ${
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
                    className={`inline-flex items-center px-1 pt-1 border-b-3 text-sm font-medium ${
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
            {/* 모바일 메뉴 버튼 */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#222225] focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">메뉴 열기</span>
                {!isMobileMenuOpen ? (
                  <FontAwesomeIcon icon={faBars} className="block text-lg" />
                ) : (
                  <FontAwesomeIcon icon={faXmark} className="block text-lg" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 오버레이 */}
        <div
          className={`fixed top-16 inset-x-0 bottom-0 bg-black transition-opacity duration-300 ease-in-out sm:hidden ${
            isMobileMenuOpen
              ? "opacity-50 z-40"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* 모바일 메뉴 */}
        <div
          className={`absolute top-17 left-0 right-0 bg-black transform transition-all duration-300 ease-in-out sm:hidden ${
            isMobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-[10%] opacity-0 pointer-events-none"
          } z-50 border-b border-[#222225]`}
          style={{
            transformOrigin: "top",
            willChange: "transform, opacity",
          }}
        >
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/"
              className={`block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-md ${
                pathname === "/"
                  ? "bg-[#1a1a1a] text-white"
                  : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              홈
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-md ${
                  pathname === "/admin"
                    ? "bg-[#1a1a1a] text-white"
                    : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                관리자
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
