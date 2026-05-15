import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { SaveKeyframePromptsPromptInputSchema } from "@/lib/schemas/keyframe-prompts";
import { formatZodIssues } from "@/lib/schemas/validation";
import {
  ensureKeyframePromptsPrompt,
  getProjectById,
  saveKeyframePromptsPrompt,
} from "@/lib/storage/projects";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await ensureKeyframePromptsPrompt(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }
    return NextResponse.json({
      keyframe_prompts_prompt: project.keyframe_prompts_prompt,
      keyframe_prompts_prompt_updated_at: project.keyframe_prompts_prompt_updated_at,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load Keyframe Prompts prompt." },
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
    const input = SaveKeyframePromptsPromptInputSchema.parse(body);
    const updated = await saveKeyframePromptsPrompt(id, input.keyframe_prompts_prompt);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid Keyframe Prompts prompt.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save Keyframe Prompts prompt." },
      { status: 400 },
    );
  }
}
