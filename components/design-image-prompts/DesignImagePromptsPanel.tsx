"use client";

import Link from "next/link";
import { useState } from "react";
import { CopyButton } from "@/components/common/CopyButton";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DesignImagePromptsJsonUpload } from "@/components/design-image-prompts/DesignImagePromptsJsonUpload";
import { DesignImagePromptsPasteDialog } from "@/components/design-image-prompts/DesignImagePromptsPasteDialog";
import { DesignImagePromptsPromptEditor } from "@/components/design-image-prompts/DesignImagePromptsPromptEditor";
import { ImagePromptCard } from "@/components/design-image-prompts/ImagePromptCard";
import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { formatDateTime } from "@/lib/utils/dates";

function getSourceLabel(source: Project["design_image_prompts_source"]) {
  if (source === "generated") return "Generated";
  if (source === "uploaded") return "Uploaded";
  if (source === "pasted") return "Pasted";
  return null;
}

export function DesignImagePromptsPanel({
  project,
  selectedIdea,
  defaultPrompt,
}: {
  project: Project;
  selectedIdea: Idea | null;
  defaultPrompt: string | null;
}) {
  const [prompt, setPrompt] = useState(
    project.design_image_prompt_generation_prompt ?? defaultPrompt ?? "",
  );
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
          Create or upload Subject Design first before creating reference image prompts.
        </CardContent>
      </Card>
    );
  }

  const designImagePrompts = project.design_image_prompts;
  const subjectDesign = project.subject_design;

  async function savePrompt() {
    setIsSaving(true);
    setMessage(null);
    setError(null);

    const response = await fetch(`/api/projects/${project.id}/design-image-prompts-prompt`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ design_image_prompt_generation_prompt: prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to save reference image prompts prompt.");
      setIsSaving(false);
      return false;
    }

    setPrompt(data.design_image_prompt_generation_prompt ?? prompt);
    setMessage("Reference image prompts prompt saved.");
    setIsSaving(false);
    return true;
  }

  async function resetPrompt() {
    setIsResetting(true);
    setMessage(null);
    setError(null);

    const response = await fetch(
      `/api/projects/${project.id}/design-image-prompts-prompt/reset`,
      {
        method: "POST",
      },
    );
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to reset reference image prompts prompt.");
      setIsResetting(false);
      return;
    }

    setPrompt(data.design_image_prompt_generation_prompt ?? "");
    setMessage("Reference image prompts prompt reset to default.");
    setIsResetting(false);
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    window.setTimeout(() => setCopiedPrompt(false), 1800);
  }

  async function generatePrompts() {
    setIsGenerating(true);
    setMessage(null);
    setError(null);

    const hasSavedPrompt =
      prompt === (project.design_image_prompt_generation_prompt ?? defaultPrompt ?? "") ||
      (await savePrompt());

    if (!hasSavedPrompt) {
      setIsGenerating(false);
      return;
    }

    const response = await fetch(`/api/projects/${project.id}/generate-design-image-prompts`, {
      method: "POST",
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to generate reference image prompts.");
      setIsGenerating(false);
      return;
    }

    setMessage("Reference image prompts generated and saved.");
    setIsGenerating(false);
    window.location.href = `/projects/${project.id}?tab=design-image-prompts`;
  }

  function handleImported() {
    setMessage("Reference image prompts JSON saved successfully.");
    setError(null);
    window.location.href = `/projects/${project.id}?tab=design-image-prompts`;
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="accent">Reference Image Prompts</Badge>
                {designImagePrompts && project.design_image_prompts_source ? (
                  <Badge>{getSourceLabel(project.design_image_prompts_source)}</Badge>
                ) : null}
              </div>
              <CardTitle>{selectedIdea?.title ?? subjectDesign.source_script_title}</CardTitle>
            </div>
            {project.design_image_prompt_generation_prompt_updated_at ? (
              <p className="text-sm text-slate-500">
                Prompt updated{" "}
                {formatDateTime(project.design_image_prompt_generation_prompt_updated_at)}
              </p>
            ) : null}
          </div>
          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/4 p-4">
            <div className="flex flex-wrap gap-2">
              <Badge>{subjectDesign.source_script_title}</Badge>
              <Badge>{subjectDesign.main_subjects.length} subjects</Badge>
              <Badge>{subjectDesign.environments.length} environments</Badge>
              <Badge>{subjectDesign.props.length} props</Badge>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Context Summary
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                {subjectDesign.visual_style_summary}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Design Goal
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                {subjectDesign.design_goal}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Alert className="border-white/10 bg-white/5 text-slate-200">
            This stage creates reusable asset reference prompts only. No scene-specific keyframes,
            no Kling motion, no video duration, and no final scene generation happens here.
          </Alert>
          {!designImagePrompts && (project.scene_board || project.keyframe_prompts || project.kling_prompts) ? (
            <Alert className="border-amber-400/20 bg-amber-400/10 text-amber-100">
              Reference Image Prompts are missing. This project already has later-stage prompts,
              but visual consistency may be weaker.
            </Alert>
          ) : null}
          {message ? (
            <Alert className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">
              {message}
            </Alert>
          ) : null}
          {error ? (
            <Alert className="border-rose-400/20 bg-rose-400/10 text-rose-100">{error}</Alert>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Badge>
              Prompt source:{" "}
              {defaultPrompt && prompt.trim() !== defaultPrompt.trim()
                ? "Customized"
                : "Default generated"}
            </Badge>
          </div>
          <DesignImagePromptsPromptEditor
            value={prompt}
            onChange={setPrompt}
            onSave={savePrompt}
            onReset={resetPrompt}
            onGenerate={generatePrompts}
            onCopy={copyPrompt}
            copied={copiedPrompt}
            isSaving={isSaving}
            isResetting={isResetting}
            isGenerating={isGenerating}
          />
          <div className="flex flex-wrap gap-3">
            <DesignImagePromptsJsonUpload projectId={project.id} onUploaded={handleImported} />
            <DesignImagePromptsPasteDialog projectId={project.id} onUploaded={handleImported} />
            {!designImagePrompts && project.keyframe_prompts ? (
              <Link href={`/projects/${project.id}?tab=keyframe-prompts`}>
                <Button variant="secondary">Regenerate Keyframes after Reference Prompts</Button>
              </Link>
            ) : null}
            {!designImagePrompts && project.kling_prompts ? (
              <Link href={`/projects/${project.id}?tab=kling-prompts`}>
                <Button variant="secondary">Regenerate Kling Prompts after Reference Prompts</Button>
              </Link>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {designImagePrompts ? (
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle>Prompt Set Output</CardTitle>
                <p className="text-sm leading-7 text-slate-300">
                  {designImagePrompts.prompt_set_goal}
                </p>
              </div>
              <CopyButton
                value={JSON.stringify(designImagePrompts, null, 2)}
                label="Copy Full JSON"
                copiedLabel="JSON Copied"
              />
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Recommended Generation Order
              </p>
              <div className="flex flex-wrap gap-2">
                {designImagePrompts.recommended_generation_order.map((promptId) => (
                  <Badge key={promptId}>{promptId}</Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {designImagePrompts.image_prompts.map((imagePrompt) => (
                <ImagePromptCard key={imagePrompt.id} imagePrompt={imagePrompt} />
              ))}
            </div>

            <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/4 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Global Negative Prompt
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-200">
                  {designImagePrompts.global_negative_prompt}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Human Review Questions
                </p>
                <div className="mt-2 grid gap-1">
                  {designImagePrompts.human_review.review_questions.map((question) => (
                    <p key={question} className="text-sm leading-7 text-slate-300">
                      {question}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/4 p-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span>Show Raw JSON</span>
                <button
                  type="button"
                  onClick={() => setShowRawJson((current) => !current)}
                  className={[
                    "relative h-6 w-11 rounded-full transition-colors",
                    showRawJson ? "bg-cyan-300" : "bg-white/15",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "absolute top-1 size-4 rounded-full bg-slate-950 transition-transform",
                      showRawJson ? "translate-x-6" : "translate-x-1",
                    ].join(" ")}
                  />
                </button>
              </div>
            </div>

            {showRawJson ? (
              <pre className="max-h-[32rem] overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-6 text-cyan-100">
                <code>{JSON.stringify(designImagePrompts, null, 2)}</code>
              </pre>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
