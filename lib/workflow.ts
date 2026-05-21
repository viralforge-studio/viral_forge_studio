import { type ProjectStatus, type Project } from "@/lib/schemas/project";
import { type TestSceneReviewDecision } from "@/lib/schemas/test-scene-review";

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
    enabled: true,
    group: "Production",
  },
  { key: "export", label: "Export", enabled: true, group: "Export" },
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

const revisionTargetTabByDecision: Record<TestSceneReviewDecision, WorkflowTabKey> = {
  approved_for_full_production: "export",
  revise_kling_prompt: "kling-prompts",
  revise_keyframes: "keyframe-prompts",
  revise_scene_board: "scene-board",
  revise_subject_design: "subject-design",
};

const readinessChecks: Array<{
  tab: WorkflowTabKey;
  label: string;
  points: number;
  isComplete: (project: Project) => boolean;
}> = [
  {
    tab: "selected-idea",
    label: "Selected Idea",
    points: 5,
    isComplete: (project) => Boolean(project.selected_idea_id),
  },
  {
    tab: "script-prompt",
    label: "Script Prompt",
    points: 5,
    isComplete: (project) => Boolean(project.script_prompt),
  },
  {
    tab: "script",
    label: "Script",
    points: 10,
    isComplete: (project) => Boolean(project.script_generation),
  },
  {
    tab: "voiceover",
    label: "Voiceover",
    points: 5,
    isComplete: (project) => Boolean(project.voiceover_updated_at || project.edited_voiceover),
  },
  {
    tab: "subject-design-prompt",
    label: "Subject Design Prompt",
    points: 5,
    isComplete: (project) => Boolean(project.subject_design_prompt),
  },
  {
    tab: "subject-design",
    label: "Subject Design",
    points: 15,
    isComplete: (project) => Boolean(project.subject_design),
  },
  {
    tab: "design-image-prompts",
    label: "Reference Image Prompts",
    points: 10,
    isComplete: (project) => Boolean(project.design_image_prompts),
  },
  {
    tab: "scene-board",
    label: "Scene Board",
    points: 10,
    isComplete: (project) => Boolean(project.scene_board),
  },
  {
    tab: "keyframe-prompts",
    label: "Keyframe Prompts",
    points: 10,
    isComplete: (project) => Boolean(project.keyframe_prompts),
  },
  {
    tab: "kling-prompts",
    label: "Kling Prompts",
    points: 10,
    isComplete: (project) => Boolean(project.kling_prompts),
  },
  {
    tab: "test-scene-review",
    label: "Test Scene Review",
    points: 10,
    isComplete: (project) => Boolean(project.test_scene_review),
  },
];

export type ProductionReadinessIssue = {
  tab: WorkflowTabKey;
  label: string;
  message: string;
};

export type ProductionReadinessLevel =
  | "building"
  | "needs_revision"
  | "ready";

export type ProductionReadinessReport = {
  score: number;
  completedChecks: number;
  totalChecks: number;
  level: ProductionReadinessLevel;
  canFinalizeExport: boolean;
  blockers: ProductionReadinessIssue[];
  warnings: ProductionReadinessIssue[];
  highlights: string[];
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function pushIfMissing(
  project: Project,
  collection: ProductionReadinessIssue[],
  params: {
    tab: WorkflowTabKey;
    label: string;
    message: string;
    whenMissing: boolean;
  },
) {
  if (params.whenMissing) {
    collection.push({
      tab: params.tab,
      label: params.label,
      message: params.message,
    });
  }
}

export function getRevisionTargetTab(
  decision: TestSceneReviewDecision | null | undefined,
): WorkflowTabKey {
  if (!decision) {
    return "test-scene-review";
  }

  return revisionTargetTabByDecision[decision];
}

export function getProductionReadiness(project: Project): ProductionReadinessReport {
  const completedChecks = readinessChecks.filter((item) => item.isComplete(project)).length;
  const totalChecks = readinessChecks.length;
  const baseScore = readinessChecks.reduce((sum, item) => {
    if (item.isComplete(project)) {
      return sum + item.points;
    }

    return sum;
  }, 0);

  const blockers: ProductionReadinessIssue[] = [];
  const warnings: ProductionReadinessIssue[] = [];
  const highlights: string[] = [];

  pushIfMissing(project, blockers, {
    tab: "selected-idea",
    label: "Selected Idea",
    message: "Choose one idea before generating the production package.",
    whenMissing: !project.selected_idea_id,
  });

  pushIfMissing(project, blockers, {
    tab: "script",
    label: "Script",
    message: "Generate or upload script JSON before final output.",
    whenMissing: !project.script_generation,
  });

  pushIfMissing(project, blockers, {
    tab: "subject-design",
    label: "Subject Design",
    message: "Generate or upload Subject Design so identity stays consistent.",
    whenMissing: !project.subject_design,
  });

  pushIfMissing(project, blockers, {
    tab: "scene-board",
    label: "Scene Board",
    message: "Create Scene Board so shot planning is defined per scene.",
    whenMissing: !project.scene_board,
  });

  pushIfMissing(project, blockers, {
    tab: "keyframe-prompts",
    label: "Keyframe Prompts",
    message: "Create Keyframe Prompts before final Kling prompt execution.",
    whenMissing: !project.keyframe_prompts,
  });

  pushIfMissing(project, blockers, {
    tab: "kling-prompts",
    label: "Kling Prompts",
    message: "Create Kling Prompts before running test-scene review or export.",
    whenMissing: !project.kling_prompts,
  });

  pushIfMissing(project, blockers, {
    tab: "test-scene-review",
    label: "Test Scene Review",
    message: "Save one test-scene review before marking the project ready for export.",
    whenMissing: !project.test_scene_review,
  });

  if (
    project.test_scene_review &&
    project.test_scene_review.decision !== "approved_for_full_production"
  ) {
    blockers.push({
      tab: getRevisionTargetTab(project.test_scene_review.decision),
      label: "Revision Required",
      message: `Test scene decision is "${project.test_scene_review.decision.replace(/_/g, " ")}". Resolve this stage first.`,
    });
  }

  if (hasMissingReferenceImagePromptsWarning(project)) {
    warnings.push({
      tab: "design-image-prompts",
      label: "Reference Image Prompts",
      message:
        "Later-stage prompts exist without Reference Image Prompts. Visual consistency may drift.",
    });
  }

  if (project.test_scene_review && project.test_scene_review.score <= 7) {
    warnings.push({
      tab: "test-scene-review",
      label: "Test Scene Score",
      message:
        "Test scene score is 7 or lower. Consider revising before scaling to all scenes.",
    });
  }

  if (
    project.test_scene_review &&
    project.test_scene_review.issues.length > project.test_scene_review.strengths.length
  ) {
    warnings.push({
      tab: getRevisionTargetTab(project.test_scene_review.decision),
      label: "Quality Risk",
      message:
        "Reported issues exceed strengths. Resolve consistency issues before full production.",
    });
  }

  if (project.design_image_prompts) {
    highlights.push("Reference image anchor prompts are available for identity consistency.");
  }

  if (project.keyframe_prompts) {
    highlights.push("Scene-by-scene keyframe anchors are ready for controlled motion planning.");
  }

  if (
    project.test_scene_review?.decision === "approved_for_full_production" &&
    project.test_scene_review.score >= 8
  ) {
    highlights.push(
      `Test scene approved with a strong score (${project.test_scene_review.score}/10).`,
    );
  }

  const canFinalizeExport = Boolean(
    project.kling_prompts &&
      project.test_scene_review &&
      project.test_scene_review.decision === "approved_for_full_production",
  );

  let score = baseScore;
  if (project.test_scene_review?.decision === "approved_for_full_production") {
    score += 3;
  }

  if (project.test_scene_review && project.test_scene_review.score >= 8) {
    score += 2;
  }

  if (project.test_scene_review && project.test_scene_review.score <= 5) {
    score -= 4;
  }

  if (
    project.test_scene_review &&
    project.test_scene_review.issues.length > project.test_scene_review.strengths.length
  ) {
    score -= 2;
  }

  score = clamp(score, 0, 100);

  const level: ProductionReadinessLevel = canFinalizeExport
    ? "ready"
    : project.test_scene_review &&
        project.test_scene_review.decision !== "approved_for_full_production"
      ? "needs_revision"
      : "building";

  return {
    score,
    completedChecks,
    totalChecks,
    level,
    canFinalizeExport,
    blockers,
    warnings,
    highlights,
  };
}

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
    case "test-scene-review":
      return Boolean(project.kling_prompts);
    case "export":
      return Boolean(project.test_scene_review);
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
    case "test-scene-review":
      return Boolean(project.test_scene_review);
    case "export":
      return Boolean(project.export_ready_at);
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

  if (!project.test_scene_review) {
    return {
      label: "Review test scene",
      tab: "test-scene-review",
      description: "Score the recommended test scene and decide whether the project is ready for full production.",
    };
  }

  if (!project.export_ready_at) {
    return {
      label: "Finalize export",
      tab: "export",
      description: "Package the brief, prompts, review notes, and production checklist into a handoff bundle.",
    };
  }

  return {
    label: "Export ready",
    tab: "export",
    description: "This project is ready to hand off for production or archive as a completed prompt package.",
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
