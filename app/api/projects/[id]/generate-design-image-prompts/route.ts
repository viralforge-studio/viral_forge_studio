import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { generateDesignImagePrompts } from "@/lib/ai/generateDesignImagePrompts";
import { formatZodIssues } from "@/lib/schemas/validation";
import {
  ensureDesignImagePromptGenerationPrompt,
  getSelectedIdea,
  saveDesignImagePrompts,
} from "@/lib/storage/projects";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const project = await ensureDesignImagePromptGenerationPrompt(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const selectedIdea = getSelectedIdea(project);
    const scriptGeneration = project.script_generation;
    const subjectDesign = project.subject_design;
    const prompt = project.design_image_prompt_generation_prompt;

    if (!selectedIdea || !scriptGeneration || !subjectDesign || !prompt) {
      return NextResponse.json(
        { error: "Create or upload Subject Design first before generating reference image prompts." },
        { status: 400 },
      );
    }

    const designImagePrompts = await generateDesignImagePrompts(
      project,
      selectedIdea,
      scriptGeneration,
      subjectDesign,
      prompt,
    );

    if (designImagePrompts.idea_id !== project.selected_idea_id) {
      return NextResponse.json(
        { error: "Design image prompts belong to a different idea_id." },
        { status: 400 },
      );
    }

    if (designImagePrompts.source_script_title !== scriptGeneration.title) {
      return NextResponse.json(
        { error: "Design image prompts belong to a different script title." },
        { status: 400 },
      );
    }

    const updated = await saveDesignImagePrompts(id, designImagePrompts, "generated");
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Generated reference image prompts failed validation.",
          validationErrors: formatZodIssues(error),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate reference image prompts.",
      },
      { status: 400 },
    );
  }
}
