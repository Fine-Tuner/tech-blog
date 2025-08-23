import type { APIRoute } from "astro";

// 모든 페이지 URL 수동 정의
const pages = [
  { url: "https://taejoon.me/", priority: 1.0 },
  { url: "https://taejoon.me/learn/", priority: 0.8 },
  { url: "https://taejoon.me/library/", priority: 0.8 },
  { url: "https://taejoon.me/note/", priority: 0.8 },
  { url: "https://taejoon.me/tool/", priority: 0.8 },

  // 학습 페이지들
  { url: "https://taejoon.me/learn/book/", priority: 0.8 },
  { url: "https://taejoon.me/learn/javascript/", priority: 0.8 },
  { url: "https://taejoon.me/learn/next.js/", priority: 0.8 },
  { url: "https://taejoon.me/learn/react/", priority: 0.8 },
  { url: "https://taejoon.me/learn/swift/", priority: 0.8 },

  // Next.js 포스트들
  {
    url: "https://taejoon.me/learn/next.js/posts/Next.js%20-%201-1.%20Pages%20Router/",
    priority: 0.7,
  },
  {
    url: "https://taejoon.me/learn/next.js/posts/Next.js%20-%201-2.%20Api%20Routes/",
    priority: 0.7,
  },
  {
    url: "https://taejoon.me/learn/next.js/posts/Next.js%20-%201-3.%20Style/",
    priority: 0.7,
  },
  {
    url: "https://taejoon.me/learn/next.js/posts/Next.js%20-%201-4.%20Layout/",
    priority: 0.7,
  },
  {
    url: "https://taejoon.me/learn/next.js/posts/Next.js%20-%201-5.%20Date%20Fetching/",
    priority: 0.7,
  },
  {
    url: "https://taejoon.me/learn/next.js/posts/Next.js%20-%201-6.%20SSR/",
    priority: 0.7,
  },
  {
    url: "https://taejoon.me/learn/next.js/posts/Next.js%20-%201-7.%20SSG/",
    priority: 0.7,
  },
  {
    url: "https://taejoon.me/learn/next.js/posts/Next.js%20-%201-8.%20ISR/",
    priority: 0.7,
  },
  {
    url: "https://taejoon.me/learn/next.js/posts/Next.js%20-%201-9.%20SEO/",
    priority: 0.7,
  },
  {
    url: "https://taejoon.me/learn/next.js/posts/Next.js%20-%201-10.Page%20Router%20%EC%9E%A5%EC%A0%90/",
    priority: 0.7,
  },

  // 주요 라이브러리 포스트들 (몇 개만 예시)
  {
    url: "https://taejoon.me/library/posts/2024%EB%85%84%20%EC%83%81%EB%B0%98%EA%B8%B0%20%ED%8F%89%EA%B0%80%EC%9E%90%20%EC%82%AC%EC%9D%B4%ED%8A%B8%20%EA%B0%9C%EB%B0%9C%20%ED%9B%84%EA%B8%B0/",
    priority: 0.7,
  },
  {
    url: "https://taejoon.me/library/posts/%EB%94%94%EC%9E%90%EC%9D%B8%20%EC%8B%9C%EC%8A%A4%ED%85%9C%20%EA%B0%9C%EB%B0%9C%EA%B8%B0/",
    priority: 0.7,
  },

  // 주요 노트 포스트들 (몇 개만 예시)
  { url: "https://taejoon.me/note/posts/2022%20retrospect/", priority: 0.7 },
  {
    url: "https://taejoon.me/note/posts/Toss%202025%20Conference%20%EC%B0%B8%EC%97%AC%20%ED%9B%84%EA%B8%B0/",
    priority: 0.7,
  },
];

export const GET: APIRoute = () => {
  const currentDate = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
