import react from "@astrojs/react";
import { defineConfig, squooshImageService } from "astro/config";
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
    sitemap(),
  ],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  },
  image: {
    service: squooshImageService(),
  },
});
