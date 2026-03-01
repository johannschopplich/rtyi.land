import type { NarrativeArcs } from "../schemas";
import type { SynthesisOptions } from "../shared";
import { hash } from "ohash";
import { estimateTokenCount } from "tokenx";
import { createCSV, template } from "utilful";
import { CORE_CONTRIBUTORS } from "../../constants";
import { cachedGenerate } from "../cache";
import { DOCUMENTARY_CONTEXT, NARRATIVE_ARCS_PROMPT } from "../prompts";
import { NarrativeArcsSchema } from "../schemas";
import { generateObject } from "../shared";

/**
 * Token budget for the narrative arcs single-prompt path.
 * GPT-5.2 supports ~400K tokens; leave headroom for output + system.
 */
const TOKEN_BUDGET = 350_000;

/**
 * Topics whose medium-importance findings are shed first when over budget.
 * These two categories account for ~70% of all findings but are dominated by
 * routine technical/design details – personal, team, and philosophy findings
 * carry more narrative texture per token.
 */
const EXPENDABLE_TOPICS = new Set(["design", "technical", "milestone"]);

interface NarrativeFinding {
  stream_date: string;
  topic: string;
  importance: string;
  summary: string;
}

export async function runNarrativeArcs(
  options: SynthesisOptions,
): Promise<NarrativeArcs | undefined> {
  const { model, streams, dateRange, onProgress } = options;

  // Collect all data for a single holistic prompt
  const streamSummaries = streams.map((stream) => ({
    stream_date: stream.rawDate,
    summary: stream.analysis.stream_context.summary,
    significance: stream.analysis.stream_context.significance,
  }));

  const findings = streams.flatMap((stream) =>
    stream.analysis.findings
      .filter((finding) => finding.importance !== "low")
      .map((finding) => ({
        stream_date: stream.rawDate,
        topic: finding.topic,
        importance: finding.importance,
        summary: finding.summary,
      })),
  );

  const contributorFindings = streams.flatMap((stream) =>
    CORE_CONTRIBUTORS.flatMap((member) =>
      stream.analysis.contributor_findings[member]
        .filter((finding) => finding.importance !== "low")
        .map((finding) => ({
          stream_date: stream.rawDate,
          topic: finding.topic,
          importance: finding.importance,
          summary: `[${member}] ${finding.summary}`,
        })),
    ),
  );

  const allFindings: NarrativeFinding[] = [...findings, ...contributorFindings];

  const stories = streams.flatMap((stream) =>
    stream.analysis.key_stories.map((story) => ({
      stream_date: stream.rawDate,
      title: story.title,
      summary: story.summary,
    })),
  );

  const quotes = streams.flatMap((stream) =>
    stream.analysis.memorable_quotes.map((quote) => ({
      stream_date: stream.rawDate,
      speaker: quote.speaker,
      quote: quote.quote,
    })),
  );

  // Build prompt, applying tiered budget fallback if needed.
  // Tier 1: all findings (main + contributor).
  // Tier 2: drop medium-importance from expendable topics (design/technical/milestone).
  // Tier 3: drop ALL medium-importance findings (high-only).
  const tiers: (() => NarrativeFinding[])[] = [
    () => allFindings,
    () =>
      allFindings.filter(
        (finding) =>
          !EXPENDABLE_TOPICS.has(finding.topic) ||
          finding.importance === "high",
      ),
    () => allFindings.filter((f) => f.importance === "high"),
  ];

  let selectedFindings = allFindings;
  let fullPrompt = "";
  let selectedTier = 1;

  for (let i = 0; i < tiers.length; i++) {
    selectedFindings = tiers[i]!();
    const csvFindings = selectedFindings.map(
      ({ importance: _, ...rest }) => rest,
    );

    fullPrompt = template(NARRATIVE_ARCS_PROMPT, {
      date_range: dateRange,
      stream_summaries: createCSV(streamSummaries),
      findings: createCSV(csvFindings),
      stories: createCSV(stories),
      quotes: createCSV(quotes),
    });
    selectedTier = i + 1;

    if (estimateTokenCount(fullPrompt) <= TOKEN_BUDGET) break;
  }

  const finalTokenCount = estimateTokenCount(fullPrompt);
  onProgress?.({
    phase: "single-prompt-start",
    tokens: finalTokenCount,
    tier: selectedTier,
    totalFindings: allFindings.length,
    selectedFindings: selectedFindings.length,
  });

  const cacheKey = `narrative-arcs:${hash(fullPrompt)}`;
  return cachedGenerate(cacheKey, () =>
    generateObject(model, NarrativeArcsSchema, fullPrompt, DOCUMENTARY_CONTEXT),
  );
}
