import { Metadata } from "next";

export const metadata: Metadata = {
  title: "태그",
  description: "태그별로 포스트를 모아볼 수 있습니다. React, Next.js, TypeScript 등 다양한 주제의 글을 확인하세요.",
  openGraph: {
    title: "태그 | Keep it blazing",
    description: "태그별로 포스트를 모아볼 수 있습니다.",
    url: "https://keepitblazing.kr/tags",
  },
  alternates: {
    canonical: "https://keepitblazing.kr/tags",
  },
};

export default function TagsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
