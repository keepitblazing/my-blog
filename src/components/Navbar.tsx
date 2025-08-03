"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

interface NavLink {
  href: string;
  label: string;
  adminOnly?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "홈" },
  { href: "/dev", label: "개발" },
  { href: "/diary", label: "일기" },
  { href: "/tags", label: "태그" },
  { href: "/post/create", label: "글쓰기", adminOnly: true },
];

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  isMobile?: boolean;
}

const NavLinkComponent = ({ href, label, onClick, isMobile }: NavLinkProps) => {
  const pathname = usePathname();
  const isCurrentPath =
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (isMobile) {
    return (
      <Link
        href={href}
        className={`block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-md ${
          isCurrentPath
            ? "bg-[#1a1a1a] text-white"
            : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
        }`}
        onClick={onClick}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center px-1 pt-1 border-b-3 text-sm font-medium ${
        isCurrentPath
          ? "border-[#222225] text-white"
          : "border-transparent text-gray-400 hover:border-[#222225] hover:text-white"
      }`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dailyVisitorCount, setDailyVisitorCount] = useState(0);
  const [totalVisitorCount, setTotalVisitorCount] = useState(0);

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

    const fetchVisitorCounts = async () => {
      try {
        // 일일 방문자 수 조회
        const dailyResponse = await fetch("/api/visitor");
        const dailyData = await dailyResponse.json();
        setDailyVisitorCount(dailyData.count);

        // 전체 방문자 수 조회
        const totalResponse = await fetch("/api/visitor?type=total");
        const totalData = await totalResponse.json();
        setTotalVisitorCount(totalData.count);
      } catch (error) {
        console.error("방문자 수 조회 중 오류 발생:", error);
      }
    };

    checkAdminStatus();
    fetchVisitorCounts();

    // 1분마다 방문자 수 업데이트
    const interval = setInterval(fetchVisitorCounts, 60000);
    return () => clearInterval(interval);
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
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLinkComponent href="/" label="홈" isMobile={false} />
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
                {NAV_LINKS.map(
                  (link) =>
                    (!link.adminOnly || isAdmin) && (
                      <NavLinkComponent
                        key={link.href}
                        href={link.href}
                        label={link.label}
                        isMobile={false}
                      />
                    )
                )}
              </div>
            </div>
            {/* 방문자 수 표시 */}
            <div className="hidden sm:flex items-center text-sm text-gray-400 space-x-4">
              <span>Today: {dailyVisitorCount}</span>
              <span>Total: {totalVisitorCount}</span>
            </div>
            {/* 모바일 메뉴 버튼 */}
            <div className="flex items-center sm:hidden">
              <div className="mr-4 text-sm text-gray-400">
                <span>
                  {dailyVisitorCount} | {totalVisitorCount}
                </span>
              </div>
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
            {NAV_LINKS.map(
              (link) =>
                (!link.adminOnly || isAdmin) && (
                  <NavLinkComponent
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    onClick={() => setIsMobileMenuOpen(false)}
                    isMobile={true}
                  />
                )
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
