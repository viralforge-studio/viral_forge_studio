import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

import { formatZodIssues } from "@/lib/schemas/validation";
import { getProjectById, saveSubjectDesignReview } from "@/lib/storage/projects";

const SaveSubjectDesignReviewInputSchema = z.object({
  subject_design_review_notes: z.string().nullable().optional(),
  mark_reviewed: z.boolean().default(false),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    if (!project.subject_design) {
      return NextResponse.json(
        { error: "Generate or upload subject design before saving review notes." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const input = SaveSubjectDesignReviewInputSchema.parse(body);
    const updated = await saveSubjectDesignReview(
      id,
      input.subject_design_review_notes ?? null,
      input.mark_reviewed,
    );

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid subject design review input.",
          validationErrors: formatZodIssues(error),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to save subject design review.",
      },
      { status: 400 },
    );
  }
}
