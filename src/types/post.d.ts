export interface PostData {
  url: string;
  frontmatter: {
    title: string;
    pubDate: number;
  };
  // Astro markdown instance provides compiledContent() to get HTML string
  compiledContent: () => string;
}
