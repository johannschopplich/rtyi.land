import { createContentLoader } from "vitepress";

export default createContentLoader("prompts/*.md", {
  excerpt: true,
  transform(rawData) {
    return rawData
      .filter(({ url }) => url !== "/prompts/")
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title,
        url,
        frontmatter,
        excerpt: frontmatter.description,
      }));
  },
});
