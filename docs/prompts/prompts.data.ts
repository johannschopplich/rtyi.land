import { createContentLoader } from "vitepress";

export default createContentLoader("prompts/*.md", {
  excerpt: true,
  transform(rawData) {
    return rawData
      .filter(({ url }) => url !== "/prompts/")
      .map(({ url, frontmatter, excerpt }) => ({
        title: frontmatter.title,
        url,
        frontmatter,
        excerpt: excerpt || frontmatter.description || "",
      }));
  },
});
