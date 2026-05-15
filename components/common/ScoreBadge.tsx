import { Badge } from "@/components/ui/badge";

export function ScoreBadge({ score }: { score: number }) {
  const variant =
    score >= 8 ? "success" : score >= 6 ? "warning" : ("default" as const);

  return <Badge variant={variant}>Viral Score {score}/10</Badge>;
}
