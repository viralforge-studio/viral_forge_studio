import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  UploadIdeaJsonInputSchema,
  validateIdeaGenerationBusinessRules,
} from "@/lib/schemas/ideas";
import { formatZodIssuesWithHints } from "@/lib/schemas/validation";
import { getProjectById, uploadIdeaGeneration } from "@/lib/storage/projects";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let body: unknown;

  try {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    body = await request.json();
    const input = UploadIdeaJsonInputSchema.parse(body);
    const ruleErrors = validateIdeaGenerationBusinessRules(input.idea_generation);

    if (ruleErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Idea JSON failed business-rule validation.",
          validationErrors: ruleErrors.map((message) => ({
            path: "idea_generation",
            message,
          })),
        },
        { status: 400 },
      );
    }

    const updated = await uploadIdeaGeneration(id, input.idea_generation);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Uploaded JSON failed validation.",
          validationErrors: formatZodIssuesWithHints(error, body),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to upload idea JSON." },
      { status: 500 },
    );
  }
}
