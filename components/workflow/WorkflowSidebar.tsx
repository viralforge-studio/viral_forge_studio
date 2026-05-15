import Link from "next/link";
import { CheckCircle2, Circle, Lock } from "lucide-react";

import { type Project } from "@/lib/schemas/project";
import { cn } from "@/lib/utils/cn";
import {
  getProjectNextStep,
  isWorkflowTabAvailable,
  isWorkflowTabComplete,
  workflowTabGroups,
} from "@/lib/workflow";

export function WorkflowSidebar({
  project,
  activeTab,
}: {
  project: Project;
  activeTab: string;
}) {
  const nextStep = getProjectNextStep(project);

  return (
    <aside className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
      <div className="mb-5 grid gap-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/8 p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/70">Workflow</p>
          <p className="mt-2 text-sm font-medium text-white">Next step</p>
          <p className="text-sm text-cyan-50">{nextStep.label}</p>
        </div>
        <p className="text-sm leading-7 text-slate-300">{nextStep.description}</p>
      </div>

      <nav className="grid gap-5">
        {workflowTabGroups.map((group) => (
          <div key={group.label} className="grid gap-1">
            <p className="px-3 text-[11px] uppercase tracking-[0.28em] text-slate-500">
              {group.label}
            </p>
            {group.tabs.map((tab) => {
              const isAvailable = isWorkflowTabAvailable(project, tab.key);
              const isComplete = isWorkflowTabComplete(project, tab.key);
              const isActive = activeTab === tab.key;

              return (
                <Link
                  key={tab.key}
                  href={`/projects/${project.id}?tab=${tab.key}`}
                  className={cn(
                    "rounded-2xl px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-cyan-400/12 text-cyan-100"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                    !isAvailable && "pointer-events-none opacity-60",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {isComplete ? (
                        <CheckCircle2 className="size-4 text-emerald-300" />
                      ) : isAvailable ? (
                        <Circle className="size-4 text-slate-500" />
                      ) : (
                        <Lock className="size-4 text-slate-500" />
                      )}
                      <span>{tab.label}</span>
                    </div>
                    {!isAvailable ? (
                      <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                        {tab.enabled ? "Locked" : "Soon"}
                      </span>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
