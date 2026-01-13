import { MetadataRoute } from "next";

const BASE_URL = "https://keepitblazing.kr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/dev`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/diary`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tags`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // 동적 포스트들 (API에서 가져오기)
  let postPages: MetadataRoute.Sitemap = [];
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const res = await fetch(`${API_URL}/api/posts`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const posts = await res.json();
      postPages = posts.map((post: { id: string; category: string; updatedAt?: string; createdAt: string }) => ({
        url: `${BASE_URL}/${post.category}/${post.id}`,
        lastModified: new Date(post.updatedAt || post.createdAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch posts for sitemap:", error);
  }

  return [...staticPages, ...postPages];
}
