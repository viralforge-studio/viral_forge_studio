import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

import { UploadScriptJsonInputSchema } from "@/lib/schemas/script";
import { formatZodIssues } from "@/lib/schemas/validation";
import {
  getProjectById,
  getSelectedIdea,
  uploadScriptGeneration,
} from "@/lib/storage/projects";

const RequestSchema = UploadScriptJsonInputSchema.extend({
  source: z.enum(["uploaded", "pasted"]).default("uploaded"),
});

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

    if (!project.selected_idea_id || !project.idea_generation) {
      return NextResponse.json(
        { error: "Select an idea first before saving script JSON." },
        { status: 400 },
      );
    }

    const selectedIdea = getSelectedIdea(project);
    if (!selectedIdea) {
      return NextResponse.json(
        { error: "Selected idea could not be resolved." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const input = RequestSchema.parse(body);
    const script = input.script_generation;

    if (script.idea_id !== project.selected_idea_id) {
      return NextResponse.json(
        {
          error: "This script belongs to a different idea_id.",
          validationErrors: [
            {
              path: "script_generation.idea_id",
              message: "idea_id must match project.selected_idea_id.",
            },
          ],
        },
        { status: 400 },
      );
    }

    if (script.source_idea_title !== selectedIdea.title) {
      return NextResponse.json(
        {
          error: "This script belongs to a different selected idea title.",
          validationErrors: [
            {
              path: "script_generation.source_idea_title",
              message: "source_idea_title must match the selected idea title.",
            },
          ],
        },
        { status: 400 },
      );
    }

    const updated = await uploadScriptGeneration(id, script, input.source);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Uploaded script JSON failed validation.",
          validationErrors: formatZodIssues(error),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to upload script JSON.",
      },
      { status: 400 },
    );
  }
}
