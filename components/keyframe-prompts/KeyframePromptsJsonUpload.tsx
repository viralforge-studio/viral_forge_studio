"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

type UploadResult = {
  error?: string;
  validationErrors?: Array<{ path: string; message: string }>;
};

export function KeyframePromptsJsonUpload({
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
  const [validationErrors, setValidationErrors] = useState<Array<{ path: string; message: string }>>([]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setMessage(null);
    setError(null);
    setValidationErrors([]);
    try {
      const parsed = JSON.parse(await file.text());
      const response = await fetch(`/api/projects/${projectId}/upload-keyframe-prompts-json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyframe_prompts: parsed, source: "uploaded" }),
      });
      const result = (await response.json()) as UploadResult;
      if (!response.ok) {
        setError(result.error ?? "Unable to upload Keyframe Prompts JSON.");
        setValidationErrors(result.validationErrors ?? []);
        return;
      }
      setMessage("Keyframe Prompts JSON uploaded and validated successfully.");
      onUploaded();
    } catch (uploadError) {
      setError(uploadError instanceof SyntaxError ? "Invalid JSON file." : "Unable to upload Keyframe Prompts JSON.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <input ref={inputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleFileChange} />
      <Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={isUploading}>
        <Upload className="size-4" />
        {isUploading ? "Uploading..." : "Upload Keyframe Prompts JSON"}
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
