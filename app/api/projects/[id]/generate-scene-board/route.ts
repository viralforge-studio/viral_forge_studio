import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { generateSceneBoard } from "@/lib/ai/generateSceneBoard";
import { formatZodIssues } from "@/lib/schemas/validation";
import {
  ensureSceneBoardPrompt,
  getSelectedIdea,
  saveSceneBoard,
} from "@/lib/storage/projects";

function hasSequentialSceneNumbers(sceneNumbers: number[], sceneCount: number) {
  return (
    sceneNumbers.length === sceneCount &&
    sceneNumbers.every((sceneNumber, index) => sceneNumber === index + 1)
  );
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await ensureSceneBoardPrompt(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }
    const selectedIdea = getSelectedIdea(project);
    const scriptGeneration = project.script_generation;
    const subjectDesign = project.subject_design;
    const prompt = project.scene_board_prompt;
    if (!selectedIdea || !scriptGeneration || !subjectDesign || !prompt) {
      return NextResponse.json(
        { error: "Create Subject Design first before building the Scene Board." },
        { status: 400 },
      );
    }
    const sceneBoard = await generateSceneBoard(
      project,
      selectedIdea,
      scriptGeneration,
      subjectDesign,
      project.design_image_prompts,
      prompt,
    );
    if (sceneBoard.idea_id !== project.selected_idea_id) {
      return NextResponse.json({ error: "Scene Board belongs to a different idea_id." }, { status: 400 });
    }
    if (sceneBoard.source_script_title !== scriptGeneration.title) {
      return NextResponse.json({ error: "Scene Board belongs to a different script title." }, { status: 400 });
    }
    if (sceneBoard.scenes.length !== project.scene_count) {
      return NextResponse.json(
        { error: "Scene Board scenes length must equal project.scene_count." },
        { status: 400 },
      );
    }
    if (
      !hasSequentialSceneNumbers(
        sceneBoard.scenes.map((scene) => scene.scene_number),
        project.scene_count,
      )
    ) {
      return NextResponse.json(
        { error: "Scene Board scene numbers must be 1 through project.scene_count in order." },
        { status: 400 },
      );
    }
    const updated = await saveSceneBoard(id, sceneBoard, "generated");
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Generated Scene Board failed validation.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate Scene Board." },
      { status: 400 },
    );
  }
}
