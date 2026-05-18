"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/common/CopyButton";
import { type Project } from "@/lib/schemas/project";

const decisionOptions = [
  { value: "approved_for_full_production", label: "Approved for full production" },
  { value: "revise_kling_prompt", label: "Revise Kling prompt" },
  { value: "revise_keyframes", label: "Revise keyframes" },
  { value: "revise_scene_board", label: "Revise scene board" },
  { value: "revise_subject_design", label: "Revise subject design" },
] as const;

function linesToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function TestSceneReviewPanel({ project }: { project: Project }) {
  const recommendedSceneNumber = project.kling_prompts?.recommended_test_scene ?? 1;
  const existing = project.test_scene_review;
  const [sceneNumber, setSceneNumber] = useState(existing?.scene_number ?? recommendedSceneNumber);
  const [score, setScore] = useState(existing?.score ?? 8);
  const [decision, setDecision] = useState(
    existing?.decision ?? "approved_for_full_production",
  );
  const [videoReference, setVideoReference] = useState(existing?.video_reference ?? "");
  const [strengths, setStrengths] = useState(existing?.strengths.join("\n") ?? "");
  const [issues, setIssues] = useState(existing?.issues.join("\n") ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const scenePrompt = useMemo(
    () =>
      project.kling_prompts?.prompts.find((prompt) => prompt.scene_number === sceneNumber) ??
      null,
    [project.kling_prompts, sceneNumber],
  );

  if (!project.kling_prompts) {
    return (
      <Card>
        <CardContent className="p-8 text-slate-300">
          Create Kling prompts before reviewing a test scene.
        </CardContent>
      </Card>
    );
  }

  async function saveReview() {
    setIsSaving(true);
    setMessage(null);
    setError(null);

    const response = await fetch(`/api/projects/${project.id}/test-scene-review`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scene_number: sceneNumber,
        score,
        decision,
        video_reference: videoReference,
        strengths: linesToList(strengths),
        issues: linesToList(issues),
        notes,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to save test scene review.");
      setIsSaving(false);
      return;
    }

    setMessage("Test scene review saved.");
    setIsSaving(false);
    window.location.href = `/projects/${project.id}?tab=test-scene-review`;
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="accent">Test Scene Review</Badge>
              <CardTitle>Validate one scene before full production</CardTitle>
              <p className="text-sm leading-7 text-slate-300">
                Score the recommended test render, capture issues, and decide whether to export the production package.
              </p>
            </div>
            <Badge>Recommended scene {recommendedSceneNumber}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5">
          {message ? <Alert className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">{message}</Alert> : null}
          {error ? <Alert className="border-rose-400/20 bg-rose-400/10 text-rose-100">{error}</Alert> : null}
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Scene Number">
              <select
                value={sceneNumber}
                onChange={(event) => setSceneNumber(Number(event.target.value))}
                className="h-11 rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm text-white outline-none focus-visible:border-cyan-300/50"
              >
                {project.kling_prompts.prompts.map((prompt) => (
                  <option key={prompt.scene_number} value={prompt.scene_number}>
                    Scene {prompt.scene_number} - {prompt.scene_role}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Score">
              <Input
                type="number"
                min={1}
                max={10}
                value={score}
                onChange={(event) => setScore(Number(event.target.value))}
              />
            </Field>
            <Field label="Decision">
              <select
                value={decision}
                onChange={(event) => setDecision(event.target.value as typeof decision)}
                className="h-11 rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm text-white outline-none focus-visible:border-cyan-300/50"
              >
                {decisionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Video Reference">
            <Input
              value={videoReference}
              onChange={(event) => setVideoReference(event.target.value)}
              placeholder="Filename, URL, or external generation note"
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Strengths">
              <Textarea
                value={strengths}
                onChange={(event) => setStrengths(event.target.value)}
                className="min-h-[140px]"
                placeholder="One strength per line"
              />
            </Field>
            <Field label="Issues">
              <Textarea
                value={issues}
                onChange={(event) => setIssues(event.target.value)}
                className="min-h-[140px]"
                placeholder="One issue per line"
              />
            </Field>
          </div>
          <Field label="Review Notes">
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="min-h-[140px]"
              placeholder="What should be kept, fixed, or watched before full production?"
            />
          </Field>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={() => void saveReview()} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Test Review"}
            </Button>
            {decision === "approved_for_full_production" ? (
              <Link href={`/projects/${project.id}?tab=export`}>
                <Button type="button" variant="secondary">Continue to Export</Button>
              </Link>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {scenePrompt ? (
        <Card>
          <CardHeader>
            <CardTitle>Scene {scenePrompt.scene_number} Test Prompt</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-sm leading-7 text-slate-300">{scenePrompt.kling_prompt}</p>
            <p className="text-sm leading-7 text-rose-100">Negative: {scenePrompt.negative_prompt}</p>
            <div className="flex flex-wrap gap-3">
              <CopyButton value={scenePrompt.kling_prompt} label="Copy Kling Prompt" />
              <CopyButton value={scenePrompt.negative_prompt} label="Copy Negative Prompt" />
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
