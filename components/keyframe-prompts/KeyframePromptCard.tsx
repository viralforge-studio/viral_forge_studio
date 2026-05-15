import { CopyButton } from "@/components/common/CopyButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type KeyframePromptScene } from "@/lib/schemas/keyframe-prompts";

export function KeyframePromptCard({ keyframe }: { keyframe: KeyframePromptScene }) {
  const combined = `${keyframe.opening_keyframe_prompt}\n\nNegative prompt:\n${keyframe.negative_prompt}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="accent">Scene {keyframe.scene_number}</Badge>
            <Badge>{keyframe.scene_role}</Badge>
            <Badge>{keyframe.duration_sec}s</Badge>
          </div>
          <CardTitle className="text-base">Keyframe Prompts</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Block label="Opening Keyframe Prompt" value={keyframe.opening_keyframe_prompt} />
        {keyframe.ending_keyframe_prompt ? (
          <Block label="Ending Keyframe Prompt" value={keyframe.ending_keyframe_prompt} />
        ) : null}
        <Block label="Negative Prompt" value={keyframe.negative_prompt} />
        <Tags label="Linked Subjects" values={keyframe.linked_subjects} />
        <Tags label="Linked Environments" values={keyframe.linked_environments} />
        <Tags label="Linked Props" values={keyframe.linked_props} />
        <Block label="Composition Notes" value={keyframe.composition_notes} />
        <Tags label="Continuity Notes" values={keyframe.continuity_notes} />
        <Tags label="Human Review Questions" values={keyframe.human_review_questions} />
        <div className="flex flex-wrap gap-3">
          <CopyButton value={keyframe.opening_keyframe_prompt} label="Copy Opening Prompt" copiedLabel="Opening Copied" />
          {keyframe.ending_keyframe_prompt ? (
            <CopyButton
              value={keyframe.ending_keyframe_prompt}
              label="Copy Ending Prompt"
              copiedLabel="Ending Copied"
            />
          ) : null}
          <CopyButton value={keyframe.negative_prompt} label="Copy Negative Prompt" copiedLabel="Negative Copied" />
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
