import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

import { formatZodIssues } from "@/lib/schemas/validation";
import { getProjectById, saveEditedVoiceover } from "@/lib/storage/projects";

const SaveVoiceoverInputSchema = z.object({
  edited_voiceover: z.string().min(1),
  voiceover_notes: z.string().nullable().optional(),
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

    if (!project.script_generation) {
      return NextResponse.json(
        { error: "Generate or upload a script first before extracting voiceover." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const input = SaveVoiceoverInputSchema.parse(body);
    const updated = await saveEditedVoiceover(
      id,
      input.edited_voiceover,
      input.voiceover_notes,
    );

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid voiceover input.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save edited voiceover." },
      { status: 400 },
    );
  }
}
