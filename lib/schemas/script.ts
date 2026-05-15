import { z } from "zod";

export const ScriptSceneRoleSchema = z.enum([
  "Hook",
  "Setup",
  "Build",
  "Tension",
  "Twist / Emotional Reveal",
]);

export const ScriptVoiceoverSchema = z.object({
  clean_script: z.string().min(1),
  estimated_word_count: z.number().int().positive(),
  delivery_style: z.string().min(1),
  pace: z.string().min(1),
  pause_notes: z.array(z.string().min(1)).min(1),
});

export const ScriptSceneSchema = z.object({
  scene_number: z.number().int().positive(),
  duration_sec: z.number().positive(),
  scene_role: ScriptSceneRoleSchema,
  slug: z.string().min(1),
  narration: z.string().min(1),
  visual_summary: z.string().min(1),
  emotional_purpose: z.string().min(1),
  visual_goal: z.string().min(1),
  editor_text_overlay_suggestion: z.string().min(1),
  sound_design_notes: z.string().min(1),
  transition_notes: z.string().min(1),
  continuity_notes: z.string().min(1),
  kling_risk_notes: z.string().min(1),
  source_idea_scene_reference: z.string().min(1),
});

export const ScriptProductionNotesSchema = z.object({
  face_policy: z.string().min(1),
  editing_style: z.string().min(1),
  recommended_test_scene: z.number().int().positive(),
  why_test_this_scene_first: z.string().min(1),
  main_generation_risks: z.array(z.string().min(1)).min(1),
});

export const ScriptNextStepSchema = z.object({
  recommended_action: z.string().min(1),
  needs_human_review: z.boolean(),
  review_questions: z.array(z.string().min(1)).min(1),
});

export const ScriptGenerationSchema = z
  .object({
    generation_timestamp: z.string().datetime(),
    project_id: z.string().min(1),
    channel: z.string().min(1),
    idea_id: z.string().min(1),
    source_idea_title: z.string().min(1),
    title: z.string().min(1),
    opening_hook: z.string().min(1),
    story_summary: z.string().min(1),
    script_voice: z.string().min(1),
    full_voiceover: z.string().min(1),
    voiceover: ScriptVoiceoverSchema,
    scenes: z.array(ScriptSceneSchema).length(5),
    closing_payoff: z.string().min(1),
    target_comment_hook: z.string().min(1),
    platform_caption: z.string().min(1),
    hashtags: z.array(z.string().min(1)).min(1),
    estimated_duration_seconds: z.number().positive(),
    total_duration_sec: z.number().positive(),
    production_notes: ScriptProductionNotesSchema,
    next_step: ScriptNextStepSchema,
  })
  .superRefine((script, ctx) => {
    const durationTotal = script.scenes.reduce(
      (sum, scene) => sum + scene.duration_sec,
      0,
    );

    const expectedSceneNumbers = [1, 2, 3, 4, 5];
    const actualSceneNumbers = script.scenes.map((scene) => scene.scene_number);

    if (
      actualSceneNumbers.length !== expectedSceneNumbers.length ||
      actualSceneNumbers.some((sceneNumber, index) => sceneNumber !== expectedSceneNumbers[index])
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["scenes"],
        message: "Scenes must have scene_number values 1, 2, 3, 4, 5 in order.",
      });
    }

    if (script.total_duration_sec !== durationTotal) {
      ctx.addIssue({
        code: "custom",
        path: ["total_duration_sec"],
        message: "total_duration_sec must equal the sum of scene durations.",
      });
    }

    if (script.estimated_duration_seconds !== script.total_duration_sec) {
      ctx.addIssue({
        code: "custom",
        path: ["estimated_duration_seconds"],
        message: "estimated_duration_seconds must equal total_duration_sec.",
      });
    }

    if (script.total_duration_sec < 35 || script.total_duration_sec > 45) {
      ctx.addIssue({
        code: "custom",
        path: ["total_duration_sec"],
        message: "total_duration_sec must be between 35 and 45.",
      });
    }
  });

export const SaveScriptPromptInputSchema = z.object({
  script_prompt: z.string().min(1),
});

export const UploadScriptJsonInputSchema = z.object({
  script_generation: ScriptGenerationSchema,
});

export type ScriptSceneRole = z.infer<typeof ScriptSceneRoleSchema>;
export type ScriptVoiceover = z.infer<typeof ScriptVoiceoverSchema>;
export type ScriptScene = z.infer<typeof ScriptSceneSchema>;
export type ScriptProductionNotes = z.infer<typeof ScriptProductionNotesSchema>;
export type ScriptNextStep = z.infer<typeof ScriptNextStepSchema>;
export type ScriptGeneration = z.infer<typeof ScriptGenerationSchema>;
export type SaveScriptPromptInput = z.infer<typeof SaveScriptPromptInputSchema>;
export type UploadScriptJsonInput = z.infer<typeof UploadScriptJsonInputSchema>;
