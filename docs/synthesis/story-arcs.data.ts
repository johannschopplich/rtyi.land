import type { TeamMember } from "../../src/analysis/schemas";
import { defineLoader } from "vitepress";
import { loadSynthesisFile } from "../.vitepress/utils";

export interface StoryArcQuote {
  speaker: string;
  quote: string;
  context: string;
  stream_date: string;
}

export interface StoryArcQuestion {
  question: string;
  target: "kaze" | "biobak" | "badub" | "kaze_zeina";
  context: string;
  evidence: string[];
}

export interface StoryArc {
  title: string;
  summary: string;
  narrative_value: string;
  challenge: string;
  process: string;
  outcome: string;
  key_quotes: StoryArcQuote[];
  interview_questions: StoryArcQuestion[];
  related_to: TeamMember[];
  source_streams: string[];
}

export interface StoryArcsData {
  arcs: StoryArc[];
}

export default defineLoader({
  async load(): Promise<StoryArcsData | null> {
    return loadSynthesisFile<StoryArcsData>("story-arcs.json");
  },
});
