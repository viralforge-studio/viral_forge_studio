import { generateKlingPromptsWithLLM } from "@/lib/ai/providers/kling-prompts-llm-placeholder";
import { generateKlingPromptsWithMock } from "@/lib/ai/providers/mock-kling-prompts";
import { type DesignImagePromptsJson } from "@/lib/schemas/design-image-prompts";
import { type Idea } from "@/lib/schemas/ideas";
import { type KeyframePromptsJson } from "@/lib/schemas/keyframe-prompts";
import { KlingPromptsSchema } from "@/lib/schemas/kling-prompts";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { type SceneBoardJson } from "@/lib/schemas/scene-board";
import { type SubjectDesign } from "@/lib/schemas/subject-design";

export async function generateKlingPrompts(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  subjectDesign: SubjectDesign,
  designImagePrompts: DesignImagePromptsJson | null,
  sceneBoard: SceneBoardJson,
  keyframePrompts: KeyframePromptsJson,
  prompt: string,
) {
  const provider = process.env.AI_PROVIDER ?? "mock";

  if (provider === "mock") {
    return KlingPromptsSchema.parse(
      await generateKlingPromptsWithMock(
        project,
        selectedIdea,
        scriptGeneration,
        subjectDesign,
        designImagePrompts,
        sceneBoard,
        keyframePrompts,
        prompt,
      ),
    );
  }

  return KlingPromptsSchema.parse(
    await generateKlingPromptsWithLLM(
      project,
      selectedIdea,
      scriptGeneration,
      subjectDesign,
      designImagePrompts,
      sceneBoard,
      keyframePrompts,
      prompt,
    ),
  );
}
