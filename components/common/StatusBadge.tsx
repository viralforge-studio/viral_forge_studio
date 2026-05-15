import { Badge } from "@/components/ui/badge";
import { type ProjectStatus } from "@/lib/schemas/project";
import { statusLabels } from "@/lib/workflow";

const statusVariantMap: Record<
  ProjectStatus,
  "default" | "accent" | "success" | "warning"
> = {
  brief_created: "default",
  ideas_generated: "accent",
  idea_selected: "success",
  script_prompt_ready: "accent",
  script_generated: "warning",
  voiceover_reviewed: "accent",
  subject_design_prompt_ready: "accent",
  subject_design_ready: "success",
  design_image_prompts_ready: "success",
  scene_board_ready: "success",
  keyframe_prompts_ready: "success",
  kling_prompts_ready: "warning",
  test_scene_review: "warning",
  ready_for_export: "success",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge variant={statusVariantMap[status]}>{statusLabels[status]}</Badge>;
}
