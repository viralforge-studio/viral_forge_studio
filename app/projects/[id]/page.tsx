import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/common/StatusBadge";
import { IdeaLab } from "@/components/ideas/IdeaLab";
import { SelectedIdeaPanel } from "@/components/ideas/SelectedIdeaPanel";
import { DesignImagePromptsPanel } from "@/components/design-image-prompts/DesignImagePromptsPanel";
import { ExportPanel } from "@/components/export/ExportPanel";
import { KeyframePromptsPanel } from "@/components/keyframe-prompts/KeyframePromptsPanel";
import { KlingPromptsPanel } from "@/components/kling-prompts/KlingPromptsPanel";
import { DeleteProjectButton } from "@/components/project/DeleteProjectButton";
import { SceneBoardPanel } from "@/components/scene-board/SceneBoardPanel";
import { ScriptPanel } from "@/components/script/ScriptPanel";
import { ScriptPromptEditor } from "@/components/script/ScriptPromptEditor";
import { SubjectDesignPanel } from "@/components/subject-design/SubjectDesignPanel";
import { SubjectDesignPromptEditor } from "@/components/subject-design/SubjectDesignPromptEditor";
import { TestSceneReviewPanel } from "@/components/test-scene-review/TestSceneReviewPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildDesignImagePromptsPrompt } from "@/lib/prompts/buildDesignImagePromptsPrompt";
import { buildKeyframePromptsPrompt } from "@/lib/prompts/buildKeyframePromptsPrompt";
import { buildKlingPromptsPrompt } from "@/lib/prompts/buildKlingPromptsPrompt";
import { buildSceneBoardPrompt } from "@/lib/prompts/buildSceneBoardPrompt";
import { VoiceoverPanel } from "@/components/voiceover/VoiceoverPanel";
import { WorkflowProgress } from "@/components/workflow/WorkflowProgress";
import { WorkflowSidebar } from "@/components/workflow/WorkflowSidebar";
import { buildScriptGenerationPrompt } from "@/lib/prompts/buildScriptGenerationPrompt";
import { buildSubjectDesignPrompt } from "@/lib/prompts/buildSubjectDesignPrompt";
import {
  ensureDesignImagePromptGenerationPrompt,
  ensureKeyframePromptsPrompt,
  ensureKlingPromptsPrompt,
  ensureSceneBoardPrompt,
  ensureSubjectDesignPrompt,
  getProjectById,
  getSelectedIdea,
} from "@/lib/storage/projects";
import { formatDateTime } from "@/lib/utils/dates";
import {
  getCurrentStageLabel,
  getProjectNextStep,
  getProjectTemplateLabel,
  hasMissingReferenceImagePromptsWarning,
  workflowTabs,
} from "@/lib/workflow";

const functionalTabs = new Set([
  "brief",
  "idea-lab",
  "selected-idea",
  "script-prompt",
  "script",
  "voiceover",
  "subject-design-prompt",
  "subject-design",
  "design-image-prompts",
  "scene-board",
  "keyframe-prompts",
  "kling-prompts",
  "test-scene-review",
  "export",
]);

export default async function ProjectWorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  let project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const activeTab = workflowTabs.some((item) => item.key === tab) ? tab ?? "brief" : "brief";

  if (
    activeTab === "subject-design-prompt" &&
    project.script_generation &&
    !project.subject_design_prompt
  ) {
    project = (await ensureSubjectDesignPrompt(id)) ?? project;
  }

  if (
    activeTab === "design-image-prompts" &&
    project.subject_design &&
    !project.design_image_prompt_generation_prompt
  ) {
    project = (await ensureDesignImagePromptGenerationPrompt(id)) ?? project;
  }

  if (activeTab === "scene-board" && project.subject_design && !project.scene_board_prompt) {
    project = (await ensureSceneBoardPrompt(id)) ?? project;
  }

  if (
    activeTab === "keyframe-prompts" &&
    project.scene_board &&
    !project.keyframe_prompts_prompt
  ) {
    project = (await ensureKeyframePromptsPrompt(id)) ?? project;
  }

  if (
    activeTab === "kling-prompts" &&
    project.keyframe_prompts &&
    !project.kling_prompts_prompt
  ) {
    project = (await ensureKlingPromptsPrompt(id)) ?? project;
  }

  const selectedIdea = getSelectedIdea(project);
  const defaultScriptPrompt = selectedIdea
    ? buildScriptGenerationPrompt(project, selectedIdea)
    : null;
  const defaultSubjectDesignPrompt =
    selectedIdea && project.script_generation
      ? buildSubjectDesignPrompt(
          project,
          selectedIdea,
          project.script_generation,
          project.edited_voiceover,
        )
      : null;
  const defaultDesignImagePromptsPrompt =
    selectedIdea && project.script_generation && project.subject_design
      ? buildDesignImagePromptsPrompt(
          project,
          selectedIdea,
          project.script_generation,
          project.edited_voiceover,
          project.subject_design,
        )
      : null;
  const defaultSceneBoardPrompt =
    selectedIdea && project.script_generation && project.subject_design
      ? buildSceneBoardPrompt(
          project,
          selectedIdea,
          project.script_generation,
          project.edited_voiceover,
          project.subject_design,
          project.design_image_prompts,
        )
      : null;
  const defaultKeyframePromptsPrompt =
    selectedIdea && project.script_generation && project.subject_design && project.scene_board
      ? buildKeyframePromptsPrompt(
          project,
          selectedIdea,
          project.script_generation,
          project.subject_design,
          project.design_image_prompts,
          project.scene_board,
        )
      : null;
  const defaultKlingPromptsPrompt =
    selectedIdea &&
    project.script_generation &&
    project.subject_design &&
    project.scene_board &&
    project.keyframe_prompts
      ? buildKlingPromptsPrompt(
          project,
          selectedIdea,
          project.script_generation,
          project.edited_voiceover,
          project.subject_design,
          project.design_image_prompts,
          project.scene_board,
          project.keyframe_prompts,
        )
      : null;
  const nextStep = getProjectNextStep(project);
  const hasReferenceWarning = hasMissingReferenceImagePromptsWarning(project);
  const currentStageLabel = getCurrentStageLabel(project, activeTab);
  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-8 px-6 py-10 lg:px-10">
      <section className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="accent">{project.channel_name}</Badge>
            <Badge>{getProjectTemplateLabel(project)}</Badge>
            <Badge variant="warning">Current Stage: {currentStageLabel}</Badge>
            <StatusBadge status={project.status} />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-white">
              {project.project_name}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-slate-300">
              Guided creative workflow for building a premium short-form future story without automating away human judgment.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <p>Created {formatDateTime(project.created_at)}</p>
            <p>Last updated {formatDateTime(project.updated_at)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/">
            <Button variant="secondary">Back to Dashboard</Button>
          </Link>
          <DeleteProjectButton
            projectId={project.id}
            projectName={project.project_name}
            redirectToHome
          />
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(8,15,30,0.94),rgba(14,165,233,0.08))] p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.26em] text-cyan-100/70">Next Step</p>
          <p className="text-lg font-semibold text-white">{nextStep.label}</p>
          <p className="max-w-3xl text-sm leading-7 text-slate-300">{nextStep.description}</p>
          {hasReferenceWarning ? (
            <p className="max-w-3xl text-sm leading-7 text-amber-200">
              Warning: Later-stage prompts already exist without Reference Image Prompts.
            </p>
          ) : null}
        </div>
        <Link href={`/projects/${project.id}?tab=${nextStep.tab}`}>
          <Button variant="secondary">Go to {nextStep.label}</Button>
        </Link>
      </section>

      <WorkflowProgress status={project.status} />

      <section className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <WorkflowSidebar project={project} activeTab={activeTab} />
        <div className="min-w-0">
          {activeTab === "brief" ? <BriefPanel project={project} /> : null}
          {activeTab === "idea-lab" ? <IdeaLab project={project} /> : null}
          {activeTab === "selected-idea" ? <SelectedIdeaPanel project={project} /> : null}
          {activeTab === "script-prompt" ? (
            <ScriptPromptEditor
              project={project}
              selectedIdea={selectedIdea}
              defaultPrompt={defaultScriptPrompt}
            />
          ) : null}
          {activeTab === "script" ? <ScriptPanel project={project} /> : null}
          {activeTab === "voiceover" ? <VoiceoverPanel project={project} /> : null}
          {activeTab === "subject-design-prompt" ? (
            <SubjectDesignPromptEditor
              project={project}
              selectedIdea={selectedIdea}
              scriptGeneration={project.script_generation}
              defaultPrompt={defaultSubjectDesignPrompt}
            />
          ) : null}
          {activeTab === "subject-design" ? <SubjectDesignPanel project={project} /> : null}
          {activeTab === "design-image-prompts" ? (
            <DesignImagePromptsPanel
              project={project}
              selectedIdea={selectedIdea}
              defaultPrompt={defaultDesignImagePromptsPrompt}
            />
          ) : null}
          {activeTab === "scene-board" ? (
            <SceneBoardPanel
              project={project}
              selectedIdea={selectedIdea}
              defaultPrompt={defaultSceneBoardPrompt}
            />
          ) : null}
          {activeTab === "keyframe-prompts" ? (
            <KeyframePromptsPanel
              project={project}
              selectedIdea={selectedIdea}
              defaultPrompt={defaultKeyframePromptsPrompt}
            />
          ) : null}
          {activeTab === "kling-prompts" ? (
            <KlingPromptsPanel
              project={project}
              selectedIdea={selectedIdea}
              defaultPrompt={defaultKlingPromptsPrompt}
            />
          ) : null}
          {activeTab === "test-scene-review" ? (
            <TestSceneReviewPanel project={project} />
          ) : null}
          {activeTab === "export" ? <ExportPanel project={project} /> : null}
          {!functionalTabs.has(activeTab) ? <ComingSoonPanel label={activeTab} /> : null}
        </div>
      </section>
    </main>
  );
}

function BriefPanel({
  project,
}: {
  project: NonNullable<Awaited<ReturnType<typeof getProjectById>>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Creative Brief</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-2">
        <Detail label="Template" value={getProjectTemplateLabel(project)} />
        <Detail label="Channel" value={project.channel_name} />
        <Detail label="Niche" value={project.niche} />
        <Detail label="Positioning" value={project.positioning} />
        <Detail label="Audience" value={project.audience} />
        <ListDetail label="Target Countries" items={project.target_countries} />
        <Detail label="Language" value={project.language} />
        <Detail label="Tone" value={project.tone} />
        <Detail label="Visual Style" value={project.visual_style} />
        <Detail label="Video Format" value={project.video_format} />
        <Detail label="Face Policy" value={project.face_policy || "Not set"} />
        <Detail label="CTA Style" value={project.cta_style || "Not set"} />
        <Detail label="Primary AI Video Tool" value={project.primary_ai_video_tool || "Not set"} />
        <Detail
          label="Image Generation Tool"
          value={project.image_generation_tool || "Not set"}
        />
        <Detail label="Budget Range" value={project.budget_range || "Not set"} />
        <Detail
          label="Reference Style Notes"
          value={project.reference_style_notes || "Not set"}
        />
        <Detail label="Target Duration" value={`${project.target_duration_seconds} seconds`} />
        <Detail label="Scene Count" value={`${project.scene_count}`} />
        <Detail label="Platform" value={project.platform} />
        <ListDetail label="Content Pillars" items={project.content_pillars} />
        <ListDetail label="Blocked Topics" items={project.blocked_topics} />
        <ListDetail
          label="Negative Visual Rules"
          items={project.negative_visual_rules}
        />
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/4 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="text-sm leading-7 text-slate-200">{value}</p>
    </div>
  );
}

function ListDetail({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/4 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">Not set</p>
      )}
    </div>
  );
}

function ComingSoonPanel({ label }: { label: string }) {
  const descriptions: Record<string, string> = {
    "scene-board":
      "Scene Board will turn the script, subject design, and reference image prompts into per-scene production planning.",
    "keyframe-prompts":
      "Keyframe Prompts will create still-image prompt pairs for each scene before any video generation.",
    "kling-prompts":
      "Kling Prompts will draft scene-by-scene video prompts with motion, camera movement, and continuity references.",
    "test-scene-review":
      "Test Scene Review will help you manually score a recommended test clip before scaling to the remaining scenes.",
    export:
      "Export will package the brief, prompts, JSON outputs, and manual checklists into a handoff bundle.",
  };

  return (
    <Card>
      <CardContent className="p-10">
        <p className="text-xl font-medium text-white">Coming soon</p>
        <p className="mt-2 text-slate-400">
          {descriptions[label] ?? `${label.replace(/-/g, " ")} will unlock in a later workflow gate.`}
        </p>
      </CardContent>
    </Card>
  );
}
