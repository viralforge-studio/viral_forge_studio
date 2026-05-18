import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { SaveTestSceneReviewInputSchema } from "@/lib/schemas/test-scene-review";
import { formatZodIssues } from "@/lib/schemas/validation";
import { saveTestSceneReview } from "@/lib/storage/projects";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const input = SaveTestSceneReviewInputSchema.parse(body);
    const updated = await saveTestSceneReview(id, input);

    if (!updated) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid test scene review.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save test scene review." },
      { status: 400 },
    );
  }
}
