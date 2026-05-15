import Link from "next/link";

import { ProjectCard } from "@/components/project/ProjectCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjects } from "@/lib/storage/projects";

export default async function Home() {
  const projects = await getProjects();
  const inProgress = projects.filter(
    (project) => !["ready_for_export"].includes(project.status),
  ).length;
  const readyForPrompting = projects.filter(
    (project) =>
      Boolean(project.selected_idea_id) &&
      (!project.design_image_prompts || !project.subject_design),
  ).length;
  const readyForExport = projects.filter(
    (project) => project.status === "ready_for_export",
  ).length;

  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-10 px-6 py-10 lg:px-10">
      <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(250,204,21,0.08),rgba(15,23,42,0.94))] p-8 shadow-[0_30px_80px_rgba(2,6,23,0.4)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="accent">Viral Forge</Badge>
            <Badge>Human-in-the-loop studio</Badge>
          </div>
          <div className="space-y-3">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Guided prompt mastery for serious AI video production
            </h1>
            <p className="max-w-3xl text-base leading-8 text-slate-300">
              Build ideas, prompts, JSON outputs, and review checkpoints in sequence so creators
              stay in control of every production decision.
            </p>
          </div>
        </div>
        <Link href="/projects/new">
          <Button size="lg">New Project</Button>
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Projects" value={`${projects.length}`} />
        <StatCard label="In Progress" value={`${inProgress}`} />
        <StatCard label="Ready for Prompting" value={`${readyForPrompting}`} />
        <StatCard label="Ready for Export" value={`${readyForExport}`} />
      </section>

      <section className="grid gap-6">
        {projects.length === 0 ? (
          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>No projects yet</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-slate-300">
              <p>
                Start with a project brief, then move through ideas, prompts, validated JSON, and
                clean review panels without turning the workflow into a black box.
              </p>
              <div>
                <Link href="/projects/new">
                  <Button>Create Your First Project</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="grid gap-2 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
        <p className="text-3xl font-semibold text-white">{value}</p>
      </CardContent>
    </Card>
  );
}
