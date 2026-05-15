import { type DesignImagePromptsJson } from "@/lib/schemas/design-image-prompts";
import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { type SceneBoardJson } from "@/lib/schemas/scene-board";
import { type SubjectDesign } from "@/lib/schemas/subject-design";

export async function generateKeyframePromptsWithLLM(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  subjectDesign: SubjectDesign,
  designImagePrompts: DesignImagePromptsJson | null,
  sceneBoard: SceneBoardJson,
  prompt: string,
) {
  void project;
  void selectedIdea;
  void scriptGeneration;
  void subjectDesign;
  void designImagePrompts;
  void sceneBoard;
  void prompt;
  throw new Error(
    "Keyframe prompts provider not implemented yet. Set AI_PROVIDER=mock for the MVP.",
  );
}
