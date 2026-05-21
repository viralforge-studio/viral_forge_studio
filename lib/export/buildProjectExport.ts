import { type Project } from "@/lib/schemas/project";
import { getProductionReadiness } from "@/lib/workflow";

function section(title: string, body: string) {
  return `## ${title}\n\n${body.trim() || "Not available."}\n`;
}

function codeBlock(value: unknown) {
  return `\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``;
}

function bulletList(items: string[]) {
  if (items.length === 0) {
    return "- Not available.";
  }

  return items.map((item) => `- ${item}`).join("\n");
}

function buildReadinessSummary(project: Project) {
  const readiness = getProductionReadiness(project);
  const blockers =
    readiness.blockers.length > 0
      ? readiness.blockers.map((item) => `${item.label}: ${item.message}`)
      : ["None"];
  const warnings =
    readiness.warnings.length > 0
      ? readiness.warnings.map((item) => `${item.label}: ${item.message}`)
      : ["None"];
  const highlights = readiness.highlights.length > 0 ? readiness.highlights : ["None"];

  return [
    `- Readiness score: ${readiness.score}/100`,
    `- Completion: ${readiness.completedChecks}/${readiness.totalChecks} core checks`,
    `- Export finalization: ${readiness.canFinalizeExport ? "Eligible" : "Blocked"}`,
    "- Blockers:",
    ...blockers.map((item) => `  - ${item}`),
    "- Warnings:",
    ...warnings.map((item) => `  - ${item}`),
    "- Highlights:",
    ...highlights.map((item) => `  - ${item}`),
  ].join("\n");
}

function buildReferencePromptPack(project: Project) {
  if (!project.design_image_prompts) {
    return "No Reference Image Prompts.";
  }

  return project.design_image_prompts.image_prompts
    .map((prompt) =>
      [
        `### ${prompt.id} - ${prompt.title}`,
        `- Type: ${prompt.type}`,
        `- Purpose: ${prompt.purpose}`,
        "",
        "Prompt:",
        prompt.prompt,
        "",
        "Negative Prompt:",
        prompt.negative_prompt,
      ].join("\n"),
    )
    .join("\n\n");
}

function buildKeyframePromptPack(project: Project) {
  if (!project.keyframe_prompts) {
    return "No Keyframe Prompts.";
  }

  return project.keyframe_prompts.keyframes
    .map((scene) =>
      [
        `### Scene ${scene.scene_number} - ${scene.scene_role}`,
        "",
        "Opening Keyframe Prompt:",
        scene.opening_keyframe_prompt,
        "",
        "Ending Keyframe Prompt:",
        scene.ending_keyframe_prompt ?? "Not provided.",
        "",
        "Negative Prompt:",
        scene.negative_prompt,
      ].join("\n"),
    )
    .join("\n\n");
}

function buildKlingPromptPack(project: Project) {
  if (!project.kling_prompts) {
    return "No Kling Prompts.";
  }

  return project.kling_prompts.prompts
    .map((scene) =>
      [
        `### Scene ${scene.scene_number} - ${scene.scene_role}`,
        `- Duration: ${scene.duration_sec}s`,
        "",
        "Kling Prompt:",
        scene.kling_prompt,
        "",
        "Negative Prompt:",
        scene.negative_prompt,
      ].join("\n"),
    )
    .join("\n\n");
}

export function buildProjectExportMarkdown(project: Project) {
  const selectedIdea =
    project.idea_generation?.ideas.find((idea) => idea.id === project.selected_idea_id) ?? null;

  return `# ${project.project_name} Production Export

Generated for ${project.channel_name}.

${section("Production Readiness Summary", buildReadinessSummary(project))}

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

${section("Reference Prompt Pack (Copy-Ready)", buildReferencePromptPack(project))}

${section("Keyframe Prompt Pack (Copy-Ready)", buildKeyframePromptPack(project))}

${section("Kling Prompt Pack (Copy-Ready)", buildKlingPromptPack(project))}

${section("Export Notes", project.export_notes ?? "No export notes.")}

## Production Checklist

${bulletList([
  "Generate or approve reusable reference images.",
  `Generate Scene ${project.kling_prompts?.recommended_test_scene ?? 1} as the test scene first.`,
  "Compare the generated scene against the test scene review.",
  "If approved, generate remaining scenes in order.",
  "Keep subject identity, environment, lighting, and negative prompts consistent.",
  `Export final vertical package for ${project.platform}.`,
])}
`;
}
