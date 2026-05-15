import { type DesignImagePromptsJson } from "@/lib/schemas/design-image-prompts";
import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { type SceneBoardJson } from "@/lib/schemas/scene-board";
import { type SubjectDesign } from "@/lib/schemas/subject-design";
import { sanitizePromptContext } from "@/lib/utils/sanitizePromptContext";

export function buildKeyframePromptsPrompt(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  subjectDesign: SubjectDesign,
  designImagePrompts: DesignImagePromptsJson | null,
  sceneBoard: SceneBoardJson,
) {
  const sanitizedSelectedIdea = sanitizePromptContext(selectedIdea);
  const sanitizedScriptGeneration = sanitizePromptContext(scriptGeneration);
  const sanitizedSubjectDesign = sanitizePromptContext(subjectDesign);
  const sanitizedSceneBoard = sanitizePromptContext(sceneBoard);
  const referenceImagePromptsContext = designImagePrompts
    ? JSON.stringify(sanitizePromptContext(designImagePrompts), null, 2)
    : `No reference image prompts have been created yet.
Use subject_design and scene_board as the primary visual references.
Warning: visual consistency may be stronger if Reference Image Prompts are created first.`;

  const schemaExample = {
    generation_timestamp: "ISO 8601 timestamp",
    project_id: project.id,
    channel: project.channel_name,
    idea_id: selectedIdea.id,
    source_script_title: scriptGeneration.title,
    prompt_set_goal: "Create still-image keyframe prompts for each scene.",
    keyframes: [
      {
        scene_number: 1,
        scene_role: "Hook",
        duration_sec: 6,
        opening_keyframe_prompt: "string",
        ending_keyframe_prompt: "string",
        negative_prompt: "string",
        linked_subjects: ["subject_robot_01"],
        linked_environments: ["env_apartment_01"],
        linked_props: ["prop_door_01"],
        composition_notes: "string",
        continuity_notes: ["string"],
        human_review_questions: ["string"],
      },
    ],
    global_negative_prompt: "string",
    recommended_generation_order: ["scene_3_opening", "scene_1_opening"],
    human_review: {
      needs_review: true,
      review_questions: ["string"],
    },
  };

  return `You are an AI still-frame prompt director for Viral Forge.

Create still-image keyframe prompts for each scene.

Do not create Kling prompts.
Do not create video.
Do not create motion instructions beyond frozen composition language.

PROJECT CONTEXT
Channel: ${project.channel_name}
Project name: ${project.project_name}
Platform: ${project.platform}
Video format: ${project.video_format}
Scene count: ${project.scene_count}
Visual style: ${project.visual_style}

SELECTED IDEA JSON
${JSON.stringify(sanitizedSelectedIdea, null, 2)}

SCRIPT GENERATION JSON
${JSON.stringify(sanitizedScriptGeneration, null, 2)}

SUBJECT DESIGN JSON
${JSON.stringify(sanitizedSubjectDesign, null, 2)}

REFERENCE IMAGE PROMPTS JSON
${referenceImagePromptsContext}

SCENE BOARD JSON
${JSON.stringify(sanitizedSceneBoard, null, 2)}

TASK

Create one keyframe package per scene with:
- opening keyframe prompt
- optional ending keyframe prompt
- negative prompt
- linked subjects, environments, and props
- continuity notes
- human review questions

OUTPUT RULES

- Return valid JSON only.
- keyframes length must equal ${project.scene_count}.
- scene numbers must be 1 through ${project.scene_count} in order.
- idea_id must match ${selectedIdea.id}.
- source_script_title must match ${scriptGeneration.title}.
- every scene must have opening_keyframe_prompt and negative_prompt.
- Use reference image prompts when available, but remain valid if they are missing.

JSON SCHEMA
${JSON.stringify(schemaExample, null, 2)}
`;
}
