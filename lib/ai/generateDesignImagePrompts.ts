import { generateDesignImagePromptsWithLLM } from "@/lib/ai/providers/design-image-prompts-llm-placeholder";
import { generateDesignImagePromptsWithMock } from "@/lib/ai/providers/mock-design-image-prompts";
import { type Idea } from "@/lib/schemas/ideas";
import { DesignImagePromptsSchema } from "@/lib/schemas/design-image-prompts";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { type SubjectDesign } from "@/lib/schemas/subject-design";

export async function generateDesignImagePrompts(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  subjectDesign: SubjectDesign,
  prompt: string,
) {
  const provider = process.env.AI_PROVIDER ?? "mock";

  if (provider === "mock") {
    return DesignImagePromptsSchema.parse(
      await generateDesignImagePromptsWithMock(
        project,
        selectedIdea,
        scriptGeneration,
        subjectDesign,
        prompt,
      ),
    );
  }

  return DesignImagePromptsSchema.parse(
    await generateDesignImagePromptsWithLLM(
      project,
      selectedIdea,
      scriptGeneration,
      subjectDesign,
      prompt,
    ),
  );
}
