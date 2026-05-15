import { z } from "zod";

export const SceneBreakdownSchema = z.object({
  scene: z.number().int().positive(),
  duration_sec: z.number().positive(),
  description: z.string().min(1),
  kling_prompt_keywords: z.array(z.string().min(1)).min(1),
});

export const IdeaSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  pillar: z.string().min(1),
  hook: z.string().min(1),
  concept: z.string().min(1),
  emotional_triggers: z.array(z.string().min(1)).min(1),
  virality_mechanics: z.array(z.string().min(1)).min(1),
  voiceover_concept: z.string().min(1),
  scene_breakdown: z.array(SceneBreakdownSchema).min(1),
  expected_comments: z.array(z.string().min(1)).min(1),
  production_budget: z.string().min(1),
  kling_difficulty: z.enum(["low", "medium", "high"]),
  viral_score: z.number().min(0).max(10),
  success_likelihood: z.enum(["high", "medium", "low"]),
  why_it_goes_viral: z.string().min(1),
  target_comment_hook: z.string().min(1),
  best_time_to_post: z.string().min(1),
  secondary_platforms: z.array(z.string().min(1)).min(1),
});

export const IdeaGenerationSchema = z.object({
  generation_timestamp: z.string().datetime(),
  channel: z.string().min(1),
  brief: z.string().min(1),
  ideas: z.array(IdeaSchema).length(5),
  meta: z.object({
    total_ideas: z.number().int().positive(),
    average_viral_score: z.string().min(1),
    budget_total: z.string().min(1),
    most_viral_idea: z.string().min(1),
    production_recommendation: z.string().min(1),
  }),
});

export const UploadIdeaJsonInputSchema = z.object({
  idea_generation: IdeaGenerationSchema,
});

export const SelectIdeaInputSchema = z.object({
  idea_id: z.string().min(1),
});

export type SceneBreakdown = z.infer<typeof SceneBreakdownSchema>;
export type Idea = z.infer<typeof IdeaSchema>;
export type IdeaGeneration = z.infer<typeof IdeaGenerationSchema>;
export type UploadIdeaJsonInput = z.infer<typeof UploadIdeaJsonInputSchema>;
export type SelectIdeaInput = z.infer<typeof SelectIdeaInputSchema>;

export function validateIdeaGenerationBusinessRules(
  ideaGeneration: IdeaGeneration,
) {
  const errors: string[] = [];
  const ids = ideaGeneration.ideas.map((idea) => idea.id);
  const uniqueIds = new Set(ids);

  if (ideaGeneration.ideas.length !== 5) {
    errors.push("Idea generation must contain exactly 5 ideas.");
  }

  if (ideaGeneration.meta.total_ideas !== 5) {
    errors.push("meta.total_ideas must be 5.");
  }

  if (uniqueIds.size !== ids.length) {
    errors.push("Each idea must have a unique id.");
  }

  if (!uniqueIds.has(ideaGeneration.meta.most_viral_idea)) {
    errors.push("meta.most_viral_idea must reference an existing idea id.");
  }

  return errors;
}
