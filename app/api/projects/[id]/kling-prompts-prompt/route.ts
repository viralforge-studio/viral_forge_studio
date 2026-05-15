import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { SaveKlingPromptsPromptInputSchema } from "@/lib/schemas/kling-prompts";
import { formatZodIssues } from "@/lib/schemas/validation";
import {
  ensureKlingPromptsPrompt,
  getProjectById,
  saveKlingPromptsPrompt,
} from "@/lib/storage/projects";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await ensureKlingPromptsPrompt(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }
    return NextResponse.json({
      kling_prompts_prompt: project.kling_prompts_prompt,
      kling_prompts_prompt_updated_at: project.kling_prompts_prompt_updated_at,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load Kling Prompts prompt." },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }
    const body = await request.json();
    const input = SaveKlingPromptsPromptInputSchema.parse(body);
    const updated = await saveKlingPromptsPrompt(id, input.kling_prompts_prompt);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid Kling Prompts prompt.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save Kling Prompts prompt." },
      { status: 400 },
    );
  }
}
