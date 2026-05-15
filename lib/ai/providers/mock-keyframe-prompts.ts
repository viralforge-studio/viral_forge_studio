import { type DesignImagePromptsJson } from "@/lib/schemas/design-image-prompts";
import { type Idea } from "@/lib/schemas/ideas";
import { type KeyframePromptsJson } from "@/lib/schemas/keyframe-prompts";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { type SceneBoardJson } from "@/lib/schemas/scene-board";
import { type SubjectDesign } from "@/lib/schemas/subject-design";

export async function generateKeyframePromptsWithMock(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  subjectDesign: SubjectDesign,
  designImagePrompts: DesignImagePromptsJson | null,
  sceneBoard: SceneBoardJson,
  prompt: string,
): Promise<KeyframePromptsJson> {
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
      "Create still-image opening and ending keyframe prompts for each scene before final video prompting.",
    keyframes: sceneBoard.scenes.map((scene) => ({
      scene_number: scene.scene_number,
      scene_role: scene.scene_role,
      duration_sec: scene.duration_sec,
      opening_keyframe_prompt:
        `Vertical 9:16 cinematic still for scene ${scene.scene_number}, ${scene.camera_framing.toLowerCase()} ${scene.lighting_plan.toLowerCase()} Visual goal: ${scene.visual_goal}`,
      ending_keyframe_prompt:
        `Ending frame for scene ${scene.scene_number}, preserve continuity with subjects ${scene.required_subjects.join(", ")} and environments ${scene.required_environments.join(", ")} while landing on: ${scene.composition_notes}`,
      negative_prompt:
        "No logos, no readable text, no neon cyberpunk, no celebrity likeness, no extra fingers, no malformed robot anatomy, no cheap CGI finish.",
      linked_subjects: scene.required_subjects,
      linked_environments: scene.required_environments,
      linked_props: scene.required_props,
      composition_notes: scene.composition_notes,
      continuity_notes: scene.continuity_rules,
      human_review_questions: [
        "Does the opening frame establish the right composition immediately?",
        "Does the ending frame transition cleanly into the next scene?",
        "Are the subject and environment references specific enough for consistent generation?",
      ],
    })),
    global_negative_prompt:
      "No logos, no readable text, no neon cyberpunk, no celebrity likeness, no malformed hands, no low-detail toy-like surfaces.",
    recommended_generation_order: ["scene_3_opening", "scene_1_opening", "scene_5_opening"],
    human_review: {
      needs_review: true,
      review_questions: [
        "Which opening keyframe should become the strongest continuity anchor?",
        "Do any prompts feel too generic or too visually overloaded?",
        "Will the ending keyframes support smooth video prompt transitions later?",
      ],
    },
  };
}
