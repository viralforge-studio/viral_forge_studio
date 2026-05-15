import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { UploadSubjectDesignInputSchema } from "@/lib/schemas/subject-design";
import { formatZodIssues } from "@/lib/schemas/validation";
import {
  getProjectById,
  getSelectedIdea,
  saveSubjectDesign,
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

    if (!selectedIdea || !scriptGeneration || !project.selected_idea_id) {
      return NextResponse.json(
        { error: "Generate or upload a script first before saving subject design." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const input = UploadSubjectDesignInputSchema.parse(body);
    const subjectDesign = input.subject_design;

    if (subjectDesign.idea_id !== project.selected_idea_id) {
      return NextResponse.json(
        {
          error: "This subject design belongs to a different idea_id.",
          validationErrors: [
            {
              path: "subject_design.idea_id",
              message: "idea_id must match project.selected_idea_id.",
            },
          ],
        },
        { status: 400 },
      );
    }

    if (subjectDesign.source_script_title !== scriptGeneration.title) {
      return NextResponse.json(
        {
          error: "This subject design belongs to a different script title.",
          validationErrors: [
            {
              path: "subject_design.source_script_title",
              message: "source_script_title must match project.script_generation.title.",
            },
          ],
        },
        { status: 400 },
      );
    }

    if (subjectDesign.scene_design_map.length !== project.scene_count) {
      return NextResponse.json(
        {
          error: "scene_design_map length must equal project.scene_count.",
          validationErrors: [
            {
              path: "subject_design.scene_design_map",
              message: "scene_design_map length must equal project.scene_count.",
            },
          ],
        },
        { status: 400 },
      );
    }

    const updated = await saveSubjectDesign(id, subjectDesign, input.source);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Uploaded subject design JSON failed validation.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to upload subject design JSON." },
      { status: 400 },
    );
  }
}
