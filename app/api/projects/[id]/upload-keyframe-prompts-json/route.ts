import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { UploadKeyframePromptsInputSchema } from "@/lib/schemas/keyframe-prompts";
import { formatZodIssues } from "@/lib/schemas/validation";
import { getProjectById, getSelectedIdea, saveKeyframePrompts } from "@/lib/storage/projects";

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
    const sceneBoard = project.scene_board;
    if (!selectedIdea || !scriptGeneration || !sceneBoard || !project.selected_idea_id) {
      return NextResponse.json(
        { error: "Create Scene Board first before saving keyframe prompts." },
        { status: 400 },
      );
    }
    const body = await request.json();
    const input = UploadKeyframePromptsInputSchema.parse(body);
    const keyframePrompts = input.keyframe_prompts;
    if (keyframePrompts.idea_id !== project.selected_idea_id) {
      return NextResponse.json(
        {
          error: "This Keyframe Prompts JSON belongs to a different idea_id.",
          validationErrors: [
            {
              path: "keyframe_prompts.idea_id",
              message: "idea_id must match project.selected_idea_id.",
            },
          ],
        },
        { status: 400 },
      );
    }
    if (keyframePrompts.source_script_title !== scriptGeneration.title) {
      return NextResponse.json(
        {
          error: "This Keyframe Prompts JSON belongs to a different script title.",
          validationErrors: [
            {
              path: "keyframe_prompts.source_script_title",
              message: "source_script_title must match project.script_generation.title.",
            },
          ],
        },
        { status: 400 },
      );
    }
    if (keyframePrompts.keyframes.length !== project.scene_count) {
      return NextResponse.json(
        {
          error: "keyframes length must equal project.scene_count.",
          validationErrors: [
            {
              path: "keyframe_prompts.keyframes",
              message: "keyframes length must equal project.scene_count.",
            },
          ],
        },
        { status: 400 },
      );
    }
    const actualSceneNumbers = keyframePrompts.keyframes.map((scene) => scene.scene_number);
    if (!hasSequentialSceneNumbers(actualSceneNumbers, project.scene_count)) {
      return NextResponse.json(
        {
          error: "Scene numbers must be in order.",
          validationErrors: [
            {
              path: "keyframe_prompts.keyframes",
              message: "scene numbers must be 1 through project.scene_count in order.",
            },
          ],
        },
        { status: 400 },
      );
    }
    const updated = await saveKeyframePrompts(id, keyframePrompts, input.source);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Uploaded Keyframe Prompts JSON failed validation.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to upload Keyframe Prompts JSON." },
      { status: 400 },
    );
  }
}
