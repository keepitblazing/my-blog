import { Metadata } from "next";

export const metadata: Metadata = {
  title: "일상",
  description: "개발자의 일상과 생각을 기록하는 공간입니다.",
  openGraph: {
    title: "일상 | Keep it blazing",
    description: "개발자의 일상과 생각을 기록하는 공간입니다.",
    url: "https://keepitblazing.kr/diary",
  },
  alternates: {
    canonical: "https://keepitblazing.kr/diary",
  },
};

export default function DiaryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
