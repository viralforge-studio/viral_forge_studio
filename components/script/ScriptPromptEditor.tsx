"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Maximize2, Minimize2, Save, Sparkles } from "lucide-react";

import { CopyButton } from "@/components/common/CopyButton";
import { StickyActionBar } from "@/components/common/StickyActionBar";
import { ScriptJsonPasteDialog } from "@/components/script/ScriptJsonPasteDialog";
import { ScriptJsonUpload } from "@/components/script/ScriptJsonUpload";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { formatDateTime } from "@/lib/utils/dates";

type PromptHeight = "normal" | "tall" | "fullscreen";

export function ScriptPromptEditor({
  project,
  selectedIdea,
  defaultPrompt,
}: {
  project: Project;
  selectedIdea: Idea | null;
  defaultPrompt: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [prompt, setPrompt] = useState(project.script_prompt ?? defaultPrompt ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [height, setHeight] = useState<PromptHeight>("tall");

  const isCustomized = Boolean(
    selectedIdea && defaultPrompt && prompt.trim() !== defaultPrompt.trim(),
  );

  if (!selectedIdea) {
    return (
      <Card>
        <CardContent className="p-8 text-slate-300">
          Select an idea first before creating a script prompt.
        </CardContent>
      </Card>
    );
  }

  async function savePrompt(nextPrompt: string) {
    setError(null);
    setMessage(null);

    const response = await fetch(`/api/projects/${project.id}/script-prompt`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ script_prompt: nextPrompt }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to save script prompt.");
      return null;
    }

    setMessage("Script prompt saved.");
    startTransition(() => router.refresh());
    return data as Project;
  }

  async function handleReset() {
    setError(null);
    setMessage(null);

    const response = await fetch(`/api/projects/${project.id}/script-prompt/reset`, {
      method: "POST",
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to reset script prompt.");
      return;
    }

    setPrompt(data.script_prompt ?? "");
    setMessage("Script prompt reset to the default builder output.");
    startTransition(() => router.refresh());
  }

  async function handleGenerateScript() {
    setError(null);
    setMessage(null);

    if ((project.script_prompt ?? "") !== prompt) {
      const saved = await savePrompt(prompt);
      if (!saved) return;
    }

    const response = await fetch(`/api/projects/${project.id}/generate-script`, {
      method: "POST",
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to generate script.");
      return;
    }

    setMessage("Script generated and saved.");
    router.push(`/projects/${project.id}?tab=script`);
    startTransition(() => router.refresh());
  }

  function handleImportedScript() {
    setMessage("Script JSON uploaded and validated successfully.");
    setError(null);
    router.push(`/projects/${project.id}?tab=script`);
    startTransition(() => router.refresh());
  }

  const textareaClass =
    height === "fullscreen"
      ? "min-h-[75vh]"
      : height === "tall"
        ? "min-h-[42rem]"
        : "min-h-[26rem]";

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="accent">Script Prompt</Badge>
                <Badge>{isCustomized ? "Manually customized" : "Default generated"}</Badge>
              </div>
              <CardTitle>{selectedIdea.title}</CardTitle>
            </div>
            <div className="text-right text-sm text-slate-500">
              <p>
                Last saved{" "}
                {project.script_prompt_updated_at
                  ? formatDateTime(project.script_prompt_updated_at)
                  : "Not yet"}
              </p>
            </div>
          </div>

          <details open className="rounded-2xl border border-white/10 bg-white/4 p-4">
            <summary className="cursor-pointer text-sm font-medium text-white">Context</summary>
            <div className="mt-4 grid gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Hook</p>
                <p className="mt-2 text-sm leading-7 text-slate-200">{selectedIdea.hook}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Concept</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">{selectedIdea.concept}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>Viral Score {selectedIdea.viral_score}/10</Badge>
                <Badge>{selectedIdea.success_likelihood} success likelihood</Badge>
                <Badge>{selectedIdea.kling_difficulty} Kling difficulty</Badge>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Target Comment Hook
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {selectedIdea.target_comment_hook}
                </p>
              </div>
            </div>
          </details>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Alert className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
            Prompt uses selected idea JSON plus viral mechanics, emotional triggers, original scene
            breakdown, and target comment hook.
          </Alert>
          <Alert className="border-white/10 bg-white/5 text-slate-200">
            Prompt shown and editable first, then generate, upload, or paste validated script JSON.
          </Alert>
          {isCustomized ? (
            <Alert className="border-amber-400/20 bg-amber-400/10 text-amber-100">
              Prompt customized for this project.
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

          <StickyActionBar>
            <Button onClick={() => void savePrompt(prompt)} disabled={isPending}>
              <Save className="size-4" />
              Save Prompt
            </Button>
            <Button variant="secondary" onClick={handleReset} disabled={isPending}>
              Reset to Default
            </Button>
            <CopyButton value={prompt} label="Copy Prompt" copiedLabel="Prompt Copied" />
            <Button variant="secondary" onClick={handleGenerateScript} disabled={isPending}>
              <Sparkles className="size-4" />
              Generate Script
            </Button>
            <ScriptJsonUpload projectId={project.id} onUploaded={handleImportedScript} />
            <ScriptJsonPasteDialog projectId={project.id} onUploaded={handleImportedScript} />
          </StickyActionBar>

          <div className="flex flex-wrap items-center gap-2">
            <Badge>Prompt source: {isCustomized ? "Customized" : "Default generated"}</Badge>
            <Button
              type="button"
              variant={height === "normal" ? "default" : "secondary"}
              size="sm"
              onClick={() => setHeight("normal")}
            >
              Normal
            </Button>
            <Button
              type="button"
              variant={height === "tall" ? "default" : "secondary"}
              size="sm"
              onClick={() => setHeight("tall")}
            >
              Tall
            </Button>
            <Button
              type="button"
              variant={height === "fullscreen" ? "default" : "secondary"}
              size="sm"
              onClick={() => setHeight("fullscreen")}
            >
              {height === "fullscreen" ? (
                <Maximize2 className="size-4" />
              ) : (
                <Minimize2 className="size-4" />
              )}
              Fullscreen
            </Button>
          </div>

          <details open className="grid gap-3 rounded-2xl border border-white/10 bg-white/4 p-4">
            <summary className="cursor-pointer text-sm font-medium text-white">Prompt</summary>
            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className={`${textareaClass} font-mono text-xs leading-6`}
            />
          </details>
        </CardContent>
      </Card>
    </div>
  );
}
