import type { TopicArc, TopicArcs } from "../schemas";
import type { SynthesisOptions } from "../shared";
import { hash } from "ohash";
import { createCSV, template } from "utilful";
import { CORE_CONTRIBUTORS } from "../../constants";
import { cachedGenerate } from "../cache";
import {
  DOCUMENTARY_CONTEXT,
  TOPIC_ARC_REDUCE_PROMPT,
  TOPIC_ARC_SINGLE_PROMPT,
} from "../prompts";
import { TopicArcSchema } from "../schemas";
import { generateObject } from "../shared";

const FINDINGS_CHUNK_THRESHOLD = 500;

interface TopicFinding extends Record<string, unknown> {
  stream_date: string;
  summary: string;
}

export async function runTopicArcs(
  options: SynthesisOptions,
): Promise<TopicArcs> {
  const { model, streams, onProgress } = options;

  // Group all findings by topic (main + contributor findings)
  const findingsByTopic = new Map<string, TopicFinding[]>();

  for (const stream of streams) {
    for (const finding of stream.analysis.findings) {
      if (!findingsByTopic.has(finding.topic))
        findingsByTopic.set(finding.topic, []);
      findingsByTopic.get(finding.topic)!.push({
        stream_date: stream.rawDate,
        summary: finding.summary,
      });
    }

    for (const member of CORE_CONTRIBUTORS) {
      for (const finding of stream.analysis.contributor_findings[member]) {
        if (!findingsByTopic.has(finding.topic))
          findingsByTopic.set(finding.topic, []);
        findingsByTopic.get(finding.topic)!.push({
          stream_date: stream.rawDate,
          summary: `[${member}] ${finding.summary}`,
        });
      }
    }
  }

  const topics = [...findingsByTopic.keys()].sort();
  onProgress?.({ phase: "topic-start", total: topics.length });

  const arcs: TopicArc[] = [];
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i]!;
    const findings = findingsByTopic.get(topic)!;
    let arc: TopicArc | undefined;

    const topicKey = `topic-arcs:${hash({ topic, findings })}`;

    if (findings.length <= FINDINGS_CHUNK_THRESHOLD) {
      arc = await cachedGenerate(topicKey, () => {
        const prompt = template(TOPIC_ARC_SINGLE_PROMPT, {
          topic,
          findings: createCSV(findings),
        });
        return generateObject(
          model,
          TopicArcSchema,
          prompt,
          DOCUMENTARY_CONTEXT,
        );
      });
    } else {
      // Chunk large topics and merge via reduce
      const chunkCount = Math.ceil(findings.length / FINDINGS_CHUNK_THRESHOLD);
      const chunkSize = Math.ceil(findings.length / chunkCount);

      const chunkResults: TopicArc[] = [];
      for (let chunkIndex = 0; chunkIndex < chunkCount; chunkIndex++) {
        const chunk = findings.slice(
          chunkIndex * chunkSize,
          (chunkIndex + 1) * chunkSize,
        );
        const chunkKey = `topic-arcs:map:${hash({ topic, chunkIndex, chunk })}`;
        const result = await cachedGenerate(chunkKey, () => {
          const prompt = template(TOPIC_ARC_SINGLE_PROMPT, {
            topic,
            findings: createCSV(chunk),
          });
          return generateObject(
            model,
            TopicArcSchema,
            prompt,
            DOCUMENTARY_CONTEXT,
          );
        });
        if (result) chunkResults.push(result);
      }

      if (chunkResults.length === 1) {
        arc = chunkResults[0];
      } else if (chunkResults.length > 1) {
        arc = await cachedGenerate(topicKey, () => {
          const reducePrompt = template(TOPIC_ARC_REDUCE_PROMPT, {
            topic,
            candidate_arcs: JSON.stringify(chunkResults),
          });
          return generateObject(
            model,
            TopicArcSchema,
            reducePrompt,
            DOCUMENTARY_CONTEXT,
          );
        });
      }
    }

    if (arc) arcs.push(arc);

    onProgress?.({
      phase: "topic-done",
      index: i + 1,
      total: topics.length,
      name: topic,
    });
  }

  return { arcs };
}
