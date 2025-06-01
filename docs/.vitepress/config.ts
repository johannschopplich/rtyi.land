import { defineConfig } from "vitepress";
import * as fsp from "fs/promises";
import { STREAMS_DIR, MODEL_LABELS } from "../../src/constants";

const SLUGIFIED_MODEL_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(MODEL_LABELS).map(([key, value]) => [
    key.replaceAll(".", "-"),
    value,
  ]),
);

export default async () => {
  const modelNavItems = await getModelNavItems();

  return defineConfig({
    title: "RTYI Documentary",
    description: "Research and Stream Analysis",

    themeConfig: {
      nav: [
        { text: "Home", link: "/" },
        { text: "Stream Analysis", items: modelNavItems },
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
      ],

      sidebar: [
        {
          text: "Research",
          items: [
            {
              text: "Video Game Documentary Summary",
              link: "/research/video-game-documentaries",
            },
          ],
        },
        {
          text: "Stream Analysis",
          items: [
            {
              text: "Overview",
              link: "/streams",
            },
            ...modelNavItems,
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

      socialLinks: [
        {
          icon: "github",
          link: "https://github.com/johannschopplich/rtyi-doc",
        },
      ],
    },
  });
};

async function getModelNavItems() {
  try {
    const modelDirs = await fsp.readdir(STREAMS_DIR, { withFileTypes: true });

    return modelDirs
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => ({
        text: SLUGIFIED_MODEL_LABELS[dirent.name],
        link: `/streams/${dirent.name}`,
      }));
  } catch (error) {
    console.warn(
      `Could not read model directories from ${STREAMS_DIR}:`,
      error,
    );
    return [];
  }
}
