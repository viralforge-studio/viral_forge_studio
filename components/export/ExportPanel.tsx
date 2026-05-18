"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { CopyButton } from "@/components/common/CopyButton";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { buildProjectExportMarkdown } from "@/lib/export/buildProjectExport";
import { type Project } from "@/lib/schemas/project";

export function ExportPanel({ project }: { project: Project }) {
  const [exportNotes, setExportNotes] = useState(project.export_notes ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const exportMarkdown = buildProjectExportMarkdown({
    ...project,
    export_notes: exportNotes,
  });

  const canFinalize =
    Boolean(project.kling_prompts && project.test_scene_review) &&
    project.test_scene_review?.decision === "approved_for_full_production";

  async function finalizeExport() {
    setIsFinalizing(true);
    setMessage(null);
    setError(null);

    const response = await fetch(`/api/projects/${project.id}/finalize-export`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ export_notes: exportNotes }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to finalize export.");
      setIsFinalizing(false);
      return;
    }

    setMessage("Project marked ready for export.");
    setIsFinalizing(false);
    window.location.href = `/projects/${project.id}?tab=export`;
  }

  function downloadMarkdown() {
    const blob = new Blob([exportMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.project_name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-export.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="accent">Export</Badge>
              <CardTitle>Production handoff package</CardTitle>
              <p className="text-sm leading-7 text-slate-300">
                Finalize the project and export a complete Markdown package with every prompt, JSON artifact, and review note.
              </p>
            </div>
            {project.export_ready_at ? <Badge variant="success">Ready for Export</Badge> : <Badge>Draft Export</Badge>}
          </div>
        </CardHeader>
        <CardContent className="grid gap-5">
          {message ? <Alert className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">{message}</Alert> : null}
          {error ? <Alert className="border-rose-400/20 bg-rose-400/10 text-rose-100">{error}</Alert> : null}
          {!project.test_scene_review ? (
            <Alert className="border-amber-400/20 bg-amber-400/10 text-amber-100">
              Complete Test Scene Review before finalizing export.
            </Alert>
          ) : null}
          {project.test_scene_review?.decision !== "approved_for_full_production" ? (
            <Alert className="border-amber-400/20 bg-amber-400/10 text-amber-100">
              The test scene is not approved yet. Export can be previewed, but final readiness is blocked.
            </Alert>
          ) : null}
          <Textarea
            value={exportNotes}
            onChange={(event) => setExportNotes(event.target.value)}
            className="min-h-[120px]"
            placeholder="Final handoff notes, production caveats, or delivery instructions"
          />
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={() => void finalizeExport()} disabled={!canFinalize || isFinalizing}>
              {isFinalizing ? "Finalizing..." : "Mark Ready for Export"}
            </Button>
            <Button type="button" variant="secondary" onClick={downloadMarkdown}>
              <Download className="size-4" />
              Download Markdown
            </Button>
            <CopyButton value={exportMarkdown} label="Copy Export Markdown" copiedLabel="Export Copied" />
            <CopyButton value={JSON.stringify(project, null, 2)} label="Copy Project JSON" copiedLabel="JSON Copied" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="max-h-[42rem] overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-6 text-cyan-100">
            <code>{exportMarkdown}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
