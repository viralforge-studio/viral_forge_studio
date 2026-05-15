"use client";

import { CopyButton } from "@/components/common/CopyButton";
import { Badge } from "@/components/ui/badge";
import { type ScriptGeneration } from "@/lib/schemas/script";

export function SceneNarrationList({
  scenes,
}: {
  scenes: ScriptGeneration["scenes"];
}) {
  return (
    <div className="grid gap-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
        Scene-by-Scene Narration
      </p>
      {scenes.map((scene) => (
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
              label="Copy Scene Narration"
              copiedLabel="Copied"
              size="sm"
            />
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-200">{scene.narration}</p>
        </div>
      ))}
    </div>
  );
}
