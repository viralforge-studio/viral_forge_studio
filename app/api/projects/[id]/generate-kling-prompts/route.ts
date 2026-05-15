import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { generateKlingPrompts } from "@/lib/ai/generateKlingPrompts";
import { formatZodIssues } from "@/lib/schemas/validation";
import {
  ensureKlingPromptsPrompt,
  getSelectedIdea,
  saveKlingPrompts,
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
    const project = await ensureKlingPromptsPrompt(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }
    const selectedIdea = getSelectedIdea(project);
    const scriptGeneration = project.script_generation;
    const subjectDesign = project.subject_design;
    const sceneBoard = project.scene_board;
    const keyframePrompts = project.keyframe_prompts;
    const prompt = project.kling_prompts_prompt;
    if (!selectedIdea || !scriptGeneration || !subjectDesign || !sceneBoard || !keyframePrompts || !prompt) {
      return NextResponse.json(
        { error: "Create Keyframe Prompts first before creating Kling prompts." },
        { status: 400 },
      );
    }
    const klingPrompts = await generateKlingPrompts(
      project,
      selectedIdea,
      scriptGeneration,
      subjectDesign,
      project.design_image_prompts,
      sceneBoard,
      keyframePrompts,
      prompt,
    );
    if (klingPrompts.idea_id !== project.selected_idea_id) {
      return NextResponse.json({ error: "Kling Prompts belong to a different idea_id." }, { status: 400 });
    }
    if (klingPrompts.source_script_title !== scriptGeneration.title) {
      return NextResponse.json({ error: "Kling Prompts belong to a different script title." }, { status: 400 });
    }
    if (klingPrompts.prompts.length !== project.scene_count) {
      return NextResponse.json(
        { error: "Kling prompt count must equal project.scene_count." },
        { status: 400 },
      );
    }
    if (klingPrompts.aspect_ratio !== "9:16") {
      return NextResponse.json(
        { error: 'Kling Prompts aspect_ratio must be "9:16".' },
        { status: 400 },
      );
    }
    if (
      !hasSequentialSceneNumbers(
        klingPrompts.prompts.map((scenePrompt) => scenePrompt.scene_number),
        project.scene_count,
      )
    ) {
      return NextResponse.json(
        { error: "Kling Prompt scene numbers must be 1 through project.scene_count in order." },
        { status: 400 },
      );
    }
    const updated = await saveKlingPrompts(id, klingPrompts, "generated");
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Generated Kling Prompts failed validation.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate Kling Prompts." },
      { status: 400 },
    );
  }
}
