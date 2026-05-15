"use client";

import { CopyButton } from "@/components/common/CopyButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type DesignImagePrompt } from "@/lib/schemas/design-image-prompts";

const typeLabelMap: Record<DesignImagePrompt["type"], string> = {
  subject_full_body_reference: "Subject Full Body",
  subject_closeup_reference: "Subject Close-Up",
  environment_reference: "Environment",
  prop_reference: "Prop",
  style_reference: "Style",
};

function ListBlock({ label, items }: { label: string; items: string[] }) {
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

function TextBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">{value}</p>
    </div>
  );
}

export function ImagePromptCard({ imagePrompt }: { imagePrompt: DesignImagePrompt }) {
  const combined = `${imagePrompt.prompt}\n\nNegative prompt:\n${imagePrompt.negative_prompt}`;

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="accent">{imagePrompt.title}</Badge>
              <Badge>{typeLabelMap[imagePrompt.type]}</Badge>
            </div>
            <CardTitle className="text-base">{imagePrompt.purpose}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            {imagePrompt.linked_ids.map((linkedId) => (
              <Badge key={linkedId}>{linkedId}</Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <TextBlock label="Prompt" value={imagePrompt.prompt} />
        <TextBlock label="Negative Prompt" value={imagePrompt.negative_prompt} />
        <TextBlock label="Recommended Use" value={imagePrompt.recommended_model_use} />
        <TextBlock label="Composition Notes" value={imagePrompt.composition_notes} />
        <ListBlock label="Consistency Notes" items={imagePrompt.consistency_notes} />
        <ListBlock label="Human Review Questions" items={imagePrompt.human_review_questions} />
        <div className="flex flex-wrap gap-3">
          <CopyButton value={imagePrompt.prompt} label="Copy Prompt" copiedLabel="Prompt Copied" />
          <CopyButton
            value={imagePrompt.negative_prompt}
            label="Copy Negative Prompt"
            copiedLabel="Negative Copied"
          />
          <CopyButton
            value={combined}
            label="Copy Combined Prompt"
            copiedLabel="Combined Copied"
          />
        </div>
      </CardContent>
    </Card>
  );
}
