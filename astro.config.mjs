import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import rehypePrettyCode from "rehype-pretty-code";

import sitemap from "@astrojs/sitemap";

const prettyCodeOptions = {
  theme: "night-owl",
};

// https://astro.build/config
export default defineConfig({
  site: "https://taejoon.me",
  integrations: [
    react({
      experimentalReactChildren: true,
      include: ["**/react/*"],
    }),
    sitemap({
      canonicalURL: "https://taejoon.me",
      serialize(item) {
        // 더 상세한 sitemap 정보 추가
        return {
          url: item.url,
          changefreq: "weekly",
          lastmod: new Date(),
          priority: item.url === "https://taejoon.me/" ? 1.0 : 0.8,
        };
      },
      filter: (page) => {
        // 불필요한 페이지 제외
        return !page.includes("/draft/");
      },
      // XML을 읽기 쉽게 포맷팅
      customPages: undefined,
      i18n: undefined,
      entryLimit: 45000,
    }),
  ],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  },
  // image: {
  //   service: squooshImageService(),

  // },
});
