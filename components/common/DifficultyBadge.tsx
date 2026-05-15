import { Badge } from "@/components/ui/badge";

export function DifficultyBadge({
  difficulty,
}: {
  difficulty: "low" | "medium" | "high";
}) {
  const variant =
    difficulty === "low"
      ? "success"
      : difficulty === "medium"
        ? "warning"
        : "default";

  return <Badge variant={variant}>Kling {difficulty}</Badge>;
}
