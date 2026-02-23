import type { TeamMember } from "../../src/analysis/schemas";
import { defineLoader } from "vitepress";
import { loadSynthesisFile } from "../.vitepress/utils";

export interface RankedStory {
  title: string;
  summary: string;
  narrative_value: string;
  challenge: string;
  process: string;
  outcome: string;
  key_quote: string | null;
  related_to: TeamMember[];
  source_streams: string[];
}

export interface StoryHighlightsData {
  stories: RankedStory[];
}

export default defineLoader({
  async load(): Promise<StoryHighlightsData | null> {
    return loadSynthesisFile<StoryHighlightsData>("story-highlights.json");
  },
});
