// #region analysis-prompt
export const STREAM_ANALYSIS_PROMPT_v2 = `
You are an expert documentary researcher. Analyse the transcript from Kaze Emanuar's YouTube game development stream. Your goal is to extract concrete, actionable information about the development of "Return to Yoshi's Island," a ROM hack based on the Mario 64 decompilation. This information will be used to prepare comprehensive interviews with the development team for a documentary.

As you analyze this transcript, keep in mind that the stream is from Kaze's perspective. Consider the following central question: "How and why does a creator and his team deconstruct a beloved classic and build something entirely new, yet respectful, on a nearly 30-year-old console?"

## Key Team Members to Track

- Kaze Emanuar: Lead developer (vision, coding, design), heart and soul of the project
- Biobak: Graphics artist
- Badub: Composer
- Zeina: Animator (also Kaze's spouse – note any personal/professional dynamic)

## Analysis Instructions

For each of the following categories, carefully examine the transcript and extract relevant information specific to this stream. Conduct a step-by-step analysis, but only output the final JSON object that conforms to the schema.

1. Development Insights:
   - Current project status and milestones
   - Design decisions and their rationale
   - Influences from other games or media
   - Technical challenges and solutions
   - Creative process examples (concepts → problems → solutions)
   - Any "breakthrough" moments or significant pivots

2. Team & Collaboration:
   - Specific contributions from each team member
   - Examples of collaboration or feedback
   - Dependencies between team members
   - Team dynamics or working relationships

3. Creator Context:
   - Kaze's opinions, interests, philosophy, principles, or worldview (about game design or life in general)
   - Emotional moments (frustration, excitement, satisfaction)
   - Personal life mentions (whether or not they directly affect the project)
   - Work-life balance discussions
   - Financial or time investments

4. External Factors:
   - Community feedback or involvement
   - Legal/Nintendo concerns or considerations
   - Release strategy or timing
   - Marketing or distribution plans

5. Complete Stories:
   Identify self-contained incidents with:
   - A challenge or initial idea
   - The process of working through it
   - The outcome or resolution

6. Knowledge Gaps:
   Note what ISN'T fully explained:
   - Mentioned but unexplored topics
   - Decisions without clear rationale
   - References to work not shown
   - Team dynamics only partially revealed

## Important Notes

- Include quotes that illustrate key points only if they are particularly impactful or revealing
- Focus on information that generates meaningful interview questions
- It's okay if some categories have no findings – do not force any information where it doesn't exist

## Exclusions

Do not include:
- Line-by-line code explanations without broader significance
- Minute modeling details without design insights
- Repetitive testing without learning moments
- Stream management issues
- Known information about team roles – only include new or surprising insights

## Output

After your internal analysis, generate a single, valid JSON object that conforms to the provided schema.

## Context

Here is the transcript to analyse:

<transcript>
{transcript}
</transcript>
`;
// #endregion analysis-prompt

export const STREAM_ANALYSIS_PROMPT_v1 = `
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
