import { generateIdeasWithLLM } from "@/lib/ai/providers/llm-placeholder";
import { generateIdeasWithMock } from "@/lib/ai/providers/mock";
import { IdeaGenerationSchema } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";

export async function generateIdeas(project: Project) {
  const provider = process.env.AI_PROVIDER ?? "mock";

  if (provider === "mock") {
    return IdeaGenerationSchema.parse(await generateIdeasWithMock(project));
  }

  return IdeaGenerationSchema.parse(await generateIdeasWithLLM(project));
}
