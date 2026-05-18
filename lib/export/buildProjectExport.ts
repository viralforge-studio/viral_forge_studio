import { type Project } from "@/lib/schemas/project";

function section(title: string, body: string) {
  return `## ${title}\n\n${body.trim() || "Not available."}\n`;
}

function codeBlock(value: unknown) {
  return `\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``;
}

export function buildProjectExportMarkdown(project: Project) {
  const selectedIdea =
    project.idea_generation?.ideas.find((idea) => idea.id === project.selected_idea_id) ?? null;

  return `# ${project.project_name} Production Export

Generated for ${project.channel_name}.

${section(
  "Project Brief",
  [
    `- Niche: ${project.niche}`,
    `- Platform: ${project.platform}`,
    `- Video format: ${project.video_format}`,
    `- Language: ${project.language}`,
    `- Target countries: ${project.target_countries.join(", ") || "Not set"}`,
    `- Target duration: ${project.target_duration_seconds} seconds`,
    `- Scene count: ${project.scene_count}`,
    `- Primary video tool: ${project.primary_ai_video_tool || "Not set"}`,
    `- Image generation tool: ${project.image_generation_tool || "Not set"}`,
    `- Positioning: ${project.positioning}`,
    `- Audience: ${project.audience}`,
  ].join("\n"),
)}

${section("Selected Idea", selectedIdea ? codeBlock(selectedIdea) : "No selected idea.")}

${section("Script", project.script_generation ? codeBlock(project.script_generation) : "No script.")}

${section("Edited Voiceover", project.edited_voiceover ?? "No edited voiceover saved.")}

${section(
  "Subject Design",
  project.subject_design ? codeBlock(project.subject_design) : "No subject design.",
)}

${section(
  "Reference Image Prompts",
  project.design_image_prompts ? codeBlock(project.design_image_prompts) : "No reference image prompts.",
)}

${section("Scene Board", project.scene_board ? codeBlock(project.scene_board) : "No scene board.")}

${section(
  "Keyframe Prompts",
  project.keyframe_prompts ? codeBlock(project.keyframe_prompts) : "No keyframe prompts.",
)}

${section(
  "Kling Prompts",
  project.kling_prompts ? codeBlock(project.kling_prompts) : "No Kling prompts.",
)}

${section(
  "Test Scene Review",
  project.test_scene_review ? codeBlock(project.test_scene_review) : "No test scene review.",
)}

${section(
  "Export Notes",
  project.export_notes ?? "No export notes.",
)}

## Production Checklist

- Generate or approve reusable reference images.
- Generate Scene ${project.kling_prompts?.recommended_test_scene ?? 1} as the test scene first.
- Compare the generated scene against the test scene review.
- If approved, generate remaining scenes in order.
- Keep subject identity, environment, lighting, and negative prompts consistent.
- Export final vertical package for ${project.platform}.
`;
}
