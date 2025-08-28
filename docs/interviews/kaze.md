# Kaze Emanuar (Lead Developer)

::: tip Introduction

Tell me about your role in creating RTYI – you're not just modding Mario 64, you're essentially rebuilding it from the ground up. How did you become the person crazy enough to take on that challenge?

:::

## On Vision & Design Philosophy

1.  You have very clear design principles: creating "placeness," prioritizing excitement over difficulty, and respecting the player's time. Can you tell me about a time you had to make a tough call to stick to these principles? Maybe something you really liked but had to cut because it didn't fit?

    ::: info Follow-ups

    - **The Zoo Catalyst**: The Zoo's lag spiraling into a full engine rewrite: "The zoo is actually the reason I even started optimizing Mario 64. The zoo ran so poorly that I just could not take that."
    - **Design Philosophy**: "Tell stories in this game" philosophy and its concrete manifestation in RTYI design choices.
    - **Influences**: Older titles, like _SpongeBob SquarePants: Battle for Bikini Bottom_, and influences for a friction-free, enjoyable platformer.
    - **Placeness vs. Gameplay**: Balancing world-building with "excitement over difficulty."
    - **Killing Darlings**: Scrapping the "terrible" Space Arcade for the Shy Guy Space Station.
    - **Design Maturity**: Evolving from 5% design time (_Last Impact_) to 20% (RTYI).
    - **AAA Game Critique**: Designing to avoid modern AAA "chore" gameplay.
    - **Show, Don't Tell**: The philosophy behind removing exclamation marks and using "tutorial bunnies."
    - **Rule of Cool**: Your philosophy that "this is not about logic, this is about cool."

    :::

2.  You've said the Overworld is "the most important part of the game." What's your vision for it? How are you making it more than just a hub world by embracing the "if you can see it, you can go there" philosophy?

    ::: info Follow-ups

    - **Secret Identity**: The overworld shaped like a Yoshi head, a secret players might only notice on a map.
    - **A Living World**: Permanent world changes after events like a volcano eruption, a pirate attack, or NPCs building new structures.
    - **Interconnected Design**: The river flowing from Course 2 through the whole overworld, and shortcuts that open up as you progress.
    - **The Lighthouse Puzzle**: Using the lighthouse to reveal the Ghost Ship instead of a simple star door.
    - **Dynamic Music**: Badub's 20+ transitioning tracks for the overworld.
    - **Coin Economy**: Making coins "more valuable than Mario Odyssey" with shops and donation-based events.

    :::

## On Technical Mastery

1.  You didn't just mod SM64, you've rewritten huge chunks of its foundation: the sound engine, collision system, even the operating system. What drove you to take on these massive technical challenges? What can you do in RTYI that would be impossible without them?

    ::: info Follow-ups

    - **Engine from Scratch**: The "Ship of Theseus" approach to replacing vanilla code until it's almost entirely custom.
    - **The Sound Engine**: What was so "fucked" about the vanilla audio engine? The story of the 80% performance gain and 32-note polyphony.
    - **Collision Overhaul**: Fixing the "unusable" vanilla collision and "floor clocking" to be more stable and predictable.
    - **Microcode Collaboration**: Working with Sauraen on F3DEX3 to beat RSP bottlenecks, making the game RSP-bound instead of RDP-bound.
    - **Performance Pride**: Achieving 60 FPS and the "Mario's behavior loop" i-cache optimization. Kaze: "This is an N64 game. How crazy is that?"
    - **Real-World Physics**: The paper airplane experiment and translating its flight into code.
    - **Hardware-Based RNG**: Using the N64's cycle counter for true hardware randomness, even if it breaks TAS determinism.

    :::

2.  You often have to debug on real N64 hardware because emulators are often inaccurate. What's the most frustrating "emulator hell" bug you've dealt with? How do you even track down something that only breaks on a real console?

    ::: info Follow-ups

    - **Emulator Hell**: The story of a hardware-only crash caused by a single misplaced coin formation.
    - **The Compiler's Fault**: Debugging a crash caused by the compiler moving a division-by-zero into a branch delay slot.
    - **Hardware vs. Emulator**: Why emulators can't be trusted for final performance, and the decision to drop emulator support after v1.1.
    - **Essential Tools**: The importance of Sauraen's profiler and the custom NEMU64 build for live GDB debugging.
    - **The EverDrive Failure**: The story behind the EverDrive X7 boot failure and the RAM-clearing fix.
    - **The Phantom Bowser**: The bug that only happened on Project64 where Mario would randomly drop Bowser.

    :::

## On Collaboration & The Public Eye

1.  You have a strong vision for RTYI, but you're also working with a talented team. How do you balance staying true to your vision while being open to their input? Can you recall a moment when a collaborator's suggestion fundamentally changed or improved your original idea?

    ::: info Follow-ups

    - **Biobak's Reworks**: The "Holy shit, everything is different" moment when seeing the Ghost Ship or Oily Boily Bay reworks.
    - **Badub's Music**: The "Cowboy Crisis" and how Badub's music instantly solved a creative block on the Western level. Also watching Western movies for inspiration.
    - **Zeina's Concepts**: The "mutant Yoshi" boss concept and other artistic influences on level design.
    - **Collaborative Problem-Solving**: Solving the "unteachable tutorial" for the Bomb-Cap Factory as a team.
    - **Managing Standards**: Hesitation to ask for help due to quality concerns: "I do not want to reach out to people and ask for help. Because... I feel like I'm gonna say 'oh this actually isn't up to the quality standards I expect'."
    - **Creative Arguments**: Resolving disagreements with collaborators like Biobak over the overworld design.
    - **The "Soft Skills" Epiphany**: Your recent realization about the importance of "soft skills" in collaboration.

    :::

2.  You develop RTYI live on stream with hundreds of people watching and commenting. How do you filter all that input? You've said you value the "feeling" behind feedback but not always the "reasoning." What does that mean in practice?

    ::: info Follow-ups

    - **Feelings vs. Reasoning**: Your philosophy on processing viewer feedback.
    - **Community-Sourced Features**: The Whomp Tower, mirror wall, growing vine ideas, and the Womp-stacking gag in the factory.
    - **Live Feedback Loop**: Biobak offering real-time color feedback during streams.
    - **The Pressure of Public Dev**: Balancing the YouTube algorithm vs. tedious development work.
    - **Community Testing**: Using questionnaires from the Course 1 demo to gather structured feedback.

    :::

## On The "Nintendo Risk" & The Future

1.  Nintendo has taken down over 70 of your videos. Every fan project lives under that shadow. How does this reality affect your development and release strategy? And what's your plan if the worst happens?

    ::: info Follow-ups

    - **The Takedowns**: Emotional impact of Nintendo taking down over 70 of your videos.
    - **"Calculated Risk" Mindset**: Why you continue despite the constant threat, and timing releases to avoid major Nintendo announcements.
    - **"Win-Win" Scenario**: Your view of a takedown as a PR opportunity to launch an original IP.
    - **Contingency Plans**: The "legally distinct" asset-swap for a Steam release and open-sourcing the engine.
    - **The Profane Reply**: The story behind your colorful reply to a 2019 DMCA notice.
    - **Commercial Aspirations**: The long-term goal of a Kickstarter for an original game after RTYI is complete.
    - **Physical Release**: The plan to sell a physical box and manual (with no ROM) to avoid legal issues. Technical hurdles of a MP3 player cartridge.

    :::

<style scoped>
.custom-block.info {
  background-color: var(--vp-sidebar-bg-color);
}

.custom-block ul li + li {
  margin-top: 4px;
}
</style>
