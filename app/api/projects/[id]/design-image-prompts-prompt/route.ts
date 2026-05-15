import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  SaveDesignImagePromptGenerationPromptInputSchema,
} from "@/lib/schemas/design-image-prompts";
import { formatZodIssues } from "@/lib/schemas/validation";
import {
  ensureDesignImagePromptGenerationPrompt,
  getProjectById,
  saveDesignImagePromptGenerationPrompt,
} from "@/lib/storage/projects";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const project = await ensureDesignImagePromptGenerationPrompt(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({
      design_image_prompt_generation_prompt: project.design_image_prompt_generation_prompt,
      design_image_prompt_generation_prompt_updated_at:
        project.design_image_prompt_generation_prompt_updated_at,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load reference image prompts prompt.",
      },
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
    const input = SaveDesignImagePromptGenerationPromptInputSchema.parse(body);
    const updated = await saveDesignImagePromptGenerationPrompt(
      id,
      input.design_image_prompt_generation_prompt,
    );

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid reference image prompts prompt.",
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
            : "Unable to save reference image prompts prompt.",
      },
      { status: 400 },
    );
  }
}
