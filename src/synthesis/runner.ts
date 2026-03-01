import type { SynthesisOptions } from "./shared";
import { runNarrativeArcs } from "./tasks/narrative-arcs";
import { runStoryThreads } from "./tasks/story-threads";
import { runTopicArcs } from "./tasks/topic-arcs";

/**
 * Omitted input fields (token budget optimizations):
 *
 * All tasks:
 * - `related_to` on stories/questions – redundant with text content
 *
 * Narrative arcs:
 * - `significance_reason` on summaries – tier label sufficient
 * - `context` on quotes – recoverable via stream_date cross-ref
 * - `challenge`/`outcome` on stories – summary is sufficient
 *
 * Story threads:
 * - `questions` on open questions – model generates its own
 *
 * Topic arcs:
 * - `quote` on findings – absent from output schema
 */

export async function runSynthesisTask(options: SynthesisOptions) {
  const { task } = options;

  switch (task) {
    case "story-threads":
      return runStoryThreads(options);
    case "narrative-arcs":
      return runNarrativeArcs(options);
    case "topic-arcs":
      return runTopicArcs(options);
  }
}
