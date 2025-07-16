import type { DefaultTheme } from "vitepress";
import { defineConfig } from "vitepress";
import { description, name, ogImage, ogUrl, twitterImage } from "./meta";

const RTYI_TEAM_MEMBERS = ["kaze", "biobak", "badub", "zeina"];

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
    ["meta", { name: "robots", content: "noindex, nofollow" }],
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
    [
      "link",
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
  ],

  themeConfig: {
    logo: {
      dark: "/favicon-dark.svg",
      light: "/favicon-light.svg",
    },

    nav: [
      { text: "Home", link: "/" },
      { text: "Narrative Arcs", link: "/drafts/narrative-arcs" },
      {
        text: "Interview Questions",
        items: teamMemberNavigationItems(),
      },
    ],

    sidebar: [
      {
        text: "Drafts",
        items: [
          {
            text: "Narrative Arcs",
            link: "/drafts/narrative-arcs",
          },
        ],
      },
      {
        text: "Interview Questions",
        items: teamMemberNavigationItems(),
      },
      {
        text: "Research",
        items: [
          {
            text: "Stream Analysis",
            link: "/streams",
          },
          {
            text: "Open Questions",
            link: "/questions",
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

    search: {
      provider: "local",
    },
  },
});

function teamMemberNavigationItems(): DefaultTheme.NavItemWithLink[] {
  return [
    {
      text: "Overview & Team",
      link: "/interviews",
    },
    ...RTYI_TEAM_MEMBERS.map((member) => ({
      text: member.charAt(0).toUpperCase() + member.slice(1),
      link: `/interviews/${member}`,
    })),
    {
      text: "Kaze & Zeina",
      link: "/interviews/kaze-zeina",
    },
  ];
}
