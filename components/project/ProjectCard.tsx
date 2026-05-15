import Link from "next/link";

import { DeleteProjectButton } from "@/components/project/DeleteProjectButton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type Project } from "@/lib/schemas/project";
import {
  getProjectNextStep,
  getProjectTemplateLabel,
  statusLabels,
} from "@/lib/workflow";
import { formatDateTime } from "@/lib/utils/dates";

export function ProjectCard({ project }: { project: Project }) {
  const selectedIdea = project.idea_generation?.ideas.find(
    (idea) => idea.id === project.selected_idea_id,
  );
  const nextStep = getProjectNextStep(project);

  return (
    <Card className="h-full rounded-[1.75rem]">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="accent">{project.channel_name}</Badge>
              <Badge>{getProjectTemplateLabel(project)}</Badge>
            </div>
            <CardTitle className="text-xl">{project.project_name}</CardTitle>
            <p className="text-sm text-slate-300">{project.niche}</p>
          </div>
          <StatusBadge status={project.status} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-5 text-sm text-slate-300">
        <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/4 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Selected Idea</p>
          <p className="text-slate-100">{selectedIdea?.title ?? "Not chosen yet"}</p>
        </div>
        <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/4 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Current Status</p>
          <p className="text-slate-100">{statusLabels[project.status]}</p>
        </div>
        <div className="grid gap-2 rounded-2xl border border-cyan-400/15 bg-cyan-400/6 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/80">Next Step</p>
          <p className="font-medium text-cyan-50">{nextStep.label}</p>
          <p className="text-slate-300">{nextStep.description}</p>
        </div>
        <div className="grid gap-2 text-slate-400">
          <p>
            <span className="text-slate-500">Created:</span> {formatDateTime(project.created_at)}
          </p>
          <p>
            <span className="text-slate-500">Last updated:</span>{" "}
            {formatDateTime(project.updated_at)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
        <Link href={`/projects/${project.id}?tab=${nextStep.tab}`} className="w-full">
          <Button className="w-full">Open Project</Button>
        </Link>
        <DeleteProjectButton projectId={project.id} projectName={project.project_name} />
      </CardFooter>
    </Card>
  );
}
