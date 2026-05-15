"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function JsonViewer({ value }: { value: unknown }) {
  const [copied, setCopied] = useState(false);
  const formatted = JSON.stringify(value, null, 2);

  async function handleCopy() {
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Validated Idea JSON</CardTitle>
        <Button variant="secondary" size="sm" onClick={handleCopy}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy JSON"}
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="max-h-[28rem] overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-6 text-cyan-100">
          <code>{formatted}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
