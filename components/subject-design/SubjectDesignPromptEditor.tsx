"use client";

import { useState } from "react";
import { Maximize2, Minimize2, Save, Sparkles } from "lucide-react";

import { CopyButton } from "@/components/common/CopyButton";
import { StickyActionBar } from "@/components/common/StickyActionBar";
import { SubjectDesignJsonUpload } from "@/components/subject-design/SubjectDesignJsonUpload";
import { SubjectDesignPasteDialog } from "@/components/subject-design/SubjectDesignPasteDialog";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { formatDateTime } from "@/lib/utils/dates";

type PromptHeight = "normal" | "tall" | "fullscreen";

function detectStorySubjects(script: ScriptGeneration) {
  const text = `${script.title} ${script.story_summary} ${script.scenes
    .map((scene) => `${scene.visual_summary} ${scene.narration}`)
    .join(" ")}`.toLowerCase();

  const candidates = [
    text.includes("robot") ? "Robot" : null,
    text.includes("home") || text.includes("apartment") ? "Apartment / Home" : null,
    text.includes("door") ? "Door" : null,
    text.includes("silhouette") || text.includes("figure") ? "Mystery Figure" : null,
  ].filter(Boolean);

  return candidates.length > 0 ? candidates : ["Main story subject"];
}

export function SubjectDesignPromptEditor({
  project,
  selectedIdea,
  scriptGeneration,
  defaultPrompt,
}: {
  project: Project;
  selectedIdea: Idea | null;
  scriptGeneration: ScriptGeneration | null;
  defaultPrompt: string | null;
}) {
  const [prompt, setPrompt] = useState(project.subject_design_prompt ?? defaultPrompt ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [height, setHeight] = useState<PromptHeight>("tall");

  if (!selectedIdea || !scriptGeneration) {
    return (
      <Card>
        <CardContent className="p-8 text-slate-300">
          Generate or upload a script first before creating subject design prompts.
        </CardContent>
      </Card>
    );
  }

  const subjects = detectStorySubjects(scriptGeneration);
  const isCustomized = Boolean(defaultPrompt && prompt.trim() !== defaultPrompt.trim());

  async function savePrompt() {
    setIsSaving(true);
    setMessage(null);
    setError(null);
    const response = await fetch(`/api/projects/${project.id}/subject-design-prompt`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject_design_prompt: prompt }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to save subject design prompt.");
      setIsSaving(false);
      return false;
    }
    setMessage("Subject design prompt saved.");
    setIsSaving(false);
    return true;
  }

  async function resetPrompt() {
    setMessage(null);
    setError(null);
    const response = await fetch(`/api/projects/${project.id}/subject-design-prompt/reset`, {
      method: "POST",
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to reset subject design prompt.");
      return;
    }
    setPrompt(data.subject_design_prompt ?? "");
    setMessage("Subject design prompt reset to default.");
  }

  async function generateSubjectDesign() {
    setMessage(null);
    setError(null);

    if ((project.subject_design_prompt ?? "") !== prompt) {
      const saved = await savePrompt();
      if (!saved) return;
    }

    const response = await fetch(`/api/projects/${project.id}/generate-subject-design`, {
      method: "POST",
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to generate subject design.");
      return;
    }
    setMessage("Subject design generated and saved.");
    window.location.href = `/projects/${project.id}?tab=subject-design`;
  }

  function handleImported() {
    setMessage("Subject Design JSON uploaded and validated successfully.");
    setError(null);
    window.location.href = `/projects/${project.id}?tab=subject-design`;
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
                <Badge variant="accent">Subject Design Prompt</Badge>
                <Badge>{isCustomized ? "Manually customized" : "Default generated"}</Badge>
              </div>
              <CardTitle>{selectedIdea.title}</CardTitle>
            </div>
            <p className="text-sm text-slate-500">
              Last saved{" "}
              {project.subject_design_prompt_updated_at
                ? formatDateTime(project.subject_design_prompt_updated_at)
                : "Not yet"}
            </p>
          </div>
          <details open className="rounded-2xl border border-white/10 bg-white/4 p-4">
            <summary className="cursor-pointer text-sm font-medium text-white">Context</summary>
            <div className="mt-4 grid gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge>{scriptGeneration.title}</Badge>
                <Badge>{project.visual_style}</Badge>
                <Badge>{project.scene_count} scenes</Badge>
                {project.script_generation_source ? (
                  <Badge>
                    {project.script_generation_source === "generated"
                      ? "Generated Script"
                      : project.script_generation_source === "uploaded"
                        ? "Uploaded Script"
                        : "Pasted Script"}
                  </Badge>
                ) : null}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Opening Hook</p>
                <p className="mt-2 text-sm leading-7 text-slate-200">
                  {scriptGeneration.opening_hook}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Main Story Subjects Detected
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <Badge key={subject}>{subject}</Badge>
                  ))}
                </div>
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
          <Alert className="border-white/10 bg-white/5 text-slate-200">
            This stage creates visual design specs only. It does not generate images or Kling
            prompts.
          </Alert>
          <Alert className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
            Prompt uses the selected idea, script generation, final voiceover context, and the
            Future Files visual direction.
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
            <Button onClick={() => void savePrompt()} disabled={isSaving}>
              <Save className="size-4" />
              {isSaving ? "Saving..." : "Save Prompt"}
            </Button>
            <Button variant="secondary" onClick={resetPrompt}>
              Reset
            </Button>
            <CopyButton value={prompt} label="Copy Prompt" copiedLabel="Prompt Copied" />
            <Button variant="secondary" onClick={generateSubjectDesign}>
              <Sparkles className="size-4" />
              Generate Subject Design
            </Button>
            <SubjectDesignJsonUpload projectId={project.id} onUploaded={handleImported} />
            <SubjectDesignPasteDialog projectId={project.id} onUploaded={handleImported} />
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
