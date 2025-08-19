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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
              `,
            }}
          />
        )}
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-black text-white"
      >
        <Navbar />
        <main className="max-w-7xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
