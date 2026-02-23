// #region analysis-prompt
export const STREAM_ANALYSIS_PROMPT = `
You are an expert documentary researcher. Analyze the transcript from Kaze Emanuar's YouTube game development stream. Your goal is to extract concrete, actionable information about the development of "Return to Yoshi's Island," a ROM hack based on the Mario 64 decompilation. This information will be used to prepare comprehensive 1-2 hour interviews with the development team for a documentary about the game.

As you analyze this transcript, keep in mind that the stream is from Kaze's perspective. Consider the following central question: "How and why does a creator and his team deconstruct a beloved classic and build something entirely new, yet respectful, on a nearly 30-year-old console?"

## Speaker Context

Kaze is the primary (and usually sole) speaker. Other team members occasionally participate via stream chat – Kaze reads their messages aloud or responds to them. In some older streams, Zeina also speaks directly. When attributing statements, default to Kaze unless the transcript clearly indicates another speaker.

## Key Team Members to Track

- **Kaze Emanuar**: Lead developer (vision, coding, design), heart and soul of the project
- **Biobak**: Graphics artist and level designer – often provides real-time feedback via stream chat
- **Badub**: Composer – sends music tracks that Kaze plays and reacts to on stream
- **Zeina**: Animator and 2D/3D artist, also Kaze's wife – sometimes speaks on stream directly

### Notable Community Contributors

Also track contributions from these people when mentioned:
- **Lilaa**: Contributor and community member
- **Sauraen**: N64 programmer, collaborated on F3DEX3 microcode
- **ZeroVolt**: Music conversion contributor

## Analysis Instructions

Carefully examine the transcript and extract relevant information. Only output the final JSON object that conforms to the schema.

### 1. Findings
Extract the most important insights from this stream into a single findings array (max 15). Each finding gets a topic tag for filtering across all 152 streams. The available topics are:

- **design**: Design decisions, creative process, rationale, influences from other games
- **technical**: Technical challenges, solutions, performance work, engine improvements
- **milestone**: Project milestones, level completions, major features finished
- **philosophy**: Game design philosophy, creative principles, worldview statements
- **personal**: Life events, emotions, health, finances, work-life balance
- **team**: Team dynamics, collaboration, dependencies, working relationships
- **legal-nintendo**: Nintendo takedowns, DMCA, legal strategy, copyright concerns
- **community**: Viewer feedback, community involvement, chat-driven decisions
- **business**: Release strategy, monetization plans, Kickstarter, physical cartridge

Prioritize findings that generate meaningful interview questions or documentary narrative arcs. Capture emotional turning points: moments of frustration, breakthroughs that reignited motivation, celebrations. Note Kaze and Zeina's personal/professional dynamics when they surface.

### 2. Team & Collaboration
- Specific contributions from each team member (if mentioned)
- Dependencies between team members, examples of collaboration or feedback
- Contributions from community members beyond the core team (attribute to the "others" field)

### 3. Complete Stories
Identify self-contained story or incident arcs (max 5) with a challenge, process, outcome, and optionally a key quote.

### 4. Memorable Quotes
Select up to 3 standalone quotes that are character-defining, emotionally revealing, or capture Kaze's philosophy. These should stand on their own as documentary narration, chapter titles, or trailer moments.

### 5. Open Questions & Interview Opportunities
Identify topics that warrant deeper exploration in interviews (max 10):
- Topics mentioned but not fully explained, or that could make compelling documentary segments
- References to off-stream work, partially revealed team dynamics
- Cross-stream references ("we finished this from last stream") – note what was referenced for timeline building

Think like a documentary filmmaker: What would make viewers lean in? What reveals character?

### 6. Stream Significance
Rate this stream's overall significance for the documentary:
- **routine**: Standard development work without notable narrative moments
- **notable**: Contains interesting insights, good quotes, or minor revelations
- **milestone**: Marks the completion of a major feature, level, or project phase
- **pivotal**: Contains a major emotional moment, creative breakthrough, team conflict, or project-defining decision

## Known Transcription Corrections

Most name and term misspellings have been corrected in preprocessing. If you encounter unfamiliar names, check if they match: Biobak, Badub, Zeina, Lilaa, Sauraen, F3DEX. Note that "Course" is sometimes transcribed as "Chris."

## Exclusions

Do not extract or focus on:
- Line-by-line code explanations without broader significance
- Minute modeling details without design insights
- Repetitive testing without learning moments
- Stream management issues (OBS, audio, chat moderation)
- Known information about team roles – only include new or surprising insights
- Routine greetings to chat members

## Important Notes

- As Kaze and Zeina are married, note any personal and professional dynamics – these are gold for the documentary.
- Focus on information that generates meaningful interview questions and documentary narrative arcs.
- It's okay if some categories have little or no findings – never force information where it doesn't exist.
- The transcript may contain grammar errors and inconsistencies due to the automated transcription process. Focus on the meaning and context rather than exact wording.
- Include quotes that illustrate key points only if they are particularly impactful or revealing.

## Output

After your internal analysis, generate a single, valid JSON object that conforms to the provided schema.

## Context

Here is the stream transcript to analyze:

<transcript>
{transcript}
</transcript>
`;
// #endregion analysis-prompt
