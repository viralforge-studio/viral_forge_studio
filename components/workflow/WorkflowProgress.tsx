import { workflowSteps } from "@/lib/workflow";
import { type ProjectStatus } from "@/lib/schemas/project";

export function WorkflowProgress({ status }: { status: ProjectStatus }) {
  const activeIndex = workflowSteps.findIndex((step) => step.status === status);

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-4">
          {workflowSteps.map((step, index) => {
            const state =
              index < activeIndex ? "complete" : index === activeIndex ? "active" : "upcoming";

            return (
              <div key={step.status} className="w-36 shrink-0">
                <div
                  className={[
                    "h-2.5 rounded-full",
                    state === "complete"
                      ? "bg-emerald-300"
                      : state === "active"
                        ? "bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.35)]"
                        : "bg-white/10",
                  ].join(" ")}
                  title={step.label}
                />
                <p
                  className={[
                    "mt-3 text-xs uppercase tracking-[0.16em]",
                    state === "complete"
                      ? "text-emerald-100"
                      : state === "active"
                        ? "text-cyan-100"
                        : "text-slate-500",
                  ].join(" ")}
                  title={step.label}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
