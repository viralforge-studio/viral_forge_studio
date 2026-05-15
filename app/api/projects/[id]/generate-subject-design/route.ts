import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { generateSubjectDesign } from "@/lib/ai/generateSubjectDesign";
import { formatZodIssues } from "@/lib/schemas/validation";
import {
  ensureSubjectDesignPrompt,
  getSelectedIdea,
  saveSubjectDesign,
} from "@/lib/storage/projects";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const project = await ensureSubjectDesignPrompt(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const selectedIdea = getSelectedIdea(project);
    const scriptGeneration = project.script_generation;
    const prompt = project.subject_design_prompt;

    if (!selectedIdea || !scriptGeneration || !prompt) {
      return NextResponse.json(
        { error: "Generate or upload a script first before generating subject design." },
        { status: 400 },
      );
    }

    const subjectDesign = await generateSubjectDesign(project, selectedIdea, scriptGeneration, prompt);

    if (subjectDesign.idea_id !== project.selected_idea_id) {
      return NextResponse.json({ error: "Subject design belongs to a different idea_id." }, { status: 400 });
    }

    if (subjectDesign.source_script_title !== scriptGeneration.title) {
      return NextResponse.json({ error: "Subject design belongs to a different script title." }, { status: 400 });
    }

    const updated = await saveSubjectDesign(id, subjectDesign, "generated");
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Generated subject design failed validation.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate subject design." },
      { status: 400 },
    );
  }
}
