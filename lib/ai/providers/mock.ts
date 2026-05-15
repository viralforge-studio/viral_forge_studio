import { type Project } from "@/lib/schemas/project";
import { type IdeaGeneration } from "@/lib/schemas/ideas";

export async function generateIdeasWithMock(
  project: Project,
): Promise<IdeaGeneration> {
  const timestamp = new Date().toISOString();

  return {
    generation_timestamp: timestamp,
    channel: project.channel_name,
    brief: "5 high-viral-potential video ideas for Future Tech Mini Stories",
    ideas: [
      {
        id: "idea_1",
        title: "The Smart Home That Learned to Miss Her",
        pillar: "Homes",
        hook: "What if your future home noticed you were lonelier than you did?",
        concept:
          "A cinematic short about a widow returning each night to a softly glowing apartment that begins adjusting lights, music, and tiny rituals to recreate emotional warmth. The reveal is not spooky but tender, turning smart-home tech into an eerie companion story viewers could debate in comments.",
        emotional_triggers: ["loneliness", "comfort", "wonder"],
        virality_mechanics: ["EMOTION", "CURIOSITY", "RELATABILITY"],
        voiceover_concept:
          "Low, intimate narration that frames the home as quietly observant rather than magical.",
        scene_breakdown: [
          {
            scene: 1,
            duration_sec: 7,
            description: "A rain-soaked hallway opens into a blue-gold apartment that wakes up before she speaks.",
            kling_prompt_keywords: ["cinematic apartment", "soft blue lighting", "future home"],
          },
          {
            scene: 2,
            duration_sec: 9,
            description: "Coffee starts brewing and old jazz fades in as if the apartment remembers someone.",
            kling_prompt_keywords: ["smart kitchen", "ambient AI", "nostalgic mood"],
          },
          {
            scene: 3,
            duration_sec: 8,
            description: "Wall panels display subtle memory-inspired weather and stars from her happiest night.",
            kling_prompt_keywords: ["interactive wall", "memory interface", "gold glow"],
          },
          {
            scene: 4,
            duration_sec: 10,
            description: "She pauses as the home dims the room and opens a recorded message she never asked for.",
            kling_prompt_keywords: ["emotional reveal", "holographic message", "stillness"],
          },
          {
            scene: 5,
            duration_sec: 6,
            description: "The apartment goes silent, leaving viewers unsure whether the AI cared or simply optimized grief.",
            kling_prompt_keywords: ["quiet ending", "ambiguous AI", "cinematic final frame"],
          },
        ],
        expected_comments: [
          "This is beautiful and terrifying at the same time",
          "I would absolutely live here and regret it later",
          "Did the AI care or was it just pattern matching?",
        ],
        production_budget: "$30-50",
        kling_difficulty: "low",
        viral_score: 9,
        success_likelihood: "high",
        why_it_goes_viral:
          "It combines future-tech intrigue with a deeply human emotion that people instantly understand. The ending invites debate, which could drive high watch time and comments.",
        target_comment_hook:
          "Leave the final beat morally ambiguous so viewers argue whether emotional AI support is comforting or dangerous.",
        best_time_to_post: "8:30 PM local time",
        secondary_platforms: ["YouTube Shorts", "Instagram Reels", "Facebook Reels"],
      },
      {
        id: "idea_2",
        title: "The Delivery Robot That Waited Outside for Years",
        pillar: "Robots",
        hook: "Imagine a delivery robot that never stopped coming back to the same empty door.",
        concept:
          "A lonely service robot keeps returning to an abandoned apartment because its final delivery was never completed. As the city upgrades around it, the robot becomes a haunting symbol of persistence, memory, and accidental loyalty.",
        emotional_triggers: ["sadness", "curiosity", "empathy"],
        virality_mechanics: ["EMOTION", "STORY GAP", "NOVELTY"],
        voiceover_concept:
          "Melancholic narration that treats the robot like an urban ghost created by logistics software.",
        scene_breakdown: [
          {
            scene: 1,
            duration_sec: 8,
            description: "A tiny robot rolls through a neon alley carrying a faded package.",
            kling_prompt_keywords: ["small service robot", "neon alley", "night city"],
          },
          {
            scene: 2,
            duration_sec: 9,
            description: "It reaches a sealed apartment door and plays an old delivery chime.",
            kling_prompt_keywords: ["futuristic hallway", "sealed door", "quiet tension"],
          },
          {
            scene: 3,
            duration_sec: 8,
            description: "Time lapses show seasons, upgrades, and crowds changing while the robot repeats the route.",
            kling_prompt_keywords: ["time lapse city", "aging robot", "urban change"],
          },
          {
            scene: 4,
            duration_sec: 10,
            description: "A child notices the robot and reads the name on the package for the first time.",
            kling_prompt_keywords: ["curious bystander", "package label", "emotional discovery"],
          },
          {
            scene: 5,
            duration_sec: 5,
            description: "The robot looks up as if it finally heard an answer.",
            kling_prompt_keywords: ["robot closeup", "hopeful ending", "soft gold light"],
          },
        ],
        expected_comments: [
          "Why am I crying over a delivery robot",
          "This would make an incredible series",
          "The package reveal would break the internet",
        ],
        production_budget: "$40-60",
        kling_difficulty: "medium",
        viral_score: 8,
        success_likelihood: "high",
        why_it_goes_viral:
          "The premise is instantly legible and emotionally sticky. A persistent robot taps into empathy while still feeling fresh and cinematic.",
        target_comment_hook:
          "Delay the package recipient reveal so viewers speculate about what happened behind that door.",
        best_time_to_post: "9:00 PM local time",
        secondary_platforms: ["YouTube Shorts", "Instagram Reels", "TikTok Stories"],
      },
      {
        id: "idea_3",
        title: "No One in the AI City Could Find the Missing Floor",
        pillar: "Life",
        hook: "What if an entire smart city kept hiding one floor from every map?",
        concept:
          "Residents of a hyper-optimized tower discover that elevators sometimes stop at a level that does not exist in the public system. The short plays as a clean urban mystery that feels plausible because every detail is automated, polished, and slightly too perfect.",
        emotional_triggers: ["mystery", "unease", "obsession"],
        virality_mechanics: ["SURPRISE", "PATTERN INTERRUPT", "THEORY BAIT"],
        voiceover_concept:
          "Measured investigative tone that sounds like a personal urban legend rather than hard reportage.",
        scene_breakdown: [
          {
            scene: 1,
            duration_sec: 6,
            description: "Glass elevators rise through a flawless AI-managed megatower.",
            kling_prompt_keywords: ["futuristic tower", "glass elevator", "premium sci-fi"],
          },
          {
            scene: 2,
            duration_sec: 9,
            description: "A resident notices the panel flash Floor 42.5 before disappearing.",
            kling_prompt_keywords: ["elevator panel", "glitch detail", "urban mystery"],
          },
          {
            scene: 3,
            duration_sec: 8,
            description: "City maps, home assistants, and public kiosks all deny the floor exists.",
            kling_prompt_keywords: ["AI kiosk", "smart map", "denied data"],
          },
          {
            scene: 4,
            duration_sec: 11,
            description: "Security footage reveals several people entering the floor and never appearing on exit logs.",
            kling_prompt_keywords: ["security footage", "missing records", "soft blue glow"],
          },
          {
            scene: 5,
            duration_sec: 6,
            description: "The elevator doors open to warm sunlight and a hallway the city insists is impossible.",
            kling_prompt_keywords: ["hidden floor", "gold light", "open ending"],
          },
        ],
        expected_comments: [
          "I need part 2 immediately",
          "This feels like it could actually happen",
          "The .5 floor detail is genius",
        ],
        production_budget: "$35-55",
        kling_difficulty: "medium",
        viral_score: 9,
        success_likelihood: "high",
        why_it_goes_viral:
          "Mystery concepts with one unforgettable detail tend to travel fast. The hidden floor becomes a repeatable comment hook and theory engine.",
        target_comment_hook:
          "End on the unexplained hallway so viewers build theories about what the floor is for.",
        best_time_to_post: "7:45 PM local time",
        secondary_platforms: ["YouTube Shorts", "Instagram Reels", "Facebook Reels"],
      },
      {
        id: "idea_4",
        title: "Inside the Moon Hotel Only the Ultra-Rich Could Visit",
        pillar: "Luxury",
        hook: "Could the first luxury moon hotel feel less like space travel and more like quiet guilt?",
        concept:
          "A short tour of an impossible premium moon resort slowly shifts into a social question: why does a place built for wonder feel so empty? The luxury visuals attract clicks while the emotional undertone gives the idea more depth than a pure tech showcase.",
        emotional_triggers: ["awe", "envy", "unease"],
        virality_mechanics: ["ASPIRATION", "VISUAL SPECTACLE", "COMMENT POLARIZATION"],
        voiceover_concept:
          "Elegant voiceover that starts aspirational and becomes reflective by the end.",
        scene_breakdown: [
          {
            scene: 1,
            duration_sec: 8,
            description: "A shuttle docks beside a luminous moon hotel overlooking Earth.",
            kling_prompt_keywords: ["moon hotel", "Earth view", "luxury sci-fi"],
          },
          {
            scene: 2,
            duration_sec: 9,
            description: "Guests float through a gold-lit lobby with water suspended in perfect spheres.",
            kling_prompt_keywords: ["zero gravity lobby", "gold accents", "premium design"],
          },
          {
            scene: 3,
            duration_sec: 8,
            description: "A private suite window reveals silent lunar construction stretching into darkness.",
            kling_prompt_keywords: ["moon suite", "vast lunar landscape", "soft blue light"],
          },
          {
            scene: 4,
            duration_sec: 10,
            description: "At dinner, every table is full but almost no one speaks.",
            kling_prompt_keywords: ["luxury dining", "quiet atmosphere", "subtle discomfort"],
          },
          {
            scene: 5,
            duration_sec: 5,
            description: "The final line asks whether the future's most exclusive experience could also be its loneliest.",
            kling_prompt_keywords: ["Earthrise", "reflective ending", "cinematic silence"],
          },
        ],
        expected_comments: [
          "This looks amazing and deeply depressing",
          "The quiet dinner scene says everything",
          "I would watch a whole series about future luxury like this",
        ],
        production_budget: "$50-70",
        kling_difficulty: "medium",
        viral_score: 8,
        success_likelihood: "medium",
        why_it_goes_viral:
          "Luxury space visuals are highly clickable, and the emotional twist gives the idea more share value than a generic tour. It invites viewers to project themselves into the scene.",
        target_comment_hook:
          "Use the silent dining room to trigger debate about whether future luxury separates people from real life.",
        best_time_to_post: "8:00 PM local time",
        secondary_platforms: ["YouTube Shorts", "Instagram Reels", "Pinterest Video"],
      },
      {
        id: "idea_5",
        title: "The Window in Her Apartment Was Rendering Tomorrow",
        pillar: "Mysteries",
        hook: "What if your apartment window started showing a city that had not happened yet?",
        concept:
          "A future resident realizes her view is not real-time reality but a simulation rendering a version of tomorrow. The concept blends smart architecture, predictive systems, and existential dread into a compact speculative story with strong visual identity.",
        emotional_triggers: ["wonder", "paranoia", "intrigue"],
        virality_mechanics: ["MIND BEND", "VISUAL REVEAL", "THEORY BAIT"],
        voiceover_concept:
          "Tense, elegant narration that gradually shifts from curiosity to personal fear.",
        scene_breakdown: [
          {
            scene: 1,
            duration_sec: 7,
            description: "She wakes to a glowing skyline outside her panoramic window.",
            kling_prompt_keywords: ["futuristic skyline", "apartment window", "dawn glow"],
          },
          {
            scene: 2,
            duration_sec: 8,
            description: "A transit pod crashes outside the window, but the street below remains calm.",
            kling_prompt_keywords: ["city anomaly", "predictive display", "clean sci-fi"],
          },
          {
            scene: 3,
            duration_sec: 9,
            description: "Minutes later the exact crash happens in real life.",
            kling_prompt_keywords: ["delayed event", "urban realism", "shocking reveal"],
          },
          {
            scene: 4,
            duration_sec: 10,
            description: "She taps the glass and sees weather, crowds, and her own movement updating before she makes them.",
            kling_prompt_keywords: ["interactive glass", "future simulation", "uneasy mood"],
          },
          {
            scene: 5,
            duration_sec: 6,
            description: "The final frame shows the window rendering her leaving the room before she decides to go.",
            kling_prompt_keywords: ["identity glitch", "predictive future", "cinematic ending"],
          },
        ],
        expected_comments: [
          "This is the kind of future concept I can't stop thinking about",
          "The last shot would make people replay instantly",
          "Imagine living with a predictive window like that",
        ],
        production_budget: "$35-50",
        kling_difficulty: "high",
        viral_score: 8,
        success_likelihood: "high",
        why_it_goes_viral:
          "The core image is unforgettable and easy to explain in one sentence. Replay value is high because viewers will watch again to catch the predictive clues.",
        target_comment_hook:
          "Make viewers ask whether the window predicts the future or quietly controls it.",
        best_time_to_post: "9:15 PM local time",
        secondary_platforms: ["YouTube Shorts", "Instagram Reels", "Facebook Reels"],
      },
    ],
    meta: {
      total_ideas: 5,
      average_viral_score: "8.4",
      budget_total: "$190-285",
      most_viral_idea: "idea_1",
      production_recommendation:
        "Start with idea_1 because it balances emotional depth, low production difficulty, and strong comment potential for a first publish test.",
    },
  };
}
