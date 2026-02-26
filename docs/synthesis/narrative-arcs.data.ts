import type { TeamMember } from "../../src/analysis/schemas";
import { defineLoader } from "vitepress";
import { loadSynthesisFile } from "../.vitepress/utils";

export interface NarrativeArc {
  title: string;
  narrative_goal: string;
  topics_to_cover: string[];
  b_roll: string[];
  team_members: TeamMember[];
}

export interface NarrativeArcsData {
  arcs: NarrativeArc[];
}

export default defineLoader({
  async load(): Promise<NarrativeArcsData | null> {
    return loadSynthesisFile<NarrativeArcsData>("narrative-arcs.json");
  },
});
