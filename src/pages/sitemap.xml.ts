import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const xmlEscape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const GET: APIRoute = async ({ site }) => {
  const base = site?.origin ?? "https://taejoon.me";

  const [note, library, learnBook, learnJs, learnNext, learnReact, learnSwift] =
    await Promise.all([
      getCollection("note", ({ data }) => data.draft !== true),
      getCollection("library", ({ data }) => data.draft !== true),
      getCollection("learn-book", ({ data }) => data.draft !== true),
      getCollection("learn-javascript", ({ data }) => data.draft !== true),
      getCollection("learn-next", ({ data }) => data.draft !== true),
      getCollection("learn-react", ({ data }) => data.draft !== true),
      getCollection("learn-swift", ({ data }) => data.draft !== true),
    ]);

  const staticPages = [
    `${base}/`,
    `${base}/learn/`,
    `${base}/library/`,
    `${base}/note/`,
    `${base}/tool/`,
    `${base}/learn/book/`,
    `${base}/learn/javascript/`,
    `${base}/learn/next.js/`,
    `${base}/learn/react/`,
    `${base}/learn/swift/`,
  ];

  const entries: { url: string; priority: number; lastmod?: string }[] = [
    ...staticPages.map((url) => ({ url, priority: 0.8 })),
    ...note.map((e) => ({
      url: `${base}/note/posts/${encodeURI(e.id)}/`,
      priority: 0.7,
      lastmod: new Date(e.data.pubDate as any).toISOString(),
    })),
    ...library.map((e) => ({
      url: `${base}/library/posts/${encodeURI(e.id)}/`,
      priority: 0.7,
      lastmod: new Date(e.data.pubDate as any).toISOString(),
    })),
    ...learnBook.map((e) => ({
      url: `${base}/learn/book/posts/${encodeURI(e.id)}/`,
      priority: 0.7,
      lastmod: new Date(e.data.pubDate as any).toISOString(),
    })),
    ...learnJs.map((e) => ({
      url: `${base}/learn/javascript/posts/${encodeURI(e.id)}/`,
      priority: 0.7,
      lastmod: new Date(e.data.pubDate as any).toISOString(),
    })),
    ...learnNext.map((e) => ({
      url: `${base}/learn/next.js/posts/${encodeURI(e.id)}/`,
      priority: 0.7,
      lastmod: new Date(e.data.pubDate as any).toISOString(),
    })),
    ...learnReact.map((e) => ({
      url: `${base}/learn/react/posts/${encodeURI(e.id)}/`,
      priority: 0.7,
      lastmod: new Date(e.data.pubDate as any).toISOString(),
    })),
    ...learnSwift.map((e) => ({
      url: `${base}/learn/swift/posts/${encodeURI(e.id)}/`,
      priority: 0.7,
      lastmod: new Date(e.data.pubDate as any).toISOString(),
    })),
  ];

  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (p) => `  <url>
    <loc>${xmlEscape(p.url)}</loc>
    <lastmod>${p.lastmod ?? now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${p.priority.toFixed(1)}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
