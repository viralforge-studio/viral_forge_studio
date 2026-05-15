import { z } from "zod";

export const KeyframePromptSceneSchema = z.object({
  scene_number: z.number().int().positive(),
  scene_role: z.string().min(1),
  duration_sec: z.number().positive(),
  opening_keyframe_prompt: z.string().min(1),
  ending_keyframe_prompt: z.string().min(1).optional(),
  negative_prompt: z.string().min(1),
  linked_subjects: z.array(z.string().min(1)),
  linked_environments: z.array(z.string().min(1)),
  linked_props: z.array(z.string().min(1)),
  composition_notes: z.string().min(1),
  continuity_notes: z.array(z.string().min(1)).min(1),
  human_review_questions: z.array(z.string().min(1)).min(1),
});

export const KeyframePromptsHumanReviewSchema = z.object({
  needs_review: z.boolean(),
  review_questions: z.array(z.string().min(1)).min(1),
});

export const KeyframePromptsSchema = z.object({
  generation_timestamp: z.string().datetime(),
  project_id: z.string().min(1),
  channel: z.string().min(1),
  idea_id: z.string().min(1),
  source_script_title: z.string().min(1),
  prompt_set_goal: z.string().min(1),
  keyframes: z.array(KeyframePromptSceneSchema).min(1),
  global_negative_prompt: z.string().min(1),
  recommended_generation_order: z.array(z.string().min(1)).min(1),
  human_review: KeyframePromptsHumanReviewSchema,
});

export const SaveKeyframePromptsPromptInputSchema = z.object({
  keyframe_prompts_prompt: z.string().min(1),
});

export const UploadKeyframePromptsInputSchema = z.object({
  keyframe_prompts: KeyframePromptsSchema,
  source: z.enum(["uploaded", "pasted"]),
});

export type KeyframePromptScene = z.infer<typeof KeyframePromptSceneSchema>;
export type KeyframePromptsHumanReview = z.infer<typeof KeyframePromptsHumanReviewSchema>;
export type KeyframePromptsJson = z.infer<typeof KeyframePromptsSchema>;
export type SaveKeyframePromptsPromptInput = z.infer<
  typeof SaveKeyframePromptsPromptInputSchema
>;
export type UploadKeyframePromptsInput = z.infer<typeof UploadKeyframePromptsInputSchema>;
