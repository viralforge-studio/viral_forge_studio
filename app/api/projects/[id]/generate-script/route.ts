import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { generateScript } from "@/lib/ai/generateScript";
import { formatZodIssues } from "@/lib/schemas/validation";
import {
  ensureScriptPrompt,
  getSelectedIdea,
  saveScriptGeneration,
} from "@/lib/storage/projects";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const project = await ensureScriptPrompt(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const selectedIdea = getSelectedIdea(project);
    if (!selectedIdea) {
      return NextResponse.json(
        { error: "Select an idea first before generating a script." },
        { status: 400 },
      );
    }

    const scriptPrompt = project.script_prompt;
    if (!scriptPrompt) {
      return NextResponse.json(
        { error: "Script prompt is missing." },
        { status: 400 },
      );
    }

    const scriptGeneration = await generateScript(project, selectedIdea, scriptPrompt);
    const updated = await saveScriptGeneration(id, scriptGeneration, "generated");

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Generated script failed validation.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate script." },
      { status: 400 },
    );
  }
}
