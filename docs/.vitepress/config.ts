import { defineConfig } from "vitepress";
import { description, name, ogImage, ogUrl, twitterImage } from "./meta";

export default defineConfig({
  title: name,
  description,

  head: [
    ["link", { rel: "icon", href: "/favicon.ico", sizes: "48x48" }],
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    ["meta", { name: "author", content: "Johann Schopplich" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:url", content: ogUrl }],
    ["meta", { property: "og:title", content: name }],
    ["meta", { property: "og:description", content: description }],
    ["meta", { property: "og:image", content: ogImage }],
    ["meta", { name: "twitter:title", content: name }],
    ["meta", { name: "twitter:description", content: description }],
    ["meta", { name: "twitter:image", content: twitterImage }],
    ["meta", { name: "twitter:site", content: "@jschopplich" }],
    ["meta", { name: "twitter:creator", content: "@jschopplich" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
  ],

  themeConfig: {
    logo: "/logo.svg",

    nav: [
      { text: "Home", link: "/" },
      { text: "Narrative Arcs", link: "/drafts/narrative-arcs" },
      { text: "Interview Questions", link: "/drafts/interview-questions" },
    ],

    sidebar: [
      {
        text: "Drafts",
        items: [
          {
            text: "Narrative Arcs",
            link: "/drafts/narrative-arcs",
          },
          {
            text: "Interview Questions",
            link: "/drafts/interview-questions",
          },
        ],
      },
      {
        text: "Research",
        items: [
          {
            text: "Stream Analysis",
            link: "/streams",
          },
          {
            text: "Video Game Documentaries",
            link: "/research/video-game-documentaries",
          },
        ],
      },
      {
        text: "Prompts",
        link: "/prompts",
      },
    ],

    footer: {
      message:
        'Written for internal use by <a href="https://byjohann.link">Johann Schopplich</a>.',
    },
  },
});
