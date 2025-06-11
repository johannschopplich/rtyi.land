import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Return To Yoshi's Island Documentary",
  description:
    "Beyond the cartridge: My personal space for researching and preparing the Return to Yoshi's Island documentary.",

  head: [
    [
      "link",
      { rel: "icon", href: "/logo.svg", sizes: "any", type: "image/svg+xml" },
    ],
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
      message: "Made for internal use only by Johann Schopplich.",
    },
  },
});
