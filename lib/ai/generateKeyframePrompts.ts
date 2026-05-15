import { generateKeyframePromptsWithLLM } from "@/lib/ai/providers/keyframe-prompts-llm-placeholder";
import { generateKeyframePromptsWithMock } from "@/lib/ai/providers/mock-keyframe-prompts";
import { type DesignImagePromptsJson } from "@/lib/schemas/design-image-prompts";
import { type Idea } from "@/lib/schemas/ideas";
import { KeyframePromptsSchema } from "@/lib/schemas/keyframe-prompts";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { type SceneBoardJson } from "@/lib/schemas/scene-board";
import { type SubjectDesign } from "@/lib/schemas/subject-design";

export async function generateKeyframePrompts(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  subjectDesign: SubjectDesign,
  designImagePrompts: DesignImagePromptsJson | null,
  sceneBoard: SceneBoardJson,
  prompt: string,
) {
  const provider = process.env.AI_PROVIDER ?? "mock";

  if (provider === "mock") {
    return KeyframePromptsSchema.parse(
      await generateKeyframePromptsWithMock(
        project,
        selectedIdea,
        scriptGeneration,
        subjectDesign,
        designImagePrompts,
        sceneBoard,
        prompt,
      ),
    );
  }

  return KeyframePromptsSchema.parse(
    await generateKeyframePromptsWithLLM(
      project,
      selectedIdea,
      scriptGeneration,
      subjectDesign,
      designImagePrompts,
      sceneBoard,
      prompt,
    ),
  );
}
