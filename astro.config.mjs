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
      filter: (page) => !page.includes("/draft/"),
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date("2025-08-23"),
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
