import Link from "next/link";

import { ProjectForm } from "@/components/project/ProjectForm";
import { Button } from "@/components/ui/button";

export default function NewProjectPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-8 px-6 py-10 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
            Viral Forge
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            New Project
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-300">
            Start with a durable creative system so every later prompt, JSON package, and human review step stays aligned.
          </p>
        </div>
        <Link href="/">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </div>
      <ProjectForm />
    </main>
  );
}
