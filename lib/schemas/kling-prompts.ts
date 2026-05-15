import { z } from "zod";

export const KlingPromptSceneSchema = z.object({
  scene_number: z.number().int().positive(),
  scene_role: z.string().min(1),
  duration_sec: z.number().positive(),
  voiceover_line: z.string().min(1),
  kling_prompt: z.string().min(1),
  negative_prompt: z.string().min(1),
  camera_movement: z.string().min(1),
  subject_motion: z.string().min(1),
  lighting_and_mood: z.string().min(1),
  continuity_references: z.array(z.string().min(1)).min(1),
  keyframe_references: z.array(z.string().min(1)).min(1),
  generation_risks: z.array(z.string().min(1)).min(1),
  manual_review_checklist: z.array(z.string().min(1)).min(1),
});

export const KlingPromptsHumanReviewSchema = z.object({
  needs_review: z.boolean(),
  review_questions: z.array(z.string().min(1)).min(1),
});

export const KlingPromptsSchema = z.object({
  generation_timestamp: z.string().datetime(),
  project_id: z.string().min(1),
  channel: z.string().min(1),
  idea_id: z.string().min(1),
  source_script_title: z.string().min(1),
  prompt_set_goal: z.string().min(1),
  kling_model_notes: z.string().min(1),
  aspect_ratio: z.literal("9:16"),
  prompts: z.array(KlingPromptSceneSchema).min(1),
  global_negative_prompt: z.string().min(1),
  recommended_test_scene: z.number().int().positive(),
  why_test_this_scene_first: z.string().min(1),
  human_review: KlingPromptsHumanReviewSchema,
});

export const SaveKlingPromptsPromptInputSchema = z.object({
  kling_prompts_prompt: z.string().min(1),
});

export const UploadKlingPromptsInputSchema = z.object({
  kling_prompts: KlingPromptsSchema,
  source: z.enum(["uploaded", "pasted"]),
});

export type KlingPromptScene = z.infer<typeof KlingPromptSceneSchema>;
export type KlingPromptsHumanReview = z.infer<typeof KlingPromptsHumanReviewSchema>;
export type KlingPromptsJson = z.infer<typeof KlingPromptsSchema>;
export type SaveKlingPromptsPromptInput = z.infer<typeof SaveKlingPromptsPromptInputSchema>;
export type UploadKlingPromptsInput = z.infer<typeof UploadKlingPromptsInputSchema>;
