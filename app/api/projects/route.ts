import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { formatZodIssues } from "@/lib/schemas/validation";
import { NewProjectInputSchema } from "@/lib/schemas/project";
import { createProject, getProjects } from "@/lib/storage/projects";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = NewProjectInputSchema.parse(body);
    const project = await createProject(input);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid project input.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Unable to create project." },
      { status: 500 },
    );
  }
}
