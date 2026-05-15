import { type DesignImagePromptsJson } from "@/lib/schemas/design-image-prompts";
import { type Idea } from "@/lib/schemas/ideas";
import { type KeyframePromptsJson } from "@/lib/schemas/keyframe-prompts";
import { type KlingPromptsJson } from "@/lib/schemas/kling-prompts";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { type SceneBoardJson } from "@/lib/schemas/scene-board";
import { type SubjectDesign } from "@/lib/schemas/subject-design";

export async function generateKlingPromptsWithMock(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  subjectDesign: SubjectDesign,
  designImagePrompts: DesignImagePromptsJson | null,
  sceneBoard: SceneBoardJson,
  keyframePrompts: KeyframePromptsJson,
  prompt: string,
): Promise<KlingPromptsJson> {
  void selectedIdea;
  void subjectDesign;
  void designImagePrompts;
  void prompt;

  return {
    generation_timestamp: new Date().toISOString(),
    project_id: project.id,
    channel: project.channel_name,
    idea_id: scriptGeneration.idea_id,
    source_script_title: scriptGeneration.title,
    prompt_set_goal:
      "Create final copyable Kling video prompts for each scene using the approved story, design, scene board, and keyframe plans.",
    kling_model_notes:
      "Prioritize continuity, simple readable motion, and premium lighting over overly complex choreography.",
    aspect_ratio: "9:16",
    prompts: sceneBoard.scenes.map((scene) => ({
      scene_number: scene.scene_number,
      scene_role: scene.scene_role,
      duration_sec: scene.duration_sec,
      voiceover_line: scene.voiceover_line,
      kling_prompt:
        `Scene ${scene.scene_number}, ${scene.scene_role}. ${scene.visual_goal} ${scene.camera_framing} ${scene.lighting_plan} Keep continuity with ${scene.required_subjects.join(", ")} and ${scene.required_environments.join(", ")}. Motion should stay subtle, cinematic, and easy to render in a realistic premium sci-fi style.`,
      negative_prompt:
        "No logos, no readable text, no celebrity likeness, no neon cyberpunk, no extra fingers, no broken anatomy, no chaotic fast motion, no lip sync dependence.",
      camera_movement:
        scene.scene_number === 1
          ? "Slow push-in."
          : scene.scene_number === 5
            ? "Restrained hold or slight drift toward the doorway reveal."
            : "Slow cinematic move with minimal shake and no aggressive speed changes.",
      subject_motion:
        scene.scene_number === 5
          ? "Robot subtly extends one hand while keeping body motion controlled and readable."
          : "Keep motion minimal and emotionally restrained, with posture doing most of the work.",
      lighting_and_mood: scene.lighting_plan,
      continuity_references: scene.continuity_rules,
      keyframe_references: [
        `scene_${scene.scene_number}_opening`,
        `scene_${scene.scene_number}_ending`,
      ],
      generation_risks: [
        scene.risk_notes[0] ?? "Continuity drift.",
        "Avoid malformed hands or unstable prop geometry.",
        "Keep motion subtle enough to preserve realism.",
      ],
      manual_review_checklist: [
        "Does the motion stay simple enough for stable generation?",
        "Does the shot preserve the approved subject and environment design?",
        "Is the emotional tone aligned with the script voiceover line?",
      ],
    })),
    global_negative_prompt:
      "No logos, no readable text, no neon cyberpunk, no celebrity likeness, no malformed anatomy, no chaotic motion, no toy-like materials.",
    recommended_test_scene: 3,
    why_test_this_scene_first:
      "Scene 3 balances emotional subtlety, close framing, metallic realism, and low-motion complexity, making it the best signal for overall prompt quality.",
    human_review: {
      needs_review: true,
      review_questions: [
        "Which scene is most likely to break continuity and needs a simpler prompt?",
        "Are the camera movements subtle enough for stable results?",
        "Does the recommended test scene still feel like the best first validation target?",
      ],
    },
  };
}
