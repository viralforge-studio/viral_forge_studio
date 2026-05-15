import { type Idea } from "@/lib/schemas/ideas";
import { type DesignImagePromptsJson } from "@/lib/schemas/design-image-prompts";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { type SubjectDesign } from "@/lib/schemas/subject-design";

export async function generateDesignImagePromptsWithMock(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  subjectDesign: SubjectDesign,
  prompt: string,
): Promise<DesignImagePromptsJson> {
  void prompt;

  return {
    generation_timestamp: new Date().toISOString(),
    project_id: project.id,
    channel: project.channel_name,
    idea_id: selectedIdea.id,
    source_idea_title: selectedIdea.title,
    source_script_title: scriptGeneration.title,
    source_subject_design_summary: subjectDesign.visual_style_summary,
    prompt_set_goal:
      "Create reusable still-image reference prompts that lock the robot, apartment, prop, and overall cinematic style before scene-specific keyframes or Kling prompts.",
    image_prompts: [
      {
        id: "img_ref_robot_full_body_01",
        title: "Robot Full Body Reference",
        type: "subject_full_body_reference",
        linked_ids: ["subject_robot_01"],
        purpose: "Generate the core full-body robot design reference for all later scenes.",
        prompt:
          "Cinematic full-body still of an original domestic companion robot standing beside a seamless future apartment door inside an abandoned premium apartment, tall balanced silhouette, rounded shoulders, slim torso, matte ceramic composite panels, brushed titanium joints, smoked glass sensor band glowing muted cyan, subtle dust and edge wear, soft blue-black ambience with gentle warm hallway rim light, realistic premium sci-fi materials, vertical 9:16 composition, centered subject, clean negative space, emotionally restrained, highly detailed, photorealistic.",
        negative_prompt:
          "No logos, no readable text, no famous robot resemblance, no cartoon style, no weapons, no extra limbs, no damaged face distortion, no exaggerated neon cyberpunk.",
        recommended_model_use:
          "Use first to lock the hero robot silhouette and materials before generating any environment or keyframe references.",
        composition_notes:
          "Vertical 9:16, centered full-body framing, doorway visible as a continuity anchor.",
        consistency_notes: [
          "Keep the horizontal cyan sensor band understated.",
          "Keep matte pearl-white ceramic panels with light wear.",
          "Keep three-fingered hands and a calm domestic silhouette.",
        ],
        human_review_questions: [
          "Does the silhouette feel original at thumbnail size?",
          "Do the materials read as premium and believable?",
          "Can this exact design stay consistent across all scenes?",
        ],
      },
      {
        id: "img_ref_robot_face_closeup_01",
        title: "Robot Face Close-Up Reference",
        type: "subject_closeup_reference",
        linked_ids: ["subject_robot_01"],
        purpose: "Establish a close-up facial framing that communicates emotion without human-like acting.",
        prompt:
          "Close-up still portrait of an original domestic companion robot face and upper shoulders, smoked glass sensor band with restrained muted cyan glow, matte ceramic shell with subtle scuffs and dust, premium near-future industrial design, rain-soft reflections from a nearby window, low-key cinematic lighting, quiet loneliness, realistic textures, shallow depth of field, vertical 9:16 crop, elegant negative space, photorealistic.",
        negative_prompt:
          "No human face, no celebrity likeness, no expressive mouth, no brand marks, no readable text, no cartoon rendering, no uncanny distorted eyes.",
        recommended_model_use:
          "Use after the full-body reference to confirm facial treatment, texture detail, and emotional lighting language.",
        composition_notes:
          "Tight head-and-shoulders crop with soft side light and minimal background clutter.",
        consistency_notes: [
          "Keep the sensor band shape identical to the hero design.",
          "Do not add a mouth or human skin details.",
          "Keep the robot calm, still, and emotionally readable through light only.",
        ],
        human_review_questions: [
          "Does the robot feel emotional without copying human expression?",
          "Is the close-up free from uncanny distortion?",
          "Would this crop remain consistent in later keyframes?",
        ],
      },
      {
        id: "img_ref_apartment_environment_01",
        title: "Abandoned Apartment Reference",
        type: "environment_reference",
        linked_ids: ["env_apartment_01"],
        purpose: "Define the main apartment environment that all scenes should inherit.",
        prompt:
          "Wide still of an abandoned futuristic apartment interior, premium minimalist sci-fi residential architecture, smart glass, brushed metal, concrete composite, soft-touch polymer surfaces, elegant emptiness, subtle plant intrusion through cracks, controlled dust, deep slate blue and muted steel palette with warm amber practical light, believable future home rather than dystopian ruin, cinematic realism, vertical 9:16 framing, strong depth, photorealistic.",
        negative_prompt:
          "No readable signage, no logos, no cluttered apocalypse debris, no cartoon style, no neon nightclub colors, no visible brands, no people.",
        recommended_model_use:
          "Use to lock the environment palette and material language before scene compositions are generated.",
        composition_notes:
          "Vertical 9:16 with clear foreground-to-background depth and visible threshold toward the door zone.",
        consistency_notes: [
          "Keep the apartment premium and restrained rather than chaotic.",
          "Preserve blue-black ambience with selective warm practical light.",
          "Let plant overgrowth stay subtle and believable.",
        ],
        human_review_questions: [
          "Does the apartment feel specific instead of generic sci-fi?",
          "Can this layout stay coherent across multiple scenes?",
          "Is the mood lonely without becoming visually noisy?",
        ],
      },
      {
        id: "img_ref_door_hallway_01",
        title: "Apartment Door and Hallway Light Reference",
        type: "prop_reference",
        linked_ids: ["prop_door_01", "prop_hallway_light_01", "env_hallway_01"],
        purpose: "Define the threshold prop system that drives the reveal and suspense.",
        prompt:
          "Still reference image of a seamless future apartment door partially surrounded by a quiet residential hallway threshold, subtle perimeter light, understated locking mechanism, narrow integrated hallway light strip, matte dark wall panels, pale gold spill light entering a blue-black interior, premium near-future realism, suspenseful negative space, clean lines, vertical 9:16 composition, photorealistic.",
        negative_prompt:
          "No apartment numbers, no labels, no warning graphics, no readable text, no logos, no flashy alarm effects, no red emergency lighting, no clutter.",
        recommended_model_use:
          "Use before final composition references so the doorway mechanics and light behavior stay consistent.",
        composition_notes:
          "Frame the threshold frontally or at a slight angle with light spill as the main focal cue.",
        consistency_notes: [
          "Keep the door minimal and brandless.",
          "Keep hallway light soft and believable, not theatrical.",
          "Preserve the same blue-warm contrast seen in the hero robot images.",
        ],
        human_review_questions: [
          "Does the doorway feel memorable enough to anchor the story?",
          "Is the light behavior cinematic but believable?",
          "Would this prop read clearly in silhouette-driven shots?",
        ],
      },
      {
        id: "img_ref_global_style_01",
        title: "Overall Style Reference",
        type: "style_reference",
        linked_ids: ["subject_robot_01", "env_apartment_01"],
        purpose: "Summarize the lighting, texture, and mood language for the whole short.",
        prompt:
          "Moodboard-style still reference for a premium realistic future short film about loneliness and loyalty, soft blue-black ambience, selective warm gold practical light, premium ceramic and metal textures, subtle dust, rain-soft reflections, quiet negative space, restrained cinematic realism, emotionally haunted but elegant, vertical 9:16 editorial framing, photorealistic finish.",
        negative_prompt:
          "No logos, no readable text, no neon cyberpunk overload, no cartoon style, no glossy toy finish, no celebrity likeness, no branded interiors.",
        recommended_model_use:
          "Use as a style anchor alongside the hero robot reference when tuning generators for the entire project.",
        composition_notes:
          "Can be slightly more abstract, but should still feel like a usable still-image reference rather than a graphic design board.",
        consistency_notes: [
          "Prioritize quiet realism over spectacle.",
          "Keep textures grounded and premium.",
          "Maintain emotional restraint across all later prompts.",
        ],
        human_review_questions: [
          "Does this style feel premium and original?",
          "Is the mood aligned with tenderness, mystery, and loneliness?",
          "Would this help unify images from multiple generators?",
        ],
      },
    ],
    global_negative_prompt:
      "No logos, no readable text, no copyrighted robot design, no celebrity likeness, no cartoon style, no extreme neon cyberpunk, no branded interiors, no extra fingers, no distorted anatomy.",
    recommended_generation_order: [
      "img_ref_robot_full_body_01",
      "img_ref_robot_face_closeup_01",
      "img_ref_apartment_environment_01",
      "img_ref_door_hallway_01",
      "img_ref_global_style_01",
    ],
    human_review: {
      needs_review: true,
      review_questions: [
        "Which image should become the visual anchor for the whole project?",
        "Are any references too generic or too close to existing robot designs?",
        "Can the robot, apartment, and doorway stay visually consistent across scenes?",
      ],
    },
  };
}
