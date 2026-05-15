import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { SaveScriptPromptInputSchema } from "@/lib/schemas/script";
import { formatZodIssues } from "@/lib/schemas/validation";
import {
  ensureScriptPrompt,
  getProjectById,
  saveScriptPrompt,
} from "@/lib/storage/projects";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const project = await ensureScriptPrompt(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({
      script_prompt: project.script_prompt,
      script_prompt_updated_at: project.script_prompt_updated_at,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load script prompt." },
      { status: 400 },
    );
  }
}

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

    const body = await request.json();
    const input = SaveScriptPromptInputSchema.parse(body);
    const updated = await saveScriptPrompt(id, input.script_prompt);

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid script prompt.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save script prompt." },
      { status: 400 },
    );
  }
}
