import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { UploadSceneBoardInputSchema } from "@/lib/schemas/scene-board";
import { formatZodIssues } from "@/lib/schemas/validation";
import { getProjectById, getSelectedIdea, saveSceneBoard } from "@/lib/storage/projects";

function hasSequentialSceneNumbers(sceneNumbers: number[], sceneCount: number) {
  return (
    sceneNumbers.length === sceneCount &&
    sceneNumbers.every((sceneNumber, index) => sceneNumber === index + 1)
  );
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
        { error: "Create Subject Design first before saving the Scene Board." },
        { status: 400 },
      );
    }
    const body = await request.json();
    const input = UploadSceneBoardInputSchema.parse(body);
    const sceneBoard = input.scene_board;
    if (sceneBoard.idea_id !== project.selected_idea_id) {
      return NextResponse.json(
        {
          error: "This Scene Board belongs to a different idea_id.",
          validationErrors: [
            {
              path: "scene_board.idea_id",
              message: "idea_id must match project.selected_idea_id.",
            },
          ],
        },
        { status: 400 },
      );
    }
    if (sceneBoard.source_script_title !== scriptGeneration.title) {
      return NextResponse.json(
        {
          error: "This Scene Board belongs to a different script title.",
          validationErrors: [
            {
              path: "scene_board.source_script_title",
              message: "source_script_title must match project.script_generation.title.",
            },
          ],
        },
        { status: 400 },
      );
    }
    if (sceneBoard.source_subject_design_summary !== subjectDesign.visual_style_summary) {
      return NextResponse.json(
        {
          error: "This Scene Board belongs to a different subject design summary.",
          validationErrors: [
            {
              path: "scene_board.source_subject_design_summary",
              message:
                "source_subject_design_summary must match project.subject_design.visual_style_summary.",
            },
          ],
        },
        { status: 400 },
      );
    }
    if (sceneBoard.scenes.length !== project.scene_count) {
      return NextResponse.json(
        {
          error: "scenes length must equal project.scene_count.",
          validationErrors: [
            {
              path: "scene_board.scenes",
              message: "scenes length must equal project.scene_count.",
            },
          ],
        },
        { status: 400 },
      );
    }
    const actualSceneNumbers = sceneBoard.scenes.map((scene) => scene.scene_number);
    if (!hasSequentialSceneNumbers(actualSceneNumbers, project.scene_count)) {
      return NextResponse.json(
        {
          error: "Scene numbers must be in order.",
          validationErrors: [
            {
              path: "scene_board.scenes",
              message: "scene numbers must be 1 through project.scene_count in order.",
            },
          ],
        },
        { status: 400 },
      );
    }
    const updated = await saveSceneBoard(id, sceneBoard, input.source);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Uploaded Scene Board JSON failed validation.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to upload Scene Board JSON." },
      { status: 400 },
    );
  }
}
