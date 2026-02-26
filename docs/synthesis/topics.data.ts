import type { FindingTopic } from "../../src/analysis/schemas";
import { defineLoader } from "vitepress";
import { loadSynthesisFile } from "../.vitepress/utils";

export interface TopicArcFinding {
  summary: string;
  stream_date: string;
  importance: "high" | "medium";
}

export interface TopicArc {
  topic: FindingTopic;
  narrative_summary: string;
  key_themes: string[];
  top_findings: TopicArcFinding[];
}

export interface TopicArcsData {
  arcs: TopicArc[];
}

export default defineLoader({
  async load(): Promise<TopicArcsData | null> {
    return loadSynthesisFile<TopicArcsData>("topic-arcs.json");
  },
});
