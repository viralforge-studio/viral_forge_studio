import { type ProjectStatus, type Project } from "@/lib/schemas/project";

export const workflowTabs = [
  { key: "brief", label: "Brief", enabled: true, group: "Setup" },
  { key: "idea-lab", label: "Idea Lab", enabled: true, group: "Setup" },
  { key: "selected-idea", label: "Selected Idea", enabled: true, group: "Setup" },
  { key: "script-prompt", label: "Script Prompt", enabled: true, group: "Writing" },
  { key: "script", label: "Script", enabled: true, group: "Writing" },
  { key: "voiceover", label: "Voiceover", enabled: true, group: "Writing" },
  {
    key: "subject-design-prompt",
    label: "Subject Design Prompt",
    enabled: true,
    group: "Design",
  },
  { key: "subject-design", label: "Subject Design", enabled: true, group: "Design" },
  {
    key: "design-image-prompts",
    label: "Reference Image Prompts",
    enabled: true,
    group: "Design",
  },
  { key: "scene-board", label: "Scene Board", enabled: true, group: "Production" },
  {
    key: "keyframe-prompts",
    label: "Keyframe Prompts",
    enabled: true,
    group: "Production",
  },
  { key: "kling-prompts", label: "Kling Prompts", enabled: true, group: "Production" },
  {
    key: "test-scene-review",
    label: "Test Scene Review",
    enabled: false,
    group: "Production",
  },
  { key: "export", label: "Export", enabled: false, group: "Export" },
] as const;

export type WorkflowTabKey = (typeof workflowTabs)[number]["key"];

export const workflowTabGroups = workflowTabs.reduce<
  Array<{ label: string; tabs: Array<(typeof workflowTabs)[number]> }>
>((groups, tab) => {
  const existing = groups.find((group) => group.label === tab.group);

  if (existing) {
    existing.tabs.push(tab);
    return groups;
  }

  groups.push({ label: tab.group, tabs: [tab] });
  return groups;
}, []);

export const workflowSteps: Array<{
  label: string;
  status: ProjectStatus;
}> = [
  { label: "Brief Created", status: "brief_created" },
  { label: "Ideas Generated", status: "ideas_generated" },
  { label: "Idea Selected", status: "idea_selected" },
  { label: "Script Prompt Ready", status: "script_prompt_ready" },
  { label: "Script Generated", status: "script_generated" },
  { label: "Voiceover Reviewed", status: "voiceover_reviewed" },
  { label: "Subject Design Prompt Ready", status: "subject_design_prompt_ready" },
  { label: "Subject Design Ready", status: "subject_design_ready" },
  { label: "Reference Image Prompts Ready", status: "design_image_prompts_ready" },
  { label: "Scene Board Ready", status: "scene_board_ready" },
  { label: "Keyframe Prompts Ready", status: "keyframe_prompts_ready" },
  { label: "Kling Prompts Ready", status: "kling_prompts_ready" },
  { label: "Test Scene Review", status: "test_scene_review" },
  { label: "Ready for Export", status: "ready_for_export" },
];

export const statusLabels: Record<ProjectStatus, string> = {
  brief_created: "Brief Created",
  ideas_generated: "Ideas Generated",
  idea_selected: "Idea Selected",
  script_prompt_ready: "Script Prompt Ready",
  script_generated: "Script Generated",
  voiceover_reviewed: "Voiceover Reviewed",
  subject_design_prompt_ready: "Subject Design Prompt Ready",
  subject_design_ready: "Subject Design Ready",
  design_image_prompts_ready: "Reference Image Prompts Ready",
  scene_board_ready: "Scene Board Ready",
  keyframe_prompts_ready: "Keyframe Prompts Ready",
  kling_prompts_ready: "Kling Prompts Ready",
  test_scene_review: "Test Scene Review",
  ready_for_export: "Ready for Export",
};

export function isWorkflowTabAvailable(project: Project, tabKey: string) {
  switch (tabKey) {
    case "brief":
    case "idea-lab":
    case "selected-idea":
      return true;
    case "script-prompt":
      return Boolean(project.selected_idea_id);
    case "script":
      return Boolean(project.selected_idea_id);
    case "voiceover":
      return Boolean(project.script_generation);
    case "subject-design-prompt":
      return Boolean(project.script_generation);
    case "subject-design":
      return Boolean(project.script_generation);
    case "design-image-prompts":
      return Boolean(project.subject_design);
    case "scene-board":
      return Boolean(project.subject_design);
    case "keyframe-prompts":
      return Boolean(project.scene_board);
    case "kling-prompts":
      return Boolean(project.keyframe_prompts);
    default:
      return false;
  }
}

export function isWorkflowTabComplete(project: Project, tabKey: WorkflowTabKey) {
  switch (tabKey) {
    case "brief":
      return true;
    case "idea-lab":
      return Boolean(project.idea_generation);
    case "selected-idea":
      return Boolean(project.selected_idea_id);
    case "script-prompt":
      return Boolean(project.script_prompt);
    case "script":
      return Boolean(project.script_generation);
    case "voiceover":
      return Boolean(project.voiceover_updated_at || project.edited_voiceover);
    case "subject-design-prompt":
      return Boolean(project.subject_design_prompt);
    case "subject-design":
      return Boolean(project.subject_design);
    case "design-image-prompts":
      return Boolean(project.design_image_prompts);
    case "scene-board":
      return Boolean(project.scene_board);
    case "keyframe-prompts":
      return Boolean(project.keyframe_prompts);
    case "kling-prompts":
      return Boolean(project.kling_prompts);
    default:
      return false;
  }
}

export function getProjectNextStep(project: Project): {
  label: string;
  tab: WorkflowTabKey;
  description: string;
} {
  if (!project.idea_generation) {
    return {
      label: "Generate or upload ideas",
      tab: "idea-lab",
      description: "Start with five text ideas so you can compare concepts before spending time on prompts.",
    };
  }

  if (!project.selected_idea_id) {
    return {
      label: "Select an idea",
      tab: "selected-idea",
      description: "Choose the concept worth turning into a production-ready short.",
    };
  }

  if (!project.script_prompt) {
    return {
      label: "Build script prompt",
      tab: "script-prompt",
      description: "Review the generated prompt before creating or uploading the script JSON.",
    };
  }

  if (!project.script_generation) {
    return {
      label: "Generate or upload script",
      tab: "script",
      description: "Create the validated script package that powers every later stage.",
    };
  }

  if (!project.voiceover_updated_at && !project.edited_voiceover) {
    return {
      label: "Review voiceover",
      tab: "voiceover",
      description: "Edit the narration, notes, and pacing before design work begins.",
    };
  }

  if (!project.subject_design_prompt) {
    return {
      label: "Build subject design prompt",
      tab: "subject-design-prompt",
      description: "Review the design-spec prompt before generating or uploading subject design JSON.",
    };
  }

  if (!project.subject_design) {
    return {
      label: "Generate or upload subject design",
      tab: "subject-design",
      description: "Lock the main subject, environment, prop, and style system for the story.",
    };
  }

  if (
    !project.design_image_prompts &&
    (project.scene_board || project.keyframe_prompts || project.kling_prompts)
  ) {
    return {
      label: "Create Reference Image Prompts",
      tab: "design-image-prompts",
      description:
        "Reference Image Prompts are missing. This project already has later-stage prompts, but visual consistency may be weaker until reusable reference prompts are created.",
    };
  }

  if (!project.design_image_prompts) {
    return {
      label: "Create Reference Image Prompts",
      tab: "design-image-prompts",
      description:
        "Build reusable still-image reference prompts for the subject, environment, props, style, and key compositions.",
    };
  }

  if (!project.scene_board) {
    return {
      label: "Create Scene Board",
      tab: "scene-board",
      description: "Turn the script and design references into a per-scene production board.",
    };
  }

  if (!project.keyframe_prompts) {
    return {
      label: "Create Keyframe Prompts",
      tab: "keyframe-prompts",
      description: "Draft still-image opening and ending keyframe prompts for each scene.",
    };
  }

  if (!project.kling_prompts) {
    return {
      label: "Create Kling prompts",
      tab: "kling-prompts",
      description: "Build copyable scene-by-scene Kling prompt JSON for manual video generation.",
    };
  }

  return {
    label: "Review test scene",
    tab: "test-scene-review",
    description: "Use the recommended test scene to validate prompt quality before scaling production.",
  };
}

export function getCurrentStageLabel(project: Project, activeTab?: string) {
  if (activeTab) {
    const currentTab = workflowTabs.find((tab) => tab.key === activeTab);
    if (currentTab) {
      return currentTab.label;
    }
  }

  return getProjectNextStep(project).label;
}

export function hasMissingReferenceImagePromptsWarning(project: Project) {
  return Boolean(
    project.subject_design &&
      !project.design_image_prompts &&
      (project.scene_board || project.keyframe_prompts || project.kling_prompts),
  );
}

export function getProjectTemplateLabel(project: Pick<Project, "project_template">) {
  return project.project_template === "blank_custom"
    ? "Blank Custom Project"
    : "Future Files";
}
