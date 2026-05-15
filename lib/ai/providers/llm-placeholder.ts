import { type Project } from "@/lib/schemas/project";

export async function generateIdeasWithLLM(project: Project) {
  void project;
  throw new Error("AI provider not implemented yet. Set AI_PROVIDER=mock for the MVP.");
}
