import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { SaveSubjectDesignPromptInputSchema } from "@/lib/schemas/subject-design";
import { formatZodIssues } from "@/lib/schemas/validation";
import {
  ensureSubjectDesignPrompt,
  getProjectById,
  saveSubjectDesignPrompt,
} from "@/lib/storage/projects";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const project = await ensureSubjectDesignPrompt(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({
      subject_design_prompt: project.subject_design_prompt,
      subject_design_prompt_updated_at: project.subject_design_prompt_updated_at,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load subject design prompt." },
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
    const input = SaveSubjectDesignPromptInputSchema.parse(body);
    const updated = await saveSubjectDesignPrompt(id, input.subject_design_prompt);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid subject design prompt.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save subject design prompt." },
      { status: 400 },
    );
  }
}
