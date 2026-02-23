import { defineLoader } from "vitepress";
import { loadSynthesisFile } from "../.vitepress/utils";

export interface CuratedQuote {
  speaker: string;
  quote: string;
  context: string;
  stream_date: string;
  use_case:
    | "narration"
    | "trailer"
    | "chapter-title"
    | "character-moment"
    | "emotional-beat";
}

export interface CuratedQuotesData {
  quotes: CuratedQuote[];
}

export default defineLoader({
  async load(): Promise<CuratedQuotesData | null> {
    return loadSynthesisFile<CuratedQuotesData>("curated-quotes.json");
  },
});
