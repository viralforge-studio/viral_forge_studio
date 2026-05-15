"use client";

import Link from "next/link";
import { useState } from "react";

import { CopyButton } from "@/components/common/CopyButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type Project } from "@/lib/schemas/project";
import { formatDateTime } from "@/lib/utils/dates";

export function ScriptPanel({ project }: { project: Project }) {
  const script = project.script_generation;
  const [showRawJson, setShowRawJson] = useState(false);

  if (!project.selected_idea_id) {
    return (
      <Card>
        <CardContent className="p-8 text-slate-300">
          Select an idea first before generating a script.
        </CardContent>
      </Card>
    );
  }

  if (!script) {
    return (
      <Card>
        <CardContent className="p-8 text-slate-300">
          No script generated yet. Review the Script Prompt tab and generate the script when ready.
        </CardContent>
      </Card>
    );
  }

  const scriptData = script;
  const recommendedScene = scriptData.scenes.find(
    (scene) => scene.scene_number === scriptData.production_notes.recommended_test_scene,
  );

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="accent">Script Output</Badge>
                {project.script_generation_source ? (
                  <Badge>
                    {project.script_generation_source === "generated"
                      ? "Generated"
                      : project.script_generation_source === "uploaded"
                        ? "Uploaded JSON"
                        : "Pasted JSON"}
                  </Badge>
                ) : null}
              </div>
              <CardTitle>{scriptData.title}</CardTitle>
            </div>
            <div className="flex flex-wrap gap-3">
              <CopyButton
                value={scriptData.voiceover.clean_script}
                label="Copy Voiceover"
                copiedLabel="Voiceover Copied"
              />
              <Link href={`/projects/${project.id}?tab=voiceover`}>
                <Button variant="secondary">Continue to Voiceover</Button>
              </Link>
            </div>
          </div>
          <p className="text-sm leading-7 text-slate-300">{scriptData.opening_hook}</p>
          <p className="text-sm text-slate-500">
            Generated {formatDateTime(scriptData.generation_timestamp)}
          </p>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Section label="Story Summary" value={scriptData.story_summary} />
          <Section label="Script Voice" value={scriptData.script_voice} />
          <Section label="Full Voiceover" value={scriptData.full_voiceover} />

          <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Voiceover Metadata
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge>{scriptData.voiceover.delivery_style}</Badge>
              <Badge>{scriptData.voiceover.pace}</Badge>
              <Badge>{scriptData.voiceover.estimated_word_count} words</Badge>
              <Badge>{scriptData.total_duration_sec}s total</Badge>
            </div>
            <div className="grid gap-2">
              {scriptData.voiceover.pause_notes.map((note) => (
                <p key={note} className="text-sm text-slate-300">
                  {note}
                </p>
              ))}
            </div>
          </div>

          {recommendedScene ? (
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/75">
                Recommended Test Scene
              </p>
              <p className="mt-2 text-sm font-medium text-cyan-50">
                Scene {recommendedScene.scene_number} · {recommendedScene.scene_role}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                {scriptData.production_notes.why_test_this_scene_first}
              </p>
            </div>
          ) : null}

          <div className="grid gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Generation Risks</p>
            <div className="grid gap-3 lg:grid-cols-3">
              {scriptData.production_notes.main_generation_risks.map((risk) => (
                <div key={risk} className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                  <p className="text-sm leading-7 text-amber-50">{risk}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Scenes</p>
            {scriptData.scenes.map((scene) => (
              <div
                key={scene.scene_number}
                className="rounded-2xl border border-white/10 bg-white/4 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge>Scene {scene.scene_number}</Badge>
                    <Badge>{scene.scene_role}</Badge>
                    <Badge>{scene.duration_sec}s</Badge>
                  </div>
                  <CopyButton
                    value={scene.narration}
                    label="Copy Narration"
                    copiedLabel="Narration Copied"
                    size="sm"
                  />
                </div>
                <div className="mt-4 grid gap-3 text-sm">
                  <Line label="Narration" value={scene.narration} />
                  <Line label="Visual Summary" value={scene.visual_summary} />
                  <Line label="Emotional Purpose" value={scene.emotional_purpose} />
                  <Line label="Visual Goal" value={scene.visual_goal} />
                  <Line label="Kling Risk Notes" value={scene.kling_risk_notes} />
                </div>
              </div>
            ))}
          </div>

          <Section
            label="Production Notes"
            value={JSON.stringify(scriptData.production_notes, null, 2)}
            mono
          />
          <Section label="Target Comment Hook" value={scriptData.target_comment_hook} />

          <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Next-Step Review Questions
            </p>
            <p className="text-sm text-slate-200">{scriptData.next_step.recommended_action}</p>
            {scriptData.next_step.review_questions.map((question) => (
              <p key={question} className="text-sm text-slate-300">
                {question}
              </p>
            ))}
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
            <div className="flex flex-wrap gap-3">
              <CopyButton
                value={JSON.stringify(scriptData, null, 2)}
                label="Copy Script JSON"
                copiedLabel="JSON Copied"
              />
            </div>
          </div>

          {showRawJson ? (
            <pre className="max-h-[32rem] overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-6 text-cyan-100">
              <code>{JSON.stringify(scriptData, null, 2)}</code>
            </pre>
          ) : null}
        </CardContent>
        <CardFooter className="justify-end">
          <Link href={`/projects/${project.id}?tab=voiceover`}>
            <Button variant="secondary">Continue to Voiceover</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

function Section({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p
        className={
          mono
            ? "whitespace-pre-wrap font-mono text-xs leading-6 text-slate-200"
            : "text-sm leading-7 text-slate-200"
        }
      >
        {value}
      </p>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-slate-300">
      <span className="font-medium text-slate-100">{label}:</span> {value}
    </p>
  );
}
