import { z } from "zod";

export const TestSceneReviewDecisionSchema = z.enum([
  "approved_for_full_production",
  "revise_kling_prompt",
  "revise_keyframes",
  "revise_scene_board",
  "revise_subject_design",
]);

export const TestSceneReviewSchema = z.object({
  scene_number: z.number().int().positive(),
  score: z.number().int().min(1).max(10),
  decision: TestSceneReviewDecisionSchema,
  video_reference: z.string().default(""),
  strengths: z.array(z.string().min(1)).default([]),
  issues: z.array(z.string().min(1)).default([]),
  notes: z.string().default(""),
  reviewed_at: z.string().datetime(),
});

export const SaveTestSceneReviewInputSchema = z.object({
  scene_number: z.number().int().positive(),
  score: z.number().int().min(1).max(10),
  decision: TestSceneReviewDecisionSchema,
  video_reference: z.string().default(""),
  strengths: z.array(z.string().min(1)).default([]),
  issues: z.array(z.string().min(1)).default([]),
  notes: z.string().default(""),
});

export const FinalizeExportInputSchema = z.object({
  export_notes: z.string().default(""),
});

export type TestSceneReview = z.infer<typeof TestSceneReviewSchema>;
export type TestSceneReviewDecision = z.infer<typeof TestSceneReviewDecisionSchema>;
export type SaveTestSceneReviewInput = z.infer<typeof SaveTestSceneReviewInputSchema>;
export type FinalizeExportInput = z.infer<typeof FinalizeExportInputSchema>;
