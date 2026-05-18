import { type DesignImagePromptsJson } from "@/lib/schemas/design-image-prompts";
import { type Idea } from "@/lib/schemas/ideas";
import { type KeyframePromptsJson } from "@/lib/schemas/keyframe-prompts";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { type SceneBoardJson } from "@/lib/schemas/scene-board";
import { type SubjectDesign } from "@/lib/schemas/subject-design";
import { sanitizePromptContext } from "@/lib/utils/sanitizePromptContext";
import { videoPromptQualityEngine } from "@/lib/prompts/promptQualityEngine";

export function buildKlingPromptsPrompt(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  editedVoiceover: string | null,
  subjectDesign: SubjectDesign,
  designImagePrompts: DesignImagePromptsJson | null,
  sceneBoard: SceneBoardJson,
  keyframePrompts: KeyframePromptsJson,
) {
  const voiceover = sanitizePromptContext(
    editedVoiceover ??
      scriptGeneration.voiceover.clean_script ??
      scriptGeneration.full_voiceover,
  );
  const sanitizedSelectedIdea = sanitizePromptContext(selectedIdea);
  const sanitizedScriptGeneration = sanitizePromptContext(scriptGeneration);
  const sanitizedSubjectDesign = sanitizePromptContext(subjectDesign);
  const sanitizedSceneBoard = sanitizePromptContext(sceneBoard);
  const sanitizedKeyframePrompts = sanitizePromptContext(keyframePrompts);
  const referenceImagePromptsContext = designImagePrompts
    ? JSON.stringify(sanitizePromptContext(designImagePrompts), null, 2)
    : `No reference image prompts have been created yet.
Use subject_design, scene_board, and keyframe_prompts as the primary visual references.
Warning: Visual consistency may be stronger if Reference Image Prompts are created first.`;

  const schemaExample = {
    generation_timestamp: "ISO 8601 timestamp",
    project_id: project.id,
    channel: project.channel_name,
    idea_id: selectedIdea.id,
    source_script_title: scriptGeneration.title,
    prompt_set_goal: "Create final copyable Kling prompts per scene.",
    kling_model_notes: "string",
    aspect_ratio: "9:16",
    prompts: [
      {
        scene_number: 1,
        scene_role: "Hook",
        duration_sec: 6,
        voiceover_line: "string",
        kling_prompt: "string",
        negative_prompt: "string",
        camera_movement: "string",
        subject_motion: "string",
        lighting_and_mood: "string",
        continuity_references: ["string"],
        keyframe_references: ["scene_1_opening"],
        generation_risks: ["string"],
        manual_review_checklist: ["string"],
      },
    ],
    global_negative_prompt: "string",
    recommended_test_scene: 3,
    why_test_this_scene_first: "string",
    human_review: {
      needs_review: true,
      review_questions: ["string"],
    },
  };

  return `You are an AI Kling prompt strategist for Viral Forge.

Create final copyable Kling video prompts per scene.

Do not call any API.
Do not generate video.
Do not assume automatic execution.
You are only producing structured prompt JSON for human review and manual copying.

PROJECT CONTEXT
Channel: ${project.channel_name}
Project name: ${project.project_name}
Platform: ${project.platform}
Video format: ${project.video_format}
Primary AI video tool: ${project.primary_ai_video_tool || "Kling"}
Aspect ratio: 9:16
Scene count: ${project.scene_count}
Visual style: ${project.visual_style}

SELECTED IDEA JSON
${JSON.stringify(sanitizedSelectedIdea, null, 2)}

SCRIPT GENERATION JSON
${JSON.stringify(sanitizedScriptGeneration, null, 2)}

EDITED VOICEOVER
${voiceover}

SUBJECT DESIGN JSON
${JSON.stringify(sanitizedSubjectDesign, null, 2)}

REFERENCE IMAGE PROMPTS JSON
${referenceImagePromptsContext}

SCENE BOARD JSON
${JSON.stringify(sanitizedSceneBoard, null, 2)}

KEYFRAME PROMPTS JSON
${JSON.stringify(sanitizedKeyframePrompts, null, 2)}

TASK

Create one Kling prompt package per scene with:
- kling_prompt
- negative_prompt
- camera movement
- subject motion
- lighting and mood
- continuity references
- keyframe references
- generation risks
- manual review checklist

${videoPromptQualityEngine}

KLING FINAL PROMPT OPTIMIZATION

- Each kling_prompt must be a final copy-ready video prompt, not a planning note.
- Structure each prompt as: subject identity, scene setting, opening state, primary action, camera movement, lighting/mood, ending state, continuity anchors, aspect ratio.
- Keep the scene controllable for generation: one primary action, one camera movement, one location, no hard scene cuts.
- Use keyframe references as the visual start/end guide and Reference Image Prompts as identity/style anchors when available.
- If voiceover exists, align the visual beat to the narration without asking for lip-sync.
- Negative prompts must be specific and include quality, continuity, anatomy, camera, text, logo, brand, and motion-stability blockers.

OUTPUT RULES

- Return valid JSON only.
- prompts length must equal ${project.scene_count}.
- scene numbers must be 1 through ${project.scene_count} in order.
- aspect_ratio must be "9:16".
- idea_id must match ${selectedIdea.id}.
- source_script_title must match ${scriptGeneration.title}.
- every scene must have kling_prompt and negative_prompt.
- Use reference image prompts when available, but remain valid if they are missing.
- every kling_prompt must be self-contained and directly usable in Kling or a similar image-to-video generator.

JSON SCHEMA
${JSON.stringify(schemaExample, null, 2)}
`;
}
