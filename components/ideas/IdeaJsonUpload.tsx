"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

type UploadResult = {
  error?: string;
  validationErrors?: Array<{ path: string; message: string }>;
};

export function IdeaJsonUpload({
  projectId,
  onUploaded,
}: {
  projectId: string;
  onUploaded: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Array<{ path: string; message: string }>
  >([]);

  function openPicker() {
    inputRef.current?.click();
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setMessage(null);
    setValidationErrors([]);

    try {
      const rawText = await file.text();
      const parsed = JSON.parse(rawText);
      const response = await fetch(`/api/projects/${projectId}/upload-idea-json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea_generation: parsed }),
      });

      const result = (await response.json()) as UploadResult;

      if (!response.ok) {
        setValidationErrors(result.validationErrors ?? []);
        setError(result.error ?? "Upload failed.");
        return;
      }

      setMessage("Idea JSON uploaded and validated successfully.");
      onUploaded();
    } catch (uploadError) {
      if (uploadError instanceof SyntaxError) {
        setError("This file is not valid JSON.");
      } else {
        setError("Upload failed. Please try again.");
      }
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button variant="secondary" onClick={openPicker} disabled={isUploading}>
        <Upload className="size-4" />
        {isUploading ? "Uploading..." : "Upload Idea JSON"}
      </Button>
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
    </div>
  );
}
