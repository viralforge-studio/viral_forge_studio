import { z } from "zod";

const bannedTerms = [
  "disney",
  "pixar",
  "marvel",
  "dc comics",
  "star wars",
  "tesla",
  "apple",
  "nike",
  "coca-cola",
  "google",
  "openai",
  "r2-d2",
  "c-3po",
  "baymax",
  "chappie",
  "wall-e",
  "iron man",
  "spider-man",
  "batman",
  "darth vader",
  "black mirror",
  "elon musk",
  "taylor swift",
  "tom cruise",
  "zendaya",
];

function visitStrings(value: unknown, visit: (text: string) => void) {
  if (typeof value === "string") {
    visit(value);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => visitStrings(item, visit));
    return;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => visitStrings(item, visit));
  }
}

function containsReadableTextRequirement(text: string) {
  return /(include|show|display|featuring|with)\s+(?:clear|legible|readable)\s+text/i.test(
    text,
  );
}

export const DesignImagePromptTypeSchema = z.enum([
  "subject_full_body_reference",
  "subject_closeup_reference",
  "environment_reference",
  "prop_reference",
  "style_reference",
]);

export const DesignImagePromptSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: DesignImagePromptTypeSchema,
  linked_ids: z.array(z.string().min(1)),
  purpose: z.string().min(1),
  prompt: z.string().min(1),
  negative_prompt: z.string().min(1),
  recommended_model_use: z.string().min(1),
  composition_notes: z.string().min(1),
  consistency_notes: z.array(z.string().min(1)).min(1),
  human_review_questions: z.array(z.string().min(1)).min(1),
});

export const DesignImagePromptsHumanReviewSchema = z.object({
  needs_review: z.boolean(),
  review_questions: z.array(z.string().min(1)).min(1),
});

export const DesignImagePromptsSchema = z
  .object({
    generation_timestamp: z.string().datetime(),
    project_id: z.string().min(1),
    channel: z.string().min(1),
    idea_id: z.string().min(1),
    source_idea_title: z.string().min(1),
    source_script_title: z.string().min(1),
    source_subject_design_summary: z.string().min(1),
    prompt_set_goal: z.string().min(1),
    image_prompts: z.array(DesignImagePromptSchema).min(3),
    global_negative_prompt: z.string().min(1),
    recommended_generation_order: z.array(z.string().min(1)).min(1),
    human_review: DesignImagePromptsHumanReviewSchema,
  })
  .superRefine((value, ctx) => {
    const promptIds = new Set(value.image_prompts.map((prompt) => prompt.id));

    value.recommended_generation_order.forEach((promptId, index) => {
      if (!promptIds.has(promptId)) {
        ctx.addIssue({
          code: "custom",
          path: ["recommended_generation_order", index],
          message: "recommended_generation_order must reference an existing image prompt id.",
        });
      }
    });

    value.image_prompts.forEach((prompt, index) => {
      if (containsReadableTextRequirement(prompt.prompt)) {
        ctx.addIssue({
          code: "custom",
          path: ["image_prompts", index, "prompt"],
          message: "Prompt must not require readable or legible text inside the image.",
        });
      }
    });

    const humanFacingFields: unknown[] = [
      value.prompt_set_goal,
      value.global_negative_prompt,
      ...value.image_prompts.flatMap((prompt) => [
        prompt.title,
        prompt.purpose,
        prompt.prompt,
        prompt.negative_prompt,
        prompt.recommended_model_use,
        prompt.composition_notes,
        prompt.consistency_notes,
        prompt.human_review_questions,
      ]),
    ];

    visitStrings(humanFacingFields, (text) => {
      const normalized = text.toLowerCase();
      const blocked = bannedTerms.find((term) => normalized.includes(term));

      if (blocked) {
        ctx.addIssue({
          code: "custom",
          path: [],
          message:
            "Reference Image Prompts cannot include copyrighted or brand names. Remove or generalize terms such as C-3PO, R2-D2, Baymax, Chappie, real brands, celebrities, or franchise names.",
        });
      }
    });
  });

export const SaveDesignImagePromptGenerationPromptInputSchema = z.object({
  design_image_prompt_generation_prompt: z.string().min(1),
});

export const UploadDesignImagePromptsInputSchema = z.object({
  design_image_prompts: DesignImagePromptsSchema,
  source: z.enum(["uploaded", "pasted"]),
});

export type DesignImagePromptType = z.infer<typeof DesignImagePromptTypeSchema>;
export type DesignImagePrompt = z.infer<typeof DesignImagePromptSchema>;
export type DesignImagePromptsHumanReview = z.infer<
  typeof DesignImagePromptsHumanReviewSchema
>;
export type DesignImagePromptsJson = z.infer<typeof DesignImagePromptsSchema>;
export type SaveDesignImagePromptGenerationPromptInput = z.infer<
  typeof SaveDesignImagePromptGenerationPromptInputSchema
>;
export type UploadDesignImagePromptsInput = z.infer<
  typeof UploadDesignImagePromptsInputSchema
>;
