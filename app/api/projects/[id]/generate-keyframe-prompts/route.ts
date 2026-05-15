import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { generateKeyframePrompts } from "@/lib/ai/generateKeyframePrompts";
import { formatZodIssues } from "@/lib/schemas/validation";
import {
  ensureKeyframePromptsPrompt,
  getSelectedIdea,
  saveKeyframePrompts,
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
    const project = await ensureKeyframePromptsPrompt(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }
    const selectedIdea = getSelectedIdea(project);
    const scriptGeneration = project.script_generation;
    const subjectDesign = project.subject_design;
    const sceneBoard = project.scene_board;
    const prompt = project.keyframe_prompts_prompt;
    if (!selectedIdea || !scriptGeneration || !subjectDesign || !sceneBoard || !prompt) {
      return NextResponse.json(
        { error: "Create Scene Board first before creating keyframe prompts." },
        { status: 400 },
      );
    }
    const keyframePrompts = await generateKeyframePrompts(
      project,
      selectedIdea,
      scriptGeneration,
      subjectDesign,
      project.design_image_prompts,
      sceneBoard,
      prompt,
    );
    if (keyframePrompts.idea_id !== project.selected_idea_id) {
      return NextResponse.json({ error: "Keyframe Prompts belong to a different idea_id." }, { status: 400 });
    }
    if (keyframePrompts.source_script_title !== scriptGeneration.title) {
      return NextResponse.json({ error: "Keyframe Prompts belong to a different script title." }, { status: 400 });
    }
    if (keyframePrompts.keyframes.length !== project.scene_count) {
      return NextResponse.json(
        { error: "Keyframes length must equal project.scene_count." },
        { status: 400 },
      );
    }
    if (
      !hasSequentialSceneNumbers(
        keyframePrompts.keyframes.map((keyframe) => keyframe.scene_number),
        project.scene_count,
      )
    ) {
      return NextResponse.json(
        {
          error: "Keyframe Prompt scene numbers must be 1 through project.scene_count in order.",
        },
        { status: 400 },
      );
    }
    const updated = await saveKeyframePrompts(id, keyframePrompts, "generated");
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Generated Keyframe Prompts failed validation.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate Keyframe Prompts." },
      { status: 400 },
    );
  }
}
