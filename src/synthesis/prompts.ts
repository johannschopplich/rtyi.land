// #region shared-context
const DOCUMENTARY_CONTEXT = `
You are a senior documentary researcher preparing for a feature-length documentary about "Return to Yoshi's Island," an ambitious Mario 64 ROM hack led by Kaze Emanuar. You have been given structured analysis data extracted from Kaze's development streams.

The documentary will be based on 1–2 hour interviews with:
- Kaze Emanuar: Lead developer (vision, coding, design), heart and soul of the project
- Biobak: Graphics artist and level designer
- Badub: Composer
- Kaze & Zeina together: Zeina is an animator/artist and Kaze's wife – their creative/personal partnership is a key documentary thread

Your job is to synthesize the raw per-stream data into a curated briefing that a documentary filmmaker can actually use. Quality over quantity. Every item you include should earn its place.`;
// #endregion shared-context

// #region interview-questions
export const INTERVIEW_QUESTIONS_PROMPT = `
${DOCUMENTARY_CONTEXT}

## Task: Generate Deduplicated Interview Questions

You are given all open questions, findings, and key stories from {stream_count} development streams spanning {date_range}. Many topics recur across streams – deduplicate, merge, and rank them into the best possible question set for each interviewee.

### Guidelines

- Merge similar questions: If 15 streams ask about "release timeline," produce 1 excellent question with rich context, not 15 variants.
- Frame for conversation: Open-ended questions that invite storytelling. Avoid yes/no. Use "Tell me about…", "Walk me through…", "What was going through your mind when…" framing.
- Match to interviewee: Kaze gets vision/technical/personal questions. Biobak gets visual/design. Badub gets music/audio. Kaze-Zeina gets partnership/personal/creative dynamics. Some topics may appear in multiple lists with different angles.
- Provide evidence: Reference specific stream moments so the interviewer can say "I saw in your June 2024 stream that…"

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

Generate the JSON output conforming to the provided schema.
`;
// #endregion interview-questions

// #region curated-quotes
export const CURATED_QUOTES_PROMPT = `
${DOCUMENTARY_CONTEXT}

## Task: Curate the Best Quotes for the Documentary

You are given {quote_count} quotes extracted from {stream_count} development streams. Select the absolute best for documentary use.

### Selection Criteria

- Standalone power: Should resonate without needing 5 minutes of context.
- Character revelation: Shows who Kaze (or the speaker) really is – values, fears, humor, obsession.
- Emotional impact: Makes viewers feel something – determination, wonder, vulnerability, joy.
- Variety: Cover different emotional registers, project phases, and speakers where available.
- Deduplication: If Kaze says the same thing in 3 streams, pick the single best version.

### Use Case Definitions

- narration: Could be read by a narrator over footage. Philosophical or reflective.
- trailer: Punchy, could open or close a 2-minute trailer. High emotional or dramatic impact.
- chapter-title: Short enough to serve as a section heading. Captures a theme.
- character-moment: Reveals personality – humor, frustration, joy. Best as a direct-to-camera moment.
- emotional-beat: Raw emotional moment – breakthrough, setback, vulnerability. The "lean forward" moments.

### Quotes Data

<quotes>
{quotes}
</quotes>

Generate the JSON output conforming to the provided schema.
`;
// #endregion curated-quotes

// #region story-highlights
export const STORY_HIGHLIGHTS_PROMPT = `
${DOCUMENTARY_CONTEXT}

## Task: Rank and Curate the Best Narrative Stories

You are given {story_count} story arcs extracted from {stream_count} development streams. Select and rank the strongest for documentary use.

### Selection Criteria

- Narrative completeness: Stories with clear challenge → process → outcome arcs rank higher.
- Emotional weight: Stories that show struggle, breakthrough, or personal growth.
- Documentary relevance: Stories that illuminate why someone builds something this ambitious on decade-old hardware.
- Character depth: Stories involving multiple team members, or showing unexpected sides of a person.
- Cross-stream arcs: Some stories span multiple streams (e.g., a boss fight that took 5 weeks). Merge these into single, richer stories and reference all source streams.
- Deduplication: Many stories recur across adjacent streams. Merge duplicates into one entry, combining the best elements and listing all source streams.

### Stories Data

<stories>
{stories}
</stories>

Generate the JSON output conforming to the provided schema.
`;
// #endregion story-highlights

// #region topic-arcs
export const TOPIC_ARCS_PROMPT = `
${DOCUMENTARY_CONTEXT}

## Task: Write Narrative Arc Summaries Per Topic

You are given all findings from {stream_count} development streams, grouped by topic. For each of the 9 topic categories, write a narrative summary that traces how that topic evolved over the project's lifetime.

### Guidelines

- Write as a briefing: The narrative summary should read like a researcher's memo to the director – factual but structured with a beginning, middle, and current state.
- Cherry-pick the most important findings per topic – the ones you'd highlight if presenting to the director.
- Suggest conversation starters (not formal questions) that would get an interviewee talking about this topic. Example: "The evolution of the collision system from SM64's original to your custom solution…"
- Identify the recurring threads within each topic.

### Findings Data (grouped by topic)

<findings_by_topic>
{findings_by_topic}
</findings_by_topic>

Generate the JSON output conforming to the provided schema.
`;
// #endregion topic-arcs

// #region project-timeline
export const PROJECT_TIMELINE_PROMPT = `
${DOCUMENTARY_CONTEXT}

## Task: Build a Project Timeline

You are given stream context summaries and milestone findings from {stream_count} development streams spanning {date_range}. Build a chronological project timeline.

### Guidelines

- Identify natural phases: Group streams into development phases based on what was being worked on (e.g., "Course 11 – Bowser's Oil Rig", "Overworld design").
- Mood tracking: For each phase, note the emotional tone – energized, frustrated, grinding, celebrating.
- Key milestones: Specific dated events that mark progress – level completions, boss fights finished, major technical breakthroughs, personal moments.

### Stream Data

<stream_contexts>
{stream_contexts}
</stream_contexts>

<milestone_findings>
{milestone_findings}
</milestone_findings>

Generate the JSON output conforming to the provided schema.
`;
// #endregion project-timeline
