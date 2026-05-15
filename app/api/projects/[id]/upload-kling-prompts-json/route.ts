import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { UploadKlingPromptsInputSchema } from "@/lib/schemas/kling-prompts";
import { formatZodIssues } from "@/lib/schemas/validation";
import { getProjectById, getSelectedIdea, saveKlingPrompts } from "@/lib/storage/projects";

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
    const keyframePrompts = project.keyframe_prompts;
    if (!selectedIdea || !scriptGeneration || !keyframePrompts || !project.selected_idea_id) {
      return NextResponse.json(
        { error: "Create Keyframe Prompts first before saving Kling prompts." },
        { status: 400 },
      );
    }
    const body = await request.json();
    const input = UploadKlingPromptsInputSchema.parse(body);
    const klingPrompts = input.kling_prompts;
    if (klingPrompts.idea_id !== project.selected_idea_id) {
      return NextResponse.json(
        {
          error: "This Kling Prompts JSON belongs to a different idea_id.",
          validationErrors: [
            {
              path: "kling_prompts.idea_id",
              message: "idea_id must match project.selected_idea_id.",
            },
          ],
        },
        { status: 400 },
      );
    }
    if (klingPrompts.source_script_title !== scriptGeneration.title) {
      return NextResponse.json(
        {
          error: "This Kling Prompts JSON belongs to a different script title.",
          validationErrors: [
            {
              path: "kling_prompts.source_script_title",
              message: "source_script_title must match project.script_generation.title.",
            },
          ],
        },
        { status: 400 },
      );
    }
    if (klingPrompts.prompts.length !== project.scene_count) {
      return NextResponse.json(
        {
          error: "prompts length must equal project.scene_count.",
          validationErrors: [
            {
              path: "kling_prompts.prompts",
              message: "prompts length must equal project.scene_count.",
            },
          ],
        },
        { status: 400 },
      );
    }
    const actualSceneNumbers = klingPrompts.prompts.map((scene) => scene.scene_number);
    if (!hasSequentialSceneNumbers(actualSceneNumbers, project.scene_count)) {
      return NextResponse.json(
        {
          error: "Scene numbers must be in order.",
          validationErrors: [
            {
              path: "kling_prompts.prompts",
              message: "scene numbers must be 1 through project.scene_count in order.",
            },
          ],
        },
        { status: 400 },
      );
    }
    if (klingPrompts.aspect_ratio !== "9:16") {
      return NextResponse.json(
        {
          error: 'aspect_ratio must be "9:16".',
          validationErrors: [
            {
              path: "kling_prompts.aspect_ratio",
              message: 'aspect_ratio must be "9:16".',
            },
          ],
        },
        { status: 400 },
      );
    }
    const updated = await saveKlingPrompts(id, klingPrompts, input.source);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Uploaded Kling Prompts JSON failed validation.", validationErrors: formatZodIssues(error) },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to upload Kling Prompts JSON." },
      { status: 400 },
    );
  }
}
