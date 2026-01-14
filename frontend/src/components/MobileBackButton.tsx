'use client';

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface MobileBackButtonProps {
  href?: string;
  label?: string;
  useHistory?: boolean; // true면 브라우저 히스토리 사용
}

export default function MobileBackButton({ 
  href, 
  label = "뒤로가기",
  useHistory = false 
}: MobileBackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (useHistory) {
      router.back();
    }
  };

  // useHistory가 true면 button으로, href가 있으면 Link로
  if (useHistory) {
    return (
      <button
        onClick={handleBack}
        className="sm:hidden inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-[#2a2a2f] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{label}</span>
      </button>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        className="sm:hidden inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-[#2a2a2f] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{label}</span>
      </Link>
    );
  }

  return null;
}