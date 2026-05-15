import { z } from "zod";

export const SubjectTypeSchema = z.enum([
  "robot",
  "human",
  "environment_subject",
  "creature",
  "object",
]);

export const MainSubjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: SubjectTypeSchema,
  role_in_story: z.string().min(1),
  description: z.string().min(1),
  silhouette: z.string().min(1),
  materials: z.array(z.string().min(1)).min(1),
  colors: z.array(z.string().min(1)).min(1),
  lighting_interaction: z.string().min(1),
  age_or_condition: z.string().min(1),
  emotion_to_convey: z.string().min(1),
  face_policy: z.string().min(1),
  consistency_rules: z.array(z.string().min(1)).min(1),
  avoid: z.array(z.string().min(1)).min(1),
});

export const EnvironmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role_in_story: z.string().min(1),
  description: z.string().min(1),
  architecture_style: z.string().min(1),
  materials: z.array(z.string().min(1)).min(1),
  color_palette: z.array(z.string().min(1)).min(1),
  lighting: z.string().min(1),
  mood: z.string().min(1),
  continuity_rules: z.array(z.string().min(1)).min(1),
  avoid: z.array(z.string().min(1)).min(1),
});

export const PropSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role_in_story: z.string().min(1),
  description: z.string().min(1),
  visual_rules: z.array(z.string().min(1)).min(1),
  avoid: z.array(z.string().min(1)).min(1),
});

export const SceneDesignMapSchema = z.object({
  scene_number: z.number().int().positive(),
  scene_role: z.string().min(1),
  required_subjects: z.array(z.string().min(1)).min(1),
  required_environments: z.array(z.string().min(1)).min(1),
  required_props: z.array(z.string().min(1)),
  design_focus: z.string().min(1),
  continuity_notes: z.string().min(1),
});

export const GlobalStyleGuideSchema = z.object({
  camera_language: z.string().min(1),
  lighting_language: z.string().min(1),
  texture_language: z.string().min(1),
  mood_keywords: z.array(z.string().min(1)).min(1),
  negative_style_rules: z.array(z.string().min(1)).min(1),
});

export const ImageGenerationReadinessSchema = z.object({
  recommended_first_design_image: z.string().min(1),
  why: z.string().min(1),
  reference_image_prompt_seed: z.string().min(1),
});

export const HumanReviewSchema = z.object({
  needs_review: z.boolean(),
  review_questions: z.array(z.string().min(1)).min(1),
});

export const SubjectDesignSchema = z
  .object({
    generation_timestamp: z.string().datetime(),
    project_id: z.string().min(1),
    channel: z.string().min(1),
    idea_id: z.string().min(1),
    source_idea_title: z.string().min(1),
    source_script_title: z.string().min(1),
    visual_style_summary: z.string().min(1),
    design_goal: z.string().min(1),
    main_subjects: z.array(MainSubjectSchema).min(1),
    environments: z.array(EnvironmentSchema).min(1),
    props: z.array(PropSchema),
    scene_design_map: z.array(SceneDesignMapSchema).length(5),
    global_style_guide: GlobalStyleGuideSchema,
    image_generation_readiness: ImageGenerationReadinessSchema,
    human_review: HumanReviewSchema,
  })
  .superRefine((design, ctx) => {
    const expectedSceneNumbers = [1, 2, 3, 4, 5];
    const actualSceneNumbers = design.scene_design_map.map((scene) => scene.scene_number);

    if (
      actualSceneNumbers.length !== expectedSceneNumbers.length ||
      actualSceneNumbers.some((sceneNumber, index) => sceneNumber !== expectedSceneNumbers[index])
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["scene_design_map"],
        message: "scene_design_map must contain scene numbers 1 through 5 in order.",
      });
    }
  });

export const SaveSubjectDesignPromptInputSchema = z.object({
  subject_design_prompt: z.string().min(1),
});

export const UploadSubjectDesignInputSchema = z.object({
  subject_design: SubjectDesignSchema,
  source: z.enum(["uploaded", "pasted"]),
});

export type MainSubject = z.infer<typeof MainSubjectSchema>;
export type Environment = z.infer<typeof EnvironmentSchema>;
export type Prop = z.infer<typeof PropSchema>;
export type SceneDesignMap = z.infer<typeof SceneDesignMapSchema>;
export type GlobalStyleGuide = z.infer<typeof GlobalStyleGuideSchema>;
export type ImageGenerationReadiness = z.infer<typeof ImageGenerationReadinessSchema>;
export type HumanReview = z.infer<typeof HumanReviewSchema>;
export type SubjectDesign = z.infer<typeof SubjectDesignSchema>;
export type SaveSubjectDesignPromptInput = z.infer<
  typeof SaveSubjectDesignPromptInputSchema
>;
export type UploadSubjectDesignInput = z.infer<typeof UploadSubjectDesignInputSchema>;
