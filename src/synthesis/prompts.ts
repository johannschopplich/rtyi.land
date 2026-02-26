// #region context
const DOCUMENTARY_CONTEXT = `
You are a senior documentary researcher preparing for a feature-length documentary about "Return to Yoshi's Island," an ambitious Mario 64 ROM hack led by Kaze Emanuar. You have been given structured analysis data extracted from Kaze's development streams.

The documentary will be based on 1–2 hour interviews with:
- Kaze Emanuar: Lead developer (vision, coding, design), heart and soul of the project
- Biobak: Graphics artist and level designer
- Badub: Composer
- Kaze & Zeina together: Zeina is an animator/artist and Kaze's wife – their creative/personal partnership is a key documentary thread

Your job is to synthesize the raw per-stream data into a curated briefing that a documentary filmmaker can actually use. Quality over quantity. Every item you include should earn its place.`;

const QUOTE_USE_CASE_GUIDE = `
- narration: Could be read by a narrator over footage. Philosophical or reflective.
- trailer: Punchy, could open or close a 2-minute trailer. High emotional or dramatic impact.
- chapter-title: Short enough to serve as a section heading. Captures a theme.
- character-moment: Reveals personality – humor, frustration, joy. Best as a direct-to-camera moment.
- emotional-beat: Raw emotional moment – breakthrough, setback, vulnerability. The "lean forward" moments.`;
// #endregion context

// #region questions
export const INTERVIEW_QUESTIONS_PROMPT = `
${DOCUMENTARY_CONTEXT}

## Task: Generate Deduplicated Interview Questions

You are given all open questions, findings, and key stories from development streams spanning {date_range}. Many topics recur across streams – deduplicate, merge, and rank them into the best possible question set for each interviewee.

### Guidelines

- Merge similar questions: If 15 streams ask about "release timeline," produce 1 excellent question with rich context, not 15 variants.
- Frame for conversation: Open-ended questions that invite storytelling. Avoid yes/no. Use "Tell me about…", "Walk me through…", "What was going through your mind when…" framing.
- Provide evidence: Reference specific stream moments so the interviewer can say "I saw in your June 2024 stream that…"
- Volume targets: Aim for roughly 50% essential, 35% important, 15% nice-to-have.
- Priority calibration: "Essential" means the interview would feel incomplete without this question – a core biographical or thematic question. With a 1.5-hour interview covering ~15 questions, only about half of each set can truly be essential. If a question is interesting but the documentary would survive without it, it’s "important," not "essential." Reserve "nice-to-have" for genuinely optional deep-dives.

### Existing Interview Questions (already prepared)

The filmmaker already has these prepared question sets. DO NOT duplicate these – complement them with questions informed by stream evidence:

{existing_questions}

### Stream Data

<open_questions>
{open_questions}
</open_questions>

<findings>
{findings}
</findings>

<key_stories>
{key_stories}
</key_stories>
`;

export const INTERVIEW_QUESTIONS_REDUCE_PROMPT = `
${DOCUMENTARY_CONTEXT}

## Task: Merge and Deduplicate Interview Questions

You are given candidate interview questions from multiple analysis batches, each generated from a different subset of development streams (full project span: {date_range}). Many questions overlap or cover similar ground across batches.

### Guidelines

- Merge duplicates: If the same topic appears in multiple batches, produce one excellent question that combines the best framing and richest evidence from all versions.
- Rank rigorously by priority. Target roughly 50% essential, 35% important, 15% nice-to-have.
- Priority calibration: "Essential" means the interview would feel incomplete without this question. With a 1.5-hour interview covering ~15 questions, only about half of each set can truly be essential. If a question is interesting but the documentary would survive without it, it’s "important," not "essential." Reserve "nice-to-have" for genuinely optional deep-dives.
- Ensure timeline coverage: The final set should span the full project timeline, not over-represent any one period.
- Evidence: Combine evidence references from all batches that mention the same topic.
- Target volume: ~25–35 questions for Kaze, ~15–25 for each other interviewee. The filmmaker wants a selection pool, not a minimal shortlist – give enough variety to choose from.

### Existing Interview Questions (already prepared – DO NOT duplicate)

{existing_questions}

### Candidate Questions

<candidate_questions>
{candidate_questions}
</candidate_questions>
`;
// #endregion questions

// #region quotes
export const CURATED_QUOTES_PROMPT = `
${DOCUMENTARY_CONTEXT}

## Task: Curate the Best Quotes for the Documentary

You are given quotes extracted from development streams. Select a generous pool of the strongest quotes for documentary use – the filmmaker wants enough variety to choose from, not a pre-decided shortlist.

Note: These streams feature Kaze talking to camera. Most quotes will be from Kaze. Occasionally he reads chat messages or Zeina speaks in the background – include those when they’re strong, but don’t expect many non-Kaze speakers.

### Selection Criteria

- Standalone power: Should resonate without needing 5 minutes of context.
- Character revelation: Shows who Kaze (or the speaker) really is – values, fears, humor, obsession.
- Emotional impact: Makes viewers feel something – determination, wonder, vulnerability, joy.
- Variety: Cover different emotional registers and project phases. Include different use cases (narration, trailer, chapter-title, character-moment, emotional-beat) – aim for at least 6–8 quotes per use case category.
- Deduplication: If Kaze says the same thing in 3 streams, pick the single best version.
- Volume: From 200+ streams, aim for 40–60 quotes. Err on the side of surfacing more – it’s easier to cut than to re-find a great quote later.

### Use Case Definitions
${QUOTE_USE_CASE_GUIDE}

### Quotes Data

<quotes>
{quotes}
</quotes>
`;

export const CURATED_QUOTES_REDUCE_PROMPT = `
${DOCUMENTARY_CONTEXT}

## Task: Merge and Curate the Best Quotes

You are given candidate quote selections from multiple analysis batches. Each batch pre-selected strong quotes from a different subset of streams. Now produce the final curated list.

Note: These streams feature Kaze talking to camera, so most quotes are from Kaze. That’s expected.

### Guidelines

- Remove duplicates: The same quote (or near-identical wording from different streams) should appear only once. Pick the best version.
- Ensure variety: Cover different emotional registers and project phases. Ensure every use case category has at least 6–8 quotes.
- Selection criteria:
  - Standalone power: Should resonate without needing 5 minutes of context.
  - Character revelation: Shows who Kaze (or the speaker) really is – values, fears, humor, obsession.
  - Emotional impact: Makes viewers feel something – determination, wonder, vulnerability, joy.
  - Deduplication: If Kaze says the same thing in multiple streams, pick the single best version.
- Re-evaluate use cases: A quote that was labeled "character-moment" in one batch might actually work better as a "trailer" quote when you see the full picture.
- Volume: Aim for 40–60 final quotes. The filmmaker wants a selection pool to choose from, not a minimal shortlist. From 200+ streams of raw material, 18 quotes is far too few – be generous.

### Use Case Definitions
${QUOTE_USE_CASE_GUIDE}

### Candidate Quotes

<candidate_quotes>
{candidate_quotes}
</candidate_quotes>
`;
// #endregion quotes

// #region stories
export const STORY_HIGHLIGHTS_PROMPT = `
${DOCUMENTARY_CONTEXT}

## Task: Rank and Curate the Best Narrative Stories

You are given story arcs extracted from development streams. Select and rank the strongest for documentary use. The filmmaker wants a generous selection pool to choose from – surface enough stories to provide real editorial choice.

### Selection Criteria

- Narrative completeness: Stories with emotional weight and clear structure rank higher.
- Documentary relevance: Stories that illuminate why someone builds something this ambitious on decade-old hardware.
- Character depth: Stories involving multiple team members, or showing unexpected sides of a person.
- Cross-stream arcs: Some stories span multiple streams (e.g., a boss fight that took 5 weeks). Merge these into single, richer stories.
- Deduplication: Many stories recur across adjacent streams. Merge duplicates into one entry, combining the best elements.
- Volume: Aim for 20–35 stories. Include stories at different scales – from multi-month sagas to single-stream turning points.

### Stories Data

<stories>
{stories}
</stories>
`;

export const STORY_HIGHLIGHTS_REDUCE_PROMPT = `
${DOCUMENTARY_CONTEXT}

## Task: Merge and Rank the Best Narrative Stories

You are given candidate story selections from multiple analysis batches. Each batch identified the strongest narrative arcs from a different subset of streams. Now produce the definitive ranked list.

### Guidelines

- Merge duplicate stories: Many stories span multiple streams and will appear in multiple batches. Combine them into a single, richer entry.
- Re-rank holistically: Now that you have candidates from the full timeline, rank by overall documentary value.
- Selection criteria:
  - Narrative completeness: Stories with emotional weight and clear structure rank higher.
  - Documentary relevance: Stories that illuminate why someone builds something this ambitious on decade-old hardware.
  - Character depth: Stories involving multiple team members, or showing unexpected sides of a person.
  - Cross-stream arcs: Some stories span multiple streams (e.g., a boss fight that took 5 weeks). Merge these into single, richer stories.
  - Deduplication: Many stories recur across adjacent streams. Merge duplicates into one entry, combining the best elements.
- Preserve cross-stream arcs: Stories that build across batches (e.g., a boss fight spanning weeks) should be merged into one entry.
- Volume: Aim for 20–35 stories. The filmmaker wants enough to pick from, not a pre-decided shortlist of 10. Include stories at different scales – multi-month sagas and single-stream turning points.

### Candidate Stories

<candidate_stories>
{candidate_stories}
</candidate_stories>
`;
// #endregion stories

// #region topics
export const TOPIC_ARC_SINGLE_PROMPT = `
${DOCUMENTARY_CONTEXT}

## Task: Write a Narrative Arc Summary for the "{topic}" Topic

You are given all findings tagged under the "{topic}" topic across the full set of development streams. Write a narrative summary that traces how this topic evolved over the project's lifetime.

### Guidelines

- Write as a briefing: The narrative summary should read like a researcher's memo to the director – factual but structured with a beginning, middle, and current state.
- Prioritize findings that would surprise the director or challenge assumptions – not just the technically impressive ones.
- Note how the topic evolved across the project – early explorations vs. settled approaches, shifting priorities, or recurring frustrations.


### Findings for "{topic}"

<findings>
{findings}
</findings>
`;

export const TOPIC_ARC_REDUCE_PROMPT = `
${DOCUMENTARY_CONTEXT}

## Task: Merge Narrative Arc Summaries for the "{topic}" Topic

You are given multiple narrative arc summaries for the same topic, each generated from a different chunk of findings. Merge them into a single, definitive narrative arc.

### Guidelines

- Merge, don't concatenate: Produce one cohesive narrative summary that traces the full evolution of this topic, not a patchwork of chunk summaries.
- Combine top findings: Deduplicate and select the strongest findings across all chunks. Keep the most important ones up to the schema limit.
- Merge key themes: Unify overlapping themes into a single set.


### Candidate Summaries

<candidate_arcs>
{candidate_arcs}
</candidate_arcs>
`;
// #endregion topics
