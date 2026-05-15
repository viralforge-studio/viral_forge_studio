import { type DesignImagePromptsJson } from "@/lib/schemas/design-image-prompts";
import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { type SubjectDesign } from "@/lib/schemas/subject-design";
import { sanitizePromptContext } from "@/lib/utils/sanitizePromptContext";

export function buildSceneBoardPrompt(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  editedVoiceover: string | null,
  subjectDesign: SubjectDesign,
  designImagePrompts: DesignImagePromptsJson | null,
) {
  const voiceover = sanitizePromptContext(
    editedVoiceover ??
      scriptGeneration.voiceover.clean_script ??
      scriptGeneration.full_voiceover,
  );
  const sanitizedSelectedIdea = sanitizePromptContext(selectedIdea);
  const sanitizedScriptGeneration = sanitizePromptContext(scriptGeneration);
  const sanitizedSubjectDesign = sanitizePromptContext(subjectDesign);

  const referenceImagePromptsContext = designImagePrompts
    ? JSON.stringify(sanitizePromptContext(designImagePrompts), null, 2)
    : `No reference image prompts have been created yet.
Use subject_design as the primary visual reference.
Warning: visual consistency may be stronger if Reference Image Prompts are created first.`;

  const schemaExample = {
    generation_timestamp: "ISO 8601 timestamp",
    project_id: project.id,
    channel: project.channel_name,
    idea_id: selectedIdea.id,
    source_script_title: scriptGeneration.title,
    source_subject_design_summary: subjectDesign.visual_style_summary,
    board_goal: "Create a per-scene production board for planning future generation.",
    scenes: [
      {
        scene_number: 1,
        scene_role: "Hook",
        duration_sec: 6,
        voiceover_line: "string",
        visual_goal: "string",
        required_subjects: ["subject_robot_01"],
        required_environments: ["env_apartment_01"],
        required_props: ["prop_door_01"],
        design_references: ["img_ref_robot_full_body_01"],
        camera_framing: "string",
        lighting_plan: "string",
        composition_notes: "string",
        continuity_rules: ["string"],
        risk_notes: ["string"],
        human_review_checklist: ["string"],
      },
    ],
    global_continuity_rules: ["string"],
    recommended_test_scene: 3,
    why_test_this_scene_first: "string",
    human_review: {
      needs_review: true,
      review_questions: ["string"],
    },
  };

  return `You are an AI production board director for Viral Forge.

Create a per-scene production board from the approved story materials.

Do not create Kling prompts.
Do not create final keyframe prompts.
Do not generate images or video.
Do not require readable text in generated media.

PROJECT CONTEXT

Channel: ${project.channel_name}
Project name: ${project.project_name}
Platform: ${project.platform}
Video format: ${project.video_format}
Target duration: ${project.target_duration_seconds} seconds
Scene count: ${project.scene_count}
Tone: ${project.tone}
Visual style: ${project.visual_style}
Face policy: ${project.face_policy || "None provided"}

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

TASK

Create a production-ready Scene Board JSON that maps every scene into:
- voiceover line
- visual goal
- required subjects, environments, and props
- relevant design references
- framing and lighting guidance
- continuity rules
- risk notes
- human review checklist

OUTPUT RULES

- Return valid JSON only.
- scenes length must equal ${project.scene_count}.
- scene numbers must be 1 through ${project.scene_count} in order.
- idea_id must match ${selectedIdea.id}.
- source_script_title must match ${scriptGeneration.title}.
- Use reference image prompt references when helpful, but remain valid even if that set is limited.

JSON SCHEMA
${JSON.stringify(schemaExample, null, 2)}
`;
}
