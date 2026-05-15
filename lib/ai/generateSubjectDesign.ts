import { generateSubjectDesignWithMock } from "@/lib/ai/providers/mock-subject-design";
import { generateSubjectDesignWithLLM } from "@/lib/ai/providers/subject-design-llm-placeholder";
import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { SubjectDesignSchema } from "@/lib/schemas/subject-design";

export async function generateSubjectDesign(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  prompt: string,
) {
  const provider = process.env.AI_PROVIDER ?? "mock";

  if (provider === "mock") {
    return SubjectDesignSchema.parse(
      await generateSubjectDesignWithMock(project, selectedIdea, scriptGeneration, prompt),
    );
  }

  return SubjectDesignSchema.parse(
    await generateSubjectDesignWithLLM(project, selectedIdea, scriptGeneration, prompt),
  );
}
