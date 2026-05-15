import { type DesignImagePromptsJson } from "@/lib/schemas/design-image-prompts";
import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { type SubjectDesign } from "@/lib/schemas/subject-design";

export async function generateSceneBoardWithLLM(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  subjectDesign: SubjectDesign,
  designImagePrompts: DesignImagePromptsJson | null,
  prompt: string,
) {
  void project;
  void selectedIdea;
  void scriptGeneration;
  void subjectDesign;
  void designImagePrompts;
  void prompt;
  throw new Error("Scene Board provider not implemented yet. Set AI_PROVIDER=mock for the MVP.");
}
