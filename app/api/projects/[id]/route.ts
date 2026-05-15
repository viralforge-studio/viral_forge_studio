import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { ProjectSchema } from "@/lib/schemas/project";
import { formatZodIssues } from "@/lib/schemas/validation";
import { deleteProject, getProjectById, updateProject } from "@/lib/storage/projects";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const existing = await getProjectById(id);

    if (!existing) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const body = await request.json();
    const payload = ProjectSchema.partial().parse(body);
    const updated = await updateProject(id, payload);

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid project update.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Unable to update project." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deleted = await deleteProject(id);

    if (!deleted) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted_project_id: id });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete project." },
      { status: 500 },
    );
  }
}
