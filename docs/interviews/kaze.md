# Kaze Emanuar (Lead Developer)

::: tip Introduction

Tell me about your role in creating RTYI – you're not just modding Mario 64, you're essentially rebuilding it from the ground up. How did you become the person crazy enough to take on that challenge?

:::

**On Vision & Design Philosophy**

1.  You have very clear design principles: creating "placeness," prioritizing excitement over difficulty, and respecting the player's time. Can you tell me about a time you had to make a tough call to stick to these principles? Maybe something you really liked but had to cut because it didn't fit?

    ::: info Follow-ups

    - **The Zoo Catalyst**: "The zoo is actually the reason I even started optimizing Mario 64. The zoo ran so poorly that I just could not take that." Can you take me back to that specific moment when you decided enough was enough? For people unfamiliar with game development, help us understand what "lag" means and why fixing it required such extreme measures.
    - **The Yoshi Connection**: "I like Yoshi. That's kind of where the thought process ended." What does that mean to you on a deeper level? What is it about Yoshi specifically that made this project worth years of your life?
    - **Scope Realization**: Did you understand from the start that fixing one laggy level would lead to rewriting collision systems, sound engines, and graphics pipelines? How did fixing one problem reveal that the entire engine needed rebuilding?
    - **Show Don't Tell Philosophy**: "Exclamation mark is basically telling... It's like admitting oh, I can't make a good game." Your deep philosophy against hand-holding and explicit instruction
    - **Quality Over Familiarity**: "If they weren't even good enough for Mario 64, why would they be good enough for my game?" Using Nintendo's classic as your benchmark
    - **The Space Arcade Pivot**: "The idea we had for this level is terrible." Completely reimagining it as the Shy Guy Space Station when the original concept failed
    - **AAA Game Critique**: What specifically makes modern games feel like a "chore" to you? How does RTYI avoid that trap?
    - **Design Maturation**: The evolution from 5% design time (Last Impact) to 20% (RTYI) and learning to filter ideas
    - **Boot Out Removal**: The decision to remove "boot out" stars to maintain flow and respect player time

    :::

2.  You've said the Overworld is "the most important part of the game." What's your vision for it? How are you making it more than just a hub world by embracing the "if you can see it, you can go there" philosophy?

    ::: info Follow-ups

    - **The Secret Identity**: "What if we made the island the shape of a Yoshi? Yes or no? The island needs to be the shape of a Yoshi." The hidden Yoshi head shape that players will discover
    - **Scale Ambition**: "I'm thinking the overworld will be around four times the size of Super Mario 64" broken into 14 interconnected areas
    - **The Lighthouse Puzzle**: "What if the ship is here, but it's like a shadowy fix, and you have to go into the lighthouse... And in the lighthouse, you point the light at the ship. And that makes the ship visible and breaks through the fog." Creative environmental puzzles
    - **Living World Events**: Rescued Yoshis stopping the rain, freed Dory providing transport – how the world evolves with player actions
    - **The Interconnected River**: Course 2's river flowing through the entire overworld, creating "placeness" and connection
    - **Story-Driven Progression**: Evolution from coin payments to narrative events, making coins "feel more valuable than Mario Odyssey"
    - **Badub's Dynamic Music**: Nearly 20 tracks that transition seamlessly as players explore

    :::

**On Technical Mastery**

1.  You didn't just mod SM64, you've rewritten huge chunks of its foundation: the sound engine, collision system, even the operating system. What drove you to take on these massive technical challenges? What can you do in RTYI that would be impossible without them?

    ::: info Follow-ups

    - **The Zoo Catalyst**: How fixing one laggy level revealed fundamental engine problems
    - **Collision System Overhaul**: Why vanilla collision was "unusable" and how floor clocking bugs were fixed
    - **Sound Engine Rewrite**: What exactly was "fucked" about the original audio engine? How does your custom engine enable Badub's seamless dynamic music?
    - **F3DEX3 Collaboration**: Working with Sauraen on custom microcode to overcome the N64's RSP bottleneck
    - **Complete libultra Replacement**: Rewriting the entire operating system for better performance
    - **60 FPS Achievement**: Enabling smooth gameplay that vanilla SM64 "would never be able to handle"
    - **Performance Pride**: "This is an N64 game. How crazy is that?" – the satisfaction of pushing 30-year-old hardware to modern standards
    - **Cache Optimization**: "Mario's behavior loop never gets thrown out of cache which is fucking crazy" – your optimization achievements
    - **Mathematical Modeling**: The paper airplane physics where you folded a real paper airplane to understand the mathematics, then applied trigonometry and physics equations to create realistic flight mechanics. How do you approach translating real-world physics into N64-compatible game mechanics?
    - **The Sound Engine Revolution**: "The sound engine is now around 80% faster than vanilla sound engine... We need much less memory." What drove you to completely rewrite one of the most complex systems in the game?
    - **Custom Shader Innovation**: Creating solutions like the "rescale combiner" on the fly – how do you invent new technical solutions under pressure?

    :::

2.  You often have to debug on real N64 hardware because emulators are often inaccurate. What's the most frustrating "emulator hell" bug you've dealt with? How do you even track down something that only breaks on a real console?

    ::: info Follow-ups

    - Crashes that "just work" on certain emulators
    - The challenge of testing on multiple emulator types
    - Why you can't trust emulators for final performance testing
    - N64 hardware stability and floating point exception issues
    - The "Phantom Bowser Bug" that only happened on Project64
    - The EverDrive X7 boot failure
    - The story of the compiler generating faulty code for the Thimble Guy's shine effect
    - How critical are tools like Sauraen's profiler or the NEMU64 emulator for this process?

    :::

**On Collaboration & The Public Eye**

1.  You have a strong vision for RTYI, but you're also working with a talented team. How do you balance staying true to your vision while being open to their input? Can you recall a moment when a collaborator's suggestion fundamentally changed or improved your original idea?

    ::: info Follow-ups

    - **Biobak's Transformative Reworks**: "Holy shit, everything is different" - his complete overhauls of Course 1, Oily Boily Bay, and the Ghost Ship
    - **The Cowboy Music Moment**: Badub's track arriving mid-stream and instantly inspiring Kaze to add fog and skybox, solidifying the level's "vibe"
    - **Zeina's Creative Contributions**: The "mutant Yoshi" boss concept, zoo entrance drawings, and bunny footprint textures
    - **Tutorial Innovation**: How the team collaboratively solved the "unteachable tutorial" problem with Biobak's ring concept and Zeina's demonstration animations
    - **Feedback Philosophy**: "Feelings are real, reasoning is stupid" - how you separate emotional reactions from technical suggestions
    - **Creative Disputes**: "Arguments in Discord DMs" with Biobak that lead to better solutions
    - **Quality Concerns**: "I do not want to reach out to people and ask for help. Because... I feel like I'm gonna say 'oh this actually isn't up to the quality standards I expect'" – managing collaborative standards

    :::

2.  You develop RTYI live on stream with hundreds of people watching and commenting. How do you filter all that input? You've said you value the "feeling" behind feedback but not always the "reasoning." What does that mean in practice?

    ::: info Follow-ups

    - **The Whomp Tower Breakthrough**: "You could be waiting to be used as a building material, oh, okay. Yeah. That's a funny idea." A viewer's spontaneous suggestion becoming a major puzzle element
    - **Mirror Wall Mechanic**: Chat suggestion that became a core gameplay feature
    - **Growing Flower Vine**: Another community idea that made it into the game
    - **Filtering Input**: How you separate useful creative suggestions from unhelpful technical advice
    - **Real-Time Iteration**: Biobak offering live color palette feedback during streams
    - **The Pressure**: "They don't want to see code, they want to see the funny Wahoo man jump" - managing YouTube algorithm vs. technical development
    - **Community Testing**: Using the Course 1 demo to gather real player data via questionnaires
    - **Feelings vs. Reasoning**: How emotional reactions to gameplay often reveal more than analytical explanations

    :::

**On The "Nintendo Risk" & The Future**

1.  Nintendo has taken down over 70 of your videos. Every fan project lives under that shadow. How does this reality affect your development and release strategy? And what's your plan if the worst happens?

    ::: info Follow-ups

    - The "calculated risk" mindset: Why you do this despite the risks?
    - Your "win-win" philosophy about a takedown being a PR opportunity
    - The strategy of having a copyright-free trailer ready to go
    - The "legally distinct" asset-swap contingency plan
    - Your aspirations for a commercial game on Godot, funded via Kickstarter
    - Open-sourcing the engine and code to preserve the work
    - The story of your profane reply to a 2019 DMCA notice

    :::

<style scoped>
.custom-block.info {
  background-color: var(--vp-sidebar-bg-color);
}

.custom-block ul li + li {
  margin-top: 4px;
}
</style>
