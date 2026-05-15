import { z } from "zod";

export const SceneBoardSceneSchema = z.object({
  scene_number: z.number().int().positive(),
  scene_role: z.string().min(1),
  duration_sec: z.number().positive(),
  voiceover_line: z.string().min(1),
  visual_goal: z.string().min(1),
  required_subjects: z.array(z.string().min(1)),
  required_environments: z.array(z.string().min(1)),
  required_props: z.array(z.string().min(1)),
  design_references: z.array(z.string().min(1)),
  camera_framing: z.string().min(1),
  lighting_plan: z.string().min(1),
  composition_notes: z.string().min(1),
  continuity_rules: z.array(z.string().min(1)).min(1),
  risk_notes: z.array(z.string().min(1)).min(1),
  human_review_checklist: z.array(z.string().min(1)).min(1),
});

export const SceneBoardHumanReviewSchema = z.object({
  needs_review: z.boolean(),
  review_questions: z.array(z.string().min(1)).min(1),
});

export const SceneBoardSchema = z.object({
  generation_timestamp: z.string().datetime(),
  project_id: z.string().min(1),
  channel: z.string().min(1),
  idea_id: z.string().min(1),
  source_script_title: z.string().min(1),
  source_subject_design_summary: z.string().min(1),
  board_goal: z.string().min(1),
  scenes: z.array(SceneBoardSceneSchema).min(1),
  global_continuity_rules: z.array(z.string().min(1)).min(1),
  recommended_test_scene: z.number().int().positive(),
  why_test_this_scene_first: z.string().min(1),
  human_review: SceneBoardHumanReviewSchema,
});

export const SaveSceneBoardPromptInputSchema = z.object({
  scene_board_prompt: z.string().min(1),
});

export const UploadSceneBoardInputSchema = z.object({
  scene_board: SceneBoardSchema,
  source: z.enum(["uploaded", "pasted"]),
});

export type SceneBoardScene = z.infer<typeof SceneBoardSceneSchema>;
export type SceneBoardHumanReview = z.infer<typeof SceneBoardHumanReviewSchema>;
export type SceneBoardJson = z.infer<typeof SceneBoardSchema>;
export type SaveSceneBoardPromptInput = z.infer<typeof SaveSceneBoardPromptInputSchema>;
export type UploadSceneBoardInput = z.infer<typeof UploadSceneBoardInputSchema>;
