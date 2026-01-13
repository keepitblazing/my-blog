import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/post/create", "/post/*/edit"],
      },
    ],
    sitemap: "https://keepitblazing.kr/sitemap.xml",
  };
}
