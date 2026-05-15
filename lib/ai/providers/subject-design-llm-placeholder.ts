import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";

export async function generateSubjectDesignWithLLM(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  prompt: string,
) {
  void project;
  void selectedIdea;
  void scriptGeneration;
  void prompt;
  throw new Error(
    "Subject design provider not implemented yet. Set AI_PROVIDER=mock for the MVP.",
  );
}
