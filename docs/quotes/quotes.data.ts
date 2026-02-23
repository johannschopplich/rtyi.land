import { defineLoader } from "vitepress";
import { loadStreamAnalyses } from "../.vitepress/utils";

export interface QuoteEntry {
  speaker: string;
  quote: string;
  context: string;
  streamDate: string;
  streamRawDate: string;
  streamId: string;
}

export default defineLoader({
  async load() {
    const entries = await loadStreamAnalyses();
    const quotes: QuoteEntry[] = [];

    for (const { analysis, rawDate, date, streamId } of entries) {
      for (const memorableQuote of analysis.memorable_quotes ?? []) {
        quotes.push({
          speaker: memorableQuote.speaker,
          quote: memorableQuote.quote,
          context: memorableQuote.context,
          streamDate: date,
          streamRawDate: rawDate,
          streamId,
        });
      }
    }

    quotes.sort((a, b) => a.streamRawDate.localeCompare(b.streamRawDate));

    return quotes;
  },
});
