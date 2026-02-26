// #region context
export const DOCUMENTARY_CONTEXT = `
You are a senior documentary researcher preparing for a feature-length documentary about "Return to Yoshi's Island," an ambitious Mario 64 ROM hack led by Kaze Emanuar. You have been given structured analysis data extracted from Kaze's development streams.

The documentary will be based on 1–2 hour interviews with:
- Kaze Emanuar: Lead developer (vision, coding, design), heart and soul of the project
- Biobak: Graphics artist and level designer
- Badub: Composer
- Kaze & Zeina together: Zeina is an animator/artist and Kaze's wife – their creative/personal partnership is a key documentary thread

Central question driving the documentary: "How and why does a creator and his team deconstruct a beloved classic and build something entirely new, yet respectful, on a nearly 30-year-old console?"

Frame everything for a global audience unfamiliar with ROM hacking. Viewers who have never heard of a ROM hack should still emotionally resonate with the story. Avoid jargon; when technical detail is necessary, anchor it in human motivation ("he rewrote the collision system because…").

Your job is to synthesize the raw per-stream data into a curated briefing that a documentary filmmaker can actually use. Quality over quantity. Every item you include should earn its place.`;
// #endregion context

// #region story-arcs
export const STORY_ARCS_PROMPT = `
## Task: Build Story Arcs with Embedded Interview Questions and Quotes

You are given stories, quotes, and open questions from development streams spanning {date_range}. Your job is to produce **arc-first** story units – each arc is the primary structure, with the best interview questions and supporting quotes attached to it.

### What Makes a Great Arc

- **Narrative completeness:** A clear challenge → process → outcome structure with emotional weight.
- **Documentary relevance:** Illuminates why someone builds something this ambitious on decade-old hardware.
- **Character depth:** Shows unexpected sides of a person, or reveals the dynamics between team members.
- **Accessibility:** A viewer who has never heard of ROM hacking should understand and care about this story.

Each arc should include the strongest supporting quotes (evidence, not decoration) and interview questions that invite storytelling. Target the right person for each question – Kaze for technical/vision arcs, Biobak for visual/design arcs, Badub for audio arcs, kaze_zeina for partnership arcs. Reference specific stream moments as evidence.

### Deduplication

- Many stories recur across adjacent streams. Merge duplicates into one arc, combining the best elements.
- Cross-stream arcs (e.g. a boss fight that took 5 weeks) should be merged into a single, richer entry.

Include arcs at different scales – from multi-month sagas to single-stream turning points. The filmmaker wants a selection pool, not a pre-decided shortlist.

### Stream Data

<stories>
{stories}
</stories>

<quotes>
{quotes}
</quotes>

<open_questions>
{open_questions}
</open_questions>

<findings>
{findings}
</findings>
`;

export const STORY_ARCS_REDUCE_PROMPT = `
## Task: Merge and Rank Story Arcs

You are given candidate story arcs from multiple analysis batches, each generated from a different subset of development streams (full project span: {date_range}). Many arcs overlap or cover the same ground.

### Guidelines

- **Merge duplicates:** If the same story appears in multiple batches, produce one excellent arc that combines the best framing, richest quotes, and strongest questions from all versions.
- **Re-rank holistically:** Now that you see candidates from the full timeline, rank by overall documentary value.
- **Preserve cross-stream arcs:** Stories that build across batches (e.g. a boss fight spanning weeks) should be merged into one entry with combined source streams.
- **Deduplicate questions and quotes:** Keep the single best version. Place quotes in the arc where they have the most narrative impact.
- **Ensure timeline coverage:** The final set should span the full project timeline, not over-represent any one period.

### Candidate Arcs

<candidate_arcs>
{candidate_arcs}
</candidate_arcs>
`;
// #endregion story-arcs

// #region narrative-arcs
export const NARRATIVE_ARCS_PROMPT = `
## Task: Create a Thematic Filming Roadmap

You are given summaries, findings, stories, and quotes from all development streams spanning {date_range}. Your job is to produce a **filmmaker's roadmap** – a set of thematic arcs that together tell the documentary's story.

### Documentary Approach

The story lives in the people – their passion, challenges, and how they perceive each other's work. Interviews should feel like conversations, anchored in concrete moments (a specific level, a bug, a stream). Viewers who have never heard of a ROM hack must emotionally connect. B-roll should make the creative process tangible – screen recordings of breakthroughs, tools in action, before/after comparisons.

### What This Is

This is NOT a technical summary or a list of features. This is a **filming roadmap** – the document a director reads before shooting to understand:
- What major story threads exist
- What each thread achieves emotionally/thematically
- What specific topics and moments to explore on camera
- What visual material (B-roll) would bring each thread to life

### Guidelines

- **Think like a filmmaker, not an engineer.** "Kaze rewrote the collision system" is engineering. "A single laggy level exposed fundamental flaws in the engine – and launched a years-long quest to rebuild everything from scratch" is storytelling.
- **Each arc should have a clear narrative goal** – what does the audience feel or understand after this section?
- **Topics to cover should be specific** – not "discuss the engine" but "the moment the Zoo level's lag became unbearable and what Kaze did about it."
- **B-roll suggestions should be concrete** – not "show gameplay" but "side-by-side of Zoo level at 10fps vs. smooth 30fps after engine rewrite."
- **Order arcs to tell a story** – the sequence should feel like a documentary structure, not an alphabetical list.

### Stream Data

<stream_summaries>
{stream_summaries}
</stream_summaries>

<findings>
{findings}
</findings>

<stories>
{stories}
</stories>

<quotes>
{quotes}
</quotes>
`;
// #endregion narrative-arcs

// #region topics
export const TOPIC_ARC_SINGLE_PROMPT = `
## Task: Write a Narrative Arc Summary for the "{topic}" Topic

You are given all findings tagged under the "{topic}" topic across the full set of development streams. Write a narrative summary that traces how this topic evolved over the project's lifetime.

### Guidelines

- Write as a briefing: The narrative summary should read like a researcher's memo to the director – factual but structured with a beginning, middle, and current state.
- Balance the what and the why – trace both the technical evolution (what was built, changed, or abandoned) and the human decisions that drove those shifts.
- Prioritize findings that would surprise the director or challenge assumptions – not just the technically impressive ones.
- Note how the topic evolved across the project – early explorations vs. settled approaches, shifting priorities, or recurring frustrations.

### Findings for "{topic}"

<findings>
{findings}
</findings>
`;

export const TOPIC_ARC_REDUCE_PROMPT = `
## Task: Merge Narrative Arc Summaries for the "{topic}" Topic

You are given multiple narrative arc summaries for the same topic, each generated from a different chunk of findings. Merge them into a single, definitive narrative arc.

### Guidelines

- Merge, don't concatenate: Produce one cohesive narrative summary that traces the full evolution of this topic, not a patchwork of chunk summaries.
- Balance the what and the why – preserve both the technical evolution and the human decisions behind shifts.
- Combine top findings: Deduplicate and select the strongest findings across all chunks. Keep the most important ones up to the schema limit.
- Merge key themes: Unify overlapping themes into a single set.

### Candidate Summaries

<candidate_arcs>
{candidate_arcs}
</candidate_arcs>
`;
// #endregion topics
