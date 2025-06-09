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
    - Kaze: "I like Yoshi" - what does that mean to him?

    :::

2.  **The Drive:** This is years of work, all released for free. Kaze has described it as requiring an obsessive level of dedication. What keeps you going? What's the personal drive that makes you pour so much time and talent into this?

    ::: info Follow-ups

    - The joy of creation vs. the "pure torture" moments
    - What gets you through burnout?
    - The desire to push the N64 to its limits
    - Proving what's possible on 30-year-old hardware
    - The opportunity cost ("tens of thousands")
    - Kaze: "If you want to be successful making video games you need to be mentally unwell"

    :::

3.  **The Soul of RTYI:** From your role on the team, what do you think is the heart and soul of this game? What feeling or experience are you trying to create that makes it different from any other Mario 64 hack or even official Nintendo games?

    ::: info Follow-ups

    - The game's specific "vibe" and "placeness"
    - How the Yoshi theme influences everything
    - Blending nostalgia with innovation
    - "Excitement over difficulty" philosophy
    - Creating intrinsic motivation vs. extrinsic rewards
    - Kaze critiquing AAA games that feel like a "chore"

    :::

4.  **The Creative Process:** Could you walk me through the typical creative process? How does an idea become a finished piece, whether that's a level, a song, a model, or an animation? What's the collaboration like?

    ::: info Follow-ups

    - MS Paint maps and ugly blockout models
    - Discord discussions vs. live stream feedback
    - The back-and-forth between technical needs and artistic vision
    - "Shit phase" philosophy - everything looks terrible at first
    - Real-time iteration during streams
    - How feedback flows between team members

    :::

5.  **A Story of a Challenge:** I'd love to hear about a time when things got really tough. Maybe a technical nightmare, a creative block, or even a disagreement. What happened, and how did you push through to that breakthrough moment?

    ::: info Follow-ups

    - Specific bugs that only show on real hardware
    - Creative dead ends like the Space Arcade concept
    - The Styrofoam texture lighting challenge
    - Paper plane physics going "volatile and chaotic"
    - Compiler errors and F3DEX3 performance issues
    - "This building style is just not exciting me"
    - Times when ideas had to be completely scrapped

    :::

6.  **The N64 Spirit:** You're developing for hardware from 1996. How do those famous N64 limitations actually force you to be more creative? Can you share an example where a limitation led to something unique that wouldn't exist otherwise?

    ::: info Follow-ups

    - Low-poly models and texture memory constraints
    - CPU-based normal mapping for fake lighting
    - Sound font limitations creating a distinct style
    - RAM limits forcing creative solutions ("we don't actually have to 3D model the stuff")
    - Collision system being "unusable" in vanilla
    - The "fucked" audio engine requiring complete rewrite
    - Performance profiler showing red bars

    :::

7.  **The Legacy:** When players finally experience the full game, what do you hope they take away from it? What do you want the lasting impact of "Return to Yoshi's Island" to be?

    ::: info Follow-ups

    - What moments do you want players to remember?
    - The impact on the SM64 modding community
    - Open source engine and codebase release plans
    - Your personal sense of accomplishment
    - Proving what fan projects can achieve
    - The enduring appeal of retro gaming

    :::

### Part 2: Individual Interviews

These questions are tailored to each team member's specific role and contributions, allowing for deeper dives into their unique perspectives and expertise.

#### Kaze Emanuar (Lead Developer)

::: tip Introduction Reminder

- For the narrative, can you please state your name and your role on the project?

:::

**On Vision & Design Philosophy**

1.  You have very clear design principles: creating "placeness," prioritizing excitement over difficulty, respecting the player's time. Can you tell me about a time you had to make a tough call to stick to these principles? Maybe something you really liked but had to cut?

    ::: info Follow-ups

    - The Space Arcade being "terrible" despite initial excitement
    - AAA games as a "chore" - what specifically bothers you?
    - "Cowboyaboo" philosophy - over-the-top and goofy
    - Removing 100-coin stars and "boot out" mechanics
    - "Back when I was making Last Impact I would just put ideas in almost unfiltered"
    - The maturation from Last Impact to RTYI

    :::

2.  You've said the Overworld is "the most important part of the game." What's your vision for it? How are you making it more than just a hub world like in traditional Mario 64?

    ::: info Follow-ups

    - "If you can see it, you can go there"
    - The "tease" of distant landmarks like the lighthouse
    - Permanent world changes (Rain Flower quest, Dory rescue)
    - Nearly 20 seamlessly transitioning music tracks
    - Dynamic events that affect the entire island
    - The evolution from simple coin payment to story-driven events
    - Making coins "feel more valuable than Mario Odyssey"

    :::

**On Technical Mastery**

1.  You didn't just mod SM64, you rewrote huge chunks of it. The sound engine, collision system, even optimized the OS. What drove you to take on these massive technical challenges? What can you do in RTYI that would be impossible without them?

    ::: info Follow-ups

    - Vanilla collision being "unusable" - specific examples
    - The audio engine being "fucked" - what exactly was wrong?
    - Collaboration with Sauraen on F3DEX3 microcode
    - Enabling 60 FPS gameplay
    - Supporting Badub's dynamic overworld music
    - Complex platforming in the Ice Castle
    - The new quaternion-based animation system

    :::

2.  You often have to debug on real N64 hardware because emulators are often inaccurate. What's the most frustrating "emulator hell" bug you've dealt with? How do you even track down something that only breaks on real hardware?

    ::: info Follow-ups

    - Performance profiler tools from Sauraen
    - Crashes that "just work" on certain emulators
    - N64 hardware stability issues
    - The challenge of testing on multiple emulator types
    - Specific examples of emulator-only bugs
    - Why you can't trust emulators for final testing

    :::

**On Collaboration & The Public Eye**

1.  You have a really strong vision for this game, but you're also working with talented collaborators. How do you balance staying true to your vision while being open to their input? What's a time when someone's suggestion fundamentally improved your original idea?

    ::: info Follow-ups

    - Biobak's level reworks ("Holy shit, everything is different")
    - Badub's cowboy music arriving mid-stream and changing everything
    - Zeina's "mutant Yoshi" boss concept
    - Tutorial Bunnies as a collaborative solution
    - Real-time suggestions during streams
    - "Feelings are real, reasoning is stupid" philosophy

    :::

2.  You develop RTYI live on stream with hundreds of people watching and commenting. How do you filter all that input? You've said you value the "feeling" behind feedback but not always the "reasoning". What does that mean in practice?

    ::: info Follow-ups

    - Specific examples of chat ideas being implemented
    - The "growing flower" vine suggestion
    - "Mirror Mario" wall-kick mechanic
    - How streaming helps vs. hinders focus
    - Managing the firehose of suggestions
    - Beta testing feedback vs. stream feedback

    :::

**On The "Nintendo Risk" & The Future**

1.  Nintendo has taken down over 70 of your videos. Every fan project lives under that shadow. How does this reality affect your development and release strategy? What's your plan if the worst happens?

    ::: info Follow-ups

    - Strategic release timing to avoid major Nintendo launches
    - Copyright-free trailers as protection
    - The "legally distinct" asset-swap contingency plan
    - Aspirations for commercial game development
    - Open source release to preserve the work
    - The "calculated risk" mindset
    - Why you do this despite the risks

    :::

#### Biobak (Graphics Artist & Designer)

::: tip Introduction Reminder

- For the narrative, can you please state your name and your role on the project?

:::

**On Visuals & World-Building**

1.  Kaze often shows these basic grey-box levels, and then later we see your rework that completely transforms them. Can you walk me through what happens in between? How do you take a functional layout and breathe life into it? The Course 1 and "Oily Boily Bay" transformation are my favorite reworks.

    ::: info Follow-ups

    - Before/after comparisons
    - Kaze's stream reactions to your reworks
    - Your detailed changelogs explaining every change
    - Course 1 visual overhaul years later
    - Evolving quality standards over time
    - Adding "placeness" to functional geometry

    :::

2.  The Craft Level has such a unique look—cardboard, styrofoam, crayons. What inspired that aesthetic, and how did you make those materials feel convincing on N64 hardware?

    ::: info Follow-ups

    - Creating "fake" lighting for the Styrofoam shine
    - Translating community "doodle" contributions
    - The "Chubby Chai guys" (thimbles) as enemies
    - Working within texture memory limits
    - Making materials feel tactile without modern shaders
    - Collaborating with community contributors like Leila and Danik

    :::

**On Collaboration & N64 Constraints**

1.  How does Kaze communicate what he's looking for in a level? Does he give you reference images, describe a vibe, play you the music? How do you translate that into a cohesive visual style?

    ::: info Follow-ups

    - Receiving MS Paint maps or blockout models
    - Your role as idea contributor beyond just visuals
    - Suggesting level flow improvements
    - Real-time feedback during streams
    - The back-and-forth on technical feasibility

    :::

2.  Making detailed, modern-looking environments for the N64 must be challenging. What's your process for creating something beautiful while managing polycounts, texture limits, and all those constraints on such old hardware?

    ::: info Follow-ups

    - How Kaze adapts your high-poly models
    - Creative solutions for RAM limitations
    - Working with the N64's color palette restrictions
    - Optimizing without losing your artistic vision
    - The constant battle with memory limits

    :::

#### Badub (Composer)

::: tip Introduction Reminder

- For the narrative, can you please state your name and your role on the project?

:::

**On Musical Identity**

1.  What's the musical identity you're creating for "Return to Yoshi's Island"? How do you blend the nostalgic sounds of Mario 64 and Yoshi's Island while making something that feels both fresh and familiar?

    ::: info Follow-ups

    - Using the limited N64 sound font creatively
    - Achieving a "new yet familiar" sound
    - Balancing nostalgia with innovation
    - The influence of both source games
    - Creating cohesion across diverse level themes

    :::

2.  Kaze has said your music directly inspires his level design. Can you walk me through creating music for a specific theme? That moment when your Cowboy Level track arrived during his stream seemed like a turning point.

    ::: info Follow-ups

    - The Cowboy music arriving mid-stream ("Oh, this is so good")
    - How the music inspired adding skybox and fog
    - Kaze's vibe descriptions translating to composition
    - Music arriving before vs. after level design
    - The collaborative back-and-forth

    :::

**On The Craft of N64 Music**

1.  Composing for the N64 has unique challenges. The small sound font and ROM space constraints. How do these limitations shape your compositions? Do you see them as restrictions or creative opportunities?

    ::: info Follow-ups

    - The OST taking significant ROM space (64MB limit)
    - Working with Kaze's rewritten sound engine
    - Creative workarounds for instrument limitations
    - Making dynamic music within constraints
    - The challenge vs. opportunity mindset

    :::

2.  The overworld has almost 20 tracks that seamlessly transition as you explore. What were the challenges in composing such an ambitious adaptive score for N64 hardware?

    ::: info Follow-ups

    - Ensuring smooth transitions between area themes
    - Working with Kaze on timing and triggers
    - Technical implementation challenges
    - Creating musical coherence across the island
    - Dynamic music responding to player actions

    :::

#### Zeina (Animator & Artist)

::: tip Introduction Reminder

- For the narrative, can you please state your name and your role on the project?

:::

**On Animation & Giving Life to Characters**

1.  You bring the game's characters to life through animation. What's your approach to giving personality and emotion to characters within the N64's technical limits? My favorite character is the Piano Guy, he has so much charisma.

    ::: info Follow-ups

    - Working with bone limits and old "geo bone" system
    - The new quaternion-based animation system benefits
    - Conveying character through movement, not polygon count
    - Making enemies feel alive and reactive
    - The animation pipeline with Kaze's programming

    :::

**On Art, Design & Influence**

1.  Beyond animation, you've contributed so much: 2D art, 3D models, concept art. Can you tell me about your concept art for the mutant Yoshi boss or the zoo entrance? How did those drawings shape what the team built?

    ::: info Follow-ups

    - Collaborating with Kaze and Biobak on cohesive style
    - Creating models like Peach and Toad
    - Texture work (bunny footprints, signs)
    - Initial sketches becoming key game elements
    - Your artistic influence on the project's direction

    :::

2.  Kaze says your feedback as the "first playtester" is invaluable. What kinds of things do you notice as an artist and animator that might get missed otherwise? I heard there was a section he made easier because it was "painful to watch" you play it.

    ::: info Follow-ups

    - The "painful to watch" story from your perspective
    - How gameplay feel influences your animation choices
    - Catching issues a programmer might miss
    - Your unique perspective as artist and player
    - Direct changes made based on your feedback

    :::

### Part 3: Joint Interview (Kaze & Zeina)

These questions are for Kaze and Zeina together, focusing on their unique dynamic as both creative and personal partners.

1.  **A Shared Creation:** You've built "Return to Yoshi's Island" together as both collaborators and partners. How does your creative partnership work day to day? Where do you draw the line between work and home when you're both so deep in this project?

    ::: info Follow-ups

    - Design decisions made casually at home
    - Switching off from "developer mode"
    - Working in the same space
    - How the project weaves into daily life
    - Balancing creative work with personal time

    :::

2.  **The Feedback Loop:** You have this unique dynamic. Kaze, you see your first player's raw reactions, and Zeina, you can give feedback directly to the lead developer. How does being partners affect that professional feedback? Does it make things easier or harder to be honest with each other?

    ::: info Follow-ups

    - The "painful to watch" playtest from both perspectives
    - Resolving creative disagreements
    - Being each other's harshest critics
    - The benefits of instant, honest feedback
    - How personal dynamics affect professional choices

    :::

3.  **The Animation Pipeline:** Let's talk about bringing a character to life. Kaze programs the behavior, Zeina provides the animation. Can you walk me through creating a specific character together? From "we need an enemy that does X" to the final animated character in the game?

    ::: info Follow-ups

    - The Wiggler or Dry Bones creation process
    - Kaze seeing finished animations for the first time
    - Technical constraints meeting artistic vision
    - The waiting game ("all we're waiting now is for animations")
    - How animation changes affect programming and vice versa

    :::

4.  **Life, Art, and Parenthood:** This project has been part of your lives for years, and now you're expecting a child as it nears completion. How has the project shaped your life together, and how has your life shaped the project?

    ::: info Follow-ups

    - Balancing development with life events (moving, terrariums, haircuts)
    - How expecting a child changes the project's stakes
    - The "human cost" of such a massive undertaking
    - What this project means as you enter parenthood
    - The legacy you're creating together

    :::

<style scoped>
.custom-block.info {
  background-color: var(--vp-sidebar-bg-color);
}

.custom-block ul li + li {
  margin-top: 4px;
}
</style>
