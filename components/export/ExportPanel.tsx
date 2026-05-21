"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileJson } from "lucide-react";

import { CopyButton } from "@/components/common/CopyButton";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { buildProjectExportMarkdown } from "@/lib/export/buildProjectExport";
import { type Project } from "@/lib/schemas/project";
import { getProductionReadiness } from "@/lib/workflow";

function getReadinessBadgeVariant(
  level: ReturnType<typeof getProductionReadiness>["level"],
): "accent" | "warning" | "success" {
  if (level === "ready") {
    return "success";
  }

  if (level === "needs_revision") {
    return "warning";
  }

  return "accent";
}

export function ExportPanel({ project }: { project: Project }) {
  const router = useRouter();
  const [exportNotes, setExportNotes] = useState(project.export_notes ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const readiness = useMemo(() => getProductionReadiness(project), [project]);
  const exportMarkdown = buildProjectExportMarkdown({
    ...project,
    export_notes: exportNotes,
  });
  const exportBundle = useMemo(
    () => ({
      generated_at: new Date().toISOString(),
      project_id: project.id,
      project_name: project.project_name,
      status: project.status,
      readiness,
      export_markdown: exportMarkdown,
      project,
    }),
    [exportMarkdown, project, readiness],
  );
  const canFinalize = readiness.canFinalizeExport;
  const isExportNotesDirty = exportNotes !== (project.export_notes ?? "");

  async function saveExportNotesDraft() {
    setIsSavingNotes(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${project.id}/export-notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ export_notes: exportNotes }),
      });
      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setError(data?.error ?? "Unable to save export notes draft.");
        setIsSavingNotes(false);
        return;
      }

      setMessage("Export notes draft saved.");
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save export notes draft.",
      );
    } finally {
      setIsSavingNotes(false);
    }
  }

  async function finalizeExport() {
    setIsFinalizing(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${project.id}/finalize-export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ export_notes: exportNotes }),
      });
      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setError(data?.error ?? "Unable to finalize export.");
        setIsFinalizing(false);
        return;
      }

      setMessage("Project marked ready for export.");
      router.replace(`/projects/${project.id}?tab=export`);
      router.refresh();
    } catch (finalizeError) {
      setError(
        finalizeError instanceof Error
          ? finalizeError.message
          : "Unable to finalize export.",
      );
    } finally {
      setIsFinalizing(false);
    }
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

  function downloadJsonBundle() {
    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.project_name
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()}-export-bundle.json`;
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
                Finalize the project and export a complete Markdown package with every prompt, JSON
                artifact, and review note.
              </p>
            </div>
            {project.export_ready_at ? (
              <Badge variant="success">Ready for Export</Badge>
            ) : (
              <Badge>Draft Export</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-5">
          {message ? (
            <Alert className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">
              {message}
            </Alert>
          ) : null}
          {error ? (
            <Alert className="border-rose-400/20 bg-rose-400/10 text-rose-100">{error}</Alert>
          ) : null}

          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/3 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-100">Production Readiness</p>
              <Badge variant={getReadinessBadgeVariant(readiness.level)}>
                {readiness.score}/100 readiness score
              </Badge>
            </div>
            <p className="text-sm text-slate-300">
              {readiness.completedChecks}/{readiness.totalChecks} core checks complete.
            </p>
            {readiness.blockers.length > 0 ? (
              <div className="grid gap-2">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Blockers</p>
                {readiness.blockers.map((issue, index) => (
                  <Link
                    key={`${issue.tab}-${index}`}
                    href={`/projects/${project.id}?tab=${issue.tab}`}
                    className="rounded-xl border border-amber-300/20 bg-amber-300/8 p-3 text-sm text-amber-100 transition-colors hover:border-amber-300/40"
                  >
                    <span className="font-medium">{issue.label}: </span>
                    {issue.message}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-emerald-100">
                No blockers detected for final export readiness.
              </p>
            )}
            {readiness.warnings.length > 0 ? (
              <div className="grid gap-2">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/80">Warnings</p>
                {readiness.warnings.map((issue, index) => (
                  <Link
                    key={`${issue.tab}-warning-${index}`}
                    href={`/projects/${project.id}?tab=${issue.tab}`}
                    className="rounded-xl border border-cyan-300/20 bg-cyan-300/8 p-3 text-sm text-cyan-50 transition-colors hover:border-cyan-300/35"
                  >
                    <span className="font-medium">{issue.label}: </span>
                    {issue.message}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {!canFinalize ? (
            <Alert className="border-amber-400/20 bg-amber-400/10 text-amber-100">
              Final export is blocked until Test Scene Review is approved for full production.
            </Alert>
          ) : null}

          <Textarea
            value={exportNotes}
            onChange={(event) => setExportNotes(event.target.value)}
            className="min-h-[120px]"
            placeholder="Final handoff notes, production caveats, or delivery instructions"
          />
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => void saveExportNotesDraft()}
              disabled={!isExportNotesDirty || isSavingNotes}
            >
              {isSavingNotes ? "Saving..." : "Save Notes Draft"}
            </Button>
            <Button
              type="button"
              onClick={() => void finalizeExport()}
              disabled={!canFinalize || isFinalizing}
            >
              {isFinalizing ? "Finalizing..." : "Mark Ready for Export"}
            </Button>
            <Button type="button" variant="secondary" onClick={downloadMarkdown}>
              <Download className="size-4" />
              Download Markdown
            </Button>
            <Button type="button" variant="secondary" onClick={downloadJsonBundle}>
              <FileJson className="size-4" />
              Download JSON Bundle
            </Button>
            <CopyButton
              value={exportMarkdown}
              label="Copy Export Markdown"
              copiedLabel="Export Copied"
            />
            <CopyButton
              value={JSON.stringify(exportBundle, null, 2)}
              label="Copy JSON Bundle"
              copiedLabel="Bundle Copied"
            />
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
