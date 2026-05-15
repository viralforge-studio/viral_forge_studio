"use client";

import Link from "next/link";
import { useState } from "react";

import { CopyButton } from "@/components/common/CopyButton";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KlingPromptCard } from "@/components/kling-prompts/KlingPromptCard";
import { DependencyStatusPanel } from "@/components/workflow/DependencyStatusPanel";
import { KlingPromptsJsonUpload } from "@/components/kling-prompts/KlingPromptsJsonUpload";
import { KlingPromptsPasteDialog } from "@/components/kling-prompts/KlingPromptsPasteDialog";
import { KlingPromptsPromptEditor } from "@/components/kling-prompts/KlingPromptsPromptEditor";
import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { formatDateTime } from "@/lib/utils/dates";

function getSourceLabel(source: Project["kling_prompts_source"]) {
  if (source === "generated") return "Generated";
  if (source === "uploaded") return "Uploaded";
  if (source === "pasted") return "Pasted";
  return null;
}

export function KlingPromptsPanel({
  project,
  selectedIdea,
  defaultPrompt,
}: {
  project: Project;
  selectedIdea: Idea | null;
  defaultPrompt: string | null;
}) {
  const [prompt, setPrompt] = useState(project.kling_prompts_prompt ?? defaultPrompt ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!project.keyframe_prompts) {
    return (
      <Card>
        <CardContent className="p-8 text-slate-300">
          Create Keyframe Prompts first before creating Kling prompts.
        </CardContent>
      </Card>
    );
  }

  const klingPrompts = project.kling_prompts;
  const missingReferencePrompts = !project.design_image_prompts;
  const recommendedTestScene =
    klingPrompts?.prompts.find((scenePrompt) => scenePrompt.scene_number === 3) ??
    klingPrompts?.prompts.find(
      (scenePrompt) => scenePrompt.scene_number === klingPrompts.recommended_test_scene,
    ) ??
    null;
  const recommendedTestSceneCombined = recommendedTestScene
    ? `${recommendedTestScene.kling_prompt}\n\nNegative prompt:\n${recommendedTestScene.negative_prompt}`
    : null;

  async function savePrompt() {
    setIsSaving(true);
    setMessage(null);
    setError(null);
    const response = await fetch(`/api/projects/${project.id}/kling-prompts-prompt`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kling_prompts_prompt: prompt }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to save Kling Prompts prompt.");
      setIsSaving(false);
      return false;
    }
    setPrompt(data.kling_prompts_prompt ?? prompt);
    setMessage("Kling Prompts prompt saved.");
    setIsSaving(false);
    return true;
  }

  async function resetPrompt() {
    setIsResetting(true);
    setMessage(null);
    setError(null);
    const response = await fetch(`/api/projects/${project.id}/kling-prompts-prompt/reset`, { method: "POST" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to reset Kling Prompts prompt.");
      setIsResetting(false);
      return;
    }
    setPrompt(data.kling_prompts_prompt ?? "");
    setMessage("Kling Prompts prompt reset to default.");
    setIsResetting(false);
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    window.setTimeout(() => setCopiedPrompt(false), 1800);
  }

  async function generateKlingPrompts() {
    setIsGenerating(true);
    setMessage(null);
    setError(null);
    const hasSaved =
      prompt === (project.kling_prompts_prompt ?? defaultPrompt ?? "") || (await savePrompt());
    if (!hasSaved) {
      setIsGenerating(false);
      return;
    }
    const response = await fetch(`/api/projects/${project.id}/generate-kling-prompts`, { method: "POST" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to generate Kling Prompts.");
      setIsGenerating(false);
      return;
    }
    setMessage("Kling Prompts generated and saved.");
    setIsGenerating(false);
    window.location.href = `/projects/${project.id}?tab=kling-prompts`;
  }

  function handleImported() {
    setMessage("Kling Prompts JSON saved successfully.");
    setError(null);
    window.location.href = `/projects/${project.id}?tab=kling-prompts`;
  }

  return (
    <div className="grid gap-6">
      <DependencyStatusPanel
        title="Kling Prompt Dependencies"
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
            ? "Reference Image Prompts are missing. This project already has later-stage prompts, but visual consistency may be weaker."
            : null
        }
      />
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="accent">Kling Prompts</Badge>
                {klingPrompts && project.kling_prompts_source ? <Badge>{getSourceLabel(project.kling_prompts_source)}</Badge> : null}
              </div>
              <CardTitle>{selectedIdea?.title ?? project.keyframe_prompts.source_script_title}</CardTitle>
            </div>
            {project.kling_prompts_prompt_updated_at ? (
              <p className="text-sm text-slate-500">
                Prompt updated {formatDateTime(project.kling_prompts_prompt_updated_at)}
              </p>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Alert className="border-white/10 bg-white/5 text-slate-200">
            This stage produces final copyable Kling prompt JSON only. No Kling API call or video generation happens here.
          </Alert>
          {missingReferencePrompts ? (
            <Alert className="border-amber-400/20 bg-amber-400/10 text-amber-100">
              Reference Image Prompts are missing. Use subject design, scene board, and keyframe
              prompts as the primary visual references for now, but consistency may improve if
              reference prompts are created first.
            </Alert>
          ) : null}
          {message ? <Alert className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">{message}</Alert> : null}
          {error ? <Alert className="border-rose-400/20 bg-rose-400/10 text-rose-100">{error}</Alert> : null}
          <div className="flex flex-wrap gap-2">
            <Badge>Prompt source: {defaultPrompt && prompt.trim() !== defaultPrompt.trim() ? "Customized" : "Default generated"}</Badge>
          </div>
          <KlingPromptsPromptEditor
            value={prompt}
            onChange={setPrompt}
            onSave={() => void savePrompt()}
            onReset={() => void resetPrompt()}
            onGenerate={() => void generateKlingPrompts()}
            onCopy={() => void copyPrompt()}
            copied={copiedPrompt}
            isSaving={isSaving}
            isResetting={isResetting}
            isGenerating={isGenerating}
          />
          <div className="flex flex-wrap gap-3">
            <KlingPromptsJsonUpload projectId={project.id} onUploaded={handleImported} />
            <KlingPromptsPasteDialog projectId={project.id} onUploaded={handleImported} />
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
            {missingReferencePrompts && project.kling_prompts ? (
              <Link href={`/projects/${project.id}?tab=kling-prompts`}>
                <Button variant="secondary">Regenerate Kling Prompts after Reference Prompts</Button>
              </Link>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {klingPrompts ? (
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle>Kling Prompt Output</CardTitle>
                <p className="text-sm leading-7 text-slate-300">{klingPrompts.prompt_set_goal}</p>
              </div>
              <CopyButton value={JSON.stringify(klingPrompts, null, 2)} label="Copy Full JSON" copiedLabel="JSON Copied" />
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/4 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Kling Model Notes</p>
              <p className="text-sm leading-7 text-slate-200">{klingPrompts.kling_model_notes}</p>
              <div className="flex flex-wrap gap-2">
                <Badge>Aspect ratio {klingPrompts.aspect_ratio}</Badge>
                <Badge>Recommended test scene {klingPrompts.recommended_test_scene}</Badge>
              </div>
            </div>
            {recommendedTestScene ? (
              <div className="grid gap-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/8 p-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/70">
                    Recommended Test Scene
                  </p>
                  <p className="text-lg font-semibold text-white">
                    Scene {recommendedTestScene.scene_number}
                  </p>
                  <p className="text-sm leading-7 text-slate-300">
                    {klingPrompts.why_test_this_scene_first}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/projects/${project.id}?tab=test-scene-review`}>
                    <Button>Continue to Test Scene Review</Button>
                  </Link>
                  <CopyButton
                    value={recommendedTestScene.kling_prompt}
                    label={`Copy Scene ${recommendedTestScene.scene_number} Kling Prompt`}
                    copiedLabel="Prompt Copied"
                  />
                  <CopyButton
                    value={recommendedTestScene.negative_prompt}
                    label={`Copy Scene ${recommendedTestScene.scene_number} Negative Prompt`}
                    copiedLabel="Negative Copied"
                  />
                  {recommendedTestSceneCombined ? (
                    <CopyButton
                      value={recommendedTestSceneCombined}
                      label={`Copy Scene ${recommendedTestScene.scene_number} Combined Prompt`}
                      copiedLabel="Combined Copied"
                    />
                  ) : null}
                </div>
              </div>
            ) : null}
            <div className="grid gap-4 xl:grid-cols-2">
              {klingPrompts.prompts.map((scenePrompt) => (
                <KlingPromptCard key={scenePrompt.scene_number} prompt={scenePrompt} />
              ))}
            </div>
            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/4 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Global Negative Prompt</p>
              <p className="text-sm leading-7 text-slate-200">{klingPrompts.global_negative_prompt}</p>
              <p className="text-sm leading-7 text-slate-300">{klingPrompts.why_test_this_scene_first}</p>
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
                <code>{JSON.stringify(klingPrompts, null, 2)}</code>
              </pre>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
