"use client";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/visitor", {
      method: "POST",
    }).catch(console.error);
  }, [pathname]);

  return (
    <html lang="ko">
      <head>
        <meta property="og:title" content="Keep it blazing🔥" />
        <meta
          property="og:description"
          content="개발 관련 글을 작성하고 공유하는 블로그입니다."
        />
        <meta property="og:image" content="https://keepitblazing.kr/door.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Keep it blazing🔥" />
        <meta
          name="twitter:description"
          content="개발 관련 글을 작성하고 공유하는 블로그입니다."
        />
        <meta
          name="twitter:image"
          content="https://keepitblazing.kr/door.png"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-black text-white"
      >
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
