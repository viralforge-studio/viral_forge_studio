"use client";

import Link from "next/link";
import { useState } from "react";
import { RefreshCcw, Save } from "lucide-react";

import { CopyButton } from "@/components/common/CopyButton";
import { SceneNarrationList } from "@/components/voiceover/SceneNarrationList";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { type Project } from "@/lib/schemas/project";
import { formatDateTime } from "@/lib/utils/dates";

const WORDS_PER_SECOND = 2.3;

function getVoiceoverSource(project: Project) {
  if (!project.script_generation) {
    return "";
  }

  return (
    project.edited_voiceover ??
    project.script_generation.voiceover.clean_script ??
    project.script_generation.full_voiceover
  );
}

function getWordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function VoiceoverPanel({ project }: { project: Project }) {
  const script = project.script_generation;
  const [value, setValue] = useState(getVoiceoverSource(project));
  const [voiceoverNotes, setVoiceoverNotes] = useState(project.voiceover_notes ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  if (!script) {
    return (
      <Card>
        <CardContent className="p-8 text-slate-300">
          Generate or upload a script first before extracting voiceover.
        </CardContent>
      </Card>
    );
  }

  const scriptData = script;
  const wordCount = getWordCount(value);
  const estimatedDuration = Math.max(1, Math.round(wordCount / WORDS_PER_SECOND));

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    setError(null);

    const response = await fetch(`/api/projects/${project.id}/voiceover`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        edited_voiceover: value,
        voiceover_notes: voiceoverNotes || null,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to save edited voiceover.");
      setIsSaving(false);
      return;
    }

    setValue(data.edited_voiceover ?? value);
    setVoiceoverNotes(data.voiceover_notes ?? voiceoverNotes);
    setMessage("Edited voiceover saved.");
    setIsSaving(false);
  }

  async function handleReset() {
    setIsResetting(true);
    setMessage(null);
    setError(null);

    const response = await fetch(`/api/projects/${project.id}/voiceover/reset`, {
      method: "POST",
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to reset voiceover.");
      setIsResetting(false);
      return;
    }

    setValue(data.edited_voiceover ?? "");
    setMessage("Voiceover reset from script.");
    setIsResetting(false);
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="accent">Voiceover Workspace</Badge>
              <CardTitle>{scriptData.title}</CardTitle>
            </div>
            {project.voiceover_updated_at ? (
              <p className="text-sm text-slate-500">
                Voiceover updated {formatDateTime(project.voiceover_updated_at)}
              </p>
            ) : null}
          </div>
          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/4 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Opening Hook</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">{scriptData.opening_hook}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{wordCount} words</Badge>
              <Badge>{estimatedDuration}s estimated</Badge>
              <Badge>{scriptData.voiceover.delivery_style}</Badge>
              <Badge>{scriptData.voiceover.pace}</Badge>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Pause Notes</p>
              <div className="mt-2 grid gap-1">
                {scriptData.voiceover.pause_notes.map((note) => (
                  <p key={note} className="text-sm leading-7 text-slate-300">
                    {note}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Alert className="border-white/10 bg-white/5 text-slate-200">
            This stage extracts voiceover directly from script_generation for human review,
            editing, copying, and saving. No new AI call is required.
          </Alert>
          {message ? (
            <Alert className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">
              {message}
            </Alert>
          ) : null}
          {error ? (
            <Alert className="border-rose-400/20 bg-rose-400/10 text-rose-100">{error}</Alert>
          ) : null}
          <div className="grid gap-2">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Final Voiceover</p>
            <Textarea
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="min-h-[18rem] font-mono text-sm leading-7"
            />
          </div>
          <div className="grid gap-2">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Voiceover Notes</p>
            <Textarea
              value={voiceoverNotes}
              onChange={(event) => setVoiceoverNotes(event.target.value)}
              className="min-h-[8rem] text-sm leading-7"
              placeholder="Optional notes for pacing, delivery, or future TTS prep."
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <CopyButton value={value || scriptData.voiceover.clean_script} label="Copy Voiceover" />
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="size-4" />
              {isSaving ? "Saving..." : "Save Edited Voiceover"}
            </Button>
            <Button variant="secondary" onClick={handleReset} disabled={isResetting}>
              <RefreshCcw className="size-4" />
              {isResetting ? "Resetting..." : "Reset from Script"}
            </Button>
            <Button variant="secondary" disabled>
              Optimize Voiceover with AI - Coming Soon
            </Button>
          </div>
          <SceneNarrationList scenes={scriptData.scenes} />
        </CardContent>
        <CardFooter className="justify-end">
          <Link href={`/projects/${project.id}?tab=subject-design-prompt`}>
            <Button variant="secondary">Continue to Subject Design Prompt</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
