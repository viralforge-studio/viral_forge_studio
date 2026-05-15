"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { DifficultyBadge } from "@/components/common/DifficultyBadge";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type Idea } from "@/lib/schemas/ideas";
import { cn } from "@/lib/utils/cn";

export function IdeaCard({
  idea,
  selected,
  recommended,
  compact,
  onSelect,
}: {
  idea: Idea;
  selected: boolean;
  recommended?: boolean;
  compact: boolean;
  onSelect: (ideaId: string) => Promise<void>;
}) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [expanded, setExpanded] = useState(!compact);

  async function handleSelect() {
    setIsSelecting(true);
    try {
      await onSelect(idea.id);
    } finally {
      setIsSelecting(false);
    }
  }

  return (
    <Card
      className={cn(
        "transition-all",
        selected && "border-cyan-300/40 shadow-[0_0_0_1px_rgba(103,232,249,0.2),0_24px_60px_rgba(34,211,238,0.12)]",
      )}
    >
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="accent">{idea.pillar}</Badge>
              {recommended ? <Badge variant="success">Recommended</Badge> : null}
              {selected ? <Badge variant="warning">Selected</Badge> : null}
            </div>
            <CardTitle className="max-w-3xl text-xl">{idea.title}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <ScoreBadge score={idea.viral_score} />
            <DifficultyBadge difficulty={idea.kling_difficulty} />
            <Badge variant="default">Success {idea.success_likelihood}</Badge>
            <Badge variant="warning">{idea.production_budget}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <Section label="Hook" value={idea.hook} />
        <Section label="Short Concept" value={idea.concept} />
        <Section label="Why It Goes Viral" value={idea.why_it_goes_viral} />
        <div className="flex flex-wrap gap-2">
          {idea.emotional_triggers.map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
          {idea.virality_mechanics.map((item) => (
            <Badge key={item} variant="warning">
              {item}
            </Badge>
          ))}
        </div>

        {expanded ? (
          <div className="grid gap-5">
            <Section label="Voiceover Concept" value={idea.voiceover_concept} secondary />
            <div className="grid gap-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Full Scene Preview
              </p>
              <div className="grid gap-2">
                {idea.scene_breakdown.map((scene) => (
                  <div
                    key={scene.scene}
                    className="rounded-2xl border border-white/8 bg-white/4 p-3 text-sm text-slate-300"
                  >
                    <p className="font-medium text-slate-100">
                      Scene {scene.scene} · {scene.duration_sec}s
                    </p>
                    <p className="mt-1">{scene.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <TokenRow label="Expected Comments" items={idea.expected_comments} />
            <Section label="Target Comment Hook" value={idea.target_comment_hook} secondary />
            <TokenRow label="Secondary Platforms" items={idea.secondary_platforms} />
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => setExpanded((current) => !current)}>
          {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          {expanded ? "Collapse" : "Expand"}
        </Button>
        <Button onClick={handleSelect} disabled={selected || isSelecting}>
          {selected ? "Idea Selected" : isSelecting ? "Saving..." : "Select Idea"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function Section({
  label,
  value,
  secondary = false,
}: {
  label: string;
  value: string;
  secondary?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className={cn("text-sm leading-7 text-slate-200", secondary && "text-slate-300")}>
        {value}
      </p>
    </div>
  );
}

function TokenRow({ label, items }: { label: string; items: string[] }) {
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
