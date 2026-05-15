import { generateScriptWithLLM } from "@/lib/ai/providers/script-llm-placeholder";
import { generateScriptWithMock } from "@/lib/ai/providers/mock-script";
import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { ScriptGenerationSchema } from "@/lib/schemas/script";

export async function generateScript(
  project: Project,
  selectedIdea: Idea,
  scriptPrompt: string,
) {
  const provider = process.env.AI_PROVIDER ?? "mock";

  if (provider === "mock") {
    return ScriptGenerationSchema.parse(
      await generateScriptWithMock(project, selectedIdea, scriptPrompt),
    );
  }

  return ScriptGenerationSchema.parse(
    await generateScriptWithLLM(project, selectedIdea, scriptPrompt),
  );
}
