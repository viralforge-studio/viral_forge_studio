import { generateSceneBoardWithLLM } from "@/lib/ai/providers/scene-board-llm-placeholder";
import { generateSceneBoardWithMock } from "@/lib/ai/providers/mock-scene-board";
import { type DesignImagePromptsJson } from "@/lib/schemas/design-image-prompts";
import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { SceneBoardSchema } from "@/lib/schemas/scene-board";
import { type SubjectDesign } from "@/lib/schemas/subject-design";

export async function generateSceneBoard(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  subjectDesign: SubjectDesign,
  designImagePrompts: DesignImagePromptsJson | null,
  prompt: string,
) {
  const provider = process.env.AI_PROVIDER ?? "mock";

  if (provider === "mock") {
    return SceneBoardSchema.parse(
      await generateSceneBoardWithMock(
        project,
        selectedIdea,
        scriptGeneration,
        subjectDesign,
        designImagePrompts,
        prompt,
      ),
    );
  }

  return SceneBoardSchema.parse(
    await generateSceneBoardWithLLM(
      project,
      selectedIdea,
      scriptGeneration,
      subjectDesign,
      designImagePrompts,
      prompt,
    ),
  );
}
