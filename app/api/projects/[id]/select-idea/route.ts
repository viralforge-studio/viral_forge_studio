import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { SelectIdeaInputSchema } from "@/lib/schemas/ideas";
import { formatZodIssues } from "@/lib/schemas/validation";
import { getProjectById, selectIdea } from "@/lib/storage/projects";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    if (!project.idea_generation) {
      return NextResponse.json(
        { error: "Generate or upload ideas before selecting one." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const input = SelectIdeaInputSchema.parse(body);
    const updated = await selectIdea(id, input.idea_id);

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid idea selection.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to select idea." },
      { status: 500 },
    );
  }
}
