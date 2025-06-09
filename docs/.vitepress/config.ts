import { defineConfig } from "vitepress";

export default defineConfig({
  title: "RTYI Documentary",
  description: "Research and Preparation",

  themeConfig: {
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
