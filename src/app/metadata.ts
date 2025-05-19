import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keep it blazing🔥",
  description: "개발 관련 글을 작성하고 공유하는 블로그입니다.",
  openGraph: {
    title: "Keep it blazing🔥",
    description: "개발 관련 글을 작성하고 공유하는 블로그입니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "블로그",
    images: [
      {
        url: "/door.png",
        width: 1200,
        height: 630,
        alt: "블로그 대표 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keep it blazing🔥",
    description: "개발 관련 글을 작성하고 공유하는 블로그입니다.",
    images: ["/door.png"],
  },
  other: {
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:type": "image/png",
    "og:image:secure_url": "/door.png",
    "og:site_name": "Keep it blazing🔥",
  },
};
