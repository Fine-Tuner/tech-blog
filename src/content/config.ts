import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const commonSchema = z.object({
  title: z.string(),
  pubDate: z.union([z.string(), z.date()]),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().optional(),
});

const note = defineCollection({
  loader: glob({ base: "./src/pages/note/posts", pattern: "**/*.md" }),
  schema: commonSchema,
});

const library = defineCollection({
  loader: glob({ base: "./src/pages/library/posts", pattern: "**/*.md" }),
  schema: commonSchema,
});

const learnBook = defineCollection({
  loader: glob({ base: "./src/pages/learn/book/posts", pattern: "**/*.md" }),
  schema: commonSchema,
});

const learnJavascript = defineCollection({
  loader: glob({
    base: "./src/pages/learn/javascript/posts",
    pattern: "**/*.md",
  }),
  schema: commonSchema,
});

const learnNext = defineCollection({
  loader: glob({ base: "./src/pages/learn/next.js/posts", pattern: "**/*.md" }),
  schema: commonSchema,
});

const learnReact = defineCollection({
  loader: glob({ base: "./src/pages/learn/react/posts", pattern: "**/*.md" }),
  schema: commonSchema,
});

const learnSwift = defineCollection({
  loader: glob({ base: "./src/pages/learn/swift/posts", pattern: "**/*.md" }),
  schema: commonSchema,
});

export const collections = {
  note,
  library,
  "learn-book": learnBook,
  "learn-javascript": learnJavascript,
  "learn-next": learnNext,
  "learn-react": learnReact,
  "learn-swift": learnSwift,
};
