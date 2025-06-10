---
outline: deep
---

# Interview Questions for the RTYI Team

The questions are open-ended to establish core themes and encourage storytelling. I will actively listen for interesting stories to follow up on and dive into specific, role-oriented topics.

### Part 1: For All Team Members

These central questions are for Kaze, Biobak, Badub, and Zeina individually. This will hopefully allow me to weave together their different perspectives on the same key topics, creating a multi-faceted narrative for the documentary.

1.  **The Genesis:** I'd love to hear how you first got involved with "Return to Yoshi's Island." A massive Yoshi's Island-themed adventure built on top of the Mario 64 engine. What aspects of this specific idea resonated with you? What made you decide to commit to such a huge project?

    ::: info Follow-ups

    - Initial excitement or skepticism
    - What was Kaze's pitch like?
    - Personal nostalgia for Super Mario 64 or Yoshi's Island
    - Role of the SM64 decompilation project
    - Kaze: "I like Yoshi" - What does that mean to you on a deeper level?

    :::

2.  **The Drive:** This is years of work, all released for free. Kaze has described it as requiring an obsessive level of dedication, costing him "tens of thousands" personally. What keeps you going? What's the personal drive that makes you pour so much time and talent into this?

    ::: info Follow-ups

    - The joy of creation vs. the "pure torture" moments
    - How do you push through burnout or creative blocks?
    - The desire to push the N64 to its limits
    - Proving what's possible on 30-year-old hardware
    - The passion for creation vs. financial realities
    - Kaze: "If you want to be successful making video games you need to be mentally unwell" - what's the story behind that feeling?

    :::

3.  **The Soul of RTYI:** From your role on the team, what do you think is the heart and soul of this game? What feeling or experience are you trying to create that makes it different from any other Mario 64 hack or even official Nintendo games?

    ::: info Follow-ups

    - The game's specific "vibe" and "placeness"
    - How the Yoshi theme influences everything
    - Blending nostalgia with innovation
    - "Excitement over difficulty" philosophy
    - Creating intrinsic motivation vs. extrinsic rewards like coin collecting
    - Kaze's critique of AAA games that can feel like a "chore"

    :::

4.  **The Creative Process:** Could you walk me through the typical creative process? How does an idea become a finished piece, whether that's a level, a song, a model, or an animation? What is the collaboration like day-to-day?

    ::: info Follow-ups

    - MS Paint maps and first rough drafts
    - Discord DMs and discussions vs. live stream feedback
    - The back-and-forth between technical needs and artistic vision
    - The "shit phase" philosophy - the feeling that everything looks terrible at first
    - Real-time iteration during streams
    - How feedback flows between team members

    :::

5.  **A Story of a Challenge:** I'd love to hear about a time when things got really tough. Maybe a technical nightmare, a creative block, or even a disagreement. What happened, and how did you push through to that breakthrough moment?

    ::: info Follow-ups

    - Specific bugs that only show on real N64 hardware
    - Creative dead ends like the initial Space Arcade or Volcano concepts
    - The Styrofoam texture lighting challenge
    - The Wiggler's difficult animation rigging
    - The paper plane physics going "volatile and chaotic"
    - Kaze: "This building style is just not exciting me"
    - Times when ideas had to be completely scrapped

    :::

6.  **The N64 Spirit:** You're developing for hardware from 1996. How do those famous N64 limitations (low-poly models, texture memory, RAM limits) actually force you to be more creative? Can you share an example where a limitation led to something unique?

    ::: info Follow-ups

    - Working within a 64MB ROM and 4KB texture memory budget
    - The "fucked" vanilla audio engine requiring a complete rewrite
    - The vanilla collision system being "unusable"
    - Inventing CPU-based normal mapping for fake lighting on the styrofoam
    - Performance profilers showing red bars and forcing optimization
    - The freedom and challenges of the SM64 decompilation project

    :::

7.  **The Legacy:** When players finally experience the full game, what do you hope they take away from it? What do you want the lasting impact of "Return to Yoshi's Island" to be?

    ::: info Follow-ups

    - What moments do you want players to remember?
    - The impact on the SM64 modding community
    - The plan to release the engine and source code publicly
    - Your personal sense of accomplishment
    - Proving what fan projects can achieve
    - The enduring appeal of retro-style game development

    :::

### Part 2: Individual Interviews

These questions are tailored to each team member's specific role and contributions, allowing for deeper dives into their unique perspectives and expertise.

#### Kaze Emanuar (Lead Developer)

::: tip Introduction Reminder

- For the narrative, can you please state your name and your role on the project?

:::

**On Vision & Design Philosophy**

1.  You have very clear design principles: creating "placeness," prioritizing excitement over difficulty, and respecting the player's time. Can you tell me about a time you had to make a tough call to stick to these principles? Maybe something you really liked but had to cut because it didn't fit?

    ::: info Follow-ups

    - The Space Arcade being "terrible" and needing a full rework
    - Critiquing AAA games as a "chore" - what specifically bothers you?
    - "Cowboyaboo" philosophy of over-the-top and goofy
    - The decision to remove 100-coin stars and "boot out" mechanics
    - The maturation from "Last Impact" to RTYI: "Back when I was making Last Impact, I would just put ideas in almost unfiltered"

    :::

2.  You've said the Overworld is "the most important part of the game." What's your vision for it? How are you making it more than just a hub world by embracing the "if you can see it, you can go there" philosophy?

    ::: info Follow-ups

    - Teasing distant landmarks like the lighthouse or volcano
    - Permanent world changes like the Rain Flower quest or Dory rescue
    - The seamlessly transitioning music tracks by Badub
    - Dynamic overworld events like the pirate invasion
    - The evolution from simple coin payment to story-driven events
    - The coin system and making coins "feel more valuable than Mario Odyssey"

    :::

**On Technical Mastery**

1.  You didn't just mod SM64, you've rewritten huge chunks of its foundation: the sound engine, collision system, even the operating system. What drove you to take on these massive technical challenges? What can you do in RTYI that would be impossible without them?

    ::: info Follow-ups

    - Why was the vanilla collision "unusable"?
    - What exactly was "fucked" about the original audio engine?
    - Collaboration with Sauraen on the F3DEX3 microcode
    - Enabling 60 FPS gameplay
    - Supporting Badub's dynamic music and Zeina's complex animations
    - Complex platforming in the Ice Castle
    - The new quaternion-based animation system

    :::

2.  You often have to debug on real N64 hardware because emulators are often inaccurate. What's the most frustrating "emulator hell" bug you've dealt with? How do you even track down something that only breaks on a real console?

    ::: info Follow-ups

    - Performance profiler and trace tools from Sauraen
    - Crashes that "just work" on certain emulators
    - N64 hardware stability and floating point exception issues
    - The challenge of testing on multiple emulator types
    - Why you can't trust emulators for final performance testing

    :::

**On Collaboration & The Public Eye**

1.  You have a strong vision for RTYI, but you're also working with a talented team. How do you balance staying true to your vision while being open to their input? Can you recall a moment when a collaborator's suggestion fundamentally changed or improved your original idea?

    ::: info Follow-ups

    - Biobak's complete rework of the Pirate Ship level ("Holy shit, everything is different")
    - Badub's cowboy music arriving mid-stream and changing the whole "vibe"
    - Zeina's "mutant Yoshi" boss concept
    - Tutorial Bunnies as a collaborative solution
    - The "Feelings are real, reasoning is stupid" philosophy for feedback
    - How do you manage tasks and feedback in a remote, informal team?

    :::

2.  You develop RTYI live on stream with hundreds of people watching and commenting. How do you filter all that input? You've said you value the "feeling" behind feedback but not always the "reasoning." What does that mean in practice?

    ::: info Follow-ups

    - Specific chat ideas being implemented, like the "growing flower" vine or "Mirror Mario" wall-kick mechanic
    - How streaming helps vs. hinders focus and creativity
    - Managing the pressure of working in public
    - Beta tester feedback vs. real-time stream feedback

    :::

**On The "Nintendo Risk" & The Future**

1.  Nintendo has taken down over 70 of your videos. Every fan project lives under that shadow. How does this reality affect your development and release strategy? And what's your plan if the worst happens?

    ::: info Follow-ups

    - Strategic release timing to avoid major Nintendo launches
    - Using copyright-free trailers for protection
    - The "legally distinct" asset-swap contingency plan
    - Aspirations for commercial game development
    - Open-sourcing the engine and code to preserve the work
    - The "calculated risk" mindset: Why you do this despite the risks?

    :::

#### Biobak (Graphics Artist & Designer)

::: tip Introduction Reminder

- For the narrative, can you please state your name and your role on the project?

:::

**On Visuals & World-Building**

1.  We often see Kaze build a functional "blockout" version of a level to get the platforming right. Then later, we see your rework that completely transforms the levels. Can you walk me through your process? How do you take that basic layout and breathe life into it? The Course 1, Pirate Ship, or Oily Boily Bay reworks are my favorite examples.

    ::: info Follow-ups

    - Kaze's reaction to the Pirate Ship rework: "Holy shit, everything is different"
    - What does a level look like when you receive it? (MS Paint maps, simple geometry?)
    - Detailed changelogs explaining every decision
    - How do you add "placeness" and story through visual details?
    - Evolving quality standards over time
    - Balancing Kaze's gameplay needs with your artistic vision

    :::

2.  You create these detailed, modern-looking levels, but they have to run on 30-year-old hardware. What's your process for modeling and texturing something beautiful while constantly battling N64 polycounts, texture limits, and memory constraints?

    ::: info Follow-ups

    - The process of sending high-poly models to Kaze
    - Creative solutions for N64's limited color palette
    - Vertex colors and N64-specific shader "combiners"
    - Optimizing geometry and textures without losing the artistic vision
    - An example of an idea that was just too ambitious for the hardware
    - An example of an idea that surprisingly _did_ work after some optimization

    :::

**On Collaboration & Creative Vision**

1.  How does Kaze communicate what he's looking for in a level's art style? Does he give you reference images or describe a "vibe?" How do you translate that direction into a cohesive visual identity?

    ::: info Follow-ups

    - Receiving MS Paint maps or blockout models
    - Translating a feeling or "vibe" into a concrete visual identity
    - Your role as an idea contributor beyond just visuals
    - Suggesting level flow or gameplay improvements
    - The back-and-forth on technical feasibility for your ideas
    - A time Kaze's initial idea was vague and you had to define the look
    - A time your artistic choice fundamentally changed Kaze's initial gameplay idea

    :::

2.  Kaze often talks about creating "placeness", a sense that a level is a real, coherent environment. From your perspective as the artist, what does "placeness" mean? How do your level reworks, like for Oily Boily Bay or the Zoo, contribute to this goal beyond just making them "prettier"?

    ::: info Follow-ups

    - Using environmental details to tell a story
    - The importance of lighting in creating atmosphere on the N64
    - Small details that players might not notice but that add to the world's believability
    - How a level's visual identity influences asset creation (enemies, objects, etc.)
    - A favorite "placemaking" detail you've added that you're particularly proud of

    :::

#### Badub (Composer)

::: tip Introduction Reminder

- For the narrative, can you please state your name and your role on the project?

:::

**On Musical Identity**

1.  What's the musical identity you're creating for "Return to Yoshi's Island"? How do you blend the nostalgic sounds of Mario 64 and Yoshi's Island while creating something that feels both fresh and familiar?

    ::: info Follow-ups

    - Using the limited N64 sound font creatively
    - Achieving that "new yet familiar" sound
    - Balancing nostalgia with innovation
    - How the "Yoshi" theme influences your compositions vs. the "Mario 64" theme
    - Creating a cohesive soundtrack across so many diverse level themes

    :::

2.  Kaze has said your music directly inspires his level design. Can you tell me about the moment you sent the Cowboy Level track? It seemed to arrive mid-stream and completely changed the direction of that level's atmosphere.

    ::: info Follow-ups

    - Kaze's reaction to hearing the track for the first time: "Oh, this is so good"
    - How the music inspired Kaze to add the skybox and fog
    - Translating Kaze's "vibe" descriptions into a composition
    - Creating music for a specific theme or level
    - Composing for a level before vs. after its design is established

    :::

**On The Craft of N64 Music**

1.  Composing for the N64 has unique challenges – the small sound font, the limited ROM space. How do these limitations shape your compositions? Do you see them more as a restriction or a creative opportunity?

    ::: info Follow-ups

    - The OST taking up a significant ROM space (64MB limit)
    - Working with Kaze's rewritten sound engine
    - Creative workarounds for instrument limitations
    - The process of making dynamic music within these constraints

    :::

2.  The overworld has nearly 20 tracks that seamlessly transition as the player explores. From a composer's perspective, what were the biggest challenges in creating such an ambitious and adaptive score for N64 hardware?

    ::: info Follow-ups

    - Ensuring smooth musical and key transitions between themes
    - Working with Kaze on the technical implementation of triggers
    - Composing music that responds to player actions or events
    - Maintaining a cohesive musical identity across the entire island

    :::

#### Zeina (Animator & Artist)

::: tip Introduction Reminder

- For the narrative, can you please state your name and your role on the project?

:::

**On Animation & Character**

1.  You bring the game's characters to life through animation. What's your approach to giving personality and emotion to characters within the N64's technical limits? The Piano Guy is favorite character with so much charisma.

    ::: info Follow-ups

    - The challenges of the old "geo bone" system
    - The benefits of the new quaternion-based animation system
    - Conveying personality through movement, not polygon count
    - Making enemies feel alive and reactive
    - The animation pipeline with Kaze's programming

    :::

**On Art, Design & Influence**

1.  Beyond animation, you contribute so much: 2D art, 3D models, concept art. Could you tell me about the story behind your concept for the mutant Yoshi boss, or your drawings for the zoo entrance? How did those initial ideas shape what the team built?

    ::: info Follow-ups

    - Collaborating with Kaze and Biobak on cohesive style
    - Creating models like Peach and Toad
    - Contributing textures like the bunny footprints or level signs
    - Seeing your initial sketches become key game elements
    - Your artistic influence on the project's overall direction and style

    :::

2.  Kaze often says your feedback as the "first playtester" is invaluable. I'd love to hear your side of the story where a section was so "painful to watch" you play that he made it easier. What kind of issues do you tend to notice that a programmer might miss?

    ::: info Follow-ups

    - The "painful to watch" story from your perspective
    - How does the feel of the gameplay influence your animation choices?
    - Catching visual or flow issues that a technical developer might overlook
    - Unique perspective as both an artist and a player
    - Other specific changes made based on your feedback

    :::

### Part 3: Joint Interview (Kaze & Zeina)

These questions are for Kaze and Zeina together, focusing on their unique dynamic as both creative and personal partners.

1.  **A Shared Creation:** You're building RTYI together as collaborators and partners. How does that creative partnership work day-to-day? Where do you draw the line between work and home when you're both so deep in this project?

    ::: info Follow-ups

    - Design decisions made casually over dinner or at home
    - Switching off from "developer mode"
    - The dynamic of working in the same physical space
    - How the project weaves into daily life
    - Balancing the creative work with personal life

    :::

2.  **The Feedback Loop:** You have this unique direct feedback loop. Kaze, you see your first player's raw reactions, and Zeina, you can give feedback directly to the lead developer. How does being partners affect that professional feedback? Does it make things easier or harder to be honest with each other?

    ::: info Follow-ups

    - The "painful to watch" playtest from both perspectives
    - Resolving creative disagreements
    - Being each other's harshest critics
    - The benefits of being able to give instant, honest feedback
    - How personal dynamics affect professional choices on the game

    :::

3.  **The Animation Pipeline:** Let's walk through bringing a character to life together. Kaze, you program the behavior; Zeina, you provide the animation. Can you take me through the process for a specific character, like the Wiggler or Dry Bones? From "we need an enemy that does X" to the final, animated character in the game.

    ::: info Follow-ups

    - The back-and-forth on the Wiggler's notoriously difficult rigging
    - Kaze, what's it like seeing a finished animation for the first time?
    - How do technical constraints from Kaze meet Zeina's artistic vision?
    - The waiting game: "All we're waiting for now is animations"
    - How do animation changes affect programming, and vice versa?

    :::

4.  **Life, Art, and Parenthood:** This project has been part of your lives for years, and you became parents as it nears completion. How has this project shaped your life together, and how has your life, and parenthood, shaped the project and your perspective on it?

    ::: info Follow-ups

    - Balancing development with life events (moving, terrariums, haircuts)
    - How expecting a child changes the project's stakes
    - Reflecting on the "human cost" of such a massive undertaking
    - What does this project mean to you as a legacy you're creating together?

    :::

<style scoped>
.custom-block.info {
  background-color: var(--vp-sidebar-bg-color);
}

.custom-block ul li + li {
  margin-top: 4px;
}
</style>
