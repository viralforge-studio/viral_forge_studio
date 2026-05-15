import Link from "next/link";

import { DifficultyBadge } from "@/components/common/DifficultyBadge";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Project } from "@/lib/schemas/project";

export function SelectedIdeaPanel({ project }: { project: Project }) {
  const selectedIdea = project.idea_generation?.ideas.find(
    (idea) => idea.id === project.selected_idea_id,
  );

  if (!selectedIdea) {
    return (
      <Card>
        <CardContent className="p-8 text-slate-300">
          No idea selected yet. Go to Idea Lab and choose one.
        </CardContent>
      </Card>
    );
  }

  const selectionReason =
    project.idea_generation?.meta.most_viral_idea === selectedIdea.id
      ? "This idea is currently the meta recommendation based on the generated idea set."
      : "This idea was manually chosen by the creator as the best direction to develop further.";

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="accent">{selectedIdea.pillar}</Badge>
                <Badge variant="success">Decision Checkpoint</Badge>
              </div>
              <CardTitle className="text-2xl">{selectedIdea.title}</CardTitle>
            </div>
            <div className="flex flex-wrap gap-2">
              <ScoreBadge score={selectedIdea.viral_score} />
              <DifficultyBadge difficulty={selectedIdea.kling_difficulty} />
              <Badge variant="warning">{selectedIdea.production_budget}</Badge>
              <Badge>{selectedIdea.success_likelihood} success</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/75">
              Why this idea was selected
            </p>
            <p className="mt-2 text-sm leading-7 text-cyan-50">{selectionReason}</p>
          </div>
          <InfoBlock label="Hook" value={selectedIdea.hook} />
          <InfoBlock label="Concept" value={selectedIdea.concept} />
          <TokenBlock label="Emotional Triggers" items={selectedIdea.emotional_triggers} />
          <TokenBlock label="Virality Mechanics" items={selectedIdea.virality_mechanics} />
          <InfoBlock label="Voiceover Concept" value={selectedIdea.voiceover_concept} />
          <InfoBlock label="Why It Goes Viral" value={selectedIdea.why_it_goes_viral} />
          <InfoBlock label="Target Comment Hook" value={selectedIdea.target_comment_hook} />
          <InfoBlock label="Best Time to Post" value={selectedIdea.best_time_to_post} />
          <TokenBlock label="Secondary Platforms" items={selectedIdea.secondary_platforms} />
          <div className="grid gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Full Scene Breakdown
            </p>
            {selectedIdea.scene_breakdown.map((scene) => (
              <div
                key={scene.scene}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
              >
                <p className="font-medium text-white">
                  Scene {scene.scene} · {scene.duration_sec}s
                </p>
                <p className="mt-1">{scene.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {scene.kling_prompt_keywords.map((keyword) => (
                    <Badge key={keyword}>{keyword}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <TokenBlock label="Expected Comments" items={selectedIdea.expected_comments} />
        </CardContent>
      </Card>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/85 p-4 shadow-[0_18px_40px_rgba(2,6,23,0.36)] backdrop-blur">
        <Link href={`/projects/${project.id}?tab=idea-lab`}>
          <Button variant="secondary">Change Selected Idea</Button>
        </Link>
        <Link href={`/projects/${project.id}?tab=script-prompt`}>
          <Button>Continue to Script Prompt</Button>
        </Link>
      </div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="text-sm leading-7 text-slate-200">{value}</p>
    </div>
  );
}

function TokenBlock({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </div>
    </div>
  );
}
