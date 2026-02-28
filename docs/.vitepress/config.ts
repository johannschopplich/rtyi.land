import type { DefaultTheme } from "vitepress";
import { defineConfig } from "vitepress";
import { TEAM_MEMBERS } from "../../src/constants";
import { description, name, ogImage, ogUrl, twitterImage } from "./meta";
import { capitalizeInitialLetter } from "./shared";

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
      {
        text: "My Research",
        items: [
          { text: "Narrative Arcs", link: "/drafts/narrative-arcs" },
          ...teamMemberNavigationItems(),
        ],
      },
      {
        text: "Documentary Prep",
        items: [
          { text: "Overview", link: "/synthesis" },
          { text: "Narrative Arcs", link: "/synthesis/narrative-arcs" },
          { text: "Story Threads", link: "/synthesis/story-threads" },
          { text: "Questions", link: "/synthesis/questions" },
          { text: "Topic Narratives", link: "/synthesis/topics" },
        ],
      },
      {
        text: "Stream Archive",
        items: [
          { text: "Stream Dashboard", link: "/streams" },
          { text: "Highlights", link: "/streams/highlights" },
          { text: "By Topic", link: "/topics" },
          { text: "Team Profiles", link: "/team" },
        ],
      },
    ],

    sidebar: [
      {
        text: "My Research",
        items: [
          {
            text: "Narrative Arcs",
            link: "/drafts/narrative-arcs",
          },
          {
            text: "Interviews",
            link: "/interviews",
            collapsed: true,
            items: teamMemberSidebarItems(),
          },
        ],
      },
      {
        text: "Documentary Prep",
        items: [
          {
            text: "Overview",
            link: "/synthesis",
          },
          {
            text: "Narrative Arcs",
            link: "/synthesis/narrative-arcs",
          },
          {
            text: "Story Threads",
            link: "/synthesis/story-threads",
          },
          {
            text: "Questions",
            link: "/synthesis/questions",
          },
          {
            text: "Topic Narratives",
            link: "/synthesis/topics",
          },
        ],
      },
      {
        text: "Stream Archive",
        items: [
          {
            text: "Dashboard",
            link: "/streams",
          },
          {
            text: "Highlights",
            link: "/streams/highlights",
          },
          {
            text: "Raw Findings by Topic",
            link: "/topics",
            collapsed: true,
            items: [
              { text: "Design", link: "/topics/design" },
              { text: "Technical", link: "/topics/technical" },
              { text: "Milestone", link: "/topics/milestone" },
              { text: "Philosophy", link: "/topics/philosophy" },
              { text: "Personal", link: "/topics/personal" },
              { text: "Team", link: "/topics/team" },
              { text: "Legal / Nintendo", link: "/topics/legal-nintendo" },
              { text: "Community", link: "/topics/community" },
              { text: "Business", link: "/topics/business" },
            ],
          },
          {
            text: "Team Profiles",
            link: "/team",
            collapsed: true,
            items: [
              { text: "Kaze", link: "/team/kaze" },
              { text: "Biobak", link: "/team/biobak" },
              { text: "Badub", link: "/team/badub" },
              { text: "Zeina", link: "/team/zeina" },
            ],
          },
        ],
      },
      {
        text: "Background",
        items: [
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
    ...TEAM_MEMBERS.map((member) => ({
      text: capitalizeInitialLetter(member),
      link: `/interviews/${member}`,
    })),
    {
      text: "Kaze & Zeina",
      link: "/interviews/kaze-zeina",
    },
  ];
}

function teamMemberSidebarItems(): DefaultTheme.SidebarItem[] {
  return [
    ...TEAM_MEMBERS.map((member) => ({
      text: capitalizeInitialLetter(member),
      link: `/interviews/${member}`,
    })),
    {
      text: "Kaze & Zeina",
      link: "/interviews/kaze-zeina",
    },
  ];
}
