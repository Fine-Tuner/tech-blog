import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import rehypePrettyCode from "rehype-pretty-code";

// import sitemap from "@astrojs/sitemap";

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
    // 컬렉션 기반 커스텀 sitemap 생성으로 대체
  ],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  },
  // image: {
  //   service: squooshImageService(),

  // },
});
