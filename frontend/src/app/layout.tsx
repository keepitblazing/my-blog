import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import VisitorTracker from "@/components/VisitorTracker";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://keepitblazing.kr"),
  title: {
    default: "Keep it blazing - 개발 블로그",
    template: "%s | Keep it blazing",
  },
  description: "프론트엔드 개발자의 기술 블로그. React, Next.js, TypeScript 등 웹 개발 관련 글을 공유합니다.",
  keywords: ["개발 블로그", "프론트엔드", "React", "Next.js", "TypeScript", "웹 개발"],
  authors: [{ name: "Keep it blazing" }],
  creator: "Keep it blazing",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://keepitblazing.kr",
    siteName: "Keep it blazing",
    title: "Keep it blazing - 개발 블로그",
    description: "프론트엔드 개발자의 기술 블로그. React, Next.js, TypeScript 등 웹 개발 관련 글을 공유합니다.",
    images: [
      {
        url: "/door.png",
        width: 1200,
        height: 630,
        alt: "Keep it blazing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keep it blazing - 개발 블로그",
    description: "프론트엔드 개발자의 기술 블로그",
    images: ["/door.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Keep it blazing",
    url: "https://keepitblazing.kr",
    description: "프론트엔드 개발자의 기술 블로그",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://keepitblazing.kr/tags/{search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-black text-white"
      >
        <VisitorTracker />
        <Navbar />
        <main className="max-w-7xl mx-auto p-2">{children}</main>
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script
            id="clarity"
            strategy="afterInteractive"
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
      </body>
    </html>
  );
}
