import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "박지민 | 프론트엔드 개발자 Portfolio",
  description:
    "React, Next.js, TypeScript를 활용한 프론트엔드 개발자 박지민의 Portfolio입니다. 웹 개발 프로젝트와 오픈소스 기여 경험을 소개합니다.",
  keywords: [
    "프론트엔드",
    "개발자",
    "Portfolio",
    "React",
    "Next.js",
    "TypeScript",
    "박지민",
    "Frontend Developer",
    "Portfolio",
  ],
  authors: [{ name: "박지민", url: "https://github.com/keepitblazing" }],
  creator: "박지민",
  publisher: "박지민",
  openGraph: {
    title: "박지민 | 프론트엔드 개발자 Portfolio",
    description:
      "React, Next.js, TypeScript를 활용한 프론트엔드 개발자의 Portfolio",
    url: "https://keepitblazing.kr/portfolio",
    siteName: "Keep it Blazing",
    images: [
      {
        url: "https://keepitblazing.kr/api/og-portfolio",
        width: 1200,
        height: 630,
        alt: "박지민 프론트엔드 개발자 Portfolio",
      },
    ],
    locale: "ko_KR",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "박지민 | 프론트엔드 개발자 Portfolio",
    description:
      "React, Next.js, TypeScript를 활용한 프론트엔드 개발자의 Portfolio",
    images: ["https://keepitblazing.kr/api/og-portfolio"],
    creator: "@keepitblazing",
  },
  alternates: {
    canonical: "https://keepitblazing.kr/portfolio",
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
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
