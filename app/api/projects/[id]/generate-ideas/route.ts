import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { generateIdeas } from "@/lib/ai/generateIdeas";
import { formatZodIssues } from "@/lib/schemas/validation";
import { getProjectById, saveIdeaGeneration } from "@/lib/storage/projects";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const ideaGeneration = await generateIdeas(project);
    const updatedProject = await saveIdeaGeneration(id, ideaGeneration);

    return NextResponse.json(updatedProject);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Generated idea JSON failed validation.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Idea generation failed.",
      },
      { status: 500 },
    );
  }
}
