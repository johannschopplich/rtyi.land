import type { DefaultTheme } from "vitepress";
import type { TeamMember } from "../../src/schemas";
import { defineConfig } from "vitepress";
import { description, name, ogImage, ogUrl, twitterImage } from "./meta";
import { capitalizeInitialLetter } from "./shared";

const RTYI_TEAM_MEMBERS: TeamMember[] = ["kaze", "biobak", "badub", "zeina"];

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
      {
        text: "Documentary Prep",
        items: [
          { text: "Overview", link: "/synthesis" },
          { text: "Interview Prep", link: "/synthesis/interview-prep" },
          { text: "Story Highlights", link: "/synthesis/stories" },
          { text: "Curated Quotes", link: "/synthesis/quotes" },
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
          { text: "All Quotes", link: "/quotes" },
        ],
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
        text: "Documentary Prep",
        items: [
          {
            text: "Overview",
            link: "/synthesis",
          },
          {
            text: "Interview Prep",
            link: "/synthesis/interview-prep",
          },
          {
            text: "Story Highlights",
            link: "/synthesis/stories",
          },
          {
            text: "Curated Quotes",
            link: "/synthesis/quotes",
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
          {
            text: "All Quotes",
            link: "/quotes",
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
    ...RTYI_TEAM_MEMBERS.map((member) => ({
      text: capitalizeInitialLetter(member),
      link: `/interviews/${member}`,
    })),
    {
      text: "Kaze & Zeina",
      link: "/interviews/kaze-zeina",
    },
  ];
}
