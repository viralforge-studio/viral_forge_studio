import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Environment } from "@/lib/schemas/subject-design";

export function EnvironmentCard({ environment }: { environment: Environment }) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <Badge variant="accent">Environment</Badge>
        <CardTitle>{environment.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <Line label="Role in Story" value={environment.role_in_story} />
        <Line label="Description" value={environment.description} />
        <Line label="Architecture Style" value={environment.architecture_style} />
        <Line label="Lighting" value={environment.lighting} />
        <Line label="Mood" value={environment.mood} />
        <TokenLine label="Materials" items={environment.materials} />
        <TokenLine label="Color Palette" items={environment.color_palette} />
        <TokenLine label="Continuity Rules" items={environment.continuity_rules} />
        <TokenLine label="Avoid" items={environment.avoid} />
      </CardContent>
    </Card>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="text-slate-200">{value}</p>
    </div>
  );
}

function TokenLine({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </div>
    </div>
  );
}
