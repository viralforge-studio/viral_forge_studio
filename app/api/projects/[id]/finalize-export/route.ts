import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { FinalizeExportInputSchema } from "@/lib/schemas/test-scene-review";
import { formatZodIssues } from "@/lib/schemas/validation";
import { finalizeProjectExport } from "@/lib/storage/projects";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const input = FinalizeExportInputSchema.parse(body);
    const updated = await finalizeProjectExport(id, input.export_notes);

    if (!updated) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid export input.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to finalize export." },
      { status: 400 },
    );
  }
}
