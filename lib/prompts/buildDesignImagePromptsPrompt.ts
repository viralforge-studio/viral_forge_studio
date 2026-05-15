import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { type SubjectDesign } from "@/lib/schemas/subject-design";
import { sanitizePromptContext } from "@/lib/utils/sanitizePromptContext";

export function buildDesignImagePromptsPrompt(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  editedVoiceover: string | null,
  subjectDesign: SubjectDesign,
) {
  const voiceover = sanitizePromptContext(
    editedVoiceover ??
      scriptGeneration.voiceover.clean_script ??
      scriptGeneration.full_voiceover,
  );
  const sanitizedSelectedIdea = sanitizePromptContext(selectedIdea);
  const sanitizedScriptGeneration = sanitizePromptContext(scriptGeneration);
  const sanitizedSubjectDesign = sanitizePromptContext(subjectDesign);

  const schemaExample = {
    generation_timestamp: "ISO 8601 timestamp",
    project_id: project.id,
    channel: project.channel_name,
    idea_id: selectedIdea.id,
    source_idea_title: selectedIdea.title,
    source_script_title: scriptGeneration.title,
    source_subject_design_summary: "string",
    prompt_set_goal: "string",
    image_prompts: [
      {
        id: "img_ref_robot_full_body_01",
        title: "Robot Full Body Reference",
        type: "subject_full_body_reference",
        linked_ids: ["subject_robot_01"],
        purpose: "Generate the main robot visual reference.",
        prompt: "Full still image prompt.",
        negative_prompt: "Things to avoid.",
        recommended_model_use:
          "Use in image generator as a design reference before video generation.",
        composition_notes: "Vertical 9:16, centered subject, full body.",
        consistency_notes: [
          "Keep horizontal blue sensor band.",
          "Keep matte white ceramic panels.",
          "Keep three-fingered hands.",
        ],
        human_review_questions: [
          "Does the robot feel original?",
          "Is the silhouette clear?",
          "Can this design stay consistent?",
        ],
      },
    ],
    global_negative_prompt:
      "No logos, no readable text, no copyrighted robot design, no celebrity likeness, no cartoon style.",
    recommended_generation_order: [
      "img_ref_robot_full_body_01",
      "img_ref_robot_face_closeup_01",
      "img_ref_apartment_environment_01",
    ],
    human_review: {
      needs_review: true,
      review_questions: [
        "Which reference image should become the visual anchor?",
        "Are any images too generic or too similar to copyrighted designs?",
        "Can the robot/environment remain consistent across scenes?",
      ],
    },
  };

  return `You are an AI image prompt art director.

Create separate still-image prompts for generating reusable visual reference images.

Do not create Kling video prompts.
Do not include motion or duration.
Do not generate final video scenes.
Do not require readable text.
Do not use logos, brands, celebrities, or copyrighted designs.

Each image prompt must be independently copyable and usable in an image generator.

PROJECT CONTEXT

Channel:
${project.channel_name}

Project template:
${project.project_template}

Project name:
${project.project_name}

Niche:
${project.niche}

Positioning:
${project.positioning}

Audience:
${project.audience}

Target countries:
${JSON.stringify(project.target_countries, null, 2)}

Language:
${project.language}

Tone:
${project.tone}

Visual style:
${project.visual_style}

Reference style notes:
${project.reference_style_notes || "None provided"}

Face policy:
${project.face_policy || "None provided"}

Platform:
${project.platform}

Video format:
${project.video_format}

Primary AI video tool:
${project.primary_ai_video_tool || "Not specified"}

Image generation tool:
${project.image_generation_tool || "Not specified"}

Budget range:
${project.budget_range || "Not specified"}

SELECTED IDEA JSON

${JSON.stringify(sanitizedSelectedIdea, null, 2)}

SCRIPT GENERATION JSON

${JSON.stringify(sanitizedScriptGeneration, null, 2)}

EDITED VOICEOVER

${voiceover}

SUBJECT DESIGN JSON

${JSON.stringify(sanitizedSubjectDesign, null, 2)}

TASK

Create reusable still-image reference prompts for:
- main subject full-body reference
- main subject close-up reference
- main environment reference
- key prop reference
- overall style reference

For this project, include at minimum:
- Robot full-body reference
- Robot face close-up reference
- Abandoned apartment reference
- Apartment door / hallway light reference
- Global cinematic style reference

PROMPT RULES

- These are still image prompts only.
- No video duration.
- No camera movement instructions.
- No motion verbs unless they describe a frozen cinematic composition.
- No readable text requirements.
- No logos, brands, celebrities, or copyrighted character references.
- Prompts should be useful for manual image generation before keyframes or Kling prompts.
- Every prompt must include title, type, purpose, prompt, negative_prompt, recommended_model_use, composition_notes, consistency_notes, and human_review_questions.
- linked_ids should reference ids from subject_design whenever possible.

OUTPUT FORMAT

Return VALID JSON ONLY.
No markdown.
No explanation.
No preamble.
No trailing commas.
Do not wrap JSON in code fences.

EXACT OUTPUT SCHEMA

${JSON.stringify(schemaExample, null, 2)}

FINAL QUALITY CHECK BEFORE RESPONDING

Before returning JSON, silently verify:
- The output is valid JSON.
- idea_id matches the selected idea.
- source_script_title matches the current script title.
- image_prompts contains at least 3 items.
- Every image prompt has id, title, type, prompt, and negative_prompt.
- type is one of: subject_full_body_reference, subject_closeup_reference, environment_reference, prop_reference, style_reference.
- No brand names.
- No copyrighted character names.
- No celebrity likeness.
- No readable text requirement.
- Each image prompt is independently copyable and useful in an image generator.
- The output contains JSON only.`;
}
