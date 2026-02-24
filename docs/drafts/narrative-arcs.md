---
outline: deep
---

# Narrative Arcs for RTYI Documentary

This document outlines key main storylines and themes to explore during interviews with Kaze Emanuar, Biobak, Badub, and Zeina. Each arc represents a potential mini-story within the larger documentary. The focus is on capturing both the creative and technical aspects of high-level ROM hacking, while keeping the human stories front and center. The goal is to make this accessible and resonant to viewers who may not have technical backgrounds.

::: tip Plan
This outline serves only as a roadmap for filming, while allowing the actual story to emerge organically from the interview and editing process. It helps ensure all the essential narrative beats are covered.
:::

## Documentary Approach

The central question driving this film is: how and why do you deconstruct a beloved classic and build something entirely new yet respectful on a 30-year-old console? The answer lives in the people – Kaze, Biobak, Badub, and Zeina – their passion, their challenges, and how they perceive each other's contributions. Every interview should feel like a conversation, not a formal Q&A: start with open-ended questions to establish themes, then follow up with specifics. Anchor abstract ideas in concrete game assets – a particular level, a specific bug, a moment on stream – to create opportunities for detailed stories and visual storytelling.

My own curiosity will shape the narrative. What I find fascinating is what the audience will find fascinating. At the same time, this needs to be accessible: viewers who have never heard of a ROM hack should still emotionally resonate with the story. Use B-roll to show the team's personality and make the process tangible – Kaze sketching in MS Paint, Biobak modeling in Blender, stream footage of breakthrough moments. The collaborative spirit between creator and community is itself a story worth telling.

## Project Origins & Philosophies

**Main Focus:** Understanding the vision, passion and mindset required to begin a project of this scale.

### How It All Started

- **Narrative Goal:** The central contrast of creating a visually stunning, modern-feeling game on a 30-year-old console. Who would take on this challenge, and why?
- **Topics to Cover:**

  - **Background:** Kaze's history with both _Super Mario 64_ and _Yoshi's Island_. Which specific elements (aesthetic, mechanics, "vibe") from _Yoshi's Island_ did he want to fuse with SM64's 3D platforming?
  - **Core Motivation:** Explore his straightforward starting point: "I like Yoshi. That's kind of where the thought process ended." What does this mean to him personally (nostalgia, art, and feeling)?
  - **Technical Foundation:** How the SM64 decompilation project opened up possibilities that weren't available in traditional ROM hacking.
  - **The Reality:** Acknowledging this as a fan project in a legally uncertain space that will never be sold commercially. Kaze's history with Nintendo takedowns (over 70 videos) and his "calculated risk" approach.

- **B-Roll:**
  - RTYI gameplay juxtaposed with classic SM64 and SNES Yoshi's Island footage.
  - Archival footage of the N64 console and era.

### The Zoo Catalyst: The Real Origin Story?

- **Narrative Goal:** The actual inciting incident that transformed a simple ROM hack into an engine rewrite project.
- **Topics to Cover:**
  - **The Breaking Point:** "The zoo is actually the reason I even started optimizing Mario 64. The zoo ran so poorly that I just could not take that." The specific moment when acceptable became unacceptable.
  - **Technical Awakening:** How this single level's poor performance opened Kaze's eyes to fundamental problems with the SM64 engine – the "fucked" sound system, "unusable" collision detection, and optimization issues.
  - **The Decision:** The moment Kaze decided to stop working around the engine's limitations and start rewriting them entirely.
  - **Scope Realization:** How fixing one level's lag led to rebuilding collision systems, sound engines, graphics pipelines, and more.
- **B-Roll:**
  - Side-by-side of the original "Zoo" level lagging vs. smooth gameplay in the new engine.
  - Performance profiler data showing before/after optimization.
  - Kaze's early technical streams documenting the engine rewrite process.

### Kaze's Philosophy

- **Narrative Goal:** Understanding Kaze's principles of game design and creative mindset.
- **Topics to Cover:**
  - **Core Principles:** His key philosophies: "excitement over difficulty," creating a "feeling" and "placeness," intrinsic motivation, and his critique of "safe" AAA games or those that feel like a "chore."
  - **Quality Standards:** "If they weren't even good enough for Mario 64, why would they be good enough for my game?" Using Nintendo's classic as the quality benchmark.
  - **Show Don't Tell:** "Exclamation mark is basically telling... It's like admitting oh, I can't make a good game." His deep philosophy against hand-holding and explicit instruction.
  - **Growth as a Designer:** Design time evolution from 5% (Last Impact) to 20% (RTYI). "Back when I was making Last Impact, like whenever I had an idea, I would just put it in almost unfiltered." How his approach matured through planning and quality control.
  - **The Creative Mindset:** His belief that one must be "mentally unwell" to succeed in game development vs. his disciplined reality: "I'm not motivated at all... I just do it. It's really that easy."
- **B-Roll:**
  - Kaze working at his computer, showing his MS Paint sketches and "shit phase" blockouts.
  - Examples from different courses showing his design philosophy in action (player freedom, no hand-holding).

## Community-Driven Design: The Democratization of Game Development

**Main Focus:** How live streaming enables real-time collaborative design between creator and audience, representing a new model of game development.

### The Whomp Tower Moment

- **Narrative Goal:** Documenting how a single viewer suggestion becomes a major gameplay feature, showing the power of collaborative creativity.
- **Topics to Cover:**
  - **The Problem:** Kaze had Whomp characters but no clear gameplay purpose: "What do the womps even do?"
  - **The Suggestion:** A viewer's spontaneous idea: "You could be waiting to be used as a building material, oh, okay. Yeah. That's a funny idea."
  - **Live Implementation:** Watching Kaze immediately prototype the domino tower concept on stream, from idea to functional puzzle.
  - **Community Integration:** How stream chat becomes an active design partner rather than passive audience.
- **B-Roll:**
  - Stream footage of the original suggestion and Kaze's reaction.
  - Time-lapse of the Whomp Tower being built and programmed.
  - Final gameplay of the domino chain reaction puzzle.

### The Tutorial Revolution

- **Narrative Goal:** Showing how the team collaboratively solved an "unsolvable" design problem through live iteration.
- **Topics to Cover:**
  - **The Challenge:** Teaching advanced moves without intrusive text tutorials on N64's low resolution.
  - **Community Problem-Solving:** Multiple suggestions, refinements, and Biobak's breakthrough ring concept.
  - **Real-Time Iteration:** Zeina creating animations, Kaze coding mechanics, Biobak refining visuals – all happening live.
- **B-Roll:**
  - Stream footage showing the evolution from broken tutorial to elegant solution.
  - Team members contributing in real-time during development.

## Accidental Breakthroughs: The Role of Serendipity in Technical Innovation

**Main Focus:** How major technical discoveries happen by accident, challenging narratives about methodical engineering and showing that innovation often comes from mistakes and happy accidents.

### The Export Format Discovery

- **Narrative Goal:** Documenting how a simple mistake led to doubling the game's performance, showing the unexpected nature of optimization.
- **Topics to Cover:**
  - **The Accident:** "I was exporting it as an F3D model and not F3DEX2. So we had twice the vertex loads, twice the triangle comments... and it still ran fine."
  - **The Realization:** Testing on N64 hardware and discovering the level performed much better than expected.
  - **The Impact:** Instantly doubling performance with a single setting change, turning a potential optimization nightmare into a validating win.
  - **The Philosophy:** How accidents can be more valuable than months of planned optimization.
- **B-Roll:**
  - Performance profiler showing before/after numbers.
  - Kaze's reaction to discovering the performance boost.
  - Side-by-side gameplay showing the dramatic improvement.

### The Compiler Bug Hunt

- **Narrative Goal:** Showing the detective work required when dealing with assembly-level bugs that only manifest on real hardware.
- **Topics to Cover:**
  - **The Mystery:** Game crashing on N64 with division-by-zero error despite safety checks in the code.
  - **The Investigation:** Examining compiled assembly code to discover compiler optimization bypassing safety checks.
  - **The Solution:** "That is not a bug in the code. That is not my fault" – working around aggressive compiler optimizations.
  - **The Expertise:** Demonstrating the deep technical knowledge required for N64 development.
- **B-Roll:**
  - Assembly code analysis on screen.
  - N64 hardware debugging setup.
  - The moment of discovery and solution implementation.

## The Core Team

**Main Focus:** Understanding each team member's contributions, creative process, and collaborative dynamics.

### Biobak

- **Narrative Goal:** Showing how Biobak transforms Kaze's functional level designs into visually rich environments.
- **Topics to Cover:**
  - **The Reworks:** Focus on a major level reworks like Cours 1, "Oily Boily Bay", or the Ghost Ship (Course 5). Include before-and-after comparisons and Kaze's genuine reactions from streams ("Holy shit, everything is different").
  - **The Process:** The back-and-forth between Kaze's technical requirements and Biobak's artistic vision, particularly for unique themes like the craft aesthetic or the Star Select screen. How Kaze adapts Biobak's high-poly models to work within N64 limitations.
  - **Beyond Visuals:** His contributions to gameplay ideas, suggesting level flow improvements, creating enemy concepts like the "Chubby Chai guys" (thimbles), and providing real-time feedback that influences level design.
- **B-Roll:**
  - Time-lapse footage of Biobak modeling in Blender.
  - Kaze reviewing Biobak's detailed changelogs on stream.
  - Comparisons between Biobak's concept art and final in-game results.

### Badub

- **Narrative Goal:** Showing how music shapes the game's atmosphere and directly influences design decisions.
- **Topics to Cover:**
  - **Music-Driven Design:** Kaze's approach: "I love working with a song already made for the level because it gives me so many ideas for the vibe." Show how the Cowboy Level music's arrival mid-stream instantly solidified the atmosphere and inspired Kaze to add fog.
  - **Technical Challenges:**
    - Composing within the N64's limited sound font while creating something that sounds both new yet familiar. Kaze: "It sounds like a completely new soundtrack with like a similar vibe to me. That's what I want anyway."
    - The ambitious dynamic overworld featuring nearly 20 tracks that transition seamlessly, a feature enabled by Kaze's custom sound engine.
    - Managing ROM space constraints, with the OST taking up a significant portion of the 64MB cartridge limit, and how the team brainstormed solutions like hybrid tracks.
  - **Collaborative Process:** How Kaze communicates a mood to Badub (e.g., "evil, bowser, construction, goofy"), how the music then influences Kaze's level design, and how the final music is integrated with cutscenes and events.
- **B-Roll:**
  - Badub's composition software in action.
  - Gameplay footage scored by different musical concepts to demonstrate how the "vibe" changes.

### Zeina

- **Narrative Goal:** Exploring Zeina's diverse contributions through animation, art, and crucial playtesting feedback.
- **Topics to Cover:**
  - **Character Animation:** Her process for bringing characters to life within N64 constraints – examples like the notoriously difficult Wiggler, the Dry Bones, or the charismatic "Piano Guy."
  - **Artistic Contributions:** Her work on models (Peach, Toad), textures (bunny footprints, signs), and concept art that inspired new design directions (the "mutant Yoshi" boss, zoo entrance).
  - **Playtesting Role:** Her importance as the first player to experience content. Using Kaze's observation: "It was very painful to watch her" struggle with a difficult section, leading to design adjustments.
  - **Team Role:** Her self-described role as "helping out with anything else that he needs," showcasing her versatility and commitment.
- **B-Roll:**
  - Split-screen of Zeina's animation software and the final in-game character.
  - Kaze reviewing her animations and models on stream.

## Creational Case Studies

**Main Focus:** Following the complete journey of specific levels from concept to completion, showing the messy, iterative and rewarding nature of game development.

### Course 1: The First Impression

- **Narrative Goal:** Demonstrating how the opening level embodies the project's core values: teaching through gameplay, collaborative polish, and continuous iteration to create the perfect "first step."
- **Topics to Cover:**
  - **Design Challenge:** Teaching the advanced RTYI movement without intrusive text tutorials, due to the N64's low resolution.
  - **The Team Solution: Tutorial Bunnies.**
    - **Biobak:** Proposed interactive ring challenges that teach new mechanics through action rather than instruction.
    - **Zeina:** Created bunny animations that demonstrate moves visually.
  - **Continuous Improvement:** Biobak's complete visual overhaul years later, showing the team's evolving standards and commitment to quality.
- **B-Roll:**
  - Final Tutorial Bunny system in action.
  - Zeina's animation files and Biobak's reworked models.
  - Comparison between the original demo and Biobak's refined version.

### The Cowboy Level: Finding the "Vibe"

::: tip Highlight
This is my favorite arc. It perfectly captures Kaze's creative process, the team's collaborative synergy, the power of music to inspire design.
:::

- **Narrative Goal:** Documenting the journey of a level finding its identity from scratch, highlighting the team's collaborative dynamic.
- **Topics to Cover:**
  - **Initial Concept:** Kaze's "Cowboyaboo" vision – an over-the-top, "goofy, funny" town.
  - **The "Shit Phase":** Kaze's frustration with early art style attempts (experimenting with building colors and textures). "This building style is just not exciting me."
  - **The Turning Point:** The moment Badub's music arrives during a stream ("Oh, this is so good... that's so perfect"), immediately inspiring the addition of atmospheric elements like skybox and fog, finally solidifying the "vibe."
  - **Team Dynamic:** Biobak offering real-time suggestions while Zeina's character animations (Dry Bones, Piano Guy) bring the world to life.
- **B-Roll:**
  - Kaze's rough MS Paint planning sketches and early placeholder models.
  - Capturing Kaze's reaction to hearing Badub's track for the first time.

### The Craft Level: From "Stupid Idea" to Technical Achievement

- **Narrative Goal:** Showing how a simple aesthetic concept led to significant technical innovation and creative problem-solving.
- **Topics to Cover:**
  - The unique "crayon drawing" gameplay mechanic.
  - **Technical Problem:** Creating realistic Styrofoam shine on hardware that predates modern lighting techniques.
  - **Innovative Solution:** Kaze's "fake" lighting system (CPU-based normal mapping), a technique he adapted from another developer named "Daryl".
  - **Enemy Designs:** Brainstorming and discarding enemy ideas (like scissors) before settling on thematically appropriate ones like "Thimble Shy Guys."
  - **Community Input:** Contributions from Lilaa, Danik, and others providing doodles, textures, and technical advice.

### The Space Arcade: Killing Your Darlings

- **Narrative Goal:** Illustrating the painful but necessary process of scrapping a bad idea for a better one.
- **Topics to Cover:**
  - **Original Concept:** The initial "Space Arcade" with pinball elements.
  - **The Problem:** Kaze's realization: "The idea we had for this level is terrible." His issues with the "ugly arcade carpet" aesthetic and lack of "Mario 64 spirit."
  - **The Solution:** Live brainstorming leading to the "Shy Guy Space Station" concept – more original and fitting with the retro-futuristic theme. This highlights the commitment to quality over sunk costs.
- **B-Roll:**
  - Gameplay of the discarded arcade level vs. concept art for the new space station.

## The Custom Engine

**Main Focus:** Explaining why standard modding wasn't enough and how Kaze became an engine developer to realize his vision.

- **Narrative Goal:** Explaining the need to rewrite core parts of the game engine and how this enables creative possibilities.
- **Topics to Cover:**
  - **The Limitations:** Original code problems – the sound engine is "fucked," vanilla collision is "unusable," emulator inconsistencies, and poor performance. The Zoo level's lag was a major catalyst.
  - **Purpose-Driven Solutions:**
    - **New Sound Engine:** A complete rewrite enabling dynamic, seamless music and improved effects.
    - **Collision System Overhaul:** A new, more stable system that fixes "floor clocking" bugs and allows for more complex geometry.
    - **Graphics Enhancement (F3DEX3):** Collaborating with microcode developer Sauraen to implement a new microcode that overcomes the N64's RSP bottleneck, allowing for larger, more detailed worlds.
  - **Creative Impact:** Connecting each technical improvement to player experience – 60 FPS, enhanced movement, better lighting, Badub's dynamic overworld music, complex Ice Castle platforming, Biobak's detailed level environments.
- **B-Roll:**
  - Side-by-side comparisons of vanilla SM64 bugs vs. RTYI's smooth performance.
  - Performance profiler data from Sauraen's development tools.

## The Overworld as a Character

**Main Focus:** Building a seamless, dynamic, secret-filled world rather than just a level selection. The game's most ambitious feature.

### The Island with a Secret

- **Narrative Goal:** Understanding the design philosophy behind making the hub world the game's true "main character."
- **Topics to Cover:**
  - Kaze's belief that the overworld is the "final stretch" and "most important part."
  - **Design Philosophy:** "If you can see it, you can go there." Total exploration of every inch of Yoshi's Island.
  - **Hidden Identity:** "What if we made the island the shape of a Yoshi? Yes or no? The island needs to be the shape of a Yoshi." The secret that players will only discover from above.
  - **Scale Ambition:** Planning an overworld "around four times the size of Super Mario 64" broken into 14 interconnected areas.

### Creative Environmental Puzzles

- **Narrative Goal:** Showing how world design integrates story, gameplay, and visual spectacle.
- **Topics to Cover:**
  - **The Lighthouse and Ghost Ship:** "What if the ship is here, but it's like a shadowy fix, and you have to go into the lighthouse... And in the lighthouse, you point the light at the ship. And that makes the ship visible and breaks through the fog." A puzzle that's both mechanically satisfying and visually spectacular.
  - **The Interconnected River:** Course 2's river flowing through the entire overworld, creating "placeness" and connection between levels.
  - **Living World Events:** Dynamic changes like rescued Yoshis stopping the rain, freed Dory providing transport, creating a world that evolves with player actions.

### Story Integration and Economy

- **Narrative Goal:** Moving beyond simple level gates to create meaningful progression tied to the world's narrative.
- **Topics to Cover:**
  - **Evolution from Coins to Story:** Moving from simple coin payments to narrative events where rescued characters help progression.
  - **Global Economy:** Coins as actual currency to transform the world, making them "feel more valuable than Mario Odyssey."
  - **Magic Barriers:** Using Kamek's barriers as clear progression gates that reinforce the villain's presence rather than feeling arbitrary.
- **B-Roll:**
  - Aerial tours showing the Yoshi-head island shape.
  - Kaze's MS Paint planning maps and Photoshop sketches.
  - Before-and-after comparisons of world-changing events.
  - The lighthouse puzzle in action with dramatic lighting effects.

## The "Shit Phase" & Iteration

**Main Focus:** Showing that creative work is an iterative process of failure and refinement, not instant perfection. Embracing the early "ugly blockout" stages and the pain of "killing your darlings."

- **Narrative Goal:** Making the creative process relatable by showing that even experts start with rough drafts.
- **Topics to Cover:**
  - **Core Philosophy:** Kaze's acceptance that levels always "look like shit at the beginning." The creative cycle: "It always starts like really fun and eventually it turns into pure torture. That's just the cycle of making games."
  - **Design Evolution:** From 5% design time (Last Impact) to 20% (RTYI): "Back when I was making Last Impact, like whenever I had an idea, I would just put it in almost unfiltered."
  - **Example 1: The Iridescent Oil Saga.** Creating the rainbow oil effect through trial and error: "Wow this looks terrible, oh my god this looks so bad. I absolutely hate this" → eventually becoming a signature level feature.
  - **Example 2: The Wet Cement Nightmare.** An entire stream debugging a texture effect, exploring complex theories before discovering a simple copy-paste error: "That part was missing everywhere. No wonder this didn't work."
  - **Example 3: Course 11 Improvisation.** "Yeah, this level is a bit improvised compared to my normal levels. We're kind of making a lot of shit up on the fly" – showing that even expert developers embrace controlled chaos.
  - **Example 4: The Space Arcade Scrapping.** Killing darlings: "The idea we had for this level is terrible" – completely reimagining a level from scratch when the original concept fails.
  - **Example 5: The Paper Airplane Physics Experiment.** Kaze's mathematical approach to game physics: folding a real paper airplane to understand the mathematics ("I'm making a paper airplane to look at it. I got a piece of graph paper"), then spending an entire stream tweaking variables as physics went "volatile and chaotic." The iterative process from falling through floors to smooth, rideable flight mechanics demonstrates the messy reality behind polished gameplay.
- **B-Roll:**
  - Montage of Kaze's roughest placeholder models and early "shit phase" layouts.
  - Stream moments of frustration ("this sucks") followed by breakthrough moments and polished results.
  - Before-and-after comparisons showing dramatic transformations through iteration.
  - Paper airplane physics debugging: split screen of Kaze folding real paper vs. in-game physics tweaking.
  - Mathematical calculations on screen during the paper airplane development process.

## Rethinking Rewards

**Main Focus:** Questioning standard game design conventions around collectibles (coins and stars) and progression.

- **Narrative Goal:** Understanding Kaze's approach to making rewards meaningful and integrated into the game world (rather than just being a checklist).
- **Topics to Cover:**
  - Kaze's critique of traditional 100-Coin Stars and the decision to remove them.
  - **Yoshi Coins:** Rewards for "special interactions" and exploration, not just collection.
  - **Economy System:** Coins as actual currency to transform the world (building bridges, helping NPCs like the "Athlete Yoshi"), making them "feel more valuable than Mario Odyssey."
  - **Flow Preservation:** Removing "boot out" stars to maintain immersion and respect player time. "The game doesn't waste your time. That is important to me."
- **B-Roll:**
  - UI showing the global coin counter system.
  - Simple visualization of coins being used to unlock world changes.

## Kaze & Zeina: A Shared Creation

**Main Focus:** The personal dimension of creative partnership and how their relationship shapes RTYI.

- **Narrative Goal:** A more intimate look at how personal and creative lives intersect in game development.
- **Topics to Cover:**
  - **Creative Collaboration:**
    - Zeina's direct contributions: the "mutant Yoshi" concept, zoo entrance drawings, various textures and models.
    - Their workflow: Kaze programs the logic, then integrates Zeina's animations. His dependency: "All we're waiting now is for a few animations that Zeina's making."
    - Real-time iteration shown through stream clips of Kaze reviewing her work.
  - **Critical Playtesting:**
    - Zeina as the project's first true audience.
    - **Specific Example:** Kaze making a level easier after watching her struggle – "It was very painful to watch her" – showing direct impact on design.
  - **Life & Parenthood:**
    - Personal moments that ground the project: making terrariums, haircuts (including the accidental bald patch), moving homes.
    - **New Chapter:** The birth of their daughter, Reyna, during the project's final phase. The story behind her name (a tribute to Zeina's late friend). This adds personal stakes and reframes the "human cost" of RTYI's scope.
- **B-Roll:**
  - Kaze reviewing Zeina's work during streams.
  - Zeina's concept art alongside final implementations.
  - Personal moments (with their permission) to establish the "working from home" reality.

## Development Challenges

**Main Focus:** The personal, creative, and technical challenges that involved in a project of this scale.

### Working Within N64 Limitations

- **Narrative Goal:** Portraying the N64 as both a creative canvas and a constant technical challenge.
- **Topics to Cover:**
  - **Memory Management:** The ongoing battle with RAM limits. For example, Kaze's trick to avoid modeling store items: "This is a trick we do so we don't actually have to 3D model the stuff here because we are getting pretty close to running out of RAM." The Oily Boily Bay rework pushing the game 1KB over the limit.
  - **Platform Inconsistencies:** Frustration of bugs that only appear on certain emulators or real hardware, making testing difficult. The story of the "Phantom Bowser Bug" that only happened on Project64.
  - **Creative Roadblocks:** The struggle to find the right look for a level (Ice Castle, Cowboy Level) and the satisfaction of breakthrough moments.
  - **Technical Mysteries:** Specific bug stories (the compiler generating faulty code for the Thimble Guy, the S8 register crash) and collaborative problem-solving with Sauraen.
- **B-Roll:**
  - Game crashes on actual N64 hardware.
  - Kaze troubleshooting technical issues.
  - Performance profiler showing system limits.
  - Discord chats with collaborators like Sauraen.

### Personal Investment

- **Narrative Goal:** The real-world impact of dedicating years to a passion project.
- **Topics to Cover:**
  - **Financial Reality:** Kaze's transparency about opportunity costs ("tens of thousands") and reliance on community support through donations. The challenges with payment platforms like PayPal and sponsorship agencies.
  - **Personal Balance:** Managing the project alongside full-time work and fatherhood. Acknowledging moments of burnout ("pure torture") and physical pain (neck issues) while maintaining dedication.
  - **Team Dynamics:** How creative disagreements are resolved constructively for a better final product.
  - **Core Motivation:** Why continue despite challenges – the passion and drive to create something unique and meaningful.

## Community and Future

**Main Focus:** The project's relationship with its community and the uncertain legal landscape.

### Open Development

- **Narrative Goal:** Understanding the dynamic (benefits and challenges) of developing publicly with community involvement.
- **Topics to Cover:**
  - **Demo Strategy:** Using the Course 1 demo to gather real player data on physics and camera systems via a detailed questionnaire.
  - **Feedback Integration:** Kaze's principle: "feelings are real, reasoning is stupid." How stream feedback helps (the "Mirror Wall" idea) or hinders progress (unhelpful technical advice).
  - **Open Source Plans:** Releasing the engine and source code, hoping the community will maintain and build upon the codebase.
- **B-Roll:**
  - Chat suggestions that made it into the game (growing flower vine, mirror Mario wall-kick mechanic).

### The Looming Shadow of Nintendo

- **Narrative Goal:** Addressing the legal uncertainties surrounding fan projects.
- **Topics to Cover:**
  - The project's single greatest external threat: Nintendo.
  - Kaze's awareness and concern of potential Nintendo legal action ("Nintendo might just murder me").
  - Kaze's history with takedowns ("70 of my videos") and his "calculated risk" approach.
  - **The "Win-Win" Philosophy:** Kaze's view that a takedown would be a PR opportunity to launch a commercial, legally distinct version of the game.
  - **Backup Plan:** The asset-swap strategy to create a "legally distinct" version if needed, and aspirations for future commercial game development via Kickstarter.

### The Final Stretch

- **Narrative Goal:** Reflecting on the journey and the project's impact/legacy.
- **Topics to Cover:**
  - Stories from beta testing and how feedback shaped the final game.
  - Defining what "finished" means for project of this scope.
  - Lessons learned from this massive undertaking.
  - Reflections from each team member on their journey with RTYI and what they've accomplished.
  - Final thoughts on why retro gaming and the spirit of fan creation continue to matter/resonate.
