"use client";

import { Check, Copy, RefreshCcw, Save, Sparkles } from "lucide-react";

import { StickyActionBar } from "@/components/common/StickyActionBar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function SceneBoardPromptEditor({
  value,
  onChange,
  onSave,
  onReset,
  onGenerate,
  onCopy,
  copied,
  isSaving,
  isResetting,
  isGenerating,
}: {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onReset: () => void;
  onGenerate: () => void;
  onCopy: () => void;
  copied: boolean;
  isSaving: boolean;
  isResetting: boolean;
  isGenerating: boolean;
}) {
  return (
    <div className="grid gap-4">
      <StickyActionBar>
        <Button onClick={onSave} disabled={isSaving}>
          <Save className="size-4" />
          {isSaving ? "Saving..." : "Save Prompt"}
        </Button>
        <Button variant="secondary" onClick={onReset} disabled={isResetting}>
          <RefreshCcw className="size-4" />
          {isResetting ? "Resetting..." : "Reset to Default Prompt"}
        </Button>
        <Button variant="secondary" onClick={onCopy}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy Prompt"}
        </Button>
        <Button variant="secondary" onClick={onGenerate} disabled={isGenerating}>
          <Sparkles className="size-4" />
          {isGenerating ? "Generating..." : "Generate Scene Board"}
        </Button>
      </StickyActionBar>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[30rem] font-mono text-xs leading-6"
      />
    </div>
  );
}
