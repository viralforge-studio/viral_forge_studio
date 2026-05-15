import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { UploadDesignImagePromptsInputSchema } from "@/lib/schemas/design-image-prompts";
import { formatZodIssues } from "@/lib/schemas/validation";
import {
  getProjectById,
  getSelectedIdea,
  saveDesignImagePrompts,
} from "@/lib/storage/projects";

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

    const selectedIdea = getSelectedIdea(project);
    const scriptGeneration = project.script_generation;
    const subjectDesign = project.subject_design;

    if (!selectedIdea || !scriptGeneration || !subjectDesign || !project.selected_idea_id) {
      return NextResponse.json(
        { error: "Create or upload Subject Design first before saving reference image prompts." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const input = UploadDesignImagePromptsInputSchema.parse(body);
    const designImagePrompts = input.design_image_prompts;

    if (designImagePrompts.idea_id !== project.selected_idea_id) {
      return NextResponse.json(
        {
          error: "This reference image prompts JSON belongs to a different idea_id.",
          validationErrors: [
            {
              path: "design_image_prompts.idea_id",
              message: "idea_id must match project.selected_idea_id.",
            },
          ],
        },
        { status: 400 },
      );
    }

    if (designImagePrompts.source_script_title !== scriptGeneration.title) {
      return NextResponse.json(
        {
          error: "This reference image prompts JSON belongs to a different script title.",
          validationErrors: [
            {
              path: "design_image_prompts.source_script_title",
              message: "source_script_title must match project.script_generation.title.",
            },
          ],
        },
        { status: 400 },
      );
    }

    if (designImagePrompts.source_subject_design_summary !== subjectDesign.visual_style_summary) {
      return NextResponse.json(
        {
          error: "This reference image prompts JSON belongs to a different subject design summary.",
          validationErrors: [
            {
              path: "design_image_prompts.source_subject_design_summary",
              message:
                "source_subject_design_summary must match project.subject_design.visual_style_summary.",
            },
          ],
        },
        { status: 400 },
      );
    }

    const updated = await saveDesignImagePrompts(id, designImagePrompts, input.source);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Uploaded reference image prompts JSON failed validation.",
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
            : "Unable to upload reference image prompts JSON.",
      },
      { status: 400 },
    );
  }
}
