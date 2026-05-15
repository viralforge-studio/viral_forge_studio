import { type DesignImagePromptsJson } from "@/lib/schemas/design-image-prompts";
import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { type SceneBoardJson } from "@/lib/schemas/scene-board";
import { type SubjectDesign } from "@/lib/schemas/subject-design";

export async function generateSceneBoardWithMock(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  subjectDesign: SubjectDesign,
  designImagePrompts: DesignImagePromptsJson | null,
  prompt: string,
): Promise<SceneBoardJson> {
  void prompt;

  const designRefsByScene = [
    ["img_ref_robot_full_body_01"],
    ["img_ref_apartment_environment_01"],
    ["img_ref_robot_face_closeup_01"],
    ["img_ref_door_hallway_01"],
    ["img_ref_global_style_01"],
  ];

  return {
    generation_timestamp: new Date().toISOString(),
    project_id: project.id,
    channel: project.channel_name,
    idea_id: selectedIdea.id,
    source_script_title: scriptGeneration.title,
    source_subject_design_summary: subjectDesign.visual_style_summary,
    board_goal:
      "Translate the script and approved design references into a per-scene production board for later keyframes and Kling prompts.",
    scenes: scriptGeneration.scenes.map((scene, index) => ({
      scene_number: scene.scene_number,
      scene_role: scene.scene_role,
      duration_sec: scene.duration_sec,
      voiceover_line: scene.narration,
      visual_goal: scene.visual_goal,
      required_subjects:
        scene.scene_number === 5
          ? ["subject_robot_01", "subject_figure_01"]
          : ["subject_robot_01"],
      required_environments:
        scene.scene_number >= 4
          ? ["env_apartment_01", "env_hallway_01"]
          : ["env_apartment_01"],
      required_props:
        scene.scene_number === 3
          ? []
          : scene.scene_number >= 4
            ? ["prop_door_01", "prop_hallway_light_01"]
            : ["prop_door_01"],
      design_references:
        designImagePrompts?.image_prompts
          ?.map((imagePrompt) => imagePrompt.id)
          .filter((id) => designRefsByScene[index]?.includes(id)) ?? designRefsByScene[index],
      camera_framing:
        scene.scene_number === 3
          ? "Tight emotional close-up with shallow depth and centered sensor band."
          : scene.scene_number === 5
            ? "Over-shoulder or rear three-quarter composition with the doorway as the reveal anchor."
            : "Vertical cinematic framing with clear silhouette readability and controlled negative space.",
      lighting_plan:
        scene.scene_number >= 4
          ? "Balance cool apartment ambience with a warm hallway spill so the threshold becomes the visual trigger."
          : "Soft blue-black ambient light with restrained practical highlights and realistic material reflections.",
      composition_notes: scene.visual_summary,
      continuity_rules: [
        "Keep the robot silhouette and cyan sensor treatment consistent.",
        "Maintain the same apartment material language and restrained decay level.",
        "Avoid readable text, logos, or brand-like objects in frame.",
      ],
      risk_notes: [
        scene.kling_risk_notes,
        "Avoid overcomplicating hands or small prop interactions.",
        "Keep emotional clarity in lighting and framing rather than facial acting.",
      ],
      human_review_checklist: [
        "Is the visual goal immediately clear?",
        "Do the chosen references support continuity with other scenes?",
        "Can this scene be generated later without unnecessary complexity?",
      ],
    })),
    global_continuity_rules: [
      "Keep the robot, apartment, doorway, and lighting language stable across all scenes.",
      "Preserve premium realistic sci-fi styling instead of neon cyberpunk spectacle.",
      "Use silhouettes, posture, and composition to carry emotion rather than detailed facial acting.",
    ],
    recommended_test_scene: 3,
    why_test_this_scene_first:
      "Scene 3 is the emotional core and the highest risk for subtle robot expression, material realism, and quiet cinematic mood.",
    human_review: {
      needs_review: true,
      review_questions: [
        "Does each scene board entry give enough production clarity without over-directing the generator?",
        "Are the design references balanced across subject, environment, and composition needs?",
        "Which scene is most likely to fail visually and should be simplified before keyframing?",
      ],
    },
  };
}
