import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import {
  type ScriptGeneration,
  type ScriptSceneRole,
} from "@/lib/schemas/script";

const sceneRoles: ScriptSceneRole[] = [
  "Hook",
  "Setup",
  "Build",
  "Tension",
  "Twist / Emotional Reveal",
];

const sceneDurations = [6, 7, 7, 7, 8];

export async function generateScriptWithMock(
  project: Project,
  selectedIdea: Idea,
  scriptPrompt: string,
): Promise<ScriptGeneration> {
  void scriptPrompt;

  const scenes = selectedIdea.scene_breakdown.map((scene, index) => ({
    scene_number: index + 1,
    duration_sec: sceneDurations[index] ?? scene.duration_sec,
    scene_role: sceneRoles[index] ?? "Build",
    slug: `${selectedIdea.id}-scene-${index + 1}`,
    narration:
      index === 0
        ? selectedIdea.hook
        : index === 4
          ? `Maybe the real story was never the technology. Maybe it was the feeling it left behind.`
          : `${selectedIdea.concept} ${selectedIdea.voiceover_concept}`,
    visual_summary: scene.description,
    emotional_purpose:
      selectedIdea.emotional_triggers[index % selectedIdea.emotional_triggers.length],
    visual_goal:
      index === 0
        ? "Make the concept instantly understandable and impossible to scroll past."
        : index === 4
          ? "Deliver the emotional reveal without over-explaining the mystery."
          : "Advance the idea clearly while preserving wonder and unease.",
    editor_text_overlay_suggestion:
      index === 0
        ? selectedIdea.title
        : index === 4
          ? "What would you do here?"
          : selectedIdea.virality_mechanics[index % selectedIdea.virality_mechanics.length],
    sound_design_notes:
      index === 0
        ? "Low atmospheric swell with a clean opening accent."
        : index === 4
          ? "Let the ambience breathe, then end on a soft unresolved tail."
          : "Use restrained room tone, subtle drones, and light futuristic texture.",
    transition_notes:
      index === 4
        ? "Hold the final beat a fraction longer before cutting to black."
        : "Use a soft cinematic cut with continuity in light and mood.",
    continuity_notes:
      "Keep the same visual world, lighting language, and faceless presentation throughout.",
    kling_risk_notes:
      "Avoid precise hand choreography, lip sync, readable embedded text, and detailed facial acting.",
    source_idea_scene_reference: `Original idea scene ${scene.scene}`,
  }));

  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration_sec, 0);
  const cleanScript = scenes.map((scene) => scene.narration).join(" ");

  return {
    generation_timestamp: new Date().toISOString(),
    project_id: project.id,
    channel: project.channel_name,
    idea_id: selectedIdea.id,
    source_idea_title: selectedIdea.title,
    title: selectedIdea.title,
    opening_hook: selectedIdea.hook,
    story_summary: `${selectedIdea.concept} The script preserves the original hook, emotional triggers, and target ambiguity while shaping the story into a clean five-scene future documentary.`,
    script_voice: selectedIdea.voiceover_concept,
    full_voiceover: cleanScript,
    voiceover: {
      clean_script: cleanScript,
      estimated_word_count: cleanScript.split(/\s+/).filter(Boolean).length,
      delivery_style: "calm, cinematic, mysterious",
      pace: "slow-medium",
      pause_notes: [
        "Pause briefly after the opening hook.",
        "Let the tension scene breathe before the final reveal.",
      ],
    },
    scenes,
    closing_payoff: selectedIdea.why_it_goes_viral,
    target_comment_hook: selectedIdea.target_comment_hook,
    platform_caption: `${selectedIdea.hook} ${selectedIdea.target_comment_hook}`,
    hashtags: ["#FutureFiles", "#FutureTech", "#AIVideo"],
    estimated_duration_seconds: totalDuration,
    total_duration_sec: totalDuration,
    production_notes: {
      face_policy: "Use silhouettes, backs, reflections, or blurred profiles only.",
      editing_style: "Slow cinematic pacing, soft cuts, minimal text overlays.",
      recommended_test_scene: 1,
      why_test_this_scene_first:
        "Test the opening scene first because it establishes the visual world, hook clarity, and emotional tone for the full short.",
      main_generation_risks: [
        "Overcomplicated motion that distracts from the hook.",
        "Scenes becoming too literal and losing ambiguity.",
        "Readable in-frame text or facial dependence creeping into shots.",
      ],
    },
    next_step: {
      recommended_action:
        "Review the script, then extract voiceover and build subject design.",
      needs_human_review: true,
      review_questions: [
        "Is the hook strong enough?",
        "Does the twist feel emotional instead of confusing?",
        "Can each scene be visualized clearly with AI video?",
      ],
    },
  };
}
