"use client";

import Link from "next/link";
import { useState } from "react";

import { CopyButton } from "@/components/common/CopyButton";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SceneBoardCard } from "@/components/scene-board/SceneBoardCard";
import { DependencyStatusPanel } from "@/components/workflow/DependencyStatusPanel";
import { SceneBoardJsonUpload } from "@/components/scene-board/SceneBoardJsonUpload";
import { SceneBoardPasteDialog } from "@/components/scene-board/SceneBoardPasteDialog";
import { SceneBoardPromptEditor } from "@/components/scene-board/SceneBoardPromptEditor";
import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { formatDateTime } from "@/lib/utils/dates";

function getSourceLabel(source: Project["scene_board_source"]) {
  if (source === "generated") return "Generated";
  if (source === "uploaded") return "Uploaded";
  if (source === "pasted") return "Pasted";
  return null;
}

export function SceneBoardPanel({
  project,
  selectedIdea,
  defaultPrompt,
}: {
  project: Project;
  selectedIdea: Idea | null;
  defaultPrompt: string | null;
}) {
  const [prompt, setPrompt] = useState(project.scene_board_prompt ?? defaultPrompt ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!project.subject_design) {
    return (
      <Card>
        <CardContent className="p-8 text-slate-300">
          Create Subject Design first before building the Scene Board.
        </CardContent>
      </Card>
    );
  }

  const sceneBoard = project.scene_board;
  const missingReferencePrompts = !project.design_image_prompts;
  const voiceover =
    project.edited_voiceover ??
    project.script_generation?.voiceover.clean_script ??
    project.script_generation?.full_voiceover ??
    "";

  async function savePrompt() {
    setIsSaving(true);
    setMessage(null);
    setError(null);
    const response = await fetch(`/api/projects/${project.id}/scene-board-prompt`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scene_board_prompt: prompt }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to save Scene Board prompt.");
      setIsSaving(false);
      return false;
    }
    setPrompt(data.scene_board_prompt ?? prompt);
    setMessage("Scene Board prompt saved.");
    setIsSaving(false);
    return true;
  }

  async function resetPrompt() {
    setIsResetting(true);
    setMessage(null);
    setError(null);
    const response = await fetch(`/api/projects/${project.id}/scene-board-prompt/reset`, {
      method: "POST",
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to reset Scene Board prompt.");
      setIsResetting(false);
      return;
    }
    setPrompt(data.scene_board_prompt ?? "");
    setMessage("Scene Board prompt reset to default.");
    setIsResetting(false);
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    window.setTimeout(() => setCopiedPrompt(false), 1800);
  }

  async function generateSceneBoard() {
    setIsGenerating(true);
    setMessage(null);
    setError(null);
    const hasSaved =
      prompt === (project.scene_board_prompt ?? defaultPrompt ?? "") || (await savePrompt());
    if (!hasSaved) {
      setIsGenerating(false);
      return;
    }
    const response = await fetch(`/api/projects/${project.id}/generate-scene-board`, {
      method: "POST",
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to generate Scene Board.");
      setIsGenerating(false);
      return;
    }
    setMessage("Scene Board generated and saved.");
    setIsGenerating(false);
    window.location.href = `/projects/${project.id}?tab=scene-board`;
  }

  function handleImported() {
    setMessage("Scene Board JSON saved successfully.");
    setError(null);
    window.location.href = `/projects/${project.id}?tab=scene-board`;
  }

  return (
    <div className="grid gap-6">
      <DependencyStatusPanel
        title="Scene Board Dependencies"
        items={[
          { label: "Script", available: Boolean(project.script_generation) },
          { label: "Subject Design", available: Boolean(project.subject_design) },
          {
            label: "Reference Image Prompts",
            available: Boolean(project.design_image_prompts),
          },
          { label: "Scene Board", available: Boolean(project.scene_board) },
          { label: "Keyframe Prompts", available: Boolean(project.keyframe_prompts) },
        ]}
        warning={
          missingReferencePrompts
            ? "Reference Image Prompts are missing. Scene Board can still be created, but later visual consistency may be weaker."
            : null
        }
      />
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="accent">Scene Board</Badge>
                {sceneBoard && project.scene_board_source ? (
                  <Badge>{getSourceLabel(project.scene_board_source)}</Badge>
                ) : null}
              </div>
              <CardTitle>{selectedIdea?.title ?? project.subject_design.source_script_title}</CardTitle>
            </div>
            {project.scene_board_prompt_updated_at ? (
              <p className="text-sm text-slate-500">
                Prompt updated {formatDateTime(project.scene_board_prompt_updated_at)}
              </p>
            ) : null}
          </div>
          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/4 p-4">
            <div className="flex flex-wrap gap-2">
              <Badge>{project.script_generation?.title ?? "Script ready"}</Badge>
              <Badge>{project.subject_design.main_subjects.length} subjects</Badge>
              <Badge>
                {project.design_image_prompts?.image_prompts.length ?? 0} reference prompts
              </Badge>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Context Summary</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Use the approved script, voiceover, subject design, and reference image prompts to
                plan each scene before exact keyframes or Kling prompts.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Voiceover Context</p>
              <p className="mt-2 line-clamp-4 text-sm leading-7 text-slate-300">{voiceover}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Alert className="border-white/10 bg-white/5 text-slate-200">
            This stage creates structured production planning only. No image generation, Kling API call, or video generation happens here.
          </Alert>
          {missingReferencePrompts ? (
            <Alert className="border-amber-400/20 bg-amber-400/10 text-amber-100">
              Reference Image Prompts are missing. This project can continue, but scene planning
              will be stronger if reusable visual references are created first.
            </Alert>
          ) : null}
          {message ? (
            <Alert className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">{message}</Alert>
          ) : null}
          {error ? (
            <Alert className="border-rose-400/20 bg-rose-400/10 text-rose-100">{error}</Alert>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Badge>
              Prompt source:{" "}
              {defaultPrompt && prompt.trim() !== defaultPrompt.trim() ? "Customized" : "Default generated"}
            </Badge>
          </div>
          <SceneBoardPromptEditor
            value={prompt}
            onChange={setPrompt}
            onSave={() => void savePrompt()}
            onReset={() => void resetPrompt()}
            onGenerate={() => void generateSceneBoard()}
            onCopy={() => void copyPrompt()}
            copied={copiedPrompt}
            isSaving={isSaving}
            isResetting={isResetting}
            isGenerating={isGenerating}
          />
          <div className="flex flex-wrap gap-3">
            <SceneBoardJsonUpload projectId={project.id} onUploaded={handleImported} />
            <SceneBoardPasteDialog projectId={project.id} onUploaded={handleImported} />
            {missingReferencePrompts ? (
              <Link href={`/projects/${project.id}?tab=design-image-prompts`}>
                <Button variant="secondary">Create Reference Image Prompts</Button>
              </Link>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {sceneBoard ? (
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle>Scene Board Output</CardTitle>
                <p className="text-sm leading-7 text-slate-300">{sceneBoard.board_goal}</p>
              </div>
              <CopyButton value={JSON.stringify(sceneBoard, null, 2)} label="Copy Full JSON" copiedLabel="JSON Copied" />
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-4 xl:grid-cols-2">
              {sceneBoard.scenes.map((scene) => (
                <SceneBoardCard key={scene.scene_number} scene={scene} />
              ))}
            </div>
            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/4 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Global Continuity Rules</p>
              <div className="flex flex-wrap gap-2">
                {sceneBoard.global_continuity_rules.map((rule) => (
                  <Badge key={rule}>{rule}</Badge>
                ))}
              </div>
              <p className="text-sm text-slate-300">
                Recommended test scene: Scene {sceneBoard.recommended_test_scene}
              </p>
              <p className="text-sm leading-7 text-slate-300">{sceneBoard.why_test_this_scene_first}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/4 p-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span>Show Raw JSON</span>
                <button
                  type="button"
                  onClick={() => setShowRawJson((current) => !current)}
                  className={["relative h-6 w-11 rounded-full transition-colors", showRawJson ? "bg-cyan-300" : "bg-white/15"].join(" ")}
                >
                  <span
                    className={["absolute top-1 size-4 rounded-full bg-slate-950 transition-transform", showRawJson ? "translate-x-6" : "translate-x-1"].join(" ")}
                  />
                </button>
              </div>
            </div>
            {showRawJson ? (
              <pre className="max-h-[32rem] overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-6 text-cyan-100">
                <code>{JSON.stringify(sceneBoard, null, 2)}</code>
              </pre>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
