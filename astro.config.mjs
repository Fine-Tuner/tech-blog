import react from "@astrojs/react";
import { defineConfig, squooshImageService } from "astro/config";
import rehypePrettyCode from "rehype-pretty-code";

import sitemap from "@astrojs/sitemap";

const prettyCodeOptions = {
  theme: "night-owl",
};

// https://astro.build/config
export default defineConfig({
  site: "http://taejoon.me",
  integrations: [
    react({
      experimentalReactChildren: true,
      include: ["**/react/*"],
    }),
    sitemap((page) => {
      const excludePatterns = [/\/draft\//];

      return !excludePatterns.some((pattern) => pattern.test(page.url));
    }),
  ],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  },
  image: {
    service: squooshImageService(),
  },
});
