import { defineConfig } from "vitepress";

export default defineConfig({
  title: "RTYI Documentary",
  description: "Research and Stream Analysis",

  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Narrative Arc", link: "/drafts/narrative-arc" },
      { text: "Interview Questions", link: "/drafts/interview-questions" },
    ],

    sidebar: [
      {
        text: "Drafts",
        items: [
          {
            text: "Narrative Arc",
            link: "/drafts/narrative-arc",
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
        text: "Questions",
        items: [
          {
            text: "Questions & Narrative Arc",
            link: "/questions/summary-and-narrative-arc",
          },
          { text: "Generated Questions", link: "/questions" },
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
