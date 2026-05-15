"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function DeleteProjectButton({
  projectId,
  projectName,
  redirectToHome = false,
  size = "sm",
  variant = "destructive",
}: {
  projectId: string;
  projectName: string;
  redirectToHome?: boolean;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "secondary" | "ghost" | "destructive";
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    const response = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      window.alert("Unable to delete project. Please try again.");
      setIsDeleting(false);
      return;
    }

    if (redirectToHome) {
      router.push("/");
      router.refresh();
      return;
    }

    router.refresh();
    setIsDeleting(false);
    setIsConfirmOpen(false);
  }

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setIsConfirmOpen(true)}>
        <Trash2 className="size-4" />
        Delete Project
      </Button>
      {isConfirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-2 text-rose-100">
                  <AlertTriangle className="size-5" />
                </div>
                <CardTitle>Delete project?</CardTitle>
              </div>
              <p className="text-sm leading-7 text-slate-300">
                <span className="font-medium text-white">{projectName}</span> will be permanently
                removed from local storage.
              </p>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-slate-400">
              This cannot be undone.
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                variant="secondary"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                <Trash2 className="size-4" />
                {isDeleting ? "Deleting..." : "Delete Project"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : null}
    </>
  );
}
