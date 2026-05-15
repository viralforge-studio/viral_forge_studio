import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Prop } from "@/lib/schemas/subject-design";

export function PropCard({ prop }: { prop: Prop }) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <Badge variant="accent">Prop</Badge>
        <CardTitle>{prop.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <Line label="Role in Story" value={prop.role_in_story} />
        <Line label="Description" value={prop.description} />
        <TokenLine label="Visual Rules" items={prop.visual_rules} />
        <TokenLine label="Avoid" items={prop.avoid} />
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
