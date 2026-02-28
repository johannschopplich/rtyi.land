import type { TeamMember } from "../../src/analysis/schemas";
import { defineLoader } from "vitepress";
import { loadSynthesisFile } from "../.vitepress/utils";

export interface StoryThreadQuote {
  speaker: string;
  quote: string;
  context: string;
  stream_date: string;
}

export interface StoryThreadQuestion {
  question: string;
  target: "kaze" | "biobak" | "badub" | "kaze_zeina";
  rationale: string;
  source_streams: string[];
}

export interface StoryThread {
  title: string;
  summary: string;
  narrative_value: string;
  challenge: string;
  process: string;
  outcome: string;
  key_quotes: StoryThreadQuote[];
  interview_questions: StoryThreadQuestion[];
  related_to: TeamMember[];
  source_streams: string[];
}

export interface StoryThreadsData {
  arcs: StoryThread[];
}

export default defineLoader({
  async load(): Promise<StoryThreadsData | null> {
    return loadSynthesisFile<StoryThreadsData>("story-threads.json");
  },
});
