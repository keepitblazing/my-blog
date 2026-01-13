import { Metadata } from "next";
import TagPostsClient from "@/components/tags/TagPostsClient";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const tagName = decodeURIComponent(slug);

  return {
    title: `#${tagName}`,
    description: `${tagName} 태그가 포함된 포스트 목록입니다.`,
    openGraph: {
      title: `#${tagName} | Keep it blazing`,
      description: `${tagName} 태그가 포함된 포스트 목록입니다.`,
      url: `https://keepitblazing.kr/tags/${slug}`,
    },
    alternates: {
      canonical: `https://keepitblazing.kr/tags/${slug}`,
    },
  };
}

export default async function TagPostsPage({ params }: { params: Params }) {
  const { slug } = await params;
  return <TagPostsClient tagSlug={slug} />;
}
