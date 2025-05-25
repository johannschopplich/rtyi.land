import { defineConfig } from "vitepress";
import * as fsp from "fs/promises";
import { DATA_DIR, MODEL_LABELS } from "../../src/constants";

const SLUGIFIED_MODEL_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(MODEL_LABELS).map(([key, value]) => [
    key.replaceAll(".", "-"),
    value,
  ])
);

export default async () => {
  const modelNavItems = await getModelNavItems();

  return defineConfig({
    title: "RTYI Documentary",
    description: "Research and Stream Analysis",

    themeConfig: {
      nav: [
        { text: "Home", link: "/" },
        { text: "Streams", items: modelNavItems },
      ],

      sidebar: [
        {
          text: "Research",
          items: [
            {
              text: "Video Game Documentary Summary",
              link: "/research/video-game-documentary-summary",
            },
          ],
        },
        {
          text: "Stream Analysis",
          items: modelNavItems,
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
    const modelDirs = await fsp.readdir(DATA_DIR, { withFileTypes: true });

    return modelDirs
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => ({
        text: SLUGIFIED_MODEL_LABELS[dirent.name],
        link: `/streams/${dirent.name}`,
      }));
  } catch (error) {
    console.warn(`Could not read model directories from ${DATA_DIR}:`, error);
    return [];
  }
}
