import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";

export async function generateScriptWithLLM(
  project: Project,
  selectedIdea: Idea,
  scriptPrompt: string,
) {
  void project;
  void selectedIdea;
  void scriptPrompt;
  throw new Error("Script provider not implemented yet. Set AI_PROVIDER=mock for the MVP.");
}
