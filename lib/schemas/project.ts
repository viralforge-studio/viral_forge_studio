import { z } from "zod";

import { IdeaGenerationSchema } from "@/lib/schemas/ideas";
import { ScriptGenerationSchema } from "@/lib/schemas/script";
import { DesignImagePromptsSchema } from "@/lib/schemas/design-image-prompts";
import { KeyframePromptsSchema } from "@/lib/schemas/keyframe-prompts";
import { KlingPromptsSchema } from "@/lib/schemas/kling-prompts";
import { SceneBoardSchema } from "@/lib/schemas/scene-board";
import { SubjectDesignSchema } from "@/lib/schemas/subject-design";
import { TestSceneReviewSchema } from "@/lib/schemas/test-scene-review";

export const ProjectStatusSchema = z.enum([
  "brief_created",
  "ideas_generated",
  "idea_selected",
  "script_prompt_ready",
  "script_generated",
  "voiceover_reviewed",
  "subject_design_prompt_ready",
  "subject_design_ready",
  "design_image_prompts_ready",
  "scene_board_ready",
  "keyframe_prompts_ready",
  "kling_prompts_ready",
  "test_scene_review",
  "ready_for_export",
]);

export const NewProjectInputSchema = z.object({
  project_template: z.enum(["future_files", "blank_custom"]).default("future_files"),
  project_name: z.string().min(2),
  channel_name: z.string().min(1),
  niche: z.string().min(1),
  positioning: z.string().min(1),
  audience: z.string().min(1),
  tone: z.string().min(1),
  visual_style: z.string().min(1),
  content_pillars: z.array(z.string().min(1)).min(1),
  blocked_topics: z.array(z.string().min(1)).min(1),
  target_countries: z.array(z.string().min(1)).default([]),
  language: z.string().default("English"),
  video_format: z.string().default("Vertical 9:16 short-form video"),
  face_policy: z.string().default(""),
  cta_style: z.string().default(""),
  budget_range: z.string().default(""),
  primary_ai_video_tool: z.string().default(""),
  image_generation_tool: z.string().default(""),
  reference_style_notes: z.string().default(""),
  negative_visual_rules: z.array(z.string().min(1)).default([]),
  target_duration_seconds: z.number().int().positive(),
  scene_count: z.number().int().positive(),
  platform: z.string().min(1),
});

export const ProjectSchema = NewProjectInputSchema.extend({
  id: z.string().min(1),
  status: ProjectStatusSchema,
  idea_generation: IdeaGenerationSchema.nullable().default(null),
  selected_idea_id: z.string().nullable().default(null),
  script_prompt: z.string().nullable().default(null),
  script_prompt_updated_at: z.string().datetime().nullable().default(null),
  script_generation: ScriptGenerationSchema.nullable().default(null),
  script_generation_source: z
    .enum(["generated", "uploaded", "pasted"])
    .nullable()
    .default(null),
  edited_voiceover: z.string().nullable().default(null),
  voiceover_updated_at: z.string().datetime().nullable().default(null),
  voiceover_notes: z.string().nullable().default(null),
  subject_design_prompt: z.string().nullable().default(null),
  subject_design_prompt_updated_at: z.string().datetime().nullable().default(null),
  subject_design: SubjectDesignSchema.nullable().default(null),
  subject_design_source: z
    .enum(["generated", "uploaded", "pasted"])
    .nullable()
    .default(null),
  subject_design_review_notes: z.string().nullable().default(null),
  subject_design_reviewed_at: z.string().datetime().nullable().default(null),
  design_image_prompt_generation_prompt: z.string().nullable().default(null),
  design_image_prompt_generation_prompt_updated_at: z
    .string()
    .datetime()
    .nullable()
    .default(null),
  design_image_prompts: DesignImagePromptsSchema.nullable().default(null),
  design_image_prompts_source: z
    .enum(["generated", "uploaded", "pasted"])
    .nullable()
    .default(null),
  scene_board_prompt: z.string().nullable().default(null),
  scene_board_prompt_updated_at: z.string().datetime().nullable().default(null),
  scene_board: SceneBoardSchema.nullable().default(null),
  scene_board_source: z.enum(["generated", "uploaded", "pasted"]).nullable().default(null),
  keyframe_prompts_prompt: z.string().nullable().default(null),
  keyframe_prompts_prompt_updated_at: z.string().datetime().nullable().default(null),
  keyframe_prompts: KeyframePromptsSchema.nullable().default(null),
  keyframe_prompts_source: z
    .enum(["generated", "uploaded", "pasted"])
    .nullable()
    .default(null),
  kling_prompts_prompt: z.string().nullable().default(null),
  kling_prompts_prompt_updated_at: z.string().datetime().nullable().default(null),
  kling_prompts: KlingPromptsSchema.nullable().default(null),
  kling_prompts_source: z
    .enum(["generated", "uploaded", "pasted"])
    .nullable()
    .default(null),
  test_scene_review: TestSceneReviewSchema.nullable().default(null),
  export_ready_at: z.string().datetime().nullable().default(null),
  export_notes: z.string().nullable().default(null),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;
export type NewProjectInput = z.infer<typeof NewProjectInputSchema>;
export type Project = z.infer<typeof ProjectSchema>;

export const defaultProjectValues: NewProjectInput = {
  project_template: "future_files",
  project_name: "Future Files Episode",
  channel_name: "Future Files",
  niche: "Future Tech Mini Stories",
  positioning: "Cinematic stories from tomorrow",
  audience:
    "US, UK, Canada, Australia, age 18-44, tech-curious, sci-fi fans, AI/robotics enthusiasts",
  tone: "Wonder + Mystery + Slight Unease",
  visual_style: "Realistic cinematic future, premium sci-fi, soft blue/gold lighting",
  target_countries: ["US", "UK", "Canada", "Australia"],
  language: "English",
  video_format: "Vertical 9:16 short-form video",
  face_policy:
    "Minimal human faces. Use silhouettes, backs, reflections, blurred profiles, or distant figures.",
  cta_style: 'Soft CTA only, such as "Follow Future Files for more stories from tomorrow."',
  budget_range: "$30-50 per video for 4-6 clips",
  primary_ai_video_tool: "Kling",
  image_generation_tool: "Manual / user-selected",
  reference_style_notes:
    "Black Mirror-level unease plus premium Apple-style cinematic beauty.",
  negative_visual_rules: [
    "No neon cyberpunk by default",
    "No cheap CGI look",
    "No readable text inside generated video",
    "No logos",
    "No brand-like devices",
    "No chaotic fast motion",
    "No complex hand interactions",
    "No lip-sync dependency",
  ],
  content_pillars: [
    "Life in the Future",
    "Smart Homes & AI Cities",
    "Robots & AI Society",
    "Future Luxury & Space",
    "Future Mysteries & Speculation",
  ],
  blocked_topics: [
    "celebrities",
    "politics",
    "daily news",
    "copyrighted characters",
    "medical advice",
    "financial advice",
    "kid-focused content",
    "tutorial-heavy content",
    "screen recordings",
  ],
  target_duration_seconds: 45,
  scene_count: 5,
  platform: "TikTok / YouTube Shorts / Instagram Reels",
};

export const blankProjectValues: NewProjectInput = {
  project_template: "blank_custom",
  project_name: "",
  channel_name: "",
  niche: "",
  positioning: "",
  audience: "",
  tone: "",
  visual_style: "",
  target_countries: [],
  language: "English",
  video_format: "Vertical 9:16 short-form video",
  face_policy: "",
  cta_style: "",
  budget_range: "",
  primary_ai_video_tool: "",
  image_generation_tool: "",
  reference_style_notes: "",
  negative_visual_rules: [],
  content_pillars: [],
  blocked_topics: [],
  target_duration_seconds: 45,
  scene_count: 5,
  platform: "TikTok / YouTube Shorts / Instagram Reels",
};
