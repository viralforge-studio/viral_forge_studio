import { CopyButton } from "@/components/common/CopyButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type KlingPromptScene } from "@/lib/schemas/kling-prompts";

export function KlingPromptCard({ prompt }: { prompt: KlingPromptScene }) {
  const combined = `${prompt.kling_prompt}\n\nNegative prompt:\n${prompt.negative_prompt}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="accent">Scene {prompt.scene_number}</Badge>
            <Badge>{prompt.scene_role}</Badge>
            <Badge>{prompt.duration_sec}s</Badge>
          </div>
          <CardTitle className="text-base">Kling Prompt</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Block label="Voiceover Line" value={prompt.voiceover_line} />
        <Block label="Kling Prompt" value={prompt.kling_prompt} />
        <Block label="Negative Prompt" value={prompt.negative_prompt} />
        <Block label="Camera Movement" value={prompt.camera_movement} />
        <Block label="Subject Motion" value={prompt.subject_motion} />
        <Block label="Lighting / Mood" value={prompt.lighting_and_mood} />
        <Tags label="Continuity References" values={prompt.continuity_references} />
        <Tags label="Keyframe References" values={prompt.keyframe_references} />
        <Tags label="Risk Notes" values={prompt.generation_risks} />
        <Tags label="Manual Review Checklist" values={prompt.manual_review_checklist} />
        <div className="flex flex-wrap gap-3">
          <CopyButton value={prompt.kling_prompt} label="Copy Kling Prompt" copiedLabel="Prompt Copied" />
          <CopyButton value={prompt.negative_prompt} label="Copy Negative Prompt" copiedLabel="Negative Copied" />
          <CopyButton value={combined} label="Copy Combined Prompt" copiedLabel="Combined Copied" />
        </div>
      </CardContent>
    </Card>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">{value}</p>
    </div>
  );
}

function Tags({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <Badge key={`${label}-${value}`}>{value}</Badge>
        ))}
      </div>
    </div>
  );
}
