import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { SaveSceneBoardPromptInputSchema } from "@/lib/schemas/scene-board";
import { formatZodIssues } from "@/lib/schemas/validation";
import {
  ensureSceneBoardPrompt,
  getProjectById,
  saveSceneBoardPrompt,
} from "@/lib/storage/projects";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await ensureSceneBoardPrompt(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }
    return NextResponse.json({
      scene_board_prompt: project.scene_board_prompt,
      scene_board_prompt_updated_at: project.scene_board_prompt_updated_at,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load Scene Board prompt." },
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
    const input = SaveSceneBoardPromptInputSchema.parse(body);
    const updated = await saveSceneBoardPrompt(id, input.scene_board_prompt);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid Scene Board prompt.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save Scene Board prompt." },
      { status: 400 },
    );
  }
}
