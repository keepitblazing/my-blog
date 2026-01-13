import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개발",
  description: "React, Next.js, TypeScript 등 프론트엔드 개발 관련 기술 포스팅",
  openGraph: {
    title: "개발 | Keep it blazing",
    description: "React, Next.js, TypeScript 등 프론트엔드 개발 관련 기술 포스팅",
    url: "https://keepitblazing.kr/dev",
  },
  alternates: {
    canonical: "https://keepitblazing.kr/dev",
  },
};

export default function DevLayout({ children }: { children: React.ReactNode }) {
  return children;
}
