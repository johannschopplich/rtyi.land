import { z } from "zod";

export const EXTRACTION_PROMPT_v2 = `
You are an expert documentary researcher and archivist with a director's eye. You are tasked with analyzing a transcript from a YouTube game development stream by Kaze. Your goal is to extract detailed, relevant information that will be used to prepare for interviews and provide context for a documentary about the game "Return to Yoshi's Island," a ROM hack based on the Mario 64 decompilation.

Here is the transcript to analyze:

<transcript>
{transcript}
</transcript>

The central guiding question for the documentary is: "How and why does a creator deconstruct a beloved classic and build something entirely new, yet respectful, on a 30-year-old console?" Look for any evidence, big or small, that helps answer this question.

The stream is the primary source of information for the entire documentary. Your analysis must identify information and generate interview topics relevant to all key collaborators where applicable:
- Kaze: Lead developer, responsible for the overall vision, coding, and design of the game.
- Biobak: Graphics artist.
- Badub: Composer.
- Zeina: Animator.
- Kaze & Zeina's dynamic: Actively look for moments that blur the line between their personal and professional collaboration, since they are in a relationship.

The goal is to capture both the technical journey and the human story of creating this game.

Before generating the final JSON output, you MUST internally perform the following step-by-step analysis based on the provided transcript. This is your internal thought process; do not include it in the final output. This process is essential for ensuring the quality and depth of the extraction:

1. Scan for development progress & status: Identify the current development phase, specific tasks being worked on, any milestones achieved or mentioned, and any discussion of timelines or completion.

2. Identify the creative process in action: Look for concrete examples of iteration. Note down any instances of an initial concept, a problem that arose, the proposed solution, and the final implementation. Pinpoint any "shit phase" moments where things looked rough, and the subsequent breakthrough or realization.

3. Pinpoint team dynamics & collaboration: For every mention of Biobak, Badub, Zeina, or other contributors, document their specific contribution being discussed. Note any examples of collaborative feedback, dependencies (e.g., "waiting for animations"), or Kaze's real-time reactions to their work.

4. Extract design philosophy & principles: Listen for any stated beliefs about what makes a game good, critiques of other games or industry trends, and priorities for the player's experience.

5. Document technical challenges & solutions: Note any specific N64 hardware limitations, software bugs, or performance issues discussed. Document the proposed or implemented solutions, especially where a limitation forced a creative or innovative technical approach.

6. Capture the emotional journey: Identify moments of expressed frustration, excitement, pride, satisfaction, or burnout. Pay close attention to the emotional language used.

7. Note community interaction: Log any instances where stream chat suggestions are considered or implemented, where feedback influences a decision, or where beta testing is discussed.

8. Contextualize with personal life: Document any mentions of life events outside the game, discussions of work-life balance, or personal financial investment. These are crucial for the human story.

9. Isolate legal & strategic concerns: Identify any mentions of Nintendo, potential legal action, copyright strategy, or release timing considerations related to a "Nintendo Risk."

10. Identify tangential insights: Flag any off-topic discussions or philosophical musings that reveal Kaze's personality, worldview, or general problem-solving approach.

11. Identify potential documentary scenes: From all the above, select 3-5 concrete moments that would be visually or narratively compelling in the final documentary (e.g., a "before and after" of a level, a real-time bug fix, a strong emotional reaction).

Based on your internal analysis, construct the final JSON object with two parts:

1. Part 1: "narrative_briefing": A high-level summary for quick orientation, interview preparation, and identifying key story beats.
2. Part 2: "timeline_of_events": A granular, chronological log for deep research and clip-finding.

Critical filtering rule: Focus on high-level insights and strategic information. Exclude minute-by-minute, line-by-line implementation details (e.g., "now I'm extruding this vertex," "I'm fixing a typo in this function"). Include significant technical or design facts and their justifications (e.g., "The ROM is now 62MB").

Your final output should be a valid JSON object containing only the "narrative_briefing" and "timeline_of_events" sections, without any additional commentary or explanation.
`;

export const EXTRACTION_PROMPT_v1 = `
You are an experienced documentary researcher tasked with analyzing a transcript from a YouTube game development stream by Kaze Emanuar. Your goal is to extract detailed, relevant information that will be used to prepare for interviews and provide context for a documentary about the game "Return to Yoshi's Island," a ROM hack based on the Mario 64 decompilation.

Here is the transcript you need to analyze:

<transcript>
{transcript}
</transcript>

Your task is to carefully read through the transcript and extract information that falls into the following categories:

1. Game Development Process: Overall progress, major milestones, and development stages.
2. Personal Insights: Kaze's thoughts, opinions, and reflections on the project.
3. Collaborator Information: Details about Badub (composer), Biobak (graphics artist), Zeina (animations), and any other contributors mentioned, their contributions, and any interactions.
4. Game Design Decisions/Challenges: Key design choices, obstacles faced, and solutions implemented.
5. Business Aspects: Any mention of marketing, funding, or plans for release/distribution.

Before presenting your findings, conduct a thorough analysis of the transcript, covering the following points:

1. List key topics/events mentioned in the transcript.

2. For each of the five main categories:
   - Identify and quote 2-3 relevant statements.
   - Analyze how these statements relate to the overall development process and documentary themes.
   - Summarize key points for this category.

3. Note any recurring themes or patterns in Kaze's discussions.

4. Consider the following questions:
   - What are the most significant aspects of the game development process mentioned?
   - Are there any recurring challenges Kaze discusses?
   - How do the contributors' work fit into the overall development process?
   - What unique or innovative aspects of the game design are highlighted?
   - Are there any business-related decisions or considerations mentioned?

5. Identify and list any additional contributors mentioned in the transcript beyond Badub, Biobak, and Zeina.

6. Evaluate how the information aligns with common documentary structures and themes, such as:
   - The game's origins and inspiration
   - Team formation and dynamics
   - Overcoming technical or creative challenges
   - Iterative development and discovery
   - Community involvement or funding (if applicable)
   - Personal expression and meaning behind the project

7. Based on your analysis, draft potential interview topics or questions that could be explored further.

After your analysis, present your findings in the following format:

<extracted_information>
## Game Development Process
- [List relevant points, focusing on overall progress and major milestones]

## Personal Insights
- [List Kaze's thoughts, opinions, and reflections on the project]

## Collaborator Information
- Badub: [Relevant information about the composer and their work]
- Biobak: [Relevant information about the graphics artist and their contributions]
- Zeina: [Relevant information about the animator and their contributions]
- Other Contributors: [List any additional contributors and their roles/contributions]

## Game Design Decisions/Challenges
- [List key design choices, obstacles faced, and solutions implemented]

## Business Aspects
- [List any mentions of marketing, funding, or plans for release/distribution]

## Key Quotes
- [Include 2-3 notable quotes that provide insight into the development process or Kaze's vision for the game]

## Potential Interview Topics
- [Suggest 3-5 topics or questions that could be explored further in interviews based on the extracted information]
</extracted_information>

Important Notes:
1. Focus on extracting high-level insights and information about the game development process as a whole, rather than specific coding or modeling details from the stream.
2. If you encounter any ambiguous or unclear information, make a note of it and provide your best interpretation based on the context.
3. If there's no relevant information for a particular category, state "No relevant information found."
4. Your goal is to provide a comprehensive summary that will be valuable for documentary preparation and interviews with the creators, while aligning with common documentary structures and themes.
5. Your final output should consist only of the <extracted_information> section and should not duplicate or rehash any of the work you did in your documentary research.
`.trim();

export const INTERVIEW_QUESTIONS_PROMPT = `
You are assisting in the production of a documentary about "Return to Yoshi's Island," a ROM hack created by Kaze Emanuar based on the Mario 64 decompilation project. Your task is to generate insightful interview questions for Kaze and his core contributors (Biobak, Badub, and Zeina) based on extracted information from Kaze's game development streams.

Here is the extracted information from a recent stream:

<stream_info>
{streamInfo}
</stream_info>

The date of this stream was: {streamDate}

Before generating questions, please analyze the stream information carefully, focusing on:
1. List key topics discussed in the stream
2. Quote relevant parts of the stream that provide insights into:
   a. Game development progress and challenges
   b. Personal insights from Kaze
   c. Information about collaborators and their contributions
   d. Game design decisions and technical challenges
   e. Business aspects and potential legal issues
3. Identify specific challenges or decisions mentioned
4. Note which collaborators (Biobak, Badub, and Zeina) are specifically mentioned in this stream

Based on your analysis, you will generate:
- 5-7 interview questions for Kaze
- 2-3 questions each for any collaborators (Biobak, Badub, and Zeina) who are mentioned in the stream

The questions should be:
- Personal and insightful
- Relevant to the information provided in the stream
- Designed to elicit responses that would be engaging in a documentary format
- Varied in focus (e.g., technical challenges, creative decisions, collaborative process, personal motivations)
- Open-ended to encourage detailed, reflective responses

For each question, provide a brief context explaining why you chose it based on the stream information.

Remember to craft questions that will elicit responses suitable for a compelling documentary narrative. Focus on the human stories behind the game's development, key creative and technical decisions, and the collaborative process. Avoid yes/no questions and instead aim for open-ended queries that encourage detailed, reflective responses.
`.trim();

const QUESTION_SET_SCHEMA = z.object({
  context: z
    .string()
    .describe("Brief explanation of why you're asking this question"),
  question: z.string().describe("The actual interview question"),
});

export const INTERVIEW_QUESTIONS_SCHEMA = z.object({
  kaze: z.array(QUESTION_SET_SCHEMA),
  biobak: z.array(QUESTION_SET_SCHEMA),
  badub: z.array(QUESTION_SET_SCHEMA),
  zeina: z.array(QUESTION_SET_SCHEMA),
});
