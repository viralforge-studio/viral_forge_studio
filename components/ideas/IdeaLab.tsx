"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, Rows3, Sparkles } from "lucide-react";

import { JsonViewer } from "@/components/common/JsonViewer";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import { IdeaJsonPasteDialog } from "@/components/ideas/IdeaJsonPasteDialog";
import { IdeaJsonUpload } from "@/components/ideas/IdeaJsonUpload";
import { StickyActionBar } from "@/components/common/StickyActionBar";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type Project } from "@/lib/schemas/project";

export function IdeaLab({ project }: { project: Project }) {
  const router = useRouter();
  const [currentProject, setCurrentProject] = useState(project);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [compactMode, setCompactMode] = useState(true);

  const ideaGeneration = currentProject.idea_generation;
  const selectedIdeaId = currentProject.selected_idea_id;
  const meta = ideaGeneration?.meta;
  const canRegenerate = Boolean(ideaGeneration);
  const ideas = useMemo(() => ideaGeneration?.ideas ?? [], [ideaGeneration]);

  async function refreshProject() {
    const response = await fetch(`/api/projects/${currentProject.id}`);
    const nextProject = (await response.json()) as Project;
    setCurrentProject(nextProject);
    startTransition(() => router.refresh());
  }

  async function handleGenerate() {
    setIsGenerating(true);
    setError(null);
    setMessage(null);

    const response = await fetch(`/api/projects/${currentProject.id}/generate-ideas`, {
      method: "POST",
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Idea generation failed.");
      setIsGenerating(false);
      return;
    }

    setCurrentProject(data);
    setMessage("Ideas generated and saved to the project.");
    setIsGenerating(false);
    startTransition(() => router.refresh());
  }

  async function handleSelect(ideaId: string) {
    setError(null);
    setMessage(null);

    const response = await fetch(`/api/projects/${currentProject.id}/select-idea`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea_id: ideaId }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to save selected idea.");
      return;
    }

    setCurrentProject(data);
    setMessage("Idea selected and saved.");
    startTransition(() => router.refresh());
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="space-y-2">
            <CardTitle>Idea Lab</CardTitle>
            <p className="max-w-2xl text-sm leading-7 text-slate-300">
              Generate ideas cheaply in text first, compare them visually, and let a human decide
              which concept is worth taking deeper into the pipeline.
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <StickyActionBar>
            <Button onClick={handleGenerate} disabled={isGenerating}>
              <Sparkles className="size-4" />
              {isGenerating ? "Generating..." : "Generate Ideas"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleGenerate}
              disabled={isGenerating || !canRegenerate}
            >
              Regenerate Ideas
            </Button>
            <IdeaJsonUpload projectId={currentProject.id} onUploaded={refreshProject} />
            <IdeaJsonPasteDialog projectId={currentProject.id} onUploaded={refreshProject} />
            <Button variant="secondary" onClick={() => setShowRawJson((current) => !current)}>
              {showRawJson ? "Hide Raw JSON" : "Show Raw JSON"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCompactMode((current) => !current)}
            >
              {compactMode ? <Rows3 className="size-4" /> : <LayoutGrid className="size-4" />}
              {compactMode ? "Expanded Cards" : "Compact Cards"}
            </Button>
          </StickyActionBar>

          {message ? (
            <Alert className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">
              {message}
            </Alert>
          ) : null}
          {error ? (
            <Alert className="border-rose-400/25 bg-rose-400/10 text-rose-100">
              {error}
            </Alert>
          ) : null}
          <div className="rounded-2xl border border-white/10 bg-white/4 p-4 text-sm text-slate-300">
            Same validation and rendering path for generated, uploaded, or pasted ideas.
          </div>
        </CardContent>
      </Card>

      {meta ? (
        <Card>
          <CardHeader>
            <CardTitle>Meta Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <MetaStat label="Ideas" value={`${meta.total_ideas}`} />
            <MetaStat label="Average Viral Score" value={meta.average_viral_score} />
            <MetaStat label="Budget Total" value={meta.budget_total} />
            <MetaStat label="Most Viral Idea" value={meta.most_viral_idea} />
            <div className="md:col-span-4">
              <Separator className="mb-4" />
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                Recommendation
              </p>
              <p className="text-sm leading-7 text-slate-200">
                {meta.production_recommendation}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {ideas.length > 0 ? (
        <div className="grid gap-6">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              selected={idea.id === selectedIdeaId}
              recommended={idea.id === meta?.most_viral_idea}
              compact={compactMode}
              onSelect={handleSelect}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-slate-300">
            Generate ideas or upload a valid `idea_generation.json` file to start review.
          </CardContent>
        </Card>
      )}

      {showRawJson && ideaGeneration ? <JsonViewer value={ideaGeneration} /> : null}

      {ideaGeneration ? (
        <div className="flex flex-wrap gap-2">
          {ideaGeneration.ideas.map((idea) => (
            <Badge key={idea.id} variant={idea.id === selectedIdeaId ? "success" : "default"}>
              {idea.id}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MetaStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
