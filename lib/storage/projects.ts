import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import {
  type IdeaGeneration,
  validateIdeaGenerationBusinessRules,
} from "@/lib/schemas/ideas";
import { buildDesignImagePromptsPrompt } from "@/lib/prompts/buildDesignImagePromptsPrompt";
import { buildKeyframePromptsPrompt } from "@/lib/prompts/buildKeyframePromptsPrompt";
import { buildKlingPromptsPrompt } from "@/lib/prompts/buildKlingPromptsPrompt";
import { buildSceneBoardPrompt } from "@/lib/prompts/buildSceneBoardPrompt";
import {
  type NewProjectInput,
  NewProjectInputSchema,
  type ProjectStatus,
  type Project,
  ProjectSchema,
} from "@/lib/schemas/project";
import { buildScriptGenerationPrompt } from "@/lib/prompts/buildScriptGenerationPrompt";
import { type DesignImagePromptsJson } from "@/lib/schemas/design-image-prompts";
import { type KeyframePromptsJson } from "@/lib/schemas/keyframe-prompts";
import { type KlingPromptsJson } from "@/lib/schemas/kling-prompts";
import { type SceneBoardJson } from "@/lib/schemas/scene-board";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { buildSubjectDesignPrompt } from "@/lib/prompts/buildSubjectDesignPrompt";
import { type SubjectDesign } from "@/lib/schemas/subject-design";
import { type SaveTestSceneReviewInput } from "@/lib/schemas/test-scene-review";
import {
  isDatabaseConfigured,
  readProjectsFromDatabase,
  writeProjectsToDatabase,
} from "@/lib/db/projectsRepository";

const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");

const SCRIPT_PROMPT_OR_LATER_STATUSES: ProjectStatus[] = [
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
];

function keepStatusIfAlreadyReached(
  currentStatus: ProjectStatus,
  preservedStatuses: ProjectStatus[],
  fallbackStatus: ProjectStatus,
) {
  if (preservedStatuses.includes(currentStatus)) {
    return currentStatus;
  }

  return fallbackStatus;
}

function clearScenePlanningStages(project: Project) {
  return {
    ...project,
    scene_board_prompt: null,
    scene_board_prompt_updated_at: null,
    scene_board: null,
    scene_board_source: null,
    keyframe_prompts_prompt: null,
    keyframe_prompts_prompt_updated_at: null,
    keyframe_prompts: null,
    keyframe_prompts_source: null,
    kling_prompts_prompt: null,
    kling_prompts_prompt_updated_at: null,
    kling_prompts: null,
    kling_prompts_source: null,
    test_scene_review: null,
    export_ready_at: null,
    export_notes: null,
  };
}

function clearKeyframeAndKlingStages(project: Project) {
  return {
    ...project,
    keyframe_prompts_prompt: null,
    keyframe_prompts_prompt_updated_at: null,
    keyframe_prompts: null,
    keyframe_prompts_source: null,
    kling_prompts_prompt: null,
    kling_prompts_prompt_updated_at: null,
    kling_prompts: null,
    kling_prompts_source: null,
    test_scene_review: null,
    export_ready_at: null,
    export_notes: null,
  };
}

function clearKlingStage(project: Project) {
  return {
    ...project,
    kling_prompts_prompt: null,
    kling_prompts_prompt_updated_at: null,
    kling_prompts: null,
    kling_prompts_source: null,
    test_scene_review: null,
    export_ready_at: null,
    export_notes: null,
  };
}

async function ensureStorage() {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    await readFile(PROJECTS_FILE, "utf8");
  } catch {
    await writeFile(PROJECTS_FILE, "[]\n", "utf8");
  }
}

async function readProjects() {
  if (isDatabaseConfigured()) {
    return readProjectsFromDatabase();
  }

  await ensureStorage();
  const content = await readFile(PROJECTS_FILE, "utf8");
  const parsed = JSON.parse(content) as unknown;

  return ProjectSchema.array().parse(parsed);
}

async function writeProjects(projects: Project[]) {
  if (isDatabaseConfigured()) {
    await writeProjectsToDatabase(projects);
    return;
  }

  await ensureStorage();
  await writeFile(PROJECTS_FILE, `${JSON.stringify(projects, null, 2)}\n`, "utf8");
}

export async function getProjects() {
  const projects = await readProjects();
  return projects.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getProjectById(id: string) {
  const projects = await readProjects();
  return projects.find((project) => project.id === id) ?? null;
}

export async function deleteProject(id: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === id);

  if (index === -1) {
    return null;
  }

  const [deletedProject] = projects.splice(index, 1);
  await writeProjects(projects);
  return deletedProject;
}

export async function createProject(input: NewProjectInput) {
  const payload = NewProjectInputSchema.parse(input);
  const projects = await readProjects();
  const timestamp = new Date().toISOString();

  const project: Project = {
    id: randomUUID(),
    ...payload,
    status: "brief_created",
    idea_generation: null,
    selected_idea_id: null,
    script_prompt: null,
    script_prompt_updated_at: null,
    script_generation: null,
    script_generation_source: null,
    edited_voiceover: null,
    voiceover_updated_at: null,
    voiceover_notes: null,
    subject_design_prompt: null,
    subject_design_prompt_updated_at: null,
    subject_design: null,
    subject_design_source: null,
    subject_design_review_notes: null,
    subject_design_reviewed_at: null,
    design_image_prompt_generation_prompt: null,
    design_image_prompt_generation_prompt_updated_at: null,
    design_image_prompts: null,
    design_image_prompts_source: null,
    scene_board_prompt: null,
    scene_board_prompt_updated_at: null,
    scene_board: null,
    scene_board_source: null,
    keyframe_prompts_prompt: null,
    keyframe_prompts_prompt_updated_at: null,
    keyframe_prompts: null,
    keyframe_prompts_source: null,
    kling_prompts_prompt: null,
    kling_prompts_prompt_updated_at: null,
    kling_prompts: null,
    kling_prompts_source: null,
    test_scene_review: null,
    export_ready_at: null,
    export_notes: null,
    created_at: timestamp,
    updated_at: timestamp,
  };

  projects.push(project);
  await writeProjects(projects);
  return project;
}

export async function updateProject(id: string, patch: Partial<Project>) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === id);

  if (index === -1) {
    return null;
  }

  const updated = ProjectSchema.parse({
    ...projects[index],
    ...patch,
    id,
    updated_at: new Date().toISOString(),
  });

  projects[index] = updated;
  await writeProjects(projects);
  return updated;
}

async function persistIdeaGeneration(
  projectId: string,
  ideaGeneration: IdeaGeneration,
) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const ruleErrors = validateIdeaGenerationBusinessRules(ideaGeneration);
  if (ruleErrors.length > 0) {
    throw new Error(ruleErrors.join(" "));
  }

  const existingSelectedId = projects[index].selected_idea_id;
  const hasSelectedIdea = ideaGeneration.ideas.some(
    (idea) => idea.id === existingSelectedId,
  );

  const nextProject: Project = {
    ...projects[index],
    idea_generation: ideaGeneration,
    selected_idea_id: hasSelectedIdea ? existingSelectedId : null,
    script_prompt: hasSelectedIdea ? projects[index].script_prompt : null,
    script_prompt_updated_at: hasSelectedIdea
      ? projects[index].script_prompt_updated_at
      : null,
    script_generation: hasSelectedIdea ? projects[index].script_generation : null,
    script_generation_source: hasSelectedIdea
      ? projects[index].script_generation_source
      : null,
    edited_voiceover: hasSelectedIdea ? projects[index].edited_voiceover : null,
    voiceover_updated_at: hasSelectedIdea ? projects[index].voiceover_updated_at : null,
    voiceover_notes: hasSelectedIdea ? projects[index].voiceover_notes : null,
    subject_design_prompt: hasSelectedIdea ? projects[index].subject_design_prompt : null,
    subject_design_prompt_updated_at: hasSelectedIdea
      ? projects[index].subject_design_prompt_updated_at
      : null,
    subject_design: hasSelectedIdea ? projects[index].subject_design : null,
    subject_design_source: hasSelectedIdea ? projects[index].subject_design_source : null,
    subject_design_review_notes: hasSelectedIdea
      ? projects[index].subject_design_review_notes
      : null,
    subject_design_reviewed_at: hasSelectedIdea
      ? projects[index].subject_design_reviewed_at
      : null,
    design_image_prompt_generation_prompt: hasSelectedIdea
      ? projects[index].design_image_prompt_generation_prompt
      : null,
    design_image_prompt_generation_prompt_updated_at: hasSelectedIdea
      ? projects[index].design_image_prompt_generation_prompt_updated_at
      : null,
    design_image_prompts: hasSelectedIdea ? projects[index].design_image_prompts : null,
    design_image_prompts_source: hasSelectedIdea
      ? projects[index].design_image_prompts_source
      : null,
    scene_board_prompt: hasSelectedIdea ? projects[index].scene_board_prompt : null,
    scene_board_prompt_updated_at: hasSelectedIdea
      ? projects[index].scene_board_prompt_updated_at
      : null,
    scene_board: hasSelectedIdea ? projects[index].scene_board : null,
    scene_board_source: hasSelectedIdea ? projects[index].scene_board_source : null,
    keyframe_prompts_prompt: hasSelectedIdea ? projects[index].keyframe_prompts_prompt : null,
    keyframe_prompts_prompt_updated_at: hasSelectedIdea
      ? projects[index].keyframe_prompts_prompt_updated_at
      : null,
    keyframe_prompts: hasSelectedIdea ? projects[index].keyframe_prompts : null,
    keyframe_prompts_source: hasSelectedIdea
      ? projects[index].keyframe_prompts_source
      : null,
    kling_prompts_prompt: hasSelectedIdea ? projects[index].kling_prompts_prompt : null,
    kling_prompts_prompt_updated_at: hasSelectedIdea
      ? projects[index].kling_prompts_prompt_updated_at
      : null,
    kling_prompts: hasSelectedIdea ? projects[index].kling_prompts : null,
    kling_prompts_source: hasSelectedIdea ? projects[index].kling_prompts_source : null,
    test_scene_review: hasSelectedIdea ? projects[index].test_scene_review : null,
    export_ready_at: hasSelectedIdea ? projects[index].export_ready_at : null,
    export_notes: hasSelectedIdea ? projects[index].export_notes : null,
    status: hasSelectedIdea ? "idea_selected" : "ideas_generated",
    updated_at: new Date().toISOString(),
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function saveIdeaGeneration(
  projectId: string,
  ideaGeneration: IdeaGeneration,
) {
  return persistIdeaGeneration(projectId, ideaGeneration);
}

export async function uploadIdeaGeneration(
  projectId: string,
  ideaGeneration: IdeaGeneration,
) {
  return persistIdeaGeneration(projectId, ideaGeneration);
}

export async function selectIdea(projectId: string, ideaId: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  if (!project.idea_generation) {
    throw new Error("Ideas have not been generated for this project yet.");
  }

  const ideaExists = project.idea_generation.ideas.some((idea) => idea.id === ideaId);
  if (!ideaExists) {
    throw new Error("Selected idea does not exist in this project.");
  }

  const selectedIdea = project.idea_generation.ideas.find((idea) => idea.id === ideaId);
  if (!selectedIdea) {
    throw new Error("Selected idea could not be resolved.");
  }

  const scriptPrompt = buildScriptGenerationPrompt(project, selectedIdea);
  const timestamp = new Date().toISOString();

  const nextProject: Project = {
    ...project,
    selected_idea_id: ideaId,
    script_prompt: scriptPrompt,
    script_prompt_updated_at: timestamp,
    script_generation: null,
    script_generation_source: null,
    edited_voiceover: null,
    voiceover_updated_at: null,
    voiceover_notes: null,
    subject_design_prompt: null,
    subject_design_prompt_updated_at: null,
    subject_design: null,
    subject_design_source: null,
    subject_design_review_notes: null,
    subject_design_reviewed_at: null,
    design_image_prompt_generation_prompt: null,
    design_image_prompt_generation_prompt_updated_at: null,
    design_image_prompts: null,
    design_image_prompts_source: null,
    scene_board_prompt: null,
    scene_board_prompt_updated_at: null,
    scene_board: null,
    scene_board_source: null,
    keyframe_prompts_prompt: null,
    keyframe_prompts_prompt_updated_at: null,
    keyframe_prompts: null,
    keyframe_prompts_source: null,
    kling_prompts_prompt: null,
    kling_prompts_prompt_updated_at: null,
    kling_prompts: null,
    kling_prompts_source: null,
    test_scene_review: null,
    export_ready_at: null,
    export_notes: null,
    status: "idea_selected",
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export function getSelectedIdea(project: Project) {
  if (!project.idea_generation || !project.selected_idea_id) {
    return null;
  }

  return (
    project.idea_generation.ideas.find((idea) => idea.id === project.selected_idea_id) ?? null
  );
}

export async function ensureScriptPrompt(projectId: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);

  if (!selectedIdea) {
    throw new Error("Select an idea first before creating a script prompt.");
  }

  if (project.script_prompt) {
    return project;
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    script_prompt: buildScriptGenerationPrompt(project, selectedIdea),
    script_prompt_updated_at: timestamp,
    status: keepStatusIfAlreadyReached(
      project.status,
      SCRIPT_PROMPT_OR_LATER_STATUSES,
      "script_prompt_ready",
    ),
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function saveScriptPrompt(projectId: string, scriptPrompt: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const selectedIdea = getSelectedIdea(projects[index]);
  if (!selectedIdea) {
    throw new Error("Select an idea first before creating a script prompt.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...projects[index],
    script_prompt: scriptPrompt,
    script_prompt_updated_at: timestamp,
    status: keepStatusIfAlreadyReached(
      projects[index].status,
      SCRIPT_PROMPT_OR_LATER_STATUSES,
      "script_prompt_ready",
    ),
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function resetScriptPrompt(projectId: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);
  if (!selectedIdea) {
    throw new Error("Select an idea first before creating a script prompt.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    script_prompt: buildScriptGenerationPrompt(project, selectedIdea),
    script_prompt_updated_at: timestamp,
    status: keepStatusIfAlreadyReached(
      project.status,
      SCRIPT_PROMPT_OR_LATER_STATUSES,
      "script_prompt_ready",
    ),
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function saveScriptGeneration(
  projectId: string,
  scriptGeneration: ScriptGeneration,
  source: "generated" | "uploaded" | "pasted" = "generated",
) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);
  if (!selectedIdea) {
    throw new Error("Select an idea first before generating a script.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    script_generation: scriptGeneration,
    script_generation_source: source,
    edited_voiceover: null,
    voiceover_updated_at: null,
    voiceover_notes: null,
    subject_design_prompt: null,
    subject_design_prompt_updated_at: null,
    subject_design: null,
    subject_design_source: null,
    subject_design_review_notes: null,
    subject_design_reviewed_at: null,
    design_image_prompt_generation_prompt: null,
    design_image_prompt_generation_prompt_updated_at: null,
    design_image_prompts: null,
    design_image_prompts_source: null,
    scene_board_prompt: null,
    scene_board_prompt_updated_at: null,
    scene_board: null,
    scene_board_source: null,
    keyframe_prompts_prompt: null,
    keyframe_prompts_prompt_updated_at: null,
    keyframe_prompts: null,
    keyframe_prompts_source: null,
    kling_prompts_prompt: null,
    kling_prompts_prompt_updated_at: null,
    kling_prompts: null,
    kling_prompts_source: null,
    test_scene_review: null,
    export_ready_at: null,
    export_notes: null,
    status: "script_generated",
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function uploadScriptGeneration(
  projectId: string,
  scriptGeneration: ScriptGeneration,
  source: "uploaded" | "pasted",
) {
  return saveScriptGeneration(projectId, scriptGeneration, source);
}

export function getDefaultVoiceover(project: Project) {
  if (!project.script_generation) {
    return null;
  }

  return (
    project.script_generation.voiceover.clean_script ??
    project.script_generation.full_voiceover
  );
}

export async function saveEditedVoiceover(
  projectId: string,
  editedVoiceover: string,
  voiceoverNotes?: string | null,
) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  if (!project.script_generation) {
    throw new Error("Generate or upload a script first before extracting voiceover.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    edited_voiceover: editedVoiceover,
    voiceover_notes: voiceoverNotes ?? project.voiceover_notes ?? null,
    voiceover_updated_at: timestamp,
    status:
      project.status === "subject_design_prompt_ready" ||
      project.status === "subject_design_ready" ||
      project.status === "design_image_prompts_ready" ||
      project.status === "scene_board_ready" ||
      project.status === "keyframe_prompts_ready" ||
      project.status === "kling_prompts_ready" ||
      project.status === "test_scene_review" ||
      project.status === "ready_for_export"
        ? project.status
        : "voiceover_reviewed",
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function resetEditedVoiceover(projectId: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  if (!project.script_generation) {
    throw new Error("Generate or upload a script first before extracting voiceover.");
  }

  const defaultVoiceover = getDefaultVoiceover(project);
  if (!defaultVoiceover) {
    throw new Error("Voiceover could not be extracted from the script.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    edited_voiceover: defaultVoiceover,
    voiceover_updated_at: timestamp,
    status:
      project.status === "subject_design_prompt_ready" ||
      project.status === "subject_design_ready" ||
      project.status === "design_image_prompts_ready" ||
      project.status === "scene_board_ready" ||
      project.status === "keyframe_prompts_ready" ||
      project.status === "kling_prompts_ready" ||
      project.status === "test_scene_review" ||
      project.status === "ready_for_export"
        ? project.status
        : "voiceover_reviewed",
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function ensureSubjectDesignPrompt(projectId: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);

  if (!selectedIdea || !project.script_generation) {
    throw new Error("Generate or upload a script first before creating subject design prompts.");
  }

  if (project.subject_design_prompt) {
    return project;
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    subject_design_prompt: buildSubjectDesignPrompt(
      project,
      selectedIdea,
      project.script_generation,
      project.edited_voiceover,
    ),
    subject_design_prompt_updated_at: timestamp,
    status:
      project.status === "subject_design_ready" ||
      project.status === "design_image_prompts_ready" ||
      project.status === "scene_board_ready" ||
      project.status === "keyframe_prompts_ready" ||
      project.status === "kling_prompts_ready" ||
      project.status === "test_scene_review" ||
      project.status === "ready_for_export"
        ? project.status
        : "subject_design_prompt_ready",
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function saveSubjectDesignPrompt(projectId: string, prompt: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);
  if (!selectedIdea || !project.script_generation) {
    throw new Error("Generate or upload a script first before creating subject design prompts.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    subject_design_prompt: prompt,
    subject_design_prompt_updated_at: timestamp,
    status:
      project.status === "subject_design_ready" ||
      project.status === "design_image_prompts_ready" ||
      project.status === "scene_board_ready" ||
      project.status === "keyframe_prompts_ready" ||
      project.status === "kling_prompts_ready" ||
      project.status === "test_scene_review" ||
      project.status === "ready_for_export"
        ? project.status
        : "subject_design_prompt_ready",
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function resetSubjectDesignPrompt(projectId: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);
  if (!selectedIdea || !project.script_generation) {
    throw new Error("Generate or upload a script first before creating subject design prompts.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    subject_design_prompt: buildSubjectDesignPrompt(
      project,
      selectedIdea,
      project.script_generation,
      project.edited_voiceover,
    ),
    subject_design_prompt_updated_at: timestamp,
    status:
      project.status === "subject_design_ready" ||
      project.status === "design_image_prompts_ready" ||
      project.status === "scene_board_ready" ||
      project.status === "keyframe_prompts_ready" ||
      project.status === "kling_prompts_ready" ||
      project.status === "test_scene_review" ||
      project.status === "ready_for_export"
        ? project.status
        : "subject_design_prompt_ready",
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function saveSubjectDesign(
  projectId: string,
  subjectDesign: SubjectDesign,
  source: "generated" | "uploaded" | "pasted",
) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  if (!project.script_generation || !getSelectedIdea(project)) {
    throw new Error("Generate or upload a script first before saving subject design.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...clearScenePlanningStages(project),
    subject_design: subjectDesign,
    subject_design_source: source,
    subject_design_review_notes: null,
    subject_design_reviewed_at: null,
    design_image_prompt_generation_prompt: null,
    design_image_prompt_generation_prompt_updated_at: null,
    design_image_prompts: null,
    design_image_prompts_source: null,
    status: "subject_design_ready",
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function saveSubjectDesignReview(
  projectId: string,
  reviewNotes: string | null,
  markReviewed: boolean,
) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  if (!project.subject_design) {
    throw new Error("Generate or upload subject design before saving review notes.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    subject_design_review_notes: reviewNotes,
    subject_design_reviewed_at: markReviewed
      ? timestamp
      : project.subject_design_reviewed_at,
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function ensureDesignImagePromptGenerationPrompt(projectId: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);

  if (!selectedIdea || !project.script_generation || !project.subject_design) {
    throw new Error("Create or upload Subject Design first before creating image prompts.");
  }

  if (project.design_image_prompt_generation_prompt) {
    return project;
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    design_image_prompt_generation_prompt: buildDesignImagePromptsPrompt(
      project,
      selectedIdea,
      project.script_generation,
      project.edited_voiceover,
      project.subject_design,
    ),
    design_image_prompt_generation_prompt_updated_at: timestamp,
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function saveDesignImagePromptGenerationPrompt(projectId: string, prompt: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);

  if (!selectedIdea || !project.script_generation || !project.subject_design) {
    throw new Error("Create or upload Subject Design first before creating image prompts.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    design_image_prompt_generation_prompt: prompt,
    design_image_prompt_generation_prompt_updated_at: timestamp,
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function resetDesignImagePromptGenerationPrompt(projectId: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);

  if (!selectedIdea || !project.script_generation || !project.subject_design) {
    throw new Error("Create or upload Subject Design first before creating image prompts.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    design_image_prompt_generation_prompt: buildDesignImagePromptsPrompt(
      project,
      selectedIdea,
      project.script_generation,
      project.edited_voiceover,
      project.subject_design,
    ),
    design_image_prompt_generation_prompt_updated_at: timestamp,
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function saveDesignImagePrompts(
  projectId: string,
  designImagePrompts: DesignImagePromptsJson,
  source: "generated" | "uploaded" | "pasted",
) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  if (!project.script_generation || !project.subject_design || !getSelectedIdea(project)) {
    throw new Error("Create or upload Subject Design first before saving image prompts.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...clearScenePlanningStages(project),
    design_image_prompts: designImagePrompts,
    design_image_prompts_source: source,
    status: "design_image_prompts_ready",
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function ensureSceneBoardPrompt(projectId: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);

  if (!selectedIdea || !project.script_generation || !project.subject_design) {
    throw new Error("Create Subject Design first before building the Scene Board.");
  }

  if (project.scene_board_prompt) {
    return project;
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    scene_board_prompt: buildSceneBoardPrompt(
      project,
      selectedIdea,
      project.script_generation,
      project.edited_voiceover,
      project.subject_design,
      project.design_image_prompts,
    ),
    scene_board_prompt_updated_at: timestamp,
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function saveSceneBoardPrompt(projectId: string, prompt: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);

  if (!selectedIdea || !project.script_generation || !project.subject_design) {
    throw new Error("Create Subject Design first before building the Scene Board.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    scene_board_prompt: prompt,
    scene_board_prompt_updated_at: timestamp,
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function resetSceneBoardPrompt(projectId: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);

  if (!selectedIdea || !project.script_generation || !project.subject_design) {
    throw new Error("Create Subject Design first before building the Scene Board.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    scene_board_prompt: buildSceneBoardPrompt(
      project,
      selectedIdea,
      project.script_generation,
      project.edited_voiceover,
      project.subject_design,
      project.design_image_prompts,
    ),
    scene_board_prompt_updated_at: timestamp,
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function saveSceneBoard(
  projectId: string,
  sceneBoard: SceneBoardJson,
  source: "generated" | "uploaded" | "pasted",
) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  if (!project.script_generation || !project.subject_design || !getSelectedIdea(project)) {
    throw new Error("Create Subject Design first before saving the Scene Board.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...clearKeyframeAndKlingStages(project),
    scene_board: sceneBoard,
    scene_board_source: source,
    status: "scene_board_ready",
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function ensureKeyframePromptsPrompt(projectId: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);

  if (
    !selectedIdea ||
    !project.script_generation ||
    !project.subject_design ||
    !project.scene_board
  ) {
    throw new Error("Create Scene Board first before creating keyframe prompts.");
  }

  if (project.keyframe_prompts_prompt) {
    return project;
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    keyframe_prompts_prompt: buildKeyframePromptsPrompt(
      project,
      selectedIdea,
      project.script_generation,
      project.subject_design,
      project.design_image_prompts,
      project.scene_board,
    ),
    keyframe_prompts_prompt_updated_at: timestamp,
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function saveKeyframePromptsPrompt(projectId: string, prompt: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);

  if (
    !selectedIdea ||
    !project.script_generation ||
    !project.subject_design ||
    !project.scene_board
  ) {
    throw new Error("Create Scene Board first before creating keyframe prompts.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    keyframe_prompts_prompt: prompt,
    keyframe_prompts_prompt_updated_at: timestamp,
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function resetKeyframePromptsPrompt(projectId: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);

  if (
    !selectedIdea ||
    !project.script_generation ||
    !project.subject_design ||
    !project.scene_board
  ) {
    throw new Error("Create Scene Board first before creating keyframe prompts.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    keyframe_prompts_prompt: buildKeyframePromptsPrompt(
      project,
      selectedIdea,
      project.script_generation,
      project.subject_design,
      project.design_image_prompts,
      project.scene_board,
    ),
    keyframe_prompts_prompt_updated_at: timestamp,
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function saveKeyframePrompts(
  projectId: string,
  keyframePrompts: KeyframePromptsJson,
  source: "generated" | "uploaded" | "pasted",
) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  if (!project.scene_board || !project.script_generation || !getSelectedIdea(project)) {
    throw new Error("Create Scene Board first before saving keyframe prompts.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...clearKlingStage(project),
    keyframe_prompts: keyframePrompts,
    keyframe_prompts_source: source,
    status: "keyframe_prompts_ready",
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function ensureKlingPromptsPrompt(projectId: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);

  if (
    !selectedIdea ||
    !project.script_generation ||
    !project.subject_design ||
    !project.scene_board ||
    !project.keyframe_prompts
  ) {
    throw new Error("Create Keyframe Prompts first before creating Kling prompts.");
  }

  if (project.kling_prompts_prompt) {
    return project;
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    kling_prompts_prompt: buildKlingPromptsPrompt(
      project,
      selectedIdea,
      project.script_generation,
      project.edited_voiceover,
      project.subject_design,
      project.design_image_prompts,
      project.scene_board,
      project.keyframe_prompts,
    ),
    kling_prompts_prompt_updated_at: timestamp,
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function saveKlingPromptsPrompt(projectId: string, prompt: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);

  if (
    !selectedIdea ||
    !project.script_generation ||
    !project.subject_design ||
    !project.scene_board ||
    !project.keyframe_prompts
  ) {
    throw new Error("Create Keyframe Prompts first before creating Kling prompts.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    kling_prompts_prompt: prompt,
    kling_prompts_prompt_updated_at: timestamp,
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function resetKlingPromptsPrompt(projectId: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const selectedIdea = getSelectedIdea(project);

  if (
    !selectedIdea ||
    !project.script_generation ||
    !project.subject_design ||
    !project.scene_board ||
    !project.keyframe_prompts
  ) {
    throw new Error("Create Keyframe Prompts first before creating Kling prompts.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    kling_prompts_prompt: buildKlingPromptsPrompt(
      project,
      selectedIdea,
      project.script_generation,
      project.edited_voiceover,
      project.subject_design,
      project.design_image_prompts,
      project.scene_board,
      project.keyframe_prompts,
    ),
    kling_prompts_prompt_updated_at: timestamp,
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function saveKlingPrompts(
  projectId: string,
  klingPrompts: KlingPromptsJson,
  source: "generated" | "uploaded" | "pasted",
) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  if (!project.keyframe_prompts || !project.script_generation || !getSelectedIdea(project)) {
    throw new Error("Create Keyframe Prompts first before saving Kling prompts.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    kling_prompts: klingPrompts,
    kling_prompts_source: source,
    test_scene_review: null,
    export_ready_at: null,
    export_notes: null,
    status: "kling_prompts_ready",
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function saveTestSceneReview(
  projectId: string,
  review: SaveTestSceneReviewInput,
) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  if (!project.kling_prompts) {
    throw new Error("Create Kling prompts first before reviewing a test scene.");
  }

  const sceneExists = project.kling_prompts.prompts.some(
    (prompt) => prompt.scene_number === review.scene_number,
  );

  if (!sceneExists) {
    throw new Error("Selected test scene does not exist in this project's Kling prompts.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    test_scene_review: {
      ...review,
      reviewed_at: timestamp,
    },
    export_ready_at: null,
    export_notes: null,
    status: "test_scene_review",
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function finalizeProjectExport(projectId: string, exportNotes: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  if (!project.kling_prompts || !project.test_scene_review) {
    throw new Error("Complete Kling prompts and Test Scene Review before final export.");
  }

  if (project.test_scene_review.decision !== "approved_for_full_production") {
    throw new Error("Approve the test scene before marking the project ready for export.");
  }

  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    export_ready_at: timestamp,
    export_notes: exportNotes,
    status: "ready_for_export",
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}

export async function saveExportNotes(projectId: string, exportNotes: string) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    return null;
  }

  const project = projects[index];
  const timestamp = new Date().toISOString();
  const nextProject: Project = {
    ...project,
    export_notes: exportNotes,
    updated_at: timestamp,
  };

  projects[index] = ProjectSchema.parse(nextProject);
  await writeProjects(projects);
  return projects[index];
}
