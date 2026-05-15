"use client";

import Link from "next/link";
import { useState } from "react";

import { CopyButton } from "@/components/common/CopyButton";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyframePromptCard } from "@/components/keyframe-prompts/KeyframePromptCard";
import { DependencyStatusPanel } from "@/components/workflow/DependencyStatusPanel";
import { KeyframePromptsJsonUpload } from "@/components/keyframe-prompts/KeyframePromptsJsonUpload";
import { KeyframePromptsPasteDialog } from "@/components/keyframe-prompts/KeyframePromptsPasteDialog";
import { KeyframePromptsPromptEditor } from "@/components/keyframe-prompts/KeyframePromptsPromptEditor";
import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { formatDateTime } from "@/lib/utils/dates";

function getSourceLabel(source: Project["keyframe_prompts_source"]) {
  if (source === "generated") return "Generated";
  if (source === "uploaded") return "Uploaded";
  if (source === "pasted") return "Pasted";
  return null;
}

export function KeyframePromptsPanel({
  project,
  selectedIdea,
  defaultPrompt,
}: {
  project: Project;
  selectedIdea: Idea | null;
  defaultPrompt: string | null;
}) {
  const [prompt, setPrompt] = useState(project.keyframe_prompts_prompt ?? defaultPrompt ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!project.scene_board) {
    return (
      <Card>
        <CardContent className="p-8 text-slate-300">
          Create Scene Board first before creating keyframe prompts.
        </CardContent>
      </Card>
    );
  }

  const keyframePrompts = project.keyframe_prompts;
  const missingReferencePrompts = !project.design_image_prompts;

  async function savePrompt() {
    setIsSaving(true);
    setMessage(null);
    setError(null);
    const response = await fetch(`/api/projects/${project.id}/keyframe-prompts-prompt`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyframe_prompts_prompt: prompt }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to save Keyframe Prompts prompt.");
      setIsSaving(false);
      return false;
    }
    setPrompt(data.keyframe_prompts_prompt ?? prompt);
    setMessage("Keyframe Prompts prompt saved.");
    setIsSaving(false);
    return true;
  }

  async function resetPrompt() {
    setIsResetting(true);
    setMessage(null);
    setError(null);
    const response = await fetch(`/api/projects/${project.id}/keyframe-prompts-prompt/reset`, { method: "POST" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to reset Keyframe Prompts prompt.");
      setIsResetting(false);
      return;
    }
    setPrompt(data.keyframe_prompts_prompt ?? "");
    setMessage("Keyframe Prompts prompt reset to default.");
    setIsResetting(false);
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    window.setTimeout(() => setCopiedPrompt(false), 1800);
  }

  async function generateKeyframePrompts() {
    setIsGenerating(true);
    setMessage(null);
    setError(null);
    const hasSaved =
      prompt === (project.keyframe_prompts_prompt ?? defaultPrompt ?? "") || (await savePrompt());
    if (!hasSaved) {
      setIsGenerating(false);
      return;
    }
    const response = await fetch(`/api/projects/${project.id}/generate-keyframe-prompts`, { method: "POST" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to generate Keyframe Prompts.");
      setIsGenerating(false);
      return;
    }
    setMessage("Keyframe Prompts generated and saved.");
    setIsGenerating(false);
    window.location.href = `/projects/${project.id}?tab=keyframe-prompts`;
  }

  function handleImported() {
    setMessage("Keyframe Prompts JSON saved successfully.");
    setError(null);
    window.location.href = `/projects/${project.id}?tab=keyframe-prompts`;
  }

  return (
    <div className="grid gap-6">
      <DependencyStatusPanel
        title="Keyframe Prompt Dependencies"
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
            ? "Reference Image Prompts are missing. This project already has or is creating scene-specific frames, but reusable reference prompts would improve consistency."
            : null
        }
      />
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="accent">Keyframe Prompts</Badge>
                {keyframePrompts && project.keyframe_prompts_source ? <Badge>{getSourceLabel(project.keyframe_prompts_source)}</Badge> : null}
              </div>
              <CardTitle>{selectedIdea?.title ?? project.scene_board.source_script_title}</CardTitle>
            </div>
            {project.keyframe_prompts_prompt_updated_at ? (
              <p className="text-sm text-slate-500">
                Prompt updated {formatDateTime(project.keyframe_prompts_prompt_updated_at)}
              </p>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Alert className="border-white/10 bg-white/5 text-slate-200">
            This stage creates still-image prompt JSON only. No images or video are generated here.
          </Alert>
          {missingReferencePrompts ? (
            <Alert className="border-amber-400/20 bg-amber-400/10 text-amber-100">
              Reference Image Prompts are missing. This project already has later-stage planning,
              but subject and environment consistency may be weaker.
            </Alert>
          ) : null}
          {message ? <Alert className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">{message}</Alert> : null}
          {error ? <Alert className="border-rose-400/20 bg-rose-400/10 text-rose-100">{error}</Alert> : null}
          <div className="flex flex-wrap gap-2">
            <Badge>Prompt source: {defaultPrompt && prompt.trim() !== defaultPrompt.trim() ? "Customized" : "Default generated"}</Badge>
          </div>
          <KeyframePromptsPromptEditor
            value={prompt}
            onChange={setPrompt}
            onSave={() => void savePrompt()}
            onReset={() => void resetPrompt()}
            onGenerate={() => void generateKeyframePrompts()}
            onCopy={() => void copyPrompt()}
            copied={copiedPrompt}
            isSaving={isSaving}
            isResetting={isResetting}
            isGenerating={isGenerating}
          />
          <div className="flex flex-wrap gap-3">
            <KeyframePromptsJsonUpload projectId={project.id} onUploaded={handleImported} />
            <KeyframePromptsPasteDialog projectId={project.id} onUploaded={handleImported} />
            {missingReferencePrompts ? (
              <Link href={`/projects/${project.id}?tab=design-image-prompts`}>
                <Button variant="secondary">Create Reference Image Prompts</Button>
              </Link>
            ) : null}
            {missingReferencePrompts && project.keyframe_prompts ? (
              <Link href={`/projects/${project.id}?tab=keyframe-prompts`}>
                <Button variant="secondary">Regenerate Keyframes after Reference Prompts</Button>
              </Link>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {keyframePrompts ? (
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle>Keyframe Prompt Output</CardTitle>
                <p className="text-sm leading-7 text-slate-300">{keyframePrompts.prompt_set_goal}</p>
              </div>
              <CopyButton value={JSON.stringify(keyframePrompts, null, 2)} label="Copy Full JSON" copiedLabel="JSON Copied" />
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Recommended Generation Order</p>
              <div className="flex flex-wrap gap-2">
                {keyframePrompts.recommended_generation_order.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {keyframePrompts.keyframes.map((keyframe) => (
                <KeyframePromptCard key={keyframe.scene_number} keyframe={keyframe} />
              ))}
            </div>
            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/4 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Global Negative Prompt</p>
              <p className="text-sm leading-7 text-slate-200">{keyframePrompts.global_negative_prompt}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/4 p-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span>Show Raw JSON</span>
                <button type="button" onClick={() => setShowRawJson((current) => !current)} className={["relative h-6 w-11 rounded-full transition-colors", showRawJson ? "bg-cyan-300" : "bg-white/15"].join(" ")}>
                  <span className={["absolute top-1 size-4 rounded-full bg-slate-950 transition-transform", showRawJson ? "translate-x-6" : "translate-x-1"].join(" ")} />
                </button>
              </div>
            </div>
            {showRawJson ? (
              <pre className="max-h-[32rem] overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-6 text-cyan-100">
                <code>{JSON.stringify(keyframePrompts, null, 2)}</code>
              </pre>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
