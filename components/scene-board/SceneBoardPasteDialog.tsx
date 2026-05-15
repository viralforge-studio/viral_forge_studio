"use client";

import { useState } from "react";
import { ClipboardPaste } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type UploadResult = {
  error?: string;
  validationErrors?: Array<{ path: string; message: string }>;
};

export function SceneBoardPasteDialog({
  projectId,
  onUploaded,
}: {
  projectId: string;
  onUploaded: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Array<{ path: string; message: string }>
  >([]);

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    setError(null);
    setValidationErrors([]);

    try {
      const parsed = JSON.parse(value);
      const response = await fetch(`/api/projects/${projectId}/upload-scene-board-json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene_board: parsed, source: "pasted" }),
      });

      const result = (await response.json()) as UploadResult;
      if (!response.ok) {
        setError(result.error ?? "Unable to save pasted Scene Board JSON.");
        setValidationErrors(result.validationErrors ?? []);
        return;
      }

      setMessage("Scene Board JSON pasted and validated successfully.");
      onUploaded();
    } catch (pasteError) {
      setError(pasteError instanceof SyntaxError ? "Invalid pasted JSON." : "Unable to save pasted Scene Board JSON.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Button variant="secondary" onClick={() => setIsOpen((current) => !current)}>
        <ClipboardPaste className="size-4" />
        Paste Scene Board JSON
      </Button>
      {isOpen ? (
        <Card>
          <CardHeader>
            <CardTitle>Paste SceneBoard JSON</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Textarea
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="min-h-[22rem] font-mono text-xs leading-6"
              placeholder="Paste a full SceneBoard JSON object here."
            />
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Validating..." : "Validate & Save"}
              </Button>
              <Button variant="secondary" onClick={() => setValue("")} disabled={isSaving}>
                Clear
              </Button>
            </div>
            {message ? <p className="text-sm text-emerald-200">{message}</p> : null}
            {error ? <p className="text-sm text-rose-200">{error}</p> : null}
            {validationErrors.length > 0 ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-100">
                <ul className="grid gap-1">
                  {validationErrors.map((issue) => (
                    <li key={`${issue.path}-${issue.message}`}>
                      <span className="font-medium">{issue.path}:</span> {issue.message}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
