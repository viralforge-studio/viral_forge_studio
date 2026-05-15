import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { type SubjectDesign } from "@/lib/schemas/subject-design";

export async function generateDesignImagePromptsWithLLM(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  subjectDesign: SubjectDesign,
  prompt: string,
) {
  void project;
  void selectedIdea;
  void scriptGeneration;
  void subjectDesign;
  void prompt;
  throw new Error(
    "Design image prompts provider not implemented yet. Set AI_PROVIDER=mock for the MVP.",
  );
}
